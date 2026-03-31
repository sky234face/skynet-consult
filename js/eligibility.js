const API_BASE = "https://api.unimatcher-skynetconsult.com/api/admin";

const electivesList = [
    "Elective Mathematics", "Physics", "Chemistry", "Biology", "Elective ICT", "Applied Electricity", "Electronics",
    "General Agriculture", "Crop Husbandry and Horticulture", "Animal Husbandry", "Fisheries", "Forestry", "Economics",
    "Business Management", "Financial Accounting", "Cost Accounting", "Principles of Costing", "Clerical Office Duties",
    "Typewriting", "Shorthand", "Government", "Geography", "History", "Literature in English", "Christian Religious Studies (CRS)",
    "Islamic Religious Studies (IRS)", "French", "Arabic", "Ghanaian Language", "General Knowledge in Art (GKA)",
    "Graphic Design", "Picture Making", "Sculpture", "Ceramics", "Textiles", "Leatherwork", "Basketry", "Jewellery",
    "Management in Living", "Food and Nutrition", "Clothing and Textiles", "Building Construction", "Wood Technology",
    "Metal Technology", "Auto Mechanics", "Auto Electricals", "Welding and Fabrication", "Electrical Installation",
    "Plumbing", "Refrigeration and Air Conditioning", "Metal Work", "Technical Drawing"
];

const grades = { "A1": 1, "B2": 2, "B3": 3, "C4": 4, "C5": 5, "C6": 6, "D7": 7, "E8": 8, "F9": 9 };

