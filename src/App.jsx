import React from 'react';
import {
  BrowserRouter, Routes, Route, Navigate,
} from 'react-router-dom';
import Login from './components/login';
import AdminHome from './components/admin/home';
import InterviewHome from './components/interview/home';

import './App.scss';
import { getFromLs } from './shared/utils';

function ProtectedRoute({ children }) {
  const token = getFromLs('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><AdminHome /></ProtectedRoute>} />
        <Route path="/interview" element={<InterviewHome />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
