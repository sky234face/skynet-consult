const API_BASE = "https://api.unimatcher-skynetconsult.com/api/user";

document.addEventListener('DOMContentLoaded', async () => {
    localStorage.removeItem('last_discovery');
    const container = document.getElementById('results-container');
    const rawUser = localStorage.getItem('user_info');
    
    const urlParams = new URLSearchParams(window.location.search);
    const leadId = urlParams.get('id'); 

    if (!container) return;
    if (!rawUser) {
        container.innerHTML = `<div class="col-span-full p-20 text-center text-slate-400">Please log in to view results.</div>`;
        return;
    }

    const user = JSON.parse(rawUser);
    const userId = user.id || user.userId;

    try {
        const response = await fetch(`${API_BASE}/get-discovery-results?userId=${userId}&id=${leadId}&t=${Date.now()}`);
        const data = await response.json();

        if (!data.lead || data.lead.status !== 'paid') {
            // Ensure you have a renderLockedState function defined elsewhere or handle it here
            container.innerHTML = `<div class="col-span-full p-20 text-center text-slate-400">This report is locked. Please complete payment.</div>`;
            return;
        }

        const lead = data.lead;

        if (document.getElementById('display-user-name')) {
            document.getElementById('display-user-name').innerText = lead.student_name || user.name;
            document.getElementById('display-aggregate').innerText = lead.student_aggregate || "--";
            
            if (document.getElementById('display-faculty')) {
                document.getElementById('display-faculty').innerText = `${lead.faculty_chosen} Discovery`;
            }
        }

        // --- RENDER LOGIC ---
        renderPremiumResults(lead.matches_found, lead.student_aggregate);

    } catch (error) {
        console.error("Results Error:", error);
        container.innerHTML = `<div class="col-span-full p-20 text-center text-red-500 font-bold">Failed to load results. Please refresh the page.</div>`;
    }
});

