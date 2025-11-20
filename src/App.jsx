import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register'; // Ensure this file exists
import MainApp from './components/MainApp'; // This is the file you created in Step A

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

export default function App() {
  return (
    <AuthProvider>
       <Routes>
         <Route path="/login" element={<Login />} />
         <Route path="/register" element={<Register />} />
         
         {/* When Login.jsx calls navigate('/dashboard'), it comes here */}
         <Route 
           path="/dashboard" 
           element={
             <ProtectedRoute>
               <MainApp /> 
             </ProtectedRoute>
           } 
         />

         <Route path="*" element={<Navigate to="/dashboard" replace />} />
       </Routes>
    </AuthProvider>
  );
}