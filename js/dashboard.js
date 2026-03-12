if (document.getElementById('dashboard-page')) {
    const savedData = localStorage.getItem('fusionx_applications');
    
    if (savedData) {
        const applications = JSON.parse(savedData);
        const data = applications[applications.length - 1]; 

        document.getElementById('scoreDisplay').innerText = data.score;

        const ctx = document.getElementById('scoreChart').getContext('2d');

        const segmentData = [111, 70, 90, 279]; 
        const segmentColors = ['#16a34a', '#4ade80', '#facc15', '#ef4444']; 

        const score = data.score;
        const riskDisplayElement = document.getElementById('riskLevelText');
        let riskValueText = '';
        let riskColor = '';

        if (score < 600) {
            riskValueText = 'High Risk';
            riskColor = segmentColors[3]; 
        } else if (score < 700) {
            riskValueText = 'Moderate Risk';
            riskColor = segmentColors[2]; 
        } else if (score < 800) {
            riskValueText = 'Good Risk';
            riskColor = segmentColors[1]; 
        } else {
            riskValueText = 'Excellent Risk';
            riskColor = segmentColors[0]; 
        }

        riskDisplayElement.innerText = riskValueText;
        riskDisplayElement.style.color = riskColor;

        const gaugeNeedle = {
            id: 'gaugeNeedle',
            afterDatasetDraw(chart) {
                const { ctx } = chart;
                ctx.save();
                
                const percentage = (score - 300) / 550;
                const invertedPercentage = 1 - Math.max(0, Math.min(1, percentage));
                const angle = Math.PI + (invertedPercentage * Math.PI); 

                const meta = chart.getDatasetMeta(0);
                const cx = meta.data[0].x; 
                const cy = meta.data[0].y; 
                
                const innerRadius = meta.data[0].innerRadius;
                const outerRadius = meta.data[0].outerRadius;
                const needleLength = innerRadius + (outerRadius - innerRadius) / 2;

                ctx.translate(cx, cy);
                ctx.rotate(angle);
                ctx.beginPath();
                ctx.moveTo(0, -6); 
                ctx.lineTo(needleLength, 0); 
                ctx.lineTo(0, 6); 
                ctx.fillStyle = '#1e293b'; 
                ctx.fill();

                ctx.rotate(-angle);

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
        
        const reasonsContainer = document.getElementById('aiReasons');
        reasonsContainer.innerHTML = ''; 

        data.reasons.forEach(item => {
            const div = document.createElement('div');
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

        document.getElementById('ledgerWallet').innerText = data.walletAddress;
        document.getElementById('ledgerBlock').innerText = data.blockNumber;
        document.getElementById('ledgerTime').innerText = data.timestamp;
        document.getElementById('ledgerGas').innerText = data.gasFee;
        document.getElementById('ledgerHash').innerText = `0x${data.blockHash}`;
    } else {
        document.getElementById('aiReasons').innerHTML = "<li>No data found. Please submit an application first.</li>";
    }
}