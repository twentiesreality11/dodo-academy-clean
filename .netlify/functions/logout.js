// netlify/functions/logout.js
exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }

  const cookie = 'session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Secure=true';
  
  return {
    statusCode: 200,
    headers: {
      ...headers,
      'Set-Cookie': cookie
    },
    body: JSON.stringify({ success: true })
  };
};