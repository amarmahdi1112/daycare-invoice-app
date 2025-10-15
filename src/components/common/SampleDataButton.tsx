import React from 'react';
import { Database } from 'lucide-react';
import type { Client, Invoice, CompanyProfile } from '../../types';
import { useStore } from '../../contexts/store';
import { useNotificationStore } from '../../contexts/notificationStore';
import { Button } from './Button';
import { generateId } from '../../utils/calculations';

export const SampleDataButton: React.FC = () => {
  const { clients, invoices, companyProfile, addClient, addInvoice, setCompanyProfile } = useStore();
  const { addNotification } = useNotificationStore();

  const loadSampleData = () => {
    if (clients.length > 0 || invoices.length > 0 || companyProfile) {
      if (!window.confirm('This will add sample data. Continue?')) {
        return;
      }
    }

    // Add sample company profile if not exists
    if (!companyProfile) {
      const sampleCompany: CompanyProfile = {
        name: 'Sunshine Daycare Center',
        address: '123 Main Street\nSpringfield, IL 62701\nPhone: (555) 123-4567',
      };
      setCompanyProfile(sampleCompany);
    }

    // Add sample clients
    const sampleClients: Client[] = [
      {
        id: generateId('client'),
        name: 'John Smith',
        address: '456 Oak Avenue\nSpringfield, IL 62702',
      },
      {
        id: generateId('client'),
        name: 'Sarah Johnson',
        address: '789 Elm Street\nSpringfield, IL 62703',
      },
      {
        id: generateId('client'),
        name: 'Michael Davis',
        address: '321 Pine Road\nSpringfield, IL 62704',
      },
    ];

    sampleClients.forEach((client) => {
      if (!clients.find((c) => c.name === client.name)) {
        addClient(client);
      }
    });

    // Add sample invoices
    const client1 = sampleClients[0];
    const client2 = sampleClients[1];

    const sampleInvoices: Invoice[] = [
      {
        id: generateId('inv'),
        invoiceNumber: 'INV-2025-001',
        fileNumber: '1001',
        clientId: client1.id,
        date: '2025-01-15',
        dueDate: '2025-01-30',
        lineItems: [
          {
            id: generateId('item'),
            title: 'Weekly Childcare - Emma Smith',
            type: 'subsidy',
            fullRate: 850.0,
            subsidy: 550.0,
          },
        ],
        total: 300.0,
      },
      {
        id: generateId('inv'),
        invoiceNumber: 'INV-2025-002',
        fileNumber: '1002',
        clientId: client2.id,
        date: '2025-02-01',
        dueDate: '2025-02-15',
        lineItems: [
          {
            id: generateId('item'),
            title: 'Monthly Childcare - Jake Johnson',
            type: 'hourly',
            hours: 160,
            ratePerHour: 12.5,
          },
          {
            id: generateId('item'),
            title: 'Late Pickup Fee',
            type: 'flat',
            amount: 50.0,
          },
        ],
        total: 2050.0,
      },
    ];

    sampleInvoices.forEach((invoice) => {
      if (!invoices.find((inv) => inv.invoiceNumber === invoice.invoiceNumber)) {
        addInvoice(invoice);
      }
    });

    addNotification('success', 'Sample data loaded successfully!');
  };

  return (
    <Button variant="secondary" size="sm" onClick={loadSampleData}>
      <Database size={16} />
      Load Sample Data
    </Button>
  );
};
