//обработчик нажатий кнопки смены темы
const toggleBtn = document.getElementById('themeToggle');
const root = document.documentElement;

toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
})