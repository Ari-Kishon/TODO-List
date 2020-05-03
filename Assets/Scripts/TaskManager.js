const trashSVG = "<svg height=\"30pt\" viewBox=\"-48 0 407 407\" width=\"30pt\" xmlns=\"http: //www.w3.org/2000/svg\"><path d=\"m89.199219 37c0-12.132812 9.46875-21 21.601562-21h88.800781c12.128907 0 21.597657 8.867188 21.597657 21v23h16v-23c0-20.953125-16.644531-37-37.597657-37h-88.800781c-20.953125 0-37.601562 16.046875-37.601562 37v23h16zm0 0\"/><path d=\"m60.601562 407h189.199219c18.242188 0 32.398438-16.046875 32.398438-36v-247h-254v247c0 19.953125 14.15625 36 32.402343 36zm145.597657-244.800781c0-4.417969 3.582031-8 8-8s8 3.582031 8 8v189c0 4.417969-3.582031 8-8 8s-8-3.582031-8-8zm-59 0c0-4.417969 3.582031-8 8-8s8 3.582031 8 8v189c0 4.417969-3.582031 8-8 8s-8-3.582031-8-8zm-59 0c0-4.417969 3.582031-8 8-8s8 3.582031 8 8v189c0 4.417969-3.582031 8-8 8s-8-3.582031-8-8zm0 0\"/><path d=\"m20 108h270.398438c11.046874 0 20-8.953125 20-20s-8.953126-20-20-20h-270.398438c-11.046875 0-20 8.953125-20 20s8.953125 20 20 20zm0 0\"/></svg>"
const checkSVG = "<svg height=\"30pt\" viewBox=\"0 -46 417.81333 417\" width=\"30pt\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"m159.988281 318.582031c-3.988281 4.011719-9.429687 6.25-15.082031 6.25s-11.09375-2.238281-15.082031-6.25l-120.449219-120.46875c-12.5-12.5-12.5-32.769531 0-45.246093l15.082031-15.085938c12.503907-12.5 32.75-12.5 45.25 0l75.199219 75.203125 203.199219-203.203125c12.503906-12.5 32.769531-12.5 45.25 0l15.082031 15.085938c12.5 12.5 12.5 32.765624 0 45.246093zm0 0\"/></svg>"


const taskList = document.querySelector(".taskList");
const submitButton = document.querySelector(".submitButton");
const newTaskInput = document.querySelector(".newTaskInput");

let tasks = [];

const getParentUID = (element) => {
    return element.parentElement.getAttribute("uid");
}

const getTaskByID = (id) => {
    for (const obj of tasks) {
        if (obj.id == id) {
            return obj.task;
        }
    }
}

const addTaskToDB = (id, text) => {
    tasks.push({
        id,
        task: {
            text,
            complete: false
        }
    })
}

const removeTaskFromDB = (id) => {
    tasks = tasks.filter(obj => obj.id != id);
}

const toggleTaskInDB = (id) => {
    const task = getTaskByID(id);
    task.complete = !task.complete;
}

const updateTaskInDB = (id, text) => {
    getTaskByID(id).text = text;
}

const createTask = (text, id = Date.now()) => {
    addTaskToDB(id, text);
    clearInput();
    taskList.appendChild(createTaskElement(id, text));
}

const clearInput = () => {
    newTaskInput.value = "";
    newTaskInput.placeholder = "";
}

const toggleTask = (task) => {
    if (task.getAttribute("complete") == "true") {
        task.setAttribute("complete", false);
        task.querySelector(".taskTitle").disabled = false;
    } else {
        task.setAttribute("complete", true);
        task.querySelector(".taskTitle").disabled = true;
    }
}

/**
 * Create Elements 
 **/
const createTaskElement = (id, text, complete = false) => {
    const task = document.createElement("li");
    task.className = "task"
    task.setAttribute("complete", complete);
    task.setAttribute("uid", id);
    task.appendChild(createTextBox(text));
    task.appendChild(createFinishButton());
    task.appendChild(createTrashButton());
    return task;
}
const createTextBox = (text) => {
    const box = document.createElement("input");
    box.className = ("taskTitle");
    box.value = text;
    box.placeholder = "EMPTY";
    box.addEventListener('input', (e) => {
        updateTaskInDB(getParentUID(box), e.target.value)
    })
    return box;
}
const createFinishButton = () => {
    const button = document.createElement("button");
    button.className = "finishButton";
    button.innerHTML = checkSVG;
    button.addEventListener('click', () => {
        toggleTask(button.parentElement);
        toggleTaskInDB(getParentUID(button));
    });
    return button;
}
const createTrashButton = () => {
    const button = document.createElement("button");
    button.className = "trashButton";
    button.innerHTML = trashSVG;
    button.addEventListener('click', () => {
        button.parentElement.remove();
        removeTaskFromDB(getParentUID(button));
    });
    return button;
}

/**
 * Event Listeners
 **/
submitButton.addEventListener('click', () => {
    if (newTaskInput.value) {
        createTask(newTaskInput.value);
    } else {
        newTaskInput.placeholder = "please write a task";
    }
    console.log(tasks);
});

createTask("Hello");