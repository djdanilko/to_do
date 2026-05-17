import { saveTasks } from '../services/storage.js';
import { uid } from '../utils/uid.js';

function notifySuccess(title, message) {
  if (window.iziToast) {
    window.iziToast.success({ title, message, position: 'topRight' });
  }
}

function confirmAction(options) {
  if (window.Swal) {
    return window.Swal.fire(options).then(result => result.isConfirmed);
  }

  return Promise.resolve(window.confirm(options.title));
}

function syncParentState(task) {
  if (!task.subtasks || !task.subtasks.length) return;
  task.completed = task.subtasks.every(subtask => subtask.completed);
}

function saveAndRender(array, renderList) {
  saveTasks(array);
  renderList();
}

export function createTaskHandlers(array, renderList) {
  return {
    onToggle(id, checked) {
      const item = array.find(i => i.id === id);
      if (!item) return;
      item.completed = checked;
      if (item.subtasks) item.subtasks.forEach(s => s.completed = checked);
      saveAndRender(array, renderList);
    },
    
    onEdit(id, newText) {
      const item = array.find(i => i.id === id);
      if (!item) return;
      if (newText && newText.trim()) {
        item.text = newText.trim();
        saveAndRender(array, renderList);
      }
    },
    
    onDelete(id) {
      confirmAction({
        title: 'Delete task?',
        text: 'This action cannot be undone',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel'
      }).then(isConfirmed => {
        if (!isConfirmed) return;
        const index = array.findIndex(t => t.id === id);
        if (index !== -1) array.splice(index, 1);
        saveAndRender(array, renderList);
        notifySuccess('Deleted', 'Task deleted successfully');
      });
    },
    
    onSetDeadline(id, deadline) {
      const item = array.find(i => i.id === id);
      if (!item) return;
      item.deadline = deadline || null;
      saveAndRender(array, renderList);
    },

    onOpenDeadlinePicker(id, input) {
      if (!window.flatpickr) {
        input.showPicker && input.showPicker();
        return;
      }

      input.type = 'text';
      input.value = input.value.replace('T', ' ');
      window.flatpickr(input, {
        enableTime: true,
        dateFormat: 'Y-m-d H:i',
        minDate: new Date(),
        onChange: function(selectedDates, dateStr) {
          const item = array.find(i => i.id === id);
          if (!item) return;
          item.deadline = dateStr;
          saveAndRender(array, renderList);
        }
      });
      input.focus();
    },
    
    onDeleteDeadline(id) {
      const item = array.find(i => i.id === id);
      if (!item) return;
      item.deadline = null;
      saveAndRender(array, renderList);
      notifySuccess('Deleted', 'Deadline deleted');
    },
    
    onAddSubtask(id, text) {
      const item = array.find(i => i.id === id);
      if (!item) return;
      item.subtasks = item.subtasks || [];
      item.subtasks.push({ id: uid(), text, completed: false });
      item.completed = false;
      saveAndRender(array, renderList);
    },
    
    onToggleSubtask(id, subId, checked) {
      const item = array.find(i => i.id === id);
      if (!item) return;
      const st = item.subtasks && item.subtasks.find(s => s.id === subId);
      if (!st) return;
      st.completed = checked;
      syncParentState(item);
      saveAndRender(array, renderList);
    },
    
    onEditSubtask(id, subId, newText) {
      const item = array.find(i => i.id === id);
      if (!item) return;
      const st = item.subtasks && item.subtasks.find(s => s.id === subId);
      if (!st) return;
      if (newText && newText.trim()) {
        st.text = newText.trim();
        saveAndRender(array, renderList);
      }
    },
    
    onDeleteSubtask(id, subId) {
      confirmAction({
        title: 'Delete subtask?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel'
      }).then(isConfirmed => {
        if (!isConfirmed) return;
        const item = array.find(i => i.id === id);
        if (!item) return;
        item.subtasks = item.subtasks.filter(s => s.id !== subId);
        syncParentState(item);
        saveAndRender(array, renderList);
        notifySuccess('Deleted', 'Subtask deleted successfully');
      });
    },
    
    onClearCompleted() {
      let i = 0;
      while (i < array.length) {
        if (array[i].completed) array.splice(i, 1);
        else i++;
      }
      array.forEach(task => {
        task.subtasks = task.subtasks.filter(subtask => !subtask.completed);
        syncParentState(task);
      });
      saveAndRender(array, renderList);
    }
  };
}
