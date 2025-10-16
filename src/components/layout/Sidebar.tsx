/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  LayoutDashboard,
  FileText,
  History,
  Users,
  Settings,
  LogOut,
  User,
} from 'lucide-react';
import { useAuthStore } from '../../contexts/authStore';
import { useNotificationStore } from '../../contexts/notificationStore';
import { Button } from '../common/Button';

const SidebarContainer = styled.aside`
  width: 250px;
  background-color: ${({ theme }) => theme.colors.background};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const Logo = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
  padding: ${({ theme }) => theme.spacing.md} 0;
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  flex: 1;
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  transition: all ${({ theme }) => theme.transitions.fast};
  text-decoration: none;

  &:hover {
    background-color: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  &.active {
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;

    &:hover {
      background-color: ${({ theme }) => theme.colors.primaryHover};
    }
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const UserSection = styled.div`
  margin-top: auto;
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  svg {
    width: 36px;
    height: 36px;
    padding: ${({ theme }) => theme.spacing.xs};
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
    border-radius: 50%;
  }
`;

const UserDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

const UserName = styled.div`
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UserEmail = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.text.muted};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { addNotification } = useNotificationStore();

  const handleLogout = () => {
    logout();
    addNotification('success', 'Logged out successfully');
    navigate('/login');
  };

  return (
    <SidebarContainer>
      <Logo>DayCare Invoice</Logo>
      <Nav>
        <StyledNavLink to="/" end>
          <LayoutDashboard />
          Dashboard
        </StyledNavLink>
        <StyledNavLink to="/new-invoice">
          <FileText />
          New Invoice
        </StyledNavLink>
        <StyledNavLink to="/history">
          <History />
          History
        </StyledNavLink>
        <StyledNavLink to="/clients">
          <Users />
          Clients
        </StyledNavLink>
        <StyledNavLink to="/settings">
          <Settings />
          Settings
        </StyledNavLink>
      </Nav>

      <UserSection>
        <UserInfo>
          <User />
          <UserDetails>
            <UserName>{user?.name || 'User'}</UserName>
            <UserEmail>{user?.email || ''}</UserEmail>
          </UserDetails>
        </UserInfo>
        <Button variant="danger" size="sm" onClick={handleLogout}>
          <LogOut size={16} />
          Logout
        </Button>
      </UserSection>
    </SidebarContainer>
  );
};
