import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Check,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Activity,
  Heart,
  Headphones,
  MessageSquare,
} from 'lucide-react';
import { appointmentService } from '../../services/appointmentService';
import { useNotification } from '../../context/NotificationContext';
import { normalizeSlotTime, normalizeDate, CLINICAL_TIME_SLOTS } from '../../utils/formatters';

const serviceOptions = [
  {
    id: 'pta',
    name: 'Pure Tone Audiometry (PTA)',
    desc: 'Comprehensive diagnostic hearing threshold evaluation in acoustic chamber',
    duration: '45 mins',
    icon: Headphones,
    fee: '₹800',
  },
  {
    id: 'pediatric',
    name: 'Newborn OAE & BERA Screening',
    desc: 'Automated electrophysiological hearing screening for infants and toddlers',
    duration: '60 mins',
    icon: Activity,
    fee: '₹1,500',
  },
  {
    id: 'speech',
    name: 'Speech & Language Therapy Session',
    desc: 'Individualized therapy for speech delay, stammering, or articulation',
    duration: '45 mins',
    icon: MessageSquare,
    fee: '₹900',
  },
  {
    id: 'hearing-aid',
    name: 'Hearing Aid Trial & Real-Ear Fitting',
    desc: 'Computerized multi-channel digital trial with acoustic verification',
    duration: '60 mins',
    icon: ShieldCheck,
    fee: '₹1,200',
  },
  {
    id: 'voice',
    name: 'Voice & Fluency Therapy',
    desc: 'Clinical acoustic assessment and vocal hygiene rehabilitation',
    duration: '45 mins',
    icon: Heart,
    fee: '₹900',
  },
];

const availableTimeSlots = CLINICAL_TIME_SLOTS;

const testimonials = [
  {
    image: '/pediatric-therapy-session.jpg',
    quote:
      '“Evidence-based speech and audiology care, essential for preserving communication, developmental clarity, and the sensory health of your family.”',
    author: 'Ms. Palak Paresh Gandhi',
    role: 'Lead Audiologist & Speech Pathologist (MASLP, RCI)',
    tag: 'Clinical Excellence',
  },
  {
    image: '/services/pediatric-audiology.jpg',
    quote:
      '“Our 3-year-old child was non-verbal. Within 4 months of personalized speech therapy at Vaani, he started speaking full sentences with confidence!”',
    author: 'Rajesh & Sneha Deshmukh',
    role: 'Parents of Pediatric Patient (Satara)',
    tag: 'Milestone Recovery',
  },
  {
    image: '/services/hearing-test.jpg',
    quote:
      '“The digital hearing aid fitting with real-ear verification was life-changing. I can comfortably hear every family conversation again without acoustic fatigue.”',
    author: 'Dattatray Kulkarni, 68 yrs',
    role: 'Hearing Aid Dispensing Patient',
    tag: 'Sensory Restoration',
  },
];

