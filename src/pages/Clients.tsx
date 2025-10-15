import React, { useState } from 'react';
import styled from 'styled-components';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import type { Client } from '../types';
import { useStore } from '../contexts/store';
import { useNotificationStore } from '../contexts/notificationStore';
import { Button } from '../components/common/Button';
import { Input, Label, InputWrapper, TextArea } from '../components/common/Input';
import { Card } from '../components/common/Card';
import { Modal } from '../components/common/Modal';
import { generateId } from '../utils/calculations';

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

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const ClientsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const ClientCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const ClientName = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ClientAddress = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.6;
  flex: 1;
`;

const ClientActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const FormField = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.text.muted};
  grid-column: 1 / -1;
`;

export const Clients: React.FC = () => {
  const { clients, addClient, updateClient, deleteClient } = useStore();
  const { addNotification } = useNotificationStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
  });

  const handleOpenModal = (client?: Client) => {
    if (client) {
      setEditingClient(client);
      setFormData({
        name: client.name,
        address: client.address,
      });
    } else {
      setEditingClient(null);
      setFormData({
        name: '',
        address: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
    setFormData({
      name: '',
      address: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      addNotification('error', 'Please enter a client name');
      return;
    }

    if (editingClient) {
      updateClient(editingClient.id, formData);
      addNotification('success', `Client ${formData.name} updated successfully`);
    } else {
      const newClient: Client = {
        id: generateId('client'),
        ...formData,
      };
      addClient(newClient);
      addNotification('success', `Client ${formData.name} added successfully`);
    }

    handleCloseModal();
  };

  const handleDelete = (client: Client) => {
    if (window.confirm(`Are you sure you want to delete ${client.name}?`)) {
      deleteClient(client.id);
    }
  };

  return (
    <div>
      <PageTitle>Clients</PageTitle>
      <PageDescription>Manage your daycare clients</PageDescription>

      <ActionBar>
        <div />
        <Button onClick={() => handleOpenModal()}>
          <Plus size={20} />
          Add Client
        </Button>
      </ActionBar>

      <ClientsGrid>
        {clients.length === 0 ? (
          <EmptyState>
            No clients yet. Click "Add Client" to get started!
          </EmptyState>
        ) : (
          clients.map((client) => (
            <ClientCard key={client.id}>
              <ClientName>{client.name}</ClientName>
              <ClientAddress>{client.address}</ClientAddress>
              <ClientActions>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleOpenModal(client)}
                  fullWidth
                >
                  <Edit2 size={16} />
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(client)}
                  fullWidth
                >
                  <Trash2 size={16} />
                  Delete
                </Button>
              </ClientActions>
            </ClientCard>
          ))
        )}
      </ClientsGrid>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingClient ? 'Edit Client' : 'Add New Client'}
        footer={
          <>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingClient ? 'Update' : 'Create'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <FormField>
            <InputWrapper>
              <Label>Client Name *</Label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., John Doe"
                required
              />
            </InputWrapper>
          </FormField>

          <FormField>
            <InputWrapper>
              <Label>Address *</Label>
              <TextArea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="e.g., 123 Main St, City, State ZIP"
                required
              />
            </InputWrapper>
          </FormField>
        </form>
      </Modal>
    </div>
  );
};
