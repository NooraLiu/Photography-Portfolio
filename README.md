# Nora Liu — Photography Portfolio

A personal photography portfolio website with an interactive globe view, curated gallery, and a private owner dashboard for managing photos.

---

## Features

### 🖼️ Portfolio Gallery
Browse a curated collection of photos organized by location and genre. Highlighted photos are featured on the main page, with a lightbox viewer for full-size images.

### 🌍 Globe View
An interactive 3D globe displays every photo location as a pin. Drag to rotate, scroll to zoom, and click a marker to view the photos taken there. A sidebar lists all locations with photo counts and preview thumbnails.

![Globe View](Screenshot%202026-07-27%20at%2011.45.17%20AM.png)

### 📤 Upload Photos (Owner Only)
The owner dashboard lets you batch-import photos by drag & drop. GPS coordinates are automatically extracted from EXIF data, so each photo is instantly placed on the globe without any manual entry.

![Upload Photos](Screenshot%202026-07-27%20at%2011.43.04%20AM.png)

### ✏️ Edit Albums (Owner Only)
Browse all photos grouped by location. Select one or many photos to:
- **Highlight / Unhighlight** — control which photos appear featured in the public gallery
- **Change Genre** — recategorize photos (Wildlife, Landscape, etc.)
- **Change Location** — reassign photos to a different location
- **Delete** — permanently remove photos

Sort the entire gallery by location or shuffle it for a fresh look.

![Edit Albums](Screenshot%202026-07-27%20at%2011.43.44%20AM.png)

---

## Running Locally

**Requirements:** Python 3

```bash
python3 server.py
```

Then open [http://localhost:8080](http://localhost:8080) in your browser.

The owner dashboard is available at [http://localhost:8080/owner.html](http://localhost:8080/owner.html).

---

## Project Structure

```
index.html          # Public portfolio & about/contact pages
earth.html          # Interactive globe view
owner.html          # Owner dashboard (upload + edit albums)
edit-album.html     # Edit albums tab
script.js           # Frontend logic
styles.css          # Styles
server.py           # Python HTTP server with upload API
gallery-data.json   # Photo metadata store
uploads/            # Uploaded original images
  thumbs/           # Small thumbnails
  thumbs300/        # Medium thumbnails
```
