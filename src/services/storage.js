const KEY = 'tasks';

export function loadTasks() {
  try {
    const raw = localStorage.getItem(KEY);
    const tasks = raw ? JSON.parse(raw) : [];
    return Array.isArray(tasks) ? tasks : [];
  } catch (e) {
    console.error('Failed to load tasks', e);
    return [];
  }
}

export function saveTasks(tasks) {
  try {
    localStorage.setItem(KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save tasks', e);
  }
}
