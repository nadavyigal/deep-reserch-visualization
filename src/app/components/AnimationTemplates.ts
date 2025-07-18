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

export const advancedTextAnimation = `
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
  
  // Extract keywords from parent container's text
  let keywords = ['concept', 'research', 'analysis', 'data', 'visualization'];
  
  // Look for text in parent elements
  let parentElement = container.parentElement;
  while (parentElement) {
    const textContent = parentElement.textContent || '';
    if (textContent.length > 20) {
      // Extract words from text content
      const words = textContent
        .toLowerCase()
        .replace(/[^\\w\\s]/g, '')
        .split(/\\s+/)
        .filter(word => 
          word.length > 3 && 
          !['and', 'the', 'this', 'that', 'with', 'from', 'have', 'for'].includes(word)
        );
      
      if (words.length >= 3) {
        // Get most frequent words
        const wordCount = {};
        words.forEach(word => {
          wordCount[word] = (wordCount[word] || 0) + 1;
        });
        
        keywords = Object.entries(wordCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(entry => entry[0]);
          
        break;
      }
    }
    parentElement = parentElement.parentElement;
  }
  
  // Create central node
  const centralNode = document.createElement('div');
  centralNode.textContent = 'Key Concepts';
  centralNode.style.position = 'absolute';
  centralNode.style.left = '50%';
  centralNode.style.top = '50%';
  centralNode.style.transform = 'translate(-50%, -50%)';
  centralNode.style.padding = '12px 20px';
  centralNode.style.borderRadius = '20px';
  centralNode.style.backgroundColor = '#1e293b';
  centralNode.style.color = 'white';
  centralNode.style.fontWeight = 'bold';
  centralNode.style.fontSize = '18px';
  centralNode.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
  centralNode.style.zIndex = '10';
  centralNode.style.opacity = '0';
  wrapper.appendChild(centralNode);
  
  // Create SVG for lines
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.style.position = 'absolute';
  svg.style.top = '0';
  svg.style.left = '0';
  svg.style.zIndex = '5';
  wrapper.appendChild(svg);
  
  // Create keyword nodes and connecting lines
  const keywordNodes = [];
  const lines = [];
  
  keywords.forEach((keyword, index) => {
    // Create keyword node
    const node = document.createElement('div');
    node.textContent = keyword;
    node.style.position = 'absolute';
    node.style.padding = '8px 16px';
    node.style.borderRadius = '16px';
    node.style.backgroundColor = '#f1f5f9';
    node.style.color = '#334155';
    node.style.fontWeight = '500';
    node.style.fontSize = '14px';
    node.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
    node.style.zIndex = '10';
    node.style.opacity = '0';
    wrapper.appendChild(node);
    keywordNodes.push(node);
    
    // Create connecting line
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('stroke', 'rgba(99, 102, 241, 0.4)');
    line.setAttribute('stroke-width', '2');
    line.setAttribute('stroke-dasharray', '4');
    svg.appendChild(line);
    lines.push(line);
  });
  
  // Position nodes in a circle around the central node
  const radius = Math.min(wrapper.offsetWidth, wrapper.offsetHeight) * 0.35;
  keywordNodes.forEach((node, index) => {
    const angle = (index / keywords.length) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    
    node.style.left = \`calc(50% + \${x}px)\`;
    node.style.top = \`calc(50% + \${y}px)\`;
    node.style.transform = 'translate(-50%, -50%)';
  });
  
  // Update line positions
  const updateLines = () => {
    const centralRect = centralNode.getBoundingClientRect();
    const centralX = centralRect.left + centralRect.width / 2;
    const centralY = centralRect.top + centralRect.height / 2;
    
    keywordNodes.forEach((node, index) => {
      const nodeRect = node.getBoundingClientRect();
      const nodeX = nodeRect.left + nodeRect.width / 2;
      const nodeY = nodeRect.top + nodeRect.height / 2;
      
      // Convert to SVG coordinate space
      const svgRect = svg.getBoundingClientRect();
      const x1 = centralX - svgRect.left;
      const y1 = centralY - svgRect.top;
      const x2 = nodeX - svgRect.left;
      const y2 = nodeY - svgRect.top;
      
      lines[index].setAttribute('x1', x1);
      lines[index].setAttribute('y1', y1);
      lines[index].setAttribute('x2', x2);
      lines[index].setAttribute('y2', y2);
    });
  };
  
  // Animation timeline
  const timeline = anime.timeline({
    easing: 'easeOutElastic(1, .5)',
    update: updateLines
  });
  
  // Animate central node
  timeline.add({
    targets: centralNode,
    scale: [0, 1],
    opacity: [0, 1],
    duration: 800
  });
  
  // Animate keyword nodes
  timeline.add({
    targets: keywordNodes,
    opacity: [0, 1],
    scale: [0, 1],
    delay: anime.stagger(100),
    duration: 600
  }, '-=400');
  
  // Animate lines
  timeline.add({
    targets: lines,
    opacity: [0, 1],
    strokeDashoffset: [anime.setDashoffset, 0],
    delay: anime.stagger(100),
    duration: 600
  }, '-=600');
  
  // Add pulsing animation to central node
  timeline.add({
    targets: centralNode,
    scale: [1, 1.1, 1],
    duration: 1500,
    loop: true,
    easing: 'easeInOutQuad'
  });
  
  // Initial update of lines
  setTimeout(updateLines, 100);
  
  // Update lines on window resize
  window.addEventListener('resize', updateLines);
  
  return timeline;
}
`;

