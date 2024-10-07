// frontend/app.js

// Função para buscar todos os produtos
async function fetchProducts() {
    try {
      const response = await fetch('http://localhost:3000/api/products');
      const products = await response.json();
      renderProducts(products);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  }
  
  // Função para renderizar os produtos na página
  function renderProducts(products) {
    const productContainer = document.getElementById('product-container');
    productContainer.innerHTML = ''; // Limpa o container antes de renderizar os novos produtos
    
    products.forEach(product => {
      const productElement = document.createElement('div');
      productElement.classList.add('product');
      productElement.innerHTML = `
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p>Preço: R$ ${product.price}</p>
        <p>Categoria: ${product.Category.name}</p>
      `;
      productContainer.appendChild(productElement);
    });
  }
  
  // Chamar a função para carregar os produtos ao carregar a página
  document.addEventListener('DOMContentLoaded', fetchProducts);
  