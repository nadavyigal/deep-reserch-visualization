export const sampleAnimations: Record<string, string> = {
  'heading-animation-example': `// Create a container for our animation elements
const animationContainer = document.createElement('div');
animationContainer.style.position = 'relative';
animationContainer.style.width = '100%';
animationContainer.style.height = '100%';
container.appendChild(animationContainer);

// Create multiple circles with different colors
const colors = ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33F3'];
const circles = [];

for (let i = 0; i < 5; i++) {
  const circle = document.createElement('div');
  circle.className = 'circle-' + i;
  circle.style.width = '50px';
  circle.style.height = '50px';
  circle.style.borderRadius = '50%';
  circle.style.background = colors[i];
  circle.style.position = 'absolute';
  circle.style.top = '50%';
  circle.style.left = (10 + i * 20) + '%';
  circle.style.transform = 'translateY(-50%)';
  animationContainer.appendChild(circle);
  circles.push(circle);
}

// Create the animation
const animation = anime({
  targets: circles,
  translateY: function(el, i) {
    return anime.random(-100, 100);
  },
  scale: function(el, i) {
    return anime.random(0.5, 2);
  },
  duration: function() { 
    return anime.random(1000, 2000); 
  },
  delay: function() { 
    return anime.random(0, 300); 
  },
  direction: 'alternate',
  loop: true,
  easing: 'easeInOutQuad'
});

return animation;`,

  'heading-tips-for-great-animations': `// Create a container for our animation
const animationContainer = document.createElement('div');
animationContainer.style.position = 'relative';
animationContainer.style.width = '100%';
animationContainer.style.height = '100%';
animationContainer.style.display = 'flex';
animationContainer.style.justifyContent = 'center';
animationContainer.style.alignItems = 'center';
container.appendChild(animationContainer);

// Create text element
const text = document.createElement('div');
text.textContent = 'Animations bring your content to life!';
text.style.fontFamily = 'Arial, sans-serif';
text.style.fontSize = '24px';
text.style.fontWeight = 'bold';
text.style.color = '#333';
text.style.textAlign = 'center';
text.style.opacity = '0';
animationContainer.appendChild(text);

// Create the animation
const animation = anime({
  targets: text,
  opacity: [0, 1],
  translateY: [50, 0],
  rotate: {
    value: '1turn',
    duration: 1500,
    easing: 'easeInOutSine'
  },
  scale: {
    value: [0.5, 1],
    duration: 1000,
    easing: 'easeInOutQuad'
  },
  color: {
    value: ['#333', '#FF5733', '#3357FF', '#333'],
    duration: 3000,
    easing: 'easeInOutQuad'
  },
  delay: 300,
  endDelay: 1000,
  direction: 'alternate',
  loop: true
});

return animation;`
}; 