// Define animation templates for specific content types
export const flowProcessAnimation = `
function createAnimation(anime, container, options = {}) {
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
  
  // Extract keywords or use defaults
  const keywords = options.keywords || ['Step 1', 'Step 2', 'Step 3', 'Step 4', 'Step 5'];
  
  // Create process flow elements
  const processSteps = [];
  const arrows = [];
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  
  // Create title
  const title = document.createElement('div');
  title.textContent = 'Process Flow';
  title.style.position = 'absolute';
  title.style.top = '10px';
  title.style.left = '50%';
  title.style.transform = 'translateX(-50%)';
  title.style.fontSize = '18px';
  title.style.fontWeight = 'bold';
  title.style.opacity = '0';
  wrapper.appendChild(title);
  
  // Create process steps
  keywords.slice(0, 5).forEach((keyword, index) => {
    const step = document.createElement('div');
    step.textContent = keyword;
    step.style.position = 'absolute';
    step.style.padding = '10px 15px';
    step.style.borderRadius = '8px';
    step.style.backgroundColor = colors[index % colors.length];
    step.style.color = 'white';
    step.style.fontWeight = 'bold';
    step.style.fontSize = '14px';
    step.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    step.style.opacity = '0';
    step.style.zIndex = '2';
    
    // Position steps in a horizontal line
    const stepWidth = 120;
    const totalWidth = Math.min(keywords.length, 5) * stepWidth;
    const startX = (wrapper.offsetWidth - totalWidth) / 2;
    step.style.left = (startX + index * stepWidth) + 'px';
    step.style.top = '50%';
    step.style.transform = 'translateY(-50%)';
    
    wrapper.appendChild(step);
    processSteps.push(step);
    
    // Create arrow (except for the last step)
    if (index < keywords.length - 1 && index < 4) {
      const arrow = document.createElement('div');
      arrow.style.position = 'absolute';
      arrow.style.width = '30px';
      arrow.style.height = '2px';
      arrow.style.backgroundColor = '#94a3b8';
      arrow.style.left = (startX + index * stepWidth + 100) + 'px';
      arrow.style.top = '50%';
      arrow.style.zIndex = '1';
      arrow.style.opacity = '0';
      
      // Add arrow head
      const arrowHead = document.createElement('div');
      arrowHead.style.position = 'absolute';
      arrowHead.style.right = '0';
      arrowHead.style.top = '-3px';
      arrowHead.style.width = '0';
      arrowHead.style.height = '0';
      arrowHead.style.borderTop = '4px solid transparent';
      arrowHead.style.borderBottom = '4px solid transparent';
      arrowHead.style.borderLeft = '6px solid #94a3b8';
      arrow.appendChild(arrowHead);
      
      wrapper.appendChild(arrow);
      arrows.push(arrow);
    }
  });
  
  // Animation timeline
  const timeline = anime.timeline({
    easing: 'easeOutQuad'
  });
  
  // Animate title
  timeline.add({
    targets: title,
    opacity: [0, 1],
    translateY: [-10, 0],
    duration: 800
  });
  
  // Animate process steps
  timeline.add({
    targets: processSteps,
    opacity: [0, 1],
    translateY: ['-60%', '-50%'],
    delay: anime.stagger(200),
    duration: 800
  }, '-=400');
  
  // Animate arrows
  timeline.add({
    targets: arrows,
    opacity: [0, 1],
    width: [0, 30],
    duration: 600,
    delay: anime.stagger(200)
  }, '-=600');
  
  // Add highlight animation
  timeline.add({
    targets: processSteps,
    scale: [1, 1.05, 1],
    backgroundColor: (el, i) => {
      const color = colors[i % colors.length];
      return [color, '#6366f1', color];
    },
    delay: anime.stagger(400),
    duration: 1200
  });
  
  return timeline;
}
`;

