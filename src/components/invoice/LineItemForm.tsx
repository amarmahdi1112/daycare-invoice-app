import React from 'react';
import styled from 'styled-components';
import { Trash2 } from 'lucide-react';
import type { LineItem, BillingType } from '../../types';
import { Input, Label, Select, InputWrapper } from '../common/Input';
import { Button } from '../common/Button';
import { calculateLineItemTotal, formatCurrency } from '../../utils/calculations';

const LineItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.surface};
`;

const LineItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const LineItemTitle = styled.h4`
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const LineItemGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FieldRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
`;

const TotalDisplay = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  text-align: right;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

interface LineItemFormProps {
  item: LineItem;
  index: number;
  onChange: (id: string, field: keyof LineItem, value: unknown) => void;
  onDelete: (id: string) => void;
}

export const LineItemForm: React.FC<LineItemFormProps> = ({
  item,
  index,
  onChange,
  onDelete,
}) => {
  const handleChange = (field: keyof LineItem, value: unknown) => {
    onChange(item.id, field, value);
  };

  const renderTypeSpecificFields = () => {
    switch (item.type) {
      case 'subsidy':
        return (
          <FieldRow>
            <InputWrapper>
              <Label>Full Rate ($)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={item.fullRate || ''}
                onChange={(e) => handleChange('fullRate', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </InputWrapper>
            <InputWrapper>
              <Label>Subsidy/Grant ($)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={item.subsidy || ''}
                onChange={(e) => handleChange('subsidy', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </InputWrapper>
          </FieldRow>
        );
      case 'hourly':
        return (
          <FieldRow>
            <InputWrapper>
              <Label>Hours</Label>
              <Input
                type="number"
                step="0.25"
                min="0"
                value={item.hours || ''}
                onChange={(e) => handleChange('hours', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </InputWrapper>
            <InputWrapper>
              <Label>Rate per Hour ($)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={item.ratePerHour || ''}
                onChange={(e) => handleChange('ratePerHour', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </InputWrapper>
          </FieldRow>
        );
      case 'flat':
        return (
          <InputWrapper>
            <Label>Amount ($)</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={item.amount || ''}
              onChange={(e) => handleChange('amount', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
            />
          </InputWrapper>
        );
    }
  };

  const total = calculateLineItemTotal(item);

  return (
    <LineItemContainer>
      <LineItemHeader>
        <LineItemTitle>Item {index + 1}</LineItemTitle>
        <Button
          variant="danger"
          size="sm"
          onClick={() => onDelete(item.id)}
          type="button"
        >
          <Trash2 size={16} />
          Remove
        </Button>
      </LineItemHeader>

      <InputWrapper>
        <Label>Item Description</Label>
        <Input
          type="text"
          value={item.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="e.g., Childcare for John Doe"
        />
      </InputWrapper>

      <LineItemGrid>
        <div>
          <InputWrapper>
            <Label>Billing Type</Label>
            <Select
              value={item.type}
              onChange={(e) => handleChange('type', e.target.value as BillingType)}
            >
              <option value="subsidy">Subsidy/Grant Based</option>
              <option value="hourly">Hourly Rate</option>
              <option value="flat">Flat Fee</option>
            </Select>
          </InputWrapper>

          {renderTypeSpecificFields()}
        </div>

        <div>
          <Label>Line Total</Label>
          <TotalDisplay>{formatCurrency(total)}</TotalDisplay>
        </div>
      </LineItemGrid>
    </LineItemContainer>
  );
};
