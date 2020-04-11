const { ipcRenderer } = window.require('electron');

export default async function getNameAutocomplete(match) {
  return await ipcRenderer.invoke('nodes-getName-autocomplete', match);
};
