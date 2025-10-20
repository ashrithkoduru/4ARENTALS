import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import "@fontsource/bebas-neue";                 // defaults (400)
import "@fontsource/playfair-display/700.css";   // bold 700
import "@fontsource/space-grotesk/700.css";      // bold 700
import "@fontsource/montserrat/700.css";         // 700
import "@fontsource/poppins/700.css";            // 700
import "@fontsource/merriweather/700.css";   
import "@fontsource/noto-sans-jp/700.css";
import "@fontsource/noto-sans-kr/700.css";
import "@fontsource/ibm-plex-mono/700.css";
import "@fontsource/dancing-script/700.css";
import "@fontsource/abril-fatface";




export const Hero: React.FC = () => {
  const { currentUser } = useAuth();

  // 1) Fonts to cycle (exact family names; make sure they’re in your <head> link)
const STYLES = [
  { text: "Freedom", font: '"Bebas Neue"', lang: "en" },
  { text: "自由",     font: '"Noto Sans JP"', lang: "ja" }, // Japanese
  { text: "Freedom", font: '"Playfair Display"', lang: "en" },
  { text: "Freedom", font: '"Space Grotesk"', lang: "en" },
  { text: "Freedom", font: '"IBM Plex Mono"', lang: "en" },
  { text: "Freedom", font: '"Dancing Script"', lang: "en" },
  { text: "Freedom", font: '"Montserrat"', lang: "en" },
  { text: "자유",     font: '"Noto Sans KR"', lang: "ko" }, // Korean
];


  // 2) State
  const [fontIdx, setFontIdx] = useState(0);
  const [animateIn, setAnimateIn] = useState(true);
  const intervalRef = useRef<number | null>(null);
  const safeIdx = Number.isFinite(fontIdx) ? (fontIdx % STYLES.length + STYLES.length) % STYLES.length : 0;
const current = STYLES[safeIdx]; // { text, font, lang }


  // 3) Load fonts, then start the ticker (single effect!)
  useEffect(() => {
    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

  const familiesToLoad = [
    '400 48px "Bebas Neue"',        // @fontsource/bebas-neue
    '400 48px "Playfair Display"',  // @fontsource/playfair-display/700.css
    '400 48px "Space Grotesk"',     // @fontsource/space-grotesk/700.css
    '400 48px "IBM Plex Mono"',     // @fontsource/ibm-plex-mono/700.css
    '400 48px "Dancing Script"',    // @fontsource/dancing-script/700.css
    '400 48px "Abril Fatface"',     // @fontsource/abril-fatface
    '400 48px "Noto Sans JP"',      // @fontsource/noto-sans-jp/700.css
    '400 48px "Noto Sans KR"',      // @fontsource/noto-sans-kr/700.css
  ];

const startTicker = () => {
  const tick = () => {
    if (!prefersReduced) setAnimateIn(false);
    setTimeout(() => {
      setFontIdx((i) => (i + 1) % STYLES.length); // ← FIXED
      if (!prefersReduced) requestAnimationFrame(() => setAnimateIn(true));
    }, prefersReduced ? 0 : 160);
  };
  intervalRef.current = window.setInterval(tick, 2000);
};


    const loadThenStart = async () => {
      try {
        if ('fonts' in document) {
          await Promise.all(familiesToLoad.map((f) => (document as any).fonts.load(f)));
        }
      } catch { /* ignore */ }
      startTicker();
    };

    loadThenStart();
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []); // ← only once

  return (
    <section id="home" className="pt-24 h-screen relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080"
          alt="Luxury Car Interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col">
        {/* H1 at the top */}
        <div className="mt-8">
          <h1 className="text-4xl lg:text-6xl font-light leading-tight text-white">
            {/* Drive Your Campus Life */}
            Website Under Construction
            
            <br />
            <span className="font-light text-white/90">
              {/* with{' '} */}
<span
  style={{ fontFamily: current.font, display: 'inline-block', minWidth: '10ch' }}
  className={`transition-all duration-300 ${
    animateIn ? 'opacity-100 translate-y-0 text-black-800 drop-shadow' : 'opacity-0 translate-y-1'
  }`}
  aria-live="polite"
  lang={current.lang}
>
  {current.text}
</span>

            </span>
          </h1>
        </div>

        {/* Other content at the bottom */}
        <div className="grid lg:grid-cols-2 gap-12 items-end w-full mt-auto mb-8">
          <div className="space-y-8 mt-0" />
          <div className="space-y-8 lg:ml-auto lg:max-w-md mt-0">
            <p className="text-base text-white/80 leading-relaxed">
              Renting a car should feel as smooth as the ride itself.
              That&apos;s why we&apos;ve simplified everything — from browsing our
              collection to booking in minutes.
            </p>

            <div className="flex items-center">
              {currentUser ? (
                <button
                  onClick={() => {
                    document.querySelector('#vehicles')?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start',
                    });
                  }}
                  className="group flex items-center gap-3 text-white hover:text-white/80 transition-colors font-medium"
                >
                  Browse Our Fleet
                  <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              ) : (
                <a href="#vehicles" className="group flex items-center gap-3 text-white hover:text-white/80 transition-colors font-medium">
                  Browse Our Fleet
                  <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
