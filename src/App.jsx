import React, { Suspense } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoadingOverlay, MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';

import { getFromLs } from './shared/utils';
import NotFound from './components/not-found';

import './styles/index.scss';
import { TOKEN_NAME } from './shared/constant-values';

const Login = React.lazy(() => import('./components/login'));
const Main = React.lazy(() => import('./components/main'));
const ScheduleAssessment = React.lazy(() => import('./components/schedule-assessment'));
const Questions = React.lazy(() => import('./components/questions'));
const TechTypes = React.lazy(() => import('./components/settings/techTypes'));
const Assessment = React.lazy(() => import('./components/assessment'));

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
  const token = getFromLs(TOKEN_NAME);

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

function UnProtectedRoute() {
  const token = getFromLs(TOKEN_NAME);

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
          <Suspense fallback={<LoadingOverlay visible overlayBlur={2} />}>
            <BrowserRouter>
              <Routes>
                <Route path="/assessment" element={<Assessment />} />
                <Route element={<UnProtectedRoute />}>
                  <Route path="/login" element={<Login />} />
                </Route>
                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<Main />}>
                    <Route path="/schedule-assessment" element={<ScheduleAssessment />} />
                    <Route path="/questions" element={<Questions />} />
                    <Route path="/tech-types" element={<TechTypes />} />
                  </Route>
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </Suspense>
        </NotificationsProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;
