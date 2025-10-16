import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { UserPlus } from 'lucide-react';
import { useAuthStore } from '../contexts/authStore';
import { useNotificationStore } from '../contexts/notificationStore';
import { Button } from '../components/common/Button';
import { Input, Label, InputWrapper } from '../components/common/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/common/Card';

const AuthContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: ${({ theme }) => theme.spacing.lg};
`;

const AuthCard = styled(Card)`
  width: 100%;
  max-width: 450px;
  box-shadow: ${({ theme }) => theme.shadows.xl};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const AuthFooter = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    font-weight: ${({ theme }) => theme.fontWeights.semibold};

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  h1 {
    font-size: ${({ theme }) => theme.fontSizes['2xl']};
    font-weight: ${({ theme }) => theme.fontWeights.bold};
    color: ${({ theme }) => theme.colors.text.primary};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }

  p {
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.text.muted};
  }
`;

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuthStore();
  const { addNotification } = useNotificationStore();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      addNotification('error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      addNotification('error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      addNotification('error', 'Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const success = await signup(email, password, name);
      
      if (success) {
        addNotification('success', 'Account created successfully!');
        navigate('/');
      } else {
        addNotification('error', 'Email already exists');
      }
    } catch (error) {
      addNotification('error', 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContainer>
      <AuthCard>
        <CardContent>
          <Logo>
            <h1>Invoice Manager</h1>
            <p>Daycare Invoice Management System</p>
          </Logo>

          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>Sign up to start managing your invoices</CardDescription>
          </CardHeader>

          <Form onSubmit={handleSubmit}>
            <InputWrapper>
              <Label>Full Name</Label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                autoComplete="name"
                disabled={isLoading}
              />
            </InputWrapper>

            <InputWrapper>
              <Label>Email Address</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                disabled={isLoading}
              />
            </InputWrapper>

            <InputWrapper>
              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                autoComplete="new-password"
                disabled={isLoading}
              />
            </InputWrapper>

            <InputWrapper>
              <Label>Confirm Password</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                disabled={isLoading}
              />
            </InputWrapper>

            <Button type="submit" size="lg" disabled={isLoading}>
              <UserPlus size={20} />
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
          </Form>

          <AuthFooter>
            Already have an account? <Link to="/login">Sign in</Link>
          </AuthFooter>
        </CardContent>
      </AuthCard>
    </AuthContainer>
  );
};
