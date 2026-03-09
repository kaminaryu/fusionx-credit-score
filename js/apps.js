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
        
        // NEW: Get utility payments data
        const utilityPayments = parseInt(document.getElementById('utilityPayments').value) || 0;
        
        // 2. The "Upgraded AI" Logic (Detailed Insights & Advice)
        let score = 500; // Base score
        let reasons = []; // Array to hold rich insight objects

        // Logic 1: Debt-to-Income Ratio
        const dti = debt / income;
        if (dti < 0.3) {
            score += 100;
            reasons.push({ icon: "✅", color: "#16a34a", title: "Healthy Debt-to-Income", desc: `Your DTI is ${(dti*100).toFixed(0)}%, which is well below the 30% risk threshold.`, advice: "Keep your credit card balances low to maintain this excellent ratio." });
        } else if (dti > 0.5) {
            score -= 80;
            reasons.push({ icon: "⚠️", color: "#ef4444", title: "High Debt-to-Income", desc: `Your DTI is ${(dti*100).toFixed(0)}%, indicating a high portion of your income goes to debt.`, advice: "Focus on paying down high-interest debt before applying for new loans." });
        } else {
            reasons.push({ icon: "⚖️", color: "#facc15", title: "Moderate Debt-to-Income", desc: `Your DTI is ${(dti*100).toFixed(0)}%, which is average but leaves little room for emergencies.`, advice: "Try lowering your monthly debt payments to boost your score further." });
        }

        // Logic 2: Income Level
        if (income > 5000) {
            score += 50;
            reasons.push({ icon: "💼", color: "#16a34a", title: "Stable Income Bracket", desc: "Your monthly income shows a strong capacity to manage credit.", advice: "Consistent income lowers your risk profile. Keep it steady!" });
        }

        // Logic 3: Delinquencies
        if (latePayments === 0) {
            score += 70;
            reasons.push({ icon: "⭐", color: "#16a34a", title: "Flawless Payment History", desc: "No late payments detected on your traditional accounts.", advice: "Set up auto-pay on all accounts to ensure you never miss a deadline." });
        } else {
            score -= (latePayments * 50);
            reasons.push({ icon: "❌", color: "#ef4444", title: "Missed Payments Detected", desc: `You have ${latePayments} severe late payment(s) dragging your score down.`, advice: "Contact your creditors immediately to negotiate a payment plan or removal." });
        }

        // Logic 4: Alternative Data (Utility Payments)
        if (utilityPayments >= 12) {
            score += 60;
            reasons.push({ icon: "⚡", color: "#2563eb", title: "Strong Alternative Data", desc: `You have ${utilityPayments} months of consistent utility and rent payments.`, advice: "Excellent! You are successfully using Web3 alternative data to prove your reliability." });
        } else if (utilityPayments > 0) {
            score += 20;
            reasons.push({ icon: "📈", color: "#2563eb", title: "Building Alternative Profile", desc: `You have linked ${utilityPayments} months of utility payments.`, advice: "Keep paying utilities on time. Reaching 12 months will unlock a major score boost." });
        } else {
            reasons.push({ icon: "💡", color: "#64748b", title: "Missing Alternative Data", desc: "No utility or rent payments are linked to your profile.", advice: "Link your recurring monthly bills to instantly add positive history to your score." });
        }

        // Cap score between 300 and 850
        score = Math.max(300, Math.min(score, 850));
        // ---------------------------------------------------------

        // Cap score between 300 and 850
        score = Math.max(300, Math.min(score, 850));

        // 3. Create Upgraded Blockchain Simulation Data
        const timestamp = new Date().toLocaleString();
        const blockHash = generateFakeHash(applicantName + score + timestamp);
        
        // NEW: Generate realistic Web3 metadata
        const blockNumber = Math.floor(Math.random() * 1000000) + 18000000; // Simulated Ethereum block
        const gasFee = (Math.random() * (0.005 - 0.001) + 0.001).toFixed(4); // Simulated ETH gas fee
        const walletAddress = "0x" + generateFakeHash(applicantName).substring(0, 38); // Fake 40-char wallet

        // 4. Save to a LIST in localStorage
        // Note: We are adding the new variables to this object!
        const resultData = { 
            applicantName, score, reasons, timestamp, blockHash, 
            blockNumber, gasFee, walletAddress 
        };
        
        let applications = JSON.parse(localStorage.getItem('fusionx_applications')) || [];
        applications.push(resultData); // Add new app to the end of the list
        
        localStorage.setItem('fusionx_applications', JSON.stringify(applications));

        // 5. Redirect to Dashboard
        window.location.href = 'dashboard.html';
    });
}

