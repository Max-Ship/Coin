export default function startCustomSortSelected() {
    const customSelect = document.getElementById('custom-select');
    const selected = document.getElementById('selected');
    const optionsContainer = document.getElementById('options');
    const options = customSelect.querySelectorAll('.option');
    options.forEach(option => { option.children[0].style.display = 'none' });

    selected.addEventListener('click', () => {
        const isOpen = optionsContainer.style.display === 'block';
        optionsContainer.style.display = isOpen ? 'none' : 'block';
        customSelect.classList.toggle('open', !isOpen);
    });

    options.forEach(option => {
        option.addEventListener('click', () => {
            options.forEach(option => { option.children[0].style.display = 'none' });
            selected.textContent = option.textContent;
            option.children[0].style.display = 'block';
            optionsContainer.style.display = 'none';
            customSelect.classList.remove('open');
        });
    });

    document.addEventListener('click', (e) => {
        if (!customSelect.contains(e.target)) {
            optionsContainer.style.display = 'none';
            customSelect.classList.remove('open');
        }
    });
}