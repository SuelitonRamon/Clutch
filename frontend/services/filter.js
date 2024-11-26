window.filtrarProdutos = async function (element) {
    try{
        const categoria = element.dataset.categoria;
        const response = await axios.get(`http://localhost:3000/api/filter?categoria=${categoria}`)
        const products = response.data;
        if(!products || products.length === 0){
            console.log("Nenhum produto encontrado!")
        }
        const itensContainer = document.querySelector('.itens');

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
    })} catch {
        console.log("Error");
    }
}