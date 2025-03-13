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

// Advanced text animation with icons and cards
export const advancedTextAnimation = `
function createAnimation(anime, container) {
  // Extract text from the container's parent or use default text
  const parentText = container.parentElement?.textContent?.trim() || '';
  
  // Remove common stop words
  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 
    'be', 'been', 'being', 'to', 'of', 'for', 'with', 'by', 'about', 
    'against', 'between', 'into', 'through', 'during', 'before', 'after',
    'above', 'below', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over',
    'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when',
    'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more',
    'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own',
    'same', 'so', 'than', 'too', 'very', 'can', 'will', 'just', 'should',
    'now', 'this', 'that', 'these', 'those'
  ]);
  
  // Split text into words, filter out stop words and short words
  const words = parentText
    .replace(/[^\\w\\s]/g, '') // Remove punctuation
    .split(/\\s+/)
    .filter(word => word.length > 3 && !stopWords.has(word.toLowerCase()))
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)); // Capitalize first letter
  
  // Count word frequency
  const wordCount = new Map();
  words.forEach(word => {
    wordCount.set(word, (wordCount.get(word) || 0) + 1);
  });
  
  // Sort by frequency and get top words
  const displayWords = Array.from(wordCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(entry => entry[0]);
  
  // If no words found, use default words
  if (displayWords.length === 0) {
    displayWords.push('Visualization', 'Animation', 'Interactive', 'Dynamic', 'Content', 'Data');
  }
  
  // Create wrapper
  const wrapper = document.createElement('div');
  wrapper.style.position = 'relative';
  wrapper.style.width = '100%';
  wrapper.style.height = '100%';
  wrapper.style.display = 'flex';
  wrapper.style.flexDirection = 'column';
  wrapper.style.alignItems = 'center';
  wrapper.style.justifyContent = 'center';
  wrapper.style.overflow = 'hidden';
  wrapper.style.padding = '20px';
  container.appendChild(wrapper);
  
  // Create title
  const title = document.createElement('h2');
  title.textContent = 'Key Concepts';
  title.style.fontSize = '24px';
  title.style.fontWeight = 'bold';
  title.style.color = '#3498db';
  title.style.opacity = '0';
  title.style.marginBottom = '30px';
  title.style.textAlign = 'center';
  wrapper.appendChild(title);
  
  // Create concept container
  const conceptContainer = document.createElement('div');
  conceptContainer.style.display = 'flex';
  conceptContainer.style.flexWrap = 'wrap';
  conceptContainer.style.justifyContent = 'center';
  conceptContainer.style.alignItems = 'center';
  conceptContainer.style.width = '100%';
  conceptContainer.style.maxWidth = '600px';
  wrapper.appendChild(conceptContainer);
  
  // Create concept elements
  const conceptElements = [];
  const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];
  
  displayWords.forEach((word, i) => {
    // Create concept card
    const card = document.createElement('div');
    card.style.backgroundColor = colors[i % colors.length];
    card.style.color = '#fff';
    card.style.padding = '12px 20px';
    card.style.margin = '10px';
    card.style.borderRadius = '8px';
    card.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    card.style.opacity = '0';
    card.style.transform = 'scale(0.8)';
    card.style.display = 'flex';
    card.style.alignItems = 'center';
    card.style.justifyContent = 'center';
    card.style.minWidth = '120px';
    card.style.textAlign = 'center';
    
    // Create icon based on word index
    const icon = document.createElement('div');
    icon.style.marginRight = '10px';
    icon.style.fontSize = '20px';
    
    // Simple icon mapping
    const icons = ['📊', '🔍', '📈', '🔄', '📱', '🌟'];
    icon.textContent = icons[i % icons.length];
    
    card.appendChild(icon);
    
    // Create text element
    const textEl = document.createElement('span');
    textEl.textContent = word;
    textEl.style.fontSize = '16px';
    textEl.style.fontWeight = '500';
    
    card.appendChild(textEl);
    conceptContainer.appendChild(card);
    conceptElements.push(card);
  });
  
  // Create visual elements
  const visualContainer = document.createElement('div');
  visualContainer.style.position = 'absolute';
  visualContainer.style.top = '0';
  visualContainer.style.left = '0';
  visualContainer.style.width = '100%';
  visualContainer.style.height = '100%';
  visualContainer.style.pointerEvents = 'none';
  visualContainer.style.zIndex = '-1';
  wrapper.appendChild(visualContainer);
  
  // Create decorative elements
  const decorElements = [];
  for (let i = 0; i < 15; i++) {
    const decor = document.createElement('div');
    decor.style.position = 'absolute';
    decor.style.borderRadius = '50%';
    decor.style.opacity = '0';
    
    // Randomize size
    const size = 5 + Math.random() * 15;
    decor.style.width = \`\${size}px\`;
    decor.style.height = \`\${size}px\`;
    
    // Randomize position
    decor.style.left = \`\${Math.random() * 100}%\`;
    decor.style.top = \`\${Math.random() * 100}%\`;
    
    // Use colors from the concepts
    decor.style.backgroundColor = colors[i % colors.length];
    
    visualContainer.appendChild(decor);
    decorElements.push(decor);
  }
  
  // Create animation
  const timeline = anime.timeline({
    loop: true,
    easing: 'easeOutExpo'
  });
  
  // Animate title
  timeline.add({
    targets: title,
    opacity: [0, 1],
    translateY: [-30, 0],
    duration: 1000,
    easing: 'easeOutElastic(1, .8)'
  })
  
  // Animate concept cards
  .add({
    targets: conceptElements,
    opacity: [0, 1],
    scale: [0.8, 1],
    delay: anime.stagger(150),
    duration: 800,
    easing: 'easeOutElastic(1, .6)'
  })
  
  // Animate decorative elements
  .add({
    targets: decorElements,
    opacity: [0, 0.6],
    scale: [0, 1],
    delay: anime.stagger(50),
    duration: 600,
    easing: 'easeOutQuad'
  }, '-=400')
  
  // Animate concept cards hover effect
  .add({
    targets: conceptElements,
    scale: [1, 1.05],
    boxShadow: ['0 4px 6px rgba(0, 0, 0, 0.1)', '0 8px 15px rgba(0, 0, 0, 0.2)'],
    delay: anime.stagger(150),
    duration: 800,
    easing: 'easeInOutQuad'
  })
  
  // Pause for a moment
  .add({
    duration: 1000
  })
  
  // Animate concept cards out
  .add({
    targets: conceptElements,
    opacity: [1, 0],
    scale: [1.05, 0.8],
    delay: anime.stagger(100),
    duration: 600,
    easing: 'easeInQuad'
  })
  
  // Animate decorative elements out
  .add({
    targets: decorElements,
    opacity: [0.6, 0],
    scale: [1, 0],
    delay: anime.stagger(50),
    duration: 400,
    easing: 'easeInQuad'
  }, '-=400')
  
  // Animate title out
  .add({
    targets: title,
    opacity: [1, 0],
    translateY: [0, 30],
    duration: 800,
    easing: 'easeInQuad'
  }, '-=200');
  
  return timeline;
}
`;

// Get a random animation template
export const getRandomTemplate = (): string => {
  const templates = [
    advancedTextAnimation, // Prioritize the advanced text animation
    customTextAnimation,
    dataVisualizationAnimation,
    textRevealAnimation,
    basicCirclesAnimation
  ];
  
  // Return the advanced text animation most of the time
  if (Math.random() < 0.7) {
    return templates[0];
  }
  
  // Otherwise return a random template
  const randomIndex = Math.floor(Math.random() * templates.length);
  return templates[randomIndex];
};