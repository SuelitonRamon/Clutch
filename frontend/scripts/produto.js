const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');
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

console.log(productId); // Exibe o ID no console

async function fetchProducts() {
    try {
        const response = await axios.get(`http://localhost:3000/api/products/${productId}`);
        const product = response.data;
        console.log(product);

        const itempage = document.querySelector('.principal');

        if (!itempage) {
            console.error('Elemento .product-page não encontrado no DOM.');
            return;
        }

        itempage.innerHTML = '';


            const item = document.createElement('div');
            item.classList.add('item');

            item.innerHTML = `
            <main class="principal">
            <div class="product-page">
                <div class="container-site">
                    <div class="container1">
                        <h1 class="product-tittle">${product.nome}</h1>
                    </div>
                    <div class="container2">
                        <article class="product-imgg">
                            <div id="carouselExampleAutoplaying" class="carousel slide" data-bs-ride="carousel">
                                <div class="carousel-inner">
                                  <div class="carousel-item active">
                                    <img src="http://localhost:3000/${product.capa}" class="d-block w-100" alt="...">
                                  </div>
                                  <div class="carousel-item">
                                    <img src="http://localhost:3000/${product.img_1}" class="d-block w-100" alt="...">
                                  </div>
                                  <div class="carousel-item">
                                    <img src="http://localhost:3000/${product.img_2}" class="d-block w-100" alt="...">
                                  </div>
                                  <div class="carousel-item">
                                    <img src="http://localhost:3000/${product.img_3}" class="d-block w-100" alt="...">
                                  </div>
                                </div>
                                <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
                                  <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                  <span class="visually-hidden">Previous</span>
                                </button>
                                <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
                                  <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                  <span class="visually-hidden">Next</span>
                                </button>
                              </div>
                        </article>
                        <article class="product-info">
                            <section class="section1">
                                <p>${product.descricao} </p>
                            </section>
                            <section class="section2">
                                <p class="product-price">R$${product.preco}</p>
                                <button onclick="addToCart(${product.id})" class="buy-button">
                                    <img class="buy-cart" src="sources/carrinho-de-compras.png" alt="">
                                    COMPRAR
                                </button>
                            </section>    
                        </article>
                    </div>
                </div>
            </div>
            <div class="extensao">
                <div id="img-ad" class="row">
                    <img src="sources/3163.jpg" alt="">
                </div>
                <div class="video-container">
                    <iframe 
                    src="https://www.youtube.com/embed/${product.trailer.split('=')[1]}" 
                    title="YouTube video player" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                    </iframe>
                </div>
            </div>    
        </main>
`;

            itempage.appendChild(item);
            
    } catch (error) {
        console.error('Erro ao buscar os produtos:', error);
    }
}

    // Adicionar item ao carrinho
async function addToCart(productId) {
    try {
        const response = await axiosInstance.post('/cart/add', {
            productId,
            quantidade: 1
        });
        alert('Produto adicionado ao carrinho!');
    } catch (error) {
        console.error('Erro ao adicionar produto:', error.response?.data || error.message);
        alert(error.response?.data.error || 'Erro ao adicionar produto!');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    fetchProducts();
});