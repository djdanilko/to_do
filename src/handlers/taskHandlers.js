import { saveTasks } from '../services/storage.js';

export function createTaskHandlers(array, renderList) {
  return {
    onToggle(id, checked) {
      const item = array.find(i => i.id === id);
      if (!item) return;
      item.completed = checked;
      if (item.subtasks) item.subtasks.forEach(s => s.completed = checked);
      saveTasks(array);
      renderList();
    },
    
    onEdit(id, newText) {
      const item = array.find(i => i.id === id);
      if (!item) return;
      if (newText && newText.trim()) {
        item.text = newText.trim();
        saveTasks(array);
        renderList();
      }
    },
    
    onDelete(id) {
      Swal.fire({
        title: 'Delete task?',
        text: 'This action cannot be undone',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel'
      }).then(result => {
        if (result.isConfirmed) {
          const index = array.findIndex(t => t.id === id);
          if (index !== -1) array.splice(index, 1);
          saveTasks(array);
          renderList();
          iziToast.success({ title: 'Deleted', message: 'Task deleted successfully', position: 'topRight' });
        }
      });
    },
    
    onOpenDeadlinePicker(id, li) {
      const input = document.createElement('input');
      input.type = 'text';
      li.appendChild(input);
      flatpickr(input, {
        enableTime: true,
        dateFormat: 'Y-m-d H:i',
        minDate: new Date(),
        onChange: function(selectedDates, dateStr) {
          const item = array.find(i => i.id === id);
          if (!item) return;
          item.deadline = dateStr;
          saveTasks(array);
          renderList();
        }
      });
    },
    
    onDeleteDeadline(id) {
      const item = array.find(i => i.id === id);
      if (!item) return;
      item.deadline = null;
      saveTasks(array);
      renderList();
      iziToast.success({ title: 'Deleted', message: 'Deadline deleted', position: 'topRight' });
    },
    
    onAddSubtask(id, text) {
      const item = array.find(i => i.id === id);
      if (!item) return;
      item.subtasks = item.subtasks || [];
      item.subtasks.push({ id: Date.now(), text, completed: false });
      saveTasks(array);
      renderList();
    },
    
    onToggleSubtask(id, subId, checked) {
      const item = array.find(i => i.id === id);
      if (!item) return;
      const st = item.subtasks && item.subtasks.find(s => s.id === subId);
      if (!st) return;
      st.completed = checked;
      item.completed = item.subtasks.every(s => s.completed);
      saveTasks(array);
      renderList();
    },
    
    onEditSubtask(id, subId, newText) {
      const item = array.find(i => i.id === id);
      if (!item) return;
      const st = item.subtasks && item.subtasks.find(s => s.id === subId);
      if (!st) return;
      if (newText && newText.trim()) {
        st.text = newText.trim();
        saveTasks(array);
        renderList();
      }
    },
    
    onDeleteSubtask(id, subId) {
      Swal.fire({
        title: 'Delete subtask?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel'
      }).then(result => {
        if (result.isConfirmed) {
          const item = array.find(i => i.id === id);
          if (!item) return;
          item.subtasks = item.subtasks.filter(s => s.id !== subId);
          saveTasks(array);
          renderList();
          iziToast.success({ title: 'Deleted', message: 'Subtask deleted successfully', position: 'topRight' });
        }
      });
    },
    
    onClearCompleted() {
      const initialLength = array.length;
      let i = 0;
      while (i < array.length) {
        if (array[i].completed) array.splice(i, 1);
        else i++;
      }
      saveTasks(array);
      renderList();
    }
  };
}
