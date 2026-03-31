/**
 * UniMatcher Global Layout & Auth Guard
 */
const CONFIG = {
    brandBlue: '#003B73',
    brandOrange: '#F28C00',
    // Automatically switches between local testing and your live Cloudflare Worker
    apiUrl: window.location.hostname === 'localhost' 
        ? 'http://localhost:8787/api' 
        : 'https://api.unimatcher-skynetconsult.com/api'
};

document.addEventListener('DOMContentLoaded', () => {
    injectGlobalStyles(); // New helper to fix mobile view
    injectNavbar();
    injectFooter();
});

function injectGlobalStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
        /* 1. Force the page to fill the actual phone screen height */
        html, body { 
            height: 100%; 
            margin: 0; 
            overflow-x: hidden; /* Prevents horizontal scrolling */
        }
        body { 
            display: flex; 
            flex-direction: column; 
            min-height: 100vh; 
        }
        
        /* 2. Make sure the dashboard content expands to push footer down */
        main.dashboard-container {
            flex: 1 0 auto;
            width: 100%;
        }

        /* 3. Ensure the footer stays at the very bottom */
        footer { 
            flex-shrink: 0; 
            margin-top: auto; 
        }

        /* 4. Fix table scrolling on small phones */
        .overflow-x-auto {
            -webkit-overflow-scrolling: touch;
        }
            /* Custom scrollbar for the table area on mobile */
.overflow-x-auto::-webkit-scrollbar {
    height: 4px;
}
.overflow-x-auto::-webkit-scrollbar-thumb {
    background: #E2E8F0;
    border-radius: 10px;
}
    `;
    document.head.appendChild(style);
}

function injectNavbar() {
    const user = JSON.parse(localStorage.getItem('user_info'));
    
    const nav = document.createElement('nav');
    nav.className = "sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100";
    
    nav.innerHTML = `
        <div class="max-w-7xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
            <a href="/dashboard.html" class="flex items-center gap-2">
                <div class="font-extrabold text-xl tracking-tighter text-brandBlue">
                    Uni<span class="text-brandOrange">Matcher</span>
                </div>
            </a>
            
            <div class="flex items-center gap-2">
                ${user ? `
                    <a href="/dashboard.html" class="p-2.5 bg-slate-100 rounded-xl text-brandBlue hover:bg-slate-200 transition">
                        <i class="fas fa-home"></i>
                    </a>

                    <button onclick="toggleMobileMenu()" class="p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100">
                        <i class="fas fa-bars"></i>
                    </button>
                ` : `
                    <a href="/login.html" class="text-sm font-bold text-brandBlue px-2">Log in</a>
                    <a href="/signup.html" class="px-4 py-2 bg-brandBlue text-white text-sm font-bold rounded-xl">Join</a>
                `}
            </div>
        </div>

        <div id="mobile-menu" class="hidden border-b border-slate-100 bg-white animate-in slide-in-from-top duration-300">
            <div class="px-6 py-6 flex flex-col gap-4 font-bold text-slate-600">
                <a href="/universities.html" class="flex items-center gap-3 py-2 border-b border-slate-50 hover:text-brandBlue"><i class="fas fa-university w-5"></i> Universities</a>
                <a href="/scholarships.html" class="flex items-center gap-3 py-2 border-b border-slate-50 hover:text-brandBlue"><i class="fas fa-graduation-cap w-5"></i> Scholarships</a>
                <a href="/packages.html" class="flex items-center gap-3 py-2 border-b border-slate-50 hover:text-brandBlue"><i class="fas fa-box-open w-5"></i> Packages</a>
                <a href="/contact.html" class="flex items-center gap-3 py-2 border-b border-slate-50 hover:text-brandBlue"><i class="fas fa-envelope w-5"></i> Contact</a>
                ${user?.role === 'admin' ? `<a href="/admin.html" class="flex items-center gap-3 py-2 text-brandOrange"><i class="fas fa-user-shield w-5"></i> Admin Panel</a>` : ''}
                <button onclick="logout()" class="flex items-center gap-3 py-2 text-red-500 mt-2"><i class="fas fa-sign-out-alt w-5"></i> Logout</button>
            </div>
        </div>
    `;
    document.body.prepend(nav);
}

// Add this function to global.js to handle the clicking
window.toggleMobileMenu = function() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
};

function injectFooter() {
    const footer = document.createElement('footer');
    footer.className = "bg-slate-900 text-white py-12 mt-auto"; // Added mt-auto to ensure it pushes down
    footer.innerHTML = `
        <div class="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">
            <div>
                <div class="font-extrabold text-2xl mb-4">UniMatcher</div>
                <p class="text-slate-400 text-sm leading-relaxed">The standard for academic eligibility in Ghana. Helping students match with their future since 2026.</p>
            </div>
            <div class="flex flex-col gap-2">
                <h4 class="font-bold mb-2">Quick Links</h4>
                <a href="#" class="text-slate-400 hover:text-white text-sm">Privacy Policy</a>
                <a href="#" class="text-slate-400 hover:text-white text-sm">Terms of Service</a>
            </div>
            <div>
                <h4 class="font-bold mb-2">Support</h4>
                <p class="text-slate-400 text-sm">Email: unimatcher@gmail.com</p>
            </div>
        </div>
    `;
    document.body.append(footer);
}

function logout() {
    localStorage.clear();
    window.location.href = '/index.html';
}