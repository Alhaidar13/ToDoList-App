document.addEventListener('DOMContentLoaded', function() {
    // 1. Live running time next to user profile
    function updateProfileDateTime() {
        const now = new Date();
        const dateOptions = { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        };
        const timeOptions = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };
        
        document.querySelector('.profile-right').innerHTML = `
            <div class="date">${now.toLocaleDateString('id-ID', dateOptions)}</div>
            <div class="time">${now.toLocaleTimeString('id-ID', timeOptions)}</div>
        `;
    }
    setInterval(updateProfileDateTime, 1000);
    updateProfileDateTime();
    
    // Task Data
    let tasks = [];
    
    // DOM Elements
    const taskForm = document.querySelector('.task-form form');
    const prioritySelect = document.getElementById('prioritas');
    const dateInput = document.getElementById('tanggal');
    const taskDescription = document.querySelector('.task-form textarea');
    const tabsContent = document.querySelector('.tabs-content');
    const todoTab = document.querySelector('.tab:nth-child(1)');
    const doneTab = document.querySelector('.tab:nth-child(2)');
    const deleteAllBtn = document.querySelector('.delete-all');
    
    // Generate unique ID
    function generateId() {
        return tasks.length > 0 ? Math.max(...tasks.map(task => task.id)) + 1 : 1;
    }
    
    // 5. Add new task functionality
    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!taskDescription.value.trim()) {
            alert('Deskripsi task tidak boleh kosong!');
            return;
        }
        
        if (!prioritySelect.value) {
            alert('Pilih prioritas task!');
            return;
        }
        
        const newTask = {
            id: generateId(),
            text: taskDescription.value.trim(),
            priority: prioritySelect.value.toLowerCase(), // 2. Priority level (low, medium, high)
            date: dateInput.value || new Date().toLocaleDateString('id-ID'), // 3. Date handling
            isDone: false
        };
        
        tasks.push(newTask);
        renderTasks();
        taskForm.reset();
    });
    
    // Render all tasks
    function renderTasks() {
        // Clear existing content
        tabsContent.innerHTML = '';
        
        // Filter tasks
        const activeTab = document.querySelector('.tab.active');
        const showCompleted = activeTab.textContent === 'Selesai';
        const filteredTasks = tasks.filter(task => task.isDone === showCompleted);
        
        if (filteredTasks.length === 0) {
            tabsContent.innerHTML = '<p class="empty-message">Belum ada task. Tambahkan task pertama Anda!</p>';
            return;
        }
        
        // Create task elements
        filteredTasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = 'task-item';
            if (task.isDone) {
                taskElement.classList.add('completed');
            }
            
            taskElement.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.isDone ? 'checked' : ''}>
                <span class="task-text">${task.text}</span>
                <span class="task-priority ${task.priority}">${capitalizeFirstLetter(task.priority)}</span>
                <span class="task-date">${formatDate(task.date)}</span>
                <span class="delete-task">×</span>
            `;
            
            // Add event listeners
            const checkbox = taskElement.querySelector('.task-checkbox');
            checkbox.addEventListener('change', () => toggleTaskStatus(task.id));
            
            const deleteBtn = taskElement.querySelector('.delete-task');
            deleteBtn.addEventListener('click', () => deleteTask(task.id));
            
            tabsContent.appendChild(taskElement);
        });
    }
    
    // Toggle task status (complete/incomplete)
    function toggleTaskStatus(taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.isDone = !task.isDone;
            renderTasks();
        }
    }
    
    // Delete task
    function deleteTask(taskId) {
        tasks = tasks.filter(task => task.id !== taskId);
        renderTasks();
    }
    
    // Delete all tasks
    deleteAllBtn.addEventListener('click', function() {
        const activeTab = document.querySelector('.tab.active');
        const deleteCompleted = activeTab.textContent === 'Selesai';
        
        if (confirm(`Apakah Anda yakin ingin menghapus semua task ${deleteCompleted ? 'selesai' : 'todo'}?`)) {
            tasks = tasks.filter(task => deleteCompleted ? !task.isDone : task.isDone);
            renderTasks();
        }
    });
    
    // Switch between tabs
    document.querySelectorAll('.tab:not(.delete-all)').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            renderTasks();
        });
    });
    
    // Helper functions
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID');
    }
    
    // Initialize
    renderTasks();
});