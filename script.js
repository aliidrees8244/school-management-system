let isEditing = false;
let editingIndex = null;

function registerStudent() {
  const name = document.getElementById('name').value;
  const fatherName = document.getElementById('father').value;
  const studentClass = document.getElementById('class').value;
  const dob = document.getElementById('dob').value;
  const gender = document.getElementById('gender').value;
  const contact = document.getElementById('contact').value;
  const address = document.getElementById('address').value;
  const rollNumber = document.getElementById('roll').value;

  const students = JSON.parse(localStorage.getItem('students')) || [];

  if (isEditing) {
    students[editingIndex] = { name, fatherName, studentClass, dob, gender, contact, address, rollNumber };
    isEditing = false;
    editingIndex = null;
    document.querySelector('button[type="submit"]').textContent = "Register Student";
  } else {
    students.push({ name, fatherName, studentClass, dob, gender, contact, address, rollNumber });
  }

  localStorage.setItem('students', JSON.stringify(students));

  document.getElementById('name').value = '';
  document.getElementById('father').value = '';
  document.getElementById('class').value = '';
  document.getElementById('dob').value = '';
  document.getElementById('gender').value = '';
  document.getElementById('contact').value = '';
  document.getElementById('address').value = '';
  document.getElementById('roll').value = '';

  showStudents();
}

function showStudents() {
  const students = JSON.parse(localStorage.getItem('students')) || [];
  const tableBody = document.querySelector("#studentTable tbody");
  if (!tableBody) return;
  tableBody.innerHTML = "";

  students.forEach((student, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
  <td>${student.rollNumber}</td>
  <td>${student.name}</td>
  <td>${student.fatherName}</td>
  <td>${student.studentClass}</td>
  <td>${student.dob}</td>
  <td>${student.gender}</td>
  <td>${student.contact}</td>
  <td>${student.address}</td>
  <td>
    <button onclick="editStudent(${index})">✏ Edit</button>
    <button onclick="deleteStudent(${index})">🗑 Delete</button>
  </td>
`;
    tableBody.appendChild(row);
  });
}

function deleteStudent(index) {
  const students = JSON.parse(localStorage.getItem('students')) || [];
  students.splice(index, 1);
  localStorage.setItem('students', JSON.stringify(students));
  showStudents();
}

function editStudent(index) {
  const students = JSON.parse(localStorage.getItem('students')) || [];
  const student = students[index];

  document.getElementById('name').value = student.name;
  document.getElementById('father').value = student.fatherName;
  document.getElementById('class').value = student.studentClass;
  document.getElementById('dob').value = student.dob;
  document.getElementById('gender').value = student.gender;
  document.getElementById('contact').value = student.contact;
  document.getElementById('address').value = student.address;
  document.getElementById('roll').value = student.rollNumber || '';

  isEditing = true;
  editingIndex = index;

  document.querySelector('button[type="submit"]').textContent = "Update Student";
}

function searchStudent() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const table = document.getElementById("studentTable");
  const rows = table.getElementsByTagName("tr");

  for (let i = 1; i < rows.length; i++) {
    const rowText = rows[i].innerText.toLowerCase();
    rows[i].style.display = rowText.includes(input) ? "" : "none";
  }
}

function showMarksStudentSelect() {
  const studentList = JSON.parse(localStorage.getItem("students")) || [];
  const marksDiv = document.getElementById("marksSection");
  if (!marksDiv) return;
  marksDiv.innerHTML = "";

  if (studentList.length === 0) {
    marksDiv.innerHTML = "<p>No students found.</p>";
    return;
  }

  let selectHTML = `<h3>Select Student to Add Marks</h3>
    <select id="selectedStudent">
      <option value="">-- Select Student (Name | Class | Roll No) --</option>`;

  studentList.forEach((student, index) => {
    const roll = student.rollNumber || "N/A";
    selectHTML += `<option value="${index}">${student.name} | Class: ${student.studentClass} | Roll#: ${roll}</option>`;
  });

  selectHTML += `</select>
    <button id="btnShowMarksForm">Show Marks Form</button>
    <div id="subjectMarksForm"></div>`;

  marksDiv.innerHTML = selectHTML;

  document.getElementById("btnShowMarksForm")?.addEventListener("click", () => {
    showSubjectMarksForm();
  });
}

