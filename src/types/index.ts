// Core type definitions for the Daycare Invoice Management System

export type BillingType = 'subsidy' | 'hourly' | 'flat';

export interface LineItem {
  id: string;
  title: string;
  type: BillingType;
  // Subsidy/Grant Based fields
  fullRate?: number;
  subsidy?: number;
  // Hourly Rate fields
  hours?: number;
  ratePerHour?: number;
  // Flat Fee field
  amount?: number;
}

export interface Client {
  id: string;
  name: string;
  address: string;
}

export interface CompanyProfile {
  name: string;
  address: string;
  logoUrl?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  fileNumber: string;
  clientId: string;
  date: string;
  dueDate: string;
  lineItems: LineItem[];
  total: number;
}

export interface AppState {
  clients: Client[];
  invoices: Invoice[];
  companyProfile: CompanyProfile | null;
}
