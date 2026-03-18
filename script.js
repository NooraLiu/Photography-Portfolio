// ===== DOM Elements =====
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const fileInput = document.getElementById('fileInput');
const photoSelectArea = document.getElementById('photoSelectArea');
const photoSelectPrompt = document.getElementById('photoSelectPrompt');
const photoPreviewContainer = document.getElementById('photoPreviewContainer');
const photoPreview = document.getElementById('photoPreview');
const changePhotoBtn = document.getElementById('changePhotoBtn');
const citySearchInput = document.getElementById('citySearchInput');
const cityAutocompleteResults = document.getElementById('cityAutocompleteResults');
const categorySelect = document.getElementById('categorySelect');
const coordDisplay = document.getElementById('coordDisplay');
const selectedLocationName = document.getElementById('selectedLocationName');
const coordValues = document.getElementById('coordValues');
const addPhotoBtn = document.getElementById('addPhotoBtn');
const galleryGrid = document.getElementById('gallery-grid');
const filterBtns = document.querySelectorAll('.filter-btn');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const contactForm = document.getElementById('contactForm');

// ===== State =====
let currentPhoto = null; // { file, preview }
let selectedCity = null; // { name, country, lat, lng }
let galleryImages = [];
let currentImageIndex = 0;

// ===== Navigation =====
// Scroll effect for navbar
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// ===== World Cities Database =====
const worldCities = [
    // Africa
    { name: "Dar es Salaam", country: "Tanzania", lat: -6.7924, lng: 39.2083, icon: "🦁" },
    { name: "Serengeti", country: "Tanzania", lat: -2.3333, lng: 34.8333, icon: "🦁" },
    { name: "Zanzibar", country: "Tanzania", lat: -6.1659, lng: 39.2026, icon: "🏝️" },
    { name: "Mount Kilimanjaro", country: "Tanzania", lat: -3.0674, lng: 37.3556, icon: "🏔️" },
    { name: "Ngorongoro", country: "Tanzania", lat: -3.2, lng: 35.5, icon: "🦁" },
    { name: "Cairo", country: "Egypt", lat: 30.0444, lng: 31.2357, icon: "🏛️" },
    { name: "Cape Town", country: "South Africa", lat: -33.9249, lng: 18.4241, icon: "🏔️" },
    { name: "Johannesburg", country: "South Africa", lat: -26.2041, lng: 28.0473, icon: "🏙️" },
    { name: "Marrakech", country: "Morocco", lat: 31.6295, lng: -7.9811, icon: "🕌" },
    { name: "Nairobi", country: "Kenya", lat: -1.2921, lng: 36.8219, icon: "🦁" },
    { name: "Masai Mara", country: "Kenya", lat: -1.4061, lng: 35.0, icon: "🦁" },
    { name: "Victoria Falls", country: "Zimbabwe", lat: -17.9243, lng: 25.8572, icon: "💧" },
    // Europe
    { name: "Paris", country: "France", lat: 48.8566, lng: 2.3522, icon: "🗼" },
    { name: "Nice", country: "France", lat: 43.7102, lng: 7.2620, icon: "🏖️" },
    { name: "London", country: "United Kingdom", lat: 51.5074, lng: -0.1278, icon: "🎡" },
    { name: "Edinburgh", country: "United Kingdom", lat: 55.9533, lng: -3.1883, icon: "🏰" },
    { name: "Rome", country: "Italy", lat: 41.9028, lng: 12.4964, icon: "🏛️" },
    { name: "Venice", country: "Italy", lat: 45.4408, lng: 12.3155, icon: "🚣" },
    { name: "Florence", country: "Italy", lat: 43.7696, lng: 11.2558, icon: "🎨" },
    { name: "Milan", country: "Italy", lat: 45.4642, lng: 9.1900, icon: "👗" },
    { name: "Barcelona", country: "Spain", lat: 41.3851, lng: 2.1734, icon: "🏖️" },
    { name: "Madrid", country: "Spain", lat: 40.4168, lng: -3.7038, icon: "🏛️" },
    { name: "Seville", country: "Spain", lat: 37.3891, lng: -5.9845, icon: "💃" },
    { name: "Amsterdam", country: "Netherlands", lat: 52.3676, lng: 4.9041, icon: "🚲" },
    { name: "Berlin", country: "Germany", lat: 52.5200, lng: 13.4050, icon: "🏙️" },
    { name: "Munich", country: "Germany", lat: 48.1351, lng: 11.5820, icon: "🍺" },
    { name: "Prague", country: "Czech Republic", lat: 50.0755, lng: 14.4378, icon: "🏰" },
    { name: "Vienna", country: "Austria", lat: 48.2082, lng: 16.3738, icon: "🎵" },
    { name: "Lisbon", country: "Portugal", lat: 38.7223, lng: -9.1393, icon: "🚃" },
    { name: "Athens", country: "Greece", lat: 37.9838, lng: 23.7275, icon: "🏛️" },
    { name: "Santorini", country: "Greece", lat: 36.3932, lng: 25.4615, icon: "🏝️" },
    { name: "Istanbul", country: "Turkey", lat: 41.0082, lng: 28.9784, icon: "🕌" },
    { name: "Moscow", country: "Russia", lat: 55.7558, lng: 37.6173, icon: "🏛️" },
    { name: "St Petersburg", country: "Russia", lat: 59.9311, lng: 30.3609, icon: "🏛️" },
    { name: "Zurich", country: "Switzerland", lat: 47.3769, lng: 8.5417, icon: "🏔️" },
    { name: "Geneva", country: "Switzerland", lat: 46.2044, lng: 6.1432, icon: "⛲" },
    { name: "Reykjavik", country: "Iceland", lat: 64.1466, lng: -21.9426, icon: "🌋" },
    { name: "Dublin", country: "Ireland", lat: 53.3498, lng: -6.2603, icon: "🍀" },
    { name: "Copenhagen", country: "Denmark", lat: 55.6761, lng: 12.5683, icon: "🧜" },
    { name: "Stockholm", country: "Sweden", lat: 59.3293, lng: 18.0686, icon: "👑" },
    { name: "Oslo", country: "Norway", lat: 59.9139, lng: 10.7522, icon: "🏔️" },
    { name: "Helsinki", country: "Finland", lat: 60.1699, lng: 24.9384, icon: "❄️" },
    // Asia
    { name: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503, icon: "🗼" },
    { name: "Kyoto", country: "Japan", lat: 35.0116, lng: 135.7681, icon: "⛩️" },
    { name: "Osaka", country: "Japan", lat: 34.6937, lng: 135.5023, icon: "🏯" },
    { name: "Beijing", country: "China", lat: 39.9042, lng: 116.4074, icon: "🏯" },
    { name: "Shanghai", country: "China", lat: 31.2304, lng: 121.4737, icon: "🏙️" },
    { name: "Hong Kong", country: "China", lat: 22.3193, lng: 114.1694, icon: "🌃" },
    { name: "Seoul", country: "South Korea", lat: 37.5665, lng: 126.9780, icon: "🏙️" },
    { name: "Bangkok", country: "Thailand", lat: 13.7563, lng: 100.5018, icon: "🛕" },
    { name: "Chiang Mai", country: "Thailand", lat: 18.7883, lng: 98.9853, icon: "🛕" },
    { name: "Phuket", country: "Thailand", lat: 7.8804, lng: 98.3923, icon: "🏝️" },
    { name: "Singapore", country: "Singapore", lat: 1.3521, lng: 103.8198, icon: "🦁" },
    { name: "Bali", country: "Indonesia", lat: -8.3405, lng: 115.0920, icon: "🏝️" },
    { name: "Mumbai", country: "India", lat: 19.0760, lng: 72.8777, icon: "🏙️" },
    { name: "Delhi", country: "India", lat: 28.7041, lng: 77.1025, icon: "🕌" },
    { name: "Jaipur", country: "India", lat: 26.9124, lng: 75.7873, icon: "🏰" },
    { name: "Dubai", country: "UAE", lat: 25.2048, lng: 55.2708, icon: "🏙️" },
    { name: "Maldives", country: "Maldives", lat: 3.2028, lng: 73.2207, icon: "🏝️" },
    { name: "Hanoi", country: "Vietnam", lat: 21.0285, lng: 105.8542, icon: "🍜" },
    { name: "Ho Chi Minh City", country: "Vietnam", lat: 10.8231, lng: 106.6297, icon: "🏍️" },
    { name: "Siem Reap", country: "Cambodia", lat: 13.3671, lng: 103.8448, icon: "🛕" },
    // Americas
    { name: "New York", country: "USA", lat: 40.7128, lng: -74.0060, icon: "🗽" },
    { name: "San Francisco", country: "USA", lat: 37.7749, lng: -122.4194, icon: "🌉" },
    { name: "Los Angeles", country: "USA", lat: 34.0522, lng: -118.2437, icon: "🌴" },
    { name: "Chicago", country: "USA", lat: 41.8781, lng: -87.6298, icon: "🏙️" },
    { name: "Seattle", country: "USA", lat: 47.6062, lng: -122.3321, icon: "☕" },
    { name: "Miami", country: "USA", lat: 25.7617, lng: -80.1918, icon: "🏖️" },
    { name: "Hawaii", country: "USA", lat: 21.3069, lng: -157.8583, icon: "🌺" },
    { name: "Las Vegas", country: "USA", lat: 36.1699, lng: -115.1398, icon: "🎰" },
    { name: "Boston", country: "USA", lat: 42.3601, lng: -71.0589, icon: "🏛️" },
    { name: "Toronto", country: "Canada", lat: 43.6532, lng: -79.3832, icon: "🍁" },
    { name: "Vancouver", country: "Canada", lat: 49.2827, lng: -123.1207, icon: "🏔️" },
    { name: "Montreal", country: "Canada", lat: 45.5017, lng: -73.5673, icon: "🍁" },
    { name: "Mexico City", country: "Mexico", lat: 19.4326, lng: -99.1332, icon: "🌮" },
    { name: "Cancun", country: "Mexico", lat: 21.1619, lng: -86.8515, icon: "🏖️" },
    { name: "Rio de Janeiro", country: "Brazil", lat: -22.9068, lng: -43.1729, icon: "🏖️" },
    { name: "São Paulo", country: "Brazil", lat: -23.5505, lng: -46.6333, icon: "🏙️" },
    { name: "Buenos Aires", country: "Argentina", lat: -34.6037, lng: -58.3816, icon: "💃" },
    { name: "Lima", country: "Peru", lat: -12.0464, lng: -77.0428, icon: "🏛️" },
    { name: "Machu Picchu", country: "Peru", lat: -13.1631, lng: -72.5450, icon: "🏔️" },
    { name: "Havana", country: "Cuba", lat: 23.1136, lng: -82.3666, icon: "🚗" },
    // Oceania
    { name: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093, icon: "🦘" },
    { name: "Melbourne", country: "Australia", lat: -37.8136, lng: 144.9631, icon: "🎭" },
    { name: "Auckland", country: "New Zealand", lat: -36.8509, lng: 174.7645, icon: "🏔️" },
    { name: "Queenstown", country: "New Zealand", lat: -45.0312, lng: 168.6626, icon: "🏔️" },
    { name: "Fiji", country: "Fiji", lat: -17.7134, lng: 178.0650, icon: "🏝️" }
];

