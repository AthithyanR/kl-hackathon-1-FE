import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';

import Login from './components/login';

import './app.scss';
import { getFromLs } from './shared/utils';
import NotFound from './components/not-found';
import Main from './components/main';
import Questions from './components/questions';
import ScheduleInterview from './components/schedule-interview';

const queryClient = new QueryClient();

function ProtectedRoute() {
  const token = getFromLs('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

function UnProtectedRoute() {
  const token = getFromLs('token');

  if (token) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider withNormalizeCSS withGlobalStyles>
        <NotificationsProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<UnProtectedRoute />}>
                <Route path="/login" element={<Login />} />
              </Route>
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Main />}>
                  <Route path="/questions" element={<Questions />} />
                  <Route path="/schedule-interview" element={<ScheduleInterview />} />
                </Route>
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </NotificationsProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;
