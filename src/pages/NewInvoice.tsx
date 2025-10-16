import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Save, FileDown, Plus } from 'lucide-react';
import type { LineItem, Invoice } from '../types';
import { useStore } from '../contexts/store';
import { useNotificationStore } from '../contexts/notificationStore';
import { Button } from '../components/common/Button';
import { Input, Label, Select, InputWrapper } from '../components/common/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card';
import { LineItemForm } from '../components/invoice/LineItemForm';
import { InvoicePreview } from '../components/invoice/InvoicePreview';
import { generateId, calculateInvoiceTotal, generateInvoiceNumber } from '../utils/calculations';
import { getTodayDate } from '../utils/dateHelpers';
import { exportToPDF } from '../utils/pdfExport';

const PageContainer = styled.div`
  width: 100%;
`;

const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const PageDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const DualPanelLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.xl};
  align-items: start;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled.div`
  position: sticky;
  top: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 1200px) {
    position: static;
  }
`;

const ActionBar = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  position: sticky;
  bottom: ${({ theme }) => theme.spacing.md};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const LineItemsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-top: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const NewInvoice: React.FC = () => {
  const navigate = useNavigate();
  const { addInvoice, clients, invoices } = useStore();
  const { addNotification } = useNotificationStore();
  const todayDate = getTodayDate();

  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [fileNumber, setFileNumber] = useState('');
  const [selectedClientId, setSelectedClientId] = useState('');
  const [date, setDate] = useState(todayDate);
  const [dueDate, setDueDate] = useState(todayDate);
  const [lineItems, setLineItems] = useState<LineItem[]>([
    {
      id: generateId('item'),
      title: '',
      type: 'subsidy',
      fullRate: 0,
      subsidy: 0,
    },
  ]);

  // Auto-generate invoice number on component mount
  useEffect(() => {
    const newInvoiceNumber = generateInvoiceNumber(invoices);
    setInvoiceNumber(newInvoiceNumber);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddLineItem = () => {
    const newItem: LineItem = {
      id: generateId('item'),
      title: '',
      type: 'subsidy',
      fullRate: 0,
      subsidy: 0,
    };
    setLineItems([...lineItems, newItem]);
  };

  const handleLineItemChange = (
    id: string,
    field: keyof LineItem,
    value: unknown
  ) => {
    setLineItems(
      lineItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleDeleteLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((item) => item.id !== id));
    }
  };

  const handleSaveInvoice = () => {
    if (!selectedClientId) {
      addNotification('error', 'Please select a client');
      return;
    }

    const total = calculateInvoiceTotal(lineItems);

    const invoice: Invoice = {
      id: generateId('inv'),
      invoiceNumber,
      fileNumber,
      clientId: selectedClientId,
      date,
      dueDate,
      lineItems,
      total,
    };

    addInvoice(invoice);
    addNotification('success', `Invoice ${invoiceNumber} saved successfully!`);
    navigate('/history');
  };

  const handleExportPDF = async () => {
    if (!selectedClientId) {
      addNotification('error', 'Please select a client before exporting');
      return;
    }

    try {
      await exportToPDF('invoice-preview', `Invoice-${invoiceNumber}`);
      addNotification('success', `Invoice ${invoiceNumber} exported to PDF successfully!`);
    } catch (error) {
      console.error('PDF export failed:', error);
      addNotification('error', 'Failed to export PDF. Please try again.');
    }
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Create New Invoice</PageTitle>
        <PageDescription>
          Fill in the details below and see a live preview of your invoice
        </PageDescription>
      </PageHeader>

      <DualPanelLayout>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Invoice Information</CardTitle>
            </CardHeader>
            <CardContent>
              <FormGrid>
                <InputWrapper>
                  <Label>Invoice Number (Auto-Generated)</Label>
                  <Input
                    type="text"
                    value={invoiceNumber}
                    readOnly
                    placeholder="INV-2025-001"
                    style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                  />
                </InputWrapper>

                <InputWrapper>
                  <Label>File Number</Label>
                  <Input
                    type="text"
                    value={fileNumber}
                    onChange={(e) => setFileNumber(e.target.value)}
                    placeholder="e.g., 1727673"
                  />
                </InputWrapper>

                <InputWrapper>
                  <Label>Client *</Label>
                  <Select
                    value={selectedClientId}
                    onChange={(e) => setSelectedClientId(e.target.value)}
                    required
                  >
                    <option value="">Select a client...</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </Select>
                </InputWrapper>

                <InputWrapper>
                  <Label>Invoice Date *</Label>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </InputWrapper>

                <InputWrapper>
                  <Label>Due Date *</Label>
                  <Input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                  />
                </InputWrapper>
              </FormGrid>

              <SectionTitle>Line Items</SectionTitle>

              <LineItemsSection>
                {lineItems.map((item, index) => (
                  <LineItemForm
                    key={item.id}
                    item={item}
                    index={index}
                    onChange={handleLineItemChange}
                    onDelete={handleDeleteLineItem}
                  />
                ))}
              </LineItemsSection>

              <Button
                variant="secondary"
                onClick={handleAddLineItem}
                type="button"
                style={{ marginTop: '1rem' }}
              >
                <Plus size={20} />
                Add Line Item
              </Button>
            </CardContent>
          </Card>

          <ActionBar>
            <Button size="lg" onClick={handleSaveInvoice} fullWidth>
              <Save size={20} />
              Save Invoice
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={handleExportPDF}
              fullWidth
            >
              <FileDown size={20} />
              Export PDF
            </Button>
          </ActionBar>
        </div>

        <Panel>
          <InvoicePreview
            invoiceData={{
              invoiceNumber,
              fileNumber,
              clientId: selectedClientId,
              date,
              dueDate,
              lineItems,
            }}
          />
        </Panel>
      </DualPanelLayout>
    </PageContainer>
  );
};
