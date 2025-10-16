import type { LineItem } from '../types';

/**
 * Calculate the total for a single line item based on its billing type
 */
export const calculateLineItemTotal = (item: LineItem): number => {
  switch (item.type) {
    case 'subsidy':
      return (item.fullRate || 0) - (item.subsidy || 0);
    case 'hourly':
      return (item.hours || 0) * (item.ratePerHour || 0);
    case 'flat':
      return item.amount || 0;
    default:
      return 0;
  }
};

/**
 * Calculate the grand total for all line items
 */
export const calculateInvoiceTotal = (lineItems: LineItem[]): number => {
  return lineItems.reduce((sum, item) => sum + calculateLineItemTotal(item), 0);
};

/**
 * Format a number as currency
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

/**
 * Generate a unique ID with a prefix
 */
export const generateId = (prefix: string = 'id'): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Generate the next invoice number based on existing invoices
 * Format: INV-YYYY-NNN (e.g., INV-2025-001, INV-2025-002)
 */
export const generateInvoiceNumber = (existingInvoices: { invoiceNumber: string }[]): string => {
  const currentYear = new Date().getFullYear();
  const yearPrefix = `INV-${currentYear}-`;
  
  // Filter invoices from current year
  const currentYearInvoices = existingInvoices.filter(inv => 
    inv.invoiceNumber.startsWith(yearPrefix)
  );
  
  if (currentYearInvoices.length === 0) {
    return `${yearPrefix}001`;
  }
  
  // Extract numbers and find the highest
  const numbers = currentYearInvoices.map(inv => {
    const match = inv.invoiceNumber.match(/INV-\d{4}-(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  });
  
  const maxNumber = Math.max(...numbers);
  const nextNumber = maxNumber + 1;
  
  // Pad with zeros to 3 digits
  return `${yearPrefix}${nextNumber.toString().padStart(3, '0')}`;
};
