/**
 * Default animations for different section types
 * These will be used when no custom animation is provided
 */

export const neuralNetworkAnimation = `
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
  wrapper.style.minHeight = '250px';
  container.appendChild(wrapper);
  
  // Create the neural network structure
  const networkContainer = document.createElement('div');
  networkContainer.style.display = 'flex';
  networkContainer.style.flexDirection = 'row';
  networkContainer.style.justifyContent = 'space-between';
  networkContainer.style.width = '90%';
  networkContainer.style.height = '200px';
  wrapper.appendChild(networkContainer);
  
  // Create layers
  const layers = [];
  const layerCounts = [4, 6, 6, 4]; // Number of nodes in each layer
  
  for (let i = 0; i < layerCounts.length; i++) {
    const layer = document.createElement('div');
    layer.style.display = 'flex';
    layer.style.flexDirection = 'column';
    layer.style.justifyContent = 'space-around';
    layer.style.height = '100%';
    networkContainer.appendChild(layer);
    
    const nodes = [];
    
    // Create nodes for this layer
    for (let j = 0; j < layerCounts[i]; j++) {
      const node = document.createElement('div');
      node.style.width = '20px';
      node.style.height = '20px';
      node.style.borderRadius = '50%';
      node.style.backgroundColor = i === 0 ? '#6366F1' : 
                                  i === layerCounts.length - 1 ? '#F87171' : 
                                  '#60A5FA';
      node.style.margin = '5px';
      node.style.opacity = '0';
      layer.appendChild(node);
      nodes.push(node);
    }
    
    layers.push(nodes);
  }
  
  // Create connections between layers
  const connections = [];
  
  for (let i = 0; i < layers.length - 1; i++) {
    const fromLayer = layers[i];
    const toLayer = layers[i + 1];
    
    for (let j = 0; j < fromLayer.length; j++) {
      for (let k = 0; k < toLayer.length; k++) {
        const connection = document.createElement('div');
        connection.style.position = 'absolute';
        connection.style.height = '2px';
        connection.style.backgroundColor = '#CBD5E1';
        connection.style.transformOrigin = 'left center';
        connection.style.opacity = '0';
        
        wrapper.appendChild(connection);
        connections.push({
          element: connection,
          from: fromLayer[j],
          to: toLayer[k]
        });
      }
    }
  }
  
  // Function to position connections
  const positionConnections = () => {
    connections.forEach(conn => {
      const fromRect = conn.from.getBoundingClientRect();
      const toRect = conn.to.getBoundingClientRect();
      const wrapperRect = wrapper.getBoundingClientRect();
      
      const fromX = fromRect.left + fromRect.width / 2 - wrapperRect.left;
      const fromY = fromRect.top + fromRect.height / 2 - wrapperRect.top;
      const toX = toRect.left + toRect.width / 2 - wrapperRect.left;
      const toY = toRect.top + toRect.height / 2 - wrapperRect.top;
      
      const length = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
      const angle = Math.atan2(toY - fromY, toX - fromX) * 180 / Math.PI;
      
      conn.element.style.width = length + 'px';
      conn.element.style.left = fromX + 'px';
      conn.element.style.top = fromY + 'px';
      conn.element.style.transform = 'rotate(' + angle + 'deg)';
    });
  };
  
  // Position connections initially
  setTimeout(positionConnections, 0);
  
  // Update positions on window resize
  window.addEventListener('resize', positionConnections);
  
  // Create animation
  const animation = anime.timeline({
    loop: true
  });
  
  // Animate nodes appearing
  animation.add({
    targets: [...layers.flat()],
    opacity: [0, 1],
    scale: [0, 1],
    delay: anime.stagger(50, {grid: layers.map(l => l.length), from: 'center'}),
    duration: 800,
    easing: 'easeOutElastic(1, .5)'
  })
  // Animate connections appearing
  .add({
    targets: connections.map(c => c.element),
    opacity: [0, 0.6],
    duration: 800,
    delay: anime.stagger(10),
    easing: 'easeInOutQuad'
  }, '-=400')
  // Animate data flowing through the network
  .add({
    targets: connections.map(c => c.element),
    backgroundColor: ['#CBD5E1', '#3B82F6', '#CBD5E1'],
    duration: 1500,
    delay: anime.stagger(100, {from: 'center'}),
    easing: 'easeInOutSine'
  })
  // Pulse the output nodes
  .add({
    targets: layers[layers.length - 1],
    scale: [1, 1.2, 1],
    backgroundColor: ['#F87171', '#EF4444', '#F87171'],
    duration: 800,
    easing: 'easeInOutQuad'
  }, '-=1000');
  
  return animation;
}
`;

