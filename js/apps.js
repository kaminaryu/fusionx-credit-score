// Function to generate a fake SHA-256 style hash for the blockchain simulation
function generateFakeHash(dataString) {
    let hash = '';
    const chars = '0123456789abcdef';
    for (let i = 0; i < 64; i++) {
        hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
}

// -----------------------------------------
// PAGE 1: Handle the Application Form
// -----------------------------------------
const form = document.getElementById('creditForm');
if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Stop page refresh

        // 1. Get user data
        const applicantName = document.getElementById('applicantName').value;
        const income = parseFloat(document.getElementById('monthlyIncome').value);
        const debt = parseFloat(document.getElementById('monthlyDebt').value);
        const latePayments = parseInt(document.getElementById('latePayments').value);
        
        // 2. The "Fake AI" Logic (Borrowing variables from ML repos)
        let score = 500; // Base score
        let reasons = []; // Explainable AI array

        // Logic 1: Debt-to-Income Ratio
        const dti = debt / income;
        if (dti < 0.3) {
            score += 100;
            reasons.push("✅ Low Debt-to-Income ratio (Healthy financial management).");
        } else if (dti > 0.5) {
            score -= 80;
            reasons.push("⚠️ High Debt-to-Income ratio detected.");
        }

        // Logic 2: Income Level
        if (income > 5000) {
            score += 50;
            reasons.push("✅ Stable monthly income bracket.");
        }

        // Logic 3: Delinquencies (Heavy penalty for late payments)
        if (latePayments === 0) {
            score += 70;
            reasons.push("✅ Perfect payment history (0 late payments).");
        } else {
            score -= (latePayments * 50);
            reasons.push(`❌ High risk: ${latePayments} late payment(s) over 90 days.`);
        }

        // Cap score between 300 and 850
        score = Math.max(300, Math.min(score, 850));

        // 3. Create Blockchain Simulation Data
        const timestamp = new Date().toLocaleString();
        const blockHash = generateFakeHash(applicantName + score + timestamp);

        // 4. Save everything to localStorage
        const resultData = { applicantName, score, reasons, timestamp, blockHash };
        localStorage.setItem('fusionx_latest_application', JSON.stringify(resultData));

        // 5. Redirect to Dashboard
        window.location.href = 'dashboard.html';
    });
}

// -----------------------------------------
// PAGE 2: Handle the Dashboard Display
// -----------------------------------------
if (document.getElementById('dashboard-page')) {
    // 1. Retrieve data from localStorage
    const savedData = localStorage.getItem('fusionx_latest_application');
    
    if (savedData) {
        const data = JSON.parse(savedData);

        // 2. Populate Score Card
        document.getElementById('scoreDisplay').innerText = data.score;
        let riskText = "Low Risk";
        if (data.score < 600) riskText = "High Risk";
        else if (data.score < 700) riskText = "Moderate Risk";
        document.getElementById('riskLevel').innerText = `Risk Level: ${riskText}`;

        // --- NEW: Draw the Chart.js Gauge ---
        const ctx = document.getElementById('scoreChart').getContext('2d');
        
        // Pick a color based on the score
        let chartColor = '#ef4444'; // Red for High Risk
        if (data.score >= 700) chartColor = '#10b981'; // Green for Low Risk
        else if (data.score >= 600) chartColor = '#f59e0b'; // Yellow for Moderate Risk

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Your Score', 'Remaining to 850'],
                datasets: [{
                    data: [data.score, 850 - data.score],
                    backgroundColor: [chartColor, '#e5e7eb'],
                    borderWidth: 0
                }]
            },
            options: {
                rotation: -90, // Makes it a half-circle
                circumference: 180, // Makes it a half-circle
                cutout: '75%', // Makes the ring thinner
                plugins: {
                    legend: { display: false } // Hides the labels so it looks like a clean gauge
                }
            }
        });
        // ------------------------------------
        
        // 3. Populate Explainable AI Reasons
        const reasonsList = document.getElementById('aiReasons');
        data.reasons.forEach(reason => {
            const li = document.createElement('li');
            li.innerText = reason;
            reasonsList.appendChild(li);
        });

        // 4. Populate Blockchain Ledger
        document.getElementById('ledgerName').innerText = data.applicantName;
        document.getElementById('ledgerTime').innerText = data.timestamp;
        document.getElementById('ledgerHash').innerText = `0x${data.blockHash}`;
    } else {
        document.getElementById('aiReasons').innerHTML = "<li>No data found. Please submit an application first.</li>";
    }
}

