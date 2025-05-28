export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://uf1h70-bn.myshopify.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Only POST requests allowed' });

  const { customerId, dob, gender } = req.body;

  if (!customerId || !dob || !gender) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  try {
    const responses = [];

    // ➤ Save DOB
    const dobRes = await fetch(`https://${process.env.SHOPIFY_STORE}.myshopify.com/admin/api/2023-10/customers/${customerId}/metafields.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_API_KEY
      },
      body: JSON.stringify({
        metafield: {
          namespace: 'custom',
          key: 'dob',
          value: dob,
          type: 'date'
        }
      })
    });

    const dobData = await dobRes.json();
    responses.push({ dobStatus: dobRes.status, dobData });

    // ➤ Save Gender
    const genderRes = await fetch(`https://${process.env.SHOPIFY_STORE}.myshopify.com/admin/api/2023-10/customers/${customerId}/metafields.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_API_KEY
      },
      body: JSON.stringify({
        metafield: {
          namespace: 'custom',
          key: 'gender',
          value: gender,
          type: 'single_line_text_field'
        }
      })
    });

    const genderData = await genderRes.json();
    responses.push({ genderStatus: genderRes.status, genderData });

    // If any error in response
    if (!dobRes.ok || !genderRes.ok) {
      return res.status(400).json({ success: false, error: 'Shopify API error', responses });
    }

    return res.status(200).json({ success: true, responses });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
