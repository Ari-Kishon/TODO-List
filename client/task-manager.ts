const trashSVG =
  '<svg height="30pt" viewBox="-48 0 407 407" width="30pt" xmlns="http: //www.w3.org/2000/svg"><path d="m89.199219 37c0-12.132812 9.46875-21 21.601562-21h88.800781c12.128907 0 21.597657 8.867188 21.597657 21v23h16v-23c0-20.953125-16.644531-37-37.597657-37h-88.800781c-20.953125 0-37.601562 16.046875-37.601562 37v23h16zm0 0"/><path d="m60.601562 407h189.199219c18.242188 0 32.398438-16.046875 32.398438-36v-247h-254v247c0 19.953125 14.15625 36 32.402343 36zm145.597657-244.800781c0-4.417969 3.582031-8 8-8s8 3.582031 8 8v189c0 4.417969-3.582031 8-8 8s-8-3.582031-8-8zm-59 0c0-4.417969 3.582031-8 8-8s8 3.582031 8 8v189c0 4.417969-3.582031 8-8 8s-8-3.582031-8-8zm-59 0c0-4.417969 3.582031-8 8-8s8 3.582031 8 8v189c0 4.417969-3.582031 8-8 8s-8-3.582031-8-8zm0 0"/><path d="m20 108h270.398438c11.046874 0 20-8.953125 20-20s-8.953126-20-20-20h-270.398438c-11.046875 0-20 8.953125-20 20s8.953125 20 20 20zm0 0"/></svg>';
const checkSVG =
  '<svg height="30pt" viewBox="0 -46 417.81333 417" width="30pt" xmlns="http://www.w3.org/2000/svg"><path d="m159.988281 318.582031c-3.988281 4.011719-9.429687 6.25-15.082031 6.25s-11.09375-2.238281-15.082031-6.25l-120.449219-120.46875c-12.5-12.5-12.5-32.769531 0-45.246093l15.082031-15.085938c12.503907-12.5 32.75-12.5 45.25 0l75.199219 75.203125 203.199219-203.203125c12.503906-12.5 32.769531-12.5 45.25 0l15.082031 15.085938c12.5 12.5 12.5 32.765624 0 45.246093zm0 0"/></svg>';

interface Task {
  id: number;
  text: string;
  complete: boolean;
}
const taskListElement = document.querySelector(".taskList");
const submitButtonElement = document.querySelector(".submitButton");
const newTaskInputElement = document.querySelector(".newTaskInput");

const getTaskElement = (id: number) => {
  // should i type check task?
  const task = document.querySelector(`.task[uid="${id}"]`);
  if (!task) {
    throw new Error(`Could not find task #${id}`);
  }
  return task;
};

async function loadAllTasks() {
  if (isDivElement(taskListElement)) {
    // is this ok to do?
    const list: Task[] = await (
      await fetch(`/tasks`, {
        headers: {
          Accept: "application/json",
        },
        method: "GET",
      })
    ).json();
    for (const task of list) {
      taskListElement.appendChild(
        createTaskElement(task.id, task.text, task.complete)
      );
    }
  } else {
    throw new Error("task list element could not be found");
  }
}

async function createTask(text: string) {
  if (isDivElement(taskListElement) && isInputElement(newTaskInputElement)) {
    const taskID: number = await (
      await fetch("/task", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          text,
        }),
      })
    ).json();
    taskListElement.appendChild(createTaskElement(taskID, text));
    newTaskInputElement.value = "";
  } else {
    throw new Error(`newInput ot TaskList could not be found`);
  }
}

async function toggleTask(id: number, completed: boolean) {
  const inputElement = document.querySelector(`.task[uid="${id}"] input`);
  const taskElement = document.querySelector(`.task[uid="${id}"]`);
  if (isLiElement(taskElement) && isInputElement(inputElement)) {
    await fetch("/task", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        id,
        completed,
      }),
    });
    taskElement.setAttribute("complete", completed ? "true" : "false");
    inputElement.disabled = completed;
  } else {
    throw new Error("task element could not be found");
  }
}

async function renameTask(id: number, text: string) {
  await fetch("/task", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      id,
      text,
    }),
  });
}

async function deleteTask(id: number) {
  await fetch("/task", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "DELETE",
    body: JSON.stringify({
      id,
    }),
  });
  getTaskElement(id).remove();
}

/**
 * Element Constructors
 */
const createTaskElement = (
  id: number,
  text: string,
  complete = false
): HTMLLIElement => {
  const task = document.createElement("li");
  task.className = "task";
  task.setAttribute("complete", complete ? "true" : "false");
  task.setAttribute("uid", id.toString());
  task.appendChild(createInput(id, text));
  task.appendChild(
    createFinishButton(id, () => {
      return task.getAttribute("complete") === "true";
    })
  );
  task.appendChild(createTrashButton(id));
  return task;
};
const createInput = (id: number, text: string): HTMLInputElement => {
  const input = document.createElement("input");
  input.className = "taskTitle";
  input.value = text;
  input.placeholder = "EMPTY";
  input.addEventListener("input", (e: any) => {
    if (e.target) {
      renameTask(id, e.target.value).catch(() => {
        displayError("Communication Error: could not rename task in server");
      });
    }
  });
  return input;
};
const createFinishButton = (
  id: number,
  getComplete: () => boolean
): HTMLButtonElement => {
  const button = document.createElement("button");
  button.className = "finishButton";
  button.innerHTML = checkSVG;
  button.addEventListener("click", () => {
    toggleTask(id, !getComplete()).catch(() => {
      displayError(
        "Communication Error: could not toggle task status in server"
      );
    });
  });
  return button;
};
const createTrashButton = (id: number): HTMLButtonElement => {
  const button = document.createElement("button");
  button.className = "trashButton";
  button.innerHTML = trashSVG;
  button.addEventListener("click", () => {
    deleteTask(id).catch(() => {
      displayError("Communication Error: could not remove task from server");
    });
  });
  return button;
};
const createErrorElement = (): HTMLDivElement => {
  const error = document.createElement("div");
  error.className = "errorPopUp";
  error.addEventListener("click", () => {
    error.hidden = true;
  });
  return error;
};

/**
 * Event Listeners
 */
if (!submitButtonElement) {
  throw new Error(`could not find the submit button`);
}
submitButtonElement.addEventListener("click", () => {
  if (isInputElement(newTaskInputElement)) {
    if (newTaskInputElement.value) {
      createTask(newTaskInputElement.value).catch(() => {
        displayError("Communication Error: could not create task in server");
      });
    } else {
      newTaskInputElement.placeholder = "please write a task";
    }
  }
});

const errorPopUp = document.body.appendChild(createErrorElement());
errorPopUp.hidden = true;
const displayError = (message: string) => {
  errorPopUp.hidden = false;
  errorPopUp.innerHTML = message;
};

//Load tasks on init
loadAllTasks().catch(() => {
  displayError("Communication Error: could not load tasks from server");
});

function isInputElement(element: Element | null): element is HTMLInputElement {
  return element instanceof HTMLInputElement;
}

function isDivElement(element: Element | null): element is HTMLDivElement {
  return element instanceof HTMLDivElement;
}

function isLiElement(element: Element | null): element is HTMLLIElement {
  return element instanceof HTMLLIElement;
}
