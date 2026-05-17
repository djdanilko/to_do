import { createTaskItem } from './taskItem.js';

export function renderList(containerSelector, items, filter, callbacks = {}) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const {
    onClearCompleted = () => {}
  } = callbacks;

  container.innerHTML = '';

  let filtered = items;
  if (filter === 'active') filtered = items.filter(i => !i.completed);
  if (filter === 'completed') filtered = items.filter(i => i.completed);

  const rerender = () => renderList(containerSelector, items, filter, callbacks);

  if (!filtered.length) {
    const empty = document.createElement('li');
    empty.className = 'empty-state';
    empty.textContent = getEmptyMessage(filter);
    container.appendChild(empty);
  }

  filtered.forEach(item => {
    const li = createTaskItem(item, callbacks, rerender);
    container.appendChild(li);
  });

  if (filter === 'completed' && items.some(i => i.completed)) {
    const clearBtn = document.createElement('button');
    clearBtn.className = 'clear-completed-btn';
    clearBtn.textContent = 'Delete all completed';
    clearBtn.addEventListener('click', () => onClearCompleted());
    container.appendChild(clearBtn);
  }
}

function getEmptyMessage(filter) {
  if (filter === 'active') return 'No active tasks';
  if (filter === 'completed') return 'No completed tasks';
  return 'No tasks yet';
}
