// Seleção de elementos
const opennewproduct = document.querySelector('.btn.btn-success');
const closenewproduct = document.querySelector('#fechaai');
const cadastroproduto = document.querySelector('.cadastroproduto-form');
const crud = document.querySelector('.crud-produtos');
const newproduct = document.querySelector('.cadastroproduto-form'); // Defina o container correto
let isEditMode = false;  // Flag para identificar se estamos em modo de edição
let currentProductId = null;

const a = document.querySelector('#gprodutos');
a.classList.add('ative');

// Função de cadastro de produto
const handleSubmitCadastro = async (e) => {
    e.preventDefault();

    const nome = document.querySelector('#nome').value;
    const descricao = document.querySelector('#descricao').value;
    const preco = document.querySelector('#preco').value;
    const categoria = document.querySelector('#categoria').value;
    const capa = document.querySelector('#capa').files[0];
    const img_1 = document.querySelector('#imagem1').files[0];
    const img_2 = document.querySelector('#imagem2').files[0];
    const img_3 = document.querySelector('#imagem3').files[0];
    const trailer = document.querySelector('#youtube').value;

    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('descricao', descricao);
    formData.append('preco', preco);
    formData.append('categoria', categoria);
    formData.append('capa', capa);
    formData.append('img_1', img_1);
    formData.append('img_2', img_2);
    formData.append('img_3', img_3);
    formData.append('trailer', trailer);

    try {
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:3000/api/products', formData, {
            headers: { 'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        });
        alert('Produto cadastrado com sucesso!');
    } catch (error) {
        console.error('Erro ao cadastrar produto', error);
        if (error.response && error.response.status === 403) {
            window.location.href = '403.html';
        }if (error.response) {
            alert(error.response.data.mensagem || 'Erro ao cadastrar produto.');
        } else {
            alert('Erro ao conectar ao servidor.');
        }
    }
};

// Função de edição de produto
async function handleSubmitEdicao(e) {
    e.preventDefault();

    const nome = document.querySelector('#nome').value;
    const descricao = document.querySelector('#descricao').value;
    const preco = document.querySelector('#preco').value;
    const categoria = document.querySelector('#categoria').value;
    const capa = document.querySelector('#capa').files[0];
    const img_1 = document.querySelector('#imagem1').files[0];
    const img_2 = document.querySelector('#imagem2').files[0];
    const img_3 = document.querySelector('#imagem3').files[0];
    const trailer = document.querySelector('#youtube').value;

    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('descricao', descricao);
    formData.append('preco', preco);
    formData.append('categoria', categoria);
    formData.append('capa', capa);
    formData.append('img_1', img_1);
    formData.append('img_2', img_2);
    formData.append('img_3', img_3);
    formData.append('trailer', trailer);

    try {
        const token = localStorage.getItem('token');
        const response = await axios.patch(`http://localhost:3000/api/products/${currentProductId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
            }
        });
        alert('Produto editado com sucesso!');
    } catch (error) {
        console.error('Erro ao editar produto', error);
        if (error.response && error.response.status === 403) {
            window.location.href = '403.html'; // Redireciona para a página de erro
          } if (error.response) {
            alert(error.response.data.mensagem || 'Erro ao editar produto.');
            } else {
            alert('Erro ao conectar ao servidor.');
        }
    }
};

// Função para abrir o formulário de cadastro
opennewproduct.addEventListener('click', () => {
    isEditMode = false;
    currentProductId = null;

    // Limpar o formulário para garantir que ele comece vazio
    cadastroproduto.reset();

    // Mostrar o formulário de cadastro
    crud.style.display = 'none';
    newproduct.style.display = 'block';

    // Remover o evento de edição (caso tenha sido ativado) e adicionar o de cadastro
    cadastroproduto.removeEventListener('submit', handleSubmitEdicao);
    cadastroproduto.addEventListener('submit', handleSubmitCadastro);
});

closenewproduct.addEventListener('click', () => {
    isEditMode = false;
    currentProductId = null;

    // Mostrar o formulário de cadastro
    newproduct.style.display = 'none';
    crud.style.display = 'block';
    

    // Remover o evento de edição (caso tenha sido ativado) e adicionar o de cadastro
    cadastroproduto.removeEventListener('submit', handleSubmitEdicao);
    cadastroproduto.addEventListener('submit', handleSubmitCadastro);
    fetchProducts();
});

// Função para abrir o formulário de edição
async function updateProduct(id) {
    try {
        const response = await axios.get(`http://localhost:3000/api/products/${id}`);
        const produto = response.data;

        document.getElementById('nome').value = produto.nome;
        document.getElementById('descricao').value = produto.descricao;
        document.getElementById('preco').value = produto.preco;
        document.getElementById('categoria').value = produto.categoria;
        document.getElementById('youtube').value = produto.trailer || '';

        isEditMode = true;
        currentProductId = id;

        crud.style.display = 'none';
        newproduct.style.display = 'block';

        // Remover o evento de cadastro e adicionar o de edição
        cadastroproduto.removeEventListener('submit', handleSubmitCadastro);
        cadastroproduto.addEventListener('submit', handleSubmitEdicao);
    } catch (error) {
        console.error('Erro ao buscar os dados do produto:', error);
        alert('Erro ao carregar os dados do produto.');
    }
}

window.deleteProduct = async function (id) {
    const confirmar = document.getElementById("Confirmar"); // Corrige o ID como string
    console.log(id);
    
    confirmar.addEventListener("click", async () => { // Declara a callback como async
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`http://localhost:3000/api/products/${id}`, {
                    headers: { 'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                    }
            });
            console.log("Produto deletado com sucesso:", response.data);
            window.location.href = 'cadastroProduto.html';
        } catch (error) {
            if (error.response && error.response.status === 403 || 401) {
                window.location.href = '403.html'; // Redireciona para a página de erro
              }
            console.error("Erro ao deletar produto:", error);
        }
    });
};

// Função para buscar e renderizar os produtos
async function fetchProducts() {
    try {
        const response = await axios.get('http://localhost:3000/api/products');
        const products = response.data;
        const container = document.querySelector('.container');
        const userslist = document.querySelector('#userTableBody');
        const productlistmobile = document.querySelector('.product-list');
  
        if (!container) {
          console.error('Elemento "container" não encontrado no DOM.');
          return;
        }

        userslist.style.display = 'table-row-group';
        container.style.display = 'block';
        productlistmobile.style.display = 'none';
        

        if (!userslist) {
          console.error('Elemento "userTableBody" não encontrado no DOM.');
          return;
        }


        userslist.innerHTML = ''; // Limpa a lista antes de renderizar os usuários
  
        products.forEach((product) => {
            const row = document.createElement('tr');
            const maxLength = 30;
            const id = product.id;
            const nome = product.nome.length > maxLength ? product.nome.slice(0, maxLength) + "..." : product.nome;
            const preco = product.preco;
            const categoria = product.categoria;

            row.innerHTML = `
            <td>#${id.toString().padStart(3, '0')}</td>
            <td>${nome}</td>
            <td>${preco}</td>
            <td><span class="role-badge ${categoria}">${categoria}</span></td>
            <td class="actions">
                <button class="edit-btn" onclick="updateProduct(${id})">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                    Editar
                </button>
                <button id="deletao" class="delete-btn" onclick="deleteProduct(${id})" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                    Deletar
                </button>
            </td>
        `;

            userTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Erro ao buscar os produtos:', error);
    }
}

async function fetchProductsMobile() {
    try {
        const response = await axios.get('http://localhost:3000/api/products');
        const products = response.data;

        const productlist = document.querySelector('.product-list');
        const container = document.querySelector('.container');
        const userslistdesktop = document.querySelector('#userTableBody');
  
        if (!container) {
          console.error('Elemento "container" não encontrado no DOM.');
          return;
        }

        userslistdesktop.style.display = 'none';
        container.style.display = 'none';
        productlist.style.display = 'flex';

        productlist.innerHTML = '';

        products.forEach(product => {
            const item = document.createElement('div');
            item.classList.add('item');
            const maxLength = 30;
            const id = product.id;
            const nome = product.nome.length > maxLength ? product.nome.slice(0, maxLength) + "..." : product.nome;
            const preco = product.preco;
            const categoria = product.categoria;

            item.innerHTML = `
                <p class="name">${nome}</p>
                <p class="price">R$ ${preco}</p>
                <p class="category">${categoria}</p>
                <div class="actions">
                    <button onclick="updateProduct(${id})">Editar</button>
                    <button type="button" class="btn btn-primary" onclick="deleteProduct(${id})" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Deletar</button>
                </div>
            `;

            productlist.appendChild(item);
        });
    } catch (error) {
        console.error('Erro ao buscar os produtos:', error);
    }
}

function handleFetchProducts() {
    const mediaQuery = window.matchMedia('(max-width: 480px)'); // Define o breakpoint para telas mobile
  
    if (mediaQuery.matches) {
      // Se for uma tela mobile, use a função específica
      fetchProductsMobile();
    } else {
      // Caso contrário, use a função para desktop
      fetchProducts();
    }
  }
  
  // Adiciona um listener para reagir a mudanças no tamanho da tela
  const mediaQuery = window.matchMedia('(max-width: 768px)');
  mediaQuery.addEventListener('change', handleFetchProducts);

document.addEventListener('DOMContentLoaded', function () {
    handleFetchProducts();
});
