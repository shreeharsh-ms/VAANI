import React, { useState } from 'react';
import { Mail, Lock, LogIn } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export const LoginForm = ({ onSuccess }) => {
  const { login } = useAuth();
  const { notify } = useNotification();
  const [email, setEmail] = useState('palak@vaaniclinic.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(email, password);
      notify.success(`Welcome back, ${data.user.name}!`);
      if (onSuccess) onSuccess(data);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check credentials.');
      notify.error('Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert variant="danger">{error}</Alert>}

      <Input
        label="Staff Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="doctor@vaaniclinic.com"
        startIcon={Mail}
        required
      />

      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        startIcon={Lock}
        required
      />

      <div className="flex items-center justify-between text-xs text-gray-500">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            defaultChecked
            className="rounded text-teal-600 focus:ring-teal-500 border-gray-300"
          />
          <span>Remember this session</span>
        </label>
        <span className="text-teal-600 hover:underline cursor-pointer">
          Forgot password?
        </span>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        isLoading={loading}
        startIcon={LogIn}
      >
        Sign In to Clinic ERP
      </Button>

      <div className="p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-200 dark:border-gray-800 text-xs text-gray-500 space-y-1">
        <p className="font-semibold text-gray-700 dark:text-gray-300">Demo Credentials:</p>
        <p>• Owner: <span className="font-mono text-teal-600">palak@vaaniclinic.com</span> / <span className="font-mono">password123</span></p>
        <p>• Reception: <span className="font-mono text-teal-600">reception@vaaniclinic.com</span> / <span className="font-mono">password123</span></p>
      </div>
    </form>
  );
};

export default LoginForm;
