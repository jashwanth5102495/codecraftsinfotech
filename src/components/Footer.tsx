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
    </div>
  </footer>
);

export default Footer;