// ===== Photo Selection =====
if (photoSelectArea) {
    photoSelectArea.addEventListener('click', () => {
        fileInput.click();
    });
}

if (changePhotoBtn) {
    changePhotoBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.click();
    });
}

if (fileInput) {
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                currentPhoto = {
                    file: file,
                    preview: e.target.result
                };
                if (photoPreview) photoPreview.src = e.target.result;
                if (photoSelectPrompt) photoSelectPrompt.style.display = 'none';
                if (photoPreviewContainer) photoPreviewContainer.style.display = 'block';
                updateAddButton();
            };
            reader.readAsDataURL(file);
        }
    });
}

// ===== City Autocomplete =====
if (citySearchInput) {
    citySearchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        if (searchTerm.length < 2) {
            cityAutocompleteResults.classList.remove('active');
            return;
        }
        
        const matches = worldCities.filter(city => 
            city.name.toLowerCase().includes(searchTerm) ||
            city.country.toLowerCase().includes(searchTerm)
        ).slice(0, 8);
        
        if (matches.length === 0) {
            cityAutocompleteResults.classList.remove('active');
            return;
        }
        
        cityAutocompleteResults.innerHTML = matches.map(city => `
            <div class="autocomplete-item" data-city='${JSON.stringify(city)}'>
                <span class="city-icon">${city.icon}</span>
                <div class="city-info">
                    <div class="city-name">${city.name}</div>
                    <div class="city-country">${city.country}</div>
                </div>
                <div class="city-coords">${city.lat.toFixed(2)}°, ${city.lng.toFixed(2)}°</div>
            </div>
        `).join('');
        cityAutocompleteResults.classList.add('active');
    });

    citySearchInput.addEventListener('focus', () => {
        if (citySearchInput.value.length >= 2) {
            citySearchInput.dispatchEvent(new Event('input'));
        }
    });

    citySearchInput.addEventListener('blur', () => {
        setTimeout(() => {
            cityAutocompleteResults.classList.remove('active');
        }, 200);
    });
}

