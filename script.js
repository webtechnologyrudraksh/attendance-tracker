let subjects = JSON.parse(localStorage.getItem("attendanceData")) || [];
let attendanceHistory = JSON.parse(localStorage.getItem("attendanceHistory")) || [];
let studentProfile = JSON.parse(localStorage.getItem("studentProfile")) || {
    name: "",
    college: "",
    course: "",
    semester: "",
    branch: "",
    photo: ""
};

function saveProfile() {
    const file = document.getElementById("profilePhoto").files[0];

    function saveData(photo) {
        studentProfile = {
            name: document.getElementById("studentName").value.trim(),
            college: document.getElementById("collegeName").value.trim(),
          category: document.getElementById("courseCategory").value,
            course: document.getElementById("courseName").value.trim(),
            semester: document.getElementById("semesterName").value.trim(),
            branch: document.getElementById("branchName").value.trim(),
            photo: photo
        };

        localStorage.setItem("studentProfile", JSON.stringify(studentProfile));

        showProfile();
        alert("Profile saved successfully!");
    }

    if (file) {
        const reader = new FileReader();

        reader.onload = function(event) {
            saveData(event.target.result);
        };

        reader.readAsDataURL(file);
    } else {
        saveData(studentProfile.photo);
    }
}

function showProfile() {
    const p = studentProfile;

    document.getElementById("displayName").textContent =
        p.name || "Student Name";

    document.getElementById("displayCollege").textContent =
        p.college || "Your College";

    document.getElementById("displayCourse").textContent =
        p.course || "Your Course";

    document.getElementById("displaySemester").textContent =
        p.semester || "Your Semester";
        document.getElementById("studentName").value = p.name || "";
document.getElementById("collegeName").value = p.college || "";

document.getElementById("courseCategory").value = p.category || "";
loadCourses();

document.getElementById("courseName").value = p.course || "";
toggleBranch();

document.getElementById("branchName").value = p.branch || "";
document.getElementById("semesterName").value = p.semester || "";

   const branchElement = document.getElementById("displayBranch");
const branchRow = branchElement.parentElement;

if (p.branch) {
    branchElement.textContent = p.branch;
    branchRow.style.display = "block";
} else {
    branchRow.style.display = "none";
}

    if (p.photo) {
        document.getElementById("profilePreview").innerHTML =
            `<img src="${p.photo}" alt="Profile Photo">`;
    }
}

document.addEventListener("DOMContentLoaded", function() {
    showProfile();
});
function saveSubjects() {
    localStorage.setItem("attendanceData", JSON.stringify(subjects));
}

function addSubject() {

    let name = document.getElementById("subjectName").value.trim();

    if (name === "") {
        alert("Subject name likho");
        return;
    }

    subjects.push({
        name: name,
        present: 0,
        absent: 0
    });

    saveSubjects();

    document.getElementById("subjectName").value = "";

    showSubjects();
}

function markPresent(index) {

    subjects[index].present++;

attendanceHistory.push({
       subject: subjects[index].name,
type: "Present",
date: new Date().toLocaleDateString()
    });  

    localStorage.setItem("attendanceHistory", JSON.stringify(attendanceHistory));

    saveSubjects();

    showSubjects();
}

function markAbsent(index) {

    subjects[index].absent++;

    attendanceHistory.push({
        subject: subjects[index].name,
        type: "Absent",
        date: new Date().toLocaleDateString()
    });

    localStorage.setItem("attendanceHistory",
         JSON.stringify(attendanceHistory));
    saveSubjects();
    showSubjects();
}
function deleteSubject(index) {

    subjects.splice(index, 1);

    saveSubjects();

    showSubjects();
}

function showSubjects() {

    let container = document.getElementById("subjectsContainer");

    container.innerHTML = "";

    subjects.forEach(function(subject, index) {

        let total = subject.present + subject.absent;

        let percentage = 0;

        if (total > 0) {
            percentage = (subject.present / total) * 100;
        }
        let canMiss = 0;

        if (percentage < 75) {
            canMiss = Math.floor((subject.present / 0.75) - total);
        }
        let needToAttend = 0;

if (percentage < 75) {
    needToAttend = Math.ceil((0.75 * total - subject.present) / 0.25);
}

        container.innerHTML += `
            <div class="subject-card">

                <h3>${subject.name}</h3>

                <h2>${percentage.toFixed(2)}%</h2>
                <div class="progress-bar">
<div class="progress-fill ${percentage >= 75 ? 'good' : percentage >= 60 ? 'warning' : 'danger'}" style="width:${Math.min(percentage, 100)}%"></div>
</div>

                <p>Present: ${subject.present}</p>

                <p>Absent: ${subject.absent}</p>

                <p>Total Classes: ${total}</p>
                <h4>Attendance History</h4>
<div class="history">
    ${
        attendanceHistory
        .filter(h => h.subject === subject.name)
        .slice(-5)
        .reverse()
        .map(h => `
            <p>
                ${h.type === "Present" ? "✅" : "❌"}
                ${h.type} - ${h.date}
            </p>
        `)
        .join("")
        || "<p>No attendance history yet.</p>"
    }
</div>

                  <p>
    ${
        percentage >= 75
        ? "🟢 Attendance Good"
        : "🔴 Attendance Low"
    }
</p>
<p>
    ${
        canMiss > 0
        ? "You can miss " + canMiss + " more class(es)"
        : "⚠️ Don't miss the next class"
    }
</p>
<p>
    ${
        percentage < 75
        ? "📈 Attend next " + needToAttend + " class(es) to reach 75%"
        : ""
    }
</p>

                <br>

                <button onclick="markPresent(${index})">
                    Present
                </button>

                <button onclick="markAbsent(${index})">
                    Absent
                </button>
                <button onclick="deleteSubject(${index})">
                    Delete
                </button>

            </div>
        `;
    });

    updateOverall();
}

