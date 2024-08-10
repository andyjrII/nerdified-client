import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthProvider';
import { StudentProvider } from './context/StudentProvider';
import { AdminProvider } from './context/AdminProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <AdminProvider>
        <StudentProvider>
          <Routes>
            <Route path='/*' element={<App />} />
          </Routes>
        </StudentProvider>
      </AdminProvider>
    </AuthProvider>
  </BrowserRouter>
);
