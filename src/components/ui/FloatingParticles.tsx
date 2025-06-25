import React, { useEffect, createElement } from 'react';
const FloatingParticles = () => {
  useEffect(() => {
    // Create particles
    const container = document.querySelector('.floating-particles');
    const particleCount = 20;
    if (container) {
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('span');
        // Random size between 5px and 30px
        const size = Math.random() * 25 + 5;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        // Random position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        // Random animation delay and duration
        const duration = Math.random() * 15 + 10;
        const delay = Math.random() * 10;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        container.appendChild(particle);
      }
    }
    // Cleanup
    return () => {
      if (container) {
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }
      }
    };
  }, []);
  return <div className="floating-particles"></div>;
};
export default FloatingParticles;