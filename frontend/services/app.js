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
                <a href="produto.html?id=${product.id}"><button class="buy-button">
                    <img class="buy-cart" src="sources/carrinho-de-compras.png" alt="Carrinho">
                    COMPRAR
                </button></a>
            `;

            itensContainer.appendChild(item);
        });
    } catch (error) {
        console.error('Erro ao buscar os produtos:', error);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    fetchProducts();
});