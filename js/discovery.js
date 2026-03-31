const FACULTIES = ["Health & Allied Sciences", "Engineering & Technology", "Business & Economics", "Arts & Social Sciences", "Applied Sciences"];
const ELECTIVE_SUBJECTS = ["Elective Mathematics", "Physics", "Chemistry", "Biology", "Elective ICT", "Applied Electricity", "Electronics", "General Agriculture", "Crop Husbandry and Horticulture", "Animal Husbandry", "Fisheries", "Forestry", "Economics", "Business Management", "Financial Accounting", "Cost Accounting", "Principles of Costing", "Clerical Office Duties", "Typewriting", "Shorthand", "Government", "Geography", "History", "Literature in English", "Christian Religious Studies (CRS)", "Islamic Religious Studies (IRS)", "French", "Arabic", "Ghanaian Language", "General Knowledge in Art (GKA)", "Graphic Design", "Picture Making", "Sculpture", "Ceramics", "Textiles", "Leatherwork", "Basketry", "Jewellery", "Management in Living", "Food and Nutrition", "Clothing and Textiles", "Building Construction", "Wood Technology", "Metal Technology", "Auto Mechanics", "Auto Electricals", "Welding and Fabrication", "Electrical Installation", "Plumbing", "Refrigeration and Air Conditioning"];

// Helper for mapping numbers back to WASSCE letters for the Worker
const gradeLabels = { 1: "A1", 2: "B2", 3: "B3", 4: "C4", 5: "C5", 6: "C6", 7: "D7", 8: "E8", 9: "F9" };

let selectedFaculty = "";

document.addEventListener('DOMContentLoaded', () => {
    initFacultyGrid();
    initGradesForm();
    setupAutoCalc();
});

function initFacultyGrid() {
    const grid = document.getElementById('faculty-grid');
    grid.innerHTML = FACULTIES.map(f => `
        <div class="faculty-card glass p-8 rounded-[2rem] text-center" onclick="selectFaculty('${f}', this)">
            <div class="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-[#003B73]">
                <i class="fas ${getIcon(f)}"></i>
            </div>
            <h3 class="font-bold text-slate-800 text-sm leading-tight">${f}</h3>
        </div>
    `).join('');
}

function getIcon(f) {
    if(f.includes("Health")) return "fa-heartbeat";
    if(f.includes("Engineering")) return "fa-microchip";
    if(f.includes("Business")) return "fa-chart-pie";
    if(f.includes("Arts")) return "fa-palette";
    return "fa-atom";
}

function selectFaculty(f, el) {
    selectedFaculty = f;
    document.querySelectorAll('.faculty-card').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
}

function initGradesForm() {
    const coreNames = ["English Language", "Mathematics (Core)", "Integrated Science", "Social Studies"];
    const coreContainer = document.getElementById('core-inputs-container');
    const electiveContainer = document.getElementById('elective-inputs-container');
    const datalist = document.getElementById('electives-datalist');

    datalist.innerHTML = ELECTIVE_SUBJECTS.map(s => `<option value="${s}">`).join('');

    coreContainer.innerHTML = coreNames.map(c => `
        <div class="space-y-1">
            <label class="text-[10px] font-black text-slate-400 uppercase ml-1">${c}</label>
            <select class="core-select w-full p-4 bg-slate-50 rounded-2xl border-none font-bold text-[#003B73]" data-subject="${c}">
                ${[1,2,3,4,5,6,7,8,9].map(g => `<option value="${g}">${getGradeLabel(g)}</option>`).join('')}
            </select>
        </div>
    `).join('');

    for(let i=1; i<=4; i++) {
        electiveContainer.innerHTML += `
            <div class="flex gap-3">
                <input type="text" list="electives-datalist" placeholder="Search Elective ${i}..." class="elective-name flex-1 p-4 bg-slate-50 rounded-2xl border-none font-bold text-sm">
                <select class="elective-grade w-28 p-4 bg-slate-50 rounded-2xl border-none font-bold text-[#F28C00]">
                    ${[1,2,3,4,5,6,7,8,9].map(g => `<option value="${g}">${getGradeLabel(g)}</option>`).join('')}
                </select>
            </div>
        `;
    }

    const user = JSON.parse(localStorage.getItem('user_info'));
    const nameDisplay = document.getElementById('display-name');
    if (user && nameDisplay) {
        nameDisplay.value = user.name;
    }
}

