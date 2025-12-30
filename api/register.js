export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, password } = req.body;
    const apiKey = process.env.FIREBASE_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'Server misconfiguration: API Key missing' });
    }

    try {
        // Send data to Firebase "Sign Up" endpoint
        const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`, {
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
            throw new Error(data.error.message || 'Registration failed');
        }

        // Return success token
        res.status(200).json({ 
            token: data.idToken,
            email: data.email
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