function updateOverall() {

    let totalPresent = 0;
    let totalClasses = 0;

    subjects.forEach(function(subject) {

        totalPresent += subject.present;

        totalClasses += subject.present + subject.absent;

    });

    let overall = 0;

    if (totalClasses > 0) {
        overall = (totalPresent / totalClasses) * 100;
    }
document.getElementById("totalSubjects").textContent = subjects.length;

let goodCount = 0;
let lowCount = 0;

subjects.forEach(function(subject) {
    let total = subject.present + subject.absent;
    let percentage = total > 0 ? (subject.present / total) * 100 : 0;

    if (percentage >= 75) {
        goodCount++;
    } else {
        lowCount++;
    }
});

document.getElementById("goodSubjects").textContent = goodCount;
document.getElementById("lowSubjects").textContent = lowCount;
    document.getElementById("overallAttendance").innerText =
        overall.toFixed(2) + "%";
}

showSubjects();
const courseData = {

    engineering: {
        "B.Tech": [
            "Computer Science & Engineering",
            "Artificial Intelligence & Machine Learning",
            "Information Technology",
            "Data Science",
            "Cyber Security",
            "Electronics & Communication Engineering",
            "Electrical Engineering",
            "Mechanical Engineering",
            "Civil Engineering",
            "Automobile Engineering",
            "Aerospace Engineering",
            "Biotechnology",
            "Chemical Engineering",
            "Other"
        ],
        "B.E.": [
            "Computer Science & Engineering",
            "Information Technology",
            "Mechanical Engineering",
            "Civil Engineering",
            "Electronics & Communication Engineering",
            "Electrical Engineering",
            "Other"
        ],
        "M.Tech": [
            "Computer Science & Engineering",
            "Artificial Intelligence & Machine Learning",
            "Data Science",
            "Cyber Security",
            "VLSI Design",
            "Structural Engineering",
            "Thermal Engineering",
            "Other"
        ],
        "M.E.": [
            "Computer Engineering",
            "Mechanical Engineering",
            "Civil Engineering",
            "Electronics Engineering",
            "Other"
        ]
    },

    computer: {
        "BCA": [],
        "MCA": [
            "Artificial Intelligence & Machine Learning",
            "Data Science",
            "Cyber Security",
            "Cloud Computing",
            "Software Engineering",
            "Other"
        ],
        "B.Sc Computer Science": [],
        "B.Sc Information Technology": [],
        "BCA (Hons.)": []
    },

    management: {
        "BBA": [
            "Finance",
            "Marketing",
            "Human Resource Management",
            "International Business",
            "Business Analytics",
            "Digital Marketing",
            "Operations Management",
            "Entrepreneurship",
            "Banking & Insurance",
            "Retail Management",
            "Hospitality Management",
            "Other"
        ],
        "MBA": [
            "Finance",
            "Marketing",
            "Human Resource Management",
            "International Business",
            "Business Analytics",
            "Information Technology",
            "Operations Management",
            "Healthcare Management",
            "Banking & Finance",
            "Supply Chain Management",
            "Other"
        ],
        "BMS": [
            "Finance",
            "Marketing",
            "Human Resource Management",
            "International Business",
            "Other"
        ],
        "PGDM": [
            "Finance",
            "Marketing",
            "Human Resource Management",
            "Business Analytics",
            "Operations Management",
            "International Business",
            "Other"
        ]
    },

    commerce: {
        "B.Com": [
            "Accounting & Finance",
            "Banking & Insurance",
            "Financial Markets",
            "Computer Applications",
            "Economics",
            "Other"
        ],
        "B.Com (Hons.)": [
            "Accounting & Finance",
            "Banking & Insurance",
            "Economics",
            "Computer Applications",
            "Other"
        ],
        "M.Com": [
            "Accounting",
            "Finance",
            "Banking",
            "Business Management",
            "Other"
        ]
    },

    medical: {
        "MBBS": [],
        "BDS": [],
        "BAMS": [],
        "BHMS": [],
        "B.Pharm": [],
        "D.Pharm": [],
        "B.Sc Nursing": [],
        "BPT": [],
        "M.Pharm": [],
        "M.Sc Nursing": []
    },

    science: {
        "B.Sc": [
            "Physics",
            "Chemistry",
            "Mathematics",
            "Computer Science",
            "Information Technology",
            "Biotechnology",
            "Microbiology",
            "Zoology",
            "Botany",
            "Physics, Chemistry & Mathematics",
            "Other"
        ],
        "M.Sc": [
            "Physics",
            "Chemistry",
            "Mathematics",
            "Computer Science",
            "Biotechnology",
            "Microbiology",
            "Other"
        ]
    },

    humanities: {
        "B.A.": [
            "English",
            "Hindi",
            "History",
            "Political Science",
            "Geography",
            "Psychology",
            "Sociology",
            "Economics",
            "Public Administration",
            "Other"
        ],
        "M.A.": [
            "English",
            "Hindi",
            "History",
            "Political Science",
            "Psychology",
            "Sociology",
            "Economics",
            "Other"
        ]
    },

    general: {
        "B.A.": [],
        "B.Sc": [],
        "B.Com": [],
        "M.A.": [],
        "M.Sc": [],
        "M.Com": []
    },

    design: {
        "B.Des": [
            "Fashion Design",
            "Graphic Design",
            "Interior Design",
            "Product Design",
            "Communication Design",
            "Industrial Design",
            "UX/UI Design",
            "Other"
        ],
        "M.Des": [
            "Fashion Design",
            "Graphic Design",
            "Product Design",
            "Communication Design",
            "Industrial Design",
            "Other"
        ],
        "B.Arch": [],
        "M.Arch": []
    },

    education: {
        "B.Ed": [],
        "M.Ed": [],
        "B.El.Ed": [],
        "D.El.Ed": [],
        "B.P.Ed": [],
        "M.P.Ed": []
    },

    law: {
        "LL.B": [],
        "LL.M": [],
        "BA LL.B": [],
        "BBA LL.B": [],
        "B.Com LL.B": [],
        "B.Sc LL.B": []
    },

    agriculture: {
        "B.Sc Agriculture": [],
        "M.Sc Agriculture": [],
        "B.Tech Agricultural Engineering": [
            "Agricultural Engineering",
            "Food Technology",
            "Farm Machinery",
            "Other"
        ]
    },

    media: {
        "BJMC": [],
        "MJMC": [],
        "BA Journalism & Mass Communication": [],
        "B.A. Mass Communication": []
    },

    hotel: {
        "BHM": [],
        "BHMCT": [],
        "MHM": [],
        "Hotel Management": []
    }
};

