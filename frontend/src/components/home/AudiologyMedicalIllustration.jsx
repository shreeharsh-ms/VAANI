import React from 'react';

export const AudiologyMedicalIllustration = () => {
  return (
    <div className="relative w-full max-w-[340px] sm:max-w-[380px] lg:max-w-[420px] aspect-square mx-auto flex items-center justify-center select-none">
      <svg
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_25px_50px_rgba(15,3,25,0.7)]"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="tubeGrad" x1="100" y1="50" x2="400" y2="450" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#7e22ce" />
            <stop offset="50%" stopColor="#581c87" />
            <stop offset="100%" stopColor="#3b0764" />
          </linearGradient>

          <linearGradient id="earGrad" x1="280" y1="120" x2="440" y2="380" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#d946ef" />
            <stop offset="35%" stopColor="#c026d3" />
            <stop offset="70%" stopColor="#9333ea" />
            <stop offset="100%" stopColor="#6b21a8" />
          </linearGradient>

          <linearGradient id="earInnerGrad" x1="320" y1="180" x2="400" y2="320" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="60%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#581c87" />
          </linearGradient>

          <linearGradient id="dialRimGrad" x1="100" y1="180" x2="220" y2="300" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="50%" stopColor="#7e22ce" />
            <stop offset="100%" stopColor="#3b0764" />
          </linearGradient>

          <linearGradient id="dialFaceGrad" x1="120" y1="200" x2="200" y2="280" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f3e8ff" />
          </linearGradient>

          <linearGradient id="bulbGrad" x1="150" y1="360" x2="230" y2="460" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="50%" stopColor="#6b21a8" />
            <stop offset="100%" stopColor="#311444" />
          </linearGradient>

          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Looping Purple Acoustic Tube Ribbon (matching the curved loop behind organ in reference) */}
        <path
          d="M 280 470 C 260 400 210 370 170 330 C 130 290 130 210 180 150 C 230 90 320 80 340 120 C 360 160 300 210 240 220 C 170 230 180 340 220 400 C 250 440 330 470 420 430"
          stroke="url(#tubeGrad)"
          strokeWidth="20"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-70"
        />

        {/* 2. Soft Ambient Glow Behind Ear */}
        <circle cx="370" cy="250" r="110" fill="#a855f7" opacity="0.25" filter="url(#softGlow)" />

        {/* 3. Stylized Anatomical Ear Shape with Cochlear Curves */}
        {/* Outer Auricle (Helix) */}
        <path
          d="M 360 110 
             C 430 110 470 160 460 230 
             C 455 270 435 300 430 330 
             C 425 360 405 400 375 410 
             C 345 420 330 395 335 375 
             C 340 355 365 345 370 320 
             C 375 295 360 280 345 260 
             C 330 240 315 230 315 190 
             C 315 140 335 110 360 110 Z"
          fill="url(#earGrad)"
          filter="drop-shadow(0 15px 25px rgba(45, 10, 65, 0.5))"
        />

        {/* Inner Concha & Antihelix (Depth contour) */}
        <path
          d="M 370 145 
             C 415 150 435 185 430 235 
             C 425 275 400 290 390 315 
             C 380 335 365 330 360 310 
             C 355 285 385 260 380 230 
             C 375 200 345 190 345 165 
             C 345 145 355 142 370 145 Z"
          fill="url(#earInnerGrad)"
          opacity="0.9"
        />

        {/* Acoustic canal highlight */}
        <ellipse cx="370" cy="245" rx="18" ry="24" fill="#3b0764" />
        <ellipse cx="366" cy="242" rx="10" ry="14" fill="#18042b" />

        {/* Delicate Golden/Lavender Sound Frequency Waves Radiating Outward */}
        <path
          d="M 470 180 C 490 200 495 240 480 270"
          stroke="#f0abfc"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.8"
        />
        <path
          d="M 488 160 C 515 190 520 250 500 290"
          stroke="#e879f9"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.5"
        />
        <path
          d="M 505 140 C 540 180 545 270 518 310"
          stroke="#d946ef"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.3"
        />

        {/* 4. Audiology Sound Pressure / Frequency Gauge (Sphygmomanometer style dial from reference) */}
        {/* Connecting Tube from Gauge to Ear */}
        <path
          d="M 210 260 C 260 270 300 260 335 250"
          stroke="#9333ea"
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* Gauge Outer Metal Rim */}
        <circle cx="170" cy="250" r="54" fill="url(#dialRimGrad)" />
        <circle cx="170" cy="250" r="48" fill="#ffffff" />
        <circle cx="170" cy="250" r="45" fill="url(#dialFaceGrad)" />

        {/* Gauge Dial Tick Marks */}
        <circle cx="170" cy="250" r="38" stroke="#a855f7" strokeWidth="1" strokeDasharray="3 4" opacity="0.6" />
        
        {/* Scale Numbers & Audiogram Threshold Marks */}
        <text x="170" y="222" fontSize="7" fontWeight="bold" textAnchor="middle" fill="#581c87">dB HL</text>
        <text x="145" y="253" fontSize="6" fontWeight="bold" fill="#7e22ce">250</text>
        <text x="170" y="278" fontSize="6" fontWeight="bold" textAnchor="middle" fill="#7e22ce">1k</text>
        <text x="190" y="253" fontSize="6" fontWeight="bold" fill="#7e22ce">8k</text>

        {/* Needle pointing to normal hearing / optimal threshold */}
        <line x1="170" y1="250" x2="188" y2="230" stroke="#c026d3" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="170" cy="250" r="5" fill="#3b0764" />
        <circle cx="170" cy="250" r="2" fill="#ffffff" />

        {/* 5. Bulb / Pump connected with curly cord (matching the blue bulb in the reference) */}
        <path
          d="M 170 304 C 170 340 180 360 190 390"
          stroke="#7e22ce"
          strokeWidth="7"
          strokeLinecap="round"
        />
        {/* Rubber Bulb */}
        <ellipse
          cx="198"
          cy="420"
          rx="24"
          ry="34"
          transform="rotate(-15 198 420)"
          fill="url(#bulbGrad)"
          filter="drop-shadow(0 10px 15px rgba(25, 5, 40, 0.4))"
        />
        {/* Bulb Valve Cap */}
        <rect x="188" y="448" width="14" height="10" rx="3" fill="#3b0764" />
        <rect x="190" y="458" width="10" height="6" rx="2" fill="#9333ea" />
      </svg>
    </div>
  );
};

export default AudiologyMedicalIllustration;
