'use strict';

// Get the modal
var addNodesModal = document.getElementById("add-nodes-modal");

// When the user clicks on the button, open the modal
document.getElementById("add-nodes-modal-button").onclick = function() {
  addNodesModal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
// addNodesModal.getElementsByClassName("close")[0].onclick = function() {
//   addNodesModal.style.display = "none";
// }

// When the user clicks anywhere outside of the modal, close it
window.addEventListener('click', function(event) {
  if (event.target == addNodesModal) {
    addNodesModal.style.display = "none";
  }
});

/**
 * Receve Nodes
 */
ipcRenderer.on('nodes', (event, nodes) => {
  console.log('renderer - nodes');
  
  // get the nodesList ul
  const nodesList = document.getElementById('nodeList')

  // create html string
  const nodeItems = nodes.reduce((html, node) => {
    html += `<li class="node-item" data-id="${node.id}">${JSON.stringify(node)}</li>`

    return html
  }, '')

  // set list html to the node items
  nodesList.innerHTML = nodeItems

  // add click handlers to delete the clicked node
  nodeList.querySelectorAll('.node-item').forEach(item => {
    item.addEventListener('click', deleteNode)
  })
});

/**
 * Add Node Handler
 */
document.getElementById('add_node').addEventListener('submit', (evt) => {
  // prevent default refresh functionality of forms
  evt.preventDefault()

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

/** 
 * Delete Node Handler
 */
function deleteNode(evt) {
  const id = evt.target.dataset.id;
  ipcRenderer.send('remove-node', id);
}
