import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FileText, Users, DollarSign } from 'lucide-react';
import { useStore } from '../contexts/store';
import { Button } from '../components/common/Button';
import { SampleDataButton } from '../components/common/SampleDataButton';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/common/Card';
import { formatCurrency } from '../utils/calculations';

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;

const StatCard = styled(Card)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.xl};
`;

const IconWrapper = styled.div<{ $color: string }>`
  width: 60px;
  height: 60px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background-color: ${({ $color }) => $color}20;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $color }) => $color};
`;

const StatInfo = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const PageDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;

const QuickActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xxl};
  flex-wrap: wrap;
`;

const RecentInvoicesSection = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xxl};
`;

const InvoiceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const InvoiceItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.background};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const InvoiceItemInfo = styled.div`
  flex: 1;
`;

const InvoiceNumber = styled.div`
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const InvoiceClient = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const InvoiceAmount = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.text.muted};
`;

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { invoices, clients, companyProfile } = useStore();

  const totalRevenue = invoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const recentInvoices = invoices.slice(-5).reverse();

  return (
    <div>
      <PageTitle>Dashboard</PageTitle>
      <PageDescription>
        Welcome to your daycare invoice management system
      </PageDescription>

      <DashboardGrid>
        <StatCard>
          <IconWrapper $color="#3b82f6">
            <FileText size={28} />
          </IconWrapper>
          <StatInfo>
            <StatValue>{invoices.length}</StatValue>
            <StatLabel>Total Invoices</StatLabel>
          </StatInfo>
        </StatCard>

        <StatCard>
          <IconWrapper $color="#10b981">
            <DollarSign size={28} />
          </IconWrapper>
          <StatInfo>
            <StatValue>{formatCurrency(totalRevenue)}</StatValue>
            <StatLabel>Total Revenue</StatLabel>
          </StatInfo>
        </StatCard>

        <StatCard>
          <IconWrapper $color="#f59e0b">
            <Users size={28} />
          </IconWrapper>
          <StatInfo>
            <StatValue>{clients.length}</StatValue>
            <StatLabel>Total Clients</StatLabel>
          </StatInfo>
        </StatCard>
      </DashboardGrid>

      <QuickActions>
        <Button size="lg" onClick={() => navigate('/new-invoice')}>
          <FileText size={20} />
          Create New Invoice
        </Button>
        <Button variant="secondary" size="lg" onClick={() => navigate('/clients')}>
          <Users size={20} />
          Manage Clients
        </Button>
        {!companyProfile && (
          <Button variant="secondary" size="lg" onClick={() => navigate('/settings')}>
            Set Up Company Profile
          </Button>
        )}
        {(clients.length === 0 || invoices.length === 0) && <SampleDataButton />}
      </QuickActions>

      <RecentInvoicesSection>
        <Card>
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
            <CardDescription>Your latest invoices</CardDescription>
          </CardHeader>
          <CardContent>
            {recentInvoices.length > 0 ? (
              <InvoiceList>
                {recentInvoices.map((invoice) => {
                  const client = clients.find((c) => c.id === invoice.clientId);
                  return (
                    <InvoiceItem key={invoice.id}>
                      <InvoiceItemInfo>
                        <InvoiceNumber>{invoice.invoiceNumber}</InvoiceNumber>
                        <InvoiceClient>{client?.name || 'Unknown Client'}</InvoiceClient>
                      </InvoiceItemInfo>
                      <InvoiceAmount>{formatCurrency(invoice.total)}</InvoiceAmount>
                    </InvoiceItem>
                  );
                })}
              </InvoiceList>
            ) : (
              <EmptyState>No invoices yet. Create your first invoice!</EmptyState>
            )}
          </CardContent>
        </Card>
      </RecentInvoicesSection>
    </div>
  );
};
