let tasks = [];

const addTaskBtn = document.querySelector("#add-task-button");
const startTimerButton = document.querySelector("#start-timer-button");
const resetTimerButton = document.querySelector("#reset-timer-button");
const tine = document.querySelector("#time");

startTimerButton.addEventListener("click", () => {
  chrome.storage.local.get(["isRunning"], (res) => {
    const isRunning = res?.isRunning ?? false;
    chrome.storage.local.set(
      {
        isRunning: !isRunning,
      },
      () => {
        startTimerButton.textContent = !res?.isRunning
          ? "Pause Timer"
          : "Start Timer";
      }
    );
  });
});

resetTimerButton.addEventListener("click", () => {
  chrome.storage.local.set(
    {
      timer: 0,
      isRunning: false,
    },
    () => {
      startTimerButton.textContent = "Start Timer";
    }
  );
});
addTaskBtn.addEventListener("click", () => addTask());

chrome.storage.sync.get(["tasks"], (res) => {
  tasks = res?.tasks ? res?.tasks : [];
  renderTasks();
});

function updateTime() {
  chrome.storage.local.get(["timer"], (res) => {
    const minutes = `${25 - Math.ceil(res?.timer / 60)}`.padStart(2, "0");
    let seconds = "00";

    if (res?.timer % 60 != 0) {
      seconds = `${60 - (res?.timer % 60)}`.padStart(2, "0");
    }

    time.textContent = `${minutes}:${seconds}`;
  });
}

updateTime();
setInterval(updateTime, 1000);

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
