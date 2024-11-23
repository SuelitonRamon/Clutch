document.addEventListener('DOMContentLoaded', () => {

    let userId = null; // Inicializa o ID do usuário como nulo
  
    function getRoleBadgeClass(role) {
      switch(role.toLowerCase()) {
          case 'admin':
              return 'role-admin';
          default:
              return 'role-user';
      }
  }

    const a = document.querySelector('#gusuarios');
    a.classList.add('ative');

    // Função para definir o ID do usuário
    window.setUserId = async function (id) {
      try {
        userId = id;
        const response = await axios.get(`http://localhost:3000/users/${id}`,
            {
              headers: {
                'Authorization': `Bearer ${token}` // Envia o token no cabeçalho
              }
            });
        const user = response.data;
        document.getElementById('editName').value = user.nome;
        document.getElementById('editEmail').value = user.email;
        const editModal = document.querySelector('#editModal');
        console.log(`ID do usuário selecionado: ${id}`);
        editModal.style.display = 'block';
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      }
    };
    // Certifica-se de que o formulário existe antes de adicionar o listener
        document.getElementById('enviar').onclick = async (event) => {
        event.preventDefault(); // Impede o comportamento padrão do formulário
        console.log("formulario enviado")
        const role = document.querySelector('#editRole').value; // Seleciona o dropdown de roles
        const nome = document.querySelector('#editName').value;
        const email = document.querySelector('#editEmail').value;
  
        console.log(`Role selecionado: ${role}`);
  
        if (!userId) {
          alert('Por favor, selecione um usuário antes de atualizar o role.');
          return;
        }
  
        try {
          // Enviando a requisição PATCH para o servidor
          const response = await axios.patch(
            `http://localhost:3000/users/${userId}`,
            {
              nome,
              email,
              role
            }, // Dados a serem enviados
            {
              headers: {
                'Authorization': `Bearer ${token}` // Envia o token no cabeçalho
              }
            }
          );
  
          // Exibindo mensagem de sucesso
          alert('Sucesso!')
          window.location.href = 'usuarios.html';
        } catch (error) {
          console.error('Erro ao atualizar o role:', error);
          const errorMessage = error.response?.data?.message || 'Erro ao conectar com o servidor.';
  
          // Exibindo mensagem de erro
          if (responseMessage) {
            responseMessage.innerHTML = `
              <div class="alert alert-danger">Erro: ${errorMessage}</div>
            `;
          }
        }
      };

      window.deleteUser = async function (id) {
        const confirmar = document.getElementById("Confirmar"); // Corrige o ID como string
        console.log(id);
        
        confirmar.addEventListener("click", async () => { // Declara a callback como async
            try {
                const response = await axios.delete(`http://localhost:3000/users/${id}`,{
                headers: {
                  'Authorization': `Bearer ${token}` // Envia o token no cabeçalho
                }
              });
                console.log("Usuário deletado com sucesso:", response.data);
                window.location.href = 'usuarios.html';
            } catch (error) {
                console.error("Erro ao deletar usuário:", error);
            }
        });
    };

    // Função para buscar usuários do backend
    async function fetchUsuariosDesktop() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/users/', {
          headers: {
            'Authorization': `Bearer ${token}`, // Envia o token no cabeçalho
          },
        });
        const users = response.data;

        const container = document.querySelector('.container');
        const userslist = document.querySelector('#userTableBody');
        const userslistmobile = document.querySelector('.users-list');
  
        if (!container) {
          console.error('Elemento "container" não encontrado no DOM.');
          return;
        }

        userslist.style.display = 'table-row-group';
        container.style.display = 'block';
        userslistmobile.style.display = 'none';
        

        if (!userslist) {
          console.error('Elemento "userTableBody" não encontrado no DOM.');
          return;
        }


        userslist.innerHTML = ''; // Limpa a lista antes de renderizar os usuários
  
        users.forEach((user) => {
          const row = document.createElement('tr');
          const id = user.id;
          const nome = user.nome;
          const email = user.email;
          const role = user.role;
          let rolebonitinho = "Kappa"

          if (role === 'admin'){
            rolebonitinho = "Administrativo";
          }
          if (role === 'user'){
            rolebonitinho = "Usuário";
          }
  
          // Cria o HTML do item de usuário
          row.innerHTML = `
          <td>#${id.toString().padStart(3, '0')}</td>
          <td>${nome}</td>
          <td>${email}</td>
          <td><span class="role-badge ${getRoleBadgeClass(role)}">${rolebonitinho}</span></td>
          <td class="actions">
              <button class="edit-btn" onclick="setUserId(${id})">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                  Editar
              </button>
              <button id="deletao" class="delete-btn" onclick="deleteUser(${id})" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
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
        console.error('Erro ao buscar os usuários:', error);

        if (error.response && error.response.status === 403 || 401) {
          window.location.href = '403.html'; // Redireciona para a página de erro
        }
      }
    }

    async function fetchUsuariosMobile() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/users/', {
          headers: {
            'Authorization': `Bearer ${token}`, // Envia o token no cabeçalho
          },
        });
        const users = response.data;

        const userslist = document.querySelector('.users-list');
        const container = document.querySelector('.container');
        const userslistdesktop = document.querySelector('#userTableBody');
  
        if (!container) {
          console.error('Elemento "container" não encontrado no DOM.');
          return;
        }

        userslistdesktop.style.display = 'none';
        container.style.display = 'none';
        userslist.style.display = 'flex';

        if (!userslist) {
          console.error('Elemento "users-list" não encontrado no DOM.');
          return;
        }
  
        userslist.innerHTML = ''; // Limpa a lista antes de renderizar os usuários
  
        users.forEach((user) => {
          const item = document.createElement('div');
          item.classList.add('item');
          const id = user.id;
          const nome = user.nome;
          const email = user.email;
          const role = user.role;
  
          // Cria o HTML do item de usuário
          item.innerHTML = `
            <p class="IDrole">#${id}</p>
            <p class="name">${nome}</p>
            <p class="email">${email}</p>
            <p class="role">${role}</p>
            <div class="actions">
              <button type="button" class="btn btn-primary" onclick="setUserId(${id})" data-bs-toggle="modal" data-bs-target="#exampleModal">Editar</button>
              <button type="button" class="btn btn-primary" onclick="deleteUser(${id})" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Deletar</button>
            </div>
          `;
  
          userslist.appendChild(item); // Adiciona o item à lista
        });
      } catch (error) {
        console.error('Erro ao buscar os usuários:', error);

        if (error.response && error.response.status === 403 || 401) {
          window.location.href = '403.html'; // Redireciona para a página de erro
        }
      }
    }
  
    // Executa a busca de usuários ao carregar o DOM
    function handleFetchUsuarios() {
      const mediaQuery = window.matchMedia('(max-width: 480px)'); // Define o breakpoint para telas mobile
    
      if (mediaQuery.matches) {
        // Se for uma tela mobile, use a função específica
        fetchUsuariosMobile();
      } else {
        // Caso contrário, use a função para desktop
        fetchUsuariosDesktop();
      }
    }
    
    // Adiciona um listener para reagir a mudanças no tamanho da tela
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    mediaQuery.addEventListener('change', handleFetchUsuarios);

    const closeedituser = document.querySelector('.close');

    closeedituser.addEventListener('click', () => {
      const editModal = document.querySelector('#editModal');
      editModal.style.display = 'none';
      handleFetchUsuarios();
  });
    
    // Executa a função ao carregar a página para verificar o estado atual
    handleFetchUsuarios();
  });
  