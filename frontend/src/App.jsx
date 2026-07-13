import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AccountVerify from './components/AccountVerify';
import Dashboard from './components/Dashboard'; 
import ContestEngine from './components/ContestEngine';
import QuestionEngine from './components/QuestionEngine';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AccountVerify />} />
        
  
        <Route path="/dashboard" element={<Dashboard />} />
        
        
        <Route path="/contest" element={<ContestEngine />} />
        
        <Route path="/questions" element={<QuestionEngine />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}