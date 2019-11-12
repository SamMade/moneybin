'use strict';

// Get the modal
const addTransactionsModal = document.getElementById("add-transactions-modal");
const removeTransactionsModal = document.getElementById("remove-transactions-modal");

// Add Modal
document.getElementById("add-transactions-modal-button").onclick = function() {
  document.getElementById("transactionUpdateId").value = '';
  addTransactionsModal.getElementsByTagName('h2')[0].innerHTML = 'Add Transaction';
  addTransactionsModal.style.display = "block";
}

// Edit Modal
function editNodesModalOpen(event) {
  document.getElementById("name").value = event.target.parentElement.dataset.name;
  document.getElementById("type").value = event.target.parentElement.dataset.type;
  document.getElementById("transactionUpdateId").value = event.target.parentElement.dataset.id;
  addTransactionsModal.getElementsByTagName('h2')[0].innerHTML = 'Edit Transaction';
  addTransactionsModal.style.display = "block";
}

// When the user clicks anywhere outside of the modal, close it
window.addEventListener('click', function(event) {
  if (event.target == addTransactionsModal) {
    editTransactionsModalClose();
  }
  if (event.target == removeTransactionsModal) {
    removeTransactionsModalClose();
  }
});

function editTransactionsModalClose() {
  addTransactionsModal.style.display = "none";
}


// Remove Transaction
function removeTransactionsModalOpen(event) {
  removeTransactionsModal.getElementsByClassName('removeName')[0].innerHTML = event.target.parentElement.dataset.postDate;
  removeTransactionsModal.getElementsByClassName('removeName')[0].dataset.id = event.target.parentElement.dataset.id;
  removeTransactionsModal.style.display = "block";
}
/** 
 * Delete Transaction Handler
 */
function deleteTransaction() {
  const id = removeTransactionsModal.getElementsByClassName('removeName')[0].dataset.id;
  if (id) {
    ipcRenderer.send('remove-transaction', id);
  }
}
function removeTransactionsModalClose(event) {
  removeTransactionsModal.getElementsByClassName('removeName')[0].innerHTML = '';
  removeTransactionsModal.getElementsByClassName('removeName')[0].dataset.id = null;
  removeTransactionsModal.style.display = "none";
}

/**
 * Receive Transactions
 */
ipcRenderer.on('transactions', (event, transactions) => {
  console.log('renderer - transactions');
  mbTransactions = transactions;

  // get the transactionList ul
  const transactionList = document.getElementById('transactionList')

  // create html string
  const transactionItems = transactions.reduce((html, transaction) => {
    html += `<li class="transaction-item" data-id="${transaction.id}" data-post-date="${transaction.postDate}" data-from="${transaction.from}" data-to="${transaction.to}">
      ${JSON.stringify(transaction)}
      <button type="button" onclick="editTransactionsModalOpen(event)">Edit</button>
      <button type="button" onclick="removeTransactionsModalOpen(event)">Delete</button>
    </li>`;

    return html;
  }, '');

  // set list html to the todo items
  transactionList.innerHTML = transactionItems;

  // reset modals
  editTransactionsModalClose();
  removeTransactionsModalClose();
})

/**
 * Add Transaction Handler
 */
document.getElementById('add_transaction').addEventListener('submit', (evt) => {
  // prevent default refresh functionality of forms
  evt.preventDefault()

  // input on the form
  const payload = {
    date: evt.target[0].value,
    from: evt.target[2].value,
    to: evt.target[4].value,
    amount: evt.target[5].value,
  };

  // send todo to main process
  ipcRenderer.send('add-transaction', payload);

  closeTransactionsModal();

  // reset input
  evt.target[0].value = '';
  evt.target[1].value = '';
  evt.target[2].value = '';
  evt.target[3].value = '';
  evt.target[4].value = '';
  evt.target[5].value = '';
})
