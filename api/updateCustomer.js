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
  