function showSubjectMarksForm() {
  const selectedIndex = document.getElementById("selectedStudent").value;
  if (selectedIndex === "") return;

  const studentList = JSON.parse(localStorage.getItem("students")) || [];
  const student = studentList[selectedIndex];
  const formDiv = document.getElementById("subjectMarksForm");

  if (!formDiv) return;

  let formHTML = `<h4>Enter Marks for ${student.name}</h4>
    <label>English:</label><br><input type="number" id="eng"><br><br>
    <label>Urdu:</label><br><input type="number" id="urdu"><br><br>
    <label>Math:</label><br><input type="number" id="math"><br><br>
    <label>Islamiat:</label><br><input type="number" id="isl"><br><br>
    <label>Al-Quran:</label><br><input type="number" id="quran"><br><br>
    <label>G.Science:</label><br><input type="number" id="gsc"><br><br>
    <label>G.K:</label><br><input type="number" id="gk"><br><br>
    <label>Poem:</label><br><input type="number" id="poem"><br><br>
    <label>Physics:</label><br><input type="number" id="phy"><br><br>
    <label>Chemistry:</label><br><input type="number" id="chem"><br><br>
    <label>Computer:</label><br><input type="number" id="comp"><br><br>
    <label>Bio:</label><br><input type="number" id="bio"><br><br>
    <label>Textile & Clothing:</label><br><input type="number" id="textile"><br><br>
    <label>Civics:</label><br><input type="number" id="civics"><br><br>
    <button onclick="saveStudentMarks(${selectedIndex})">Save Marks</button>`;

  formDiv.innerHTML = formHTML;
}

function saveStudentMarks(index) {
  const studentList = JSON.parse(localStorage.getItem("students")) || [];
  const student = studentList[index];

  const marks = {
    english: parseInt(document.getElementById("eng").value) || 0,
    urdu: parseInt(document.getElementById("urdu").value) || 0,
    math: parseInt(document.getElementById("math").value) || 0,
    islamiat: parseInt(document.getElementById("isl").value) || 0,
    quran: parseInt(document.getElementById("quran").value) || 0,
    gsc: parseInt(document.getElementById("gsc").value) || 0,
    gk: parseInt(document.getElementById("gk").value) || 0,
    poem: parseInt(document.getElementById("poem").value) || 0,
    physics: parseInt(document.getElementById("phy").value) || 0,
    chemistry: parseInt(document.getElementById("chem").value) || 0,
    computer: parseInt(document.getElementById("comp").value) || 0,
    bio: parseInt(document.getElementById("bio").value) || 0,
    textile: parseInt(document.getElementById("textile").value) || 0,
    civics: parseInt(document.getElementById("civics").value) || 0
  };

  let totalMarks = 0;
  for (const key in marks) {
    totalMarks += marks[key];
  }

  marks.total = totalMarks;
  marks.percentage = ((totalMarks / (13 * 100)) * 100).toFixed(2);

  const studentMarks = JSON.parse(localStorage.getItem("studentMarks")) || [];

  // 🔁 Check if marks already exist for this roll number
  const existingIndex = studentMarks.findIndex(m => m.rollNumber === student.rollNumber);

  if (existingIndex !== -1) {
    // Update existing
    studentMarks[existingIndex] = { name: student.name, class: student.studentClass, rollNumber: student.rollNumber, ...marks };
  } else {
    // Add new
    studentMarks.push({ name: student.name, class: student.studentClass, rollNumber: student.rollNumber, ...marks });
  }

  localStorage.setItem("studentMarks", JSON.stringify(studentMarks));

  alert("Marks saved for " + student.name);
  document.getElementById("subjectMarksForm").innerHTML = "";
}



