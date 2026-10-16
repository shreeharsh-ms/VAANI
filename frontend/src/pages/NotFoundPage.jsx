import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import Container from '../components/layout/Container';
import Button from '../components/common/Button';
import { ROUTES } from '../constants';

export const NotFoundPage = () => {
  return (
    <div className="py-20">
      <Container>
        <div className="max-w-md mx-auto text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 flex items-center justify-center mx-auto">
            <FileQuestion className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Page Not Found
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            The page you requested does not exist or has been moved to a new route.
          </p>
          <div className="pt-4">
            <Link to={ROUTES.HOME}>
              <Button variant="primary" size="md" startIcon={ArrowLeft}>
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default NotFoundPage;