document.addEventListener('DOMContentLoaded', async () => {
    let allPrograms = [];
    const progSearch = document.getElementById('prog-search');
    const progResults = document.getElementById('prog-results');
    const hiddenProg = document.getElementById('program-id');

    // 1. Load Programs from API
    try {
        const res = await fetch(`${API_BASE}/get-table?table=programs`);
        allPrograms = await res.json();
    } catch (e) { 
        console.error("API Error: Could not load programs"); 
    }

    /**
     * Program Search Logic
     */
    progSearch.addEventListener('input', (e) => {
        const val = e.target.value.toLowerCase().trim();
        
        if (!val) { 
            progResults.classList.add('hidden'); 
            return; 
        }

        const matches = allPrograms.filter(p => 
            (p.program_name || p.name || "").toLowerCase().includes(val)
        );

        if (matches.length > 0) {
            progResults.innerHTML = matches.map(p => {
                const pName = p.program_name || p.name;
                const pId = p.program_id || p.id;
                
                return `
                    <div class="p-4 hover:bg-brandBlue hover:text-white cursor-pointer font-bold text-slate-600 border-b border-slate-50 transition-colors" 
                         onclick="selectProg('${pId}', '${pName.replace(/'/g, "\\'")}')">
                        ${pName}
                    </div>
                `;
            }).join('');
            progResults.classList.remove('hidden');
        } else {
            progResults.innerHTML = `<div class="p-4 text-slate-400 italic">No programs found</div>`;
            progResults.classList.remove('hidden');
        }
    });

    /**
     * Global function to handle selecting a program from the list
     */
    window.selectProg = (id, name) => {
        progSearch.value = name;
        hiddenProg.value = id;
        progResults.classList.add('hidden');
        progSearch.classList.add('border-brandBlue');
    };

    // Close dropdowns if clicking outside
    document.addEventListener('click', (e) => {
        if (!progSearch.contains(e.target) && !progResults.contains(e.target)) {
            progResults.classList.add('hidden');
        }
    });

    // 2. Generate Core Inputs
    const coreContainer = document.getElementById('core-inputs');
    ["English Language", "Mathematics (Core)", "Integrated Science", "Social Studies"].forEach(core => {
        coreContainer.innerHTML += `
            <div class="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                <span class="text-[10px] font-black text-slate-500 uppercase">${core}</span>
                <select class="core-val font-black text-brandBlue outline-none bg-slate-50 p-2 rounded-xl border-none cursor-pointer">
                    ${Object.keys(grades).map(g => `<option value="${grades[g]}">${g}</option>`).join('')}
                </select>
            </div>
        `;
    });

    // 3. Generate Elective Searchable Inputs
    const electiveContainer = document.getElementById('elective-inputs');
    for(let i=1; i<=4; i++) {
        electiveContainer.innerHTML += `
            <div class="relative space-y-2">
                <div class="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm group focus-within:border-brandBlue transition-all">
                    <input type="text" placeholder="Search Elective ${i}..." 
                           class="elec-search w-full bg-transparent outline-none text-xs font-bold text-slate-700" 
                           oninput="filterElectives(this, ${i})">
                    <select class="elec-val font-black text-brandOrange text-sm outline-none bg-orange-50 p-1 rounded-lg cursor-pointer">
                        ${Object.keys(grades).map(g => `<option value="${grades[g]}">${g}</option>`).join('')}
                    </select>
                </div>
                <div id="elec-res-${i}" class="absolute z-20 w-full mt-1 bg-white border border-slate-100 shadow-xl rounded-xl max-h-40 overflow-y-auto hidden custom-scroll"></div>
            </div>
        `;
    }

    // 4. Elective Logic
    window.filterElectives = (input, index) => {
        const val = input.value.toLowerCase();
        const resDiv = document.getElementById(`elec-res-${index}`);
        if(!val) { resDiv.classList.add('hidden'); return; }
        
        const matches = electivesList.filter(e => e.toLowerCase().includes(val));
        resDiv.innerHTML = matches.map(m => `
            <div class="p-3 hover:bg-orange-50 cursor-pointer text-[11px] font-bold text-slate-500 border-b border-slate-50 transition-colors" 
                 onclick="selectElective(${index}, '${m}')">${m}</div>
        `).join('');
        resDiv.classList.remove('hidden');
    };

    window.selectElective = (index, name) => {
        const inputs = document.querySelectorAll('.elec-search');
        inputs[index-1].value = name;
        document.getElementById(`elec-res-${index}`).classList.add('hidden');
    };

  // 5. Submit Logic
// --- SECTION 5: UPDATED SUBMIT LOGIC ---
document.getElementById('eligibility-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const user = JSON.parse(localStorage.getItem('user_info'));
    const activeUserId = user ? (user.id || user.userId || user.user_id) : null;

    if (!activeUserId) {
        alert("Session Error: Please log back in.");
        window.location.href = "login.html";
        return;
    }

    const programName = document.getElementById('prog-search').value;
    const programId = document.getElementById('program-id').value;
    
    if (!programId || !programName) {
        alert("Please select a Program from the list.");
        return;
    }

    const coreInputs = document.querySelectorAll('.core-val');
    const electiveInputs = document.querySelectorAll('.elec-search');
    const electiveGradeSelectors = document.querySelectorAll('.elec-val');

    const resultsObject = {};

    /**
     * 1. CORE SUBJECTS 
     * We map these explicitly to ensure keys match your DB 'core_requirements' table perfectly.
     */
    const standardCores = ["English Language", "Mathematics (Core)", "Integrated Science", "Social Studies"];
    
    standardCores.forEach((sub, i) => {
        // Grab the text (e.g., "A1") and trim just in case
        const gradeText = coreInputs[i].options[coreInputs[i].selectedIndex].text.trim();
        resultsObject[sub] = gradeText;
    });

    /**
     * 2. ELECTIVE SUBJECTS
     */
    let allElectivesSelected = true;
    electiveInputs.forEach((input, i) => {
        const subName = input.value.trim();
        const gradeLetter = electiveGradeSelectors[i].options[electiveGradeSelectors[i].selectedIndex].text.trim();
        
        // Validation to ensure user didn't leave an elective empty
        if (!subName || subName === "" || subName.toLowerCase().includes("search")) {
            allElectivesSelected = false;
        } else {
            resultsObject[subName] = gradeLetter;
        }
    });

    if (!allElectivesSelected) {
        alert("Please select all 4 elective subjects.");
        return;
    }

    // UI Feedback
    const btn = e.target.querySelector('button');
    btn.disabled = true;
    btn.innerText = "Analyzing Requirements...";

    try {
        const res = await fetch(`https://api.unimatcher-skynetconsult.com/api/user/check-eligibility`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                userId: activeUserId, 
                programName: programName, 
                results: resultsObject 
            })
        });

        const data = await res.json(); 

        if (res.ok && data.checkId) {
            localStorage.setItem('pending_check_id', data.checkId);
            localStorage.setItem('temp_eligibility', JSON.stringify({
                id: data.checkId,
                program_name: programName
            }));
            window.location.href = "payment.html"; 
        } else {
            throw new Error(data.error || "Analysis failed");
        }
    } catch (err) {
        console.error("Match Error:", err);
        alert("Error: " + err.message);
        btn.disabled = false;
        btn.innerText = "CHECK MATCH & PAY";
    }
});
});