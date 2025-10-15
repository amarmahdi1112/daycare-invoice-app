import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import {
  LayoutDashboard,
  FileText,
  History,
  Users,
  Settings,
} from 'lucide-react';

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

export const Sidebar: React.FC = () => {
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
    </SidebarContainer>
  );
};