export const networkConnectionAnimation = `
function createAnimation(anime, container, options = {}) {
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
  
  // Extract keywords or use defaults
  const keywords = options.keywords || ['Node 1', 'Node 2', 'Node 3', 'Node 4', 'Node 5', 'Node 6'];
  
  // Create SVG for the network
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.style.position = 'absolute';
  svg.style.top = '0';
  svg.style.left = '0';
  wrapper.appendChild(svg);
  
  // Create nodes
  const nodes = [];
  const nodeElements = [];
  const connections = [];
  const nodeRadius = 30;
  
  // Create node positions in a network layout
  keywords.slice(0, 8).forEach((keyword, index) => {
    // Create positions in a circular or force-directed-like layout
    let x, y;
    
    if (index === 0) {
      // Center node
      x = wrapper.offsetWidth / 2;
      y = wrapper.offsetHeight / 2;
    } else {
      // Surrounding nodes in a circle
      const angle = ((index - 1) / (keywords.length - 1)) * Math.PI * 2;
      const radius = Math.min(wrapper.offsetWidth, wrapper.offsetHeight) * 0.35;
      x = wrapper.offsetWidth / 2 + Math.cos(angle) * radius;
      y = wrapper.offsetHeight / 2 + Math.sin(angle) * radius;
    }
    
    nodes.push({ x, y, keyword });
    
    // Create node element
    const node = document.createElement('div');
    node.textContent = keyword;
    node.style.position = 'absolute';
    node.style.left = x + 'px';
    node.style.top = y + 'px';
    node.style.transform = 'translate(-50%, -50%)';
    node.style.width = (nodeRadius * 2) + 'px';
    node.style.height = (nodeRadius * 2) + 'px';
    node.style.borderRadius = '50%';
    node.style.backgroundColor = index === 0 ? '#3b82f6' : '#f1f5f9';
    node.style.color = index === 0 ? 'white' : '#334155';
    node.style.display = 'flex';
    node.style.alignItems = 'center';
    node.style.justifyContent = 'center';
    node.style.fontSize = '12px';
    node.style.fontWeight = 'bold';
    node.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    node.style.opacity = '0';
    node.style.zIndex = '2';
    wrapper.appendChild(node);
    nodeElements.push(node);
    
    // Create connections to center node
    if (index > 0) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', nodes[0].x);
      line.setAttribute('y1', nodes[0].y);
      line.setAttribute('x2', x);
      line.setAttribute('y2', y);
      line.setAttribute('stroke', '#cbd5e1');
      line.setAttribute('stroke-width', '2');
      line.setAttribute('stroke-dasharray', '5,5');
      line.setAttribute('opacity', '0');
      svg.appendChild(line);
      connections.push(line);
    }
  });
  
  // Animation timeline
  const timeline = anime.timeline({
    easing: 'easeOutElastic(1, .5)'
  });
  
  // Animate center node first
  timeline.add({
    targets: nodeElements[0],
    opacity: [0, 1],
    scale: [0, 1],
    duration: 800
  });
  
  // Animate other nodes
  timeline.add({
    targets: nodeElements.slice(1),
    opacity: [0, 1],
    scale: [0, 1],
    delay: anime.stagger(100),
    duration: 600
  }, '-=400');
  
  // Animate connections
  timeline.add({
    targets: connections,
    opacity: [0, 0.7],
    strokeDashoffset: [anime.setDashoffset, 0],
    duration: 600,
    delay: anime.stagger(100)
  }, '-=600');
  
  // Add pulse animation to center node
  timeline.add({
    targets: nodeElements[0],
    scale: [1, 1.1, 1],
    duration: 1500,
    loop: true,
    easing: 'easeInOutQuad'
  });
  
  // Add data flow animation along connections
  connections.forEach((connection, index) => {
    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    marker.setAttribute('r', '3');
    marker.setAttribute('fill', '#3b82f6');
    marker.setAttribute('opacity', '0');
    svg.appendChild(marker);
    
    const markerAnimation = anime({
      targets: marker,
      opacity: [0, 1, 0],
      easing: 'linear',
      duration: 2000,
      loop: true,
      delay: index * 300,
      update: function(anim) {
        const startX = parseFloat(connection.getAttribute('x1'));
        const startY = parseFloat(connection.getAttribute('y1'));
        const endX = parseFloat(connection.getAttribute('x2'));
        const endY = parseFloat(connection.getAttribute('y2'));
        
        const progress = anim.progress / 100;
        const x = startX + (endX - startX) * progress;
        const y = startY + (endY - startY) * progress;
        
        marker.setAttribute('cx', x);
        marker.setAttribute('cy', y);
      }
    });
  });
  
  return timeline;
}
`;

