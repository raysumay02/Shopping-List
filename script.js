const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

function displayItems(){

    let itemsFromStorage = getItemFromStorage();

    itemsFromStorage.forEach((item) => addItemtoDOM(item));
    checkUI();
}

function OnAddItemSubmit(e){

    e.preventDefault();

    const newItem = itemInput.value;
    // Validate Input
    if(newItem === ''){
        alert('Please enter a value');
        return;
    }
    // check for edit mode
    if(isEditMode){
        const itemToEdit = itemList.querySelector('.edit-mode');

        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('ediit-mode');
        itemToEdit.remove();
        isEditMode = false;
    }else{
        if(checkIfItemExists(newItem)){
            alert('Item already exists');
            return;
        }
    }
    // Add DOM Elements
    addItemtoDOM(newItem);

    // Add to local storage
    addItemsToStorage(newItem);
    checkUI();

    itemInput.value = '';
}

function addItemtoDOM(item){
        // Create list item
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));

    const button = createButton('remove-item btn-link text-red');
    // console.log(button);
    li.appendChild(button);
    // Adding Li
    itemList.appendChild(li);
}

function addItemsToStorage(item){
    let itemsFromStorage = getItemFromStorage();

    if(localStorage.getItem('items') === null){
        itemsFromStorage = [];
    }else{
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }
    // Add items to array
    itemsFromStorage.push(item);

    // Convert to JSON and set to local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));

}

function getItemFromStorage(){
    let itemsFromStorage;
    if(localStorage.getItem('items') === null){
        itemsFromStorage = [];
    }else{
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }

    return itemsFromStorage;
}

function createButton(classes){

    const button = document.createElement('button');
    button.className = classes;
    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);
    return button;
}

function createIcon(classes){

    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}

function onClickItem(e){

    if(e.target.parentElement.classList.contains('remove-item')){
        removeItem(e.target.parentElement.parentElement);
    }
    else{
        setItemToEdit(e.target);
    }
}

function checkIfItemExists(item){
    const itemFromStorage = getItemFromStorage();
    return itemFromStorage.includes(item);
}

function setItemToEdit(item){
    isEditMode = true;

    itemList.querySelectorAll('li').forEach((i) => i.classList.remove('edit-mode'));
    item.classList.add('edit-mode');
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
    formBtn.style.backgroundColor = '#228B22';
    itemInput.value = item.textContent;
}

function removeItem(item){
        if(confirm('Are you sure ?')){
            // Remove from DOM
            item.remove();

            // Remove from Storage
            removeItemFromStorage(item.textContent);
            checkUI();
        }
}

function removeItemFromStorage(item){

    let itemFromStorage = getItemFromStorage();

    itemFromStorage = itemFromStorage.filter( (i) => i !== item);
    localStorage.setItem('items', JSON.stringify(itemFromStorage));
}

function removeAllItems(e){
    while(itemList.firstChild){
        itemList.removeChild(itemList.firstChild);
    }
    localStorage.removeItem('items');
    checkUI();
}

function filterItems(e){

    const items = document.querySelectorAll('li');
    const text = e.target.value.toLowerCase();

    items.forEach((item) => {
        const itemName = item.firstChild.textContent.toLowerCase();

        if(itemName.indexOf(text) != -1){
            console.log(true);
            item.style.display = 'flex';
        }else{
            console.log(false);
            item.style.display = 'none';
        }
    })
}

function checkUI(){
    const items = document.querySelectorAll('li');
    if(items.length === 0){
        clearBtn.style.display = 'none';
        itemFilter.style.display = 'none';
    }else{
        clearBtn.style.display = 'block';
        itemFilter.style.display = 'block';        
    }

    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = '#333';
    isEditMode = false;
}

function init(){
    itemForm.addEventListener('submit', OnAddItemSubmit);
    itemList.addEventListener('click', onClickItem);
    clearBtn.addEventListener('click', removeAllItems);
    itemFilter.addEventListener('input', filterItems);
    document.addEventListener('DOMContentLoaded', displayItems);

    checkUI();
}

init();

// localStorage.setItem('name', 'Brad');
// console.log(localStorage.getItem('name'));
// localStorage.clear()