/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import DashboardFormUI from "../views/DashboardFormUI.js"
import DashboardUI from "../views/DashboardUI.js"
import Dashboard, { filteredBills, cards } from "../containers/Dashboard.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import { localStorageMock } from "../__mocks__/localStorage.js"
import mockStore from "../__mocks__/store"
import { bills } from "../fixtures/bills"
import router from "../app/Router"

jest.mock("../app/store", () => mockStore)

describe('Étant donné que je suis connecté en tant qu\'Admin', () => {
  describe('Lorsque je suis sur la page Dashboard, qu\'il y a des factures, et qu\'il y en a une en attente', () => {
    test('Alors, filteredBills avec le statut "pending" doit retourner 1 facture', () => {
      const filtered_bills = filteredBills(bills, "pending")
      expect(filtered_bills.length).toBe(1)
    })
  })
  describe('Lorsque je suis sur la page Dashboard, qu\'il y a des factures, et qu\'il y en a une acceptée', () => {
    test('Alors, filteredBills avec le statut "accepted" doit retourner 1 facture', () => {
      const filtered_bills = filteredBills(bills, "accepted")
      expect(filtered_bills.length).toBe(1)
    })
  })
  describe('Lorsque je suis sur la page Dashboard, qu\'il y a des factures, et qu\'il y en a deux refusées', () => {
    test('Alors, filteredBills avec le statut "refused" doit retourner 2 factures', () => {
      const filtered_bills = filteredBills(bills, "refused")
      expect(filtered_bills.length).toBe(2)
    })
  })
  describe('Lorsque je suis sur la page Dashboard mais que le chargement est en cours', () => {
    test('Alors, la page de chargement doit être rendue', () => {
      document.body.innerHTML = DashboardUI({ loading: true })
      expect(screen.getAllByText('Loading...')).toBeTruthy()
    })
  })
  describe('Lorsque je suis sur la page Dashboard mais que le back-end envoie un message d\'erreur', () => {
    test('Alors, la page d\'erreur doit être rendue', () => {
      document.body.innerHTML = DashboardUI({ error: 'some error message' })
      expect(screen.getAllByText('Erreur')).toBeTruthy()
    })
  })

  describe('Lorsque je suis sur la page Dashboard et que je clique sur une flèche', () => {
    test('Alors, la liste des tickets doit se déplier et les cartes doivent apparaître', async () => {

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Admin'
      }))

      const dashboard = new Dashboard({
        document, onNavigate, store: null, bills: bills, localStorage: window.localStorage
      })
      document.body.innerHTML = DashboardUI({ data: { bills } })

      const handleShowTickets1 = jest.fn((e) => dashboard.handleShowTickets(e, bills, 1))
      const handleShowTickets2 = jest.fn((e) => dashboard.handleShowTickets(e, bills, 2))
      const handleShowTickets3 = jest.fn((e) => dashboard.handleShowTickets(e, bills, 3))

      const icon1 = screen.getByTestId('arrow-icon1')
      const icon2 = screen.getByTestId('arrow-icon2')
      const icon3 = screen.getByTestId('arrow-icon3')

      icon1.addEventListener('click', handleShowTickets1)
      userEvent.click(icon1)
      expect(handleShowTickets1).toHaveBeenCalled()
      await waitFor(() => screen.getByTestId(`open-bill47qAXb6fIm2zOKkLzMro`))
      expect(screen.getByTestId(`open-bill47qAXb6fIm2zOKkLzMro`)).toBeTruthy()
      icon2.addEventListener('click', handleShowTickets2)
      userEvent.click(icon2)
      expect(handleShowTickets2).toHaveBeenCalled()
      await waitFor(() => screen.getByTestId(`open-billUIUZtnPQvnbFnB0ozvJh`))
      expect(screen.getByTestId(`open-billUIUZtnPQvnbFnB0ozvJh`)).toBeTruthy()

      icon3.addEventListener('click', handleShowTickets3)
      userEvent.click(icon3)
      expect(handleShowTickets3).toHaveBeenCalled()
      await waitFor(() => screen.getByTestId(`open-billBeKy5Mo4jkmdfPGYpTxZ`))
      expect(screen.getByTestId(`open-billBeKy5Mo4jkmdfPGYpTxZ`)).toBeTruthy()
    })
  })

  describe('Lorsque je suis sur la page Dashboard et que je clique sur l\'icône de modification d\'une carte', () => {
    test('Alors, le formulaire de droite doit être rempli', () => {

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Admin'
      }))

      const dashboard = new Dashboard({
        document, onNavigate, store: null, bills: bills, localStorage: window.localStorage
      })
      document.body.innerHTML = DashboardUI({ data: { bills } })
      const handleShowTickets1 = jest.fn((e) => dashboard.handleShowTickets(e, bills, 1))
      const icon1 = screen.getByTestId('arrow-icon1')
      icon1.addEventListener('click', handleShowTickets1)
      userEvent.click(icon1)
      expect(handleShowTickets1).toHaveBeenCalled()
      expect(screen.getByTestId(`open-bill47qAXb6fIm2zOKkLzMro`)).toBeTruthy()
      const iconEdit = screen.getByTestId('open-bill47qAXb6fIm2zOKkLzMro')
      userEvent.click(iconEdit)
      expect(screen.getByTestId(`dashboard-form`)).toBeTruthy()
    })
  })

  describe('Lorsque je suis sur la page Dashboard et que je clique 2 fois sur l\'icône de modification d\'une carte', () => {
    test('Alors, l\'icône de facture grande devrait apparaître', () => {

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Admin'
      }))

      const dashboard = new Dashboard({
        document, onNavigate, store: null, bills: bills, localStorage: window.localStorage
      })
      document.body.innerHTML = DashboardUI({ data: { bills } })

      const handleShowTickets1 = jest.fn((e) => dashboard.handleShowTickets(e, bills, 1))
      const icon1 = screen.getByTestId('arrow-icon1')
      icon1.addEventListener('click', handleShowTickets1)
      userEvent.click(icon1)
      expect(handleShowTickets1).toHaveBeenCalled()
      expect(screen.getByTestId(`open-bill47qAXb6fIm2zOKkLzMro`)).toBeTruthy()
      const iconEdit = screen.getByTestId('open-bill47qAXb6fIm2zOKkLzMro')
      userEvent.click(iconEdit)
      userEvent.click(iconEdit)
      const bigBilledIcon = screen.queryByTestId("big-billed-icon")
      expect(bigBilledIcon).toBeTruthy()
    })
  })


  describe('Lorsque je suis sur la page Dashboard et qu\'il n\'y a pas de factures', () => {
    test('Alors, aucune carte ne devrait être affichée', () => {
      document.body.innerHTML = cards([])
      const iconEdit = screen.queryByTestId('open-bill47qAXb6fIm2zOKkLzMro')
      expect(iconEdit).toBeNull()
    })
  })
})

