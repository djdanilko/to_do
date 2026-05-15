import { loadTasks, saveTasks } from './services/storage.js';
import { renderList as renderTasks } from './components/renderList.js';
import { createTaskHandlers } from './handlers/taskHandlers.js';

// DOM references
const form = document.querySelector(".form");
const input = document.querySelector(".input");
const list = document.querySelector(".list");
const taskCount = document.querySelector(".tasks-counter");
const filterButtons = document.querySelectorAll("[data-filter]");

// State
let array = [];
let filter = "all";

// Load initial data
const saved = loadTasks();
if (saved && Array.isArray(saved)) {
  array.push(...saved);
}

// Render wrapper
function renderList() {
  const callbacks = createTaskHandlers(array, renderList);
  renderTasks('.list', array, filter, callbacks);
  updateTaskCount();
}

// Update task counter
function updateTaskCount() {
  const active = array.filter(i => !i.completed).length;
  const text = active === 1 ? 'task' : 'tasks';
  taskCount.textContent = `${active} ${text} left`;
}

// Filter buttons
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filter = btn.dataset.filter;
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderList();
  });
});

// Form submit
form.addEventListener("submit", evt => {
  evt.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  
  array.push({
    id: Date.now(),
    text,
    completed: false,
    deadline: null,
    subtasks: []
  });
  
  saveTasks(array);
  renderList();
  input.value = "";
  input.focus();
});

// Initial render
renderList();
