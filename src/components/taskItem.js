export function createTaskItem(task, callbacks = {}, rerender = () => {}) {
  const {
    onToggle = () => {},
    onEdit = () => {},
    onDelete = () => {},
    onSetDeadline = () => {},
    onOpenDeadlinePicker = () => {},
    onDeleteDeadline = () => {},
    onAddSubtask = () => {},
    onToggleSubtask = () => {},
    onEditSubtask = () => {},
    onDeleteSubtask = () => {}
  } = callbacks;

  const li = document.createElement('li');
  li.className = `task-item${task.completed ? ' completed' : ''}${isOverdue(task.deadline) ? ' overdue' : ''}`;
  li.dataset.id = task.id;

  const mainRow = document.createElement('div');
  mainRow.className = 'task-main';

  const checkbox = document.createElement('input');
  checkbox.className = 'task-checkbox';
  checkbox.type = 'checkbox';
  checkbox.checked = !!task.completed;

  const span = document.createElement('span');
  span.className = 'task-text';
  span.textContent = task.text;

  const actions = document.createElement('div');
  actions.className = 'task-actions';

  const editBtn = createButton('Edit', 'edit__btn');
  const deadlineBtn = createButton(task.deadline ? 'Change deadline' : 'Deadline', 'deadline__btn');
  const subtaskBtn = createButton('+ subtask', 'subtask__btn');
  const deleteBtn = createButton('Delete', 'delete__btn');

  actions.append(editBtn, deadlineBtn, subtaskBtn, deleteBtn);
  mainRow.append(checkbox, span, actions);
  li.appendChild(mainRow);

  if (task.deadline) {
    li.appendChild(createDeadlineBlock(task.deadline, () => onDeleteDeadline(task.id)));
  }

  if (task.subtasks && task.subtasks.length) {
    const subtaskList = document.createElement('ul');
    subtaskList.className = 'subtask-list';

    task.subtasks.forEach(subtask => {
      subtaskList.appendChild(createSubtaskItem(task, subtask, {
        onToggleSubtask,
        onEditSubtask,
        onDeleteSubtask,
        rerender
      }));
    });

    li.appendChild(subtaskList);
  }

  checkbox.addEventListener('change', () => {
    onToggle(task.id, checkbox.checked);
  });

  editBtn.addEventListener('click', () => {
    startTextEdit(span, task.text, value => onEdit(task.id, value), rerender);
  });

  deadlineBtn.addEventListener('click', () => {
    startDeadlineEdit(li, task, onSetDeadline, onOpenDeadlinePicker, rerender);
  });

  subtaskBtn.addEventListener('click', () => {
    startSubtaskCreate(li, task.id, onAddSubtask, rerender);
  });

  deleteBtn.addEventListener('click', () => {
    onDelete(task.id);
  });

  return li;
}

function createSubtaskItem(task, subtask, callbacks) {
  const { onToggleSubtask, onEditSubtask, onDeleteSubtask, rerender } = callbacks;

  const subLi = document.createElement('li');
  subLi.className = `subtask-item${subtask.completed ? ' completed' : ''}`;

  const subCheckbox = document.createElement('input');
  subCheckbox.className = 'subtask-checkbox';
  subCheckbox.type = 'checkbox';
  subCheckbox.checked = !!subtask.completed;

  const subSpan = document.createElement('span');
  subSpan.className = 'subtask-text';
  subSpan.textContent = subtask.text;

  const actions = document.createElement('div');
  actions.className = 'subtask-actions';

  const editSubBtn = createButton('Edit', 'edit-subtask__btn');
  const deleteSubBtn = createButton('Delete', 'delete-subtask__btn');

  actions.append(editSubBtn, deleteSubBtn);
  subLi.append(subCheckbox, subSpan, actions);

  subCheckbox.addEventListener('change', () => {
    onToggleSubtask(task.id, subtask.id, subCheckbox.checked);
  });

  editSubBtn.addEventListener('click', () => {
    startTextEdit(subSpan, subtask.text, value => onEditSubtask(task.id, subtask.id, value), rerender);
  });

  deleteSubBtn.addEventListener('click', () => {
    onDeleteSubtask(task.id, subtask.id);
  });

  return subLi;
}