function viewStudentMarks() {
  const marksList = JSON.parse(localStorage.getItem("studentMarks")) || [];
  const div = document.getElementById("marksListSection");
  if (!div) return;
  div.innerHTML = "<h3>Student Marks Sheet</h3>";

  if (marksList.length === 0) {
    div.innerHTML += "<p>No marks found.</p>";
    return;
  }

  marksList.forEach((m, index) => {
    div.innerHTML += `
      <div style="border:1px solid #ccc; margin:10px; padding:10px;">
        <strong>${m.name}</strong> (Class ${m.class}, Roll#: ${m.rollNumber})<br>
        English: ${m.english} | Urdu: ${m.urdu} | Math: ${m.math} | Islamiat: ${m.islamiat} | Quran: ${m.quran} | G.Sc: ${m.gsc}<br>
        G.K: ${m.gk} | Poem: ${m.poem} | Physics: ${m.physics} | Chemistry: ${m.chemistry} | Computer: ${m.computer}<br>
        Bio: ${m.bio} | Textile: ${m.textile} | Civics: ${m.civics}<br>
        <strong>Total:</strong> ${m.total} / 1300<br>
        <strong>Percentage:</strong> ${m.percentage}%<br><br>
        <button onclick="editMarks(${index})">Edit Marks</button>
        <button onclick="deleteMarks(${index})">Delete Marks</button>
      </div>
    `;
  });
}
function deleteMarks(index) {
  const studentMarks = JSON.parse(localStorage.getItem("studentMarks")) || [];

  if (!confirm(`Are you sure you want to delete marks for ${studentMarks[index].name}?`)) return;

  studentMarks.splice(index, 1); // remove 1 item at position `index`

  localStorage.setItem("studentMarks", JSON.stringify(studentMarks));

  alert("Marks deleted successfully!");

  viewStudentMarks(); // refresh the list
}
function editMarks(index) {
  const studentMarks = JSON.parse(localStorage.getItem("studentMarks")) || [];
  const markData = studentMarks[index];

  const studentList = JSON.parse(localStorage.getItem("students")) || [];
  const matchedStudentIndex = studentList.findIndex(s => s.rollNumber === markData.rollNumber);

  if (matchedStudentIndex === -1) {
    alert("Student not found in the registered list.");
    return;
  }

  const marksDiv = document.getElementById("marksSection");
  if (!marksDiv) return;

  let formHTML = `<h4>Update Marks for ${markData.name}</h4>
    <label>English:</label><br><input type="number" id="eng" value="${markData.english}"><br><br>
    <label>Urdu:</label><br><input type="number" id="urdu" value="${markData.urdu}"><br><br>
    <label>Math:</label><br><input type="number" id="math" value="${markData.math}"><br><br>
    <label>Islamiat:</label><br><input type="number" id="isl" value="${markData.islamiat}"><br><br>
    <label>Al-Quran:</label><br><input type="number" id="quran" value="${markData.quran}"><br><br>
    <label>G.Science:</label><br><input type="number" id="gsc" value="${markData.gsc}"><br><br>
    <label>G.K:</label><br><input type="number" id="gk" value="${markData.gk}"><br><br>
    <label>Poem:</label><br><input type="number" id="poem" value="${markData.poem}"><br><br>
    <label>Physics:</label><br><input type="number" id="phy" value="${markData.physics}"><br><br>
    <label>Chemistry:</label><br><input type="number" id="chem" value="${markData.chemistry}"><br><br>
    <label>Computer:</label><br><input type="number" id="comp" value="${markData.computer}"><br><br>
    <label>Bio:</label><br><input type="number" id="bio" value="${markData.bio}"><br><br>
    <label>Textile & Clothing:</label><br><input type="number" id="textile" value="${markData.textile}"><br><br>
    <label>Civics:</label><br><input type="number" id="civics" value="${markData.civics}"><br><br>
    <button onclick="updateStudentMarks(${index})">Update Marks</button>`;

  marksDiv.innerHTML = formHTML;
}
function updateStudentMarks(index) {
  const studentMarks = JSON.parse(localStorage.getItem("studentMarks")) || [];
  const markData = studentMarks[index];

  const updatedMarks = {
    english: parseInt(document.getElementById("eng").value) || 0,
    urdu: parseInt(document.getElementById("urdu").value) || 0,
    math: parseInt(document.getElementById("math").value) || 0,
    islamiat: parseInt(document.getElementById("isl").value) || 0,
    quran: parseInt(document.getElementById("quran").value) || 0,
    gsc: parseInt(document.getElementById("gsc").value) || 0,
    gk: parseInt(document.getElementById("gk").value) || 0,
    poem: parseInt(document.getElementById("poem").value) || 0,
    physics: parseInt(document.getElementById("phy").value) || 0,
    chemistry: parseInt(document.getElementById("chem").value) || 0,
    computer: parseInt(document.getElementById("comp").value) || 0,
    bio: parseInt(document.getElementById("bio").value) || 0,
    textile: parseInt(document.getElementById("textile").value) || 0,
    civics: parseInt(document.getElementById("civics").value) || 0,
  };

  let total = 0;
  for (const key in updatedMarks) {
    total += updatedMarks[key];
  }

  const updatedRecord = {
    ...markData,
    ...updatedMarks,
    total: total,
    percentage: ((total / (13 * 100)) * 100).toFixed(2)
  };

  studentMarks[index] = updatedRecord;

  localStorage.setItem("studentMarks", JSON.stringify(studentMarks));

  alert("Marks updated for " + updatedRecord.name);
  document.getElementById("marksSection").innerHTML = "";

  viewStudentMarks();
}

// ✅ Show Attendance Form
function showAttendanceForm() {
    const studentList = JSON.parse(localStorage.getItem("students")) || [];
    const attendanceDiv = document.getElementById("attendanceSection");

    if (!attendanceDiv) return;

    if (studentList.length === 0) {
        attendanceDiv.innerHTML = "<p>No students found.</p>";
        return;
    }

    let formHTML = `<h3>Mark Attendance</h3>
    <form id="attendanceForm" class="student-checklist">`;

    studentList.forEach(student => {
        formHTML += `
            <label>
                <input type="checkbox" name="attendance" value="${student.rollNumber}" checked>
                ${student.name} (${student.studentClass})
            </label>`;
    });

    formHTML += `</form>
        <br><button onclick="saveAttendance()">💾 Save Attendance</button>`;
    
    attendanceDiv.innerHTML = formHTML;
}

