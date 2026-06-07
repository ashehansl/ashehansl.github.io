export default async function handler(req, res) {
  // CORS සක්‍රීය කිරීම (මේ ටික අනිවාර්යයි)
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS රික්වෙස්ට් එකට උත්තර දීම
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // මෙතනට පස්සේ උඹේ අනිත් කෝඩ් ටික දාන්න (API Call එක)
  const { message } = req.body;
  // ... උඹේ GEMINI API එකට අදාළ කෝඩ් එක ...
}

// api/chat.js
export default async function handler(req, res) {
  // CORS වලට ඉඩ දෙන්න
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'POST') {
    const { message } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: message }] }] })
    });

    const data = await response.json();
    return res.status(200).json(data);
  }
}
