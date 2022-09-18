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

import { getFromLs } from './shared/utils';
import Login from './components/login';
import NotFound from './components/not-found';
import Main from './components/main';
// import Questions from './components/questions';
import ScheduleInterview from './components/schedule-interview';
import TechTypes from './components/settings/techTypes';

import './styles/index.scss';
import Demo from './components/allocation';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
});

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
                  <Route path="/questions" element={<TechTypes />} />
                  <Route path="/schedule-interview" element={<ScheduleInterview />} />
                  <Route path="/demo" element={<Demo />} />
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
