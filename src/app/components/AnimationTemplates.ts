/**
 * Collection of reusable animation templates that can be used as fallbacks
 * when the AI-generated animations fail.
 */

export const basicCirclesAnimation = `
function createAnimation(anime, container) {
  // Create a wrapper for the animation
  const wrapper = document.createElement('div');
  wrapper.style.position = 'relative';
  wrapper.style.width = '100%';
  wrapper.style.height = '100%';
  wrapper.style.display = 'flex';
  wrapper.style.alignItems = 'center';
  wrapper.style.justifyContent = 'center';
  wrapper.style.overflow = 'hidden';
  container.appendChild(wrapper);
  
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
  const animation = anime.timeline({
    loop: true
  });
  
  animation.add({
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
  
  return animation;
}
`;

export const textRevealAnimation = `
function createAnimation(anime, container) {
  // Create a wrapper for the animation
  const wrapper = document.createElement('div');
  wrapper.style.position = 'relative';
  wrapper.style.width = '100%';
  wrapper.style.height = '100%';
  wrapper.style.display = 'flex';
  wrapper.style.flexDirection = 'column';
  wrapper.style.alignItems = 'center';
  wrapper.style.justifyContent = 'center';
  wrapper.style.overflow = 'hidden';
  container.appendChild(wrapper);
  
  // Create title
  const title = document.createElement('h2');
  title.textContent = 'Animation';
  title.style.fontSize = '28px';
  title.style.fontWeight = 'bold';
  title.style.color = '#3498db';
  title.style.opacity = '0';
  title.style.marginBottom = '20px';
  wrapper.appendChild(title);
  
  // Create text elements
  const textContainer = document.createElement('div');
  textContainer.style.display = 'flex';
  textContainer.style.flexDirection = 'column';
  textContainer.style.alignItems = 'center';
  wrapper.appendChild(textContainer);
  
  const texts = ['First Item', 'Second Item', 'Third Item', 'Fourth Item'];
  const textElements = [];
  
  texts.forEach(text => {
    const textEl = document.createElement('div');
    textEl.textContent = text;
    textEl.style.fontSize = '18px';
    textEl.style.margin = '10px';
    textEl.style.padding = '10px 20px';
    textEl.style.borderRadius = '4px';
    textEl.style.background = '#f0f0f0';
    textEl.style.color = '#333';
    textEl.style.opacity = '0';
    textEl.style.transform = 'translateX(-20px)';
    textContainer.appendChild(textEl);
    textElements.push(textEl);
  });
  
  // Create animation
  const animation = anime.timeline({
    loop: true
  });
  
  animation.add({
    targets: title,
    opacity: [0, 1],
    translateY: [-30, 0],
    duration: 1000,
    easing: 'easeOutElastic(1, .8)'
  })
  .add({
    targets: textElements,
    opacity: [0, 1],
    translateX: [-20, 0],
    delay: anime.stagger(200),
    duration: 800,
    easing: 'easeOutQuad'
  })
  .add({
    targets: textElements,
    backgroundColor: ['#f0f0f0', '#e0f7fa'],
    delay: anime.stagger(200),
    duration: 400,
    easing: 'easeInOutQuad'
  })
  .add({
    targets: textElements,
    opacity: [1, 0],
    translateX: [0, 20],
    delay: anime.stagger(200),
    duration: 800,
    easing: 'easeInQuad'
  })
  .add({
    targets: title,
    opacity: [1, 0],
    translateY: [0, 30],
    duration: 1000,
    easing: 'easeInQuad'
  });
  
  return animation;
}
`;

export const dataVisualizationAnimation = `
function createAnimation(anime, container) {
  // Create a wrapper for the animation
  const wrapper = document.createElement('div');
  wrapper.style.position = 'relative';
  wrapper.style.width = '100%';
  wrapper.style.height = '100%';
  wrapper.style.display = 'flex';
  wrapper.style.flexDirection = 'column';
  wrapper.style.alignItems = 'center';
  wrapper.style.justifyContent = 'center';
  wrapper.style.overflow = 'hidden';
  container.appendChild(wrapper);
  
  // Create title
  const title = document.createElement('h2');
  title.textContent = 'Data Visualization';
  title.style.fontSize = '24px';
  title.style.fontWeight = 'bold';
  title.style.color = '#2c3e50';
  title.style.marginBottom = '20px';
  title.style.opacity = '0';
  wrapper.appendChild(title);
  
  // Create chart container
  const chartContainer = document.createElement('div');
  chartContainer.style.width = '80%';
  chartContainer.style.height = '200px';
  chartContainer.style.position = 'relative';
  chartContainer.style.display = 'flex';
  chartContainer.style.alignItems = 'flex-end';
  chartContainer.style.justifyContent = 'space-around';
  chartContainer.style.padding = '0 10px';
  wrapper.appendChild(chartContainer);
  
  // Create bars
  const values = [75, 45, 85, 30, 60];
  const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6'];
  const bars = [];
  const labels = ['A', 'B', 'C', 'D', 'E'];
  
  values.forEach((value, i) => {
    const barContainer = document.createElement('div');
    barContainer.style.display = 'flex';
    barContainer.style.flexDirection = 'column';
    barContainer.style.alignItems = 'center';
    barContainer.style.width = '15%';
    chartContainer.appendChild(barContainer);
    
    const bar = document.createElement('div');
    bar.style.width = '100%';
    bar.style.height = '0px'; // Start at 0, will animate to actual height
    bar.style.backgroundColor = colors[i];
    bar.style.borderRadius = '4px 4px 0 0';
    barContainer.appendChild(bar);
    bars.push(bar);
    
    const label = document.createElement('div');
    label.textContent = labels[i];
    label.style.marginTop = '8px';
    label.style.fontSize = '14px';
    label.style.opacity = '0';
    barContainer.appendChild(label);
    bars.push(label);
  });
  
  // Create animation
  const animation = anime.timeline({
    loop: true
  });
  
  animation.add({
    targets: title,
    opacity: [0, 1],
    translateY: [-20, 0],
    duration: 800,
    easing: 'easeOutQuad'
  })
  .add({
    targets: bars.filter((_, i) => i % 2 === 0), // Only the bars, not labels
    height: (el, i) => values[i/2] + 'px',
    duration: 1200,
    delay: anime.stagger(100),
    easing: 'easeOutElastic(1, .5)'
  })
  .add({
    targets: bars.filter((_, i) => i % 2 === 1), // Only the labels
    opacity: [0, 1],
    translateY: [10, 0],
    duration: 600,
    delay: anime.stagger(100),
    easing: 'easeOutQuad'
  })
  .add({
    delay: 1000
  })
  .add({
    targets: bars.filter((_, i) => i % 2 === 0), // Only the bars
    height: '0px',
    duration: 800,
    delay: anime.stagger(100),
    easing: 'easeInQuad'
  })
  .add({
    targets: bars.filter((_, i) => i % 2 === 1), // Only the labels
    opacity: 0,
    duration: 600,
    easing: 'easeInQuad'
  })
  .add({
    targets: title,
    opacity: 0,
    translateY: [0, -20],
    duration: 800,
    easing: 'easeInQuad'
  });
  
  return animation;
}
`;

