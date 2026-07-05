import React from 'react';

// Bolsa triste del estado vacío
export const SadBag = ({ className }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M60 60V50C60 30 75 15 100 15C125 15 140 30 140 50V60" stroke="#E63946" strokeWidth="8" strokeLinecap="round"/>
    <rect x="45" y="60" width="110" height="110" rx="15" fill="#2D2927"/>
    <path d="M45 75L155 75" stroke="#35312F" strokeWidth="4"/>
    <circle cx="80" cy="110" r="4" fill="#F4A261"/>
    <circle cx="120" cy="110" r="4" fill="#F4A261"/>
    <path d="M85 140C90 135 110 135 115 140" stroke="#F4A261" strokeWidth="3" strokeLinecap="round"/>
    <path d="M75 100L85 105" stroke="#F4A261" strokeWidth="2"/>
    <path d="M125 100L115 105" stroke="#F4A261" strokeWidth="2"/>
  </svg>
);

// Canasta con monedas del banner superior
export const BasketPromo = ({ className }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="150" cy="50" r="15" fill="#F59E0B" opacity="0.5"/>
    <circle cx="170" cy="80" r="10" fill="#F59E0B" opacity="0.3"/>
    <rect x="40" y="80" width="120" height="80" rx="10" fill="#E63946" opacity="0.9"/>
    <path d="M50 80V60C50 45 65 35 100 35C135 35 150 45 150 60V80" stroke="white" strokeWidth="8"/>
    <rect x="150" y="100" width="30" height="45" rx="5" fill="#FFB800" transform="rotate(15 150 100)"/>
    <circle cx="160" cy="110" r="3" fill="#B45309"/>
  </svg>
);
