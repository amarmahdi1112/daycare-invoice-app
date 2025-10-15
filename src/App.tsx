import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import { GlobalStyles } from './styles/GlobalStyles';
import { Layout } from './components/layout/Layout';
import { ToastProvider } from './components/common/Toast';
import { Dashboard } from './pages/Dashboard';
import { NewInvoice } from './pages/NewInvoice';
import { InvoiceHistory } from './pages/InvoiceHistory';
import { Clients } from './pages/Clients';
import { Settings } from './pages/Settings';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/new-invoice" element={<NewInvoice />} />
            <Route path="/history" element={<InvoiceHistory />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </Router>
      <ToastProvider />
    </ThemeProvider>
  );
}

export default App;