function createDeadlineBlock(deadline, onDelete) {
  const wrapper = document.createElement('div');
  wrapper.className = 'deadline-wrapper';

  const dateP = document.createElement('p');
  dateP.className = 'deadline-date';
  dateP.textContent = `Deadline: ${deadline}`;

  const countP = document.createElement('p');
  countP.className = `deadline-status${isOverdue(deadline) ? ' overdue-text' : ''}`;
  countP.textContent = formatDeadlineStatus(deadline);

  const deleteDeadlineBtn = createButton('Delete deadline', 'delete-deadline__btn');
  deleteDeadlineBtn.addEventListener('click', onDelete);

  wrapper.append(dateP, countP, deleteDeadlineBtn);
  return wrapper;
}

function startTextEdit(textElement, currentText, onSave, rerender) {
  const input = document.createElement('input');
  input.className = 'edit-input';
  input.type = 'text';
  input.value = currentText;
  textElement.replaceWith(input);
  input.focus();
  input.select();

  let isDone = false;

  function finish(shouldSave) {
    if (isDone) return;
    isDone = true;

    const value = input.value.trim();
    if (shouldSave && value && value !== currentText) {
      onSave(value);
      return;
    }

    rerender();
  }

  input.addEventListener('keydown', event => {
    if (event.key === 'Enter') finish(true);
    if (event.key === 'Escape') finish(false);
  });
  input.addEventListener('blur', () => finish(true));
}

function startDeadlineEdit(container, task, onSetDeadline, onOpenDeadlinePicker, rerender) {
  if (container.querySelector('.deadline-input')) return;

  const input = document.createElement('input');
  input.className = 'deadline-input';
  input.type = 'datetime-local';
  input.value = toDateTimeLocalValue(task.deadline);

  const saveBtn = createButton('Save deadline', 'save-deadline__btn');
  const cancelBtn = createButton('Cancel', 'cancel-deadline__btn');

  const editor = document.createElement('div');
  editor.className = 'deadline-editor';
  editor.append(input, saveBtn, cancelBtn);
  container.appendChild(editor);

  function save() {
    const value = input.value.trim();
    if (!value) {
      rerender();
      return;
    }
    onSetDeadline(task.id, value.replace('T', ' '));
  }

  saveBtn.addEventListener('click', save);
  cancelBtn.addEventListener('click', rerender);
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter') save();
    if (event.key === 'Escape') rerender();
  });

  onOpenDeadlinePicker(task.id, input);
}

function startSubtaskCreate(container, taskId, onAddSubtask, rerender) {
  if (container.querySelector('.subtask-create-input')) return;

  const input = document.createElement('input');
  input.className = 'subtask-create-input';
  input.type = 'text';
  input.placeholder = 'New subtask...';
  container.appendChild(input);
  input.focus();

  let isDone = false;

  function finish(shouldSave) {
    if (isDone) return;
    isDone = true;

    const value = input.value.trim();
    if (shouldSave && value) {
      onAddSubtask(taskId, value);
      return;
    }

    rerender();
  }

  input.addEventListener('keydown', event => {
    if (event.key === 'Enter') finish(true);
    if (event.key === 'Escape') finish(false);
  });
  input.addEventListener('blur', () => finish(true));
}

function createButton(text, className) {
  const button = document.createElement('button');
  button.className = className;
  button.type = 'button';
  button.textContent = text;
  return button;
}

function formatDeadlineStatus(deadline) {
  const date = parseDeadline(deadline);
  if (!date) return 'Deadline date is invalid';

  const diff = date.getTime() - Date.now();
  const absDiff = Math.abs(diff);
  const days = Math.floor(absDiff / 86400000);
  const hours = Math.floor((absDiff % 86400000) / 3600000);
  const minutes = Math.floor((absDiff % 3600000) / 60000);

  if (diff < 0) return `Overdue by ${formatDuration(days, hours, minutes)}`;
  return `${formatDuration(days, hours, minutes)} left`;
}

function formatDuration(days, hours, minutes) {
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${Math.max(minutes, 0)}m`;
}

function isOverdue(deadline) {
  const date = parseDeadline(deadline);
  return Boolean(date && date.getTime() < Date.now());
}

function parseDeadline(deadline) {
  if (!deadline) return null;
  const normalized = deadline.includes('T') ? deadline : deadline.replace(' ', 'T');
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

function toDateTimeLocalValue(deadline) {
  if (!deadline) return '';
  return deadline.replace(' ', 'T');
}