// -----------------------------------------
// PAGE 2: Handle the Dashboard Display
// -----------------------------------------
if (document.getElementById('dashboard-page')) {
    // 1. Retrieve the list from localStorage
    const savedData = localStorage.getItem('fusionx_applications');
    
    if (savedData) {
        const applications = JSON.parse(savedData);
        const data = applications[applications.length - 1]; // Get the newest one

        // 2. Populate Score Card
        document.getElementById('scoreDisplay').innerText = data.score;

        // -----------------------------------------
        // --- INVERTED: Green on Left, Red on Right ---
        const ctx = document.getElementById('scoreChart').getContext('2d');

        // Logic 1: Invert colors and sizes (Dark Green -> Light Green -> Yellow -> Red)
        const segmentData = [111, 70, 90, 279]; 
        const segmentColors = ['#16a34a', '#4ade80', '#facc15', '#ef4444']; 

        // --- Logic 2: Map the risk text to the new inverted color array ---
        const score = data.score;
        const riskDisplayElement = document.getElementById('riskLevelText');
        let riskValueText = '';
        let riskColor = '';

        if (score < 600) {
            riskValueText = 'High Risk';
            riskColor = segmentColors[3]; // Red is now at the END (Index 3)
        } else if (score < 700) {
            riskValueText = 'Moderate Risk';
            riskColor = segmentColors[2]; // Yellow is Index 2
        } else if (score < 800) {
            riskValueText = 'Good Risk';
            riskColor = segmentColors[1]; // Light Green is Index 1
        } else {
            riskValueText = 'Excellent Risk';
            riskColor = segmentColors[0]; // Dark Green is now at the START (Index 0)
        }

        riskDisplayElement.innerText = riskValueText;
        riskDisplayElement.style.color = riskColor;
        // -------------------------------------------------------------

        const gaugeNeedle = {
            id: 'gaugeNeedle',
            afterDatasetDraw(chart) {
                const { ctx } = chart;
                ctx.save();
                
                const percentage = (score - 300) / 550;
                
                // --- INVERT NEEDLE DIRECTION ---
                // We subtract from 1 so high scores point Left, low scores point Right
                const invertedPercentage = 1 - Math.max(0, Math.min(1, percentage));
                const angle = Math.PI + (invertedPercentage * Math.PI); 

                const meta = chart.getDatasetMeta(0);
                const cx = meta.data[0].x; 
                const cy = meta.data[0].y; 
                
                const innerRadius = meta.data[0].innerRadius;
                const outerRadius = meta.data[0].outerRadius;
                const needleLength = innerRadius + (outerRadius - innerRadius) / 2;

                // Draw the Needle
                ctx.translate(cx, cy);
                ctx.rotate(angle);
                ctx.beginPath();
                ctx.moveTo(0, -6); 
                ctx.lineTo(needleLength, 0); 
                ctx.lineTo(0, 6); 
                ctx.fillStyle = '#1e293b'; 
                ctx.fill();

                // Rotate back to draw a centered dot
                ctx.rotate(-angle);

                // Center Anchor
                ctx.beginPath();
                ctx.arc(0, 0, 12, 0, Math.PI * 2); 
                ctx.fillStyle = '#1e293b'; 
                ctx.fill();
                
                ctx.lineWidth = 3;
                ctx.strokeStyle = '#ffffff';
                ctx.stroke();
                
                ctx.restore();
            }
        };

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: segmentData,
                    backgroundColor: segmentColors,
                    borderWidth: 0,
                    score: score 
                }]
            },
            options: {
                rotation: -90, 
                circumference: 180,
                cutout: '75%', 
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            },
            plugins: [gaugeNeedle]
        });
        // ------------------------------------
        
        // 3. Populate Upgraded Explainable AI Reasons
        const reasonsContainer = document.getElementById('aiReasons');
        reasonsContainer.innerHTML = ''; // Clear out the loading text

        data.reasons.forEach(item => {
            const div = document.createElement('div');
            // We use JavaScript to add beautiful inline CSS for these insight cards
            div.style.padding = "15px";
            div.style.borderLeft = `4px solid ${item.color}`;
            div.style.backgroundColor = "#f8fafc";
            div.style.marginBottom = "15px";
            div.style.borderRadius = "0 8px 8px 0";
            div.style.boxShadow = "0 1px 2px rgba(0,0,0,0.05)";
            
            div.innerHTML = `
                <div style="font-weight: 600; font-size: 16px; margin-bottom: 6px; color: var(--text-main);">
                    ${item.icon} ${item.title}
                </div>
                <div style="font-size: 14px; color: var(--text-main); margin-bottom: 6px;">
                    <strong>Analysis:</strong> ${item.desc}
                </div>
                <div style="font-size: 14px; color: var(--primary);">
                    <strong>💡 Advice:</strong> ${item.advice}
                </div>
            `;
            reasonsContainer.appendChild(div);
        });

        // 4. Populate Upgraded Blockchain Ledger
        document.getElementById('ledgerWallet').innerText = data.walletAddress;
        document.getElementById('ledgerBlock').innerText = data.blockNumber;
        document.getElementById('ledgerTime').innerText = data.timestamp;
        document.getElementById('ledgerGas').innerText = data.gasFee;
        document.getElementById('ledgerHash').innerText = `0x${data.blockHash}`;
    } else {
        document.getElementById('aiReasons').innerHTML = "<li>No data found. Please submit an application first.</li>";
    }
}

