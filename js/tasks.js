// Task management logic for TaskWave
import { showToast, showLoadingScreen, hideLoadingScreen } from './ui.js';
import { handleLogout } from './auth.js';

// Task state
let tasks = [];
let currentFilter = 'all';
let currentSort = 'date-created';

// DOM Elements
const taskList = document.getElementById('task-list');
const addTaskBtn = document.getElementById('add-task-btn');
const taskModal = document.getElementById('task-modal');
const closeTaskModal = document.getElementById('close-task-modal');
const taskForm = document.getElementById('task-form');
const logoutBtn = document.getElementById('logout-btn');

// Initialize Tasks
export function initTasks() {
    // Load tasks based on user state
    loadTasks();
    
    // Set up event listeners
    addTaskBtn?.addEventListener('click', () => openTaskModal());
    closeTaskModal?.addEventListener('click', () => closeTaskModal());
    taskForm?.addEventListener('submit', handleTaskSubmit);
    logoutBtn?.addEventListener('click', handleLogout);
    
    // Filter and sort controls
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentFilter = btn.dataset.filter;
            updateTaskFilters();
            renderTaskList();
        });
    });
    
    document.querySelectorAll('.sort-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentSort = btn.dataset.sort;
            updateTaskSorts();
            renderTaskList();
        });
    });
    
    // Initial render
    renderTaskList();
}

// Load tasks from storage
function loadTasks() {
    // In a real app, you would load from Firebase for logged-in users
    // For demo, we'll use localStorage for guest mode
    const storedTasks = localStorage.getItem('guestTasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    } else {
        // Default demo tasks
        tasks = [
            {
                id: '1',
                title: 'Welcome to TaskWave',
                description: 'Start by adding your first task',
                dueDate: '',
                completed: false,
                important: false,
                createdAt: new Date().toISOString()
            },
            {
                id: '2',
                title: 'Explore features',
                description: 'Check out all the cool features',
                dueDate: '',
                completed: true,
                important: false,
                createdAt: new Date(Date.now() - 86400000).toISOString()
            }
        ];
        saveTasks();
    }
}

// Save tasks to storage
function saveTasks() {
    // In a real app, you would save to Firebase for logged-in users
    localStorage.setItem('guestTasks', JSON.stringify(tasks));
}

