'use strict';

// Get the modal
var addTransactionsModal = document.getElementById("add-transactions-modal");

// When the user clicks on the button, open the modal
document.getElementById("add-transactions-modal-button").onclick = function() {
  addTransactionsModal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
// addTransactionsModal.getElementsByClassName("close")[0].onclick = function() {
//   addTransactionsModal.style.display = "none";
// }

// When the user clicks anywhere outside of the modal, close it
window.addEventListener('click', function(event) {
  if (event.target == addTransactionsModal) {
    closeTransactionsModal();
  }
});

function closeTransactionsModal() {
  addTransactionsModal.style.display = "none";
}

/**
 * Receive Transactions
 */
ipcRenderer.on('transactions', (event, transactions) => {
  console.log('renderer - transactions');
  
  // get the transactionList ul
  const transactionList = document.getElementById('transactionList')

  // create html string
  const transactionItems = transactions.reduce((html, transaction) => {
    html += `<li><button class="transaction-item" data-id="${transaction.id}">${JSON.stringify(transaction)}</button></li>`

    return html
  }, '')

  // set list html to the todo items
  transactionList.innerHTML = transactionItems

  // add click handlers to delete the clicked todo
  transactionList.querySelectorAll('.transaction-item').forEach(item => {
    item.addEventListener('click', deleteTransaction)
  })
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
    from: evt.target[1].value,
    to: evt.target[2].value,
    amount: evt.target[3].value,
  };

  // send todo to main process
  ipcRenderer.send('add-transaction', payload);

  closeTransactionsModal();

  // reset input
  evt.target[0].value = '';
  evt.target[1].value = '';
  evt.target[2].value = '';
  evt.target[3].value = '';
})

/**
 * Delete Transaction Handler
 * @param {*} evt 
 */
function deleteTransaction(evt) {
  const id = evt.target.dataset.id;
  ipcRenderer.send('remove-transaction', id);
}
