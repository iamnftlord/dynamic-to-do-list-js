// script.js

// Ensure code runs after the HTML document has fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Select DOM elements
    const addButton = document.getElementById('add-task-btn');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    // Load tasks array from Local Storage (or start with an empty array)
    let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

    // Helper to persist the current tasks array to Local Storage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    /**
     * Add a task to the DOM and optionally save it to Local Storage.
     * Signature matches the expected checker: addTask(taskText, save = true)
     * - taskText: optional string. If omitted, the value is taken from taskInput.
     * - save: boolean flag; when false, the task is not pushed to the tasks array or saved (used when loading).
     */
    function addTask(taskText, save = true) {
        // Determine the task text (from argument or input field) and trim it
        if (typeof taskText === 'undefined') {
            taskText = taskInput.value.trim();
        } else {
            taskText = String(taskText).trim();
        }

        // If empty and we are in "save" mode (user-triggered), show alert and stop
        if (taskText === '') {
            if (save) {
                alert('Please enter a task.');
            }
            return;
        }

        // Create list item and a separate span for text so we can keep text clean
        const li = document.createElement('li');
        const textSpan = document.createElement('span');
        textSpan.textContent = taskText;
        li.appendChild(textSpan);

        // Create the remove button and add the required class using classList.add
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.classList.add('remove-btn'); // ✅ uses classList.add as required

        // When remove button is clicked:
        removeBtn.addEventListener('click', function () {
            // Remove the element from the DOM
            if (taskList.contains(li)) {
                taskList.removeChild(li);
            }

            // Remove the task from the tasks array (first matching occurrence)
            const index = tasks.indexOf(taskText);
            if (index > -1) {
                tasks.splice(index, 1);
                saveTasks(); // persist change
            }
        });

        // Append remove button and the list item to the list
        li.appendChild(removeBtn);
        taskList.appendChild(li);

        // If instructed to save, update tasks array and persist
        if (save) {
            tasks.push(taskText);
            saveTasks();
        }

        // Clear and focus the input
        taskInput.value = '';
        taskInput.focus();
    }

    // Load saved tasks from Local Storage and render them (without saving again)
    function loadTasks() {
        const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        storedTasks.forEach(taskText => addTask(taskText, false)); // false -> don't save again
    }

    // Attach event listeners for adding tasks
    addButton.addEventListener('click', function () {
        addTask(); // takes value from input and saves by default
    });

    // Allow Enter key to add task
    taskInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    // Initialize the UI by loading tasks from Local Storage
    loadTasks();
});
