const CLIENT_ID = '921366091275-m476i96govuv9ksaqnr44b6i393bjove.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCKzDUOinstTX4L_tHBaI9jOk0Q8e7c5MM';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';
const spreadsheetId = '1VkqAFmpUOeljbin0DEKOrD5RJG8A91MEj77eSx92eHg';

let isAuthorized = false;

function initClient() {
  gapi.client
    .init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      scope: SCOPES,
    })
    .then(() => {
      const authInstance = gapi.auth2.getAuthInstance();
      authInstance.isSignedIn.listen(updateSignInStatus);
      updateSignInStatus(authInstance.isSignedIn.get());
    })
    .catch((error) => console.error('Erro ao inicializar API', error));
}

function updateSignInStatus(isSignedIn) {
  if (isSignedIn) {
    isAuthorized = true;
  } else {
    isAuthorized = false;
    gapi.auth2.getAuthInstance().signIn();
  }
}

function appendDataToSheet(product, quantity) {
  if (!isAuthorized) {
    alert('Por favor, autentique-se primeiro.');
    return;
  }

  const values = [[product, quantity]];
  const body = { values };

  gapi.client.sheets.spreadsheets.values
    .append({
      spreadsheetId,
      range: 'A:B',
      valueInputOption: 'RAW',
      resource: body,
    })
    .then(() => {
      alert('Registro salvo com sucesso!');
      displayRecords(product, quantity);
    })
    .catch((error) => console.error('Erro ao salvar registro', error));
}

function displayRecords(product, quantity) {
  const tableBody = document.getElementById('recordTable');
  const row = tableBody.insertRow();
  row.insertCell(0).textContent = product;
  row.insertCell(1).textContent = quantity;
}

document.getElementById('saveButton').addEventListener('click', () => {
  const product = document.getElementById('product').value.trim();
  const quantity = document.getElementById('quantity').value.trim();

  if (!product || !quantity) {
    alert('Por favor, preencha todos os campos.');
    return;
  }

  appendDataToSheet(product, quantity);

  document.getElementById('product').value = '';
  document.getElementById('quantity').value = '';
});

gapi.load('client:auth2', initClient);
