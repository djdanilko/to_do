import { loadTasks, saveTasks } from './services/storage.js';
import { renderList as renderTasks } from './components/renderList.js';
import { createTaskHandlers } from './handlers/taskHandlers.js';
import { uid } from './utils/uid.js';

const form = document.querySelector(".form");
const input = document.querySelector(".input");
const taskCount = document.querySelector(".tasks-counter");
const filterButtons = document.querySelectorAll("[data-filter]");

let tasks = [];
let filter = "all";

function normalizeTask(task) {
  return {
    id: task.id || uid(),
    text: typeof task.text === 'string' ? task.text : '',
    completed: Boolean(task.completed),
    deadline: task.deadline || null,
    subtasks: Array.isArray(task.subtasks)
      ? task.subtasks.map(subtask => ({
          id: subtask.id || uid(),
          text: typeof subtask.text === 'string' ? subtask.text : '',
          completed: Boolean(subtask.completed)
        })).filter(subtask => subtask.text)
      : []
  };
}

tasks = loadTasks().map(normalizeTask).filter(task => task.text);
saveTasks(tasks);

function renderList() {
  const callbacks = createTaskHandlers(tasks, renderList);
  renderTasks('.list', tasks, filter, callbacks);
  updateTaskCount();
}

function updateTaskCount() {
  if (!taskCount) return;
  const active = tasks.filter(task => !task.completed).length;
  const text = active === 1 ? 'task' : 'tasks';
  taskCount.textContent = `${active} ${text} left`;
}

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filter = btn.dataset.filter;
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderList();
  });
});

if (filterButtons[0]) {
  filterButtons[0].classList.add('active');
}

if (form && input) {
  form.addEventListener("submit", evt => {
    evt.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    tasks.push({
      id: uid(),
      text,
      completed: false,
      deadline: null,
      subtasks: []
    });

    saveTasks(tasks);
    renderList();
    input.value = "";
    input.focus();
  });
}

renderList();
