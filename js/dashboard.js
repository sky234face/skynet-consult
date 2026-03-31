/**
 * UniMatcher Dashboard Logic - Premium Integrated Version
 */
const API_BASE = "https://api.unimatcher-skynetconsult.com/api";

document.addEventListener('DOMContentLoaded', async () => {
    const user = JSON.parse(localStorage.getItem('user_info'));
    
    if (!user || (!user.id && !user.userId)) {
        window.location.href = "login.html";
        return;
    }

    // Set the Name UI
    const nameElement = document.getElementById('display-name');
    if (nameElement && user.name) {
        const firstName = user.name.split(' ')[0];
        nameElement.innerText = firstName.charAt(0).toUpperCase() + firstName.slice(1);
    }

    const activeId = user.id || user.userId;

    // Run Profile Sync and Data Loading at the same time for speed
    await Promise.all([
        syncAndVerifyProfile(), 
        loadDashboardData(activeId)
    ]);
});

async function loadDashboardData(userId) {
    const statChecks = document.getElementById('stat-checks');
    const statUnlocked = document.getElementById('stat-unlocked');
    const historyList = document.getElementById('history-list');
    const discoveryList = document.getElementById('discovery-history-list'); // Ensure this ID exists in HTML

    try {
        const response = await fetch(`${API_BASE}/user/stats?userId=${userId}`);
        if (!response.ok) throw new Error("Failed to fetch stats");
        
        const data = await response.json();

        // Update Counters
        if (statChecks) statChecks.innerText = data.totalChecks || 0;
        if (statUnlocked) statUnlocked.innerText = data.totalUnlocked || 0;

        // --- RENDER ELIGIBILITY HISTORY (Original Logic) ---
        if (!data.history || data.history.length === 0) {
            historyList.innerHTML = `<tr><td colspan="4" class="p-12 text-center text-slate-400 italic">No checks performed yet.</td></tr>`;
        } else {
            // Locate this part in your loadDashboardData function:
historyList.innerHTML = data.history.map(item => {
    const checkDate = new Date(item.created_at).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric'
    });
    return `
        <tr class="hover:bg-slate-50/50 transition group">
            <td class="px-8 py-5 text-sm text-slate-500 font-medium">${checkDate}</td>
            <td class="px-8 py-5 font-bold text-slate-700">${item.program_name || 'General Program'}</td>
            <td class="px-8 py-5">
                <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.is_paid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}">
                    ${item.is_paid ? 'Unlocked' : 'Locked'}
                </span>
            </td>
            <td class="px-8 py-5 text-right flex justify-end gap-3"> <button onclick="handleDashboardAction('${item.id}', ${item.is_paid}, '${item.program_name}')" 
                   class="text-brandBlue font-extrabold text-sm hover:underline cursor-pointer bg-transparent border-none">
                    ${item.is_paid ? 'View' : 'Unlock'} <i class="fas fa-chevron-right ml-2 text-[10px]"></i>
                </button>
                
                <button onclick="deleteRecord('${item.id}', this)" class="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm">
                    <i class="fas fa-trash-alt text-xs"></i>
                </button>
            </td>
        </tr>`;
}).join('');
        }

        // --- RENDER DISCOVERY HISTORY (Premium Logic) ---
        if (discoveryList) {
            renderDiscoverySection(data.discoveries, discoveryList);
        }

    } catch (err) {
        console.error("Dashboard Error:", err);
        if (historyList) historyList.innerHTML = `<tr><td colspan="4" class="p-8 text-center text-red-400">Connection error.</td></tr>`;
    }
}

// PREMIUM DISCOVERY RENDERER
function renderDiscoverySection(discoveries, container) {
    if (!discoveries || discoveries.length === 0) {
        container.innerHTML = `
            <div class="p-12 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50">
                <p class="text-slate-500 font-medium">No career discovery checks found yet.</p>
            </div>`;
        return;
    }

    container.innerHTML = discoveries.map(item => {
        const checkDate = new Date(item.created_at).toLocaleDateString('en-GB', { 
            day: 'numeric', month: 'short', year: 'numeric' 
        });
        const isPaid = item.status === 'paid';

        // Locate this part in your renderDiscoverySection function:
return `
    <div class="flex items-center justify-between p-5 mb-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-orange-400 transition-all duration-300 group">
        <div class="flex items-center gap-5">
            <div class="w-12 h-12 rounded-xl bg-[#f59e0b] flex items-center justify-center text-white shadow-sm">
                <i class="fas fa-sparkles text-lg"></i>
            </div>
            <div>
                <h4 class="font-bold text-[17px] text-[#003366] group-hover:text-[#f59e0b] transition-colors">
                    ${item.faculty_chosen || 'Career Discovery Audit'}
                </h4>
                <p class="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">${checkDate}</p>
            </div>
        </div>

        <div class="flex items-center gap-6">
            <div class="flex items-center gap-2 px-4 py-1.5 rounded-full ${isPaid ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}">
                <div class="w-1.5 h-1.5 rounded-full ${isPaid ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse"></div>
                <span class="text-[11px] font-black uppercase tracking-widest">
                    ${isPaid ? 'Verified' : 'Pending'}
                </span>
            </div>
            
            <div class="flex items-center gap-3"> <button onclick="handleDiscoveryAction(${isPaid}, '${item.id}')" 
                    class="w-10 h-10 rounded-full bg-[#003366] text-white flex items-center justify-center hover:bg-[#f59e0b] transform hover:scale-110 transition-all shadow-md">
                    <i class="fas fa-arrow-right text-sm"></i>
                </button>

                <button onclick="deleteRecord('${item.id}', this)" class="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-md">
                    <i class="fas fa-trash-alt text-sm"></i>
                </button>
            </div>
        </div>
    </div>`;
    }).join('');
}
// Action Handlers
window.handleDashboardAction = function(checkId, isPaid, programName) {
    if (isPaid) {
        window.location.href = `results.html?checkId=${checkId}`;
    } else {
        localStorage.setItem('pending_check_id', checkId);
        localStorage.setItem('temp_eligibility', JSON.stringify({ id: checkId, program_name: programName }));
        window.location.href = "payment.html";
    }
};

