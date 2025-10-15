import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Client, Invoice, CompanyProfile } from '../types';

interface AppStore {
  // State
  clients: Client[];
  invoices: Invoice[];
  companyProfile: CompanyProfile | null;

  // Client actions
  addClient: (client: Client) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  getClientById: (id: string) => Client | undefined;

  // Invoice actions
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  getInvoiceById: (id: string) => Invoice | undefined;

  // Company profile actions
  setCompanyProfile: (profile: CompanyProfile) => void;
}

export const useStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial state
      clients: [],
      invoices: [],
      companyProfile: null,

      // Client actions
      addClient: (client) =>
        set((state) => ({
          clients: [...state.clients, client],
        })),

      updateClient: (id, updatedClient) =>
        set((state) => ({
          clients: state.clients.map((client) =>
            client.id === id ? { ...client, ...updatedClient } : client
          ),
        })),

      deleteClient: (id) =>
        set((state) => ({
          clients: state.clients.filter((client) => client.id !== id),
        })),

      getClientById: (id) => {
        return get().clients.find((client) => client.id === id);
      },

      // Invoice actions
      addInvoice: (invoice) =>
        set((state) => ({
          invoices: [...state.invoices, invoice],
        })),

      updateInvoice: (id, updatedInvoice) =>
        set((state) => ({
          invoices: state.invoices.map((invoice) =>
            invoice.id === id ? { ...invoice, ...updatedInvoice } : invoice
          ),
        })),

      deleteInvoice: (id) =>
        set((state) => ({
          invoices: state.invoices.filter((invoice) => invoice.id !== id),
        })),

      getInvoiceById: (id) => {
        return get().invoices.find((invoice) => invoice.id === id);
      },

      // Company profile actions
      setCompanyProfile: (profile) =>
        set({
          companyProfile: profile,
        }),
    }),
    {
      name: 'daycare-invoice-storage',
    }
  )
);
