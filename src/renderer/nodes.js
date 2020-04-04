'use strict';

// Get the modal
const addNodesModal = document.getElementById("add-nodes-modal");
const removeNodesModal = document.getElementById("remove-nodes-modal");

// Add Modal
document.getElementById("add-nodes-modal-button").onclick = function() {
  document.getElementById("nodeUpdateId").value = '';
  addNodesModal.getElementsByTagName('h2')[0].innerHTML = 'Add Node';
  addNodesModal.style.display = "block";
}

// Edit Modal
function editNodesModalOpen(event) {
  document.getElementById("name").value = event.target.parentElement.dataset.name;
  document.getElementById("type").value = event.target.parentElement.dataset.type;
  document.getElementById("nodeUpdateId").value = event.target.parentElement.dataset.id;
  addNodesModal.getElementsByTagName('h2')[0].innerHTML = 'Edit Node';
  addNodesModal.style.display = "block";
}

// When the user clicks anywhere outside of the modal, close it
window.addEventListener('click', function(event) {
  if (event.target == addNodesModal) {
    editNodesModalClose();
  }
  if (event.target == removeNodesModal) {
    removeNodesModalClose();
  }
});

function editNodesModalClose() {
  document.getElementById("name").value = '';
  document.getElementById("type").value = '';
  document.getElementById("nodeUpdateId").value = '';
  addNodesModal.style.display = "none";
}

// Remove Node
function removeNodesModalOpen(event) {
  removeNodesModal.getElementsByClassName('removeName')[0].innerHTML = event.target.parentElement.dataset.name;
  removeNodesModal.getElementsByClassName('removeName')[0].dataset.id = event.target.parentElement.dataset.id;
  removeNodesModal.style.display = "block";
}
/** 
 * Delete Node Handler
 */
function deleteNode() {
  const id = removeNodesModal.getElementsByClassName('removeName')[0].dataset.id;
  if (id) {
    ipcRenderer.send('remove-node', id);
  }
}
function removeNodesModalClose(event) {
  removeNodesModal.getElementsByClassName('removeName')[0].innerHTML = '';
  removeNodesModal.getElementsByClassName('removeName')[0].dataset.id = null;
  removeNodesModal.style.display = "none";
}

/**
 * Receive Nodes
 */
ipcRenderer.on('nodes', (event, nodes) => {
  console.log('renderer - nodes');
  mbNodes = nodes;
  
  // get the nodesList ul
  const nodesList = document.getElementById('nodeList')

  // create html string
  const nodeItems = nodes.reduce((html, node) => {
    html += `<li class="node-item" data-id="${node.id}" data-name="${node.name}" data-type="${node.type}">
      ${JSON.stringify(node)}
      <button type="button" onclick="editNodesModalOpen(event)">Edit</button>
      <button type="button" onclick="removeNodesModalOpen(event)">Delete</button>
    </li>`;

    return html;
  }, '');

  // set list html to the node items
  nodesList.innerHTML = nodeItems;

  // reset modals
  editNodesModalClose();
  removeNodesModalClose();
});

/**
 * Add Node Handler
 */
document.getElementById('add_node').addEventListener('submit', (evt) => {
  // prevent default refresh functionality of forms
  evt.preventDefault()
console.log('renderer - adding node')
  // input on the form
  const payload = {
    name: evt.target[0].value,
    type: evt.target[1].value,
  };

  // send todo to main process
  ipcRenderer.send('add-node', payload);

  // reset input
  evt.target[0].value = '';
});
