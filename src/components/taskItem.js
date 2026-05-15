export function createTaskItem(task, callbacks = {}, rerender = () => {}) {
  const {
    onToggle = () => {},
    onEdit = () => {},
    onDelete = () => {},
    onOpenDeadlinePicker = () => {},
    onDeleteDeadline = () => {},
    onAddSubtask = () => {},
    onToggleSubtask = () => {},
    onEditSubtask = () => {},
    onDeleteSubtask = () => {}
  } = callbacks;

  const li = document.createElement('li');
  li.dataset.id = task.id;

  // Checkbox
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = !!task.completed;
  li.appendChild(checkbox);

  // Task text span
  const span = document.createElement('span');
  span.textContent = task.text;
  li.appendChild(span);

  // Deadline display
  if (task.deadline) {
    const deadlineWrapper = document.createElement('div');
    deadlineWrapper.className = 'deadline-wrapper';
    const dateP = document.createElement('p');
    dateP.textContent = `📅 ${task.deadline}`;
    const countP = document.createElement('p');
    deadlineWrapper.appendChild(dateP);
    deadlineWrapper.appendChild(countP);
    li.appendChild(deadlineWrapper);
  }

  // Edit button
  const editBtn = document.createElement('button');
  editBtn.className = 'edit__btn';
  editBtn.textContent = 'Edit';
  li.appendChild(editBtn);

  // Deadline button
  const deadlineBtn = document.createElement('button');
  deadlineBtn.className = 'deadline__btn';
  deadlineBtn.textContent = 'Deadline';
  li.appendChild(deadlineBtn);

  // Delete deadline button
  const deleteDeadlineBtn = document.createElement('button');
  deleteDeadlineBtn.textContent = 'Delete deadline';
  if (task.deadline) li.appendChild(deleteDeadlineBtn);

  // Add subtask button
  const subtaskBtn = document.createElement('button');
  subtaskBtn.textContent = '+ subtask';
  li.appendChild(subtaskBtn);

  // Subtasks list
  if (task.subtasks && task.subtasks.length) {
    const subtaskList = document.createElement('ul');
    task.subtasks.forEach(st => {
      const subLi = document.createElement('li');
      
      const subCheckbox = document.createElement('input');
      subCheckbox.type = 'checkbox';
      subCheckbox.checked = !!st.completed;
      subLi.appendChild(subCheckbox);

      const subSpan = document.createElement('span');
      subSpan.textContent = st.text;
      subLi.appendChild(subSpan);

      const editSubBtn = document.createElement('button');
      editSubBtn.textContent = 'Edit subtask';
      subLi.appendChild(editSubBtn);

      const deleteSubBtn = document.createElement('button');
      deleteSubBtn.textContent = 'Delete subtask';
      subLi.appendChild(deleteSubBtn);

      // Subtask events
      subCheckbox.addEventListener('change', () => {
        onToggleSubtask(task.id, st.id, subCheckbox.checked);
      });

      editSubBtn.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = st.text;
        subLi.replaceChild(input, subSpan);
        input.focus();

        function save() {
          if (input.value.trim()) {
            onEditSubtask(task.id, st.id, input.value.trim());
            rerender();
          }
        }

        input.addEventListener('keydown', e => {
          if (e.key === 'Enter') save();
          if (e.key === 'Escape') rerender();
        });
        input.addEventListener('blur', save);
      });

      deleteSubBtn.addEventListener('click', () => {
        onDeleteSubtask(task.id, st.id);
      });

      subtaskList.appendChild(subLi);
    });
    li.appendChild(subtaskList);
  }

  // Delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete__btn';
  deleteBtn.textContent = 'Delete';
  li.appendChild(deleteBtn);

  // Task events
  checkbox.addEventListener('change', () => {
    onToggle(task.id, checkbox.checked);
  });

  editBtn.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = task.text;
    li.replaceChild(input, span);
    input.focus();

    function save() {
      if (input.value.trim()) {
        onEdit(task.id, input.value.trim());
        rerender();
      }
    }

    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') save();
      if (e.key === 'Escape') rerender();
    });
    input.addEventListener('blur', save);
  });

  deleteBtn.addEventListener('click', () => {
    onDelete(task.id);
  });

  deadlineBtn.addEventListener('click', () => {
    onOpenDeadlinePicker(task.id, li);
  });

  deleteDeadlineBtn.addEventListener('click', () => {
    onDeleteDeadline(task.id);
  });

 subtaskBtn.addEventListener('click', () => {

  const input = document.createElement('input');

  input.type = 'text';

  input.placeholder = 'New subtask...';

  li.appendChild(input);

  input.focus();

  let isSaved = false;

  function save() {

    if (isSaved) return;

    const value = input.value.trim();

    if (!value) return;

    isSaved = true;

    onAddSubtask(task.id, value);

    rerender();
  }

  input.addEventListener('keydown', e => {

    if (e.key === 'Enter') {

      e.preventDefault();

      save();
    }

    if (e.key === 'Escape') {

      rerender();
    }
  });

  input.addEventListener('blur', save);
});

  return li;
}
