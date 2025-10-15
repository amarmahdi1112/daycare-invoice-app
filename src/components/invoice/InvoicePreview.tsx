import React from 'react';
import styled from 'styled-components';
import type { LineItem } from '../../types';
import { useStore } from '../../contexts/store';
import { formatCurrency, calculateLineItemTotal, calculateInvoiceTotal } from '../../utils/calculations';
import { formatDate } from '../../utils/dateHelpers';
import { Card } from '../common/Card';

const PreviewContainer = styled(Card)`
  background-color: white;
  padding: ${({ theme }) => theme.spacing.xxl};
  max-width: 800px;
  margin: 0 auto;
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const InvoiceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
  padding-bottom: ${({ theme }) => theme.spacing.lg};
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
`;

const CompanyInfo = styled.div`
  flex: 1;
`;

const CompanyName = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const CompanyAddress = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.6;
  white-space: pre-line;
`;

const InvoiceTitle = styled.div`
  text-align: right;
`;

const InvoiceLabel = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const InvoiceDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;

const DetailSection = styled.div``;

const DetailTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-transform: uppercase;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const DetailValue = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.6;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const TableHeader = styled.thead`
  background-color: ${({ theme }) => theme.colors.surface};
`;

const TableRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const TableHeaderCell = styled.th`
  padding: ${({ theme }) => theme.spacing.md};
  text-align: left;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-transform: uppercase;
`;

const TableCell = styled.td`
  padding: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const TotalsSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding-top: ${({ theme }) => theme.spacing.xl};
  border-top: 2px solid ${({ theme }) => theme.colors.border};
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  min-width: 300px;
  padding: ${({ theme }) => theme.spacing.sm} 0;
`;

const TotalLabel = styled.span<{ $isGrandTotal?: boolean }>`
  font-size: ${({ $isGrandTotal, theme }) =>
    $isGrandTotal ? theme.fontSizes.xl : theme.fontSizes.md};
  font-weight: ${({ $isGrandTotal, theme }) =>
    $isGrandTotal ? theme.fontWeights.bold : theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const TotalValue = styled.span<{ $isGrandTotal?: boolean }>`
  font-size: ${({ $isGrandTotal, theme }) =>
    $isGrandTotal ? theme.fontSizes.xl : theme.fontSizes.md};
  font-weight: ${({ $isGrandTotal, theme }) =>
    $isGrandTotal ? theme.fontWeights.bold : theme.fontWeights.semibold};
  color: ${({ $isGrandTotal, theme }) =>
    $isGrandTotal ? theme.colors.primary : theme.colors.text.primary};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.text.muted};
  font-style: italic;
`;

interface InvoicePreviewProps {
  invoiceData: {
    invoiceNumber: string;
    fileNumber: string;
    clientId: string;
    date: string;
    dueDate: string;
    lineItems: LineItem[];
  };
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoiceData }) => {
  const { companyProfile, getClientById } = useStore();
  const client = invoiceData.clientId ? getClientById(invoiceData.clientId) : null;

  const subtotal = calculateInvoiceTotal(invoiceData.lineItems);

  if (!invoiceData.invoiceNumber) {
    return (
      <PreviewContainer>
        <EmptyState>
          Fill in the invoice details to see a preview
        </EmptyState>
      </PreviewContainer>
    );
  }

  return (
    <PreviewContainer id="invoice-preview">
      <InvoiceHeader>
        <CompanyInfo>
          <CompanyName>
            {companyProfile?.name || 'Your Company Name'}
          </CompanyName>
          <CompanyAddress>
            {companyProfile?.address || 'Company Address'}
          </CompanyAddress>
        </CompanyInfo>
        <InvoiceTitle>
          <InvoiceLabel>INVOICE</InvoiceLabel>
        </InvoiceTitle>
      </InvoiceHeader>

      <InvoiceDetails>
        <DetailSection>
          <DetailTitle>Bill To</DetailTitle>
          <DetailValue>
            {client ? (
              <>
                <strong>{client.name}</strong>
                <br />
                {client.address}
              </>
            ) : (
              'Select a client'
            )}
          </DetailValue>
        </DetailSection>

        <DetailSection>
          <DetailTitle>Invoice Details</DetailTitle>
          <DetailValue>
            <strong>Invoice #:</strong> {invoiceData.invoiceNumber || 'N/A'}
            <br />
            {invoiceData.fileNumber && (
              <>
                <strong>File #:</strong> {invoiceData.fileNumber}
                <br />
              </>
            )}
            <strong>Date:</strong> {invoiceData.date ? formatDate(invoiceData.date) : 'N/A'}
            <br />
            <strong>Due Date:</strong> {invoiceData.dueDate ? formatDate(invoiceData.dueDate) : 'N/A'}
          </DetailValue>
        </DetailSection>
      </InvoiceDetails>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Description</TableHeaderCell>
            <TableHeaderCell>Type</TableHeaderCell>
            <TableHeaderCell style={{ textAlign: 'right' }}>Details</TableHeaderCell>
            <TableHeaderCell style={{ textAlign: 'right' }}>Amount</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <tbody>
          {invoiceData.lineItems.map((item) => {
            const total = calculateLineItemTotal(item);
            let details = '';
            
            switch (item.type) {
              case 'subsidy':
                details = `${formatCurrency(item.fullRate || 0)} - ${formatCurrency(item.subsidy || 0)}`;
                break;
              case 'hourly':
                details = `${item.hours || 0} hrs × ${formatCurrency(item.ratePerHour || 0)}`;
                break;
              case 'flat':
                details = 'Flat Fee';
                break;
            }

            return (
              <TableRow key={item.id}>
                <TableCell>{item.title || 'Untitled Item'}</TableCell>
                <TableCell style={{ textTransform: 'capitalize' }}>
                  {item.type === 'subsidy' ? 'Subsidy/Grant' : item.type}
                </TableCell>
                <TableCell style={{ textAlign: 'right' }}>{details}</TableCell>
                <TableCell style={{ textAlign: 'right' }}>
                  {formatCurrency(total)}
                </TableCell>
              </TableRow>
            );
          })}
        </tbody>
      </Table>

      <TotalsSection>
        <TotalRow>
          <TotalLabel>Subtotal:</TotalLabel>
          <TotalValue>{formatCurrency(subtotal)}</TotalValue>
        </TotalRow>
        <TotalRow>
          <TotalLabel $isGrandTotal>Total:</TotalLabel>
          <TotalValue $isGrandTotal>{formatCurrency(subtotal)}</TotalValue>
        </TotalRow>
      </TotalsSection>
    </PreviewContainer>
  );
};