describe('Étant donné que je suis connecté en tant qu\'Admin et que je suis sur la page Dashboard, et que j\'ai cliqué sur une facture en attente', () => {
  describe('Lorsque je clique sur le bouton d\'acceptation', () => {
    test('Je devrais être renvoyé sur la page Dashboard avec l\'icône de facture grande à la place du formulaire', () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Admin'
      }))
      document.body.innerHTML = DashboardFormUI(bills[0])

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const store = null
      const dashboard = new Dashboard({
        document, onNavigate, store, bills, localStorage: window.localStorage
      })

      const acceptButton = screen.getByTestId("btn-accept-bill-d")
      const handleAcceptSubmit = jest.fn((e) => dashboard.handleAcceptSubmit(e, bills[0]))
      acceptButton.addEventListener("click", handleAcceptSubmit)
      fireEvent.click(acceptButton)
      expect(handleAcceptSubmit).toHaveBeenCalled()
      const bigBilledIcon = screen.queryByTestId("big-billed-icon")
      expect(bigBilledIcon).toBeTruthy()
    })
  })
  describe('Lorsque je clique sur le bouton de refus', () => {
    test('Je devrais être renvoyé sur la page Dashboard avec l\'icône de facture grande à la place du formulaire', () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Admin'
      }))
      document.body.innerHTML = DashboardFormUI(bills[0])

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const store = null
      const dashboard = new Dashboard({
        document, onNavigate, store, bills, localStorage: window.localStorage
      })
      const refuseButton = screen.getByTestId("btn-refuse-bill-d")
      const handleRefuseSubmit = jest.fn((e) => dashboard.handleRefuseSubmit(e, bills[0]))
      refuseButton.addEventListener("click", handleRefuseSubmit)
      fireEvent.click(refuseButton)
      expect(handleRefuseSubmit).toHaveBeenCalled()
      const bigBilledIcon = screen.queryByTestId("big-billed-icon")
      expect(bigBilledIcon).toBeTruthy()
    })
  })
})

