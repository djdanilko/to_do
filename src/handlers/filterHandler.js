export function initFilters(onFilterChange) {
  const buttons = document.querySelectorAll('.filter');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const f = btn.dataset.filter;
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      onFilterChange && onFilterChange(f);
    });
  });
}
