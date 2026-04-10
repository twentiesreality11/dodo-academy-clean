// netlify/functions/health.js
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({ 
      status: 'healthy', 
      message: 'Netlify Functions are working!',
      timestamp: new Date().toISOString()
    })
  };
};