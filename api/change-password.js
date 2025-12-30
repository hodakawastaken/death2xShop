export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { token, newPassword } = req.body;
    const apiKey = process.env.FIREBASE_API_KEY;

    try {
        // Firebase endpoint to update user data
        const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:update?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                idToken: token,
                password: newPassword,
                returnSecureToken: true
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error.message || 'Update failed');
        }

        res.status(200).json({ status: 'success' });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
