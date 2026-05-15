import { createTaskItem } from './taskItem.js';

export function renderList(containerSelector, items, filter, callbacks = {}) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const {
    onClearCompleted = () => {}
  } = callbacks;

  // clear
  container.innerHTML = '';

  // filter
  let filtered = items;
  if (filter === 'active') filtered = items.filter(i => !i.completed);
  if (filter === 'completed') filtered = items.filter(i => i.completed);

  // rerender function passed to task items for escape/cancel scenarios
  const rerender = () => renderList(containerSelector, items, filter, callbacks);

  // render each task item
  filtered.forEach(item => {
    const li = createTaskItem(item, callbacks, rerender);
    container.appendChild(li);
  });

  // clear completed button
  if (filter === 'completed' && items.some(i => i.completed)) {
    const clearBtn = document.createElement('button');
    clearBtn.className = 'clear-completed-btn';
    clearBtn.textContent = 'Delete all completed';
    clearBtn.addEventListener('click', () => onClearCompleted());
    container.appendChild(clearBtn);
  }
}
