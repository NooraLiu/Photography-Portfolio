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

PORT = 8080
UPLOAD_DIR = "uploads"
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
        else:
            self.send_error(404)
    
    def do_PUT(self):
        if '/api/images/' in self.path and self.path.endswith('/location'):
            # Extract image ID from path like /api/images/123/location
            parts = self.path.split('/')
            image_id = parts[-2]
            self.handle_update_location(image_id)
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
