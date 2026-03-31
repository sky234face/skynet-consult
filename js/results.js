const API_BASE = "https://api.unimatcher-skynetconsult.com/api/user";

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const checkId = urlParams.get('checkId');

    if (!checkId) { window.location.href = 'dashboard.html'; return; }

    try {
        const response = await fetch(`${API_BASE}/get-report?checkId=${checkId}`);
        const data = await response.json();

        if (!data.paid) { window.location.href = 'payment.html'; return; }

        const user = JSON.parse(localStorage.getItem('user_info'));
        if (user) document.getElementById('pdf-student-name').innerText = user.name;
        document.getElementById('pdf-date').innerText = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
        document.getElementById('pdf-report-id').innerText = checkId;

        const matches = data.report.matches;
        const grid = document.getElementById('matches-grid');

// Replace the grid.innerHTML section with this:
grid.innerHTML = matches.map((match, index) => `
    <div class="match-card bg-white rounded-3xl border border-slate-100 overflow-hidden mb-6 relative z-10">
        <div class="p-8">
            <div class="flex justify-between items-start mb-6">
                <div>
                    <span class="text-[10px] font-black text-brandBlue uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-md">Rank #${index + 1}</span>
                    <h2 class="text-2xl font-black text-slate-900 mt-2">${match.institution}</h2>
                    
                    <div class="flex flex-wrap gap-3 mt-2 mb-3">
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-1">
                            <i class="fas fa-university text-brandOrange"></i> ${match.faculty || 'General Faculty'}
                        </span>
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-1">
                            <i class="fas fa-map-marker-alt text-brandOrange"></i> ${match.campus || 'Main Campus'}
                        </span>
                    </div>

                    <p class="text-brandBlue font-extrabold text-sm uppercase tracking-wide">${match.programName}</p>
                </div>
                <div class="w-12 h-12 rounded-2xl flex items-center justify-center ${match.eligible ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'} border border-current">
                    <i class="fas ${match.eligible ? 'fa-check' : 'fa-times'} text-xl"></i>
                </div>
            </div>

            <div class="flex gap-6 mb-6">
                <div class="w-24 py-3 bg-slate-900 rounded-xl text-center">
                    <span class="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Aggregate</span>
                    <span class="text-xl font-black text-white">${match.breakdown.aggregate}</span>
                </div>
                <div class="flex-1">
                    <p class="text-[11px] font-black text-slate-400 uppercase mb-2 tracking-widest">Audit Breakdown</p>
                    ${match.reasons.map(reason => `<p class="text-xs text-slate-600 font-bold flex items-center gap-2 mb-1"><span class="w-1.5 h-1.5 bg-brandOrange rounded-full"></span> ${reason}</p>`).join('')}
                </div>
            </div>

            <div class="p-4 bg-slate-50 border-l-4 border-brandBlue rounded-r-xl mb-6">
                <p class="text-[10px] font-black uppercase text-slate-400 mb-1">Recommendation</p>
                <p class="text-xs font-bold text-slate-800 italic">"${match.recommendation}"</p>
            </div>

            <div class="mt-4 pt-4 border-t border-dashed border-slate-200">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Best 6 Subject Grading</p>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                    ${[...match.breakdown.cores, ...match.breakdown.electives].map(s => `
                        <div class="flex justify-between p-2 bg-slate-50 border border-slate-100 rounded-lg">
                            <span class="text-[9px] font-bold text-slate-500 truncate">${s.subject}</span>
                            <span class="text-[9px] font-black text-brandBlue">${s.grade}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    </div>
`).join('');

        document.getElementById('loader').classList.add('hidden');
        document.getElementById('pro-header').classList.remove('hidden');
        document.getElementById('header-section').classList.remove('hidden');
        grid.classList.remove('hidden');
        document.getElementById('action-buttons').classList.remove('hidden');
        document.getElementById('pdf-footer').classList.remove('hidden');

    } catch (err) { console.error(err); }
});

window.downloadPDF = function() {
    const watermark = document.getElementById('pdf-watermark');
    if (watermark) watermark.style.display = 'flex';

    window.print();

    if (watermark) watermark.style.display = 'none';
};

function shareToWhatsApp() {
    const cards = document.querySelectorAll('.match-card');
    if (cards.length === 0) {
        alert("No results found to share!");
        return;
    }

    const studentName = document.getElementById('pdf-student-name')?.innerText || "Student";
    let reportText = `🎓 *UniMatcher: Admission Audit for ${studentName}* 🎓\n\n`;

    cards.forEach((card, index) => {
        const institution = card.querySelector('h2')?.innerText || "Institution";
        const program = card.querySelector('.text-brandBlue.font-extrabold')?.innerText || "Program";
        const aggregate = card.querySelector('.text-xl.font-black.text-white')?.innerText || "N/A";
        
        // Find Faculty and Campus by their icons
        const faculty = card.querySelector('.fa-university')?.parentElement?.innerText || "N/A";
        const campus = card.querySelector('.fa-map-marker-alt')?.parentElement?.innerText || "N/A";
        
        const isEligible = card.querySelector('.fa-check') !== null;
        const status = isEligible ? "✅ ELIGIBLE" : "❌ NOT ELIGIBLE";

        reportText += `*${index + 1}. ${institution}*\n`;
        reportText += `🏛️ *Faculty:* ${faculty.trim()}\n`;
        reportText += `📍 *Campus:* ${campus.trim()}\n`;
        reportText += `📚 *Program:* ${program}\n`;
        reportText += `📊 *Aggregate:* ${aggregate}\n`;
        reportText += `*Status:* ${status}\n\n`;
    });

    reportText += `_Generated by UniMatcher Official Audit 2026_`;

    const encodedMessage = encodeURIComponent(reportText);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
}