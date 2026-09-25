// ============================================================
// INFODICAS — Lógica de navegação
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

    const pages = document.querySelectorAll('.page');
    const navLinks = document.querySelectorAll('[data-page]');
    const btnVoltar = document.getElementById('btn-voltar');
    const background = document.getElementById('background');

    // Mapeamento das imagens de fundo por página (na ordem)
    const imagensFundo = [
        'images/monge_codigo_001.jpg',
        'images/monge_codigo_002.jpg',
        'images/monge_codigo_003.jpg',
        'images/codigo_001.jpg',
        'images/gato_codigo_001.jpg',
        'images/Rachel_001.jpg'
    ];

    let currentPageIndex = 0;
    let timeout;

    // Carrega a imagem de fundo da página
    function loadBackground(index) {
        if (!background) return;

        const imagem = imagensFundo[index] || imagensFundo[0];
        const img = new Image();

        img.onload = () => {
            background.style.opacity = '0';
            setTimeout(() => {
                background.style.backgroundImage = `url('${imagem}')`;
                background.style.opacity = '0.35';
            }, 200);
        };

        img.onerror = () => {
            console.warn(`Imagem não encontrada: ${imagem}`);
            background.style.backgroundImage = 'none';
        };

        img.src = imagem;
    }

    // Mostra a página pelo índice
    function showPage(index) {
        if (index < 0 || index >= pages.length) return;

        pages.forEach((page, i) => {
            page.classList.toggle('active', i === index);
        });

        if (btnVoltar) {
            btnVoltar.style.display = index === 0 ? 'none' : 'inline-flex';
        }

        currentPageIndex = index;
        history.replaceState(null, '', '#' + pages[index].id);
        pages[index].scrollTop = 0;

        loadBackground(index);
    }

    // Navegação por clique em qualquer elemento com data-page
    navLinks.forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            const target = parseInt(el.dataset.page, 10);
            if (!isNaN(target)) showPage(target);
        });
    });

    // Botão "Voltar"
    if (btnVoltar) {
        btnVoltar.addEventListener('click', () => {
            showPage(0);
        });
    }

    // Scroll do mouse (debounce)
    window.addEventListener('wheel', (e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            const currentPage = pages[currentPageIndex];
            if (!currentPage) return;

            const isScrollingDown = e.deltaY > 0;
            const isAtTop = currentPage.scrollTop === 0;
            const isAtBottom = currentPage.scrollTop + currentPage.clientHeight >= currentPage.scrollHeight - 3;

            if (isScrollingDown && isAtBottom && currentPageIndex < pages.length - 1) {
                showPage(currentPageIndex + 1);
            } else if (!isScrollingDown && isAtTop && currentPageIndex > 0) {
                showPage(currentPageIndex - 1);
            }
        }, 80);
    }, { passive: true });

    // Swipe (touch)
    let startY = 0;
    window.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
        const endY = e.changedTouches[0].clientY;
        const deltaY = startY - endY;

        if (Math.abs(deltaY) < 90) return;

        const currentPage = pages[currentPageIndex];
        if (!currentPage) return;

        const isAtTop = currentPage.scrollTop === 0;
        const isAtBottom = currentPage.scrollTop + currentPage.clientHeight >= currentPage.scrollHeight - 3;

        if (deltaY > 0 && isAtBottom && currentPageIndex < pages.length - 1) {
            showPage(currentPageIndex + 1);
        } else if (deltaY < 0 && isAtTop && currentPageIndex > 0) {
            showPage(currentPageIndex - 1);
        }
    }, { passive: true });

    // Suporte a #hash
    const hash = window.location.hash.substring(1);
    if (hash) {
        const index = Array.from(pages).findIndex(p => p.id === hash);
        if (index !== -1) {
            showPage(index);
            return;
        }
    }

    showPage(0);
});