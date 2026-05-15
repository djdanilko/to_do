export function initForm(onSubmit) {
  const form = document.querySelector('.form');
  const input = form.querySelector('.input');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = input.value && input.value.trim();
    if (!value) return;
    onSubmit(value);
    input.value = '';
    input.focus();
  });
}
