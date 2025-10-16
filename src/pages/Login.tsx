import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { LogIn } from 'lucide-react';
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

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { addNotification } = useNotificationStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      addNotification('error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(email, password);
      
      if (success) {
        addNotification('success', 'Welcome back!');
        navigate('/');
      } else {
        addNotification('error', 'Invalid email or password');
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
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>

          <Form onSubmit={handleSubmit}>
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
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={isLoading}
              />
            </InputWrapper>

            <Button type="submit" size="lg" disabled={isLoading}>
              <LogIn size={20} />
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </Form>

          <AuthFooter>
            Don't have an account? <Link to="/signup">Sign up</Link>
          </AuthFooter>
        </CardContent>
      </AuthCard>
    </AuthContainer>
  );
};
