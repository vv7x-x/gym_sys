export function createPagination(currentPage, totalPages, onPageChange) {
    const container = document.createElement('div');
    container.className = 'pagination';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'pagination-btn';
    prevBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    prevBtn.disabled = currentPage <= 1;
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
    });
    container.appendChild(prevBtn);

    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
    }

    if (start > 1) {
        const firstBtn = createPageBtn(1, currentPage === 1, onPageChange);
        container.appendChild(firstBtn);
        if (start > 2) {
            const dots = document.createElement('span');
            dots.className = 'pagination-info';
            dots.textContent = '...';
            container.appendChild(dots);
        }
    }

    for (let i = start; i <= end; i++) {
        const btn = createPageBtn(i, i === currentPage, onPageChange);
        container.appendChild(btn);
    }

    if (end < totalPages) {
        if (end < totalPages - 1) {
            const dots = document.createElement('span');
            dots.className = 'pagination-info';
            dots.textContent = '...';
            container.appendChild(dots);
        }
        const lastBtn = createPageBtn(totalPages, currentPage === totalPages, onPageChange);
        container.appendChild(lastBtn);
    }

    const nextBtn = document.createElement('button');
    nextBtn.className = 'pagination-btn';
    nextBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    nextBtn.disabled = currentPage >= totalPages;
    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1);
    });
    container.appendChild(nextBtn);

    return container;
}

function createPageBtn(pageNum, isActive, onPageChange) {
    const btn = document.createElement('button');
    btn.className = `pagination-btn${isActive ? ' active' : ''}`;
    btn.textContent = pageNum;
    if (!isActive) {
        btn.addEventListener('click', () => onPageChange(pageNum));
    }
    return btn;
}

export function paginateData(data, page, pageSize = 10) {
    const totalPages = Math.ceil(data.length / pageSize);
    const start = (page - 1) * pageSize;
    const items = data.slice(start, start + pageSize);
    return { items, totalPages, currentPage: page, total: data.length };
}
