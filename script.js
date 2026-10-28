const taskForm = document.getElementById("taskForm");

const taskInput = document.getElementById("taskInput");

const taskList = document.getElementById("taskList");

const emptyMessage = document.getElementById("emptyMessage");

const taskCount = document.getElementById("taskCount");

const remainingCount = document.getElementById("remainingCount");

const clearCompleted = document.getElementById("clearCompleted");

const filterButtons = document.querySelectorAll(".filter-btn");


let tasks = JSON.parse(localStorage.getItem("todoTasks")) || [];

let currentFilter = "all";


/* SAVE TASKS */

function saveTasks() {

    localStorage.setItem(
        "todoTasks",
        JSON.stringify(tasks)
    );

}


/* DISPLAY TASKS */

function displayTasks() {

    taskList.innerHTML = "";


    let filteredTasks = tasks;


    if (currentFilter === "active") {

        filteredTasks = tasks.filter(function(task) {

            return task.completed === false;

        });

    }


    if (currentFilter === "completed") {

        filteredTasks = tasks.filter(function(task) {

            return task.completed === true;

        });

    }


    filteredTasks.forEach(function(task) {

        const li = document.createElement("li");

        li.className = "task-item";

        li.dataset.id = task.id;


        if (task.completed) {

            li.classList.add("completed");

        }


        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.className = "task-checkbox";

        checkbox.checked = task.completed;


        const text = document.createElement("span");

        text.className = "task-text";

        text.textContent = task.text;


        const actions = document.createElement("div");

        actions.className = "task-actions";


        const editButton = document.createElement("button");

        editButton.type = "button";

        editButton.className = "action-btn edit-btn";

        editButton.dataset.action = "edit";

        editButton.textContent = "✎";


        const deleteButton = document.createElement("button");

        deleteButton.type = "button";

        deleteButton.className = "action-btn delete-btn";

        deleteButton.dataset.action = "delete";

        deleteButton.textContent = "×";


        actions.appendChild(editButton);

        actions.appendChild(deleteButton);


        li.appendChild(checkbox);

        li.appendChild(text);

        li.appendChild(actions);


        taskList.appendChild(li);

    });


    updateCounts();


    if (filteredTasks.length === 0) {

        emptyMessage.style.display = "block";

    } else {

        emptyMessage.style.display = "none";

    }

}


/* UPDATE COUNTS */

function updateCounts() {

    const remaining = tasks.filter(function(task) {

        return task.completed === false;

    }).length;


    taskCount.textContent = tasks.length;

    remainingCount.textContent = remaining;

}


/* CREATE TASK */

taskForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const text = taskInput.value.trim();


    if (text === "") {

        alert("Please enter a task.");

        return;

    }


    const newTask = {

        id: Date.now(),

        text: text,

        completed: false

    };


    tasks.push(newTask);


    saveTasks();


    taskInput.value = "";


    displayTasks();


    taskInput.focus();

});


/* EDIT AND DELETE */

taskList.addEventListener("click", function(event) {

    const taskItem = event.target.closest(".task-item");


    if (!taskItem) {

        return;

    }


    const taskId = Number(taskItem.dataset.id);

    const action = event.target.dataset.action;


    /* DELETE */

    if (action === "delete") {

        tasks = tasks.filter(function(task) {

            return task.id !== taskId;

        });


        saveTasks();

        displayTasks();

    }


    /* EDIT */

    if (action === "edit") {

        const task = tasks.find(function(task) {

            return task.id === taskId;

        });


        if (!task) {

            return;

        }


        const newText = prompt(
            "Edit your task:",
            task.text
        );


        if (newText === null) {

            return;

        }


        const updatedText = newText.trim();


        if (updatedText === "") {

            alert("Task cannot be empty.");

            return;

        }


        task.text = updatedText;


        saveTasks();

        displayTasks();

    }

});


/* COMPLETE TASK */

taskList.addEventListener("change", function(event) {

    if (!event.target.classList.contains("task-checkbox")) {

        return;

    }


    const taskItem = event.target.closest(".task-item");

    const taskId = Number(taskItem.dataset.id);


    const task = tasks.find(function(task) {

        return task.id === taskId;

    });


    if (!task) {

        return;

    }


    task.completed = event.target.checked;


    saveTasks();

    displayTasks();

});


/* FILTERS */

filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        filterButtons.forEach(function(btn) {

            btn.classList.remove("active");

        });


        button.classList.add("active");


        currentFilter = button.dataset.filter;


        displayTasks();

    });

});


/* CLEAR COMPLETED */

clearCompleted.addEventListener("click", function() {

    tasks = tasks.filter(function(task) {

        return task.completed === false;

    });


    saveTasks();

    displayTasks();

});


/* INITIAL LOAD */

displayTasks();