function saveAttendance() {
    const checkboxes = document.querySelectorAll('input[name="attendance"]');
    const today = new Date().toLocaleDateString();

    const attendanceRecord = { date: today, present: [], absent: [] };
    const students = JSON.parse(localStorage.getItem("students")) || [];

    checkboxes.forEach(box => {
        const student = students.find(s => s.rollNumber === box.value);
        if (box.checked) {
            attendanceRecord.present.push(student.name);
        } else {
            attendanceRecord.absent.push(student.name);
        }
    });

    let attendanceHistory = JSON.parse(localStorage.getItem("attendanceHistory")) || [];
    attendanceHistory.push(attendanceRecord);
    localStorage.setItem("attendanceHistory", JSON.stringify(attendanceHistory));

    alert("Attendance saved for " + today);
    document.getElementById("attendanceSection").innerHTML = "";
}

function viewAttendanceHistory() {
    const history = JSON.parse(localStorage.getItem("attendanceHistory")) || [];
    const historyDiv = document.getElementById("historySection");
    if (!historyDiv) return;

    historyDiv.innerHTML = "<h3>Attendance History</h3>";

    if (history.length === 0) {
        historyDiv.innerHTML += "<p>No attendance records found.</p>";
        return;
    }

    history.forEach(record => {
        historyDiv.innerHTML += `
            <div class="history-card">
                <strong>Date:</strong> ${record.date}<br>
                <strong>Present:</strong> ${record.present.join(", ")}<br>
                <strong>Absent:</strong> ${record.absent.join(", ")}
            </div>
        `;
    });
}

