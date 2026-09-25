// ============================
// 1. NAVIGATION (toggle sections)
// ============================
function showPage(pageId, clickedLink) {
    // Ficha sections zote
    document.querySelectorAll('.page').forEach(function (page) {
        page.classList.remove('active');
    });

    // Onyesha section iliyochaguliwa
    const target = document.getElementById(pageId);
    if (target) {
        target.classList.add('active');
    } else {
        console.warn('Hakuna section yenye id="' + pageId + '"');
    }

    // Sasisha "active" state kwenye nav links
    document.querySelectorAll('.nav-link').forEach(function (link) {
        link.classList.remove('active');
    });

    if (clickedLink) {
        clickedLink.classList.add('active');
    } else {
        // Ikitolewa na button (siyo link), tafuta link inayolingana
        const matchingLink = document.querySelector('.nav-link[href="#' + pageId + '"]');
        if (matchingLink) matchingLink.classList.add('active');
    }
}

// ============================
// 2. MODAL (welcome message)
// ============================
function welcomeMessage() {
    document.getElementById('welcomeModal').classList.add('show');
}

function closeModal() {
    document.getElementById('welcomeModal').classList.remove('show');
}

// Funga modal ukibonyeza nje ya box
window.addEventListener('click', function (event) {
    const modal = document.getElementById('welcomeModal');
    if (event.target === modal) {
        closeModal();
    }
});

// Funga modal kwa kitufe cha Escape
window.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// ============================
// 3. STUDENT FORM (Week 2 Day 2) + STUDENTS TABLE (Week 2 Day 3)
// ============================
// Persisted storage using localStorage (no real backend yet - comes in Week 3)
function getStudents() {
    const data = localStorage.getItem('iyunga_students');
    return data ? JSON.parse(data) : [];
}

function saveStudents(list) {
    localStorage.setItem('iyunga_students', JSON.stringify(list));
}

var studentForm = document.getElementById('studentForm');
if (studentForm) {
    studentForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const student = {
            regNo: document.getElementById('regNo').value,
            fullName: document.getElementById('fullName').value,
            gender: document.getElementById('gender').value,
            studentClass: document.getElementById('studentClass').value
        };

        const editIndexField = document.getElementById('editIndex');
        const editIndex = parseInt(editIndexField.value, 10);
        const studentsList = getStudents();

        if (editIndex >= 0) {
            // Update existing student (Week 2 Day 4)
            studentsList[editIndex] = student;
            editIndexField.value = -1;
            document.getElementById('formHeading').textContent = 'Add New Student';
            document.getElementById('submitBtn').textContent = 'Save Student';
        } else {
            // Add new student
            studentsList.push(student);
        }

        saveStudents(studentsList);

        const successMsg = document.getElementById('formSuccessMsg');
        successMsg.textContent = 'Student "' + student.fullName + '" saved successfully!';
        successMsg.classList.add('show');

        studentForm.reset();

        setTimeout(function () {
            successMsg.classList.remove('show');
        }, 3000);
    });
}

// ---- Reset the form back to "Add" mode (used when opening via dashboard, not edit) ----
function resetAddStudentForm() {
    const form = document.getElementById('studentForm');
    if (form) form.reset();
    document.getElementById('editIndex').value = -1;
    document.getElementById('formHeading').textContent = 'Add New Student';
    document.getElementById('submitBtn').textContent = 'Save Student';
}

// ---- Edit a student (Week 2 Day 4) ----
function editStudent(index) {
    const studentsList = getStudents();
    const student = studentsList[index];
    if (!student) return;

    document.getElementById('regNo').value = student.regNo;
    document.getElementById('fullName').value = student.fullName;
    document.getElementById('gender').value = student.gender;
    document.getElementById('studentClass').value = student.studentClass;
    document.getElementById('editIndex').value = index;
    document.getElementById('formHeading').textContent = 'Update Student';
    document.getElementById('submitBtn').textContent = 'Update Student';

    showPage('add-student');
}

// ---- Delete a student (Week 2 Day 4) ----
function deleteStudent(index) {
    const studentsList = getStudents();
    const student = studentsList[index];
    if (!student) return;

    const confirmed = confirm('Are you sure you want to delete "' + student.fullName + '"?');
    if (!confirmed) return;

    studentsList.splice(index, 1);
    saveStudents(studentsList);
    renderStudentsTable(document.getElementById('studentSearch') ? document.getElementById('studentSearch').value : '');
}

// ---- Render the students table (Week 2 Day 3) ----
function renderStudentsTable(filterText) {
    const tbody = document.getElementById('studentsTableBody');
    const emptyMsg = document.getElementById('noStudentsMsg');
    if (!tbody) return;

    let students = getStudents();

    // Tag each student with its original index BEFORE filtering,
    // so edit/delete still target the correct record in the full list.
    students = students.map(function (s, i) {
        return Object.assign({}, s, { _originalIndex: i });
    });

    if (filterText) {
        const search = filterText.toLowerCase();
        students = students.filter(function (s) {
            return s.fullName.toLowerCase().includes(search) ||
                   s.regNo.toLowerCase().includes(search) ||
                   s.studentClass.toLowerCase().includes(search);
        });
    }

    tbody.innerHTML = '';

    if (students.length === 0) {
        if (emptyMsg) emptyMsg.style.display = 'block';
        return;
    }
    if (emptyMsg) emptyMsg.style.display = 'none';

    students.forEach(function (student) {
        const row = document.createElement('tr');
        row.innerHTML =
            '<td>' + student.regNo + '</td>' +
            '<td>' + student.fullName + '</td>' +
            '<td>' + student.gender + '</td>' +
            '<td>' + student.studentClass + '</td>' +
            '<td class="table-actions">' +
                '<button class="icon-btn edit-btn active-icon" title="Edit" onclick="editStudent(' + student._originalIndex + ')"><i class="fa-solid fa-pen-to-square"></i></button>' +
                '<button class="icon-btn delete-btn active-icon" title="Delete" onclick="deleteStudent(' + student._originalIndex + ')"><i class="fa-solid fa-trash"></i></button>' +
            '</td>';
        tbody.appendChild(row);
    });
}

// Search box filter
var studentSearchInput = document.getElementById('studentSearch');
if (studentSearchInput) {
    studentSearchInput.addEventListener('input', function () {
        renderStudentsTable(studentSearchInput.value);
    });
}

// Re-render table every time the "View Students" page is opened
const originalShowPage = showPage;
showPage = function (pageId, clickedLink) {
    originalShowPage(pageId, clickedLink);
    if (pageId === 'view-students') {
        renderStudentsTable('');
    }
};