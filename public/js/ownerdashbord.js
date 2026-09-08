document.addEventListener('DOMContentLoaded', () => {
    const openBtn = document.getElementById('openDeleteModalBtn');
    const closeBtn = document.getElementById('closeDeleteModalBtn');
    const modal = document.getElementById('deleteModal');

    if (openBtn && modal) {
        openBtn.addEventListener('click', () => {
            modal.classList.remove('hidden');
        });
    }

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });
    }

    // Close modal when clicking outside the box
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    }
});