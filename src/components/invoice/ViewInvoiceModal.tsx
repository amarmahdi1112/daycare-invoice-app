import React from 'react';
import styled from 'styled-components';
import type { Invoice } from '../../types';
import { Modal } from '../common/Modal';
import { InvoicePreview } from './InvoicePreview';

const ModalContent = styled.div`
  max-height: 70vh;
  overflow-y: auto;
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
  if (!invoice) return null;

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
    </Modal>
  );
};