describe('Étant donné que je suis connecté en tant qu\'Admin et que je suis sur la page Dashboard et que j\'ai cliqué sur une facture', () => {
  describe('Lorsque je clique sur l\'icône en forme d\'œil', () => {
    test('Un modal devrait s\'ouvrir', () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Admin'
      }))
      document.body.innerHTML = DashboardFormUI(bills[0])
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const store = null
      const dashboard = new Dashboard({
        document, onNavigate, store, bills, localStorage: window.localStorage
      })

      const handleClickIconEye = jest.fn(dashboard.handleClickIconEye)
      const eye = screen.getByTestId('icon-eye-d')
      eye.addEventListener('click', handleClickIconEye)
      userEvent.click(eye)
      expect(handleClickIconEye).toHaveBeenCalled()

      const modale = screen.getByTestId('modaleFileAdmin')
      expect(modale).toBeTruthy()
    })
  })
})

// Test d'intégration GET
describe("Étant donné que je suis un utilisateur connecté en tant qu'Admin", () => {
  describe("Lorsque je navigue vers la Dashboard", () => {
    test("Récupère les factures depuis l'API mock GET", async () => {
      localStorage.setItem("user", JSON.stringify({ type: "Admin", email: "a@a" }));
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Dashboard)
      await waitFor(() => screen.getByText("Validations"))
      const contentPending = await screen.getByText("En attente (1)")
      expect(contentPending).toBeTruthy()
      const contentRefused = await screen.getByText("Refusé (2)")
      expect(contentRefused).toBeTruthy()
      expect(screen.getByTestId("big-billed-icon")).toBeTruthy()
    })

    describe("Lorsque une erreur se produit sur l'API", () => {
      beforeEach(() => {
        jest.spyOn(mockStore, "bills")
        Object.defineProperty(
            window,
            'localStorage',
            { value: localStorageMock }
        )
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Admin',
          email: "a@a"
        }))
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.appendChild(root)
        router()
      })
      test("Récupère les factures depuis l'API et échoue avec un message d'erreur 404", async () => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error("Erreur 404"))
            }
          }
        })
        window.onNavigate(ROUTES_PATH.Dashboard)
        await new Promise(process.nextTick);
        const message = await screen.getByText(/Erreur 404/)
        expect(message).toBeTruthy()
      })

      test("Récupère les messages depuis l'API et échoue avec un message d'erreur 500", async () => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error("Erreur 500"))
            }
          }
        })
        window.onNavigate(ROUTES_PATH.Dashboard)
        await new Promise(process.nextTick);
        const message = await screen.getByText(/Erreur 500/)
        expect(message).toBeTruthy()
      })
    })
  })
})
