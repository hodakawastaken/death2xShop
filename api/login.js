// This code runs on the Vercel Server, NOT the browser.
// The user cannot see this file.

export default async function handler(req, res) {
    // 1. Only allow POST requests (sending data)
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, password } = req.body;
    const apiKey = process.env.FIREBASE_API_KEY; // Securely grab key from Vercel Vault

    try {
        // 2. The Server calls Firebase (Proxy)
        // We use the Firebase Auth REST API here
        const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                password: password,
                returnSecureToken: true
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error.message);
        }

        // 3. Send ONLY the user token back to the browser (Keep key on server)
        res.status(200).json({ 
            token: data.idToken,
            email: data.email,
            expiresIn: data.expiresIn 
        });

    } catch (error) {
        res.status(401).json({ error: error.message });
    }
}
