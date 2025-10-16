/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import styled from 'styled-components';
import { Save, Trash2, Plus } from 'lucide-react';
import { Button } from '../common/Button';
import { Input, Label, InputWrapper } from '../common/Input';
import { Modal } from '../common/Modal';
import { useTemplateStore, type LineItemTemplate } from '../../contexts/templateStore';
import { useNotificationStore } from '../../contexts/notificationStore';
import { generateId } from '../../utils/calculations';
import type { LineItem } from '../../types';

const TemplatesSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const TemplatesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const TemplateButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const DeleteTemplateButton = styled.button`
  padding: ${({ theme }) => theme.spacing.xs};
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.danger};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.danger};
    color: white;
  }
`;

const TemplateActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const TemplateCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

interface LineItemTemplatesProps {
  lineItems: LineItem[];
  onLoadTemplate: (items: LineItem[]) => void;
}

export const LineItemTemplates: React.FC<LineItemTemplatesProps> = ({
  lineItems,
  onLoadTemplate,
}) => {
  const { templates, addTemplate, deleteTemplate } = useTemplateStore();
  const { addNotification } = useNotificationStore();
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');

  const handleSaveTemplate = () => {
    if (!templateName.trim()) {
      addNotification('error', 'Please enter a template name');
      return;
    }

    if (lineItems.length === 0) {
      addNotification('error', 'Please add at least one line item');
      return;
    }

    const template: LineItemTemplate = {
      id: generateId('template'),
      name: templateName,
      lineItems: lineItems.map(({ id, ...rest }) => rest),
      createdAt: new Date().toISOString(),
    };

    addTemplate(template);
    addNotification('success', `Template "${templateName}" saved successfully!`);
    setTemplateName('');
    setIsSaveModalOpen(false);
  };

  const handleLoadTemplate = (template: LineItemTemplate) => {
    const newLineItems: LineItem[] = template.lineItems.map((item) => ({
      ...item,
      id: generateId('item'),
    }));

    onLoadTemplate(newLineItems);
    addNotification('success', `Template "${template.name}" loaded!`);
  };

  const handleDeleteTemplate = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the template "${name}"?`)) {
      deleteTemplate(id);
      addNotification('success', 'Template deleted');
    }
  };

  return (
    <TemplatesSection>
      <TemplateActions>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsSaveModalOpen(true)}
          disabled={lineItems.length === 0}
        >
          <Save size={16} />
          Save as Template
        </Button>
      </TemplateActions>

      {templates.length > 0 && (
        <>
          <Label>Quick Load Templates</Label>
          <TemplatesList>
            {templates.map((template) => (
              <TemplateCard key={template.id}>
                <TemplateButton onClick={() => handleLoadTemplate(template)}>
                  <Plus size={16} />
                  {template.name}
                </TemplateButton>
                <DeleteTemplateButton
                  onClick={() => handleDeleteTemplate(template.id, template.name)}
                  title="Delete template"
                >
                  <Trash2 size={14} />
                </DeleteTemplateButton>
              </TemplateCard>
            ))}
          </TemplatesList>
        </>
      )}

      <Modal
        isOpen={isSaveModalOpen}
        onClose={() => {
          setIsSaveModalOpen(false);
          setTemplateName('');
        }}
        title="Save Line Items as Template"
      >
        <InputWrapper>
          <Label>Template Name</Label>
          <Input
            type="text"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder="e.g., Weekly Childcare Package"
            autoFocus
          />
        </InputWrapper>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          <Button
            variant="secondary"
            onClick={() => {
              setIsSaveModalOpen(false);
              setTemplateName('');
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleSaveTemplate}>Save Template</Button>
        </div>
      </Modal>
    </TemplatesSection>
  );
};
