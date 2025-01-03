const MIN_DISTANCE = 100; // Minimum distance between nodes

// const getRandomPosition = (existingNodes, edges) => {
//   let attempts = 0;
//   const maxAttempts = 50;
  
//   while (attempts < maxAttempts) {
//     const newPos = {
//       x: Math.random() * 800,
//       y: Math.random() * 600
//     };
    
//     // Check if position is far enough from existing nodes
//     const isFarEnough = existingNodes.every(node => {
//       const dx = node.position.x - newPos.x;
//       const dy = node.position.y - newPos.y;
//       return Math.sqrt(dx * dx + dy * dy) > MIN_DISTANCE;
//     });
    
//     if (isFarEnough) {
//       return newPos;
//     }
//     attempts++;
//   }
  
//   // If no suitable position found, return position with offset from center
//   return {
//     x: 400 + (Math.random() - 0.5) * 200,
//     y: 300 + (Math.random() - 0.5) * 200
//   };
// };


const getRandomPosition = (existingNodes, edges, viewportSize = { width: 800, height: 600 }) => {
  let attempts = 0;
  const maxAttempts = 50;
  
  // Calculate the center and maximum radius based on viewport and number of nodes
  const center = {
    x: viewportSize.width / 2,
    y: viewportSize.height / 2
  };
  
  // Increase radius based on number of existing nodes
  const radius = Math.min(viewportSize.width, viewportSize.height) * 0.4 * 
                 (1 + existingNodes.length * 0.1);
  
  while (attempts < maxAttempts) {
    // Generate position in a circular pattern around center
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * radius;
    
    const newPos = {
      x: center.x + distance * Math.cos(angle),
      y: center.y + distance * Math.sin(angle)
    };
    
    // Check if position is far enough from existing nodes
    const isFarEnough = existingNodes.every(node => {
      const dx = node.position.x - newPos.x;
      const dy = node.position.y - newPos.y;
      return Math.sqrt(dx * dx + dy * dy) > MIN_DISTANCE;
    });
    
    if (isFarEnough) {
      return newPos;
    }
    attempts++;
  }
  
  // If no suitable position found, return position with increasing offset from center
  const fallbackAngle = (existingNodes.length * Math.PI * 0.5) % (2 * Math.PI);
  return {
    x: center.x + radius * Math.cos(fallbackAngle),
    y: center.y + radius * Math.sin(fallbackAngle)
  };
};



export { getRandomPosition };