// Render the dashboard
export function renderDashboard() {
    const dashboardPage = document.getElementById('dashboard-page');
    if (!dashboardPage) return;
    
    const isGuest = !currentUser;
    
    dashboardPage.innerHTML = `
        <div class="page-transition">
            <header class="flex justify-between items-center mb-8">
                <h1 class="text-3xl font-bold text-gray-800 dark:text-white">
                    <span class="text-indigo-600 dark:text-indigo-400">Task</span>Wave
                    ${isGuest ? '<span class="text-sm ml-2 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">Guest Mode</span>' : ''}
                </h1>
                <div class="flex items-center space-x-4">
                    <button id="theme-toggle" class="p-2 rounded-full bg-white dark:bg-gray-700 shadow-md hover:shadow-lg transition-all duration-300">
                        <i class="fas fa-moon text-gray-700 dark:text-yellow-300"></i>
                        <i class="fas fa-sun text-yellow-400 dark:text-gray-400 hidden"></i>
                    </button>
                    <button id="logout-btn" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300 shadow-md">
                        ${isGuest ? 'Exit Guest Mode' : 'Logout'}
                    </button>
                </div>
            </header>
            
            <div class="dashboard-content bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
                <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                    <h2 class="text-2xl font-bold text-gray-800 dark:text-white">
                        ${currentUser ? `Welcome, ${currentUser.displayName || 'User'}` : 'My Tasks'}
                    </h2>
                    <div class="flex flex-col sm:flex-row gap-3">
                        <button id="add-task-btn" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300 flex items-center justify-center">
                            <i class="fas fa-plus mr-2"></i>Add Task
                        </button>
                        <div class="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                            <button data-filter="all" class="filter-btn px-3 py-1 rounded-md text-sm font-medium ${currentFilter === 'all' ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300'}">All</button>
                            <button data-filter="active" class="filter-btn px-3 py-1 rounded-md text-sm font-medium ${currentFilter === 'active' ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300'}">Active</button>
                            <button data-filter="completed" class="filter-btn px-3 py-1 rounded-md text-sm font-medium ${currentFilter === 'completed' ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300'}">Completed</button>
                        </div>
                    </div>
                </div>
                
                <div class="mb-4 flex items-center overflow-x-auto pb-2">
                    <span class="text-sm text-gray-600 dark:text-gray-300 mr-2">Sort by:</span>
                    <div class="flex space-x-2">
                        <button data-sort="date-created" class="sort-btn text-xs px-3 py-1 rounded-full ${currentSort === 'date-created' ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}">Newest</button>
                        <button data-sort="due-date" class="sort-btn text-xs px-3 py-1 rounded-full ${currentSort === 'due-date' ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}">Due Date</button>
                        <button data-sort="alphabetical" class="sort-btn text-xs px-3 py-1 rounded-full ${currentSort === 'alphabetical' ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}">A-Z</button>
                        <button data-sort="priority" class="sort-btn text-xs px-3 py-1 rounded-full ${currentSort === 'priority' ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}">Priority</button>
                    </div>
                </div>
                
                <div id="task-list" class="task-list space-y-3"></div>
                
                <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600 dark:text-gray-300">
                            ${getCompletedCount()} of ${tasks.length} tasks completed
                        </span>
                        <div class="w-1/2 bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                            <div class="bg-indigo-600 h-2.5 rounded-full" style="width: ${getCompletionPercentage()}%"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Reinitialize event listeners
    initTasks();
    initTheme();
}

// Render the task list
function renderTaskList() {
    if (!taskList) return;
    
    // Filter and sort tasks
    const filteredTasks = filterTasks();
    const sortedTasks = sortTasks(filteredTasks);
    
    // Clear existing tasks
    taskList.innerHTML = '';
    
    if (sortedTasks.length === 0) {
        taskList.innerHTML = `
            <div class="text-center py-8">
                <i class="fas fa-tasks text-4xl text-gray-400 dark:text-gray-500 mb-4"></i>
                <p class="text-gray-600 dark:text-gray-400">
                    ${currentFilter === 'all' ? 'No tasks yet. Add one to get started!' : 
                     currentFilter === 'active' ? 'No active tasks. Great job!' : 
                     'No completed tasks yet. Keep going!'}
                </p>
            </div>
        `;
        return;
    }
    
    // Add each task to the list
    sortedTasks.forEach(task => {
        const taskElement = createTaskElement(task);
        taskList.appendChild(taskElement);
    });
}

// Create a task element
function createTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.className = `task-item bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between ${task.completed ? 'completed' : ''} ${task.important ? 'important' : ''}`;
    taskElement.dataset.id = task.id;
    
    const dueDate = task.dueDate ? new Date(task.dueDate) : null;
    const dueDateString = dueDate ? dueDate.toLocaleDateString() : 'No due date';
    const isOverdue = dueDate && !task.completed && dueDate < new Date();
    
    taskElement.innerHTML = `
        <div class="task-info flex-grow flex items-start sm:items-center">
            <div class="flex items-center h-full mr-3">
                <input type="checkbox" class="task-checkbox h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600" ${task.completed ? 'checked' : ''}>
            </div>
            <div class="flex-grow">
                <div class="flex items-center flex-wrap gap-2">
                    <h3 class="task-title text-lg font-medium text-gray-800 dark:text-white ${task.completed ? 'line-through' : ''}">${task.title}</h3>
                    ${task.important ? '<span class="priority-badge priority-high">Important</span>' : ''}
                    ${isOverdue ? '<span class="priority-badge priority-high">Overdue</span>' : ''}
                </div>
                ${task.description ? `<p class="task-desc text-gray-600 dark:text-gray-300 mt-1">${task.description}</p>` : ''}
                <div class="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <i class="far fa-calendar-alt mr-1"></i>
                    <span class="task-due">${dueDateString}</span>
                </div>
            </div>
        </div>
        <div class="task-actions flex sm:flex-col justify-end gap-2 mt-3 sm:mt-0 sm:ml-4">
            <button class="edit-task p-2 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                <i class="fas fa-edit"></i>
            </button>
            <button class="delete-task p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    // Add event listeners
    const checkbox = taskElement.querySelector('.task-checkbox');
    const editBtn = taskElement.querySelector('.edit-task');
    const deleteBtn = taskElement.querySelector('.delete-task');
    
    checkbox.addEventListener('change', () => toggleTaskComplete(task.id));
    editBtn.addEventListener('click', () => openTaskModal(task));
    deleteBtn.addEventListener('click', () => deleteTask(task.id));
    
    return taskElement;
}

// Filter tasks based on current filter
function filterTasks() {
    switch (currentFilter) {
        case 'active':
            return tasks.filter(task => !task.completed);
        case 'completed':
            return tasks.filter(task => task.completed);
        default:
            return [...tasks];
    }
}

// Sort tasks based on current sort
function sortTasks(taskArray) {
    return [...taskArray].sort((a, b) => {
        switch (currentSort) {
            case 'date-created':
                return new Date(b.createdAt) - new Date(a.createdAt);
            case 'due-date':
                if (!a.dueDate && !b.dueDate) return 0;
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(a.dueDate) - new Date(b.dueDate);
            case 'alphabetical':
                return a.title.localeCompare(b.title);
            case 'priority':
                if (a.important && !b.important) return -1;
                if (!a.important && b.important) return 1;
                return new Date(a.createdAt) - new Date(b.createdAt);
            default:
                return 0;
        }
    });
}