function getGradeLabel(g) {
    return gradeLabels[g];
}

function setupAutoCalc() {
    document.addEventListener('change', () => {
        const coreGrades = {};
        document.querySelectorAll('.core-select').forEach(s => {
            coreGrades[s.dataset.subject] = parseInt(s.value);
        });

        let coreSum = coreGrades["English Language"] || 9;
        const math = coreGrades["Mathematics (Core)"] || 9;
        const science = coreGrades["Integrated Science"] || 9;
        const social = coreGrades["Social Studies"] || 9;

        if (selectedFaculty === "Arts & Social Sciences" || selectedFaculty === "Business & Economics") {
            coreSum += math;
            coreSum += Math.min(science, social);
        } else {
            coreSum += math;
            coreSum += science;
        }

        const electiveGrades = Array.from(document.querySelectorAll('.elective-grade'))
            .map(s => parseInt(s.value || 9))
            .sort((a, b) => a - b);

        const best3Electives = (electiveGrades[0] || 9) + (electiveGrades[1] || 9) + (electiveGrades[2] || 9);

        const agg = coreSum + best3Electives;
        const display = document.getElementById('live-aggregate');
        if (display) {
            display.innerText = agg.toString().padStart(2, '0');
        }
    });
}

function goToStep(s) {
    if(s === 2 && !selectedFaculty) return alert("Please select a Faculty first!");
    document.querySelectorAll('.step-content').forEach(c => c.classList.remove('active'));
    document.getElementById(`step-${s}`).classList.add('active');
}

document.getElementById('discovery-form').onsubmit = async (e) => {
    e.preventDefault();
    
    const user = JSON.parse(localStorage.getItem('user_info'));
    if (!user) {
        alert("Please log in to continue.");
        return;
    }

    const manualPhone = document.getElementById('student-phone').value.trim();
    if (!manualPhone || manualPhone.length < 10) {
        alert("Please enter a valid WhatsApp number.");
        return;
    }

    const finalAggregate = parseInt(document.getElementById('live-aggregate').innerText);

    const gradesObj = {};

    // 1. Process Cores with Normalization and Label Mapping
    document.querySelectorAll('.core-select').forEach(s => {
        const val = parseInt(s.value);
        gradesObj[s.dataset.subject.trim()] = gradeLabels[val];
    });

    // 2. Process Electives with Trimming and Label Mapping
    const electiveNames = document.querySelectorAll('.elective-name');
    const electiveGrades = document.querySelectorAll('.elective-grade');

    electiveNames.forEach((input, i) => { 
        const cleanedName = input.value.trim();
        if(cleanedName !== "") { 
            const val = parseInt(electiveGrades[i].value);
            gradesObj[cleanedName] = gradeLabels[val]; 
        } 
    });

    const payload = {
        faculty: selectedFaculty,
        aggregate: finalAggregate,
        grades: gradesObj, // Sends letters (e.g., "A1") to match Eligibility Worker
        user_id: user.id || user.userId,
        student_name: user.name,
        phone_number: manualPhone
    };

    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerText;
    submitBtn.innerText = "PROCESSING...";
    submitBtn.disabled = true;

    try {
        const response = await fetch('https://api.unimatcher-skynetconsult.com/api/public/discover', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });
        
        const res = await response.json();
        if(res.success) {
            window.location.href = `payment.html?type=discovery&leadId=${res.leadId}`;
        } else {
            alert("Error: " + (res.message || "Process failed."));
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        }
    } catch(err) { 
        console.error("Discovery Error:", err);
        alert("Network Error."); 
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
    }
};