// Função para buscar os produtos e renderizá-los
document.getElementById('search-bar').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault(); // Impede o comportamento padrão
      const query = event.target.value.trim(); // Captura o texto digitado
      if (!query) {
        alert('Por favor, insira um termo para busca.');
        return;
      }
      window.location.href = `filter.html?query=${encodeURIComponent(query)}`; // Redireciona para a página de resultados
    }
  });

window.filtrarProdutos = function (element) {
    // Obtém a categoria do dataset do elemento clicado
    const categoria = element.dataset.categoria;

    // Redireciona para a página de produtos, passando a categoria como parâmetro na URL
    window.location.href = `search.html?categoria=${encodeURIComponent(categoria)}`;
};


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