if (cityAutocompleteResults) {
    cityAutocompleteResults.addEventListener('click', (e) => {
        const item = e.target.closest('.autocomplete-item');
        if (item) {
            const city = JSON.parse(item.dataset.city);
            selectCity(city);
        }
    });
}

function selectCity(city) {
    selectedCity = city;
    if (citySearchInput) citySearchInput.value = `${city.name}, ${city.country}`;
    if (cityAutocompleteResults) cityAutocompleteResults.classList.remove('active');
    
    // Show coordinate display
    if (selectedLocationName) selectedLocationName.textContent = `${city.name}, ${city.country}`;
    if (coordValues) coordValues.textContent = `(${city.lat.toFixed(4)}°, ${city.lng.toFixed(4)}°)`;
    if (coordDisplay) coordDisplay.style.display = 'block';
    
    updateAddButton();
}

// ===== Category Selection =====
if (categorySelect) {
    categorySelect.addEventListener('change', updateAddButton);
}

// ===== Update Add Button State =====
function updateAddButton() {
    if (!addPhotoBtn) return;
    const hasPhoto = currentPhoto !== null;
    const hasCity = selectedCity !== null;
    const hasCategory = categorySelect && categorySelect.value !== 'all';
    
    addPhotoBtn.disabled = !(hasPhoto && hasCity && hasCategory);
}

