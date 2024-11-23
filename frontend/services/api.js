// Lógica do botão de loggout
const loggoutbtn = document.querySelector('.loggout-btn');
if (loggoutbtn) {
    loggoutbtn.addEventListener('click', () => {
        localStorage.removeItem('token'); // Remove o token
        window.location.href = 'index.html'; // Redireciona para a página de login
    });
    }

// Função para decodificar o token JWT
function decodeToken(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = JSON.parse(atob(base64));
        return jsonPayload;
    } catch (error) {
        console.error('Erro ao decodificar o token:', error);
        return null;
    }
}

// Manipula o login dependendo da validade do token
function handleLogin() {
    const token = localStorage.getItem('token');
    const loginHeader = document.querySelector('.login-header');
    const menubutton = document.querySelector('.menu');
    if (token) {
        try {
            const userData = decodeToken(token);
            const expirationTime = userData.exp;
            const role = userData.role;
            const dropdownContent = document.querySelector('.dropdown-content');

            if (Date.now() / 1000 < expirationTime) {
                console.log('Token válido. Usuário logado:', userData);
                loginHeader.innerHTML = `
    <span class="welcome">Olá, ${userData.nome}</span>
`;
                menubutton.style.display= 'block';

                if (role === 'admin') {
                    const adminLink = document.createElement('a');
                    adminLink.href = '/admin';
                    adminLink.textContent = 'Administrativo';
                    adminLink.href = 'cadastroProduto.html';
                    const secondLink = dropdownContent.querySelectorAll('a')[0]; // Seleciona o segundo <a>
    dropdownContent.insertBefore(adminLink, secondLink); // Insere antes do segundo <a>
                }    
                
            } else {
                console.warn('Token expirado.');
                localStorage.removeItem('token');
            }
        } catch (e) {
            console.error('Erro ao processar o token:', e);
        }
    } else {
        console.log('Nenhum token encontrado no localStorage.');
    }
}

// Chama as funções ao carregar a página
document.addEventListener('DOMContentLoaded', function () {
    handleLogin();
});