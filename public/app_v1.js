document.addEventListener('DOMContentLoaded', () => {
    const itemForm = document.getElementById('itemForm');
    const itemNameInput = document.getElementById('itemName');
    const itemList = document.getElementById('itemList');

    const API_URL = 'https://api.exchangerate-api.com/v4/latest/USD';

    // Load items from Local Storage
    const loadItems = () => {
        const items = JSON.parse(localStorage.getItem('items')) || [];
        itemList.innerHTML = '';
        items.forEach((item, index) => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
            listItem.textContent = `${item.name} - Taxa de Câmbio: ${item.rate}`;

            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn btn-danger btn-sm';
            deleteButton.textContent = 'Deletar';
            deleteButton.onclick = () => {
                deleteItem(index);
            };

            listItem.appendChild(deleteButton);
            itemList.appendChild(listItem);
        });
    };

    const saveItem = (item) => {
        const items = JSON.parse(localStorage.getItem('items')) || [];
        items.push(item);
        localStorage.setItem('items', JSON.stringify(items));
        loadItems();
    };

    const deleteItem = (index) => {
        const items = JSON.parse(localStorage.getItem('items')) || [];
        items.splice(index, 1);
        localStorage.setItem('items', JSON.stringify(items));
        loadItems();
    };

    itemForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const itemName = itemNameInput.value;
        
        // Fetch exchange rate
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            const rate = data.rates.BRL; // exemplo: taxa de câmbio para BRL (real brasileiro)

            const item = { name: itemName, rate: rate };
            saveItem(item);
            itemNameInput.value = '';
        } catch (error) {
            console.error('Erro ao buscar taxa de câmbio', error);
        }
    });

    loadItems();
});

