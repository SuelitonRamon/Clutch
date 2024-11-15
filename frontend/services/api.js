// Lógica do botão de loggout
const loggoutbtn = document.querySelector('.loggout-btn');
if (loggoutbtn) {
    loggoutbtn.addEventListener('click', () => {
        localStorage.removeItem('token'); // Remove o token
        window.location.href = 'index.html'; // Redireciona para a página de login
    });
    }

// Função para buscar os produtos e renderizá-los
async function fetchProducts() {
    try {
        const response = await axios.get('http://localhost:3000/api/products');
        const products = response.data;

        const itensContainer = document.querySelector('.itens');

        if (!itensContainer) {
            console.error('Elemento .itens não encontrado no DOM.');
            return;
        }

        itensContainer.innerHTML = '';

        products.forEach(product => {
            const item = document.createElement('div');
            item.classList.add('item');

            item.innerHTML = `
                <img class="novo-produto" src="http://localhost:3000/${product.capa}" alt="${product.nome}">
                <p class="product-name">${product.nome}</p>
                <p class="product-price">R$ ${parseFloat(product.preco).toFixed(2)}</p>
                <button class="buy-button">
                    <img class="buy-cart" src="sources/carrinho-de-compras.png" alt="Carrinho">
                    COMPRAR
                </button>
            `;

            itensContainer.appendChild(item);
        });
    } catch (error) {
        console.error('Erro ao buscar os produtos:', error);
    }
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

            if (Date.now() / 1000 < expirationTime) {
                console.log('Token válido. Usuário logado:', userData);
                loginHeader.innerHTML = `
    <span class="welcome">Olá, ${userData.nome}</span>
`;
                menubutton.style.display= 'block';
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
    fetchProducts();
    handleLogin();
});