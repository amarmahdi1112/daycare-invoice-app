import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Save } from 'lucide-react';
import { useStore } from '../contexts/store';
import { useNotificationStore } from '../contexts/notificationStore';
import { Button } from '../components/common/Button';
import { Input, Label, InputWrapper, TextArea } from '../components/common/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/common/Card';

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const PageDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;

const SettingsContainer = styled.div`
  max-width: 800px;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;


export const Settings: React.FC = () => {
  const { companyProfile, setCompanyProfile } = useStore();
  const { addNotification } = useNotificationStore();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    logoUrl: '',
  });

  useEffect(() => {
    if (companyProfile) {
      setFormData({
        name: companyProfile.name,
        address: companyProfile.address,
        logoUrl: companyProfile.logoUrl || '',
      });
    }
  }, [companyProfile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      addNotification('error', 'Please enter a company name');
      return;
    }

    setCompanyProfile({
      name: formData.name,
      address: formData.address,
      logoUrl: formData.logoUrl || undefined,
    });

    addNotification('success', 'Company profile saved successfully!');
  };

  return (
    <div>
      <PageTitle>Settings</PageTitle>
      <PageDescription>
        Manage your company profile information
      </PageDescription>

      <SettingsContainer>
        <Card>
          <CardHeader>
            <CardTitle>Company Profile</CardTitle>
            <CardDescription>
              This information will appear on all your invoices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <FormSection>
                <InputWrapper>
                  <Label>Company Name *</Label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., ABC Daycare Center"
                    required
                  />
                </InputWrapper>

                <InputWrapper>
                  <Label>Company Address *</Label>
                  <TextArea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Enter your full business address"
                    required
                  />
                </InputWrapper>

                <InputWrapper>
                  <Label>Logo URL (Optional)</Label>
                  <Input
                    type="url"
                    value={formData.logoUrl}
                    onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                    placeholder="https://example.com/logo.png"
                  />
                </InputWrapper>
              </FormSection>
            </form>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSubmit}>
              <Save size={20} />
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </SettingsContainer>
    </div>
  );
};
