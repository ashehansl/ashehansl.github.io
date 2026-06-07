export default async function handler(req, res) {
  // 1. CORS Headers (GitHub Pages එකෙන් එන මැසේජ් බාරගැනීමට අවසර දීම)
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 2. බ්‍රව්සරයෙන් මුලින්ම එවන OPTIONS (Preflight) රික්වෙස්ට් එක හැන්ඩ්ල් කිරීම
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 3. POST රික්වෙස්ට් එකක් පමණක් බාරගැනීම
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  try {
    const { message } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // Vercel එකේ API Key එක දාලා නැත්නම් දෙන Error එක
    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API Key එක Vercel Environment Variables වල සෙට් කර නැත!' });
    }

    // 4. Gemini 1.5 Flash API එකට මැසේජ් එක යැවීම
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }]
        })
      }
    );

    const data = await response.json();

    // 5. ලැබුණු පිළිතුර සාර්ථකව උඹේ වෙබ් සයිට් එකට (Frontend) යැවීම
    return res.status(200).json(data);

  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ error: 'සර්වර් එකේ දෝෂයකි!', details: error.message });
  }
}