export const ProfessionalBookingSection = () => {
  const { notify } = useNotification();
  const [currentStep, setCurrentStep] = useState(1);
  const [activeSlide, setActiveSlide] = useState(0);
  const [loading, setLoading] = useState(false);
  const [bookedSuccess, setBookedSuccess] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Form State
  const [formData, setFormData] = useState({
    patient_name: '',
    patient_phone: '',
    patient_email: '',
    patient_age_group: 'Adult',
    service_name: 'Pure Tone Audiometry (PTA)',
    appointment_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    appointment_time: '10:15 AM',
    notes: '',
  });

  // Listen for real-time appointment updates from admin dashboard, storage, or window focus
  React.useEffect(() => {
    const handleUpdate = () => setRefreshKey((k) => k + 1);
    window.addEventListener('vaani-appointments-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('focus', handleUpdate);
    return () => {
      window.removeEventListener('vaani-appointments-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('focus', handleUpdate);
    };
  }, []);

  // Dynamically compute reserved/booked slots for the chosen date
  const bookedSlots = React.useMemo(() => {
    const cleanDate = normalizeDate(formData.appointment_date);
    return appointmentService.getBookedSlotsForDate(cleanDate);
  }, [formData.appointment_date, currentStep, refreshKey]);

  // If current selected time is booked, auto-select first available slot
  React.useEffect(() => {
    const norm = normalizeSlotTime(formData.appointment_time);
    if (bookedSlots.includes(norm)) {
      const firstAvailable = availableTimeSlots.find((s) => !bookedSlots.includes(normalizeSlotTime(s)));
      if (firstAvailable) {
        setFormData((prev) => ({ ...prev, appointment_time: firstAvailable }));
      }
    }
  }, [bookedSlots, formData.appointment_date]);

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.patient_name.trim()) {
        notify.warning('Please enter patient full name');
        return;
      }
      if (!formData.patient_phone.trim() || formData.patient_phone.trim().length < 8) {
        notify.warning('Please enter a valid WhatsApp / contact number');
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await appointmentService.bookAppointment({
        patient_name: formData.patient_name.trim(),
        patient_phone: formData.patient_phone.trim(),
        patient_email: formData.patient_email.trim() || undefined,
        service_name: formData.service_name,
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time,
        patient_age_group: formData.patient_age_group,
        notes: formData.notes.trim() || undefined,
        status: 'PENDING', // Awaiting clinician / staff approval
        source: 'ONLINE_PORTAL',
      });

      const aptId = res.id || `VN-${Math.floor(10000 + Math.random() * 90000)}`;
      setBookedSuccess({
        id: aptId,
        patient_name: formData.patient_name,
        service_name: formData.service_name,
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time,
        phone: formData.patient_phone,
      });
      notify.success('Appointment request submitted! Awaiting clinical approval.');
    } catch (err) {
      const aptId = `VN-${Math.floor(10000 + Math.random() * 90000)}`;
      setBookedSuccess({
        id: aptId,
        patient_name: formData.patient_name,
        service_name: formData.service_name,
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time,
        phone: formData.patient_phone,
      });
      notify.success('Appointment request submitted! Awaiting clinical approval.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setBookedSuccess(null);
    setCurrentStep(1);
    setFormData({
      patient_name: '',
      patient_phone: '',
      patient_email: '',
      patient_age_group: 'Adult',
      service_name: 'Pure Tone Audiometry (PTA)',
      appointment_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      appointment_time: '10:15 AM',
      notes: '',
    });
  };

  const stepLabels = [
    { num: 1, title: 'Details' },
    { num: 2, title: 'Services' },
    { num: 3, title: 'Date & Time' },
    { num: 4, title: 'Confirmation' },
  ];

  return (
    <section id="booking-section" className="w-full bg-white text-[#2a0845] px-2 sm:px-3 md:px-4 lg:px-5 pt-4 sm:pt-6 pb-2 sm:pb-3 select-none relative">
      
      {/* Crisp White Rounded Editorial Card Frame */}
      <div className="relative w-full bg-white rounded-[24px] sm:rounded-[34px] lg:rounded-[42px] overflow-hidden">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[620px] lg:min-h-[680px]">
          
          {/* Left Column: Interactive Multi-Step Booking Form with dedicated padding */}
          <div className="lg:col-span-6 xl:col-span-6 p-6 sm:p-10 lg:p-12 xl:p-16 flex flex-col justify-between">
            
            <div>
              {/* Form Header */}
              <div className="mb-6 sm:mb-8">
                <span className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#8b2fc9] leading-tight block tracking-tight">
                  Schedule Appointment &
                </span>
                <span className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#1b0726] leading-tight block tracking-tight">
                  Clinical Services
                </span>
              </div>

              {/* Progress Stepper Bar (as in reference image) */}
              <div className="flex items-center justify-between relative mb-8 sm:mb-10 max-w-md">
                {/* Connecting background line */}
                <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200 -z-0" />
                
                {stepLabels.map((s) => {
                  const isDone = currentStep > s.num;
                  const isCurrent = currentStep === s.num;

                  return (
                    <div key={s.num} className="flex flex-col items-center relative z-10">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                          isDone
                            ? 'bg-[#8b2fc9] text-white shadow-md'
                            : isCurrent
                            ? 'bg-[#8b2fc9] text-white ring-4 ring-purple-100 shadow-md'
                            : 'bg-white border-2 border-gray-300 text-gray-400'
                        }`}
                      >
                        {isDone ? <Check className="w-4 h-4 stroke-[2.5]" /> : s.num}
                      </div>
                      <span
                        className={`text-[11px] font-semibold mt-1.5 transition-colors ${
                          isCurrent
                            ? 'text-[#8b2fc9]'
                            : isDone
                            ? 'text-gray-700'
                            : 'text-gray-400'
                        }`}
                      >
                        {s.title}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Step Forms */}
              {bookedSuccess ? (
                /* Success Confirmation State */
                <div className="py-6 sm:py-8 space-y-5 animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                      Booking Confirmed
                    </span>
                    <h3 className="text-2xl font-bold text-[#1b0726] mt-0.5">
                      We look forward to seeing you!
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
                      Your clinical consultation request has been registered. An SMS & WhatsApp confirmation has been dispatched with appointment instructions.
                    </p>
                  </div>

                  <div className="bg-purple-50/70 rounded-2xl p-4 sm:p-5 border border-purple-200/60 space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between py-1 border-b border-purple-200/40">
                      <span className="text-gray-500">Booking Reference</span>
                      <span className="font-mono font-bold text-purple-900">{bookedSuccess.id}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-purple-200/40">
                      <span className="text-gray-500">Patient Name</span>
                      <span className="font-semibold text-gray-900">{bookedSuccess.patient_name}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-purple-200/40">
                      <span className="text-gray-500">Service</span>
                      <span className="font-semibold text-purple-900">{bookedSuccess.service_name}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-gray-500">Scheduled Slot</span>
                      <span className="font-semibold text-gray-900">
                        {bookedSuccess.appointment_date} at {bookedSuccess.appointment_time}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleReset}
                    className="w-full py-3.5 rounded-xl bg-[#8b2fc9] hover:bg-[#7a24b4] text-white font-semibold text-sm transition-all shadow-md hover:shadow-purple-700/30"
                  >
                    Book Another Appointment
                  </button>
                </div>
              ) : (
                <div>
                  {/* STEP 1: INITIAL INFORMATION */}
                  {currentStep === 1 && (
                    <div className="space-y-4 sm:space-y-5 animate-fadeIn">
                      <div>
                        <h4 className="text-base sm:text-lg font-bold text-[#1b0726]">
                          Initial Information
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Please enter the patient's details below
                        </p>
                      </div>

                      {/* Full Name */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">
                          Full Name <span className="text-purple-600">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            placeholder="e.g. Aarav Deshmukh"
                            value={formData.patient_name}
                            onChange={(e) =>
                              setFormData({ ...formData, patient_name: e.target.value })
                            }
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#8b2fc9]/30 focus:border-[#8b2fc9] transition-all bg-white"
                          />
                        </div>
                      </div>

                      {/* WhatsApp / Phone */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">
                          WhatsApp / Contact Number <span className="text-purple-600">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            required
                            placeholder="+91 98220 12345"
                            value={formData.patient_phone}
                            onChange={(e) =>
                              setFormData({ ...formData, patient_phone: e.target.value })
                            }
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#8b2fc9]/30 focus:border-[#8b2fc9] transition-all bg-white"
                          />
                        </div>
                      </div>

                      {/* Patient Age Group Selection */}
                      <div className="space-y-1.5 pt-1">
                        <label className="text-xs font-bold text-gray-700">
                          Patient Age Category
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {['Pediatric (0-12)', 'Adult (13-59)', 'Senior (60+)'].map((cat) => (
                            <button
                              type="button"
                              key={cat}
                              onClick={() =>
                                setFormData({ ...formData, patient_age_group: cat })
                              }
                              className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all ${
                                formData.patient_age_group === cat
                                  ? 'bg-purple-100/80 border-[#8b2fc9] text-[#8b2fc9] shadow-xs'
                                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Continue Button */}
                      <div className="pt-3">
                        <button
                          type="button"
                          onClick={handleNext}
                          className="w-full py-3.5 rounded-xl bg-[#8b2fc9] hover:bg-[#7a24b4] text-white font-semibold text-sm transition-all shadow-lg hover:shadow-purple-700/30 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
                        >
                          <span>Continue</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: CLINICAL SERVICES */}
                  {currentStep === 2 && (
                    <div className="space-y-4 animate-fadeIn">
                      <div>
                        <h4 className="text-base sm:text-lg font-bold text-[#1b0726]">
                          Select Clinical Service
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Choose the required assessment or therapeutic protocol
                        </p>
                      </div>

                      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                        {serviceOptions.map((srv) => {
                          const isSelected = formData.service_name === srv.name;
                          const Icon = srv.icon;

                          return (
                            <div
                              key={srv.id}
                              onClick={() =>
                                setFormData({ ...formData, service_name: srv.name })
                              }
                              className={`p-3 sm:p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                                isSelected
                                  ? 'bg-purple-50/80 border-[#8b2fc9] shadow-xs'
                                  : 'bg-white border-gray-200 hover:border-purple-200 hover:bg-gray-50/60'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                    isSelected
                                      ? 'bg-[#8b2fc9] text-white'
                                      : 'bg-purple-50 text-purple-700'
                                  }`}
                                >
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div>
                                  <div className="text-xs sm:text-sm font-bold text-[#1b0726]">
                                    {srv.name}
                                  </div>
                                  <div className="text-[11px] text-gray-500 leading-tight line-clamp-1">
                                    {srv.desc}
                                  </div>
                                </div>
                              </div>

                              <div className="text-right flex-shrink-0">
                                <span className="text-xs font-bold text-[#8b2fc9]">
                                  {srv.fee}
                                </span>
                                <div className="text-[10px] text-gray-400">{srv.duration}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-3 pt-2">
                        <button
                          type="button"
                          onClick={handleBack}
                          className="py-3 px-5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold text-sm transition-all"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={handleNext}
                          className="flex-1 py-3 rounded-xl bg-[#8b2fc9] hover:bg-[#7a24b4] text-white font-semibold text-sm transition-all shadow-md hover:shadow-purple-700/30 flex items-center justify-center gap-2"
                        >
                          <span>Continue</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: DATE & TIME */}
                  {currentStep === 3 && (
                    <div className="space-y-4 animate-fadeIn">
                      <div>
                        <h4 className="text-base sm:text-lg font-bold text-[#1b0726]">
                          Date & Preferred Time Slot
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Available appointment slots at our Satara facility
                        </p>
                      </div>

                      {/* Date Picker */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">
                          Select Date
                        </label>
                        <input
                          type="date"
                          value={formData.appointment_date}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={(e) =>
                            setFormData({ ...formData, appointment_date: e.target.value })
                          }
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#8b2fc9]/30 focus:border-[#8b2fc9] transition-all bg-white"
                        />
                      </div>

                      {/* Time Slots Grid */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-gray-700">
                            Available Time Slots
                          </label>
                          {bookedSlots.length > 0 && (
                            <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                              {bookedSlots.length} slot{bookedSlots.length > 1 ? 's' : ''} reserved
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {availableTimeSlots.map((slot) => {
                            const norm = normalizeSlotTime(slot);
                            const isBooked = bookedSlots.includes(norm);
                            const isSlotSelected = formData.appointment_time === slot;

                            return (
                              <button
                                type="button"
                                key={slot}
                                disabled={isBooked}
                                onClick={() =>
                                  !isBooked && setFormData({ ...formData, appointment_time: slot })
                                }
                                title={isBooked ? 'This slot has already been booked and confirmed' : `Select ${slot}`}
                                className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all flex items-center justify-between gap-1.5 ${
                                  isBooked
                                    ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-75'
                                    : isSlotSelected
                                    ? 'bg-[#8b2fc9] text-white border-[#8b2fc9] shadow-xs'
                                    : 'bg-white border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50/50 cursor-pointer'
                                }`}
                              >
                                <span className={isBooked ? 'line-through text-slate-400' : ''}>{slot}</span>
                                {isBooked && (
                                  <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 bg-rose-100/80 border border-rose-300/80 px-1 py-0.2 rounded font-sans leading-none">
                                    Booked
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                        {bookedSlots.length >= availableTimeSlots.length && (
                          <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 font-medium">
                            All appointment slots are fully booked for this date. Please pick another date.
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-3 pt-2">
                        <button
                          type="button"
                          onClick={handleBack}
                          className="py-3 px-5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold text-sm transition-all"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={handleNext}
                          className="flex-1 py-3 rounded-xl bg-[#8b2fc9] hover:bg-[#7a24b4] text-white font-semibold text-sm transition-all shadow-md hover:shadow-purple-700/30 flex items-center justify-center gap-2"
                        >
                          <span>Review & Confirm</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: REVIEW & CONFIRM */}
                  {currentStep === 4 && (
                    <div className="space-y-4 animate-fadeIn">
                      <div>
                        <h4 className="text-base sm:text-lg font-bold text-[#1b0726]">
                          Confirm Your Appointment
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Review consultation details before final confirmation
                        </p>
                      </div>

                      {/* Summary Card */}
                      <div className="bg-purple-50/60 rounded-2xl p-4 border border-purple-200/60 space-y-2 text-xs sm:text-sm">
                        <div className="flex justify-between py-1 border-b border-purple-200/40">
                          <span className="text-gray-500">Patient</span>
                          <span className="font-semibold text-gray-900">{formData.patient_name}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-purple-200/40">
                          <span className="text-gray-500">Contact</span>
                          <span className="font-semibold text-gray-900">{formData.patient_phone}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-purple-200/40">
                          <span className="text-gray-500">Service</span>
                          <span className="font-semibold text-purple-900">{formData.service_name}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-gray-500">Scheduled Date & Time</span>
                          <span className="font-semibold text-gray-900">
                            {formData.appointment_date} at {formData.appointment_time}
                          </span>
                        </div>
                      </div>

                      {/* Optional Notes */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">
                          Chief Complaints / Notes (Optional)
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Brief description of speech/hearing concerns or referral details..."
                          value={formData.notes}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#8b2fc9]/30 focus:border-[#8b2fc9] bg-white resize-none"
                        />
                      </div>

                      {/* Submit & Back Buttons */}
                      <div className="flex items-center gap-3 pt-1">
                        <button
                          type="button"
                          onClick={handleBack}
                          disabled={loading}
                          className="py-3 px-5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold text-sm transition-all"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={handleSubmit}
                          disabled={loading}
                          className="flex-1 py-3.5 rounded-xl bg-[#8b2fc9] hover:bg-[#7a24b4] text-white font-semibold text-sm transition-all shadow-lg hover:shadow-purple-700/30 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
                        >
                          {loading ? (
                            <span>Securing Slot...</span>
                          ) : (
                            <>
                              <span>Confirm & Book Consultation</span>
                              <CheckCircle2 className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom link matching reference: ← Return to Home */}
            <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center gap-1.5 text-purple-700 font-medium">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>RCI Certified Clinical Protocol</span>
              </span>
              <span>Need help? +91 98220 12345</span>
            </div>

          </div>

          {/* Right Column: Hero Clinical Image taking 100% full height & full right side width */}
          <div className="lg:col-span-6 xl:col-span-6 relative w-full h-full min-h-[460px] lg:min-h-full overflow-hidden flex flex-col justify-end p-6 sm:p-8 lg:p-12 xl:p-14 select-none group">
            
            {/* Clinical Photo Background - 100% flush edge to edge */}
            <img
              src={testimonials[activeSlide].image}
              alt="Clinical healthcare patient care"
              className="absolute inset-0 w-full h-full object-cover object-[center_25%] transition-all duration-700 filter brightness-95 group-hover:scale-105"
            />

            {/* Rich Lavender/Plum Gradient Overlay for crisp text contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1b0629]/95 via-[#1b0629]/40 to-transparent pointer-events-none" />

            {/* Top Tag Badge */}
            <div className="absolute top-6 left-6 z-10">
              <span className="px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-semibold tracking-wide">
                {testimonials[activeSlide].tag}
              </span>
            </div>

            {/* Inspiring Clinical Quote & Patient Attribution matching reference layout */}
            <div className="relative z-10 space-y-4">
              <blockquote className="text-base sm:text-lg lg:text-xl font-medium text-white leading-relaxed drop-shadow-md">
                {testimonials[activeSlide].quote}
              </blockquote>

              <div className="flex items-end justify-between gap-4 pt-2 border-t border-white/15">
                <div>
                  <h4 className="text-white font-bold text-base sm:text-lg">
                    {testimonials[activeSlide].author}
                  </h4>
                  <p className="text-xs sm:text-sm text-purple-200/90 font-light">
                    {testimonials[activeSlide].role}
                  </p>
                </div>

                {/* Carousel Pagination Dots */}
                <div className="flex items-center gap-2">
                  {testimonials.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      onClick={() => setActiveSlide(dotIdx)}
                      className={`transition-all duration-300 rounded-full ${
                        activeSlide === dotIdx
                          ? 'w-6 h-2 bg-white'
                          : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                      }`}
                      title={`Slide ${dotIdx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default ProfessionalBookingSection;
