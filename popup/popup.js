let tasks = [];

const addTaskBtn = document.querySelector("#add-task-button");
const startTimerButton = document.querySelector("#start-timer-button");

addTaskBtn.addEventListener("click", () => addTask());

chrome.storage.sync.get(["tasks"], (res) => {
  tasks = res?.tasks ? res?.tasks : [];
  renderTasks();
});

function saveTask() {
  chrome.storage.sync.set({
    tasks,
  });
}

function renderTask(taskNumber) {
  const taskRow = document.createElement("div");

  const text = document.createElement("input");
  text.type = "text";
  text.placeholder = "Enter a text...";
  text.value = tasks[taskNumber];

  text.addEventListener("change", () => {
    tasks[taskNumber] = text.value;
    saveTask();
  });

  const deleteBtn = document.createElement("input");
  deleteBtn.type = "button";
  deleteBtn.value = "X";

  deleteBtn.addEventListener("click", () => {
    deleteTask(taskNumber);
  });

  taskRow.appendChild(text);
  taskRow.appendChild(deleteBtn);

  const taskContainer = document.querySelector("#task-container");
  taskContainer.appendChild(taskRow);
}

function addTask() {
  const taskNumber = tasks?.length;
  tasks.push("");
  renderTask(taskNumber);
  saveTask();
}

function deleteTask(taskNumber) {
  tasks.splice(taskNumber, 1);
  renderTasks();
  saveTask();
}

function renderTasks() {
  const taskContainer = document.querySelector("#task-container");
  taskContainer.textContent = "";

  for (let [taskNumber] of tasks.entries()) {
    renderTask(taskNumber);
  }
}