// ===== Add Photo to Gallery =====
if (addPhotoBtn) {
    addPhotoBtn.addEventListener('click', async () => {
        if (!currentPhoto || !selectedCity || !categorySelect || categorySelect.value === 'all') return;
        
        const formData = new FormData();
        formData.append('photos', currentPhoto.file);
        formData.append('categories', categorySelect.value);
        formData.append('locationNames', `${selectedCity.name}, ${selectedCity.country}`);
        formData.append('latitudes', selectedCity.lat);
        formData.append('longitudes', selectedCity.lng);
        
        try {
            addPhotoBtn.textContent = 'Adding...';
            addPhotoBtn.disabled = true;
            
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Add to gallery
                result.images.forEach(img => {
                    addToGallery({
                        id: img.id,
                        preview: img.path,
                        category: img.category
                    }, true);
                });
                
                // Reset form
                resetForm();
                showNotification('Photo added successfully!');
            } else {
                showNotification('Upload failed: ' + result.error);
            }
        } catch (error) {
            console.error('Upload error:', error);
            showNotification('Upload failed. Make sure the server is running!');
        } finally {
            addPhotoBtn.textContent = 'Add to Gallery';
            updateAddButton();
        }
    });
}

function resetForm() {
    currentPhoto = null;
    selectedCity = null;
    
    if (fileInput) fileInput.value = '';
    if (photoPreview) photoPreview.src = '';
    if (photoSelectPrompt) photoSelectPrompt.style.display = 'flex';
    if (photoPreviewContainer) photoPreviewContainer.style.display = 'none';
    
    if (citySearchInput) citySearchInput.value = '';
    if (coordDisplay) coordDisplay.style.display = 'none';
    
    if (categorySelect) categorySelect.value = 'all';
    
    updateAddButton();
}

// Add single image to gallery
function addToGallery(fileData, isUserUploaded = true) {
    if (!galleryGrid) return;
    
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item show';
    galleryItem.dataset.category = fileData.category || 'all';
    if (fileData.id) {
        galleryItem.dataset.id = fileData.id;
    }
    
    galleryItem.innerHTML = `
        <img src="${fileData.preview}" alt="Gallery image">
        <div class="gallery-overlay">
            <span class="view-btn">View</span>
        </div>
    `;
    
    // Insert at the beginning of the gallery
    galleryGrid.insertBefore(galleryItem, galleryGrid.firstChild);
    
    // Store reference
    const imageData = {
        element: galleryItem,
        src: fileData.preview,
        category: fileData.category || 'all',
        isUserUploaded: isUserUploaded,
        id: fileData.id
    };
    galleryImages.unshift(imageData);
    
    // Add click handler for lightbox (using element reference)
    galleryItem.addEventListener('click', () => {
        openLightboxByElement(galleryItem);
    });
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: #1a1a1a;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        z-index: 3000;
        animation: fadeIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ===== Gallery Filter =====
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.dataset.filter;
        const items = galleryGrid.querySelectorAll('.gallery-item');
        
        items.forEach(item => {
            if (filter === 'all' || item.dataset.category === filter) {
                item.classList.remove('hidden');
                item.classList.add('show');
            } else {
                item.classList.add('hidden');
                item.classList.remove('show');
            }
        });
    });
});

