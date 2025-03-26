
// Obtém todos os links do menu lateral
const menuLinks = document.querySelectorAll('#menu a');

// Função para adicionar a classe 'active' ao link correto
function setActiveLink() {
    const currentPath = window.location.pathname;  // Obtém o caminho da URL atual

    menuLinks.forEach(link => {
        // Verifica se o 'href' do link corresponde ao caminho atual
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');  // Adiciona a classe 'active' ao link correspondente
        } else {
            link.classList.remove('active');  // Remove a classe 'active' dos outros links
        }
    });
}

// Aplica a função quando a página carrega
window.addEventListener('load', setActiveLink);

// Aplica a função se a navegação for do tipo SPA (Single Page Application)
window.addEventListener('popstate', setActiveLink);

