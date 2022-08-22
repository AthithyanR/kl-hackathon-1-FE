import React from 'react';
import {
  BrowserRouter, Routes, Route, Navigate,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';

import Login from './components/login';
import AdminHome from './components/admin/home';
import InterviewHome from './components/interview/home';

import './App.scss';
import { getFromLs } from './shared/utils';

const queryClient = new QueryClient();

function ProtectedRoute({ children }) {
  const token = getFromLs('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider withNormalizeCSS withGlobalStyles>
        <NotificationsProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={(
                  <ProtectedRoute>
                    <AdminHome />
                  </ProtectedRoute>
                )}
              />
              <Route path="/interview" element={<InterviewHome />} />
            </Routes>
          </BrowserRouter>
        </NotificationsProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;