// ===== Lightbox =====
// Initialize gallery images from existing items
function initGalleryImages() {
    const items = galleryGrid.querySelectorAll('.gallery-item');
    items.forEach((item, index) => {
        const img = item.querySelector('img');
        galleryImages.push({
            element: item,
            src: img.src,
            category: item.dataset.category
        });
        
        item.addEventListener('click', () => {
            openLightboxByElement(item);
        });
    });
}

// Open lightbox by element reference (more reliable)
function openLightboxByElement(element) {
    const img = element.querySelector('img');
    lightboxImage.src = img.src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Find current index by element reference
    currentImageIndex = galleryImages.findIndex(g => g.element === element);
}

// Open lightbox by src (fallback)
function openLightbox(src) {
    lightboxImage.src = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Find current index - try exact match first, then partial match
    currentImageIndex = galleryImages.findIndex(img => img.src === src);
    if (currentImageIndex === -1) {
        // Try matching by the end of the path
        currentImageIndex = galleryImages.findIndex(img => 
            img.src.endsWith(src) || src.endsWith(img.src.split('/').pop())
        );
    }
    if (currentImageIndex === -1) currentImageIndex = 0;
}

// Close lightbox
function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

lightboxClose.addEventListener('click', closeLightbox);

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Navigate lightbox with slide animation
function navigateLightbox(direction) {
    const visibleImages = galleryImages.filter(img => !img.element.classList.contains('hidden'));
    
    // Find current position in visible images
    let currentVisibleIndex = -1;
    for (let i = 0; i < visibleImages.length; i++) {
        if (visibleImages[i].element.querySelector('img').src === lightboxImage.src) {
            currentVisibleIndex = i;
            break;
        }
    }
    
    // If not found, try by currentImageIndex
    if (currentVisibleIndex === -1 && currentImageIndex >= 0) {
        const currentElement = galleryImages[currentImageIndex]?.element;
        currentVisibleIndex = visibleImages.findIndex(img => img.element === currentElement);
    }
    
    if (currentVisibleIndex === -1) currentVisibleIndex = 0;
    
    let newIndex = currentVisibleIndex + direction;
    if (newIndex < 0) newIndex = visibleImages.length - 1;
    if (newIndex >= visibleImages.length) newIndex = 0;
    
    const newImage = visibleImages[newIndex];
    const newSrc = newImage.element.querySelector('img').src;
    
    // Update currentImageIndex to match
    currentImageIndex = galleryImages.findIndex(img => img.element === newImage.element);
    
    // Add slide-out animation
    const slideClass = direction > 0 ? 'slide-left' : 'slide-right';
    lightboxImage.classList.add(slideClass);
    
    // After animation, change image and slide in
    setTimeout(() => {
        lightboxImage.src = newSrc;
        lightboxImage.classList.remove(slideClass);
    }, 150);
}

lightboxPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    navigateLightbox(-1);
});

lightboxNext.addEventListener('click', (e) => {
    e.stopPropagation();
    navigateLightbox(1);
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
});

// ===== Contact Form =====
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Here you would typically send this data to a server
    console.log('Form submitted:', data);
    
    // Show success message
    showNotification('Message sent successfully!');
    
    // Reset form
    contactForm.reset();
});

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Intersection Observer for Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// ===== Load Saved Images from Server =====
async function loadSavedImages() {
    try {
        const response = await fetch('/api/images');
        const data = await response.json();
        const images = data.images || [];
        
        // Add saved images to gallery (in reverse to maintain order)
        images.reverse().forEach(img => {
            addToGallery({
                id: img.id,
                preview: img.path,
                category: img.category
            }, true);
        });
    } catch (error) {
        console.log('Running without server - images will not persist.');
    }
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    initGalleryImages();
    loadSavedImages();
});
