const toggleLinks = document.querySelectorAll('.toggle-form');
const cadastroForm = document.querySelector('.flip-card__front');
const loginForm = document.querySelector('.flip-card__back');

toggleLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault(); // Evita o comportamento padrão do link
        if (cadastroForm.style.display === 'none') {
            cadastroForm.style.display = 'flex';
            loginForm.style.display = 'none';
        } else {
            cadastroForm.style.display = 'none';
            loginForm.style.display = 'flex';
        }
    });
});