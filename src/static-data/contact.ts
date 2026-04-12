// src/static-data/contact.ts
import { Mail, MapPin, Phone } from 'lucide-react';

export const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'info@chosenfintech.org',
    href: 'mailto:info@chosenfintech.org',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+(233) 554424696',
    href: 'tel:+233554424696',
  },
  {
    icon: MapPin,
    label: 'Address',
    value: 'GPS: NT-0198-9161, Nakoha St. Kakpagyili, Tamale - Ghana',
    href: null,
  },
];
