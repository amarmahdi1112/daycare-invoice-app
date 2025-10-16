import React from 'react';
import styled from 'styled-components';
import { FileDown } from 'lucide-react';
import type { Invoice } from '../../types';
import { Modal } from '../common/Modal';
import { InvoicePreview } from './InvoicePreview';
import { Button } from '../common/Button';
import { exportToPDF } from '../../utils/pdfExport';
import { useNotificationStore } from '../../contexts/notificationStore';

const ModalContent = styled.div`
  max-height: 70vh;
  overflow-y: auto;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

interface ViewInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
}

export const ViewInvoiceModal: React.FC<ViewInvoiceModalProps> = ({
  isOpen,
  onClose,
  invoice,
}) => {
  const { addNotification } = useNotificationStore();

  if (!invoice) return null;

  const handleExportPDF = async () => {
    try {
      await exportToPDF('invoice-preview', `Invoice-${invoice.invoiceNumber}`);
      addNotification('success', `Invoice ${invoice.invoiceNumber} exported to PDF successfully!`);
    } catch (error) {
      console.error('PDF export failed:', error);
      addNotification('error', 'Failed to export PDF. Please try again.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Invoice ${invoice.invoiceNumber}`}
      size="lg"
    >
      <ModalContent>
        <InvoicePreview
          invoiceData={{
            invoiceNumber: invoice.invoiceNumber,
            fileNumber: invoice.fileNumber,
            clientId: invoice.clientId,
            date: invoice.date,
            dueDate: invoice.dueDate,
            lineItems: invoice.lineItems,
          }}
        />
      </ModalContent>
      <ModalFooter>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button onClick={handleExportPDF}>
          <FileDown size={20} />
          Export to PDF
        </Button>
      </ModalFooter>
    </Modal>
  );
};
