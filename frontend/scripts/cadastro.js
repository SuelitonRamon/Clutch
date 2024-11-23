document.addEventListener('DOMContentLoaded', () => {
    // Selecione o formulário de cadastro
    const formCadastro = document.querySelector('.cadastro-form');

    const token = localStorage.getItem('token');
    if (token) {
        window.location.href = 'index.html';
    }


    formCadastro.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evita o envio padrão do formulário

        // Captura os valores dos campos
        const nome = document.querySelector('input[placeholder="Nome"]').value;
        const email = document.querySelector('input[placeholder="Email"]').value;
        const senha = document.querySelector('input[placeholder="Senha"]').value;
        const confirmarSenha = document.querySelector('input[placeholder="Confirme sua senha"]').value;

        // Verifica se as senhas coincidem
        if (senha !== confirmarSenha) {
            alert('As senhas não coincidem!');
            return;
        }
        const nickname = nome;

        // Enviar dados para o backend usando Axios
        try {
            const response = await axios.post('http://localhost:3000/users/', { // Altere para a rota correta
                nome,
                email,
                senha,
                nickname
            });

            // Exibir a mensagem de sucesso
            alert('Sucesso');
            window.location.href = 'login.html'; // Redirecionar para a página de login
        } catch (error) {
            console.error('Erro ao cadastrar:', error);

            // Tratar erros (mensagem do servidor ou erro de conexão)
            if (error.response) {
                alert(error.response.data.mensagem || 'Erro ao cadastrar usuário.');
            } else {
                alert('Erro ao conectar ao servidor.');
            }
        }
    });
})