function toggleBranch() {
    const category = document.getElementById("courseCategory").value;
    const course = document.getElementById("courseName").value;

    const branchContainer = document.getElementById("branchContainer");
    const branchSelect = document.getElementById("branchName");

    branchSelect.innerHTML =
        '<option value="">Select Branch / Specialization</option>';

    if (!category || !course) {
        branchContainer.style.display = "none";
        return;
    }

    const branches = courseData[category]?.[course];

    if (!branches || branches.length === 0) {
        branchContainer.style.display = "none";
        return;
    }

    branches.forEach(function(branch) {
        const option = document.createElement("option");
        option.value = branch;
        option.textContent = branch;
        branchSelect.appendChild(option);
    });

    branchContainer.style.display = "block";
}
function loadCourses() {

    const category = document.getElementById("courseCategory").value;
    const courseSelect = document.getElementById("courseName");

    courseSelect.innerHTML = '<option value="">Select Course</option>';
document.getElementById("branchContainer").style.display = "none";
document.getElementById("branchName").innerHTML =
    '<option value="">Select Branch / Specialization</option>';
    const courses = courseData[category];

    if (!courses) {
        toggleBranch();
        return;
    }

    Object.keys(courses).forEach(function(course) {

        const option = document.createElement("option");

        option.value = course;
        option.textContent = course;

        courseSelect.appendChild(option);
    });

    function toggleBranch() {

    const course = document.getElementById("courseName").value;
    const category = document.getElementById("courseCategory").value;

    const branchContainer = document.getElementById("branchContainer");
    const branch = document.getElementById("branchName");

    const branches = courseData[category]?.[course];

    branch.innerHTML = '<option value="">Select Branch / Specialization</option>';

    if (branches && branches.length > 0) {

        branches.forEach(function(item) {
            const option = document.createElement("option");
            option.value = item;
            option.textContent = item;
            branch.appendChild(option);
        });

        branchContainer.style.display = "block";

    } else {

        branchContainer.style.display = "none";
        branch.value = "";
    }
}

}


