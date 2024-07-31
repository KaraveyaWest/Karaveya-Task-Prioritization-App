class Task {
    constructor(description, staticPriority, fluctuatingPriority = 5) {
        this.description = description;
        this.staticPriority = staticPriority;
        this.fluctuatingPriority = fluctuatingPriority; // This can still be used for dynamic daily priority
    }
}

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Event listeners for buttons
document.getElementById('add-task-btn').addEventListener('click', addTask);
document.getElementById('update-daily-priorities-btn').addEventListener('click', updateDailyPriorities);

// Function to add a new task
function addTask() {
    const description = document.getElementById('task-desc').value;
    const staticPriority = parseInt(document.getElementById('static-priority').value); // Parse as int
    const dailyPriority = parseInt(document.getElementById('daily-priority').value); // Parse as int
    if (description && staticPriority >= 1 && staticPriority <= 5) {
        const task = new Task(description, staticPriority, dailyPriority); // Pass dailyPriority to Task
        tasks.push(task);
        saveTasks();
        displayTasks();
        displayVisualTasks();
        document.getElementById('task-desc').value = '';
        document.getElementById('static-priority').value = '1'; // Reset to default
        document.getElementById('daily-priority').value = '1'; // Reset to default for daily priority
    } else {
        alert("Please enter valid task description and priority.");
    }
}


// Function to remove a task
function removeTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    displayTasks();
    displayVisualTasks();
}

// Function to update daily priorities
function updateDailyPriorities() {
    console.log("Updating daily priorities..."); // Debug log to check if the function is triggered

    tasks.forEach(task => {
        if (task.staticPriority <= 2) { // Only for high-priority tasks
            const dailyPriority = prompt(`Assign a daily priority (1-5) for: ${task.description}`);
            console.log(`User entered daily priority: ${dailyPriority} for task: ${task.description}`); // Log the user's input

            if (dailyPriority && dailyPriority >= 1 && dailyPriority <= 5) { // Check if input is valid
                task.fluctuatingPriority = parseInt(dailyPriority);
                console.log(`Updated task: ${task.description} with daily priority: ${task.fluctuatingPriority}`); // Log the updated priority
            } else {
                alert("Please enter a valid daily priority (1-5).");
            }
        } else {
            console.log(`Task: ${task.description} skipped, as it is not a high priority (Static Priority: ${task.staticPriority})`);
        }
    });

    console.log("Tasks after updating priorities:", tasks); // Log the tasks array to inspect its contents

    saveTasks();
    displayTasks();
    displayVisualTasks();
}

// Function to save tasks to local storage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to display tasks in the task list
function displayTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';
        taskItem.dataset.priority = task.staticPriority;
        taskItem.innerHTML = `
            <span>${task.description} (Static Priority: ${task.staticPriority}, Daily Priority: ${task.fluctuatingPriority})</span>
            <button onclick="removeTask(${index})">Remove</button>
        `;
        taskList.appendChild(taskItem);
    });
}

// Function to display tasks in a visual list
function displayVisualTasks() {
    const visualTaskList = document.getElementById('visual-task-list');
    visualTaskList.innerHTML = '';
    tasks.forEach((task) => {
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';
        taskItem.dataset.priority = task.staticPriority;
        taskItem.innerHTML = `${task.description} (Static Priority: ${task.staticPriority}, Daily Priority: ${task.fluctuatingPriority})`;
        visualTaskList.appendChild(taskItem);
    });

    // Make the visual task list sortable
    new Sortable(visualTaskList, {
        animation: 150,
        onEnd: function () {
            const updatedTasks = [];
            visualTaskList.childNodes.forEach((node) => {
                const originalTask = tasks.find(task => task.description === node.innerText.split(' (')[0]);
                updatedTasks.push(originalTask);
            });
            tasks = updatedTasks; // Update the tasks to reflect new order
            saveTasks();
            displayTasks();
        }
    });
}

// On document load, display tasks
document.addEventListener('DOMContentLoaded', () => {
    displayTasks();
    displayVisualTasks();
});
