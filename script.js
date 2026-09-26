let subjects = JSON.parse(localStorage.getItem("attendanceData")) || [];
let attendanceHistory = JSON.parse(localStorage.getItem("attendanceHistory")) || [];
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