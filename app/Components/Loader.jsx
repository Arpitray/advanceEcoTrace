import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="loader-container">
        <div className="loader">
          <span className="item" />
          <span className="item" />
          <span className="item" />
          <span className="item" />
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .loader-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.95);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }

  .loader {
    width: clamp(60px, 15vw, 120px);
    height: clamp(60px, 15vw, 120px);
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-content: space-between;
    animation: loading-rotate 3s linear infinite;
  }

  .item {
    width: calc(50% - 2.5px);
    height: calc(50% - 2.5px);
    display: block;
    box-sizing: border-box;
  }

  .item:nth-of-type(1) {
    background-color: #166534;
    border-radius: clamp(15px, 4vw, 25px) clamp(15px, 4vw, 25px) 0 clamp(15px, 4vw, 25px);
    border-left: rgba(255, 255, 255, 0.3) clamp(2px, 0.5vw, 4px) solid;
    border-top: rgba(255, 255, 255, 0.3) clamp(2px, 0.5vw, 4px) solid;
  }

  .item:nth-of-type(2) {
    background-color: #15803d;
    border-radius: clamp(15px, 4vw, 25px) clamp(15px, 4vw, 25px) clamp(15px, 4vw, 25px) 0;
    border-right: rgba(255, 255, 255, 0.3) clamp(2px, 0.5vw, 4px) solid;
    border-top: rgba(255, 255, 255, 0.3) clamp(2px, 0.5vw, 4px) solid;
  }

  .item:nth-of-type(3) {
    background-color: #16a34a;
    border-radius: clamp(15px, 4vw, 25px) 0 clamp(15px, 4vw, 25px) clamp(15px, 4vw, 25px);
    border-left: rgba(255, 255, 255, 0.3) clamp(2px, 0.5vw, 4px) solid;
    border-bottom: rgba(255, 255, 255, 0.3) clamp(2px, 0.5vw, 4px) solid;
  }

  .item:nth-of-type(4) {
    background-color: #22c55e;
    border-radius: 0 clamp(15px, 4vw, 25px) clamp(15px, 4vw, 25px) clamp(15px, 4vw, 25px);
    border-right: rgba(255, 255, 255, 0.3) clamp(2px, 0.5vw, 4px) solid;
    border-bottom: rgba(255, 255, 255, 0.3) clamp(2px, 0.5vw, 4px) solid;
  }

  @keyframes loading-rotate {
    0% {
      transform: scale(1) rotate(0);
    }

    20% {
      transform: scale(1) rotate(72deg);
    }

    40% {
      transform: scale(0.5) rotate(144deg);
    }

    60% {
      transform: scale(0.5) rotate(216deg);
    }

    80% {
      transform: scale(1) rotate(288deg);
    }

    100% {
      transform: scale(1) rotate(360deg);
    }
  }`;

export default Loader;
