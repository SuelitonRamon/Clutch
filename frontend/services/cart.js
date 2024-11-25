const API_URL = "http://localhost:3000"; // URL do backend
const token = localStorage.getItem('token'); // Certifique-se de que o token JWT está armazenado

// Configuração padrão do Axios
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});

// Função para buscar o carrinho
async function fetchCart() {
    try {
        const response = await axiosInstance.get('/cart');
        const cart = response.data;
        renderCart(cart.itens); // Renderiza os itens do carrinho
    } catch (error) {
        console.error('Erro ao buscar carrinho:')
    }
}

// Renderizar itens no carrinho
function renderCart(items) {
    const cartItemsContainer = document.getElementById('carrinho-itens'); // Seleciona o contêiner de itens do carrinho
    cartItemsContainer.innerHTML = ''; // Limpa os itens existentes

    // Verifica se há itens no carrinho
    if (items.length === 0) {
        cartItemsContainer.innerHTML = `<p style="text-align: center; font-size: 1.2rem;">Seu carrinho está vazio!</p>`;
        const div = document.querySelector('.carrinho-resumo');
        div.innerHTML = '';
        return;
    }

    // Itera pelos itens e cria os cartões
    items.forEach(item => {
        // Garantir que precoUnitario é um número válido
        const precoUnitario = parseFloat(item.precoUnitario);
        if (isNaN(precoUnitario)) {
            console.error('Preço unitário inválido para o item:', item);
            return; // Se o preço não for válido, não exibe o item
        }

        let total = precoUnitario * item.quantidade;
        let valorr = precoUnitario;
        const valorformatado = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(valorr);
          const totalformatado = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(total);

        const itemDiv = document.createElement('div');
        itemDiv.classList.add('cart-item');

        itemDiv.innerHTML = `
            <img src="http://localhost:3000/${item.produto.capa || 'sources/default-product.png'}" alt="${item.produto.nome}" class="cart-item-img">
            <p>${item.produto.nome}</p>
            <p>Preço Unitário: R$ ${valorformatado}</p>
            <div class="quantity-control">
                <label>Quantidade:</label>
                <input 
                    type="number" 
                    value="${item.quantidade}" 
                    min="1" 
                    onchange="updateItem(${item.id}, this.value)">
            </div>
            <p>Total: R$ ${(totalformatado)}</p>
            <button class="remove-item-btn" onclick="removeItem(${item.id})">
            <img class="removepng" src="sources/remover.png"></img>
            Remover</button>
        `;

        cartItemsContainer.appendChild(itemDiv);
    });

    // Atualiza o total geral do carrinho
    updateCartTotal(items);
}

// Função para atualizar o total geral no resumo
function updateCartTotal(items) {
    const total = items.reduce((sum, item) => sum + (item.quantidade * parseFloat(item.precoUnitario)), 0);
    const totalformatado = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(total);
    const totalElement = document.getElementById('carrinho-total');
    totalElement.textContent = `R$ ${totalformatado}`;
}

// Função para atualizar a quantidade de um item
async function updateItem(itemId, quantidade) {
    try {
        const response = await axiosInstance.put(`/cart/item`, {
            cartItemId: itemId,
            quantidade: parseInt(quantidade)
        });
        renderCart(response.data.itens);
    } catch (error) {
        console.error('Erro ao atualizar item:', error.response?.data || error.message);
        alert(error.response?.data.error || 'Erro ao atualizar item!');
    }
}

// Função para remover um item do carrinho
async function removeItem(itemId) {
    try {
        const response = await axiosInstance.delete(`/cart/item/${itemId}`);
        renderCart(response.data.itens);
    } catch (error) {
        console.error('Erro ao remover item:', error.response?.data || error.message);
        alert(error.response?.data.error || 'Erro ao remover item!');
    }
}

// Função para finalizar a compra
async function finalizeCart() {
    try {
        const response = await axiosInstance.post('/cart/checkout');
        const result = response.data;
        alert(`Compra finalizada! Total: R$ ${result.pedido.total}`);
        renderCart([]); // Limpa o carrinho após a finalização da compra
    } catch (error) {
        console.error('Erro ao finalizar compra:', error.response?.data || error.message);
        alert(error.response?.data.error || 'Erro ao finalizar compra!');
    }
}

// Inicializa o carrinho ao carregar a página
fetchCart();
