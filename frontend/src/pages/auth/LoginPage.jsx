import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginForm from '../../components/forms/LoginForm';
import { ROUTES } from '../../constants';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSuccess = () => {
    const origin = location.state?.from?.pathname || ROUTES.DASHBOARD.HOME;
    navigate(origin, { replace: true });
  };

  return <LoginForm onSuccess={handleSuccess} />;
};

export default LoginPage;