// Add 'leadId' as a parameter so we know which record was clicked
window.handleDiscoveryAction = function(isPaid, leadId) {
    if (isPaid === 'true' || isPaid === true) {
        // THE FIX: Pass the specific ID to the results page
        window.location.href = `discovery-results.html?id=${leadId}`;
    } else {
        // THE FIX: Pass the specific ID to the payment page
        window.location.href = `payment.html?type=discovery&leadId=${leadId}`;
    }
};
window.deleteRecord = async function(id, btn) {
    if (!confirm("Are you sure you want to clear this check from your history?")) return;

    const isDiscovery = btn.closest('#discovery-history-list') !== null;
    const type = isDiscovery ? 'discovery' : 'eligibility';

    const originalContent = btn.innerHTML;
    btn.innerHTML = `<i class="fas fa-spinner fa-spin text-sm"></i>`;
    btn.disabled = true;

    try {
        const response = await fetch(`${API_BASE}/delete-record?id=${id}&type=${type}`, {
            method: 'DELETE',
        });

        const result = await response.json();

        if (response.ok && result.success) {
            const elementToRemove = isDiscovery ? btn.closest('.bg-white') : btn.closest('tr');
            
            // --- PREMIUM SYNC LOGIC ---
            // Check if the row/card has a "PAID" badge before removing it
            const isPaid = elementToRemove.innerText.toUpperCase().includes('PAID');

            elementToRemove.style.transition = "all 0.4s ease";
            elementToRemove.style.opacity = '0';
            elementToRemove.style.transform = 'translateX(50px)';
            
            setTimeout(() => {
                elementToRemove.remove();
                
                // 1. Update "Checks Performed"
                const statChecks = document.getElementById('stat-checks');
                if (statChecks) {
                    let count = parseInt(statChecks.innerText);
                    statChecks.innerText = Math.max(0, count - 1);
                }

                // 2. Update "Unlocked Results" ONLY if it was a paid record
                if (isPaid) {
                    const statUnlocked = document.getElementById('stat-unlocked');
                    if (statUnlocked) {
                        let uCount = parseInt(statUnlocked.innerText);
                        statUnlocked.innerText = Math.max(0, uCount - 1);
                    }
                }
            }, 400);
        } else {
            alert("Error: " + (result.error || "Unknown error"));
            btn.innerHTML = originalContent;
            btn.disabled = false;
        }
    } catch (error) {
        console.error("Delete Error:", error);
        btn.innerHTML = originalContent;
        btn.disabled = false;
    }
};

async function syncAndVerifyProfile() {
    const userInfo = JSON.parse(localStorage.getItem('user_info'));
    const modal = document.getElementById('onboarding-modal');
    
    // Safety check
    if (!modal || !userInfo || !userInfo.id) return;

    try {
        // 1. Fetch the absolute truth from the Database
        const response = await fetch(`${API_BASE}/user/get-profile?id=${userInfo.id}`);
        const data = await response.json();

        if (data.user) {
            const dbUser = data.user;

            // 2. Update LocalStorage so other parts of the site have the latest data
            const updatedInfo = { ...userInfo, ...dbUser };
            localStorage.setItem('user_info', JSON.stringify(updatedInfo));

            // 3. Verify based ON THE DATABASE RESPONSE, not local storage
            // We check if phone or education_level is null, undefined, or empty string
            const isMissingData = !dbUser.phone || 
                                 dbUser.phone.trim() === "" || 
                                 !dbUser.education_level || 
                                 dbUser.education_level.trim() === "";

            if (isMissingData) {
                console.log("Profile incomplete in DB. Showing modal.");
                modal.classList.remove('hidden');
            } else {
                console.log("Profile verified in DB. Keeping modal hidden.");
                modal.classList.add('hidden');
            }
        }
    } catch (e) {
        console.error("Profile sync failed. Modal stayed hidden to prevent annoyance.");
        // We keep it hidden on network error so we don't annoy verified users
        modal.classList.add('hidden'); 
    }
}

// This replaces the bottom-most event listener in your file
const onboardingForm = document.getElementById('onboarding-form');
if (onboardingForm) {
    onboardingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const saveBtn = document.getElementById('save-profile-btn');
        const userInfo = JSON.parse(localStorage.getItem('user_info'));
        const modal = document.getElementById('onboarding-modal');

        // Premium Feedback: Disable button and show spinner
        saveBtn.disabled = true;
        saveBtn.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i> Saving...`;

        const payload = {
            id: userInfo.id || userInfo.userId,
            phone: document.getElementById('profile-phone').value,
            education_level: document.getElementById('profile-education').value,
            target_country: document.getElementById('profile-country').value
        };

        try {
            const res = await fetch(`${API_BASE}/update-profile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const data = await res.json();
                // 100% accuracy: use full object from database
                localStorage.setItem('user_info', JSON.stringify(data.user));
                
                modal.classList.add('hidden');
                alert("Profile updated! Welcome to UniMatcher.");
                window.location.reload(); // Refresh to update UI with new data
            } else {
                throw new Error("Update failed");
            }
        } catch (err) {
            alert("Error saving profile. Please try again.");
            saveBtn.disabled = false;
            saveBtn.innerHTML = `<span>Save & Enter Dashboard</span> <i class="fas fa-check"></i>`;
        }
    });
}