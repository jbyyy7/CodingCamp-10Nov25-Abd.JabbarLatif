// Seleksi elemen DOM
const todoForm = document.getElementById('todoForm');
const taskInput = document.getElementById('taskInput');
const dateInput = document.getElementById('dateInput');
const todoList = document.getElementById('todoList');
const noTaskMessage = document.getElementById('noTaskMessage');
const filterBtn = document.getElementById('filterBtn');
const filterOptions = document.getElementById('filterOptions');
const filterOptionBtns = document.querySelectorAll('.filter-option');
const deleteAllBtn = document.getElementById('deleteAllBtn');

// State
let todos = [];
let currentFilter = 'all';

// Inisialisasi aplikasi
function init() {
    loadFromLocalStorage();
    displayTodos();
    setupEventListeners();
}

// Setup Event Listeners
function setupEventListeners() {
    // Submit form untuk add task
    todoForm.addEventListener('submit', handleAddTask);
    
    // Toggle filter options
    filterBtn.addEventListener('click', toggleFilterOptions);
    
    // Filter buttons
    filterOptionBtns.forEach(btn => {
        btn.addEventListener('click', handleFilter);
    });
    
    // Delete all button
    deleteAllBtn.addEventListener('click', handleDeleteAll);
}

// Handle Add Task
function handleAddTask(e) {
    e.preventDefault();
    
    const taskText = taskInput.value.trim();
    const dueDate = dateInput.value;
    
    // Validasi input
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }
    
    // Buat objek todo baru
    const todo = {
        id: Date.now(),
        task: taskText,
        date: dueDate || 'No date',
        status: 'pending',
        completed: false
    };
    
    // Tambahkan ke array
    todos.push(todo);
    
    // Reset form
    taskInput.value = '';
    dateInput.value = '';
    
    // Simpan ke localStorage dan tampilkan
    saveToLocalStorage();
    displayTodos();
}

// Display Todos
function displayTodos() {
    // Filter todos berdasarkan filter yang aktif
    let filteredTodos = todos;
    
    if (currentFilter === 'pending') {
        filteredTodos = todos.filter(todo => !todo.completed);
    } else if (currentFilter === 'completed') {
        filteredTodos = todos.filter(todo => todo.completed);
    }
    
    // Clear list
    todoList.innerHTML = '';
    
    // Jika tidak ada task
    if (filteredTodos.length === 0) {
        noTaskMessage.classList.add('show');
        return;
    }
    
    noTaskMessage.classList.remove('show');
    
    // Tampilkan setiap todo
    filteredTodos.forEach(todo => {
        const todoItem = createTodoElement(todo);
        todoList.appendChild(todoItem);
    });
}

// Buat elemen todo
function createTodoElement(todo) {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    li.dataset.id = todo.id;
    
    // Format tanggal
    let formattedDate = todo.date;
    if (todo.date !== 'No date') {
        const date = new Date(todo.date);
        formattedDate = date.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric'
        });
    }
    
    li.innerHTML = `
        <div class="todo-task" data-label="Task:">${todo.task}</div>
        <div class="todo-date" data-label="Due Date:">${formattedDate}</div>
        <div class="todo-status ${todo.completed ? 'status-completed' : 'status-pending'}" data-label="Status:">
            ${todo.completed ? 'Completed' : 'Pending'}
        </div>
        <div class="todo-actions" data-label="Actions:">
            <button class="btn-complete" onclick="toggleComplete(${todo.id})">
                ${todo.completed ? 'Undo' : 'Complete'}
            </button>
            <button class="btn-delete" onclick="deleteTodo(${todo.id})">Delete</button>
        </div>
    `;
    
    return li;
}

// Toggle Complete Status
function toggleComplete(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveToLocalStorage();
        displayTodos();
    }
}

// Delete Todo
function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    saveToLocalStorage();
    displayTodos();
}

// Delete All Todos
function handleDeleteAll() {
    if (todos.length === 0) {
        return;
    }
    
    if (confirm('Are you sure you want to delete all tasks?')) {
        todos = [];
        saveToLocalStorage();
        displayTodos();
    }
}

// Toggle Filter Options
function toggleFilterOptions() {
    filterOptions.classList.toggle('hidden');
}

// Handle Filter
function handleFilter(e) {
    const filter = e.target.dataset.filter;
    currentFilter = filter;
    
    // Update active state
    filterOptionBtns.forEach(btn => {
        btn.classList.remove('active');
    });
    e.target.classList.add('active');
    
    // Display filtered todos
    displayTodos();
}

// Local Storage Functions
function saveToLocalStorage() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function loadFromLocalStorage() {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
        todos = JSON.parse(storedTodos);
    }
}

// Inisialisasi aplikasi saat halaman dimuat
init();
