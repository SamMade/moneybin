import appRuntime from '../../services/appRuntime';

export default async function getNameAutocomplete(match) {
  return appRuntime.invoke('nodes-getName-autocomplete', match);
};
