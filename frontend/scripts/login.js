document.addEventListener('DOMContentLoaded', () => {
    // Verifica se o usuário já está logado verificando o token no localStorage
    const token = localStorage.getItem('token');
    if (token) {
        window.location.href = 'index.html';
    }

    // Selecione o formulário de login
    const loginform = document.querySelector('.loginform');

    loginform.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evita o envio padrão do formulário

        // Captura os valores dos campos
        const email = document.querySelector('input[placeholder="Email"]').value;
        const senha = document.querySelector('input[placeholder="Senha"]').value;

        // Enviar dados para o backend usando Axios
        try {
            const response = await axios.post('http://localhost:3000/auth/login', {
                email,
                senha,
            });

            // Exibir a mensagem de sucesso
            alert('Login bem-sucedido');

            // Armazenar o token no localStorage
            const token = response.data.token;
            localStorage.setItem('token', token); // Armazena o token

            // Redirecionar para a página de usuário autenticado
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Erro ao logar:', error);

            // Tratar erros (mensagem do servidor ou erro de conexão)
            if (error.response) {
                alert(error.response.data.mensagem || 'Erro ao tentar fazer login.');
            } else {
                alert('Erro ao conectar ao servidor.');
            }
        }
    });
});