export const timelineAnimation = `
function createAnimation(anime, container, options = {}) {
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
  
  // Extract keywords or use defaults
  const keywords = options.keywords || ['Phase 1', 'Phase 2', 'Phase 3', 'Phase 4', 'Phase 5'];
  
  // Create timeline elements
  const timelineContainer = document.createElement('div');
  timelineContainer.style.position = 'relative';
  timelineContainer.style.width = '80%';
  timelineContainer.style.height = '150px';
  wrapper.appendChild(timelineContainer);
  
  // Create timeline line
  const line = document.createElement('div');
  line.style.position = 'absolute';
  line.style.top = '50%';
  line.style.left = '0';
  line.style.width = '0%'; // Start at 0 width for animation
  line.style.height = '4px';
  line.style.backgroundColor = '#cbd5e1';
  line.style.borderRadius = '2px';
  timelineContainer.appendChild(line);
  
  // Create timeline points and labels
  const points = [];
  const labels = [];
  
  keywords.slice(0, 5).forEach((keyword, index) => {
    const position = index / (Math.min(keywords.length, 5) - 1) * 100;
    
    // Create point
    const point = document.createElement('div');
    point.style.position = 'absolute';
    point.style.top = '50%';
    point.style.left = position + '%';
    point.style.width = '16px';
    point.style.height = '16px';
    point.style.borderRadius = '50%';
    point.style.backgroundColor = '#3b82f6';
    point.style.transform = 'translate(-50%, -50%)';
    point.style.opacity = '0';
    point.style.zIndex = '2';
    timelineContainer.appendChild(point);
    points.push(point);
    
    // Create label
    const label = document.createElement('div');
    label.textContent = keyword;
    label.style.position = 'absolute';
    label.style.top = index % 2 === 0 ? 'calc(50% + 20px)' : 'calc(50% - 40px)';
    label.style.left = position + '%';
    label.style.transform = 'translateX(-50%)';
    label.style.fontSize = '14px';
    label.style.fontWeight = 'bold';
    label.style.color = '#334155';
    label.style.opacity = '0';
    label.style.textAlign = 'center';
    label.style.width = '100px';
    timelineContainer.appendChild(label);
    labels.push(label);
    
    // Create connecting line to label
    const connector = document.createElement('div');
    connector.style.position = 'absolute';
    connector.style.top = '50%';
    connector.style.left = position + '%';
    connector.style.width = '2px';
    connector.style.height = index % 2 === 0 ? '20px' : '40px';
    connector.style.backgroundColor = '#cbd5e1';
    connector.style.transform = index % 2 === 0 ? 'translateX(-50%)' : 'translateX(-50%) translateY(-100%)';
    connector.style.opacity = '0';
    timelineContainer.appendChild(connector);
    labels.push(connector); // Add to labels array for animation
  });
  
  // Animation timeline
  const timeline = anime.timeline({
    easing: 'easeOutQuad'
  });
  
  // Animate the timeline line
  timeline.add({
    targets: line,
    width: ['0%', '100%'],
    duration: 1000
  });
  
  // Animate points
  timeline.add({
    targets: points,
    opacity: [0, 1],
    scale: [0, 1],
    delay: anime.stagger(200),
    duration: 600
  }, '-=800');
  
  // Animate labels and connectors
  timeline.add({
    targets: labels,
    opacity: [0, 1],
    translateY: function(el, i) {
      if (i % 2 === 0) return [0, 0]; // Connectors
      return (i % 4 < 2) ? [10, 0] : [-10, 0]; // Labels
    },
    delay: anime.stagger(200, {start: 200}),
    duration: 600
  }, '-=800');
  
  // Add highlight animation
  timeline.add({
    targets: points,
    scale: [1, 1.3, 1],
    backgroundColor: ['#3b82f6', '#8b5cf6', '#3b82f6'],
    delay: anime.stagger(400),
    duration: 1000
  });
  
  return timeline;
}
`;

// Get a random animation template based on the animation type
export const getRandomTemplate = (animationType: string = 'concept'): string => {
  // Select template based on animation type
  switch (animationType) {
    case 'data':
      return dataVisualizationAnimation;
    case 'process':
      return flowProcessAnimation;
    case 'network':
      return networkConnectionAnimation;
    case 'timeline':
      return timelineAnimation;
    case 'concept':
      return advancedTextAnimation;
    default:
      // Fallback to random selection for unknown types
      if (Math.random() > 0.3) {
        return advancedTextAnimation;
      }
      
      const templates = [
        basicCirclesAnimation,
        textRevealAnimation,
        dataVisualizationAnimation
      ];
      
  const randomIndex = Math.floor(Math.random() * templates.length);
  return templates[randomIndex];
  }
}; 