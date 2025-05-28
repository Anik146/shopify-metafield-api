export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://uf1h70-bn.myshopify.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Your existing logic below...
  const { customerId, dob, gender } = req.body;

  if (!customerId || !dob || !gender) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  // ... continue with Shopify API call
}

// File: api/updateCustomer.js

export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Only POST requests allowed' });
    }
  
    const { customerId, dob, gender } = req.body;
  
    try {
      // Save DOB
      const dobResponse = await fetch(`https://${process.env.SHOPIFY_STORE}.myshopify.com/admin/api/2023-10/customers/${customerId}/metafields.json`, {
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
  
      // Save Gender
      const genderResponse = await fetch(`https://${process.env.SHOPIFY_STORE}.myshopify.com/admin/api/2023-10/customers/${customerId}/metafields.json`, {
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
  
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
  
