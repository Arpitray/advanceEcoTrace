import React from 'react';
import styled from 'styled-components';

const Loader = ({ animate = true }) => {
  // animate: boolean - when false, pauses all CSS animations in the loader
  return (
    <StyledWrapper $animate={animate}>
      <div className="ocean-scene-pro">
        <div className="light-caustics" />
        <div className="bubbles">
          <div className="bubble bubble--1" />
          <div className="bubble bubble--2" />
          <div className="bubble bubble--3" />
          <div className="bubble bubble--4" />
          <div className="bubble bubble--5" />
          <div className="bubble bubble--6" />
          <div className="bubble bubble--7" />
          <div className="bubble bubble--8" />
          <div className="bubble bubble--9" />
          <div className="bubble bubble--10" />
        </div>
        <div className="sand-floor" />
        <div className="seaweed">
          <div className="seaweed__plant seaweed__plant--1" />
          <div className="seaweed__plant seaweed__plant--2" />
          <div className="seaweed__plant seaweed__plant--3" />
        </div>
        <div className="sea-grass">
          <div className="grass-blade grass-blade--1" />
          <div className="grass-blade grass-blade--2" />
          <div className="grass-blade grass-blade--3" />
          <div className="grass-blade grass-blade--4" />
          <div className="grass-blade grass-blade--5" />
          <div className="grass-blade grass-blade--6" />
          <div className="grass-blade grass-blade--7" />
        </div>
        <div className="fish fish--svg fish--1">
          <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className="fish-svg" version="1.1" width="100%" height="100%">
            <g>
              <path d="M155.225,223.377c0,0,37.189-90.859,144.589-91.34c100.768-0.451,124.753,59.527,124.753,59.527 L155.225,223.377z" style={{fill: '#3c66b1'}} />
              <path d="M267.842,339.889c-89.137-24.416-179.415-81.052-179.415-81.052s140.421-92.038,253.44-92.038 s162.587,121.482,162.587,121.482s-49.567,62.594-162.587,62.594c-7.464,0-15.002-0.401-22.575-1.151L267.842,339.889z" style={{fill: '#8ec1ed'}} />
              <g style={{opacity: '0.4'}}>
                <path d="M504.454,288.279c0,0-31.461-77.103-101.402-108.457c-16.687,7.061-52.699,48.747-53.584,82.508 c-0.941,35.906,12.738,68.547,41.995,84.212C469.521,332.375,504.454,288.279,504.454,288.279z" style={{fill: '#3c66b1'}} />
              </g>
              <g>
                <path d="M341.867,318.829c-7.464,0-15.002-0.401-22.575-1.151 l-51.451-9.835C208.667,291.633,149,261.23,115.566,242.618c-17.003,9.71-27.139,16.352-27.139,16.352 s90.277,56.635,179.415,81.052l51.451,9.836c7.573,0.75,15.111,1.151,22.575,1.151c113.019,0,162.587-62.594,162.587-62.594 s-3.513-8.607-10.796-21.237C473.573,285.121,424.806,318.829,341.867,318.829z" style={{opacity: '0.23', fill: '#315591', enableBackground: 'new'}} />
                <path d="M504.453,295.827h-51.719c-4.169,0-7.546-3.379-7.546-7.546s3.378-7.546,7.546-7.546h51.719 c4.169,0,7.546,3.379,7.546,7.546S508.622,295.827,504.453,295.827z" style={{fill: '#315591'}} />
                <path d="M349.468,268.867c0,0,0.053,91.146-81.623,111.099v-91.062c0-10.128,8.092-18.402,18.217-18.627 L349.468,268.867z" style={{fill: '#315591'}} />
                <circle r="10.653" cy="255.823" cx="413.916" style={{fill: '#315591'}} />
              </g>
              <path d="M98.489,258.837c0,0-0.526-31.012-18.339-44.472c-17.814-13.461-72.604-25.84-72.604-25.84 s26.962,52.578,44.774,66.038c0.024,0.018,0.048,0.036,0.072,0.054c2.843,2.135,2.843,6.303,0,8.438 c-0.024,0.018-0.048,0.036-0.072,0.054c-17.813,13.461-44.774,66.039-44.774,66.039s54.79-12.379,72.604-25.84 C97.963,289.849,98.489,258.837,98.489,258.837h-0.001H98.489z" style={{fill: '#52a2e7'}} className="fish-tail" />
              <g style={{opacity: '0.23'}}>
                <path d="M97.786,250.979c-1.385,10.103-5.491,27.435-17.637,36.613c-13.069,9.876-46.044,19.17-62.68,23.419 c-5.928,10.348-9.924,18.139-9.924,18.139s54.79-12.379,72.604-25.84c17.813-13.461,18.339-44.472,18.339-44.472h-0.001h0.001 C98.489,258.837,98.432,255.692,97.786,250.979z" style={{fill: '#315591'}} />
              </g>
            </g>
          </svg>
        </div>
        <div className="fish fish--svg fish--2">
          <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className="fish-svg" version="1.1" width="100%" height="100%">
            <g>
              <path d="M155.225,223.377c0,0,37.189-90.859,144.589-91.34c100.768-0.451,124.753,59.527,124.753,59.527 L155.225,223.377z" style={{fill: '#3c66b1'}} />
              <path d="M267.842,339.889c-89.137-24.416-179.415-81.052-179.415-81.052s140.421-92.038,253.44-92.038 s162.587,121.482,162.587,121.482s-49.567,62.594-162.587,62.594c-7.464,0-15.002-0.401-22.575-1.151L267.842,339.889z" style={{fill: '#8ec1ed'}} />
              <g style={{opacity: '0.4'}}>
                <path d="M504.454,288.279c0,0-31.461-77.103-101.402-108.457c-16.687,7.061-52.699,48.747-53.584,82.508 c-0.941,35.906,12.738,68.547,41.995,84.212C469.521,332.375,504.454,288.279,504.454,288.279z" style={{fill: '#3c66b1'}} />
              </g>
              <g>
                <path d="M341.867,318.829c-7.464,0-15.002-0.401-22.575-1.151 l-51.451-9.835C208.667,291.633,149,261.23,115.566,242.618c-17.003,9.71-27.139,16.352-27.139,16.352 s90.277,56.635,179.415,81.052l51.451,9.836c7.573,0.75,15.111,1.151,22.575,1.151c113.019,0,162.587-62.594,162.587-62.594 s-3.513-8.607-10.796-21.237C473.573,285.121,424.806,318.829,341.867,318.829z" style={{opacity: '0.23', fill: '#315591', enableBackground: 'new'}} />
                <path d="M504.453,295.827h-51.719c-4.169,0-7.546-3.379-7.546-7.546s3.378-7.546,7.546-7.546h51.719 c4.169,0,7.546,3.379,7.546,7.546S508.622,295.827,504.453,295.827z" style={{fill: '#315591'}} />
                <path d="M349.468,268.867c0,0,0.053,91.146-81.623,111.099v-91.062c0-10.128,8.092-18.402,18.217-18.627 L349.468,268.867z" style={{fill: '#315591'}} />
                <circle r="10.653" cy="255.823" cx="413.916" style={{fill: '#315591'}} />
              </g>
              <path d="M98.489,258.837c0,0-0.526-31.012-18.339-44.472c-17.814-13.461-72.604-25.84-72.604-25.84 s26.962,52.578,44.774,66.038c0.024,0.018,0.048,0.036,0.072,0.054c2.843,2.135,2.843,6.303,0,8.438 c-0.024,0.018-0.048,0.036-0.072,0.054c-17.813,13.461-44.774,66.039-44.774,66.039s54.79-12.379,72.604-25.84 C97.963,289.849,98.489,258.837,98.489,258.837h-0.001H98.489z" style={{fill: '#52a2e7'}} className="fish-tail" />
              <g style={{opacity: '0.23'}}>
                <path d="M97.786,250.979c-1.385,10.103-5.491,27.435-17.637,36.613c-13.069,9.876-46.044,19.17-62.68,23.419 c-5.928,10.348-9.924,18.139-9.924,18.139s54.79-12.379,72.604-25.84c17.813-13.461,18.339-44.472,18.339-44.472h-0.001h0.001 C98.489,258.837,98.432,255.692,97.786,250.979z" style={{fill: '#315591'}} />
              </g>
            </g>
          </svg>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  /* If $animate is false, pause all animations inside this component */
  ${props => props.$animate === false && `
    * {
      animation-play-state: paused !important;
      transition: none !important;
    }
  `}
  /* Full viewport overlay to ensure loader covers the screen */
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.95); /* Dark overlay for futuristic theme */
  z-index: 9999;

  .ocean-scene-pro {
    position: relative;
    width: min(1100px, 95vw);
    height: min(700px, 85vh);
    background: linear-gradient(to bottom, #0f172a, #064e3b, #022c22); /* Darker ocean gradient */
    overflow: hidden; /* Crucial for the effect to work */
    border-radius: 1vmax;
    border: 2px solid #166534; /* Forest green border */
    box-shadow: 0 0 3vmax rgba(22, 101, 52, 0.2);
    display: block;
    transform: translateZ(0);
  }
  .light-caustics {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    background: radial-gradient(
        ellipse 40% 50% at 20% 40%,
        rgba(255, 255, 255, 0.1),
        transparent
      ),
      radial-gradient(
        ellipse 30% 40% at 80% 70%,
        rgba(255, 255, 255, 0.08),
        transparent
      );
    animation: caustics-flow 20s linear infinite;
  }
  .sand-floor {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 8vmax;
    background: #c2b280;
    border-radius: 50% 40% 0 0 / 10vmax 12vmax 0 0;
    z-index: 1;
  }
  .seaweed {
    position: absolute;
    width: 100%;
    height: 100%;
    bottom: 0;
    z-index: 2;
  }
  .seaweed__plant {
    position: absolute;
    bottom: 3vmax;
    width: 1vmax;
    background: linear-gradient(to top, #004d40, #00796b);
    border-radius: 0.5vmax;
    transform-origin: bottom center;
    animation: seaweed-sway 10s ease-in-out infinite;
  }
  .seaweed__plant--1 {
    left: 10%;
    height: 15vmax;
    animation-delay: -2s;
  }
  .seaweed__plant--2 {
    left: 80%;
    height: 20vmax;
    animation-delay: -5s;
    transform: scaleX(-1);
  }
  .seaweed__plant--3 {
    left: 45%;
    height: 12vmax;
    animation-delay: -8s;
  }

  /* --- NEW: Sea Grass Styling --- */
  .sea-grass {
    position: absolute;
    width: 100%;
    height: 100%;
    bottom: 0;
    z-index: 3; /* Placed in front of seaweed but behind fish */
  }
  .grass-blade {
    position: absolute;
    bottom: 0;
    width: 0.6vmax;
    background: linear-gradient(to top, #2d6a4f, #40916c);
    border-radius: 0.5vmax 0.5vmax 0 0;
    transform-origin: bottom center;
    animation: grass-sway 7s ease-in-out infinite;
  }
  .grass-blade--1 {
    left: 20%;
    height: 6vmax;
    animation-delay: -1s;
  }
  .grass-blade--2 {
    left: 22%;
    height: 4vmax;
    animation-delay: -2.5s;
    transform: scaleX(-1);
  }
  .grass-blade--3 {
    left: 25%;
    height: 7vmax;
    animation-delay: -4s;
  }
  .grass-blade--4 {
    left: 60%;
    height: 5vmax;
    animation-delay: -1.5s;
  }
  .grass-blade--5 {
    left: 63%;
    height: 8vmax;
    animation-delay: -5s;
  }
  .grass-blade--6 {
    left: 65%;
    height: 6vmax;
    animation-delay: -3s;
    transform: scaleX(-1);
  }
  .grass-blade--7 {
    left: 90%;
    height: 4vmax;
    animation-delay: -6s;
  }

  /* --- NEW: More Bubbles --- */
  .bubbles {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 5;
  }
  .bubble {
    position: absolute;
    bottom: -5vmax;
    border: 0.15vmax solid rgba(255, 255, 255, 0.4);
    border-radius: 50%;
    animation: rise 15s linear infinite;
  }
  .bubble--1 {
    left: 10%;
    width: 1.5vmax;
    height: 1.5vmax;
    animation-duration: 12s;
    animation-delay: -2s;
  }
  .bubble--2 {
    left: 30%;
    width: 2.5vmax;
    height: 2.5vmax;
    animation-duration: 18s;
    animation-delay: -8s;
  }
  .bubble--3 {
    left: 55%;
    width: 1vmax;
    height: 1vmax;
    animation-duration: 10s;
    animation-delay: 0s;
  }
  .bubble--4 {
    left: 80%;
    width: 3vmax;
    height: 3vmax;
    animation-duration: 15s;
    animation-delay: -5s;
  }
  .bubble--5 {
    left: 90%;
    width: 1.2vmax;
    height: 1.2vmax;
    animation-duration: 11s;
    animation-delay: -10s;
  }
  .bubble--6 {
    left: 5%;
    width: 2vmax;
    height: 2vmax;
    animation-duration: 16s;
    animation-delay: -4s;
  }
  .bubble--7 {
    left: 40%;
    width: 1.8vmax;
    height: 1.8vmax;
    animation-duration: 20s;
    animation-delay: -1s;
  }
  .bubble--8 {
    left: 25%;
    width: 0.8vmax;
    height: 0.8vmax;
    animation-duration: 9s;
    animation-delay: -12s;
  }
  .bubble--9 {
    left: 70%;
    width: 2.2vmax;
    height: 2.2vmax;
    animation-duration: 14s;
    animation-delay: -7s;
  }
  .bubble--10 {
    left: 95%;
    width: 1.5vmax;
    height: 1.5vmax;
    animation-duration: 13s;
    animation-delay: -14s;
  }

  /* --- SVG Fish Styling --- */
  .fish {
    position: absolute;
    z-index: 10;
    filter: drop-shadow(0 0.2vmax 0.5vmax rgba(0, 0, 0, 0.3));
  }
  .fish--svg {
    width: 12vmax;
    height: 12vmax;
  }

  /* Responsive tweaks */
  @media (max-width: 640px) {
    .ocean-scene-pro {
      width: 95vw;
      /* Reduced height for mobile so loader doesn't dominate small viewports */
      height: 35vh;
    }
    .fish--svg {
      width: 18vmax;
      height: 18vmax;
    }
  }
  .fish--1 {
    animation: swim-path-1 20s linear infinite -2s;
  }
  .fish--2 {
    filter: hue-rotate(160deg) drop-shadow(0 0.2vmax 0.5vmax rgba(0, 0, 0, 0.3));
    transform: scale(0.8);
    animation: swim-path-2 25s linear infinite -10s;
  }
  .fish-tail {
    transform-origin: 98px 258px;
    animation: wag-tail-svg 0.8s ease-in-out infinite;
  }

  /* --- @keyframes Definitions --- */
  @keyframes caustics-flow {
    0%,
    100% {
      transform: translate(0, 0) scale(1.1);
    }
    50% {
      transform: translate(2vmax, 5vmax) scale(1);
    }
  }
  @keyframes seaweed-sway {
    0%,
    100% {
      transform: rotate(5deg);
    }
    50% {
      transform: rotate(-5deg);
    }
  }
  @keyframes grass-sway {
    0%,
    100% {
      transform: rotate(8deg);
    }
    50% {
      transform: rotate(-8deg);
    }
  }
  @keyframes rise {
    0% {
      transform: translateY(0) translateX(0);
      opacity: 1;
    }
    50% {
      transform: translateX(2vmax);
    }
    100% {
      transform: translateY(-60vmax) translateX(-2vmax);
      opacity: 0;
    }
  }
  @keyframes wag-tail-svg {
    0%,
    100% {
      transform: rotate(15deg) skewX(10deg);
    }
    50% {
      transform: rotate(-15deg) skewX(-10deg);
    }
  }
  @keyframes swim-path-1 {
    0% {
      transform: translate(-20vmax, 10vmax) rotateY(0deg);
    }
    49% {
      transform: translate(60vmax, 15vmax) rotateY(0deg);
    }
    50% {
      transform: translate(60vmax, 15vmax) rotateY(180deg);
    }
    99% {
      transform: translate(-20vmax, 10vmax) rotateY(180deg);
    }
    100% {
      transform: translate(-20vmax, 10vmax) rotateY(180deg);
    }
  }
  @keyframes swim-path-2 {
    0% {
      transform: translate(60vmax, 45vmax) rotateY(180deg) scale(0.8);
    }
    49% {
      transform: translate(-20vmax, 40vmax) rotateY(180deg) scale(0.8);
    }
    50% {
      transform: translate(-20vmax, 40vmax) rotateY(0deg) scale(0.8);
    }
    99% {
      transform: translate(60vmax, 45vmax) rotateY(0deg) scale(0.8);
    }
    100% {
      transform: translate(60vmax, 45vmax) rotateY(0deg) scale(0.8);
    }
  }`;

export default Loader;
