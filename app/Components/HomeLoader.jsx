import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="cell">
        <div className="card">
          <span className="flower-loader">Loading…</span>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  /* Fullscreen wrapper to ensure loader covers entire viewport */
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #EBE8DC;
  z-index: 9999;

  .cell {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .card {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }

  .flower-loader {
    overflow: hidden;
    position: relative;
    text-indent: -9999px;
    display: inline-block;
    /* increased size so the flower is clearly visible in the center */
    width: 180px;
    height: 180px;
    background: #e96;
    border-radius: 50%;
    -moz-box-shadow: white 0 0 25px 0, #485 -30px -30px 0 8px,
      #485 30px -30px 0 8px, #485 30px 30px 0 8px, #485 -30px 30px 0 8px;
    -webkit-box-shadow: white 0 0 25px 0, #485 -30px -30px 0 8px,
      #485 30px -30px 0 8px, #485 30px 30px 0 8px, #485 -30px 30px 0 8px;
    box-shadow: white 0 0 25px 0, #485 -30px -30px 0 8px, #485 30px -30px 0 8px,
      #485 30px 30px 0 8px, #485 -30px 30px 0 8px;
    -moz-animation: flower-loader 5s infinite ease-in-out;
    -webkit-animation: flower-loader 5s infinite ease-in-out;
    animation: flower-loader 5s infinite ease-in-out;
    -moz-transform-origin: 50% 50%;
    -ms-transform-origin: 50% 50%;
    -webkit-transform-origin: 50% 50%;
    transform-origin: 50% 50%;
  }

  @-moz-keyframes flower-loader {
    0% {
      -moz-transform: rotate(0deg);
      transform: rotate(0deg);
      -moz-box-shadow: white 0 0 25px 0, #485 -30px -30px 0 8px,
        #485 30px -30px 0 8px, #485 30px 30px 0 8px, #485 -30px 30px 0 8px;
      box-shadow: white 0 0 25px 0, #485 -30px -30px 0 8px, #485 30px -30px 0 8px,
        #485 30px 30px 0 8px, #485 -30px 30px 0 8px;
    }
    50% {
      -moz-transform: rotate(1080deg);
      transform: rotate(1080deg);
      -moz-box-shadow: white 0 0 25px 0, #485 30px 30px 0 8px,
        #485 -30px 30px 0 8px, #485 -30px -30px 0 8px, #485 30px -30px 0 8px;
      box-shadow: white 0 0 25px 0, #485 30px 30px 0 8px, #485 -30px 30px 0 8px,
        #485 -30px -30px 0 8px, #485 30px -30px 0 8px;
    }
  }
  @-webkit-keyframes flower-loader {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
      -webkit-box-shadow: white 0 0 25px 0, #485 -30px -30px 0 8px,
        #485 30px -30px 0 8px, #485 30px 30px 0 8px, #485 -30px 30px 0 8px;
      box-shadow: white 0 0 25px 0, #485 -30px -30px 0 8px, #485 30px -30px 0 8px,
        #485 30px 30px 0 8px, #485 -30px 30px 0 8px;
    }
    50% {
      -webkit-transform: rotate(1080deg);
      transform: rotate(1080deg);
      -webkit-box-shadow: white 0 0 25px 0, #485 30px 30px 0 8px,
        #485 -30px 30px 0 8px, #485 -30px -30px 0 8px, #485 30px -30px 0 8px;
      box-shadow: white 0 0 25px 0, #485 30px 30px 0 8px, #485 -30px 30px 0 8px,
        #485 -30px -30px 0 8px, #485 30px -30px 0 8px;
    }
  }
  @keyframes flower-loader {
    0% {
      -moz-transform: rotate(0deg);
      -ms-transform: rotate(0deg);
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
      -moz-box-shadow: white 0 0 25px 0, #485 -80px -80px 0 8px,
        #485 80px -80px 0 8px, #485 80px 80px 0 8px, #485 -80px 80px 0 8px;
      -webkit-box-shadow: white 0 0 25px 0, #485 -80px -80px 0 8px,
        #485 80px -80px 0 8px, #485 80px 80px 0 8px, #485 -80px 80px 0 8px;
      box-shadow: white 0 0 25px 0, #485 -80px -80px 0 8px, #485 80px -80px 0 8px,
        #485 80px 80px 0 8px, #485 -80px 80px 0 8px;
    }
    50% {
      -moz-transform: rotate(1080deg);
      -ms-transform: rotate(1080deg);
      -webkit-transform: rotate(1080deg);
      transform: rotate(1080deg);
      -moz-box-shadow: white 0 0 25px 0, #485 80px 80px 0 8px,
        #485 -80px 80px 0 8px, #485 -80px -80px 0 8px, #485 80px -80px 0 8px;
      -webkit-box-shadow: white 0 0 25px 0, #485 80px 80px 0 8px,
        #485 -80px 80px 0 8px, #485 -80px -80px 0 8px, #485 80px -80px 0 8px;
      box-shadow: white 0 0 25px 0, #485 80px 80px 0 8px, #485 -80px 80px 0 8px,
        #485 -80px -80px 0 8px, #485 80px -80px 0 8px;
    }
  }`;

export default Loader;
