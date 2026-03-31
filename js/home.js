// 1. Point to your LIVE Cloudflare Worker
const API_URL = 'https://api.unimatcher-skynetconsult.com/api';

document.addEventListener('DOMContentLoaded', async () => {
    updateNavbar();
    await loadHeroPrograms();
});

// Update Navbar based on login status
function updateNavbar() {
    const user = JSON.parse(localStorage.getItem('user_info'));
    const authSection = document.getElementById('nav-auth-section');

    if (user) {
        authSection.innerHTML = `
            <a href="/dashboard.html" class="px-6 py-2.5 bg-brandBlue text-white font-bold rounded-xl shadow-lg transition hover:scale-105">
                My Dashboard
            </a>
        `;
    }
}

// 2. Load Real Programs using the Universal Getter
async function loadHeroPrograms() {
    const select = document.getElementById('program-selection');
    const statusDisplay = document.getElementById('status-display');

    try {
        // Updated to use the correct 'get-table' endpoint
        const res = await fetch(`${API_URL}/admin/get-table?table=programs`); 
        const programs = await res.json();

        if (programs && programs.length > 0) {
            // Populate the dropdown
            select.innerHTML = programs.map(p => 
                `<option value="${p.cutoff_aggregate || 'N/A'}">${p.program_name}</option>`
            ).join('');

            // Set initial status for the first program in the list
            updateStatus(programs[0].cutoff_aggregate);

            // Update status text when user picks a program
            select.addEventListener('change', (e) => {
                updateStatus(e.target.value);
            });
        }
    } catch (err) {
        console.error("Home Load Error:", err);
        select.innerHTML = `<option>Failed to load programs</option>`;
    }

    // Helper function to keep the UI clean
    function updateStatus(cutoff) {
        statusDisplay.innerHTML = `
            <div class="p-4 bg-orange-50 rounded-xl border border-orange-100 text-brandOrange text-sm font-bold">
                <i class="fas fa-info-circle mr-2"></i> Requires Aggregate ${cutoff} or better
            </div>
        `;
    }
}