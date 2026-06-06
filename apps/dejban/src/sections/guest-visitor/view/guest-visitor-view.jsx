'use client';

import { useState } from 'react';
import { GuestVisitorList } from 'src/sections/guest-visitor/gridContent/guestVisitorList';
import { AppointmentList } from 'src/sections/guest-visitor/gridContent/appointmentList';

// ----------------------------------------------------------------------
export function GuestVisitor() {
  const [selectedGuestId, setSelectedGuestId] = useState(null);

  // If a guest is selected, show the Appointment List (Detail View)
  // Otherwise, show the Guest List (Master View)
  return selectedGuestId ? (
    <AppointmentList selectedGuestId={selectedGuestId} onClose={() => setSelectedGuestId(null)} />
  ) : (
    <GuestVisitorList onGuestSelect={(guest) => setSelectedGuestId(guest.id)} />
  );
}
