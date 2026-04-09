#!/usr/bin/env python3
"""
Photography Portfolio Server
Run with: python3 server.py
Then open: http://localhost:3000
"""

import http.server
import socketserver
import json
import os
import cgi
import uuid
from datetime import datetime
from urllib.parse import urlparse
import shutil
import random

try:
    from PIL import Image
    HAS_PIL = True
except ImportError:
    HAS_PIL = False

PORT = 8080
UPLOAD_DIR = "uploads"
THUMB_DIR = "uploads/thumbs"
THUMB_SIZE = 800
DATA_FILE = "gallery-data.json"

class PortfolioHandler(http.server.SimpleHTTPRequestHandler):
    
    def do_GET(self):
        parsed_path = urlparse(self.path)
        
        if parsed_path.path == '/api/images':
            self.send_json_response({'images': self.get_images()})
        else:
            super().do_GET()
    
    def do_POST(self):
        if self.path == '/api/upload':
            self.handle_upload()
        elif self.path == '/api/generate-thumbnails':
            self.handle_generate_thumbnails()
        elif self.path == '/api/shuffle':
            self.handle_shuffle()
        elif self.path == '/api/sort':
            self.handle_sort()
        else:
            self.send_error(404)
    
    def do_PUT(self):
        if '/api/images/' in self.path and self.path.endswith('/location'):
            parts = self.path.split('/')
            image_id = parts[-2]
            self.handle_update_location(image_id)
        elif '/api/images/' in self.path and self.path.endswith('/highlight'):
            parts = self.path.split('/')
            image_id = parts[-2]
            self.handle_toggle_highlight(image_id)
        elif self.path == '/api/images/bulk-highlight':
            self.handle_bulk_highlight()
        elif self.path == '/api/images/bulk-delete':
            self.handle_bulk_delete()
        elif self.path == '/api/images/bulk-update':
            self.handle_bulk_update()
        else:
            self.send_error(404)
    
    def do_DELETE(self):
        if self.path.startswith('/api/images/'):
            image_id = self.path.split('/')[-1]
            self.handle_delete(image_id)
        else:
            self.send_error(404)
    
    def handle_upload(self):
        content_type = self.headers['Content-Type']
        
        if 'multipart/form-data' not in content_type:
            self.send_error(400, "Expected multipart/form-data")
            return
        
        # Parse multipart form data
        form = cgi.FieldStorage(
            fp=self.rfile,
            headers=self.headers,
            environ={
                'REQUEST_METHOD': 'POST',
                'CONTENT_TYPE': content_type,
            }
        )
        
        # Create uploads directory if it doesn't exist
        if not os.path.exists(UPLOAD_DIR):
            os.makedirs(UPLOAD_DIR)
        if not os.path.exists(THUMB_DIR):
            os.makedirs(THUMB_DIR)
        
        # Get categories
        categories = form.getlist('categories')
        if not categories:
            categories = []
        
        # Get photo names
        photo_names = form.getlist('photoNames')
        if not photo_names:
            photo_names = []
        
        # Get location data
        location_names = form.getlist('locationNames')
        if not location_names:
            location_names = []
        
        latitudes = form.getlist('latitudes')
        if not latitudes:
            latitudes = []
        
        longitudes = form.getlist('longitudes')
        if not longitudes:
            longitudes = []
        
        # Process uploaded files
        new_images = []
        photos = form['photos'] if 'photos' in form else []
        
        # Handle single or multiple files
        if not isinstance(photos, list):
            photos = [photos]
        
        for i, photo in enumerate(photos):
            if photo.filename:
                # Generate unique filename
                ext = os.path.splitext(photo.filename)[1].lower()
                unique_name = f"{uuid.uuid4().hex}{ext}"
                filepath = os.path.join(UPLOAD_DIR, unique_name)
                
                # Save file
                with open(filepath, 'wb') as f:
                    f.write(photo.file.read())
                
                # Generate thumbnail
                thumb_path = self.create_thumbnail(filepath, unique_name)
                
                # Get data for this image
                category = categories[i] if i < len(categories) else 'all'
                photo_name = photo_names[i] if i < len(photo_names) else ''
                location_name = location_names[i] if i < len(location_names) else ''
                
                # Parse latitude and longitude
                lat = None
                lng = None
                if i < len(latitudes) and latitudes[i]:
                    try:
                        lat = float(latitudes[i])
                    except (ValueError, TypeError):
                        pass
                if i < len(longitudes) and longitudes[i]:
                    try:
                        lng = float(longitudes[i])
                    except (ValueError, TypeError):
                        pass
                
                # Create image record
                image_data = {
                    'id': int(datetime.now().timestamp() * 1000) + i,
                    'filename': unique_name,
                    'path': f'/uploads/{unique_name}',
                    'thumbnailPath': thumb_path,
                    'category': category,
                    'photoName': photo_name,
                    'locationName': location_name,
                    'latitude': lat,
                    'longitude': lng,
                    'uploadedAt': datetime.now().isoformat()
                }
                new_images.append(image_data)
        
        # Save to data file
        data = self.read_data()
        data['images'] = new_images + data['images']
        self.write_data(data)
        
        self.send_json_response({'success': True, 'images': new_images})
    
    def handle_delete(self, image_id):
        try:
            image_id = int(image_id)
            data = self.read_data()
            
            # Find and remove image
            image = None
            for img in data['images']:
                if img['id'] == image_id:
                    image = img
                    break
            
            if image:
                # Delete file
                filepath = os.path.join(os.getcwd(), image['path'].lstrip('/'))
                if os.path.exists(filepath):
                    os.remove(filepath)
                
                # Delete thumbnail
                thumb = image.get('thumbnailPath', '')
                if thumb:
                    thumbpath = os.path.join(os.getcwd(), thumb.lstrip('/'))
                    if os.path.exists(thumbpath):
                        os.remove(thumbpath)
                
                # Remove from data
                data['images'] = [img for img in data['images'] if img['id'] != image_id]
                self.write_data(data)
                
                self.send_json_response({'success': True})
            else:
                self.send_json_response({'success': False, 'error': 'Image not found'}, 404)
        except Exception as e:
            self.send_json_response({'success': False, 'error': str(e)}, 500)
    
    def handle_update_location(self, image_id):
        try:
            image_id = int(image_id)
            
            # Read request body
            content_length = int(self.headers['Content-Length'])
            body = self.rfile.read(content_length)
            location_data = json.loads(body.decode('utf-8'))
            
            # Update image data
            data = self.read_data()
            image_found = False
            
            for img in data['images']:
                if img['id'] == image_id:
                    img['locationName'] = location_data.get('locationName', '')
                    img['latitude'] = location_data.get('latitude')
                    img['longitude'] = location_data.get('longitude')
                    image_found = True
                    break
            
            if image_found:
                self.write_data(data)
                self.send_json_response({'success': True})
            else:
                self.send_json_response({'success': False, 'error': 'Image not found'}, 404)
        except Exception as e:
            self.send_json_response({'success': False, 'error': str(e)}, 500)
    
    def handle_toggle_highlight(self, image_id):
        try:
            image_id = int(image_id)
            content_length = int(self.headers['Content-Length'])
            body = self.rfile.read(content_length)
            highlight_data = json.loads(body.decode('utf-8'))
            
            data = self.read_data()
            for img in data['images']:
                if img['id'] == image_id:
                    img['highlight'] = highlight_data.get('highlight', False)
                    self.write_data(data)
                    self.send_json_response({'success': True})
                    return
            self.send_json_response({'success': False, 'error': 'Image not found'}, 404)
        except Exception as e:
            self.send_json_response({'success': False, 'error': str(e)}, 500)
    
    def handle_bulk_highlight(self):
        try:
            content_length = int(self.headers['Content-Length'])
            body = self.rfile.read(content_length)
            req = json.loads(body.decode('utf-8'))
            ids = req.get('ids', [])
            highlight = req.get('highlight', True)
            
            data = self.read_data()
            updated = 0
            for img in data['images']:
                if img['id'] in ids:
                    img['highlight'] = highlight
                    updated += 1
            self.write_data(data)
            self.send_json_response({'success': True, 'updated': updated})
        except Exception as e:
            self.send_json_response({'success': False, 'error': str(e)}, 500)
    
    def handle_bulk_update(self):
        try:
            content_length = int(self.headers['Content-Length'])
            body = self.rfile.read(content_length)
            req = json.loads(body.decode('utf-8'))
            ids = req.get('ids', [])
            updates = req.get('updates', {})
            
            allowed_fields = {'category', 'locationName', 'latitude', 'longitude'}
            filtered = {k: v for k, v in updates.items() if k in allowed_fields}
            
            data = self.read_data()
            updated = 0
            for img in data['images']:
                if img['id'] in ids:
                    img.update(filtered)
                    updated += 1
            self.write_data(data)
            self.send_json_response({'success': True, 'updated': updated})
        except Exception as e:
            self.send_json_response({'success': False, 'error': str(e)}, 500)
    
    def handle_bulk_delete(self):
        try:
            content_length = int(self.headers['Content-Length'])
            body = self.rfile.read(content_length)
            req = json.loads(body.decode('utf-8'))
            ids = req.get('ids', [])
            
            data = self.read_data()
            to_delete = [img for img in data['images'] if img['id'] in ids]
            for img in to_delete:
                filepath = os.path.join(os.getcwd(), img['path'].lstrip('/'))
                if os.path.exists(filepath):
                    os.remove(filepath)
                thumb = img.get('thumbnailPath', '')
                if thumb:
                    thumbpath = os.path.join(os.getcwd(), thumb.lstrip('/'))
                    if os.path.exists(thumbpath):
                        os.remove(thumbpath)
            data['images'] = [img for img in data['images'] if img['id'] not in ids]
            self.write_data(data)
            self.send_json_response({'success': True, 'deleted': len(to_delete)})
        except Exception as e:
            self.send_json_response({'success': False, 'error': str(e)}, 500)
    
    def handle_shuffle(self):
        try:
            data = self.read_data()
            random.shuffle(data['images'])
            self.write_data(data)
            self.send_json_response({'success': True})
        except Exception as e:
            self.send_json_response({'success': False, 'error': str(e)}, 500)
    
    def handle_sort(self):
        try:
            data = self.read_data()
            data['images'].sort(key=lambda img: (img.get('locationName', ''), img.get('uploadedAt', '')))
            self.write_data(data)
            self.send_json_response({'success': True})
        except Exception as e:
            self.send_json_response({'success': False, 'error': str(e)}, 500)
    
    def get_images(self):
        data = self.read_data()
        return data.get('images', [])
    
    def read_data(self):
        try:
            if os.path.exists(DATA_FILE):
                with open(DATA_FILE, 'r') as f:
                    return json.load(f)
        except:
            pass
        return {'images': []}
    
    def write_data(self, data):
        with open(DATA_FILE, 'w') as f:
            json.dump(data, f, indent=2)
    
    def send_json_response(self, data, status=200):
        response = json.dumps(data).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', len(response))
        self.end_headers()
        self.wfile.write(response)
    
    @staticmethod
    def create_thumbnail(filepath, filename):
        """Create a thumbnail and return its URL path."""
        if not HAS_PIL:
            return ''
        try:
            if not os.path.exists(THUMB_DIR):
                os.makedirs(THUMB_DIR)
            thumb_filepath = os.path.join(THUMB_DIR, filename)
            with Image.open(filepath) as img:
                img.thumbnail((THUMB_SIZE, THUMB_SIZE), Image.LANCZOS)
                # Convert RGBA to RGB for JPEG
                if img.mode in ('RGBA', 'P'):
                    img = img.convert('RGB')
                img.save(thumb_filepath, quality=80, optimize=True)
            return f'/uploads/thumbs/{filename}'
        except Exception as e:
            print(f'Thumbnail error for {filename}: {e}')
            return ''
    
    def handle_generate_thumbnails(self):
        """Generate thumbnails for all existing images that don't have one."""
        if not HAS_PIL:
            self.send_json_response({'success': False, 'error': 'Pillow not installed'}, 500)
            return
        data = self.read_data()
        generated = 0
        for img in data['images']:
            if img.get('thumbnailPath'):
                continue
            src = os.path.join(os.getcwd(), img['path'].lstrip('/'))
            if not os.path.exists(src):
                continue
            thumb_path = self.create_thumbnail(src, img['filename'])
            if thumb_path:
                img['thumbnailPath'] = thumb_path
                generated += 1
        self.write_data(data)
        self.send_json_response({'success': True, 'generated': generated})
    
    def log_message(self, format, *args):
        # Custom logging
        print(f"[{datetime.now().strftime('%H:%M:%S')}] {args[0]}")


def main():
    os.chdir(os.path.dirname(os.path.abspath(__file__)) or '.')
    
    # Create uploads directory
    if not os.path.exists(UPLOAD_DIR):
        os.makedirs(UPLOAD_DIR)
    
    # Create data file if it doesn't exist
    if not os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'w') as f:
            json.dump({'images': []}, f)
    
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), PortfolioHandler) as httpd:
        print(f"\n🎨 Photography Portfolio Server Running!")
        print(f"📁 Open http://localhost:{PORT} in your browser")
        print(f"📷 Your images will be saved in the 'uploads' folder")
        print(f"\nPress Ctrl+C to stop the server\n")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\nServer stopped.")


if __name__ == "__main__":
    main()
