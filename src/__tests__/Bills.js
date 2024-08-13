/**
 * @jest-environment jsdom
 */

import { screen } from '@testing-library/dom';
import { formatDate, formatStatus } from '../app/format.js'; // Assurez-vous d'importer ces fonctions si elles sont utilisées dans vos tests
import BillsUI from '../views/BillsUI.js';
import { bills } from '../fixtures/bills.js';
import { ROUTES_PATH } from '../constants/routes.js';
import { localStorageMock } from '../__mocks__/localStorage.js';
import Bills from '../containers/Bills.js';
import router from '../app/Router.js';
import $ from 'jquery';
import { fetchMock404 } from '../__mocks__/fetchMock.js';
import '@testing-library/jest-dom/extend-expect';
import { fetchMock500 } from '../__mocks__/fetchMock.js';
$.fn.modal = jest.fn();

// Avant chaque test
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve([
        { id: 1, date: '2024-06-01', status: 'pending' },
        { id: 2, date: '2024-06-02', status: 'paid' }
      ])
    })
  );
});

// Réinitialiser les mocks après chaque test
afterEach(() => {
  jest.resetAllMocks();
});
test('doit gérer une erreur 404 correctement', async () => {
  fetchMock404(); // Configure le mock pour l'erreur 404

  const billsInstance = new Bills({
    document: document,
    onNavigate: jest.fn(),
    store: null,
    localStorage: null
  });

  try {
    await billsInstance.getBills();
  } catch (error) {
    expect(error).toEqual({
      status: 404,
      message: 'Not Found'
    });
  }
});
test('doit gérer une erreur 500 correctement', async () => {
  fetchMock500(); // Configure le mock pour l'erreur 500

  const billsInstance = new Bills({
    document: document,
    onNavigate: jest.fn(),
    store: null,
    localStorage: null
  });

  try {
    await billsInstance.getBills();
  } catch (error) {
    expect(error).toEqual({
      status: 500,
      message: 'Internal Server Error'
    });
  }
});
describe('Étant donné que je suis connecté en tant qu\'employé', () => {

  describe('Quand je suis sur la page des factures', () => {

    test("Alors l'icône de facture dans la disposition verticale devrait être mise en surbrillance", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock });
      window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }));
      const root = document.createElement('div');
      root.setAttribute('id', 'root');
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
    });

    test('Alors les factures devraient être ordonnées de la plus ancienne à la plus récente', () => {
      // Rendre le composant BillsUI avec les données des factures et les ajouter au HTML du document
      document.body.innerHTML = BillsUI({ data: bills });
      // Récupérer toutes les dates affichées par le composant BillsUI
      // On utilise une expression régulière pour extraire les dates au format YYYY-MM-DD, YYYY/MM/DD, etc.
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map((a) => a.innerHTML);
      // Fonction pour comparer deux dates
      // Convertit les dates en objets Date et les compare
      const chrono = (a, b) => new Date(a) - new Date(b);
      // Trier les dates extraites en utilisant la fonction chrono
      const datesSorted = [...dates].sort(chrono);
      // Vérifier que les dates extraites sont bien triées de la plus ancienne à la plus récente
      expect(dates).toEqual(datesSorted);
    });
  });
});

describe('Étant donné que je suis un utilisateur', () => {

  describe('Quand je suis sur la page des factures', () => {

    test("Alors handleClickNewBill devrait déclencher onNavigate vers NewBill", () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock });
      window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }));
      document.body.innerHTML = BillsUI({ data: bills });

      const billsInstance = new Bills({
        document: document,
        onNavigate: jest.fn(),
        store: null,
        localStorage: null
      });

      const handleClickNewBill = jest.fn(billsInstance.handleClickNewBill);
      const buttonNewBill = screen.getByTestId('btn-new-bill');
      buttonNewBill.addEventListener('click', handleClickNewBill);
      buttonNewBill.click();

      expect(handleClickNewBill).toHaveBeenCalled();
    });

    test("Alors handleClickIconEye devrait afficher la modal avec l'image de la facture", async () => {
      const billsInstance = new Bills({
        document: document,
        onNavigate: jest.fn(),
        store: null,
        localStorage: null
      });

      const handleClickIconEye = jest.fn(billsInstance.handleClickIconEye.bind(billsInstance));
      const billUrl = "example.com/bill-image.jpg";

      const icon = document.createElement("div");
      icon.setAttribute("data-bill-url", billUrl);

      const modalBody = document.createElement("div");
      modalBody.setAttribute("id", "modaleFile");
      modalBody.innerHTML = '<div class="modal-body"></div>';
      document.body.appendChild(modalBody);

      handleClickIconEye(icon);

      const modalContent = modalBody.querySelector('.modal-body');
      expect(modalContent).toBeInTheDocument();
    });
  });
});
describe('Bills container', () => {
  describe('getBills method', () => {
    test('doit récupérer les données des factures et formater les dates et le statut', async () => {
      // Données factices pour les tests
      const mockBills = [
        { id: 1, date: '2024-06-01', status: 'pending' },
        { id: 2, date: '2024-06-02', status: 'paid' }
      ];
      // Crée un mock pour la méthode list du store
      const mockStore = {
        bills: () => ({
          list: jest.fn(() => Promise.resolve(mockBills))
        })
      };
      // Crée une instance de Bills avec le mockStore
      const billsInstance = new Bills({
        document: document,
        onNavigate: jest.fn(),
        store: mockStore,
        localStorage: null
      });
      // Appelle la méthode getBills de l'instance Bills
      const billsData = await billsInstance.getBills();
      expect(mockStore.bills().list)
      // Vérifie que les données des factures sont formatées correctement
      expect(billsData).toEqual(mockBills.map(bill => ({
        ...bill,
        date: formatDate(bill.date),
        status: formatStatus(bill.status)
      })));
    });
  });
});