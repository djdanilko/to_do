export function renderTodos(containerSelector, todos, { onToggle, onDelete } = {}) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  container.innerHTML = '';

  todos.forEach(todo => {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.dataset.id = todo.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = !!todo.completed;
    checkbox.className = 'task-checkbox';

    const span = document.createElement('span');
    span.textContent = todo.text;
    span.className = todo.completed ? 'task-text completed' : 'task-text';

    const del = document.createElement('button');
    del.textContent = '✕';
    del.className = 'task-delete';

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(del);
    container.appendChild(li);

    checkbox.addEventListener('change', () => onToggle && onToggle(todo.id));
    del.addEventListener('click', () => onDelete && onDelete(todo.id));
  });
}

export function updateCounter(selector, count) {
  const el = document.querySelector(selector);
  if (el) el.textContent = `${count} tasks left`;
}
