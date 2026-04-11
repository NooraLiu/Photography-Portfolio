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
const shutterLoader = document.getElementById('shutterLoader');
const contactForm = document.getElementById('contactForm');

// ===== State =====
let currentPhoto = null; // { file, preview }
let selectedCity = null; // { name, country, lat, lng }
let galleryImages = [];
let currentImageIndex = 0;

// ===== Navigation =====
// Scroll effect for navbar
window.addEventListener('scroll', () => {
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// Mobile menu toggle
if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
}

// Close mobile menu when clicking a link
if (navLinks) {
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger) hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// ===== World Cities Database =====
const worldCities = [
    // Africa
    { name: "Dar es Salaam", country: "Tanzania", lat: -6.7924, lng: 39.2083, icon: "🦁" },
    { name: "Serengeti", country: "Tanzania", lat: -2.3333, lng: 34.8333, icon: "🦁" },
    { name: "Zanzibar", country: "Tanzania", lat: -6.1659, lng: 39.2026, icon: "🏝️" },
    { name: "Mount Kilimanjaro", country: "Tanzania", lat: -3.0674, lng: 37.3556, icon: "🏔️" },
    { name: "Ngorongoro", country: "Tanzania", lat: -3.2, lng: 35.5, icon: "🦁" },
    { name: "Arusha", country: "Tanzania", lat: -3.3869, lng: 36.6830, icon: "🦁" },
    { name: "Cairo", country: "Egypt", lat: 30.0444, lng: 31.2357, icon: "🏛️" },
    { name: "Luxor", country: "Egypt", lat: 25.6872, lng: 32.6396, icon: "🏛️" },
    { name: "Giza", country: "Egypt", lat: 30.0131, lng: 31.2089, icon: "🏛️" },
    { name: "Alexandria", country: "Egypt", lat: 31.2001, lng: 29.9187, icon: "🏛️" },
    { name: "Cape Town", country: "South Africa", lat: -33.9249, lng: 18.4241, icon: "🏔️" },
    { name: "Johannesburg", country: "South Africa", lat: -26.2041, lng: 28.0473, icon: "🏙️" },
    { name: "Durban", country: "South Africa", lat: -29.8587, lng: 31.0218, icon: "🏖️" },
    { name: "Kruger National Park", country: "South Africa", lat: -23.9884, lng: 31.5547, icon: "🦁" },
    { name: "Marrakech", country: "Morocco", lat: 31.6295, lng: -7.9811, icon: "🕌" },
    { name: "Fez", country: "Morocco", lat: 34.0181, lng: -5.0078, icon: "🕌" },
    { name: "Casablanca", country: "Morocco", lat: 33.5731, lng: -7.5898, icon: "🕌" },
    { name: "Chefchaouen", country: "Morocco", lat: 35.1688, lng: -5.2636, icon: "🎨" },
    { name: "Nairobi", country: "Kenya", lat: -1.2921, lng: 36.8219, icon: "🦁" },
    { name: "Masai Mara", country: "Kenya", lat: -1.4061, lng: 35.0, icon: "🦁" },
    { name: "Mombasa", country: "Kenya", lat: -4.0435, lng: 39.6682, icon: "🏖️" },
    { name: "Victoria Falls", country: "Zimbabwe", lat: -17.9243, lng: 25.8572, icon: "💧" },
    { name: "Addis Ababa", country: "Ethiopia", lat: 9.0250, lng: 38.7469, icon: "🏙️" },
    { name: "Accra", country: "Ghana", lat: 5.6037, lng: -0.1870, icon: "🏙️" },
    { name: "Lagos", country: "Nigeria", lat: 6.5244, lng: 3.3792, icon: "🏙️" },
    { name: "Tunis", country: "Tunisia", lat: 36.8065, lng: 10.1815, icon: "🕌" },
    { name: "Windhoek", country: "Namibia", lat: -22.5609, lng: 17.0658, icon: "🏜️" },
    { name: "Sossusvlei", country: "Namibia", lat: -24.7275, lng: 15.2993, icon: "🏜️" },
    { name: "Stone Town", country: "Tanzania", lat: -6.1622, lng: 39.1921, icon: "🏛️" },
    { name: "Okavango Delta", country: "Botswana", lat: -19.2833, lng: 22.9, icon: "🐘" },
    { name: "Chobe", country: "Botswana", lat: -18.5669, lng: 25.1523, icon: "🐘" },
    { name: "Kigali", country: "Rwanda", lat: -1.9403, lng: 29.8739, icon: "🏙️" },
    { name: "Kampala", country: "Uganda", lat: 0.3476, lng: 32.5825, icon: "🏙️" },
    { name: "Dakar", country: "Senegal", lat: 14.7167, lng: -17.4677, icon: "🏖️" },
    { name: "Amboseli", country: "Kenya", lat: -2.6527, lng: 37.2606, icon: "🐘" },
    { name: "Tsavo", country: "Kenya", lat: -2.9833, lng: 38.4667, icon: "🦁" },
    { name: "Lake Nakuru", country: "Kenya", lat: -0.3031, lng: 36.0800, icon: "🦩" },
    { name: "Samburu", country: "Kenya", lat: 0.5833, lng: 37.5333, icon: "🦁" },
    { name: "Ndutu", country: "Tanzania", lat: -2.9833, lng: 34.8667, icon: "🦁" },
    { name: "Tarangire", country: "Tanzania", lat: -4.0167, lng: 36.0167, icon: "🐘" },
    { name: "Lake Manyara", country: "Tanzania", lat: -3.5333, lng: 35.8333, icon: "🦩" },
    { name: "Ruaha", country: "Tanzania", lat: -7.5, lng: 34.9167, icon: "🦁" },
    { name: "Selous", country: "Tanzania", lat: -9.0, lng: 37.4, icon: "🦁" },
    { name: "Mikumi", country: "Tanzania", lat: -7.4, lng: 37.2, icon: "🦁" },
    { name: "Hwange", country: "Zimbabwe", lat: -18.3667, lng: 26.5, icon: "🐘" },
    { name: "South Luangwa", country: "Zambia", lat: -13.0833, lng: 31.55, icon: "🦁" },
    { name: "Lower Zambezi", country: "Zambia", lat: -15.2333, lng: 29.5333, icon: "🐘" },
    { name: "Etosha", country: "Namibia", lat: -18.8556, lng: 16.3278, icon: "🦁" },
    { name: "Bwindi", country: "Uganda", lat: -1.0478, lng: 29.6152, icon: "🦍" },
    { name: "Queen Elizabeth", country: "Uganda", lat: -0.1903, lng: 30.0014, icon: "🦁" },
    { name: "Volcanoes", country: "Rwanda", lat: -1.4833, lng: 29.5333, icon: "🦍" },
    { name: "Maasai Mara", country: "Kenya", lat: -1.5, lng: 35.1, icon: "🦁" },
    { name: "Addo Elephant", country: "South Africa", lat: -33.4500, lng: 25.7667, icon: "🐘" },
    // Europe
    { name: "Paris", country: "France", lat: 48.8566, lng: 2.3522, icon: "🗼" },
    { name: "Nice", country: "France", lat: 43.7102, lng: 7.2620, icon: "🏖️" },
    { name: "Lyon", country: "France", lat: 45.7640, lng: 4.8357, icon: "🍷" },
    { name: "Marseille", country: "France", lat: 43.2965, lng: 5.3698, icon: "🏖️" },
    { name: "Bordeaux", country: "France", lat: 44.8378, lng: -0.5792, icon: "🍷" },
    { name: "Strasbourg", country: "France", lat: 48.5734, lng: 7.7521, icon: "🏰" },
    { name: "Mont Saint-Michel", country: "France", lat: 48.6361, lng: -1.5115, icon: "🏰" },
    { name: "Provence", country: "France", lat: 43.9493, lng: 6.0679, icon: "🌻" },
    { name: "Chamonix", country: "France", lat: 45.9237, lng: 6.8694, icon: "🏔️" },
    { name: "London", country: "United Kingdom", lat: 51.5074, lng: -0.1278, icon: "🎡" },
    { name: "Edinburgh", country: "United Kingdom", lat: 55.9533, lng: -3.1883, icon: "🏰" },
    { name: "Bath", country: "United Kingdom", lat: 51.3811, lng: -2.3590, icon: "🏛️" },
    { name: "Oxford", country: "United Kingdom", lat: 51.7520, lng: -1.2577, icon: "🎓" },
    { name: "Cambridge", country: "United Kingdom", lat: 52.2053, lng: 0.1218, icon: "🎓" },
    { name: "Lake District", country: "United Kingdom", lat: 54.4609, lng: -3.0886, icon: "🏞️" },
    { name: "Cotswolds", country: "United Kingdom", lat: 51.8330, lng: -1.7833, icon: "🏡" },
    { name: "Highlands", country: "United Kingdom", lat: 57.1249, lng: -5.7185, icon: "🏔️" },
    { name: "Rome", country: "Italy", lat: 41.9028, lng: 12.4964, icon: "🏛️" },
    { name: "Venice", country: "Italy", lat: 45.4408, lng: 12.3155, icon: "🚣" },
    { name: "Florence", country: "Italy", lat: 43.7696, lng: 11.2558, icon: "🎨" },
    { name: "Milan", country: "Italy", lat: 45.4642, lng: 9.1900, icon: "👗" },
    { name: "Naples", country: "Italy", lat: 40.8518, lng: 14.2681, icon: "🍕" },
    { name: "Amalfi Coast", country: "Italy", lat: 40.6333, lng: 14.6029, icon: "🏖️" },
    { name: "Cinque Terre", country: "Italy", lat: 44.1461, lng: 9.6563, icon: "🏘️" },
    { name: "Sicily", country: "Italy", lat: 37.5994, lng: 14.0154, icon: "🌋" },
    { name: "Lake Como", country: "Italy", lat: 46.0160, lng: 9.2572, icon: "🏞️" },
    { name: "Tuscany", country: "Italy", lat: 43.3500, lng: 11.0167, icon: "🌻" },
    { name: "Sardinia", country: "Italy", lat: 40.1209, lng: 9.0129, icon: "🏝️" },
    { name: "Barcelona", country: "Spain", lat: 41.3851, lng: 2.1734, icon: "🏖️" },
    { name: "Madrid", country: "Spain", lat: 40.4168, lng: -3.7038, icon: "🏛️" },
    { name: "Seville", country: "Spain", lat: 37.3891, lng: -5.9845, icon: "💃" },
    { name: "Granada", country: "Spain", lat: 37.1773, lng: -3.5986, icon: "🏰" },
    { name: "Valencia", country: "Spain", lat: 39.4699, lng: -0.3763, icon: "🏖️" },
    { name: "San Sebastian", country: "Spain", lat: 43.3183, lng: -1.9812, icon: "🍽️" },
    { name: "Ibiza", country: "Spain", lat: 38.9067, lng: 1.4206, icon: "🏝️" },
    { name: "Mallorca", country: "Spain", lat: 39.6953, lng: 3.0176, icon: "🏝️" },
    { name: "Tenerife", country: "Spain", lat: 28.2916, lng: -16.6291, icon: "🌋" },
    { name: "Amsterdam", country: "Netherlands", lat: 52.3676, lng: 4.9041, icon: "🚲" },
    { name: "Rotterdam", country: "Netherlands", lat: 51.9244, lng: 4.4777, icon: "🏙️" },
    { name: "Berlin", country: "Germany", lat: 52.5200, lng: 13.4050, icon: "🏙️" },
    { name: "Munich", country: "Germany", lat: 48.1351, lng: 11.5820, icon: "🍺" },
    { name: "Hamburg", country: "Germany", lat: 53.5511, lng: 9.9937, icon: "🏙️" },
    { name: "Cologne", country: "Germany", lat: 50.9375, lng: 6.9603, icon: "🏛️" },
    { name: "Dresden", country: "Germany", lat: 51.0504, lng: 13.7373, icon: "🏛️" },
    { name: "Black Forest", country: "Germany", lat: 48.3000, lng: 8.1500, icon: "🌲" },
    { name: "Neuschwanstein", country: "Germany", lat: 47.5576, lng: 10.7498, icon: "🏰" },
    { name: "Prague", country: "Czech Republic", lat: 50.0755, lng: 14.4378, icon: "🏰" },
    { name: "Cesky Krumlov", country: "Czech Republic", lat: 48.8127, lng: 14.3175, icon: "🏰" },
    { name: "Vienna", country: "Austria", lat: 48.2082, lng: 16.3738, icon: "🎵" },
    { name: "Salzburg", country: "Austria", lat: 47.8095, lng: 13.0550, icon: "🎵" },
    { name: "Hallstatt", country: "Austria", lat: 47.5622, lng: 13.6493, icon: "🏞️" },
    { name: "Innsbruck", country: "Austria", lat: 47.2692, lng: 11.4041, icon: "🏔️" },
    { name: "Lisbon", country: "Portugal", lat: 38.7223, lng: -9.1393, icon: "🚃" },
    { name: "Porto", country: "Portugal", lat: 41.1579, lng: -8.6291, icon: "🍷" },
    { name: "Algarve", country: "Portugal", lat: 37.0179, lng: -7.9307, icon: "🏖️" },
    { name: "Madeira", country: "Portugal", lat: 32.6669, lng: -16.9241, icon: "🏝️" },
    { name: "Azores", country: "Portugal", lat: 37.7412, lng: -25.6756, icon: "🌋" },
    { name: "Athens", country: "Greece", lat: 37.9838, lng: 23.7275, icon: "🏛️" },
    { name: "Santorini", country: "Greece", lat: 36.3932, lng: 25.4615, icon: "🏝️" },
    { name: "Mykonos", country: "Greece", lat: 37.4467, lng: 25.3289, icon: "🏝️" },
    { name: "Crete", country: "Greece", lat: 35.2401, lng: 24.4709, icon: "🏝️" },
    { name: "Rhodes", country: "Greece", lat: 36.4341, lng: 28.2176, icon: "🏝️" },
    { name: "Meteora", country: "Greece", lat: 39.7217, lng: 21.6307, icon: "🏔️" },
    { name: "Istanbul", country: "Turkey", lat: 41.0082, lng: 28.9784, icon: "🕌" },
    { name: "Cappadocia", country: "Turkey", lat: 38.6431, lng: 34.8289, icon: "🎈" },
    { name: "Antalya", country: "Turkey", lat: 36.8969, lng: 30.7133, icon: "🏖️" },
    { name: "Pamukkale", country: "Turkey", lat: 37.9204, lng: 29.1187, icon: "💧" },
    { name: "Ephesus", country: "Turkey", lat: 37.9392, lng: 27.3417, icon: "🏛️" },
    { name: "Moscow", country: "Russia", lat: 55.7558, lng: 37.6173, icon: "🏛️" },
    { name: "St Petersburg", country: "Russia", lat: 59.9311, lng: 30.3609, icon: "🏛️" },
    { name: "Zurich", country: "Switzerland", lat: 47.3769, lng: 8.5417, icon: "🏔️" },
    { name: "Geneva", country: "Switzerland", lat: 46.2044, lng: 6.1432, icon: "⛲" },
    { name: "Interlaken", country: "Switzerland", lat: 46.6863, lng: 7.8632, icon: "🏔️" },
    { name: "Lucerne", country: "Switzerland", lat: 47.0502, lng: 8.3093, icon: "🏞️" },
    { name: "Zermatt", country: "Switzerland", lat: 46.0207, lng: 7.7491, icon: "🏔️" },
    { name: "Reykjavik", country: "Iceland", lat: 64.1466, lng: -21.9426, icon: "🌋" },
    { name: "Blue Lagoon", country: "Iceland", lat: 63.8804, lng: -22.4495, icon: "♨️" },
    { name: "Dublin", country: "Ireland", lat: 53.3498, lng: -6.2603, icon: "🍀" },
    { name: "Galway", country: "Ireland", lat: 53.2707, lng: -9.0568, icon: "🍀" },
    { name: "Cliffs of Moher", country: "Ireland", lat: 52.9715, lng: -9.4309, icon: "🏖️" },
    { name: "Copenhagen", country: "Denmark", lat: 55.6761, lng: 12.5683, icon: "🧜" },
    { name: "Stockholm", country: "Sweden", lat: 59.3293, lng: 18.0686, icon: "👑" },
    { name: "Gothenburg", country: "Sweden", lat: 57.7089, lng: 11.9746, icon: "🏙️" },
    { name: "Oslo", country: "Norway", lat: 59.9139, lng: 10.7522, icon: "🏔️" },
    { name: "Bergen", country: "Norway", lat: 60.3913, lng: 5.3221, icon: "🏔️" },
    { name: "Lofoten", country: "Norway", lat: 68.2350, lng: 14.5628, icon: "🏔️" },
    { name: "Tromso", country: "Norway", lat: 69.6492, lng: 18.9553, icon: "❄️" },
    { name: "Helsinki", country: "Finland", lat: 60.1699, lng: 24.9384, icon: "❄️" },
    { name: "Rovaniemi", country: "Finland", lat: 66.5039, lng: 25.7294, icon: "🎅" },
    { name: "Budapest", country: "Hungary", lat: 47.4979, lng: 19.0402, icon: "♨️" },
    { name: "Warsaw", country: "Poland", lat: 52.2297, lng: 21.0122, icon: "🏙️" },
    { name: "Krakow", country: "Poland", lat: 50.0647, lng: 19.9450, icon: "🏰" },
    { name: "Dubrovnik", country: "Croatia", lat: 42.6507, lng: 18.0944, icon: "🏰" },
    { name: "Split", country: "Croatia", lat: 43.5081, lng: 16.4402, icon: "🏛️" },
    { name: "Plitvice Lakes", country: "Croatia", lat: 44.8654, lng: 15.5820, icon: "💧" },
    { name: "Hvar", country: "Croatia", lat: 43.1729, lng: 16.4411, icon: "🏝️" },
    { name: "Bucharest", country: "Romania", lat: 44.4268, lng: 26.1025, icon: "🏙️" },
    { name: "Transylvania", country: "Romania", lat: 46.0500, lng: 24.9667, icon: "🏰" },
    { name: "Sofia", country: "Bulgaria", lat: 42.6977, lng: 23.3219, icon: "🏙️" },
    { name: "Ljubljana", country: "Slovenia", lat: 46.0569, lng: 14.5058, icon: "🏰" },
    { name: "Lake Bled", country: "Slovenia", lat: 46.3625, lng: 14.0938, icon: "🏞️" },
    { name: "Tallinn", country: "Estonia", lat: 59.4370, lng: 24.7536, icon: "🏰" },
    { name: "Riga", country: "Latvia", lat: 56.9496, lng: 24.1052, icon: "🏰" },
    { name: "Vilnius", country: "Lithuania", lat: 54.6872, lng: 25.2797, icon: "🏰" },
    { name: "Brussels", country: "Belgium", lat: 50.8503, lng: 4.3517, icon: "🍫" },
    { name: "Bruges", country: "Belgium", lat: 51.2093, lng: 3.2247, icon: "🏰" },
    { name: "Luxembourg City", country: "Luxembourg", lat: 49.6116, lng: 6.1319, icon: "🏰" },
    { name: "Malta", country: "Malta", lat: 35.9375, lng: 14.3754, icon: "🏝️" },
    { name: "Monaco", country: "Monaco", lat: 43.7384, lng: 7.4246, icon: "🎰" },
    { name: "Montenegro", country: "Montenegro", lat: 42.4304, lng: 19.2594, icon: "🏔️" },
    { name: "Kotor", country: "Montenegro", lat: 42.4247, lng: 18.7712, icon: "🏰" },
    { name: "Belgrade", country: "Serbia", lat: 44.7866, lng: 20.4489, icon: "🏙️" },
    // Asia
    { name: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503, icon: "🗼" },
    { name: "Kyoto", country: "Japan", lat: 35.0116, lng: 135.7681, icon: "⛩️" },
    { name: "Osaka", country: "Japan", lat: 34.6937, lng: 135.5023, icon: "🏯" },
    { name: "Hiroshima", country: "Japan", lat: 34.3853, lng: 132.4553, icon: "🏛️" },
    { name: "Nara", country: "Japan", lat: 34.6851, lng: 135.8049, icon: "🦌" },
    { name: "Hakone", country: "Japan", lat: 35.2324, lng: 139.1070, icon: "🏔️" },
    { name: "Nikko", country: "Japan", lat: 36.7500, lng: 139.5990, icon: "⛩️" },
    { name: "Sapporo", country: "Japan", lat: 43.0618, lng: 141.3545, icon: "❄️" },
    { name: "Okinawa", country: "Japan", lat: 26.3344, lng: 127.8056, icon: "🏝️" },
    { name: "Mount Fuji", country: "Japan", lat: 35.3606, lng: 138.7274, icon: "🏔️" },
    { name: "Beijing", country: "China", lat: 39.9042, lng: 116.4074, icon: "🏯" },
    { name: "Shanghai", country: "China", lat: 31.2304, lng: 121.4737, icon: "🏙️" },
    { name: "Hong Kong", country: "China", lat: 22.3193, lng: 114.1694, icon: "🌃" },
    { name: "Macau", country: "China", lat: 22.1987, lng: 113.5439, icon: "🎰" },
    { name: "Tianjin", country: "China", lat: 39.0842, lng: 117.2009, icon: "🏙️" },
    { name: "Chongqing", country: "China", lat: 29.4316, lng: 106.9123, icon: "🏙️" },
    // Provinces — capitals & major cities
    { name: "Shijiazhuang", country: "China", lat: 38.0428, lng: 114.5149, icon: "🏙️" },
    { name: "Taiyuan", country: "China", lat: 37.8706, lng: 112.5489, icon: "🏙️" },
    { name: "Shenyang", country: "China", lat: 41.8057, lng: 123.4315, icon: "🏙️" },
    { name: "Dalian", country: "China", lat: 38.9140, lng: 121.6147, icon: "🌊" },
    { name: "Changchun", country: "China", lat: 43.8171, lng: 125.3235, icon: "❄️" },
    { name: "Harbin", country: "China", lat: 45.8038, lng: 126.5350, icon: "❄️" },
    { name: "Nanjing", country: "China", lat: 32.0603, lng: 118.7969, icon: "🏛️" },
    { name: "Suzhou", country: "China", lat: 31.2990, lng: 120.5853, icon: "🏞️" },
    { name: "Wuxi", country: "China", lat: 31.4912, lng: 120.3119, icon: "🏙️" },
    { name: "Hangzhou", country: "China", lat: 30.2741, lng: 120.1551, icon: "🏞️" },
    { name: "Ningbo", country: "China", lat: 29.8683, lng: 121.5440, icon: "🌊" },
    { name: "Wenzhou", country: "China", lat: 27.9939, lng: 120.6993, icon: "🏙️" },
    { name: "Hefei", country: "China", lat: 31.8206, lng: 117.2272, icon: "🏙️" },
    { name: "Huangshan", country: "China", lat: 29.7147, lng: 118.3375, icon: "🏔️" },
    { name: "Fuzhou", country: "China", lat: 26.0745, lng: 119.2965, icon: "🏙️" },
    { name: "Xiamen", country: "China", lat: 24.4798, lng: 118.0894, icon: "🏝️" },
    { name: "Quanzhou", country: "China", lat: 24.8741, lng: 118.6757, icon: "🏛️" },
    { name: "Nanchang", country: "China", lat: 28.6820, lng: 115.8579, icon: "🏙️" },
    { name: "Jingdezhen", country: "China", lat: 29.2689, lng: 117.1784, icon: "🏺" },
    { name: "Jinan", country: "China", lat: 36.6512, lng: 116.9972, icon: "🏙️" },
    { name: "Qingdao", country: "China", lat: 36.0671, lng: 120.3826, icon: "🌊" },
    { name: "Zhengzhou", country: "China", lat: 34.7466, lng: 113.6253, icon: "🏙️" },
    { name: "Luoyang", country: "China", lat: 34.6197, lng: 112.4540, icon: "🏛️" },
    { name: "Kaifeng", country: "China", lat: 34.7972, lng: 114.3076, icon: "🏛️" },
    { name: "Wuhan", country: "China", lat: 30.5928, lng: 114.3055, icon: "🏙️" },
    { name: "Yichang", country: "China", lat: 30.6918, lng: 111.2864, icon: "🏞️" },
    { name: "Changsha", country: "China", lat: 28.2282, lng: 112.9388, icon: "🏙️" },
    { name: "Zhangjiajie", country: "China", lat: 29.1170, lng: 110.4792, icon: "🏔️" },
    { name: "Fenghuang", country: "China", lat: 27.9482, lng: 109.5996, icon: "🏮" },
    { name: "Guangzhou", country: "China", lat: 23.1291, lng: 113.2644, icon: "🏙️" },
    { name: "Shenzhen", country: "China", lat: 22.5431, lng: 114.0579, icon: "🏙️" },
    { name: "Zhuhai", country: "China", lat: 22.2710, lng: 113.5767, icon: "🌊" },
    { name: "Foshan", country: "China", lat: 23.0218, lng: 113.1219, icon: "🏙️" },
    { name: "Nanning", country: "China", lat: 22.8170, lng: 108.3665, icon: "🏙️" },
    { name: "Guilin", country: "China", lat: 25.2744, lng: 110.2990, icon: "🏞️" },
    { name: "Yangshuo", country: "China", lat: 24.7753, lng: 110.4868, icon: "🏞️" },
    { name: "Beihai", country: "China", lat: 21.4811, lng: 109.1169, icon: "🏖️" },
    { name: "Haikou", country: "China", lat: 20.0174, lng: 110.3492, icon: "🏝️" },
    { name: "Sanya", country: "China", lat: 18.2528, lng: 109.5120, icon: "🏖️" },
    { name: "Chengdu", country: "China", lat: 30.5728, lng: 104.0668, icon: "🐼" },
    { name: "Jiuzhaigou", country: "China", lat: 33.2600, lng: 103.9164, icon: "🏞️" },
    { name: "Leshan", country: "China", lat: 29.5521, lng: 103.7659, icon: "🏛️" },
    { name: "Guiyang", country: "China", lat: 26.6470, lng: 106.6302, icon: "🏙️" },
    { name: "Zunyi", country: "China", lat: 27.7254, lng: 106.9273, icon: "🏙️" },
    { name: "Kunming", country: "China", lat: 25.0389, lng: 102.7183, icon: "🌸" },
    { name: "Dali", country: "China", lat: 25.6065, lng: 100.2676, icon: "🏞️" },
    { name: "Lijiang", country: "China", lat: 26.8721, lng: 100.2299, icon: "🏔️" },
    { name: "Shangri-La", country: "China", lat: 27.8253, lng: 99.7072, icon: "🏔️" },
    { name: "Xishuangbanna", country: "China", lat: 22.0017, lng: 100.7975, icon: "🌴" },
    { name: "Lhasa", country: "China", lat: 29.6520, lng: 91.1721, icon: "🛕" },
    { name: "Shigatse", country: "China", lat: 29.2678, lng: 88.8808, icon: "🏔️" },
    { name: "Xi'an", country: "China", lat: 34.3416, lng: 108.9398, icon: "🏛️" },
    { name: "Lanzhou", country: "China", lat: 36.0611, lng: 103.8343, icon: "🏙️" },
    { name: "Dunhuang", country: "China", lat: 40.1421, lng: 94.6618, icon: "🏜️" },
    { name: "Xining", country: "China", lat: 36.6171, lng: 101.7782, icon: "🏔️" },
    { name: "Yinchuan", country: "China", lat: 38.4872, lng: 106.2309, icon: "🏙️" },
    { name: "Urumqi", country: "China", lat: 43.8256, lng: 87.6168, icon: "🏔️" },
    { name: "Kashgar", country: "China", lat: 39.4547, lng: 75.9797, icon: "🕌" },
    { name: "Turpan", country: "China", lat: 42.9513, lng: 89.1659, icon: "🏜️" },
    { name: "Hohhot", country: "China", lat: 40.8422, lng: 111.7498, icon: "🏙️" },
    { name: "Baotou", country: "China", lat: 40.6571, lng: 109.8401, icon: "🏙️" },
    { name: "Hulunbuir", country: "China", lat: 49.2122, lng: 119.7460, icon: "🌾" },
    { name: "Wuyuan", country: "China", lat: 29.2483, lng: 117.8614, icon: "🌸" },
    { name: "Pingyao", country: "China", lat: 37.1896, lng: 112.1762, icon: "🏛️" },
    { name: "Datong", country: "China", lat: 40.0763, lng: 113.3001, icon: "🏛️" },
    { name: "Changzhou", country: "China", lat: 31.8106, lng: 119.9741, icon: "🏙️" },
    { name: "Yangzhou", country: "China", lat: 32.3912, lng: 119.4133, icon: "🏞️" },
    { name: "Zhoushan", country: "China", lat: 29.9853, lng: 122.2072, icon: "🏝️" },
    { name: "Mount Emei", country: "China", lat: 29.5460, lng: 103.3324, icon: "🏔️" },
    { name: "Mount Tai", country: "China", lat: 36.2548, lng: 117.1006, icon: "🏔️" },
    { name: "Mount Hua", country: "China", lat: 34.4748, lng: 110.0890, icon: "🏔️" },
    { name: "Wuzhen", country: "China", lat: 30.7445, lng: 120.4872, icon: "🏮" },
    // Chinese provinces & autonomous regions
    { name: "Hebei", country: "China", lat: 38.0428, lng: 114.5149, icon: "🗺️" },
    { name: "Shanxi", country: "China", lat: 37.8706, lng: 112.5489, icon: "🗺️" },
    { name: "Liaoning", country: "China", lat: 41.8057, lng: 123.4315, icon: "🗺️" },
    { name: "Jilin", country: "China", lat: 43.8171, lng: 125.3235, icon: "🗺️" },
    { name: "Heilongjiang", country: "China", lat: 45.8038, lng: 126.5350, icon: "🗺️" },
    { name: "Jiangsu", country: "China", lat: 32.0603, lng: 118.7969, icon: "🗺️" },
    { name: "Zhejiang", country: "China", lat: 30.2741, lng: 120.1551, icon: "🗺️" },
    { name: "Anhui", country: "China", lat: 31.8206, lng: 117.2272, icon: "🗺️" },
    { name: "Fujian", country: "China", lat: 26.0745, lng: 119.2965, icon: "🗺️" },
    { name: "Jiangxi", country: "China", lat: 28.6820, lng: 115.8579, icon: "🗺️" },
    { name: "Shandong", country: "China", lat: 36.6512, lng: 116.9972, icon: "🗺️" },
    { name: "Henan", country: "China", lat: 34.7466, lng: 113.6253, icon: "🗺️" },
    { name: "Hubei", country: "China", lat: 30.5928, lng: 114.3055, icon: "🗺️" },
    { name: "Hunan", country: "China", lat: 28.2282, lng: 112.9388, icon: "🗺️" },
    { name: "Guangdong", country: "China", lat: 23.1291, lng: 113.2644, icon: "🗺️" },
    { name: "Hainan", country: "China", lat: 20.0174, lng: 110.3492, icon: "🏝️" },
    { name: "Sichuan", country: "China", lat: 30.5728, lng: 104.0668, icon: "🗺️" },
    { name: "Guizhou", country: "China", lat: 26.6470, lng: 106.6302, icon: "🗺️" },
    { name: "Yunnan", country: "China", lat: 25.0389, lng: 102.7183, icon: "🗺️" },
    { name: "Shaanxi", country: "China", lat: 34.3416, lng: 108.9398, icon: "🗺️" },
    { name: "Gansu", country: "China", lat: 36.0611, lng: 103.8343, icon: "🗺️" },
    { name: "Qinghai", country: "China", lat: 36.6171, lng: 101.7782, icon: "🗺️" },
    // Autonomous regions
    { name: "Guangxi", country: "China", lat: 22.8170, lng: 108.3665, icon: "🗺️" },
    { name: "Inner Mongolia", country: "China", lat: 40.8422, lng: 111.7498, icon: "🗺️" },
    { name: "Tibet", country: "China", lat: 29.6520, lng: 91.1721, icon: "🗺️" },
    { name: "Ningxia", country: "China", lat: 38.4872, lng: 106.2309, icon: "🗺️" },
    { name: "Xinjiang", country: "China", lat: 43.8256, lng: 87.6168, icon: "🗺️" },
    { name: "Taipei", country: "Taiwan", lat: 25.0330, lng: 121.5654, icon: "🏙️" },
    { name: "Jiufen", country: "Taiwan", lat: 25.1094, lng: 121.8443, icon: "🏮" },
    { name: "Seoul", country: "South Korea", lat: 37.5665, lng: 126.9780, icon: "🏙️" },
    { name: "Busan", country: "South Korea", lat: 35.1796, lng: 129.0756, icon: "🏖️" },
    { name: "Jeju", country: "South Korea", lat: 33.4996, lng: 126.5312, icon: "🏝️" },
    { name: "Bangkok", country: "Thailand", lat: 13.7563, lng: 100.5018, icon: "🛕" },
    { name: "Chiang Mai", country: "Thailand", lat: 18.7883, lng: 98.9853, icon: "🛕" },
    { name: "Phuket", country: "Thailand", lat: 7.8804, lng: 98.3923, icon: "🏝️" },
    { name: "Krabi", country: "Thailand", lat: 8.0863, lng: 98.9063, icon: "🏝️" },
    { name: "Koh Samui", country: "Thailand", lat: 9.5120, lng: 100.0136, icon: "🏝️" },
    { name: "Pai", country: "Thailand", lat: 19.3590, lng: 98.4413, icon: "🌿" },
    { name: "Ayutthaya", country: "Thailand", lat: 14.3692, lng: 100.5877, icon: "🛕" },
    { name: "Singapore", country: "Singapore", lat: 1.3521, lng: 103.8198, icon: "🦁" },
    { name: "Bali", country: "Indonesia", lat: -8.3405, lng: 115.0920, icon: "🏝️" },
    { name: "Jakarta", country: "Indonesia", lat: -6.2088, lng: 106.8456, icon: "🏙️" },
    { name: "Yogyakarta", country: "Indonesia", lat: -7.7956, lng: 110.3695, icon: "🛕" },
    { name: "Komodo Island", country: "Indonesia", lat: -8.5500, lng: 119.4833, icon: "🦎" },
    { name: "Raja Ampat", country: "Indonesia", lat: -1.0667, lng: 130.5167, icon: "🏝️" },
    { name: "Mumbai", country: "India", lat: 19.0760, lng: 72.8777, icon: "🏙️" },
    { name: "Delhi", country: "India", lat: 28.7041, lng: 77.1025, icon: "🕌" },
    { name: "Jaipur", country: "India", lat: 26.9124, lng: 75.7873, icon: "🏰" },
    { name: "Agra", country: "India", lat: 27.1767, lng: 78.0081, icon: "🕌" },
    { name: "Varanasi", country: "India", lat: 25.3176, lng: 82.9739, icon: "🛕" },
    { name: "Udaipur", country: "India", lat: 24.5854, lng: 73.7125, icon: "🏰" },
    { name: "Goa", country: "India", lat: 15.2993, lng: 74.1240, icon: "🏖️" },
    { name: "Kerala", country: "India", lat: 10.8505, lng: 76.2711, icon: "🌴" },
    { name: "Kolkata", country: "India", lat: 22.5726, lng: 88.3639, icon: "🏙️" },
    { name: "Bangalore", country: "India", lat: 12.9716, lng: 77.5946, icon: "🏙️" },
    { name: "Rishikesh", country: "India", lat: 30.0869, lng: 78.2676, icon: "🏔️" },
    { name: "Ranthambore", country: "India", lat: 26.0173, lng: 76.5026, icon: "🐯" },
    { name: "Jim Corbett", country: "India", lat: 29.5300, lng: 78.7747, icon: "🐯" },
    { name: "Bandhavgarh", country: "India", lat: 23.7233, lng: 80.9614, icon: "🐯" },
    { name: "Kaziranga", country: "India", lat: 26.5775, lng: 93.1711, icon: "🦏" },
    { name: "Dubai", country: "UAE", lat: 25.2048, lng: 55.2708, icon: "🏙️" },
    { name: "Abu Dhabi", country: "UAE", lat: 24.4539, lng: 54.3773, icon: "🕌" },
    { name: "Maldives", country: "Maldives", lat: 3.2028, lng: 73.2207, icon: "🏝️" },
    { name: "Hanoi", country: "Vietnam", lat: 21.0285, lng: 105.8542, icon: "🍜" },
    { name: "Ho Chi Minh City", country: "Vietnam", lat: 10.8231, lng: 106.6297, icon: "🏍️" },
    { name: "Ha Long Bay", country: "Vietnam", lat: 20.9101, lng: 107.1839, icon: "🏞️" },
    { name: "Hoi An", country: "Vietnam", lat: 15.8801, lng: 108.3380, icon: "🏮" },
    { name: "Da Nang", country: "Vietnam", lat: 16.0544, lng: 108.2022, icon: "🏖️" },
    { name: "Sapa", country: "Vietnam", lat: 22.3402, lng: 103.8448, icon: "🏔️" },
    { name: "Siem Reap", country: "Cambodia", lat: 13.3671, lng: 103.8448, icon: "🛕" },
    { name: "Phnom Penh", country: "Cambodia", lat: 11.5564, lng: 104.9282, icon: "🛕" },
    { name: "Luang Prabang", country: "Laos", lat: 19.8856, lng: 102.1347, icon: "🛕" },
    { name: "Kuala Lumpur", country: "Malaysia", lat: 3.1390, lng: 101.6869, icon: "🏙️" },
    { name: "Langkawi", country: "Malaysia", lat: 6.3500, lng: 99.8000, icon: "🏝️" },
    { name: "Penang", country: "Malaysia", lat: 5.4164, lng: 100.3327, icon: "🍜" },
    { name: "Manila", country: "Philippines", lat: 14.5995, lng: 120.9842, icon: "🏙️" },
    { name: "Palawan", country: "Philippines", lat: 9.8349, lng: 118.7384, icon: "🏝️" },
    { name: "Boracay", country: "Philippines", lat: 11.9674, lng: 121.9248, icon: "🏖️" },
    { name: "Cebu", country: "Philippines", lat: 10.3157, lng: 123.8854, icon: "🏝️" },
    { name: "Yangon", country: "Myanmar", lat: 16.8661, lng: 96.1951, icon: "🛕" },
    { name: "Bagan", country: "Myanmar", lat: 21.1717, lng: 94.8585, icon: "🛕" },
    { name: "Kathmandu", country: "Nepal", lat: 27.7172, lng: 85.3240, icon: "🏔️" },
    { name: "Everest Base Camp", country: "Nepal", lat: 28.0025, lng: 86.8528, icon: "🏔️" },
    { name: "Pokhara", country: "Nepal", lat: 28.2096, lng: 83.9856, icon: "🏔️" },
    { name: "Colombo", country: "Sri Lanka", lat: 6.9271, lng: 79.8612, icon: "🏝️" },
    { name: "Ella", country: "Sri Lanka", lat: 6.8667, lng: 81.0466, icon: "🏔️" },
    { name: "Sigiriya", country: "Sri Lanka", lat: 7.9570, lng: 80.7603, icon: "🏰" },
    { name: "Thimphu", country: "Bhutan", lat: 27.4716, lng: 89.6386, icon: "🏔️" },
    { name: "Ulaanbaatar", country: "Mongolia", lat: 47.8864, lng: 106.9057, icon: "🏜️" },
    { name: "Jerusalem", country: "Israel", lat: 31.7683, lng: 35.2137, icon: "🕌" },
    { name: "Tel Aviv", country: "Israel", lat: 32.0853, lng: 34.7818, icon: "🏖️" },
    { name: "Petra", country: "Jordan", lat: 30.3285, lng: 35.4444, icon: "🏛️" },
    { name: "Dead Sea", country: "Jordan", lat: 31.5, lng: 35.5, icon: "🏖️" },
    { name: "Muscat", country: "Oman", lat: 23.5880, lng: 58.3829, icon: "🕌" },
    { name: "Doha", country: "Qatar", lat: 25.2854, lng: 51.5310, icon: "🏙️" },
    { name: "Tbilisi", country: "Georgia", lat: 41.7151, lng: 44.8271, icon: "🏰" },
    { name: "Yerevan", country: "Armenia", lat: 40.1792, lng: 44.4991, icon: "🏛️" },
    { name: "Baku", country: "Azerbaijan", lat: 40.4093, lng: 49.8671, icon: "🏙️" },
    { name: "Samarkand", country: "Uzbekistan", lat: 39.6542, lng: 66.9597, icon: "🕌" },
    // Americas
    { name: "New York", country: "USA", lat: 40.7128, lng: -74.0060, icon: "🗽" },
    { name: "San Francisco", country: "USA", lat: 37.7749, lng: -122.4194, icon: "🌉" },
    { name: "Los Angeles", country: "USA", lat: 34.0522, lng: -118.2437, icon: "🌴" },
    { name: "Chicago", country: "USA", lat: 41.8781, lng: -87.6298, icon: "🏙️" },
    { name: "Seattle", country: "USA", lat: 47.6062, lng: -122.3321, icon: "☕" },
    { name: "Miami", country: "USA", lat: 25.7617, lng: -80.1918, icon: "🏖️" },
    { name: "Orlando", country: "USA", lat: 28.5383, lng: -81.3792, icon: "🎢" },
    { name: "Hawaii", country: "USA", lat: 21.3069, lng: -157.8583, icon: "🌺" },
    { name: "Las Vegas", country: "USA", lat: 36.1699, lng: -115.1398, icon: "🎰" },
    { name: "Boston", country: "USA", lat: 42.3601, lng: -71.0589, icon: "🏛️" },
    { name: "Washington DC", country: "USA", lat: 38.9072, lng: -77.0369, icon: "🏛️" },
    { name: "New Orleans", country: "USA", lat: 29.9511, lng: -90.0715, icon: "🎷" },
    { name: "Nashville", country: "USA", lat: 36.1627, lng: -86.7816, icon: "🎵" },
    { name: "Portland", country: "USA", lat: 45.5152, lng: -122.6784, icon: "🌲" },
    { name: "Austin", country: "USA", lat: 30.2672, lng: -97.7431, icon: "🎵" },
    { name: "Denver", country: "USA", lat: 39.7392, lng: -104.9903, icon: "🏔️" },
    { name: "San Diego", country: "USA", lat: 32.7157, lng: -117.1611, icon: "🏖️" },
    { name: "Grand Canyon", country: "USA", lat: 36.1069, lng: -112.1129, icon: "🏜️" },
    { name: "Yellowstone", country: "USA", lat: 44.4280, lng: -110.5885, icon: "🌋" },
    { name: "Yosemite", country: "USA", lat: 37.8651, lng: -119.5383, icon: "🏔️" },
    { name: "Alaska", country: "USA", lat: 64.2008, lng: -152.4937, icon: "🏔️" },
    { name: "Zion", country: "USA", lat: 37.2982, lng: -113.0263, icon: "🏜️" },
    { name: "Glacier", country: "USA", lat: 48.7596, lng: -113.7870, icon: "🏔️" },
    { name: "Arches", country: "USA", lat: 38.7331, lng: -109.5925, icon: "🏜️" },
    { name: "Bryce Canyon", country: "USA", lat: 37.5930, lng: -112.1871, icon: "🏜️" },
    { name: "Joshua Tree", country: "USA", lat: 33.8734, lng: -115.9010, icon: "🏜️" },
    { name: "Acadia", country: "USA", lat: 44.3386, lng: -68.2733, icon: "🌲" },
    { name: "Olympic", country: "USA", lat: 47.8021, lng: -123.6044, icon: "🌲" },
    { name: "Denali", country: "USA", lat: 63.1148, lng: -151.1926, icon: "🏔️" },
    { name: "Rocky Mountain", country: "USA", lat: 40.3428, lng: -105.6836, icon: "🏔️" },
    { name: "Great Smoky Mountains", country: "USA", lat: 35.6118, lng: -83.4895, icon: "🌲" },
    { name: "Death Valley", country: "USA", lat: 36.5323, lng: -116.9325, icon: "🏜️" },
    { name: "Everglades", country: "USA", lat: 25.2866, lng: -80.8987, icon: "🐊" },
    { name: "Sequoia", country: "USA", lat: 36.4864, lng: -118.5658, icon: "🌲" },
    { name: "Redwood", country: "USA", lat: 41.2132, lng: -124.0046, icon: "🌲" },
    { name: "Badlands", country: "USA", lat: 43.8554, lng: -102.3397, icon: "🏜️" },
    { name: "Grand Teton", country: "USA", lat: 43.7904, lng: -110.6818, icon: "🏔️" },
    { name: "Monument Valley", country: "USA", lat: 36.9983, lng: -110.0985, icon: "🏜️" },
    { name: "Antelope Canyon", country: "USA", lat: 36.8619, lng: -111.3743, icon: "🏜️" },
    { name: "Savannah", country: "USA", lat: 32.0809, lng: -81.0912, icon: "🌳" },
    { name: "Philadelphia", country: "USA", lat: 39.9526, lng: -75.1652, icon: "🏛️" },
    { name: "Toronto", country: "Canada", lat: 43.6532, lng: -79.3832, icon: "🍁" },
    { name: "Vancouver", country: "Canada", lat: 49.2827, lng: -123.1207, icon: "🏔️" },
    { name: "Montreal", country: "Canada", lat: 45.5017, lng: -73.5673, icon: "🍁" },
    { name: "Banff", country: "Canada", lat: 51.1784, lng: -115.5708, icon: "🏔️" },
    { name: "Jasper", country: "Canada", lat: 52.8737, lng: -117.8054, icon: "🏔️" },
    { name: "Quebec City", country: "Canada", lat: 46.8139, lng: -71.2080, icon: "🏰" },
    { name: "Niagara Falls", country: "Canada", lat: 43.0896, lng: -79.0849, icon: "💧" },
    { name: "Whistler", country: "Canada", lat: 50.1163, lng: -122.9574, icon: "🏔️" },
    { name: "Victoria", country: "Canada", lat: 48.4284, lng: -123.3656, icon: "🌸" },
    { name: "Calgary", country: "Canada", lat: 51.0447, lng: -114.0719, icon: "🏙️" },
    { name: "Yellowknife", country: "Canada", lat: 62.4540, lng: -114.3718, icon: "🌌" },
    { name: "Mexico City", country: "Mexico", lat: 19.4326, lng: -99.1332, icon: "🌮" },
    { name: "Cancun", country: "Mexico", lat: 21.1619, lng: -86.8515, icon: "🏖️" },
    { name: "Tulum", country: "Mexico", lat: 20.2115, lng: -87.4291, icon: "🏛️" },
    { name: "Oaxaca", country: "Mexico", lat: 17.0732, lng: -96.7266, icon: "🌮" },
    { name: "San Miguel de Allende", country: "Mexico", lat: 20.9144, lng: -100.7452, icon: "🎨" },
    { name: "Guadalajara", country: "Mexico", lat: 20.6597, lng: -103.3496, icon: "🌮" },
    { name: "Playa del Carmen", country: "Mexico", lat: 20.6296, lng: -87.0739, icon: "🏖️" },
    { name: "Baja California", country: "Mexico", lat: 28.8514, lng: -113.5361, icon: "🐋" },
    { name: "Rio de Janeiro", country: "Brazil", lat: -22.9068, lng: -43.1729, icon: "🏖️" },
    { name: "São Paulo", country: "Brazil", lat: -23.5505, lng: -46.6333, icon: "🏙️" },
    { name: "Salvador", country: "Brazil", lat: -12.9714, lng: -38.5124, icon: "🏖️" },
    { name: "Iguazu Falls", country: "Brazil", lat: -25.6953, lng: -54.4367, icon: "💧" },
    { name: "Fernando de Noronha", country: "Brazil", lat: -3.8547, lng: -32.4247, icon: "🏝️" },
    { name: "Amazon Rainforest", country: "Brazil", lat: -3.4653, lng: -62.2159, icon: "🌿" },
    { name: "Lencois Maranhenses", country: "Brazil", lat: -2.4833, lng: -43.1167, icon: "🏜️" },
    { name: "Chapada Diamantina", country: "Brazil", lat: -12.4333, lng: -41.35, icon: "🏞️" },
    { name: "Buenos Aires", country: "Argentina", lat: -34.6037, lng: -58.3816, icon: "💃" },
    { name: "Patagonia", country: "Argentina", lat: -41.8101, lng: -68.9063, icon: "🏔️" },
    { name: "Mendoza", country: "Argentina", lat: -32.8895, lng: -68.8458, icon: "🍷" },
    { name: "Ushuaia", country: "Argentina", lat: -54.8019, lng: -68.3030, icon: "🏔️" },
    { name: "Perito Moreno", country: "Argentina", lat: -50.4966, lng: -73.0523, icon: "🧊" },
    { name: "Lima", country: "Peru", lat: -12.0464, lng: -77.0428, icon: "🏛️" },
    { name: "Machu Picchu", country: "Peru", lat: -13.1631, lng: -72.5450, icon: "🏔️" },
    { name: "Cusco", country: "Peru", lat: -13.5319, lng: -71.9675, icon: "🏛️" },
    { name: "Sacred Valley", country: "Peru", lat: -13.3339, lng: -72.1293, icon: "🏔️" },
    { name: "Havana", country: "Cuba", lat: 23.1136, lng: -82.3666, icon: "🚗" },
    { name: "Bogota", country: "Colombia", lat: 4.7110, lng: -74.0721, icon: "🏙️" },
    { name: "Cartagena", country: "Colombia", lat: 10.3910, lng: -75.5364, icon: "🏖️" },
    { name: "Medellin", country: "Colombia", lat: 6.2442, lng: -75.5812, icon: "🏙️" },
    { name: "Santiago", country: "Chile", lat: -33.4489, lng: -70.6693, icon: "🏙️" },
    { name: "Atacama Desert", country: "Chile", lat: -23.8634, lng: -69.1328, icon: "🏜️" },
    { name: "Torres del Paine", country: "Chile", lat: -50.9423, lng: -73.4068, icon: "🏔️" },
    { name: "Easter Island", country: "Chile", lat: -27.1127, lng: -109.3497, icon: "🗿" },
    { name: "Quito", country: "Ecuador", lat: -0.1807, lng: -78.4678, icon: "🏙️" },
    { name: "Galapagos Islands", country: "Ecuador", lat: -0.9538, lng: -90.9656, icon: "🐢" },
    { name: "Cuyabeno", country: "Ecuador", lat: 0.0833, lng: -76.1833, icon: "🌿" },
    { name: "La Paz", country: "Bolivia", lat: -16.4897, lng: -68.1193, icon: "🏔️" },
    { name: "Uyuni Salt Flats", country: "Bolivia", lat: -20.1338, lng: -67.4891, icon: "🏜️" },
    { name: "Montevideo", country: "Uruguay", lat: -34.9011, lng: -56.1645, icon: "🏙️" },
    { name: "San Jose", country: "Costa Rica", lat: 9.9281, lng: -84.0907, icon: "🌿" },
    { name: "Monteverde", country: "Costa Rica", lat: 10.3155, lng: -84.8246, icon: "🌿" },
    { name: "Panama City", country: "Panama", lat: 8.9824, lng: -79.5199, icon: "🏙️" },
    { name: "Antigua", country: "Guatemala", lat: 14.5586, lng: -90.7295, icon: "🌋" },
    // Oceania
    { name: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093, icon: "🦘" },
    { name: "Melbourne", country: "Australia", lat: -37.8136, lng: 144.9631, icon: "🎭" },
    { name: "Brisbane", country: "Australia", lat: -27.4698, lng: 153.0251, icon: "🏖️" },
    { name: "Perth", country: "Australia", lat: -31.9505, lng: 115.8605, icon: "🏖️" },
    { name: "Great Barrier Reef", country: "Australia", lat: -18.2871, lng: 147.6992, icon: "🐠" },
    { name: "Uluru", country: "Australia", lat: -25.3444, lng: 131.0369, icon: "🏜️" },
    { name: "Gold Coast", country: "Australia", lat: -28.0167, lng: 153.4000, icon: "🏖️" },
    { name: "Tasmania", country: "Australia", lat: -42.0409, lng: 146.8087, icon: "🌲" },
    { name: "Great Ocean Road", country: "Australia", lat: -38.6803, lng: 143.3919, icon: "🏖️" },
    { name: "Auckland", country: "New Zealand", lat: -36.8509, lng: 174.7645, icon: "🏔️" },
    { name: "Queenstown", country: "New Zealand", lat: -45.0312, lng: 168.6626, icon: "🏔️" },
    { name: "Milford Sound", country: "New Zealand", lat: -44.6714, lng: 167.9256, icon: "🏞️" },
    { name: "Rotorua", country: "New Zealand", lat: -38.1368, lng: 176.2497, icon: "🌋" },
    { name: "Wellington", country: "New Zealand", lat: -41.2865, lng: 174.7762, icon: "🏙️" },
    { name: "Hobbiton", country: "New Zealand", lat: -37.8583, lng: 175.6830, icon: "🧙" },
    { name: "Fiordland", country: "New Zealand", lat: -45.4144, lng: 167.7182, icon: "🏞️" },
    { name: "Tongariro", country: "New Zealand", lat: -39.2007, lng: 175.5621, icon: "🌋" },
    { name: "Blue Mountains", country: "Australia", lat: -33.7150, lng: 150.3119, icon: "🏞️" },
    { name: "Kakadu", country: "Australia", lat: -12.8333, lng: 132.8833, icon: "🌿" },
    { name: "Daintree", country: "Australia", lat: -16.2500, lng: 145.4167, icon: "🌿" },
    { name: "Fiji", country: "Fiji", lat: -17.7134, lng: 178.0650, icon: "🏝️" },
    { name: "Bora Bora", country: "French Polynesia", lat: -16.5004, lng: -151.7415, icon: "🏝️" },
    { name: "Tahiti", country: "French Polynesia", lat: -17.6509, lng: -149.4260, icon: "🏝️" },
    // Antarctica
    { name: "Antarctica", country: "Antarctica", lat: -82.8628, lng: 135.0000, icon: "🧊" }
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
        <img src="${fileData.preview}" data-fullres="${fileData.fullres || fileData.preview}" alt="Gallery image" loading="lazy">
        <div class="gallery-overlay">
            <span class="view-btn">View</span>
        </div>
    `;
    
    // Fade in when loaded
    const img = galleryItem.querySelector('img');
    if (img.complete) img.classList.add('loaded');
    else img.addEventListener('load', () => img.classList.add('loaded'));

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
    
    // Hover preload: start fetching full-res the moment user hovers
    galleryItem.addEventListener('mouseenter', () => {
        const hImg = galleryItem.querySelector('img');
        const fullres = hImg && hImg.dataset.fullres;
        if (fullres && fullres !== hImg.src) {
            const p = new Image();
            p.src = fullres;
        }
    });

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
    if (!galleryGrid) return;
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

// Compute constrained display size matching .lightbox-content img CSS
// (max-width: 95vw via container, max-height: 95vh)
function computeLightboxSize(naturalWidth, naturalHeight) {
    const maxW = window.innerWidth * 0.95;
    const maxH = window.innerHeight * 0.95;
    const ratio = naturalWidth / naturalHeight;
    let w = naturalWidth, h = naturalHeight;
    if (w > maxW) { w = maxW; h = w / ratio; }
    if (h > maxH) { h = maxH; w = h * ratio; }
    return { w: Math.round(w), h: Math.round(h) };
}

// Preload full-res of adjacent images while lightbox is open
function preloadAdjacent(visibleImages, currentIdx) {
    [-1, 1].forEach(offset => {
        const adj = visibleImages[currentIdx + offset];
        if (!adj) return;
        const adjImg = adj.element.querySelector('img');
        const src = adjImg && adjImg.dataset.fullres;
        if (src) { const p = new Image(); p.src = src; }
    });
}

// Open lightbox by element reference (more reliable)
function openLightboxByElement(element) {
    const img = element.querySelector('img');
    const fullres = img.dataset.fullres || img.src;

    // Hide any stale image immediately — show only the loader
    lightboxImage.src = '';
    lightboxImage.style.opacity = '0';
    lightboxImage.style.width = '';
    lightboxImage.style.height = '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (shutterLoader) shutterLoader.classList.add('visible');

    const preload = new Image();
    preload.onload = () => {
        lightboxImage.src = fullres;
        lightboxImage.style.opacity = '1';
        if (shutterLoader) shutterLoader.classList.remove('visible');
    };
    preload.onerror = () => {
        if (shutterLoader) shutterLoader.classList.remove('visible');
    };
    preload.src = fullres;

    currentImageIndex = galleryImages.findIndex(g => g.element === element);

    // Preload adjacent images in background
    const visible = galleryImages.filter(g => !g.element.classList.contains('hidden'));
    const visIdx = visible.findIndex(g => g.element === element);
    if (visIdx !== -1) preloadAdjacent(visible, visIdx);
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
    if (shutterLoader) shutterLoader.classList.remove('visible');
}

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

if (lightbox) lightbox.addEventListener('click', (e) => {
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
        const elImg = visibleImages[i].element.querySelector('img');
        const fullres = elImg.dataset.fullres || elImg.src;
        if (fullres === lightboxImage.src) {
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
    const newImg = newImage.element.querySelector('img');
    const newSrc = newImg.dataset.fullres || newImg.src;
    // Update currentImageIndex to match
    currentImageIndex = galleryImages.findIndex(img => img.element === newImage.element);
    
    // Add slide-out animation
    const slideClass = direction > 0 ? 'slide-left' : 'slide-right';
    lightboxImage.classList.add(slideClass);
    
    // After slide-out, show thumbnail pinned to full-res display size, then swap in full-res
    setTimeout(() => {
        lightboxImage.classList.remove(slideClass);
        // Hide stale image, show only loader while new full-res loads
        lightboxImage.src = '';
        lightboxImage.style.opacity = '0';
        lightboxImage.style.width = '';
        lightboxImage.style.height = '';
        if (shutterLoader) shutterLoader.classList.add('visible');
        const preload = new Image();
        preload.onload = () => {
            lightboxImage.src = newSrc;
            lightboxImage.style.opacity = '1';
            if (shutterLoader) shutterLoader.classList.remove('visible');
        };
        preload.onerror = () => {
            if (shutterLoader) shutterLoader.classList.remove('visible');
        };
        preload.src = newSrc;
        // Preload the image after this one
        const visibleImages = galleryImages.filter(img => !img.element.classList.contains('hidden'));
        const newVisIdx = visibleImages.findIndex(img => img.element === newImage.element);
        if (newVisIdx !== -1) preloadAdjacent(visibleImages, newVisIdx);
    }, 150);
}

if (lightboxPrev) lightboxPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    navigateLightbox(-1);
});

if (lightboxNext) lightboxNext.addEventListener('click', (e) => {
    e.stopPropagation();
    navigateLightbox(1);
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
});

// ===== Contact Form =====
if (contactForm) contactForm.addEventListener('submit', (e) => {
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
// Fix absolute paths to relative for GitHub Pages compatibility
function fixPath(p) {
    return p && p.startsWith('/') ? p.substring(1) : p;
}

async function loadSavedImages() {
    try {
        let response;
        try {
            response = await fetch('/api/images');
        } catch (e) {
            response = await fetch('gallery-data.json');
        }
        if (!response.ok) response = await fetch('gallery-data.json');
        const data = await response.json();
        const images = data.images || [];
        
        // Only show highlighted images in portfolio
        const highlighted = images.filter(img => img.highlight);
        
        // Add highlighted images to gallery (in reverse to maintain order)
        highlighted.reverse().forEach(img => {
            addToGallery({
                id: img.id,
                preview: fixPath(img.thumbnailPath || img.path),
                fullres: fixPath(img.path),
                category: img.category
            }, true);
        });

        // No background preload — hover preload and adjacent preload handle it
    } catch (error) {
        console.log('Running without server - images will not persist.');
    }
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    initGalleryImages();
    loadSavedImages();
    // initBatchImport runs if batch import DOM elements exist (e.g. on owner.html)
    initBatchImport();
});

// ===== EXIF GPS Extraction =====
function extractEXIF(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const view = new DataView(e.target.result);
            // Check JPEG SOI marker
            if (view.getUint16(0, false) !== 0xFFD8) { resolve(null); return; }
            
            let offset = 2;
            while (offset < view.byteLength - 2) {
                const marker = view.getUint16(offset, false);
                offset += 2;
                // APP1 marker (EXIF)
                if (marker === 0xFFE1) {
                    const length = view.getUint16(offset, false);
                    const exifData = parseEXIFBlock(view, offset + 2, length - 2);
                    resolve(exifData);
                    return;
                } else if ((marker & 0xFF00) === 0xFF00) {
                    offset += view.getUint16(offset, false);
                } else {
                    break;
                }
            }
            resolve(null);
        };
        reader.readAsArrayBuffer(file.slice(0, 256 * 1024)); // Read first 256KB
    });
}

function parseEXIFBlock(view, start, length) {
    // Check "Exif\0\0"
    const exifHeader = String.fromCharCode(
        view.getUint8(start), view.getUint8(start+1),
        view.getUint8(start+2), view.getUint8(start+3)
    );
    if (exifHeader !== 'Exif') return null;
    
    const tiffOffset = start + 6;
    const byteOrder = view.getUint16(tiffOffset, false);
    const littleEndian = byteOrder === 0x4949; // II = little endian
    
    // Verify TIFF magic
    if (view.getUint16(tiffOffset + 2, littleEndian) !== 0x002A) return null;
    
    const firstIFDOffset = view.getUint32(tiffOffset + 4, littleEndian);
    
    // Parse IFD0 to find GPS IFD pointer
    const gpsIFDPointer = findGPSIFDPointer(view, tiffOffset, firstIFDOffset, littleEndian);
    if (!gpsIFDPointer) return null;
    
    return parseGPSIFD(view, tiffOffset, gpsIFDPointer, littleEndian);
}

function findGPSIFDPointer(view, tiffOffset, ifdOffset, littleEndian) {
    const absOffset = tiffOffset + ifdOffset;
    if (absOffset + 2 > view.byteLength) return null;
    
    const entries = view.getUint16(absOffset, littleEndian);
    for (let i = 0; i < entries; i++) {
        const entryOffset = absOffset + 2 + i * 12;
        if (entryOffset + 12 > view.byteLength) break;
        
        const tag = view.getUint16(entryOffset, littleEndian);
        if (tag === 0x8825) { // GPSInfoIFDPointer
            return view.getUint32(entryOffset + 8, littleEndian);
        }
    }
    return null;
}

function parseGPSIFD(view, tiffOffset, gpsOffset, littleEndian) {
    const absOffset = tiffOffset + gpsOffset;
    if (absOffset + 2 > view.byteLength) return null;
    
    const entries = view.getUint16(absOffset, littleEndian);
    let latRef = '', lonRef = '', lat = null, lon = null;
    
    for (let i = 0; i < entries; i++) {
        const entryOffset = absOffset + 2 + i * 12;
        if (entryOffset + 12 > view.byteLength) break;
        
        const tag = view.getUint16(entryOffset, littleEndian);
        const type = view.getUint16(entryOffset + 2, littleEndian);
        const count = view.getUint32(entryOffset + 4, littleEndian);
        const valueOffset = view.getUint32(entryOffset + 8, littleEndian);
        
        if (tag === 1) { // GPSLatitudeRef
            latRef = String.fromCharCode(view.getUint8(entryOffset + 8));
        } else if (tag === 2 && type === 5 && count === 3) { // GPSLatitude
            lat = readGPSCoord(view, tiffOffset + valueOffset, littleEndian);
        } else if (tag === 3) { // GPSLongitudeRef
            lonRef = String.fromCharCode(view.getUint8(entryOffset + 8));
        } else if (tag === 4 && type === 5 && count === 3) { // GPSLongitude
            lon = readGPSCoord(view, tiffOffset + valueOffset, littleEndian);
        }
    }
    
    if (lat !== null && lon !== null) {
        if (latRef === 'S') lat = -lat;
        if (lonRef === 'W') lon = -lon;
        return { lat, lng: lon };
    }
    return null;
}

function readGPSCoord(view, offset, littleEndian) {
    if (offset + 24 > view.byteLength) return null;
    const degrees = view.getUint32(offset, littleEndian) / view.getUint32(offset + 4, littleEndian);
    const minutes = view.getUint32(offset + 8, littleEndian) / view.getUint32(offset + 12, littleEndian);
    const seconds = view.getUint32(offset + 16, littleEndian) / view.getUint32(offset + 20, littleEndian);
    return degrees + minutes / 60 + seconds / 3600;
}

// ===== Match GPS to Nearest City =====
function findNearestCity(lat, lng) {
    let minDist = Infinity;
    let nearest = null;
    for (const city of worldCities) {
        const dlat = city.lat - lat;
        const dlng = city.lng - lng;
        const dist = dlat * dlat + dlng * dlng;
        if (dist < minDist) {
            minDist = dist;
            nearest = city;
        }
    }
    // Only match if within ~200km (roughly 2 degrees)
    if (minDist < 4) return nearest;
    return null;
}

// ===== Batch Import =====
let batchItems = []; // { file, preview, gps, city, category, selected }

function initBatchImport() {
    const dropZone = document.getElementById('batchDropZone');
    const fileInput = document.getElementById('batchFileInput');
    const selectAll = document.getElementById('batchSelectAll');
    const categoryAll = document.getElementById('batchCategoryAll');
    const clearBtn = document.getElementById('batchClearBtn');
    const importBtn = document.getElementById('batchImportBtn');
    
    if (!dropZone) return;
    
    // Click to browse
    dropZone.addEventListener('click', () => fileInput.click());
    
    // Drag and drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        handleBatchFiles(e.dataTransfer.files);
    });
    
    // File input
    fileInput.addEventListener('change', (e) => {
        handleBatchFiles(e.target.files);
        fileInput.value = '';
    });
    
    // Select all
    selectAll.addEventListener('change', (e) => {
        batchItems.forEach(item => item.selected = e.target.checked);
        renderBatchPreview();
    });
    
    // Category for all
    categoryAll.addEventListener('change', (e) => {
        if (e.target.value) {
            batchItems.forEach(item => item.category = e.target.value);
            renderBatchPreview();
        }
    });
    
    // Clear all
    clearBtn.addEventListener('click', () => {
        batchItems = [];
        renderBatchPreview();
        document.getElementById('batchControls').style.display = 'none';
        // Reset batch location search
        const locInput = document.getElementById('batchLocationSearch');
        if (locInput) locInput.value = '';
        const locClear = document.getElementById('batchLocationClear');
        if (locClear) locClear.style.display = 'none';
    });
    
    // Import
    importBtn.addEventListener('click', doBatchImport);
    
    // Batch location search for all selected
    const batchLocInput = document.getElementById('batchLocationSearch');
    const batchLocResults = document.getElementById('batchLocationResults');
    const batchLocClear = document.getElementById('batchLocationClear');
    
    if (batchLocInput) {
        batchLocInput.addEventListener('input', () => {
            const term = batchLocInput.value.toLowerCase().trim();
            if (term.length < 2) {
                batchLocResults.classList.remove('active');
                return;
            }
            const matches = worldCities.filter(city =>
                city.name.toLowerCase().includes(term) ||
                city.country.toLowerCase().includes(term)
            ).slice(0, 8);
            
            if (matches.length === 0) {
                batchLocResults.classList.remove('active');
                return;
            }
            
            batchLocResults.innerHTML = matches.map(city => `
                <div class="autocomplete-item" data-city='${JSON.stringify(city)}'>
                    <span class="city-icon">${city.icon}</span>
                    <div class="city-info">
                        <div class="city-name">${city.name}</div>
                        <div class="city-country">${city.country}</div>
                    </div>
                    <div class="city-coords">${city.lat.toFixed(2)}°, ${city.lng.toFixed(2)}°</div>
                </div>
            `).join('');
            batchLocResults.classList.add('active');
        });
        
        batchLocInput.addEventListener('focus', () => {
            if (batchLocInput.value.length >= 2) {
                batchLocInput.dispatchEvent(new Event('input'));
            }
        });
        
        batchLocInput.addEventListener('blur', () => {
            setTimeout(() => batchLocResults.classList.remove('active'), 200);
        });
    }
    
    // Handle clicks on batch location results (event delegation like single import)
    if (batchLocResults) {
        batchLocResults.addEventListener('click', (e) => {
            const item = e.target.closest('.autocomplete-item');
            if (item) {
                const city = JSON.parse(item.dataset.city);
                batchItems.forEach(bi => {
                    if (bi.selected) {
                        bi.city = city;
                        bi.gps = { lat: city.lat, lng: city.lng };
                    }
                });
                batchLocInput.value = `${city.icon} ${city.name}, ${city.country}`;
                batchLocResults.classList.remove('active');
                batchLocClear.style.display = 'inline-block';
                renderBatchPreview();
            }
        });
    }
    
    if (batchLocClear) {
        batchLocClear.addEventListener('click', () => {
            batchLocInput.value = '';
            batchLocClear.style.display = 'none';
            // Clear location from selected items
            batchItems.forEach(bi => {
                if (bi.selected) {
                    bi.city = null;
                    bi.gps = null;
                }
            });
            renderBatchPreview();
        });
    }
}

async function handleBatchFiles(files) {
    const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (imageFiles.length === 0) return;
    
    document.getElementById('batchControls').style.display = 'block';
    
    for (const file of imageFiles) {
        // Create preview URL
        const preview = URL.createObjectURL(file);
        
        // Extract EXIF GPS
        let gps = null;
        let city = null;
        try {
            gps = await extractEXIF(file);
            if (gps) {
                city = findNearestCity(gps.lat, gps.lng);
            }
        } catch (e) {
            // EXIF extraction failed, that's ok
        }
        
        batchItems.push({
            file,
            preview,
            gps,
            city,
            category: 'travel',
            selected: true
        });
    }
    
    renderBatchPreview();
}

function renderBatchPreview() {
    const grid = document.getElementById('batchPreviewGrid');
    const countEl = document.getElementById('batchCount');
    const selectedCountEl = document.getElementById('batchSelectedCount');
    const importBtn = document.getElementById('batchImportBtn');
    
    const selectedCount = batchItems.filter(i => i.selected).length;
    countEl.textContent = `${batchItems.length} photos`;
    selectedCountEl.textContent = selectedCount;
    importBtn.disabled = selectedCount === 0;
    
    grid.innerHTML = batchItems.map((item, idx) => {
        const locationText = item.city 
            ? `<span class="gps-icon">📍</span> ${item.city.name}, ${item.city.country}`
            : item.gps 
                ? `<span class="gps-icon">📍</span> ${item.gps.lat.toFixed(2)}°, ${item.gps.lng.toFixed(2)}°`
                : `<span class="gps-icon">📷</span> No GPS — type city below`;
        const locationClass = item.city || item.gps ? '' : 'no-gps';
        const needsCityInput = !item.city;
        
        return `
            <div class="batch-item ${item.selected ? 'selected' : 'deselected'}" data-idx="${idx}">
                <input type="checkbox" class="batch-item-checkbox" data-idx="${idx}" ${item.selected ? 'checked' : ''}>
                <img class="batch-item-img" src="${item.preview}" alt="Photo ${idx + 1}">
                <div class="batch-item-info">
                    <div class="batch-item-location ${locationClass}">${locationText}</div>
                    ${needsCityInput ? `<div class="batch-item-city-wrapper"><input type="text" class="batch-item-city-input" data-idx="${idx}" placeholder="Search city..." autocomplete="off"></div>` : ''}
                    <select class="batch-item-category" data-idx="${idx}">
                        <option value="nature" ${item.category === 'nature' ? 'selected' : ''}>Nature</option>
                        <option value="portrait" ${item.category === 'portrait' ? 'selected' : ''}>Portrait</option>
                        <option value="travel" ${item.category === 'travel' ? 'selected' : ''}>Travel</option>
                        <option value="street" ${item.category === 'street' ? 'selected' : ''}>Street</option>
                    </select>
                </div>
            </div>
        `;
    }).join('');
    
    // Bind events
    grid.querySelectorAll('.batch-item-checkbox').forEach(cb => {
        cb.addEventListener('change', (e) => {
            e.stopPropagation();
            const idx = parseInt(e.target.dataset.idx);
            batchItems[idx].selected = e.target.checked;
            renderBatchPreview();
        });
    });
    
    grid.querySelectorAll('.batch-item-category').forEach(sel => {
        sel.addEventListener('change', (e) => {
            const idx = parseInt(e.target.dataset.idx);
            batchItems[idx].category = e.target.value;
        });
    });
    
    // City search for items without GPS
    grid.querySelectorAll('.batch-item-city-input').forEach(input => {
        const wrapper = input.closest('.batch-item-city-wrapper');
        input.addEventListener('input', (e) => {
            const idx = parseInt(e.target.dataset.idx);
            const searchTerm = e.target.value.toLowerCase().trim();
            
            // Remove existing dropdown
            const existing = wrapper.querySelector('.batch-city-suggestions');
            if (existing) existing.remove();
            
            if (searchTerm.length < 2) return;
            
            const matches = worldCities.filter(city => 
                city.name.toLowerCase().includes(searchTerm) ||
                city.country.toLowerCase().includes(searchTerm)
            ).slice(0, 5);
            
            if (matches.length === 0) return;
            
            const dropdown = document.createElement('div');
            dropdown.className = 'batch-city-suggestions active';
            dropdown.innerHTML = matches.map(city => 
                `<div class="batch-city-suggestion" data-city='${JSON.stringify(city)}'>${city.icon} ${city.name}, ${city.country}</div>`
            ).join('');
            
            wrapper.appendChild(dropdown);
            
            dropdown.querySelectorAll('.batch-city-suggestion').forEach(item => {
                item.addEventListener('mousedown', (ev) => {
                    ev.preventDefault();
                    const city = JSON.parse(item.dataset.city);
                    batchItems[idx].city = city;
                    batchItems[idx].gps = { lat: city.lat, lng: city.lng };
                    renderBatchPreview();
                });
            });
        });
        
        input.addEventListener('blur', () => {
            setTimeout(() => {
                const dropdown = wrapper.querySelector('.batch-city-suggestions');
                if (dropdown) dropdown.remove();
            }, 200);
        });
    });
}

async function doBatchImport() {
    const selectedItems = batchItems.filter(i => i.selected);
    if (selectedItems.length === 0) return;
    
    const importBtn = document.getElementById('batchImportBtn');
    const progressEl = document.getElementById('batchProgress');
    const progressFill = document.getElementById('batchProgressFill');
    const progressText = document.getElementById('batchProgressText');
    
    importBtn.disabled = true;
    progressEl.style.display = 'block';
    
    let completed = 0;
    let succeeded = 0;
    
    for (const item of selectedItems) {
        progressText.textContent = `Uploading ${completed + 1} of ${selectedItems.length}...`;
        progressFill.style.width = `${(completed / selectedItems.length) * 100}%`;
        
        const formData = new FormData();
        formData.append('photos', item.file);
        formData.append('categories', item.category);
        
        if (item.city) {
            formData.append('locationNames', `${item.city.name}, ${item.city.country}`);
            formData.append('latitudes', item.city.lat);
            formData.append('longitudes', item.city.lng);
        } else if (item.gps) {
            formData.append('locationNames', `${item.gps.lat.toFixed(4)}°, ${item.gps.lng.toFixed(4)}°`);
            formData.append('latitudes', item.gps.lat);
            formData.append('longitudes', item.gps.lng);
        } else {
            formData.append('locationNames', '');
            formData.append('latitudes', '');
            formData.append('longitudes', '');
        }
        
        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            if (result.success) {
                result.images.forEach(img => {
                    addToGallery({
                        id: img.id,
                        preview: img.path,
                        category: img.category
                    }, true);
                });
                succeeded++;
            }
        } catch (e) {
            console.error('Upload failed for', item.file.name, e);
        }
        
        completed++;
        progressFill.style.width = `${(completed / selectedItems.length) * 100}%`;
    }
    
    progressText.textContent = `Done! ${succeeded} of ${selectedItems.length} photos imported.`;
    progressFill.style.width = '100%';
    
    // Remove imported items from batch
    batchItems = batchItems.filter(i => !i.selected);
    
    setTimeout(() => {
        renderBatchPreview();
        if (batchItems.length === 0) {
            document.getElementById('batchControls').style.display = 'none';
        }
        progressEl.style.display = 'none';
        progressFill.style.width = '0%';
        importBtn.disabled = false;
        showNotification(`✅ ${succeeded} photos imported to gallery!`);
    }, 1500);
}
