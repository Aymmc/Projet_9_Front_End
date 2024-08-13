import Bills from '../containers/Bills.js';
import { jest } from '@jest/globals';

export const createBillsInstance = () => {
  return new Bills({
    document: document,
    onNavigate: jest.fn(),
    store: null,
    localStorage: null
  });
};
