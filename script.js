// ============================================================
// INFODICAS — Navegação entre páginas
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

    const pages = document.querySelectorAll('.page');
    const navLinks = document.querySelectorAll('[data-page]');
    const btnVoltar = document.getElementById('btn-voltar');
    const background = document.getElementById('background');

    // Mapeamento: índice da página → imagem de fundo
    // Ordem: home, 10 Windows, 10 Excel
    const imagensFundo = [
        'images/monge_codigo_001.jpg',   // 0  home
        'images/zen_001.jpg',            // 1  reiniciar windows
        'images/samurai_001.jpg',        // 2  matar processo
        'images/codigo_001.jpg',         // 3  reset rede
        'images/monge_codigo_002.jpg',   // 4  sfc scannow
        'images/monge_codigo_003.jpg',   // 5  dism
        'images/gato_codigo_001.jpg',    // 6  saude disco
        'images/girl_001.jpg',           // 7  diskpart pendrive
        'images/Rachel_001.jpg',         // 8  relatorio energia
        'images/geisha_006.jpg',         // 9  gerenciar usuarios
        'images/geisha_001.jpg',         // 10 limpeza profunda
        'images/geisha_002.jpg',         // 11 ctrl E
        'images/geisha_003.jpg',         // 12 atalhos
        'images/geisha_004.jpg',         // 13 formatacao condicional
        'images/geisha_005.jpg',         // 14 tabelas dinamicas
        'images/geisha_007.jpg',         // 15 procs
        'images/geisha_008.jpg',         // 16 matrizes dinamicas
        'images/geisha_009.jpg',         // 17 power query
        'images/geisha_010.jpg',         // 18 indireto
        'images/geisha_011.jpg',         // 19 lambda
        'images/geisha_005.jpg'          // 20 macro limpeza (repetida)
    ];

    let currentPageIndex = 0;
    let timeout;

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

    navLinks.forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            const target = parseInt(el.dataset.page, 10);
            if (!isNaN(target)) showPage(target);
        });
    });

    if (btnVoltar) {
        btnVoltar.addEventListener('click', () => showPage(0));
    }

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