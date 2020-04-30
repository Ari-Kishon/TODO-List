let taskList = document.querySelector(".taskList");
let submit = document.querySelector(".submit");
let newTask = document.querySelector(".submission input");

//
// FIREBASE SETUP
//
let DB = firebase.database();
//TODO push task as data value and not data title
addTask = (task) => {
    DB.ref('Tasks/' + task).update({
        complete: false,
    });
};
removeTask = (task) => {
    DB.ref('Tasks/' + task.childNodes[0].value).remove();
}
tickTask = (task) => {
    ref = DB.ref('Tasks/' + task.childNodes[0].value);
    ref.once('value', function (snapshot) {
        ref.update({
            complete: !snapshot.val().complete
        });
    });
}
loadTasks = () => {
    DB.ref('Tasks').once('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            taskList.appendChild(taskBox(childSnapshot.key, childSnapshot.val().complete));
        })
    });
}

createTask = (text) => {
    addTask(text);
    clearInput();
    taskList.appendChild(taskBox(text));
}

clearInput = () => {
    newTask.value = "";
    newTask.placeholder = "";
}

toggleTask = (task) => {
    if (task.getAttribute("complete") == "true") {
        task.setAttribute("complete", false);
        task.childNodes[0].disabled = false;
    } else {
        task.setAttribute("complete", true);
        task.childNodes[0].disabled = true;
    }
}

//
// CREATE ELEMENTS
//
taskBox = (text, complete = false) => {
    let task = document.createElement("li");
    task.className = "task"
    task.setAttribute("complete", complete);
    task.appendChild(textBox(text));
    task.appendChild(finishButton());
    task.appendChild(trashButton());
    return task;
}
textBox = (text) => {
    let box = document.createElement("input");
    box.className = ("task-title");
    box.value = text;
    box.placeholder = "EMPTY";
    return box;
}
finishButton = () => {
    let button = document.createElement("button");
    button.className = "finish";
    button.addEventListener('click', () => {
        toggleTask(button.parentElement);
        tickTask(button.parentElement);
    });
    return button;
}
trashButton = () => {
    let button = document.createElement("button");
    button.className = "trash";
    button.addEventListener('click', () => {
        button.parentElement.remove();
        removeTask(button.parentElement);
    });
    return button;
}

//
// EVENT LISTENERS
//
submit.addEventListener('click', () => {
    if (newTask.value)
        createTask(newTask.value);
    else
        newTask.placeholder = "please write a task";
});

//
// DEBUG
//

loadTasks();