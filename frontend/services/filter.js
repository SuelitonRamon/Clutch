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


document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Captura os parâmetros da URL
        const params = new URLSearchParams(window.location.search);
        const categoria = params.get('categoria'); // Obtém o valor do parâmetro 'categoria'

        // Faz a chamada para a API para buscar os produtos da categoria
        const response = await axios.get(`http://localhost:3000/api/filter?categoria=${categoria}`);
        const products = response.data;
        const itensContainer = document.querySelector('.itens');

        if (!products || products.length === 0) {
            console.log("Nenhum produto encontrado!");
            itensContainer.innerHTML = '<p>Nenhum produto encontrado para esta categoria.</p>';
            return;
        }
        // Exibe os produtos na página
 
        itensContainer.innerHTML = ''; // Limpa o container

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
        const itensContainer = document.querySelector('.itens');
        console.error("Erro ao carregar os produtos:", error);
        itensContainer.innerHTML = `
        <div class="notfound">
            <h1>Nenhum produto encontrado para esta categoria.</h1>
            <img class="decepcao" src="sources/decepcao.webp"
        </div>
        `;
    }
});