// New customizable text animation template
export const customTextAnimation = `
function createAnimation(anime, container) {
  // Extract text from the container's parent or use default text
  const parentText = container.parentElement?.textContent?.trim() || '';
  const words = parentText.split(/\\s+/).filter(word => word.length > 3).slice(0, 5);
  
  // If no words found, use default words
  const displayWords = words.length > 0 ? words : ['Visualization', 'Animation', 'Interactive', 'Dynamic', 'Content'];
  
  // Create a wrapper for the animation
  const wrapper = document.createElement('div');
  wrapper.style.position = 'relative';
  wrapper.style.width = '100%';
  wrapper.style.height = '100%';
  wrapper.style.display = 'flex';
  wrapper.style.flexDirection = 'column';
  wrapper.style.alignItems = 'center';
  wrapper.style.justifyContent = 'center';
  wrapper.style.overflow = 'hidden';
  container.appendChild(wrapper);
  
  // Create title
  const title = document.createElement('h2');
  title.textContent = 'Key Concepts';
  title.style.fontSize = '24px';
  title.style.fontWeight = 'bold';
  title.style.color = '#3498db';
  title.style.opacity = '0';
  title.style.marginBottom = '20px';
  wrapper.appendChild(title);
  
  // Create text elements container
  const textContainer = document.createElement('div');
  textContainer.style.display = 'flex';
  textContainer.style.flexDirection = 'column';
  textContainer.style.alignItems = 'center';
  textContainer.style.width = '80%';
  wrapper.appendChild(textContainer);
  
  // Create text elements
  const textElements = [];
  const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6'];
  
  displayWords.forEach((word, i) => {
    const textEl = document.createElement('div');
    textEl.textContent = word;
    textEl.style.fontSize = '18px';
    textEl.style.margin = '8px';
    textEl.style.padding = '10px 20px';
    textEl.style.borderRadius = '4px';
    textEl.style.background = colors[i % colors.length];
    textEl.style.color = '#fff';
    textEl.style.opacity = '0';
    textEl.style.transform = 'translateX(-20px)';
    textEl.style.width = '80%';
    textEl.style.textAlign = 'center';
    textContainer.appendChild(textEl);
    textElements.push(textEl);
  });
  
  // Create animation
  const animation = anime.timeline({
    loop: true
  });
  
  animation.add({
    targets: title,
    opacity: [0, 1],
    translateY: [-30, 0],
    duration: 1000,
    easing: 'easeOutElastic(1, .8)'
  })
  .add({
    targets: textElements,
    opacity: [0, 1],
    translateX: [-20, 0],
    delay: anime.stagger(200),
    duration: 800,
    easing: 'easeOutQuad'
  })
  .add({
    targets: textElements,
    scale: [1, 1.05],
    delay: anime.stagger(200),
    duration: 400,
    easing: 'easeInOutQuad'
  })
  .add({
    delay: 1000
  })
  .add({
    targets: textElements,
    opacity: [1, 0],
    translateX: [0, 20],
    delay: anime.stagger(200),
    duration: 800,
    easing: 'easeInQuad'
  })
  .add({
    targets: title,
    opacity: [1, 0],
    translateY: [0, 30],
    duration: 1000,
    easing: 'easeInQuad'
  });
  
  return animation;
}
`;

// Get a random animation template
export const getRandomTemplate = (): string => {
  const templates = [
    basicCirclesAnimation, 
    textRevealAnimation, 
    dataVisualizationAnimation,
    customTextAnimation // Add the new customizable template
  ];
  const randomIndex = Math.floor(Math.random() * templates.length);
  return templates[randomIndex];
};