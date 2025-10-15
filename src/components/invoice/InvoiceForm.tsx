import React, { useState } from 'react';
import styled from 'styled-components';
import { Plus } from 'lucide-react';
import type { LineItem, Invoice } from '../../types';
import { useStore } from '../../contexts/store';
import { Input, Label, Select, InputWrapper } from '../common/Input';
import { Button } from '../common/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../common/Card';
import { LineItemForm } from './LineItemForm';
import { generateId } from '../../utils/calculations';
import { getTodayDate } from '../../utils/dateHelpers';

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

interface InvoiceFormProps {
  initialInvoice?: Partial<Invoice>;
  onSubmit?: (invoice: Invoice) => void;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
  initialInvoice,
}) => {
  const { clients } = useStore();
  const todayDate = getTodayDate();

  const [invoiceNumber, setInvoiceNumber] = useState(
    initialInvoice?.invoiceNumber || ''
  );
  const [fileNumber, setFileNumber] = useState(initialInvoice?.fileNumber || '');
  const [selectedClientId, setSelectedClientId] = useState(
    initialInvoice?.clientId || ''
  );
  const [date, setDate] = useState(initialInvoice?.date || todayDate);
  const [dueDate, setDueDate] = useState(initialInvoice?.dueDate || todayDate);
  const [lineItems, setLineItems] = useState<LineItem[]>(
    initialInvoice?.lineItems || [
      {
        id: generateId('item'),
        title: '',
        type: 'subsidy',
        fullRate: 0,
        subsidy: 0,
      },
    ]
  );

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

  const handleClientChange = (clientId: string) => {
    setSelectedClientId(clientId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice Information</CardTitle>
      </CardHeader>
      <CardContent>
        <FormGrid>
          <InputWrapper>
            <Label>Invoice Number *</Label>
            <Input
              type="text"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              placeholder="e.g., BAA-2025-0601"
              required
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
              onChange={(e) => handleClientChange(e.target.value)}
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
  );
};