function renderPremiumResults(matchesData, studentAggregate) {
    const container = document.getElementById('results-container');
    let data = typeof matchesData === 'string' ? JSON.parse(matchesData) : matchesData;

    // --- CASE 1: DIAGNOSTIC FALLBACK (No matches found) ---
    if (data.isDiagnostic) {
        container.classList.remove('md:grid-cols-2', 'lg:grid-cols-3');
        container.classList.add('grid-cols-1'); // Make it a single wide column for the advisor look

        const diag = data;
        container.innerHTML = `
        <div class="col-span-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div class="bg-white border-2 border-orange-100 rounded-[2.5rem] p-8 md:p-12 shadow-xl">
                <div class="flex flex-col md:flex-row gap-10">
                    <div class="flex-1">
                        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest mb-4">
                            <i class="fas fa-microscope"></i> AI Diagnostic Analysis
                        </div>
                        <h3 class="text-3xl font-extrabold text-[#003366] mb-4">Understanding Your Results</h3>
                        <p class="text-slate-600 leading-relaxed mb-6">${diag.reason}</p>
                        
                        <div class="space-y-4">
                            <div class="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                <p class="text-[10px] font-black text-slate-400 uppercase mb-2">Faculty Landscape</p>
                                <div class="flex justify-between items-center">
                                    <span class="text-sm font-bold text-[#003366]">Competitive Peak:</span>
                                    <span class="text-sm font-medium text-slate-500">${diag.facultyExtremes?.peak || 'N/A'}</span>
                                </div>
                                <div class="flex justify-between items-center mt-2">
                                    <span class="text-sm font-bold text-[#003366]">Accessible Entry:</span>
                                    <span class="text-sm font-medium text-slate-500">${diag.facultyExtremes?.floor || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex-1 bg-[#003366] rounded-[2rem] p-8 text-white relative overflow-hidden">
                        <h4 class="text-xl font-bold mb-4 relative z-10">Strategic Pivot Suggestions</h4>
                        <p class="text-blue-200 text-sm mb-6 relative z-10">Based on your aggregate of ${studentAggregate}, these faculties offer a much higher probability of admission:</p>
                        
                        <div class="space-y-3 relative z-10">
                            ${diag.alternatives.map(alt => `
                                <div class="p-4 bg-white/10 border border-white/10 rounded-xl hover:bg-white/20 transition-all">
                                    <p class="text-[10px] font-black text-orange-400 uppercase">${alt.faculty}</p>
                                    <p class="font-bold">${alt.program_name}</p>
                                    <p class="text-xs text-blue-200">${alt.university_name}</p>
                                </div>
                            `).join('')}
                        </div>

                        <div class="mt-8 pt-6 border-t border-white/10 relative z-10">
                            <p class="text-xs italic text-blue-300">"We recommend speaking to a consultant to explore fee-paying or private university alternatives."</p>
                        </div>
                        <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl"></div>
                    </div>
                </div>
            </div>
        </div>`;
        return;
    }

    // --- CASE 2: SUCCESSFUL MATCHES ---
    if (!Array.isArray(data) || data.length === 0) {
        container.innerHTML = `<p class="col-span-full text-center py-20 text-slate-400">Unexpected data format received.</p>`;
        return;
    }

    container.classList.add('md:grid-cols-2', 'lg:grid-cols-3');
    const sAgg = parseInt(studentAggregate) || 20;

    container.innerHTML = data.map((uni) => {
        const universityName = uni.university_name || "University";
        const programName = uni.program_name || "Program";
        const cutoff = parseInt(uni.cutoff_aggregate) || 20;
        const campus = uni.campus || "Main Campus";

        // Score logic
        const diff = cutoff - sAgg;
        let calculatedScore = diff >= 5 ? 98 : (diff >= 0 ? 80 + (diff * 3) : 65 + (diff * 5));
        calculatedScore = Math.min(Math.max(calculatedScore, 50), 98);
        const isQualified = sAgg <= cutoff;

        return `
        <div class="premium-card p-8 flex flex-col justify-between h-full group relative overflow-hidden">
            <div class="flex justify-between items-start mb-6">
                <div class="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-[#F59E0B]">
                    <i class="fas fa-university text-xl"></i>
                </div>
                <div class="text-right">
                    <span class="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Match Score</span>
                    <span class="text-xl font-black text-[#003366]">${calculatedScore}%</span>
                </div>
            </div>

            <div class="mb-8">
                <h3 class="text-xl font-extrabold text-[#003366] mb-1 group-hover:text-[#F59E0B] transition-colors leading-tight">
                    ${universityName}
                </h3>
                <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">${campus}</p>
                
                <div class="p-5 bg-slate-50 rounded-2xl border border-slate-100 mb-4">
                    <p class="text-[10px] text-slate-400 font-black uppercase mb-1">Recommended Pathway</p>
                    <p class="text-sm font-bold text-[#003366] leading-snug mb-3">${programName}</p>
                    
                    <div class="flex items-center justify-between pt-3 border-t border-slate-200/60">
                        <div class="text-center">
                            <p class="text-[8px] font-black text-slate-400 uppercase">Cut-off</p>
                            <p class="text-xs font-bold text-[#003366]">${cutoff}</p>
                        </div>
                        <div class="text-center">
                            <p class="text-[8px] font-black text-slate-400 uppercase">Your Agg</p>
                            <p class="text-xs font-bold text-[#F59E0B]">${sAgg}</p>
                        </div>
                        <div class="px-2 py-1 rounded-md ${isQualified ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'} text-[9px] font-black">
                            ${isQualified ? 'QUALIFIED' : 'REACH'}
                        </div>
                    </div>
                </div>

                <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div class="h-full bg-[#F59E0B] transition-all duration-1000" style="width: ${calculatedScore}%"></div>
                </div>
            </div>
<button onclick="openRequirementsModal('${universityName}', '${programName}')" 
    class="no-print w-full py-4 rounded-xl border-2 border-[#003366] text-[#003366] text-xs font-black uppercase tracking-widest hover:bg-[#003366] hover:text-white transition-all duration-300">
    View Requirements
</button>
        </div>`;
    }).join('');
}

