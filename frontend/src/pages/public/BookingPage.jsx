import React from 'react';
import Container from '../../components/layout/Container';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import AppointmentForm from '../../components/forms/AppointmentForm';
import { Clock, Phone, MapPin, CheckCircle } from 'lucide-react';
import { APP_CONFIG } from '../../constants';

export const BookingPage = () => {
  return (
    <div className="py-10">
      <Container>
        <PageHeader
          title="Book an Appointment"
          subtitle="Reserve a consultation slot for audiology diagnostics or speech-language therapy."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <Card className="p-6 sm:p-8">
              <AppointmentForm />
            </Card>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <Card className="p-6 space-y-4">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Before Your Visit
              </h3>
              <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-2.5">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                  <span>Please bring prior ENT discharge summaries, previous audiograms, or school reports.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                  <span>For pediatric speech assessments, allow 45-60 minutes for relaxed observation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                  <span>Ensure ears are free of severe wax blockage for pure tone and OAE tests.</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6 space-y-3 bg-teal-50/50 dark:bg-teal-950/20 border-teal-200 dark:border-teal-900">
              <h4 className="text-sm font-semibold text-teal-900 dark:text-teal-200">
                Clinic Details & Support
              </h4>
              <p className="text-xs text-teal-700 dark:text-teal-400 flex items-center gap-2">
                <Phone className="w-3.5 h-3.5" />
                <span>Direct Reception: {APP_CONFIG.phone}</span>
              </p>
              <p className="text-xs text-teal-700 dark:text-teal-400 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>{APP_CONFIG.location}</span>
              </p>
              <p className="text-xs text-teal-700 dark:text-teal-400 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" />
                <span>{APP_CONFIG.workingHours}</span>
              </p>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default BookingPage;
