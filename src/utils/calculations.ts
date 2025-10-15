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
export const generateId = (prefix: string): string => {
  return `${prefix}_${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
};
