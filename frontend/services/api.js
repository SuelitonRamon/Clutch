// Função para buscar os produtos e renderizá-los
async function fetchProducts() {
  try {
      // Faz a requisição para o servidor usando axios
      const response = await axios.get('http://localhost:3000/api/products');
      const products = response.data;

      // Seleciona o elemento onde os produtos serão inseridos
      const itensContainer = document.querySelector('.itens');

      // Verifica se o container de produtos existe
      if (!itensContainer) {
          console.error('Elemento .itens não encontrado no DOM.');
          return;
      }

      // Limpa os itens existentes
      itensContainer.innerHTML = '';

      // Renderiza cada produto
      products.forEach(product => {
          // Cria o HTML de cada item de produto
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

          // Adiciona o item ao container de itens
          itensContainer.appendChild(item);
      });
  } catch (error) {
      console.error('Erro ao buscar os produtos:', error);
  }
}

// Garante que a função seja chamada quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', fetchProducts);
