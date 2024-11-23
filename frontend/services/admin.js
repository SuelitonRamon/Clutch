let list = document.querySelectorAll(".navigation li");
let toggle = document.querySelector(".toggle");
let navigation = document.querySelector(".navigation");
let main = document.querySelector(".cadastro-principall");

function activeLink() {
  list.forEach((item) => {
    item.classList.remove("hovered");
  });
  this.classList.add("hovered");
}

function setActivePage() {
    const currentPath = window.location.pathname; // Obtém o caminho da URL atual
    list.forEach((item) => {
      const link = item.querySelector(".navlink"); // Supondo que há um <a> dentro do menu-item
      if (link && link.getAttribute("href") === currentPath) {
        item.classList.add("hovered");
      }
    });
  }
  
  // Adiciona o evento de clique nos itens do menu
  list.forEach((item) => {
    item.addEventListener("click", activeLink);
  });

list.forEach((item) => item.addEventListener("mouseover", activeLink));

toggle.onclick = function () {
  navigation.classList.toggle("active");
  main.classList.toggle("active");
};


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

const token = localStorage.getItem('token');
const userData = decodeToken(token);
const role = userData.role;

if(role != 'admin'){
    window.location.href = 'index.html';
}