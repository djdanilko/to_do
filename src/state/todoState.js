import { tasks, setTasks, filter, setFilter as setFilterState } from '../state.js';

export function setTodos(todos) {
  setTasks(todos);
}

export function addTodo(todo) {
  tasks.push(todo);
}

export function toggleTodo(id) {
  const t = tasks.find(x => x.id === id);
  if (t) t.completed = !t.completed;
}

export function removeTodo(id) {
  setTasks(tasks.filter(x => x.id !== id));
}

export function setFilter(v) {
  setFilterState(v);
}

export function getFilteredTodos() {
  if (filter === 'all') return tasks;
  if (filter === 'active') return tasks.filter(t => !t.completed);
  if (filter === 'completed') return tasks.filter(t => t.completed);
  return tasks;
}

export function countActive() {
  return tasks.filter(t => !t.completed).length;
}
