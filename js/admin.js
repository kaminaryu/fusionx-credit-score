if (document.getElementById('admin-page')) {
    const savedData = localStorage.getItem('fusionx_applications');
    const tbody = document.getElementById('adminTableBody');

    window.processLoan = function(buttonElement, status) {
        const cell = buttonElement.parentElement; 
        const color = status === 'Approved' ? '#10b981' : '#ef4444';
        cell.innerHTML = `<span style="color: ${color}; font-weight: bold; padding: 4px 8px; border-radius: 12px; background: ${color}20;">${status}</span>`;
    };

    if (savedData) {
        const applications = JSON.parse(savedData);
        
        let totalApps = applications.length;
        let totalScore = 0;
        let highRiskCount = 0;

        applications.forEach(app => {
            totalScore += app.score;
            if (app.score < 600) highRiskCount++;
        });

        document.getElementById('kpiTotal').innerText = totalApps;
        document.getElementById('kpiAvg').innerText = Math.round(totalScore / totalApps);
        document.getElementById('kpiRisk').innerText = highRiskCount;
        
        applications.reverse().forEach((app) => {
            let riskText = "Low Risk";
            let riskColor = "#16a34a"; 
            
            if (app.score < 600) { 
                riskText = "High Risk"; 
                riskColor = "#ef4444"; 
            } else if (app.score < 700) { 
                riskText = "Moderate Risk"; 
                riskColor = "#facc15"; 
            }

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${app.applicantName}</td>
                <td><strong>${app.score}</strong></td>
                <td style="color: ${riskColor}; font-weight: 600;">${riskText}</td>
                <td class="hash-text" style="font-size: 12px; font-family: monospace;">0x${app.blockHash.substring(0, 16)}...</td>
                <td>
                    <button onclick="window.processLoan(this, 'Approved')" class="btn" style="padding: 5px 10px; font-size: 12px; background: #10b981; width: auto; margin-right: 5px;">Approve</button>
                    <button onclick="window.processLoan(this, 'Rejected')" class="btn" style="padding: 5px 10px; font-size: 12px; background: #ef4444; width: auto;">Reject</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } else {
        tbody.innerHTML = "<tr><td colspan='5' style='text-align:center;'>No applications found.</td></tr>";
    }
}