document.addEventListener('DOMContentLoaded', () => {
    const itemForm = document.getElementById('itemForm');
    const itemNameInput = document.getElementById('itemName');
    const itemDescriptionInput = document.getElementById('itemDescription');
    const itemQuantityInput = document.getElementById('itemQuantity');
    const itemValueInput = document.getElementById('itemValue');
    const itemCurrencySelect = document.getElementById('itemCurrency');
    const conversionCurrencySelect = document.getElementById('conversionCurrency');
    const itemList = document.getElementById('itemList');
    const itemIdInput = document.getElementById('itemId');
    const saveButton = document.getElementById('saveButton');
    const cancelButton = document.getElementById('cancelButton');

    const API_URL = 'https://api.exchangerate-api.com/v4/latest/';

    // Load items from Local Storage
    const loadItems = () => {
        const items = JSON.parse(localStorage.getItem('items')) || [];
        itemList.innerHTML = '';
        items.forEach((item, index) => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item d-flex justify-content-between align-items-center container';
            listItem.innerHTML = `
                <div class='row'>
                    <h5>${item.name}</h5>
                    <p>${item.description}</p>
                    <p>Quantidade: ${item.quantity}</p>
                    <p>Valor: ${item.value} ${item.currency}</p>
                    <p>Valor Convertido: ${item.convertedValue} ${item.conversionCurrency} (${item.rateValue})</p>
                </div>
            `;

            const buttonGroup = document.createElement('div');
            buttonGroup.className = 'row';

            const editButton = document.createElement('button');
            editButton.className = 'btn btn-info btn-sm me-2';
            editButton.textContent = 'Editar';
            editButton.onclick = () => {
                editItem(index);
            };

            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn btn-danger btn-sm';
            deleteButton.textContent = 'Deletar';
            deleteButton.onclick = () => {
                deleteItem(index);
            };

            buttonGroup.appendChild(editButton);
            buttonGroup.appendChild(deleteButton);
            listItem.appendChild(buttonGroup);
            itemList.appendChild(listItem);
        });
    };

    const saveItem = (item, index) => {
        const items = JSON.parse(localStorage.getItem('items')) || [];
        if (index !== null && index !== undefined) {
            items[index] = item;
        } else {
            items.push(item);
        }
        localStorage.setItem('items', JSON.stringify(items));
        loadItems();
    };

    const deleteItem = (index) => {
        const items = JSON.parse(localStorage.getItem('items')) || [];
        items.splice(index, 1);
        localStorage.setItem('items', JSON.stringify(items));
        loadItems();
    };

    const editItem = (index) => {
        const items = JSON.parse(localStorage.getItem('items')) || [];
        const item = items[index];
        itemNameInput.value = item.name;
        itemDescriptionInput.value = item.description;
        itemQuantityInput.value = item.quantity;
        itemValueInput.value = item.value;
        itemCurrencySelect.value = item.currency;
        conversionCurrencySelect.value = item.conversionCurrency;
        itemIdInput.value = index;
        saveButton.textContent = 'Atualizar Item';
        cancelButton.style.display = 'inline';
    };

    const resetForm = () => {
        itemNameInput.value = '';
        itemDescriptionInput.value = '';
        itemQuantityInput.value = '';
        itemValueInput.value = '';
        itemCurrencySelect.value = 'USD';
        conversionCurrencySelect.value = 'USD';
        itemIdInput.value = '';
        saveButton.textContent = 'Adicionar Item';
        cancelButton.style.display = 'none';
    };

    itemForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const itemName = itemNameInput.value;
        const itemDescription = itemDescriptionInput.value;
        const itemQuantity = itemQuantityInput.value;
        const itemValue = itemValueInput.value;
        const itemCurrency = itemCurrencySelect.value;
        const conversionCurrency = conversionCurrencySelect.value;
        const itemId = itemIdInput.value;

        // Fetch exchange rate
        try {
            const response = await fetch(`${API_URL}${itemCurrency}`);
            const data = await response.json();
            const rate = data.rates[conversionCurrency];

            const convertedValue = ((itemValue * itemQuantity) * rate).toFixed(2);

            const item = {
                name: itemName,
                description: itemDescription,
                quantity: itemQuantity,
                value: itemValue,
                currency: itemCurrency,
                conversionCurrency: conversionCurrency,
                convertedValue: convertedValue,
                rateValue: rate
            };
            saveItem(item, itemId ? parseInt(itemId) : null);
            resetForm();
        } catch (error) {
            console.error('Erro ao buscar taxa de câmbio', error);
        }
    });

    cancelButton.addEventListener('click', resetForm);

    loadItems();
});