function downloadAttendanceCSV() {
    const history = JSON.parse(localStorage.getItem("attendanceHistory")) || [];
    if (history.length === 0) {
        alert("No attendance records to download.");
        return;
    }

    let csv = "Date,Present Students,Absent Students\n";
    history.forEach(record => {
        csv += `"${record.date}","${record.present.join(" | ")}","${record.absent.join(" | ")}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "attendance-history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


function generateReportCard() {
  const marksList = JSON.parse(localStorage.getItem("studentMarks")) || [];
  const div = document.getElementById("reportCardSection");
  if (!div) return;

  div.innerHTML = "";

  if (marksList.length === 0) {
    div.innerHTML = "<p>No student marks available.</p>";
    return;
  }

  marksList.forEach((m, index) => {
    const reportId = `report-${index}`;
    const grade = getGrade(m.percentage);
    const remarks = getRemarks(grade);

    div.innerHTML += `
      <div id="${reportId}" style="border:2px solid #000; margin:15px; padding:20px; font-family: 'Segoe UI', sans-serif; background:#fff;">
        <h2 style="text-align:center;">Board of Intermediate and Secondary Education, Lahore</h2>
        <h3 style="text-align:center;">Result Card</h3>
        <hr>
        <p><strong>Student Name:</strong> ${m.name}</p>
        <p><strong>Father's Name:</strong> Not Provided</p>
        <p><strong>Class:</strong> ${m.class}</p>
        <p><strong>Roll Number:</strong> ${m.rollNumber}</p>
        
        <table style="width:100%; border-collapse: collapse; margin-top:20px;" border="1">
          <tr style="background:#f0f0f0;">
            <th>S#</th>
            <th>Subject</th>
            <th>Max Marks</th>
            <th>Obtained Marks</th>
          </tr>
          ${generateSubjectRows(m)}
          <tr>
            <td colspan="2"><strong>Total</strong></td>
            <td><strong>1300</strong></td>
            <td><strong>${m.total}</strong></td>
          </tr>
        </table>

        <p><strong>Percentage:</strong> ${m.percentage}%</p>
        <p><strong>Grade:</strong> ${grade}</p>
        <p><strong>Remarks:</strong> ${remarks}</p>

        <button onclick="printSingleReportCard('${reportId}')">🖨️ Print</button>
        <button onclick="downloadPDF('${reportId}', '${m.name}-ReportCard')">📄 Download PDF</button>
      </div>
    `;
  });
}

function printSingleReportCard(reportId) {
  const reportDiv = document.getElementById(reportId);
  if (!reportDiv) return;

  const printWindow = window.open("", "_blank", "width=800,height=600");
  printWindow.document.write(`
    <html>
      <head>
        <title>Student Report Card</title>
        <style>
          body { font-family: Arial; padding: 20px; }
          table { border-collapse: collapse; width: 100%; }
          table, th, td { border: 1px solid black; padding: 5px; }
          h3 { text-align: center; }
        </style>
      </head>
      <body>
        ${reportDiv.innerHTML}
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function () { window.close(); };
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}
function downloadPDF(reportId, fileName = "report-card") {
  const element = document.getElementById(reportId);
  if (!element) return;

  const opt = {
    margin:       0.5,
    filename:     fileName + '.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(element).save();
}

function downloadAttendanceCSV() {
  const history = JSON.parse(localStorage.getItem("attendanceHistory")) || [];

  if (history.length === 0) {
    alert("No attendance records to download.");
    return;
  }

  let csv = "Date,Present Students,Absent Students\n";

  history.forEach(record => {
    const date = record.date;
    const present = record.present.join(" | ");
    const absent = record.absent.join(" | ");
    csv += `"${date}","${present}","${absent}"\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "attendance-history.csv");
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


function printReportCard() {
    const studentIndex = document.getElementById('studentSelect').value;
    if (!studentIndex) {
        alert("Please select a student first.");
        return;
    }

    const students = JSON.parse(localStorage.getItem('students')) || [];
    const marksData = JSON.parse(localStorage.getItem('studentMarks')) || [];

    const student = students[studentIndex];
    const studentMarks = marksData.find(m => m.rollNumber === student.rollNumber);

    if (!studentMarks) {
        alert("No marks found for this student.");
        return;
    }

    const subjects = [
        { name: "English", key: "english" },
        { name: "Urdu", key: "urdu" },
        { name: "Mathematics", key: "math" },
        { name: "Islamiat", key: "islamiat" },
        { name: "Al-Quran", key: "quran" },
        { name: "General Science", key: "gsc" },
        { name: "General Knowledge", key: "gk" },
        { name: "Poem", key: "poem" },
        { name: "Physics", key: "physics" },
        { name: "Chemistry", key: "chemistry" },
        { name: "Computer", key: "computer" },
        { name: "Biology", key: "bio" },
        { name: "Textile & Clothing", key: "textile" },
        { name: "Civics", key: "civics" }
    ];

    let totalObtained = 0;
    const totalMarks = subjects.length * 100;
    let marksRows = "";

    subjects.forEach((sub, i) => {
        const obtained = studentMarks[sub.key] ?? 0;
        totalObtained += obtained;
        const gradeForSubject = calculateGrade(obtained, 100);
        marksRows += `
            <tr>
                <td>${i + 1}</td>
                <td>${sub.name}</td>
                <td>100</td>
                <td>${obtained}</td>
                <td>${gradeForSubject}</td>
            </tr>
        `;
    });

    const percentage = ((totalObtained / totalMarks) * 100).toFixed(2);
    const grade = getGrade(percentage);
    const remarks = getRemarks(grade);

    const printWindow = window.open("", "_blank", "width=900,height=650");
    printWindow.document.write(`
        <html>
        <head>
            <title>Student Report Card</title>
            <style>
                @page { size: A4; margin: 8mm; }
                body { font-family: 'Times New Roman', serif; margin: 0; padding: 0; }
                .report-wrapper { max-width: 770px; margin: auto; padding: 10px; border: 2px solid black; }
                .report-header { text-align: center; border-bottom: 2px solid black; padding-bottom: 5px; margin-bottom: 10px; }
                .report-header h1 { font-size: 20px; margin: 0; font-weight: bold; text-transform: uppercase; }
                .report-header h2 { font-size: 16px; margin: 2px 0 0; }
                .student-info table, .marks, .summary { width: 100%; border-collapse: collapse; margin-top: 10px; }
                td, th { border: 1px solid black; padding: 4px; font-size: 12px; text-align: center; }
                th { background-color: #f0f0f0; }
                .footer { margin-top: 20px; display: flex; justify-content: space-between; font-size: 12px; }
                .signature { text-align: center; border-top: 1px solid black; width: 150px; padding-top: 3px; }
            </style>
        </head>
        <body>
            <div class="report-wrapper">
                <div class="report-header">
                    <h1>Muslim Educators School Kot Hussain</h1>
                    <h2>Annual Examination Result Card</h2>
                </div>
                <div class="student-info">
                    <table>
                        <tr>
                            <td><strong>Student Name:</strong> ${student.name}</td>
                            <td><strong>Father's Name:</strong> ${student.fatherName}</td>
                        </tr>
                        <tr>
                            <td><strong>Class:</strong> ${student.studentClass}</td>
                            <td><strong>Roll No:</strong> ${student.rollNumber}</td>
                        </tr>
                        <tr>
                            <td><strong>Date of Issue:</strong> ${new Date().toLocaleDateString()}</td>
                            <td></td>
                        </tr>
                    </table>
                </div>
                <table class="marks">
                    <thead>
                        <tr>
                            <th>S#</th>
                            <th>Subject</th>
                            <th>Total Marks</th>
                            <th>Obtained Marks</th>
                            <th>Grade</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${marksRows}
                        <tr>
                            <td colspan="2"><strong>Total</strong></td>
                            <td><strong>${totalMarks}</strong></td>
                            <td><strong>${totalObtained}</strong></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
                <table class="summary">
                    <tr>
                        <td><strong>Percentage:</strong> ${percentage}%</td>
                        <td><strong>Final Grade:</strong> ${grade}</td>
                    </tr>
                    <tr>
                        <td colspan="2"><strong>Remarks:</strong> ${remarks}</td>
                    </tr>
                </table>
                <div class="footer">
                    <div class="signature">Class Teacher</div>
                    <div class="signature">Principal</div>
                    <div class="signature">Exam Controller</div>
                </div>
            </div>
            <script>
                window.onload = function() {
                    window.print();
                    window.onafterprint = function () { window.close(); };
                };
            </script>
        </body>
        </html>
    `);
    printWindow.document.close();
}


function populateReportCardDropdown() {
  const studentList = JSON.parse(localStorage.getItem("students")) || [];
  const select = document.getElementById("reportStudentSelect");

  if (!select) return;

  select.innerHTML = `<option value="">-- Select Student --</option>`;

  studentList.forEach((student) => {
    const option = document.createElement("option");
    option.value = student.rollNumber;
    option.textContent = `${student.name} | Class: ${student.studentClass} | Roll#: ${student.rollNumber}`;
    select.appendChild(option);
  });
}

function downloadReportCardPDF() {
  const reportCardDiv = document.getElementById("reportCardContent");
  if (!reportCardDiv || reportCardDiv.innerHTML.trim() === "") {
    alert("No report card to download.");
    return;
  }

  const opt = {
    margin:       0.5,
    filename:     'report-card.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  html2pdf().from(reportCardDiv).set(opt).save();
}

window.addEventListener("DOMContentLoaded", function () {
  showStudents();
  populateReportCardDropdown(); // ✅ Add this
  document.getElementById("btnGenerateReportCard")?.addEventListener("click", generateReportCard);
  document.getElementById("btnAttendance")?.addEventListener("click", showAttendanceForm);
  document.getElementById("btnAttendanceHistory")?.addEventListener("click", viewAttendanceHistory);
  document.getElementById("btnAttendanceCSV")?.addEventListener("click", downloadAttendanceCSV);
  document.getElementById("btnAddMarks")?.addEventListener("click", showMarksStudentSelect);
  document.getElementById("btnViewMarks")?.addEventListener("click", viewStudentMarks);
});
function getGrade(percentage) {
  const p = parseFloat(percentage);
  if (p >= 80) return "A+";
  else if (p >= 70) return "A";
  else if (p >= 60) return "B";
  else if (p >= 50) return "C";
  else if (p >= 40) return "D";
  else return "Fail";
}

function getRemarks(grade) {
  switch (grade) {
    case "A+": return "Excellent";
    case "A": return "Very Good";
    case "B": return "Good";
    case "C": return "Satisfactory";
    case "D": return "Needs Improvement";
    case "Fail": return "Fail - Repeat Recommended";
    default: return "";
  }
}
function calculateGrade(obtained, total) {
    const percentage = (obtained / total) * 100;
    if (percentage >= 80) return "A+";
    if (percentage >= 70) return "A";
    if (percentage >= 60) return "B";
    if (percentage >= 50) return "C";
    if (percentage >= 40) return "D";
    return "F";
}


function generateSubjectRows(marks) {
  const subjects = [
    { name: "English", key: "english" },
    { name: "Urdu", key: "urdu" },
    { name: "Mathematics", key: "math" },
    { name: "Islamiat", key: "islamiat" },
    { name: "Al-Quran", key: "quran" },
    { name: "General Science", key: "gsc" },
    { name: "General Knowledge", key: "gk" },
    { name: "Poem", key: "poem" },
    { name: "Physics", key: "physics" },
    { name: "Chemistry", key: "chemistry" },
    { name: "Computer", key: "computer" },
    { name: "Biology", key: "bio" },
    { name: "Textile & Clothing", key: "textile" },
    { name: "Civics", key: "civics" }
  ];

  return subjects.map((sub, i) => {
    const obtained = marks[sub.key] ?? 0;
    return `
      <tr>
        <td>${i + 1}</td>
        <td>${sub.name}</td>
        <td>100</td>
        <td>${obtained}</td>
      </tr>
    `;
  }).join('');
}
function loadStudentsForReportCard() {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const studentSelect = document.getElementById('studentSelect');
    if (!studentSelect) return; // Only run if on report-card.html
    studentSelect.innerHTML = '<option value="">Select Student</option>';
    
    students.forEach((student, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${student.name} (${student.class})`;
        studentSelect.appendChild(option);
    });
}

function loadStudentsForReportCard() {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const studentSelect = document.getElementById('studentSelect');
    if (!studentSelect) return;
    studentSelect.innerHTML = '<option value="">Select Student</option>';
    
    students.forEach((student, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${student.name} (${student.studentClass})`;
        studentSelect.appendChild(option);
    });
}

// ✅ Fixed generateReportCard()

function generateReportCard() {
    const studentIndex = document.getElementById('studentSelect').value;
    if (studentIndex === "") {
        alert("Please select a student.");
        return;
    }

    const students = JSON.parse(localStorage.getItem('students')) || [];
    const marksData = JSON.parse(localStorage.getItem('studentMarks')) || [];

    const student = students[studentIndex];
    const studentMarks = marksData.find(m => m.rollNumber === student.rollNumber);

    // Fill student info
    document.getElementById('studentName').textContent = student.name;
    document.getElementById('fatherName').textContent = student.fatherName;
    document.getElementById('studentClass').textContent = student.studentClass;
    document.getElementById('rollNo').textContent = student.rollNumber || "N/A";
    document.getElementById('issueDate').textContent = new Date().toLocaleDateString();

    const tableBody = document.querySelector("#marksTable tbody");
    tableBody.innerHTML = "";

    if (!studentMarks) {
        tableBody.innerHTML = `<tr><td colspan="4">No marks found for this student.</td></tr>`;
        document.getElementById("totalMarks").textContent = "";
        document.getElementById("obtainedMarks").textContent = "";
        document.getElementById("percentage").textContent = "";
        document.getElementById("grade").textContent = "";
        document.getElementById("remarks").textContent = "";
        return;
    }

    const subjects = [
        { name: "English", key: "english" },
        { name: "Urdu", key: "urdu" },
        { name: "Mathematics", key: "math" },
        { name: "Islamiat", key: "islamiat" },
        { name: "Al-Quran", key: "quran" },
        { name: "General Science", key: "gsc" },
        { name: "General Knowledge", key: "gk" },
        { name: "Poem", key: "poem" },
        { name: "Physics", key: "physics" },
        { name: "Chemistry", key: "chemistry" },
        { name: "Computer", key: "computer" },
        { name: "Biology", key: "bio" },
        { name: "Textile & Clothing", key: "textile" },
        { name: "Civics", key: "civics" }
    ];

    let totalObtained = 0;
    const totalMarks = subjects.length * 100;

    subjects.forEach((sub, i) => {
    const obtained = studentMarks[sub.key] ?? 0;
    totalObtained += obtained;

    // ✅ Calculate grade for each subject
    const gradeForSubject = calculateGrade(obtained, 100);

    const row = `
        <tr>
            <td>${i + 1}</td>
            <td>${sub.name}</td>
            <td>100</td>
            <td>${obtained}</td>
            <td>${gradeForSubject}</td>
        </tr>
    `;
    tableBody.innerHTML += row;
});


    const percentage = ((totalObtained / totalMarks) * 100).toFixed(2);
    const grade = getGrade(percentage);
    const remarks = getRemarks(grade);

    // Fill summary fields
    document.getElementById("totalMarks").textContent = totalMarks;
    document.getElementById("obtainedMarks").textContent = totalObtained;
    document.getElementById("percentage").textContent = percentage;
    document.getElementById("grade").textContent = grade;
    document.getElementById("remarks").textContent = remarks;
}


function downloadPDF() {
    const element = document.getElementById("reportCardContent");
    if (!element || element.innerHTML.trim() === "") {
        alert("No report card to download.");
        return;
    }

    const opt = {
        margin: 0.2, // Smaller margin for more space
        filename: 'ReportCard.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 3, useCORS: true, scrollY: 0 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
}
function logout() {
    if (confirm("Are you sure you want to log out?")) {
        // Clear all saved data
        localStorage.clear();

        // Redirect to login page
        window.location.href = "login.html";
    }
}
/* =========================
   FEE MANAGEMENT FUNCTIONS
========================= */

// Load student dropdown
function loadStudentDropdown() {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const select = document.getElementById('studentSelect');
    if (!select) return;

    select.innerHTML = '<option value="">-- Select Student --</option>';
    students.forEach(s => {
        select.innerHTML += `<option value="${s.rollNumber}">${s.name} (${s.studentClass})</option>`;
    });

    updateFeeStats();
}

// Save fee record
function saveFee() {
    const rollNumber = document.getElementById('studentSelect').value;
    const month = document.getElementById('month').value;
    const amount = document.getElementById('amount').value;
    const status = document.getElementById('status').value;

    const students = JSON.parse(localStorage.getItem('students')) || [];
    const student = students.find(s => s.rollNumber === rollNumber);

    if (!student) {
        showNotification("Student not found. Please register first.", "error");
        return;
    }

    let fees = JSON.parse(localStorage.getItem('fees')) || [];
    fees.push({ rollNumber, name: student.name, month, amount, status });
    localStorage.setItem('fees', JSON.stringify(fees));

    displayFees();
    updateFeeStats();
    document.getElementById('feeForm').reset();
    showNotification("Fee record saved successfully!", "success");
}

// Display fees in table
function displayFees(filteredData = null) {
    const fees = filteredData || JSON.parse(localStorage.getItem('fees')) || [];
    const tbody = document.querySelector('#feeTable tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    fees.forEach((f, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${f.rollNumber}</td>
                <td>${f.name}</td>
                <td>${f.month}</td>
                <td>${f.amount}</td>
                <td>${f.status}</td>
                <td>
                    <button class="action-btn edit-btn" onclick="editFee(${index})">✏ Edit</button>
                    <button class="action-btn delete-btn" onclick="deleteFee(${index})">🗑 Delete</button>
                </td>
            </tr>
        `;
    });
}

// Filter Fee Records by Date Range
function filterFeeRecords() {
    const start = document.getElementById('startDate').value;
    const end = document.getElementById('endDate').value;

    if (!start || !end) {
        alert("Please select both start and end months.");
        return;
    }

    const fees = JSON.parse(localStorage.getItem('fees')) || [];
    const filtered = fees.filter(fee => {
        return fee.month >= start && fee.month <= end;
    });

    displayFees(filtered);
}

// Reset Fee Filter
function resetFeeFilter() {
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
    displayFees();
}

// Updated displayFees() to accept optional data
function displayFees(data = null) {
    const fees = data || JSON.parse(localStorage.getItem('fees')) || [];
    const tbody = document.querySelector('#feeTable tbody');
    tbody.innerHTML = '';
    fees.forEach(f => {
        tbody.innerHTML += `
            <tr>
                <td>${f.rollNumber}</td>
                <td>${f.name}</td>
                <td>${f.month}</td>
                <td>${f.amount}</td>
                <td>${f.status}</td>
            </tr>
        `;
    });
}

// Edit fee record
function editFee(index) {
    const fees = JSON.parse(localStorage.getItem('fees')) || [];
    const fee = fees[index];

    document.getElementById('studentSelect').value = fee.rollNumber;
    document.getElementById('month').value = fee.month;
    document.getElementById('amount').value = fee.amount;
    document.getElementById('status').value = fee.status;

    // Remove existing fee entry
    fees.splice(index, 1);
    localStorage.setItem('fees', JSON.stringify(fees));
    displayFees();
}

// Delete fee record
function deleteFee(index) {
    let fees = JSON.parse(localStorage.getItem('fees')) || [];
    fees.splice(index, 1);
    localStorage.setItem('fees', JSON.stringify(fees));
    displayFees();
    updateFeeStats();
    showNotification("Fee record deleted!", "success");
}

// Search fees by name
function searchFees() {
    const searchValue = document.getElementById('searchFee').value.toLowerCase();
    const fees = JSON.parse(localStorage.getItem('fees')) || [];
    const filtered = fees.filter(f => f.name.toLowerCase().includes(searchValue));
    displayFees(filtered);
}

// Filter by status
function filterFees() {
    const status = document.getElementById('filterStatus').value;
    const fees = JSON.parse(localStorage.getItem('fees')) || [];
    const filtered = status ? fees.filter(f => f.status === status) : fees;
    displayFees(filtered);
}

// Show notification
function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = "block";

    setTimeout(() => {
        notification.style.display = "none";
    }, 3000);
}

// Update top stats
function updateFeeStats() {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const fees = JSON.parse(localStorage.getItem('fees')) || [];

    const totalStudents = students.length;
    const collected = fees.filter(f => f.status === "Paid").reduce((sum, f) => sum + parseFloat(f.amount || 0), 0);
    const pending = fees.filter(f => f.status === "Unpaid").reduce((sum, f) => sum + parseFloat(f.amount || 0), 0);

    document.getElementById('statTotalStudents').textContent = totalStudents;
    document.getElementById('statCollected').textContent = collected;
    document.getElementById('statPending').textContent = pending;
}

// Download Fee Report PDF
function downloadFeePDF() {
    const element = document.querySelector('.main'); // main content
    const opt = {
        margin: 0.5,
        filename: 'Fee-Report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().from(element).set(opt).save();
}


function viewExamDetails(index) {
  localStorage.setItem("selectedExamIndex", index);
  window.location.href = "view-exam-details.html";
}
// === Exam Report Table Loader ===
function loadExamReport() {
  const examTableBody = document.querySelector('#examReportTable tbody');
  const exams = JSON.parse(localStorage.getItem('exams')) || [];

  if (exams.length === 0) {
    alert("No exam data found. Redirecting to Add Exam page...");
    window.location.href = "add-exam.html";
    return;
  }

  exams.forEach((exam, index) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${exam.name}</td>
      <td>${exam.class}</td>
      <td>${exam.date}</td>
      <td>${exam.papers ? exam.papers.length : 0}</td>
      <td>
        <button onclick="viewExamDetails(${index})">View</button>
      </td>
    `;

    examTableBody.appendChild(row);
  });
}

// Call this function only when on exam-report.html
if (window.location.href.includes("exam-report.html")) {
  loadExamReport();
}

// View Button Action - store exam index to view full details later
function viewExamDetails(index) {
  localStorage.setItem("selectedExamIndex", index);
  window.location.href = "view-exam-details.html";
}

function logout() {
  sessionStorage.removeItem('loggedInUser'); // Clear login session
  window.location.href = 'login.html';       // Redirect to login page
}

// Load data on page load
window.addEventListener("DOMContentLoaded", () => {
    loadStudentDropdown();
    displayFees();
});


window.onload = loadStudentsForReportCard;

