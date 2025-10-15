import React from 'react';
import styled, { keyframes } from 'styled-components';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import type { Notification, NotificationType } from '../../contexts/notificationStore';
import { useNotificationStore } from '../../contexts/notificationStore';

const slideIn = keyframes`
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(400px);
    opacity: 0;
  }
`;

const ToastContainer = styled.div`
  position: fixed;
  top: ${({ theme }) => theme.spacing.xl};
  right: ${({ theme }) => theme.spacing.xl};
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  pointer-events: none;
`;

const ToastItem = styled.div<{ $type: NotificationType; $isExiting?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  min-width: 300px;
  max-width: 400px;
  pointer-events: auto;
  animation: ${({ $isExiting }) => ($isExiting ? slideOut : slideIn)} 0.3s ease-in-out;
  border-left: 4px solid ${({ $type, theme }) => {
    switch ($type) {
      case 'success':
        return theme.colors.success;
      case 'error':
        return theme.colors.danger;
      case 'warning':
        return theme.colors.warning;
      case 'info':
        return theme.colors.primary;
    }
  }};
`;

const IconWrapper = styled.div<{ $type: NotificationType }>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $type, theme }) => {
    switch ($type) {
      case 'success':
        return theme.colors.success;
      case 'error':
        return theme.colors.danger;
      case 'warning':
        return theme.colors.warning;
      case 'info':
        return theme.colors.primary;
    }
  }};
`;

const ToastMessage = styled.div`
  flex: 1;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.5;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.muted};
  cursor: pointer;
  padding: 0;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const getIcon = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return <CheckCircle size={20} />;
    case 'error':
      return <XCircle size={20} />;
    case 'warning':
      return <AlertCircle size={20} />;
    case 'info':
      return <Info size={20} />;
  }
};

interface ToastProps {
  notification: Notification;
}

const Toast: React.FC<ToastProps> = ({ notification }) => {
  const { removeNotification } = useNotificationStore();
  const [isExiting, setIsExiting] = React.useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      removeNotification(notification.id);
    }, 300);
  };

  return (
    <ToastItem $type={notification.type} $isExiting={isExiting}>
      <IconWrapper $type={notification.type}>
        {getIcon(notification.type)}
      </IconWrapper>
      <ToastMessage>{notification.message}</ToastMessage>
      <CloseButton onClick={handleClose}>
        <X size={16} />
      </CloseButton>
    </ToastItem>
  );
};

export const ToastProvider: React.FC = () => {
  const { notifications } = useNotificationStore();

  return (
    <ToastContainer>
      {notifications.map((notification) => (
        <Toast key={notification.id} notification={notification} />
      ))}
    </ToastContainer>
  );
};
