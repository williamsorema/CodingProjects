import React from 'react';
import './App.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import DashBoard from './pages/DashboardPage';
import QuestionPage from './pages/QuestionPage';
import ForgotPassword from './pages/ForgotPassword';
import CheckEmailPage from './pages/CheckEmailPage';
import AboutUsPage from './pages/AboutUsPage';
import PasswordResetPage from './pages/PasswordResetPage';
import VerifiedPage from './pages/VerifiedPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" index element={<HomePage />} />
        <Route path="/login" index element={<LoginPage />} />
        <Route path="/signup" index element={<SignupPage />} />
        <Route path="/landing" index element={<DashBoard />} />
        <Route path="/Questions" index element={<QuestionPage />} />
        <Route path="/PassRecover" index element={<ForgotPassword />} />
        <Route path="/CheckEmail" index element={<CheckEmailPage />} />
        <Route path="/aboutUs" index element={<AboutUsPage />}/>
        <Route path="/reset/:token" index element={<PasswordResetPage />}/>
        <Route path="/verified/:result" index element={<VerifiedPage />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
