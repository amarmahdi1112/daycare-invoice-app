# Authentication System

## Overview
Complete authentication system with login, signup, and protected routes.

## Features

### 1. User Authentication
- **Login**: Existing users can sign in with email/password
- **Signup**: New users can create accounts
- **Session Persistence**: User sessions persist across browser refreshes
- **Auto-redirect**: Logged-in users redirected to dashboard, logged-out users to login

### 2. Protected Routes
All main app routes are protected and require authentication:
- Dashboard (`/`)
- New Invoice (`/new-invoice`)
- Invoice History (`/history`)
- Clients (`/clients`)
- Settings (`/settings`)

### 3. User Interface
- **Login Page**: Clean, modern login form with gradient background
- **Signup Page**: Account creation with password confirmation
- **Sidebar User Info**: Displays logged-in user's name and email
- **Logout Button**: Easy logout from sidebar

### 4. Security Features
- Password minimum length (6 characters)
- Password confirmation on signup
- Email uniqueness check
- Session management with Zustand persist
- Protected route guards

## How to Use

### First Time Setup
1. Open the app - you'll be redirected to `/login`
2. Click "Sign up" to create an account
3. Fill in:
   - Full Name
   - Email Address
   - Password (min 6 characters)
   - Confirm Password
4. Click "Create Account"
5. You'll be automatically logged in and redirected to the dashboard

### Returning Users
1. Open the app
2. Enter your email and password
3. Click "Sign In"
4. Access all features

### Logout
- Click the red "Logout" button at the bottom of the sidebar
- You'll be logged out and redirected to the login page

## Data Storage

### User Credentials
- Stored in browser's localStorage under key: `invoice-app-users`
- **Note**: In production, use a real backend with encrypted passwords

### User Session
- Stored in localStorage under key: `auth-storage`
- Persists across browser sessions
- Cleared on logout

### Invoice Data
- Stored per user session
- Data is tied to the logged-in user
- **Note**: Currently all users share the same invoice data. To separate by user, you'd need to modify the store to include user ID filtering.

## Components

### New Files
- `src/contexts/authStore.ts` - Authentication state management
- `src/pages/Login.tsx` - Login page
- `src/pages/Signup.tsx` - Signup/registration page
- `src/components/common/ProtectedRoute.tsx` - Route protection HOC

### Modified Files
- `src/App.tsx` - Added auth routes and route protection
- `src/components/layout/Sidebar.tsx` - Added user info and logout button

## Password Requirements
- Minimum 6 characters
- Must match confirmation (signup only)

## Future Enhancements
- Password reset functionality
- Email verification
- OAuth integration (Google, etc.)
- Per-user data isolation
- Backend API integration
- Encrypted password storage
- Session timeout
- Remember me functionality
