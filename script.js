const CLIENT_ID = '921366091275-m476i96govuv9ksaqnr44b6i393bjove.apps.googleusercontent.com'; // Seu Client ID
const API_KEY = 'AIzaSyCKzDUOinstTX4L_tHBaI9jOk0Q8e7c5MM'; // Sua API Key
const spreadsheetId = '1VkqAFmpUOeljbin0DEKOrD5RJG8A91MEj77eSx92eHg'; // Seu ID da planilha
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

let gapiInitialized = false;

// Inicializa a API Google
function initializeGapi() {
  gapi.load('client:auth2', async () => {
    try {
      await gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        scope: SCOPES,
      });
      gapiInitialized = true;
      updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    } catch (error) {
      console.error('Erro ao inicializar a API Google:', error);
    }
  });
}

// Atualiza o status de login
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    document.getElementById('authButton').style.display = 'none';
    document.getElementById('signOutButton').style.display = 'block';
    document.getElementById('statusMessage').textContent = 'Conectado ao Google';
  } else {
    document.getElementById('authButton').style.display = 'block';
    document.getElementById('signOutButton').style.display = 'none';
    document.getElementById('statusMessage').textContent = 'Não conectado ao Google';
  }
}

// Faz login
function handleAuthClick() {
  if (gapiInitialized) {
    gapi.auth2.getAuthInstance().signIn();
  }
}

// Faz logout
function handleSignOutClick() {
  if (gapiInitialized) {
    gapi.auth2.getAuthInstance().signOut();
  }
}

// Adiciona dados à planilha
async function appendDataToSheet(product, code, minimum, maximum, entry, output, total) {
  const range = 'A:G';
  const values = [[product, code, minimum, maximum, entry, output, total]];

  try {
    const response = await gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      resource: { values },
    });

    if (response.status === 200) {
      alert('Dados salvos com sucesso!');
    }
  } catch (error) {
    console.error('Erro ao salvar os dados:', error);
    alert('Erro ao salvar os dados. Verifique o console para mais informações.');
  }
}

// Converte e adiciona dados
function convertUnit() {
  const productInput = document.getElementById('productSearch');
  const minInput = document.getElementById('min');
  const maxInput = document.getElementById('max');
  const entryInput = document.getElementById('entry');
  const outputInput = document.getElementById('output');

  const product = productInput.value.trim();
  const code = product.split(' - ')[0].trim();
  const minimum = parseInt(minInput.value) || 0;
  const maximum = parseInt(maxInput.value) || 0;
  const entry = parseInt(entryInput.value) || 0;
  const output = parseInt(outputInput.value) || 0;
  const total = entry - output;

  if (!product) {
    alert('Preencha o nome do produto.');
    return;
  }

  appendDataToSheet(product, code, minimum, maximum, entry, output, total);

  // Limpar campos após salvar
  productInput.value = '';
  minInput.value = '';
  maxInput.value = '';
  entryInput.value = '';
  outputInput.value = '';
}

// Inicializa a API ao carregar
window.onload = initializeGapi;
