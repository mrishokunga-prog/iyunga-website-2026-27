// ============================
// 1. NAVIGATION (toggle sections)
// ============================
function showPage(pageId, clickedLink) {
    document.querySelectorAll('.page').forEach(function (page) {
        page.classList.remove('active');
    });

    const target = document.getElementById(pageId);
    if (target) {
        target.classList.add('active');
    } else {
        console.warn('Hakuna section yenye id="' + pageId + '"');
    }

    document.querySelectorAll('.nav-link').forEach(function (link) {
        link.classList.remove('active');
    });

    if (clickedLink) {
        clickedLink.classList.add('active');
    } else {
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

window.addEventListener('click', function (event) {
    const modal = document.getElementById('welcomeModal');
    if (event.target === modal) {
        closeModal();
    }
});

window.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// ============================
// 3. STUDENT FORM (Week 2 Day 2) + STUDENTS TABLE (Week 2 Day 3)
// ============================
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

        const studentsList = getStudents();
        studentsList.push(student);
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

function renderStudentsTable(filterText) {
    const tbody = document.getElementById('studentsTableBody');
    const emptyMsg = document.getElementById('noStudentsMsg');
    if (!tbody) return;

    let students = getStudents();

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

    students.forEach(function (student, index) {
        const row = document.createElement('tr');
        row.innerHTML =
            '<td>' + student.regNo + '</td>' +
            '<td>' + student.fullName + '</td>' +
            '<td>' + student.gender + '</td>' +
            '<td>' + student.studentClass + '</td>' +
            '<td class="table-actions">' +
                '<button class="icon-btn edit-btn" title="Edit (coming soon)" disabled><i class="fa-solid fa-pen-to-square"></i></button>' +
                '<button class="icon-btn delete-btn" title="Delete (coming soon)" disabled><i class="fa-solid fa-trash"></i></button>' +
            '</td>';
        tbody.appendChild(row);
    });
}

var studentSearchInput = document.getElementById('studentSearch');
if (studentSearchInput) {
    studentSearchInput.addEventListener('input', function () {
        renderStudentsTable(studentSearchInput.value);
    });
}

const originalShowPage = showPage;
showPage = function (pageId, clickedLink) {
    originalShowPage(pageId, clickedLink);
    if (pageId === 'view-students') {
        renderStudentsTable('');
    }
};