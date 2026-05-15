export const tasks = [];
export let filter = 'all';

export function setTasks(newTasks) {
  // replace array contents to keep references
  tasks.length = 0;
  if (Array.isArray(newTasks)) tasks.push(...newTasks);
}

export function setFilter(newFilter) {
  filter = newFilter;
}
