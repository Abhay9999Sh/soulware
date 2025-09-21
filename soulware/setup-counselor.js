const fetch = require('node-fetch');

async function setupCounselor() {
  try {
    const response = await fetch('http://localhost:3000/api/setup-counselor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    });
    
    const result = await response.json();
    console.log('Counselor setup result:', result);
  } catch (error) {
    console.error('Error setting up counselor:', error);
  }
}

setupCounselor();