// Update active filter buttons
function updateTaskFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.dataset.filter === currentFilter) {
            btn.classList.add('bg-white', 'dark:bg-gray-600', 'text-indigo-600', 'dark:text-indigo-400');
            btn.classList.remove('text-gray-700', 'dark:text-gray-300');
        } else {
            btn.classList.remove('bg-white', 'dark:bg-gray-600', 'text-indigo-600', 'dark:text-indigo-400');
            btn.classList.add('text-gray-700', 'dark:text-gray-300');
        }
    });
}

// Update active sort buttons
function updateTaskSorts() {
    document.querySelectorAll('.sort-btn').forEach(btn => {
        if (btn.dataset.sort === currentSort) {
            btn.classList.add('bg-indigo-100', 'dark:bg-indigo-900', 'text-indigo-800', 'dark:text-indigo-200');
            btn.classList.remove('bg-gray-100', 'dark:bg-gray-700', 'text-gray-800', 'dark:text-gray-200');
        } else {
            btn.classList.remove('bg-indigo-100', 'dark:bg-indigo-900', 'text-indigo-800', 'dark:text-indigo-200');
            btn.classList.add('bg-gray-100', 'dark:bg-gray-700', 'text-gray-800', 'dark:text-gray-200');
        }
    });
}

// Get number of completed tasks
function getCompletedCount() {
    return tasks.filter(task => task.completed).length;
}

// Get completion percentage
function getCompletionPercentage() {
    return tasks.length > 0 ? Math.round((getCompletedCount() / tasks.length) * 100) : 0;
}

// Open task modal for adding/editing
function openTaskModal(task = null) {
    const modalTitle = document.getElementById('task-modal-title');
    const taskIdInput = document.getElementById('task-id');
    const taskTitleInput = document.getElementById('task-title');
    const taskDescInput = document.getElementById('task-desc');
    const taskDueInput = document.getElementById('task-due');
    const taskImportantInput = document.getElementById('task-important');
    const saveTaskBtn = document.getElementById('save-task-btn');
    
    if (task) {
        // Editing existing task
        modalTitle.textContent = 'Edit Task';
        taskIdInput.value = task.id;
        taskTitleInput.value = task.title;
        taskDescInput.value = task.description || '';
        taskDueInput.value = task.dueDate ? task.dueDate.split('T')[0] : '';
        taskImportantInput.checked = task.important;
        saveTaskBtn.textContent = 'Update Task';
    } else {
        // Adding new task
        modalTitle.textContent = 'Add New Task';
        taskIdInput.value = '';
        taskTitleInput.value = '';
        taskDescInput.value = '';
        taskDueInput.value = '';
        taskImportantInput.checked = false;
        saveTaskBtn.textContent = 'Add Task';
    }
    
    // Show modal
    gsap.to(taskModal, {
        opacity: 1,
        pointerEvents: 'auto',
        duration: 0.3
    });
    
    gsap.to(taskModal.querySelector('div'), {
        scale: 1,
        duration: 0.3,
        ease: 'back.out(1.2)'
    });
    
    // Focus on title input
    taskTitleInput.focus();
}

// Close task modal
function closeTaskModal() {
    gsap.to(taskModal, {
        opacity: 0,
        pointerEvents: 'none',
        duration: 0.3
    });
    
    gsap.to(taskModal.querySelector('div'), {
        scale: 0.95,
        duration: 0.3
    });
}

// Handle task form submission
function handleTaskSubmit(e) {
    e.preventDefault();
    
    const taskId = document.getElementById('task-id').value;
    const title = document.getElementById('task-title').value.trim();
    const description = document.getElementById('task-desc').value.trim();
    const dueDate = document.getElementById('task-due').value;
    const important = document.getElementById('task-important').checked;
    
    if (!title) {
        showToast('Task title is required', 'error');
        return;
    }
    
    if (taskId) {
        // Update existing task
        updateTask(taskId, title, description, dueDate, important);
    } else {
        // Add new task
        addTask(title, description, dueDate, important);
    }
    
    closeTaskModal();
}

// Add a new task
function addTask(title, description, dueDate, important) {
    const newTask = {
        id: Date.now().toString(),
        title,
        description,
        dueDate: dueDate ? new Date(dueDate).toISOString() : '',
        completed: false,
        important,
        createdAt: new Date().toISOString()
    };
    
    tasks.unshift(newTask);
    saveTasks();
    renderTaskList();
    showToast('Task added successfully!', 'success');
}

// Update an existing task
function updateTask(id, title, description, dueDate, important) {
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex !== -1) {
        tasks[taskIndex] = {
            ...tasks[taskIndex],
            title,
            description,
            dueDate: dueDate ? new Date(dueDate).toISOString() : '',
            important
        };
        
        saveTasks();
        renderTaskList();
        showToast('Task updated successfully!', 'success');
    }
}

// Toggle task completion status
function toggleTaskComplete(id) {
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex !== -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        saveTasks();
        renderTaskList();
        
        const message = tasks[taskIndex].completed ? 
            'Task marked as complete!' : 'Task marked as active';
        showToast(message, 'success');
    }
}

// Delete a task
function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        saveTasks();
        renderTaskList();
        showToast('Task deleted successfully!', 'success');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initTasks);