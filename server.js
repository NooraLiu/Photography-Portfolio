const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static(__dirname));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed!'));
    }
});

// Gallery data file path
const galleryDataPath = path.join(__dirname, 'gallery-data.json');

// Helper function to read gallery data
function readGalleryData() {
    try {
        if (fs.existsSync(galleryDataPath)) {
            const data = fs.readFileSync(galleryDataPath, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error reading gallery data:', error);
    }
    return { images: [] };
}

// Helper function to write gallery data
function writeGalleryData(data) {
    fs.writeFileSync(galleryDataPath, JSON.stringify(data, null, 2));
}

// API: Get all images
app.get('/api/images', (req, res) => {
    const data = readGalleryData();
    res.json(data.images);
});

// API: Upload images
app.post('/api/upload', upload.array('photos', 50), (req, res) => {
    try {
        const data = readGalleryData();
        const categories = req.body.categories ? 
            (Array.isArray(req.body.categories) ? req.body.categories : [req.body.categories]) : 
            [];
        
        const newImages = req.files.map((file, index) => ({
            id: Date.now() + index,
            filename: file.filename,
            path: '/uploads/' + file.filename,
            category: categories[index] || 'all',
            uploadedAt: new Date().toISOString()
        }));
        
        data.images = [...newImages, ...data.images];
        writeGalleryData(data);
        
        res.json({ success: true, images: newImages });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// API: Delete image
app.delete('/api/images/:id', (req, res) => {
    try {
        const data = readGalleryData();
        const imageId = parseInt(req.params.id);
        const image = data.images.find(img => img.id === imageId);
        
        if (image) {
            // Delete file from disk
            const filePath = path.join(__dirname, image.path);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            
            // Remove from data
            data.images = data.images.filter(img => img.id !== imageId);
            writeGalleryData(data);
            
            res.json({ success: true });
        } else {
            res.status(404).json({ success: false, error: 'Image not found' });
        }
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🎨 Photography Portfolio Server Running!`);
    console.log(`📁 Open http://localhost:${PORT} in your browser\n`);
});
