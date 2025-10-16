/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Eye, Copy, Trash2, Search, FileDown, Edit } from 'lucide-react';
import type { Invoice } from '../types';
import { useStore } from '../contexts/store';
import { useNotificationStore } from '../contexts/notificationStore';
import { Button } from '../components/common/Button';
import { Input, InputWrapper } from '../components/common/Input';
import { ViewInvoiceModal } from '../components/invoice/ViewInvoiceModal';
import { formatCurrency } from '../utils/calculations';
import { formatDate } from '../utils/dateHelpers';
import { generateId } from '../utils/calculations';
import { exportToPDF } from '../utils/pdfExport';

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const PageDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const SearchBar = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  max-width: 500px;
`;

const SearchInputWrapper = styled(InputWrapper)`
  position: relative;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.text.muted};
  pointer-events: none;
`;

const SearchInput = styled(Input)`
  padding-left: 40px;
`;

const TableContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: ${({ theme }) => theme.colors.surface};
`;

const TableRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.surface};
  }
`;

const TableHeader = styled.th`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  text-align: left;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-transform: uppercase;
  white-space: nowrap;
`;

const TableCell = styled.td`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.text.muted};
`;

const InvoiceNumber = styled.span`
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.primary};
`;

const StatsBar = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StatValue = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const InvoiceHistory: React.FC = () => {
  const navigate = useNavigate();
  const { invoices, clients, deleteInvoice, addInvoice, getInvoiceById } = useStore();
  const { addNotification } = useNotificationStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const filteredInvoices = useMemo(() => {
    if (!searchTerm) return invoices;

    const term = searchTerm.toLowerCase();
    return invoices.filter((invoice) => {
      const client = clients.find((c) => c.id === invoice.clientId);
      return (
        invoice.invoiceNumber.toLowerCase().includes(term) ||
        invoice.fileNumber.toLowerCase().includes(term) ||
        client?.name.toLowerCase().includes(term)
      );
    });
  }, [invoices, clients, searchTerm]);

  const totalRevenue = useMemo(() => {
    return invoices.reduce((sum, invoice) => sum + invoice.total, 0);
  }, [invoices]);

  const handleDelete = (invoiceId: string, invoiceNumber: string) => {
    if (window.confirm(`Are you sure you want to delete invoice ${invoiceNumber}?`)) {
      deleteInvoice(invoiceId);
    }
  };

  const handleDuplicate = (invoiceId: string) => {
    const originalInvoice = getInvoiceById(invoiceId);
    if (!originalInvoice) return;

    const duplicatedInvoice: Invoice = {
      ...originalInvoice,
      id: generateId('inv'),
      invoiceNumber: `${originalInvoice.invoiceNumber}-COPY`,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date().toISOString().split('T')[0],
    };

    addInvoice(duplicatedInvoice);
    addNotification('success', `Invoice duplicated as ${duplicatedInvoice.invoiceNumber}`);
  };

  const handleView = (invoiceId: string) => {
    const invoice = getInvoiceById(invoiceId);
    if (invoice) {
      setViewingInvoice(invoice);
      setIsViewModalOpen(true);
    }
  };

  const handleEdit = (invoiceId: string) => {
    navigate(`/new-invoice?edit=${invoiceId}`);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewingInvoice(null);
  };

  const handleExportPDF = async (invoice: Invoice) => {
    try {
      // Open the modal to render the invoice preview
      setViewingInvoice(invoice);
      setIsViewModalOpen(true);
      
      // Wait for the modal and preview to render
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Export the PDF
      await exportToPDF('invoice-preview', `Invoice-${invoice.invoiceNumber}`);
      addNotification('success', `Invoice ${invoice.invoiceNumber} exported to PDF successfully!`);
      
      // Close the modal after export
      setIsViewModalOpen(false);
      setViewingInvoice(null);
    } catch (error) {
      console.error('PDF export failed:', error);
      addNotification('error', 'Failed to export PDF. Please try again.');
      // Close modal on error too
      setIsViewModalOpen(false);
      setViewingInvoice(null);
    }
  };

  return (
    <div>
      <PageTitle>Invoice History</PageTitle>
      <PageDescription>View and manage all your invoices</PageDescription>

      <StatsBar>
        <StatItem>
          <StatLabel>Total Invoices</StatLabel>
          <StatValue>{invoices.length}</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>Total Revenue</StatLabel>
          <StatValue>{formatCurrency(totalRevenue)}</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>Showing</StatLabel>
          <StatValue>{filteredInvoices.length}</StatValue>
        </StatItem>
      </StatsBar>

      <SearchBar>
        <SearchInputWrapper>
          <SearchIcon>
            <Search size={20} />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search by invoice number, file number, or client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchInputWrapper>
      </SearchBar>

      <TableContainer>
        {filteredInvoices.length === 0 ? (
          <EmptyState>
            {searchTerm
              ? 'No invoices found matching your search'
              : 'No invoices yet. Create your first invoice!'}
          </EmptyState>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Invoice #</TableHeader>
                <TableHeader>File #</TableHeader>
                <TableHeader>Client</TableHeader>
                <TableHeader>Date</TableHeader>
                <TableHeader>Due Date</TableHeader>
                <TableHeader style={{ textAlign: 'right' }}>Amount</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <tbody>
              {filteredInvoices.map((invoice) => {
                const client = clients.find((c) => c.id === invoice.clientId);
                return (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      <InvoiceNumber>{invoice.invoiceNumber}</InvoiceNumber>
                    </TableCell>
                    <TableCell>{invoice.fileNumber || '-'}</TableCell>
                    <TableCell>{client?.name || 'Unknown Client'}</TableCell>
                    <TableCell>{formatDate(invoice.date)}</TableCell>
                    <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                    <TableCell style={{ textAlign: 'right', fontWeight: 600 }}>
                      {formatCurrency(invoice.total)}
                    </TableCell>
                    <TableCell>
                      <ActionButtons>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleView(invoice.id)}
                          title="View Invoice"
                        >
                          <Eye size={16} />
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleEdit(invoice.id)}
                          title="Edit Invoice"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleExportPDF(invoice)}
                          title="Export to PDF"
                        >
                          <FileDown size={16} />
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleDuplicate(invoice.id)}
                          title="Duplicate Invoice"
                        >
                          <Copy size={16} />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(invoice.id, invoice.invoiceNumber)}
                          title="Delete Invoice"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </ActionButtons>
                    </TableCell>
                  </TableRow>
                );
              })}
            </tbody>
          </Table>
        )}
      </TableContainer>

      <ViewInvoiceModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        invoice={viewingInvoice}
      />
    </div>
  );
};
