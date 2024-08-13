/**
 * @jest-environment jsdom
 */

import LoginUI from "../views/LoginUI";
import Login from "../containers/Login.js";
import { ROUTES } from "../constants/routes";
import { fireEvent, screen } from "@testing-library/dom";

describe("Étant donné que je suis un utilisateur sur la page de connexion", () => {

  // Lorsque je ne remplis pas les champs et que je clique sur le bouton de connexion employé
  describe("Lorsque je ne remplis pas les champs et que je clique sur le bouton de connexion employé", () => {
    test("Alors, la page de connexion doit être rendue", () => {
      document.body.innerHTML = LoginUI();

      // Sélectionner le formulaire de connexion employé
      const form = screen.getByTestId("form-employee");
      const handleSubmit = jest.fn((e) => e.preventDefault());
      form.addEventListener("submit", handleSubmit);

      // Soumettre le formulaire sans remplir les champs
      fireEvent.submit(form);

      // Vérifier que le formulaire est toujours affiché
      expect(screen.getByTestId("form-employee")).toBeTruthy();
    });
  });

  // Lorsque je remplis les champs avec un format incorrect et que je clique sur le bouton de connexion employé
  describe("Lorsque je remplis les champs avec un format incorrect et que je clique sur le bouton de connexion employé", () => {
    test("Alors, la page de connexion doit être rendue", () => {
      document.body.innerHTML = LoginUI();

      // Remplir les champs avec des valeurs incorrectes
      const inputEmailUser = screen.getByTestId("employee-email-input");
      fireEvent.change(inputEmailUser, { target: { value: "invalidemail" } });

      const inputPasswordUser = screen.getByTestId("employee-password-input");
      fireEvent.change(inputPasswordUser, { target: { value: "invalidpassword" } });

      const form = screen.getByTestId("form-employee");
      const handleSubmit = jest.fn((e) => e.preventDefault());
      form.addEventListener("submit", handleSubmit);

      // Soumettre le formulaire avec des valeurs incorrectes
      fireEvent.submit(form);

      // Vérifier que le formulaire est toujours affiché
      expect(screen.getByTestId("form-employee")).toBeTruthy();
    });
  });

  // Lorsque je remplis les champs avec un format correct et que je clique sur le bouton de connexion employé
  describe("Étant donné que je suis un utilisateur sur la page de connexion", () => {
    test("Lorsque je remplis les champs avec un format correct et que je clique sur le bouton de connexion employé", async () => {
      // Nettoyer et initialiser l'interface utilisateur de la connexion
      document.body.innerHTML = LoginUI();
    
      // Définir les données d'entrée pour l'utilisateur
      const inputData = {
        email: "employee@test.tld",
        password: "employee",
      };
    
      // Sélectionner et changer la valeur de l'input email
      const inputEmailUser = screen.getByTestId("employee-email-input");
      fireEvent.change(inputEmailUser, { target: { value: inputData.email } });
    
      // Sélectionner et changer la valeur de l'input password
      const inputPasswordUser = screen.getByTestId("employee-password-input");
      fireEvent.change(inputPasswordUser, { target: { value: inputData.password } });
    
      // Sélectionner le formulaire de l'employé
      const form = screen.getByTestId("form-employee");
    
      // Mock de localStorage
      const mockLocalStorage = {
        setItem: jest.fn(),
      };
      Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });
    
      // Mock du store avec la méthode de connexion
      const mockLogin = jest.fn().mockResolvedValue({});
      const mockStore = {
        login: mockLogin,
      };
    
      // Initialiser l'objet Login
      const login = new Login({
        document,
        localStorage: window.localStorage,
        onNavigate: jest.fn(),
        PREVIOUS_LOCATION: "",
        store: mockStore,
      });
    
      // Soumettre le formulaire
      fireEvent.submit(form);
    
      // Attendre un délai raisonnable pour que l'opération asynchrone se termine
      await new Promise(resolve => setTimeout(resolve, 500));
    
      // Vérifier que mockLogin a été appelé avec les bonnes valeurs
      expect(JSON.parse(mockLogin.mock.calls[0][0])).toEqual({
        email: "employee@test.tld",
        password: "employee",
      });
    
      // Vérifier que localStorage.setItem a été appelé correctement
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        "user",
        JSON.stringify({
          type: "Employee",
          email: inputData.email,
          password: inputData.password,
          status: "connected",
        })
      );
    });
  });
  
  // Lorsque je remplis les champs avec un format correct et que je clique sur le bouton de connexion administrateur
  describe("Étant donné que je suis un utilisateur sur la page de connexion", () => {
    test("Lorsque je remplis les champs avec un format correct et que je clique sur le bouton de connexion administrateur", async () => {
      // Nettoyer et initialiser l'interface utilisateur de la connexion
      document.body.innerHTML = LoginUI();
    
      // Définir les données d'entrée pour l'administrateur
      const inputData = {
        email: "admin@test.tld",
        password: "admin",
      };
    
      // Sélectionner et changer la valeur de l'input email admin
      const inputEmailAdmin = screen.getByTestId("admin-email-input");
      fireEvent.change(inputEmailAdmin, { target: { value: inputData.email } });
    
      // Sélectionner et changer la valeur de l'input password admin
      const inputPasswordAdmin = screen.getByTestId("admin-password-input");
      fireEvent.change(inputPasswordAdmin, { target: { value: inputData.password } });
    
      // Sélectionner le formulaire de l'admin
      const form = screen.getByTestId("form-admin");
    
      // Mock de localStorage
      const mockLocalStorage = {
        setItem: jest.fn(),
      };
      Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });
    
      // Mock du store avec la méthode de connexion
      const mockLogin = jest.fn().mockResolvedValue({});
      const mockStore = {
        login: mockLogin,
      };
    
      // Initialiser l'objet Login
      const login = new Login({
        document,
        localStorage: window.localStorage,
        onNavigate: jest.fn(),
        PREVIOUS_LOCATION: "",
        store: mockStore,
      });
    
      // Soumettre le formulaire
      fireEvent.submit(form);
    
      // Attendre un délai raisonnable pour que l'opération asynchrone se termine
      await new Promise(resolve => setTimeout(resolve, 500));
    
      // Vérifier que mockLogin a été appelé avec les bonnes valeurs
      expect(JSON.parse(mockLogin.mock.calls[0][0])).toEqual({
        email: "admin@test.tld",
        password: "admin",
      });
    
      // Vérifier que localStorage.setItem a été appelé correctement
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        "user",
        JSON.stringify({
          type: "Admin",
          email: inputData.email,
          password: inputData.password,
          status: "connected",
        })
      );
    });
  });
});
