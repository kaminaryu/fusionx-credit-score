// Function to generate a fake SHA-256 style hash for the blockchain simulation
function generateFakeHash(dataString) {
    let hash = '';
    const chars = '0123456789abcdef';
    for (let i = 0; i < 64; i++) {
        hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
}