export const climateChangeAnimation = `
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
  wrapper.style.minHeight = '250px';
  container.appendChild(wrapper);
  
  // Create the central concept
  const centralConcept = document.createElement('div');
  centralConcept.textContent = 'Climate Change';
  centralConcept.style.position = 'absolute';
  centralConcept.style.padding = '15px 25px';
  centralConcept.style.borderRadius = '30px';
  centralConcept.style.backgroundColor = '#1E293B';
  centralConcept.style.color = 'white';
  centralConcept.style.fontWeight = 'bold';
  centralConcept.style.fontSize = '18px';
  centralConcept.style.zIndex = '10';
  centralConcept.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  wrapper.appendChild(centralConcept);
  
  // Create the factors
  const factors = [
    { text: 'Greenhouse Gases', angle: 0 },
    { text: 'Rising Temperatures', angle: 45 },
    { text: 'Deforestation', angle: 90 },
    { text: 'Ocean Acidification', angle: 135 },
    { text: 'Extreme Weather', angle: 180 },
    { text: 'Sea Level Rise', angle: 225 },
    { text: 'Melting Ice Caps', angle: 270 },
    { text: 'Biodiversity Loss', angle: 315 }
  ];
  
  const factorElements = [];
  const connectionElements = [];
  
  factors.forEach((factor, index) => {
    // Create factor element
    const factorEl = document.createElement('div');
    factorEl.textContent = factor.text;
    factorEl.style.position = 'absolute';
    factorEl.style.padding = '8px 15px';
    factorEl.style.borderRadius = '20px';
    factorEl.style.backgroundColor = '#E2E8F0';
    factorEl.style.color = '#334155';
    factorEl.style.fontWeight = '500';
    factorEl.style.fontSize = '14px';
    factorEl.style.opacity = '0';
    factorEl.style.transform = 'scale(0.8)';
    factorEl.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
    
    // Position in a circle around the central concept
    const radius = 150;
    const angleRad = (factor.angle * Math.PI) / 180;
    const x = radius * Math.cos(angleRad);
    const y = radius * Math.sin(angleRad);
    
    factorEl.style.transform = 'translate(-50%, -50%)';
    factorEl.style.left = 'calc(50% + ' + x + 'px)';
    factorEl.style.top = 'calc(50% + ' + y + 'px)';
    
    wrapper.appendChild(factorEl);
    factorElements.push(factorEl);
    
    // Create connection line
    const connection = document.createElement('div');
    connection.style.position = 'absolute';
    connection.style.width = radius + 'px';
    connection.style.height = '2px';
    connection.style.backgroundColor = '#94A3B8';
    connection.style.opacity = '0';
    connection.style.transformOrigin = 'left center';
    connection.style.left = '50%';
    connection.style.top = '50%';
    connection.style.transform = 'rotate(' + factor.angle + 'deg)';
    
    wrapper.appendChild(connection);
    connectionElements.push(connection);
  });
  
  // Create animation
  const animation = anime.timeline({
    loop: true
  });
  
  // Animate central concept
  animation.add({
    targets: centralConcept,
    scale: [0, 1],
    opacity: [0, 1],
    duration: 800,
    easing: 'easeOutElastic(1, .5)'
  })
  // Animate connections
  .add({
    targets: connectionElements,
    opacity: [0, 0.7],
    duration: 600,
    delay: anime.stagger(100),
    easing: 'easeInOutQuad'
  }, '-=400')
  // Animate factors
  .add({
    targets: factorElements,
    opacity: [0, 1],
    scale: [0.8, 1],
    duration: 800,
    delay: anime.stagger(150),
    easing: 'easeOutElastic(1, .5)'
  }, '-=600')
  // Pulse the central concept
  .add({
    targets: centralConcept,
    backgroundColor: ['#1E293B', '#0F172A', '#1E293B'],
    scale: [1, 1.05, 1],
    duration: 2000,
    easing: 'easeInOutSine'
  })
  // Highlight connections one by one
  .add({
    targets: connectionElements,
    backgroundColor: function(el, i) {
      return ['#94A3B8', '#3B82F6', '#94A3B8'];
    },
    opacity: function(el, i) {
      return [0.7, 1, 0.7];
    },
    duration: 1000,
    delay: anime.stagger(200),
    easing: 'easeInOutSine'
  }, '-=1500')
  // Highlight factors one by one
  .add({
    targets: factorElements,
    backgroundColor: function(el, i) {
      return ['#E2E8F0', '#BFDBFE', '#E2E8F0'];
    },
    scale: function(el, i) {
      return [1, 1.1, 1];
    },
    duration: 800,
    delay: anime.stagger(200),
    easing: 'easeInOutQuad'
  }, '-=2000');
  
  return animation;
}
`;

export const getDefaultAnimationForSection = (sectionTitle: string): string => {
  const title = sectionTitle.toLowerCase();
  
  if (title.includes('neural') || title.includes('network') || title.includes('learning')) {
    return neuralNetworkAnimation;
  }
  
  if (title.includes('climate') || title.includes('change') || title.includes('environment')) {
    return climateChangeAnimation;
  }
  
  // Default animation if no match
  return neuralNetworkAnimation;
}; 