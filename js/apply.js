const form = document.getElementById('creditForm');
if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault(); 

        const applicantName = document.getElementById('applicantName').value;
        const income = parseFloat(document.getElementById('monthlyIncome').value);
        const debt = parseFloat(document.getElementById('monthlyDebt').value);
        const latePayments = parseInt(document.getElementById('latePayments').value);
        const utilityPayments = parseInt(document.getElementById('utilityPayments').value) || 0;
        
        let score = 500; 
        let reasons = []; 

        // Logic 1: Debt-to-Income Ratio (with Zero-Income Protection)
        if (income === 0) {
            score -= 50;
            reasons.push({ icon: "⚠️", color: "#ef4444", title: "No Income Reported", desc: "You reported RM 0 for monthly income.", advice: "A stable income is required to safely calculate your debt capacity." });
        } else {
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
        }

        if (income > 5000) {
            score += 50;
            reasons.push({ icon: "💼", color: "#16a34a", title: "Stable Income Bracket", desc: "Your monthly income shows a strong capacity to manage credit.", advice: "Consistent income lowers your risk profile. Keep it steady!" });
        }

        if (latePayments === 0) {
            score += 70;
            reasons.push({ icon: "⭐", color: "#16a34a", title: "Flawless Payment History", desc: "No late payments detected on your traditional accounts.", advice: "Set up auto-pay on all accounts to ensure you never miss a deadline." });
        } else {
            score -= (latePayments * 50);
            reasons.push({ icon: "❌", color: "#ef4444", title: "Missed Payments Detected", desc: `You have ${latePayments} severe late payment(s) dragging your score down.`, advice: "Contact your creditors immediately to negotiate a payment plan or removal." });
        }

        if (utilityPayments >= 12) {
            score += 60;
            reasons.push({ icon: "⚡", color: "#2563eb", title: "Strong Alternative Data", desc: `You have ${utilityPayments} months of consistent utility and rent payments.`, advice: "Excellent! You are successfully using Web3 alternative data to prove your reliability." });
        } else if (utilityPayments > 0) {
            score += 20;
            reasons.push({ icon: "📈", color: "#2563eb", title: "Building Alternative Profile", desc: `You have linked ${utilityPayments} months of utility payments.`, advice: "Keep paying utilities on time. Reaching 12 months will unlock a major score boost." });
        } else {
            reasons.push({ icon: "💡", color: "#64748b", title: "Missing Alternative Data", desc: "No utility or rent payments are linked to your profile.", advice: "Link your recurring monthly bills to instantly add positive history to your score." });
        }

        score = Math.max(300, Math.min(score, 850));

        const timestamp = new Date().toLocaleString();
        const blockHash = generateFakeHash(applicantName + score + timestamp);
        const blockNumber = Math.floor(Math.random() * 1000000) + 18000000; 
        const gasFee = (Math.random() * (0.005 - 0.001) + 0.001).toFixed(4); 
        const walletAddress = "0x" + generateFakeHash(applicantName).substring(0, 38); 

        const resultData = { 
            applicantName, score, reasons, timestamp, blockHash, 
            blockNumber, gasFee, walletAddress 
        };
        
        let applications = JSON.parse(localStorage.getItem('fusionx_applications')) || [];
        applications.push(resultData); 
        
        localStorage.setItem('fusionx_applications', JSON.stringify(applications));

        window.location.href = 'dashboard.html';
    });
}