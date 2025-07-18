export interface FlowchartTemplate {
    id: string;
    name: string;
    description: string;
    code: string;
  }
  
  export const flowchartTemplates: FlowchartTemplate[] = [
    {
      id: "simple-process",
      name: "Simple Process",
      description: "Basic flowchart with start, process and decision",
      code: `
  function createSimpleProcessFlowchart(container) {
    // Create elements
    const startNode = document.createElement('div');
    startNode.className = 'node start-node';
    startNode.textContent = 'Start';
    
    const processNode = document.createElement('div');
    processNode.className = 'node process-node';
    processNode.textContent = 'Process';
    
    const decisionNode = document.createElement('div');
    decisionNode.className = 'node decision-node';
    decisionNode.textContent = 'Decision?';
    
    const endNode = document.createElement('div');
    endNode.className = 'node end-node';
    endNode.textContent = 'End';
    
    const yesNode = document.createElement('div');
    yesNode.className = 'node mini-node';
    yesNode.textContent = 'Yes';
    
    const noNode = document.createElement('div');
    noNode.className = 'node mini-node';
    noNode.textContent = 'No';
    
    // Add elements to container
    container.appendChild(startNode);
    container.appendChild(processNode);
    container.appendChild(decisionNode);
    container.appendChild(endNode);
    container.appendChild(yesNode);
    container.appendChild(noNode);
    
    // Basic styling
    container.style.position = 'relative';
    container.style.height = '400px';
    container.style.width = '100%';
    
    // Position elements
    startNode.style.position = 'absolute';
    startNode.style.top = '20px';
    startNode.style.left = '50%';
    startNode.style.transform = 'translateX(-50%)';
    
    processNode.style.position = 'absolute';
    processNode.style.top = '100px';
    processNode.style.left = '50%';
    processNode.style.transform = 'translateX(-50%)';
    
    decisionNode.style.position = 'absolute';
    decisionNode.style.top = '180px';
    decisionNode.style.left = '50%';
    decisionNode.style.transform = 'translateX(-50%)';
    
    yesNode.style.position = 'absolute';
    yesNode.style.top = '180px';
    yesNode.style.left = '65%';
    
    noNode.style.position = 'absolute';
    noNode.style.top = '180px';
    noNode.style.left = '35%';
    
    endNode.style.position = 'absolute';
    endNode.style.top = '260px';
    endNode.style.left = '50%';
    endNode.style.transform = 'translateX(-50%)';
    
    // Animation with anime.js
    anime({
      targets: [startNode, processNode, decisionNode, endNode],
      translateY: [50, 0],
      opacity: [0, 1],
      delay: anime.stagger(200),
      easing: 'easeOutQuad',
      duration: 800
    });
    
    anime({
      targets: [yesNode, noNode],
      opacity: [0, 1],
      delay: 1000,
      easing: 'easeOutQuad',
      duration: 500
    });
    
    // Add styles to elements
    const style = document.createElement('style');
    style.textContent = \`
      .node {
        padding: 10px 15px;
        border-radius: 5px;
        background-color: #f0f0f0;
        border: 1px solid #ccc;
        text-align: center;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      }
      .start-node, .end-node {
        border-radius: 20px;
        background-color: #d4f1f9;
        width: 100px;
      }
      .process-node {
        width: 120px;
        background-color: #e1f7d5;
      }
      .decision-node {
        transform: rotate(45deg);
        width: 80px;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #fff2cc;
      }
      .decision-node:after {
        content: '';
        position: absolute;
        transform: rotate(-45deg);
      }
      .mini-node {
        font-size: 12px;
        padding: 3px 8px;
        background: transparent;
        border: none;
        box-shadow: none;
      }
    \`;
    container.appendChild(style);
  }
      `
    },
    {
      id: "data-flow",
      name: "Data Flow",
      description: "Diagram showing data flow between systems",
      code: `
  function createDataFlowchart(container) {
    // Create elements
    const database = document.createElement('div');
    database.className = 'node database-node';
    database.textContent = 'Database';
    
    const api = document.createElement('div');
    api.className = 'node api-node';
    api.textContent = 'API';
    
    const frontend = document.createElement('div');
    frontend.className = 'node frontend-node';
    frontend.textContent = 'User Interface';
    
    const user = document.createElement('div');
    user.className = 'node user-node';
    user.textContent = 'User';
    
    // Add elements to container
    container.appendChild(database);
    container.appendChild(api);
    container.appendChild(frontend);
    container.appendChild(user);
    
    // Basic styling
    container.style.position = 'relative';
    container.style.height = '400px';
    container.style.width = '100%';
    
    // Position elements
    database.style.position = 'absolute';
    database.style.top = '50px';
    database.style.left = '20%';
    
    api.style.position = 'absolute';
    api.style.top = '50px';
    api.style.left = '50%';
    
    frontend.style.position = 'absolute';
    frontend.style.top = '50px';
    frontend.style.left = '80%';
    
    user.style.position = 'absolute';
    user.style.top = '150px';
    user.style.left = '80%';
    
    // Create arrows
    const createArrow = (x1, y1, x2, y2, text) => {
      const arrow = document.createElement('div');
      arrow.className = 'arrow';
      container.appendChild(arrow);
      
      const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
      
      arrow.style.width = \`\${length}px\`;
      arrow.style.left = \`\${x1}px\`;
      arrow.style.top = \`\${y1}px\`;
      arrow.style.transform = \`rotate(\${angle}deg)\`;
      
      if (text) {
        const label = document.createElement('div');
        label.className = 'arrow-label';
        label.textContent = text;
        label.style.position = 'absolute';
        label.style.left = \`\${(x1 + x2) / 2}px\`;
        label.style.top = \`\${(y1 + y2) / 2 - 15}px\`;
        container.appendChild(label);
      }
    };
    
    // Add arrows
    setTimeout(() => {
      createArrow(130, 65, 230, 65, 'Fetch Data');
      createArrow(270, 65, 370, 65, 'Process Data');
      createArrow(380, 100, 380, 150, 'Display');
    }, 500);
    
    // Animation with anime.js
    anime({
      targets: [database, api, frontend, user],
      translateY: [50, 0],
      opacity: [0, 1],
      delay: anime.stagger(300),
      easing: 'easeOutQuad',
      duration: 800
    });
    
    // Add styles to elements
    const style = document.createElement('style');
    style.textContent = \`
      .node {
        padding: 15px;
        border-radius: 5px;
        background-color: #f0f0f0;
        border: 1px solid #ccc;
        text-align: center;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        width: 100px;
      }
      .database-node {
        background-color: #d4e6f1;
      }
      .api-node {
        background-color: #d5f5e3;
      }
      .frontend-node {
        background-color: #fdebd0;
      }
      .user-node {
        background-color: #ebdef0;
        border-radius: 50%;
      }
      .arrow {
        position: absolute;
        height: 2px;
        background-color: #555;
        transform-origin: left center;
      }
      .arrow:after {
        content: '';
        position: absolute;
        right: 0;
        top: -4px;
        width: 0;
        height: 0;
        border-top: 5px solid transparent;
        border-bottom: 5px solid transparent;
        border-left: 8px solid #555;
      }
      .arrow-label {
        font-size: 12px;
        background-color: white;
        padding: 2px 5px;
        border-radius: 3px;
        white-space: nowrap;
      }
    \`;
    container.appendChild(style);
  }
      `
    },
    {
      id: "decision-tree",
      name: "Decision Tree",
      description: "Flowchart showing a decision-making process",
      code: `
  function createDecisionTreeFlowchart(container) {
    // Create elements
    const startNode = document.createElement('div');
    startNode.className = 'node start-node';
    startNode.textContent = 'Main Question';
    
    const decision1 = document.createElement('div');
    decision1.className = 'node decision-node';
    decision1.textContent = 'Condition 1?';
    
    const decision2 = document.createElement('div');
    decision2.className = 'node decision-node';
    decision2.textContent = 'Condition 2?';
    
    const outcome1 = document.createElement('div');
    outcome1.className = 'node outcome-node';
    outcome1.textContent = 'Outcome 1';
    
    const outcome2 = document.createElement('div');
    outcome2.className = 'node outcome-node';
    outcome2.textContent = 'Outcome 2';
    
    const outcome3 = document.createElement('div');
    outcome3.className = 'node outcome-node';
    outcome3.textContent = 'Outcome 3';
    
    // Add elements to container
    container.appendChild(startNode);
    container.appendChild(decision1);
    container.appendChild(decision2);
    container.appendChild(outcome1);
    container.appendChild(outcome2);
    container.appendChild(outcome3);
    
    // Basic styling
    container.style.position = 'relative';
    container.style.height = '400px';
    container.style.width = '100%';
    
    // Position elements
    startNode.style.position = 'absolute';
    startNode.style.top = '20px';
    startNode.style.left = '50%';
    startNode.style.transform = 'translateX(-50%)';
    
    decision1.style.position = 'absolute';
    decision1.style.top = '100px';
    decision1.style.left = '30%';
    
    decision2.style.position = 'absolute';
    decision2.style.top = '100px';
    decision2.style.left = '70%';
    
    outcome1.style.position = 'absolute';
    outcome1.style.top = '200px';
    outcome1.style.left = '20%';
    
    outcome2.style.position = 'absolute';
    outcome2.style.top = '200px';
    outcome2.style.left = '50%';
    
    outcome3.style.position = 'absolute';
    outcome3.style.top = '200px';
    outcome3.style.left = '80%';
    
    // Create arrows
    const createArrow = (from, to, label) => {
      const fromRect = from.getBoundingClientRect();
      const toRect = to.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      const fromX = fromRect.left + fromRect.width/2 - containerRect.left;
      const fromY = fromRect.top + fromRect.height - containerRect.top;
      const toX = toRect.left + toRect.width/2 - containerRect.left;
      const toY = toRect.top - containerRect.top;
      
      const arrow = document.createElement('div');
      arrow.className = 'arrow';
      container.appendChild(arrow);
      
      // Calculate length and angle
      const length = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
      const angle = Math.atan2(toY - fromY, toX - fromX) * 180 / Math.PI;
      
      arrow.style.width = \`\${length}px\`;
      arrow.style.left = \`\${fromX}px\`;
      arrow.style.top = \`\${fromY}px\`;
      arrow.style.transform = \`rotate(\${angle}deg)\`;
      
      if (label) {
        const labelEl = document.createElement('div');
        labelEl.className = 'arrow-label';
        labelEl.textContent = label;
        labelEl.style.position = 'absolute';
        labelEl.style.left = \`\${(fromX + toX) / 2}px\`;
        labelEl.style.top = \`\${(fromY + toY) / 2 - 10}px\`;
        container.appendChild(labelEl);
      }
    };
    
    // Add arrows after elements are added to DOM
    setTimeout(() => {
      createArrow(startNode, decision1, 'No');
      createArrow(startNode, decision2, 'Yes');
      createArrow(decision1, outcome1, 'No');
      createArrow(decision1, outcome2, 'Yes');
      createArrow(decision2, outcome3, 'Yes');
      createArrow(decision2, outcome2, 'No');
    }, 500);
    
    // Animation with anime.js
    anime({
      targets: [startNode, decision1, decision2, outcome1, outcome2, outcome3],
      translateY: [50, 0],
      opacity: [0, 1],
      delay: anime.stagger(150),
      easing: 'easeOutQuad',
      duration: 800
    });
    
    // Add styles to elements
    const style = document.createElement('style');
    style.textContent = \`
      .node {
        padding: 10px 15px;
        border-radius: 5px;
        background-color: #f0f0f0;
        border: 1px solid #ccc;
        text-align: center;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        width: 100px;
      }
      .start-node {
        background-color: #d4f1f9;
        border-radius: 20px;
      }
      .decision-node {
        background-color: #fff2cc;
        transform: rotate(0deg) !important;
      }
      .outcome-node {
        background-color: #e1f7d5;
      }
      .arrow {
        position: absolute;
        height: 2px;
        background-color: #555;
        transform-origin: left center;
      }
      .arrow:after {
        content: '';
        position: absolute;
        right: 0;
        top: -4px;
        width: 0;
        height: 0;
        border-top: 5px solid transparent;
        border-bottom: 5px solid transparent;
        border-left: 8px solid #555;
      }
      .arrow-label {
        font-size: 12px;
        background-color: white;
        padding: 2px 5px;
        border-radius: 3px;
      }
    \`;
    container.appendChild(style);
  }
      `
    },
    {
      id: "circular-process",
      name: "Circular Process",
      description: "Flowchart showing a circular or cyclical process",
      code: `
  function createCircularProcessFlowchart(container) {
    // Create elements
    const steps = [
      { id: 'step1', text: 'Step 1', color: '#d4f1f9' },
      { id: 'step2', text: 'Step 2', color: '#d5f5e3' },
      { id: 'step3', text: 'Step 3', color: '#fdebd0' },
      { id: 'step4', text: 'Step 4', color: '#ebdef0' },
      { id: 'step5', text: 'Step 5', color: '#f9e79f' }
    ];
    
    const centerX = 200;
    const centerY = 150;
    const radius = 100;
    
    // Create circular shape
    steps.forEach((step, index) => {
      const angle = (index / steps.length) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      const node = document.createElement('div');
      node.id = step.id;
      node.className = 'node circular-node';
      node.textContent = step.text;
      node.style.backgroundColor = step.color;
      node.style.position = 'absolute';
      node.style.left = \`\${x}px\`;
      node.style.top = \`\${y}px\`;
      node.style.transform = 'translate(-50%, -50%)';
      
      container.appendChild(node);
    });
    
    // Create circular arrows
    const createCircularArrows = () => {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '100%');
      svg.setAttribute('height', '100%');
      svg.style.position = 'absolute';
      svg.style.top = '0';
      svg.style.left = '0';
      svg.style.zIndex = '-1';
      
      // Create circular arrow
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const d = \`M \${centerX + radius * 0.7} \${centerY} 
                 A \${radius * 0.7} \${radius * 0.7} 0 1 1 \${centerX - radius * 0.7} \${centerY}
                 A \${radius * 0.7} \${radius * 0.7} 0 1 1 \${centerX + radius * 0.7} \${centerY}\`;
      
      path.setAttribute('d', d);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', '#555');
      path.setAttribute('stroke-width', '2');
      path.setAttribute('marker-end', 'url(#arrowhead)');
      
      // Add arrowhead
      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
      marker.setAttribute('id', 'arrowhead');
      marker.setAttribute('markerWidth', '10');
      marker.setAttribute('markerHeight', '7');
      marker.setAttribute('refX', '9');
      marker.setAttribute('refY', '3.5');
      marker.setAttribute('orient', 'auto');
      
      const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      polygon.setAttribute('points', '0 0, 10 3.5, 0 7');
      polygon.setAttribute('fill', '#555');
      
      marker.appendChild(polygon);
      defs.appendChild(marker);
      svg.appendChild(defs);
      svg.appendChild(path);
      
      container.appendChild(svg);
    };
    
    // Add center title
    const centerTitle = document.createElement('div');
    centerTitle.className = 'center-title';
    centerTitle.textContent = 'Circular Process';
    centerTitle.style.position = 'absolute';
    centerTitle.style.left = \`\${centerX}px\`;
    centerTitle.style.top = \`\${centerY}px\`;
    centerTitle.style.transform = 'translate(-50%, -50%)';
    container.appendChild(centerTitle);
    
    // Add arrows after elements are added to DOM
    setTimeout(createCircularArrows, 100);
    
    // Animation with anime.js
    anime({
      targets: '.circular-node',
      scale: [0, 1],
      opacity: [0, 1],
      delay: anime.stagger(200),
      easing: 'easeOutElastic(1, .5)',
      duration: 800
    });
    
    anime({
      targets: '.center-title',
      opacity: [0, 1],
      scale: [0.5, 1],
      delay: 1000,
      easing: 'easeOutQuad',
      duration: 800
    });
    
    // Add styles to elements
    const style = document.createElement('style');
    style.textContent = \`
      .node {
        padding: 10px 15px;
        border-radius: 5px;
        background-color: #f0f0f0;
        border: 1px solid #ccc;
        text-align: center;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        width: 80px;
      }
      .circular-node {
        border-radius: 50%;
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .center-title {
        font-weight: bold;
        font-size: 16px;
        background-color: white;
        padding: 10px 15px;
        border-radius: 50%;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
      }
    \`;
    container.appendChild(style);
    
    // Basic styling for container
    container.style.position = 'relative';
    container.style.height = '350px';
    container.style.width = '100%';
  }
      `
    },
    {
      id: "swimlane-diagram",
      name: "Swimlane Diagram",
      description: "Flowchart showing processes across different departments or actors",
      code: `
  function createSwimlaneFlowchart(container) {
    // Create basic structure
    const swimlaneContainer = document.createElement('div');
    swimlaneContainer.className = 'swimlane-container';
    container.appendChild(swimlaneContainer);
    
    // Define actors/departments
    const lanes = [
      { id: 'lane1', title: 'Customer', color: '#d4e6f1' },
      { id: 'lane2', title: 'System', color: '#d5f5e3' },
      { id: 'lane3', title: 'Manager', color: '#fdebd0' }
    ];
    
    // Create lanes
    lanes.forEach(lane => {
      const laneEl = document.createElement('div');
      laneEl.id = lane.id;
      laneEl.className = 'swimlane';
      laneEl.style.backgroundColor = lane.color;
      
      const laneTitle = document.createElement('div');
      laneTitle.className = 'lane-title';
      laneTitle.textContent = lane.title;
      
      const laneContent = document.createElement('div');
      laneContent.className = 'lane-content';
      laneContent.id = \`\${lane.id}-content\`;
      
      laneEl.appendChild(laneTitle);
      laneEl.appendChild(laneContent);
      swimlaneContainer.appendChild(laneEl);
    });
    
    // Define process steps
    const steps = [
      { id: 'step1', lane: 'lane1', text: 'Submit Request', type: 'start', x: 100, y: 40 },
      { id: 'step2', lane: 'lane2', text: 'Receive Request', type: 'process', x: 100, y: 40 },
      { id: 'step3', lane: 'lane2', text: 'Validate Request', type: 'decision', x: 250, y: 40 },
      { id: 'step4', lane: 'lane3', text: 'Approve Request', type: 'process', x: 400, y: 40 },
      { id: 'step5', lane: 'lane2', text: 'Update System', type: 'process', x: 550, y: 40 },
      { id: 'step6', lane: 'lane1', text: 'Receive Confirmation', type: 'end', x: 550, y: 40 }
    ];
    
    // Create steps
    steps.forEach(step => {
      const stepEl = document.createElement('div');
      stepEl.id = step.id;
      stepEl.className = \`step \${step.type}-step\`;
      stepEl.textContent = step.text;
      stepEl.style.left = \`\${step.x}px\`;
      stepEl.style.top = \`\${step.y}px\`;
      
      const laneContent = document.getElementById(\`\${step.lane}-content\`);
      laneContent.appendChild(stepEl);
    });
    
    // Define connections
    const connections = [
      { from: 'step1', to: 'step2', label: '' },
      { from: 'step2', to: 'step3', label: '' },
      { from: 'step3', to: 'step4', label: 'Valid' },
      { from: 'step3', to: 'step2', label: 'Invalid', type: 'feedback' },
      { from: 'step4', to: 'step5', label: '' },
      { from: 'step5', to: 'step6', label: '' }
    ];
    
    // Create SVG for arrows
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.pointerEvents = 'none';
    
    // Add arrowhead definition
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    marker.setAttribute('id', 'arrowhead');
    marker.setAttribute('markerWidth', '10');
    marker.setAttribute('markerHeight', '7');
    marker.setAttribute('refX', '9');
    marker.setAttribute('refY', '3.5');
    marker.setAttribute('orient', 'auto');
    
    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', '0 0, 10 3.5, 0 7');
    polygon.setAttribute('fill', '#555');
    
    marker.appendChild(polygon);
    defs.appendChild(marker);
    svg.appendChild(defs);
    
    // Add SVG to container
    container.appendChild(svg);
    
    // Create connections after elements are added to DOM
    setTimeout(() => {
      connections.forEach(conn => {
        const fromEl = document.getElementById(conn.from);
        const toEl = document.getElementById(conn.to);
        
        if (fromEl && toEl) {
          const fromRect = fromEl.getBoundingClientRect();
          const toRect = toEl.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          
          let fromX, fromY, toX, toY;
          
          if (conn.type === 'feedback') {
            // For feedback arrows (going back)
            fromX = fromRect.left + fromRect.width/2 - containerRect.left;
            fromY = fromRect.top + fromRect.height/2 - containerRect.top;
            toX = toRect.left + toRect.width/2 - containerRect.left;
            toY = toRect.top + toRect.height/2 - containerRect.top;
            
            // Create curved path
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const midY = (fromY + toY) / 2 - 30;
            const d = \`M \${fromX} \${fromY} C \${fromX} \${midY}, \${toX} \${midY}, \${toX} \${toY}\`;
            
            path.setAttribute('d', d);
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke', '#555');
            path.setAttribute('stroke-width', '2');
            path.setAttribute('marker-end', 'url(#arrowhead)');
            
            svg.appendChild(path);
          } else {
            // For standard arrows
            fromX = fromRect.left + fromRect.width - containerRect.left;
            fromY = fromRect.top + fromRect.height/2 - containerRect.top;
            toX = toRect.left - containerRect.left;
            toY = toRect.top + toRect.height/2 - containerRect.top;
            
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', fromX.toString());
            line.setAttribute('y1', fromY.toString());
            line.setAttribute('x2', toX.toString());
            line.setAttribute('y2', toY.toString());
            line.setAttribute('stroke', '#555');
            line.setAttribute('stroke-width', '2');
            line.setAttribute('marker-end', 'url(#arrowhead)');
            
            svg.appendChild(line);
          }
        }
      });
    }, 500);
  }
      `
    },
  ];