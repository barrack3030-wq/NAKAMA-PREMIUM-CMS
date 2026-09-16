import React, { useState } from 'react';
import { useCms } from '../cms/CmsContext';
import {
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface ReservationSectionProps {
  onOpenCmsReservations?: () => void;
}

export const ReservationSection: React.FC<ReservationSectionProps> = ({
  onOpenCmsReservations
}) => {
  const { addCollectionItem, siteSettings } = useCms();

  const [guestName, setGuestName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState('2026-09-22');
  const [time, setTime] = useState('10:30');
  const [seatingArea, setSeatingArea] = useState('Main Roastery Hall');
  const [specialRequests, setSpecialRequests] = useState('');
  const [submittedBooking, setSubmittedBooking] = useState<any | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const bookingId = `res-${Date.now().toString().slice(-4)}`;
    const newReservation = {
      id: bookingId,
      guestName,
      email,
      phone,
      guests: Number(guests),
      date,
      time,
      seatingArea,
      specialRequests,
      status: 'Confirmed'
    };

    // Store directly into the CMS content collections
    addCollectionItem('reservation', newReservation);
    setSubmittedBooking(newReservation);
  };

  return (
    <section id="reserve" className="py-20 lg:py-28 bg-white text-neutral-900 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Info Column */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Reserve Your Table
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 leading-tight">
              Join us for morning brunch or an afternoon cupping flight.
            </h2>

            <p className="text-sm text-neutral-600 leading-relaxed">
              We reserve a portion of our roastery hall and sunlit patio for advance table bookings. Walk-ins are always welcomed at our express pour-over bar.
            </p>

            <div className="space-y-3 pt-2 text-xs text-neutral-600">
              <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Instant confirmation stored in your local CMS collection</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <Users className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Large groups (6+) hosted in our mezzanine tasting alcove</span>
              </div>
            </div>

            <div className="pt-4 text-xs text-neutral-500">
              Need immediate assistance? Call us directly at{' '}
              <a href={`tel:${siteSettings.contact.phone}`} className="font-semibold text-neutral-900 underline">
                {siteSettings.contact.phone}
              </a>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7">
            <div className="bg-neutral-50 rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-sm">
              {submittedBooking ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-neutral-900">
                    Table Reserved Successfully!
                  </h3>
                  <p className="text-xs text-neutral-600 max-w-md mx-auto leading-relaxed">
                    Thank you, <span className="font-semibold text-neutral-900">{submittedBooking.guestName}</span>. Your booking reference is{' '}
                    <span className="font-mono font-bold text-amber-800">{submittedBooking.id}</span> for{' '}
                    <span className="font-semibold text-neutral-900">{submittedBooking.guests} guests</span> on{' '}
                    <span className="font-semibold text-neutral-900">{submittedBooking.date} at {submittedBooking.time}</span>.
                  </p>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSubmittedBooking(null)}
                      className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-200 rounded-lg transition-colors"
                    >
                      Make Another Reservation
                    </button>

                    {onOpenCmsReservations && (
                      <button
                        type="button"
                        onClick={onOpenCmsReservations}
                        className="px-4 py-2 text-xs font-medium bg-amber-700 hover:bg-amber-800 text-white rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        View in CMS Reservations
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-base font-bold text-neutral-900 mb-2">
                    Table Reservation Details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-700 mb-1">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="e.g. Eleanor Vance"
                        className="w-full px-3.5 py-2 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-700 mb-1">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full px-3.5 py-2 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-700 mb-1">
                        Party Size
                      </label>
                      <select
                        value={guests}
                        onChange={(e) => setGuests(parseInt(e.target.value, 10))}
                        className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-900"
                      >
                        {[1, 2, 3, 4, 5, 6, 8, 10].map(n => (
                          <option key={n} value={n}>
                            {n} {n === 1 ? 'Guest' : 'Guests'}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-700 mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-700 mb-1">
                        Time
                      </label>
                      <select
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-900"
                      >
                        <option value="08:00">8:00 AM</option>
                        <option value="09:30">9:30 AM</option>
                        <option value="10:30">10:30 AM</option>
                        <option value="11:30">11:30 AM</option>
                        <option value="13:00">1:00 PM</option>
                        <option value="14:30">2:30 PM</option>
                        <option value="16:00">4:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-700 mb-1">
                        Seating Preference
                      </label>
                      <select
                        value={seatingArea}
                        onChange={(e) => setSeatingArea(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-900"
                      >
                        <option value="Main Roastery Hall">Main Roastery Hall</option>
                        <option value="Sunlit Patio">Sunlit Patio</option>
                        <option value="Espresso Bar High-Tops">Espresso Bar High-Tops</option>
                        <option value="Quiet Mezzanine">Quiet Mezzanine</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-700 mb-1">
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-3.5 py-2 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">
                      Dietary Notes or Special Occasions
                    </label>
                    <textarea
                      rows={2}
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="e.g. Anniversary celebration, celebrating birthday, dairy allergy..."
                      className="w-full px-3.5 py-2 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-900 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-sm font-semibold tracking-wide shadow-xs transition-colors cursor-pointer mt-2"
                  >
                    Confirm Table Reservation
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
