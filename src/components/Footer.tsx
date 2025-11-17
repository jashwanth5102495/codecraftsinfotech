import React from 'react';
import './SoftPro.css'
import { brandName } from '@/brand';

const Footer = () => (
  <footer className="mt-24 text-white/60">
    <div className="container mx-auto px-6 py-10 border-t border-white/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-white/10 ring-1 ring-white/20 flex items-center justify-center text-sm">◎</div>
          <span className="font-semibold tracking-wide text-white">{brandName}</span>
        </div>
        <p className="text-xs">© {new Date().getFullYear()} {brandName} — All rights reserved.</p>
      </div>

      {/* Contact & Offices */}
      <div className="mt-6 grid sm:grid-cols-2 gap-6 text-sm">
        <div>
          <div className="text-white/80 font-medium">Contact</div>
          <a href="mailto:info@codecraftsinfotech.in" className="text-white/90 hover:text-white">info@codecraftsinfotech.in</a>
        </div>
        <div>
          <div className="text-white/80 font-medium">Office</div>
          <div className="text-white/90">Hyderabad, Telangana — India</div>
          <div className="text-white/90">Austin, Texas — USA</div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;