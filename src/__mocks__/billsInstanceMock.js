import Bills from '../containers/Bills.js'; // Assurez-vous que le chemin est correct

// Fonction pour créer une instance de Bills avec des paramètres de mock
export const createBillsInstance = (store = null, localStorage = null) => new Bills({
  document: document,
  onNavigate: jest.fn(),
  store: store,
  localStorage: localStorage
});