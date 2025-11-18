// script.js - Generated based on HTML structure for ROJGAR FreelancerHub

// Sample freelancers data (in a real app, fetch from API)
const freelancers = [
    { id: 1, name: 'Alice Johnson', skills: ['JavaScript'], rating: 4.8, avatar: 'https://via.placeholder.com/50' },
    { id: 2, name: 'Bob Smith', skills: ['Python'], rating: 4.5, avatar: 'https://via.placeholder.com/50' },
    { id: 3, name: 'Charlie Brown', skills: ['UI/UX'], rating: 4.9, avatar: 'https://via.placeholder.com/50' },
    { id: 4, name: 'Diana Prince', skills:  ['Node.js'], rating: 4.7, avatar: 'https://via.placeholder.com/50' },
    { id: 5, name: 'Eve Wilson', skills: ['Python'], rating: 4.6, avatar: 'https://via.placeholder.com/50' }
];

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initMobileMenu();
    initFreelancerSearch();
    initProjectForm();
    initDashboard();
    loadFreelancers();
    loadTasks();
    updateYear();
});

// Navigation between views
function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-nav');
            showView(target);
        });
    });
}

function showView(viewId) {
    const views = document.querySelectorAll('.view');
    views.forEach(view => view.classList.add('hidden'));
    document.getElementById(`view-${viewId}`).classList.remove('hidden');
}

// Mobile menu toggle
function initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// Freelancer search and filtering
function initFreelancerSearch() {
    const searchInput = document.getElementById('freelancerSearch');
    const skillSelect = document.getElementById('freelancerSkill');
    const clearBtn = document.getElementById('clearFreelancerFilters');

    // Populate skill options
    const skills = [...new Set(freelancers.flatMap(f => f.skills))];
    skills.forEach(skill => {
        const option = document.createElement('option');
        option.value = skill;
        option.textContent = skill;
        skillSelect.appendChild(option);
    });

    // Event listeners
    searchInput.addEventListener('input', filterFreelancers);
    skillSelect.addEventListener('change', filterFreelancers);
    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        skillSelect.value = '';
        filterFreelancers();
    });
}

function filterFreelancers() {
    const searchTerm = document.getElementById('freelancerSearch').value.toLowerCase();
    const selectedSkill = document.getElementById('freelancerSkill').value;
    const filtered = freelancers.filter(f => {
        const matchesSearch = f.name.toLowerCase().includes(searchTerm) || f.skills.some(s => s.toLowerCase().includes(searchTerm));
        const matchesSkill = !selectedSkill || f.skills.includes(selectedSkill);
        return matchesSearch && matchesSkill;
    });
    renderFreelancers(filtered);
}

function loadFreelancers() {
    renderFreelancers(freelancers);
}

function renderFreelancers(list) {
    const grid = document.getElementById('freelancerGrid');
    const noMsg = document.getElementById('noFreelancersMsg');
    grid.innerHTML = '';
    if (list.length === 0) {
        noMsg.classList.remove('hidden');
        return;
    }
    noMsg.classList.add('hidden');
    list.forEach(f => {
        const card = document.createElement('div');
        card.className = 'rounded-xl border bg-white p-4';
        card.innerHTML = `
            <img src="${f.avatar}" alt="${f.name}" class="h-12 w-12 rounded-full mb-3">
            <h4 class="font-semibold">${f.name}</h4>
            <p class="text-sm text-slate-600">${f.skills.join(', ')}</p>
            <p class="text-sm text-yellow-500">Rating: ${f.rating}</p>
            <button class="mt-2 rounded-md bg-blue-500 px-3 py-1 text-white text-sm hover:bg-blue-600">Hire</button>
        `;
        grid.appendChild(card);
    });
}

// Project form submission
function initProjectForm() {
    const form = document.getElementById('projectForm');
    const msg = document.getElementById('projectFormMsg');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = new FormData(form);
        const project = {
            id: Date.now(),
            title: data.get('title'),
            description: data.get('description'),
            budget: data.get('budget'),
            deadline: data.get('deadline'),
            status: 'pending'
        };
        saveTask(project);
        msg.classList.remove('hidden');
        form.reset();
        setTimeout(() => msg.classList.add('hidden'), 3000);
        loadTasks();
    });
}

// Dashboard management
function initDashboard() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.getAttribute('data-tab');
            showTab(tab);
        });
    });
}

function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab-view');
    tabs.forEach(tab => tab.classList.add('hidden'));
    document.getElementById(`tab-${tabId}`).classList.remove('hidden');
}

function saveTask(task) {
    const tasks = JSON.parse(localStorage.getItem('rojgarTasks') || '[]');
    tasks.push(task);
    localStorage.setItem('rojgarTasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('rojgarTasks') || '[]');
    const pending = tasks.filter(t => t.status === 'pending');
    const completed = tasks.filter(t => t.status === 'completed');
    const finished = tasks.filter(t => t.status === 'finished');

    renderTasks('pending', pending);
    renderTasks('completed', completed);
    renderTasks('finished', finished);

    updateCounts(pending.length, completed.length, finished.length);
}

function renderTasks(type, list) {
    const listEl = document.getElementById(`${type}List`);
    const emptyEl = document.getElementById(`empty${type.charAt(0).toUpperCase() + type.slice(1)}`);
    listEl.innerHTML = '';
    if (list.length === 0) {
        emptyEl.classList.remove('hidden');
        return;
    }
    emptyEl.classList.add('hidden');
    list.forEach(task => {
        const item = document.createElement('div');
        item.className = 'rounded-md border p-3';
        item.innerHTML = `
            <h4 class="font-semibold">${task.title}</h4>
            <p class="text-sm text-slate-600">${task.description}</p>
            <p class="text-sm">Budget: $${task.budget} | Deadline: ${task.deadline}</p>
            ${type === 'pending' ? `<button onclick="markCompleted(${task.id})" class="mt-2 rounded-md bg-green-500 px-3 py-1 text-white text-sm hover:bg-green-600">Mark Done</button>` : ''}
            ${type === 'completed' ? `<button onclick="markFinished(${task.id})" class="mt-2 rounded-md bg-purple-500 px-3 py-1 text-white text-sm hover:bg-purple-600">Finish</button>` : ''}
        `;
        listEl.appendChild(item);
    });
}

function markCompleted(id) {
    updateTaskStatus(id, 'completed');
}

function markFinished(id) {
    updateTaskStatus(id, 'finished');
}

function updateTaskStatus(id, status) {
    const tasks = JSON.parse(localStorage.getItem('rojgarTasks') || '[]');
    const task = tasks.find(t => t.id === id);
    if (task) task.status = status;
    localStorage.setItem('rojgarTasks', JSON.stringify(tasks));
    loadTasks();
}

function updateCounts(pending, completed, finished) {
    document.getElementById('pendingCount').textContent = pending;
    document.getElementById('completedCount').textContent = completed;
    document.getElementById('finishedCount').textContent = finished;
}

// Footer year
function updateYear() {
    document.getElementById('year').textContent = new Date().getFullYear();
}
