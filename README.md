# Daycare Invoice Management System

A modern, single-page React application for comprehensive daycare invoice management. Built with **React**, **TypeScript**, and **styled-components**, this system offers a dynamic and intuitive interface for creating, managing, and tracking invoices, clients, and company profiles.

## Features

- **Invoice Generation**: Create invoices with live preview, dynamic line items, and automatic calculations
- **Client Management**: Full CRUD operations for managing daycare clients
- **Invoice History**: Searchable and sortable table of all past invoices
- **Local Storage**: All data persists client-side using browser's localStorage
- **Responsive Design**: Clean, modern UI built with styled-components
- **Type-Safe**: Built with TypeScript for better development experience

## Tech Stack

- **React 18+** with TypeScript
- **Vite** for fast development and building
- **styled-components** for component-level styling
- **Zustand** with persistence for state management
- **React Router** for navigation
- **Lucide React** for icons

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── common/         # Reusable UI components (Button, Input, Modal, etc.)
│   ├── invoice/        # Invoice-specific components
│   └── layout/         # Layout components (Sidebar, Layout)
├── contexts/           # Zustand store for state management
├── hooks/              # Custom React hooks
├── pages/              # Page components (Dashboard, NewInvoice, etc.)
├── styles/             # Theme and global styles
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Usage

1. **Set Up Company Profile**: Navigate to Settings to add your company information
2. **Add Clients**: Go to Clients page to create client records
3. **Create Invoice**: Use the New Invoice page to generate invoices with live preview
4. **View History**: Check Invoice History to manage past invoices

## Data Storage

All data is stored in the browser's localStorage, ensuring:
- Complete privacy (no server-side storage)
- Fast performance
- Works offline
- No backend costs

## Future Enhancements

- PDF export functionality
- Data import/export for backup
- Analytics dashboard
- PWA support for offline access