// -----------------------------------------
// PAGE 3: Handle the Bank Admin View
// -----------------------------------------
if (document.getElementById('admin-page')) {
    const savedData = localStorage.getItem('fusionx_applications');
    const tbody = document.getElementById('adminTableBody');

    if (savedData) {
        const applications = JSON.parse(savedData);
        
        // Reverse the array so newest applications show at the top
        applications.reverse().forEach(app => {
            let riskText = "Low Risk";
            if (app.score < 600) riskText = "High Risk";
            else if (app.score < 700) riskText = "Moderate Risk";

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${app.applicantName}</td>
                <td><strong>${app.score}</strong></td>
                <td>${riskText}</td>
                <td class="hash-text" style="font-size: 12px;">0x${app.blockHash.substring(0, 16)}...</td>
                <td>
                    <button class="btn" style="padding: 5px 10px; font-size: 12px; background: #10b981; width: auto;">Approve</button>
                    <button class="btn" style="padding: 5px 10px; font-size: 12px; background: #ef4444; width: auto;">Reject</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } else {
        tbody.innerHTML = "<tr><td colspan='5' style='text-align:center;'>No applications found.</td></tr>";
    }
}

// -----------------------------------------
// PAGE 4: Handle Admin Login
// -----------------------------------------
if (document.getElementById('login-page')) {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const adminId = document.getElementById('adminId').value;
        const adminPin = document.getElementById('adminPin').value;
        const errorMsg = document.getElementById('loginError');

        // The "Smoke and Mirrors" Hackathon Password
        if (adminId === "admin" && adminPin === "2026") {
            window.location.href = "admin.html";
        } else {
            errorMsg.style.display = "block"; // Show the error message
        }
    });
}