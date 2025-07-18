import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

const TestAnimation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clear container
    containerRef.current.innerHTML = '';
    
    // Create animation elements
    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    wrapper.style.width = '100%';
    wrapper.style.height = '100%';
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.justifyContent = 'center';
    containerRef.current.appendChild(wrapper);
    
    // Create circles
    const circles = [];
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33F3'];
    
    for (let i = 0; i < 5; i++) {
      const circle = document.createElement('div');
      circle.style.width = '50px';
      circle.style.height = '50px';
      circle.style.borderRadius = '50%';
      circle.style.background = colors[i];
      circle.style.margin = '10px';
      circle.style.opacity = '0';
      wrapper.appendChild(circle);
      circles.push(circle);
    }
    
    // Create animation
    anime.timeline({
      loop: true
    })
    .add({
      targets: circles,
      translateY: [-50, 0],
      opacity: [0, 1],
      delay: anime.stagger(100),
      duration: 800,
      easing: 'easeOutElastic(1, .8)'
    })
    .add({
      targets: circles,
      scale: [1, 1.2],
      delay: anime.stagger(100),
      duration: 600,
      easing: 'easeInOutQuad'
    })
    .add({
      targets: circles,
      translateY: [0, 50],
      opacity: [1, 0],
      delay: anime.stagger(100),
      duration: 800,
      easing: 'easeInOutQuad'
    });
    
  }, []);
  
  return (
    <div className="test-animation">
      <h3 className="text-lg font-semibold mb-2">Test Animation</h3>
      <div 
        ref={containerRef}
        className="border border-gray-200 dark:border-dark-700 rounded-lg p-4 min-h-[200px] bg-white dark:bg-dark-800 shadow-sm"
      />
    </div>
  );
};

export default TestAnimation; 