function shareToWhatsApp() {
    const name = document.getElementById('display-user-name').innerText;
    const aggregate = document.getElementById('display-aggregate').innerText;
    const faculty = document.getElementById('display-faculty').innerText;
    
    let contentSection = "";
    const matchCards = document.querySelectorAll('.premium-card');

    if (matchCards.length > 0) {
        // --- CASE 1: SHARING ACTUAL MATCHES ---
        contentSection = `✅ *PROGRAM MATCHES:*\n\n`;
        matchCards.forEach((card, index) => {
            const uniName = card.querySelector('h3').innerText;
            const programName = card.querySelector('.text-sm.font-bold').innerText;
            contentSection += `${index + 1}. *${uniName}*\n   - ${programName}\n\n`;
        });
    } else {
        // --- CASE 2: SHARING DIAGNOSTIC RECOMMENDATIONS ---
        contentSection = `🔍 *AI DIAGNOSTIC ADVICE:*\n`;
        contentSection += `_Current aggregate suggests a strategic pivot._\n\n*Recommended Alternatives:*\n`;
        
        // Grab the alternatives from the blue Strategic Pivot box
        const alternatives = document.querySelectorAll('.bg-white\\/10 p.font-bold');
        alternatives.forEach((alt, index) => {
            const program = alt.innerText;
            const uni = alt.nextElementSibling.innerText; // The text-blue-200 p
            contentSection += `${index + 1}. *${program}*\n   - ${uni}\n\n`;
        });
        
        contentSection += `💡 _"Explore fee-paying or private alternatives."_\n`;
    }

    const text = 
        `🎓 *UNIMATCHER PATHFINDER REPORT* 🎓\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `👤 *STUDENT:* ${name}\n` +
        `📊 *AGGREGATE:* ${aggregate}\n` +
        `🏫 *FACULTY:* ${faculty}\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        contentSection +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `🛡️ _Verified Premium AI Discovery_`;
    
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}

// Improved print trigger
function triggerPrint() {
    window.print();
}
function talkToConsultant() {
    const name = document.getElementById('display-user-name').innerText;
    const aggregate = document.getElementById('display-aggregate').innerText;
    const faculty = document.getElementById('display-faculty').innerText;
    const consultantNumber = "233547933440";
    
    // Check if we are in diagnostic mode (no premium cards found)
    const hasMatches = document.querySelectorAll('.premium-card').length > 0;
    
    let message = "";

    if (hasMatches) {
        // --- MESSAGE FOR SUCCESSFUL MATCHES ---
        message = `Hello UniMatcher Counselor! 👋\n\n` +
                  `My name is *${name}*. I just unlocked my Pathfinder matches for *${faculty}*.\n\n` +
                  `📊 *Stats:* Agg ${aggregate}\n` +
                  `I'd like to discuss the requirements for the programs I matched with.`;
    } else {
        // --- MESSAGE FOR DIAGNOSTIC/PIVOT CASE ---
        message = `Hello UniMatcher Counselor! 👋\n\n` +
                  `My name is *${name}*. I just ran a Discovery for *${faculty}* (Agg ${aggregate}), and the AI has recommended a *Strategic Pivot*.\n\n` +
                  `⚠️ I need professional advice on the alternative pathways suggested in my report. Can we discuss my options?`;
    }

    const encodedMsg = encodeURIComponent(message);
    window.open(`https://wa.me/${consultantNumber}?text=${encodedMsg}`, '_blank');
}

async function openRequirementsModal(uni, prog) {
    const modal = document.getElementById('requirements-modal');
    const loading = document.getElementById('modal-loading');
    const body = document.getElementById('modal-body');
    
    // Targets for our new split UI
    const coreBox = document.getElementById('modal-core-text');
    const electiveBox = document.getElementById('modal-elective-text');
    
    modal.classList.remove('hidden');
    loading.classList.remove('hidden');
    body.classList.add('hidden');

    try {
        const response = await fetch(`https://api.unimatcher-skynetconsult.com/api/get-requirements?university=${encodeURIComponent(uni)}&program=${encodeURIComponent(prog)}`);
        const data = await response.json();

        document.getElementById('modal-uni-name').innerText = uni;
        document.getElementById('modal-prog-name').innerText = prog;
        
        // Handle the Array format from our corrected Worker
        // data.requirements[0] = Cores, data.requirements[1] = Electives
        if (Array.isArray(data.requirements)) {
            coreBox.innerHTML = data.requirements[0] || "Standard Cores (A1-C6)";
            electiveBox.innerHTML = data.requirements[1] || "Relevant Electives Required";
        } else {
            // Fallback if it's just a string
            coreBox.innerHTML = data.requirements;
            electiveBox.innerHTML = "Check specific faculty guidelines.";
        }

        loading.classList.add('hidden');
        body.classList.remove('hidden');

    } catch (error) {
        coreBox.innerHTML = "Error loading requirements.";
        electiveBox.innerHTML = "Please contact a counselor.";
        loading.classList.add('hidden');
        body.classList.remove('hidden');
    }
}
function closeRequirementsModal() {
    const modal = document.getElementById('requirements-modal');
    if (modal) {
        modal.classList.add('hidden');
        // Optional: Reset the body scroll if you disabled it
        document.body.style.overflow = 'auto';
    }
}