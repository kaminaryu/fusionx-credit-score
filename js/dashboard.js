if (document.getElementById('dashboard-page')) {
    const savedData = localStorage.getItem('fusionx_applications');
    
    if (savedData) {
        const applications = JSON.parse(savedData);
        const data = applications[applications.length - 1]; 

        const TITLE = data.applicantName + "'s Dashboard"

        document.getElementById("pageTitle").innerText = TITLE;
        document.getElementById("dashboardTitle").innerText = TITLE;

        document.getElementById('scoreDisplay').innerText = data.score;

        // -----------------------------------------
        // --- STANDARD FLOW: Red on Left, Green on Right ---
        const ctx = document.getElementById('scoreChart').getContext('2d');

        // Logic 1: Standard colors and sizes (Red -> Yellow -> Light Green -> Dark Green)
        const segmentData = [279, 90, 70, 111]; 
        const segmentColors = ['#ef4444', '#facc15', '#4ade80', '#16a34a']; 

        // --- Logic 2: Map the risk text to the standard color array ---
        const score = data.score;
        const riskDisplayElement = document.getElementById('riskLevelText');
        let riskValueText = '';
        let riskColor = '';

        if (score < 600) {
            riskValueText = 'High Risk';
            riskColor = segmentColors[0]; // Red is now at the START (Index 0)
        } else if (score < 700) {
            riskValueText = 'Moderate Risk';
            riskColor = segmentColors[1]; // Yellow is Index 1
        } else if (score < 800) {
            riskValueText = 'Minimal Risk';
            riskColor = segmentColors[2]; // Light Green is Index 2
        } else {
            riskValueText = 'No Risk';
            riskColor = segmentColors[3]; // Dark Green is now at the END (Index 3)
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
                
                // --- STANDARD NEEDLE DIRECTION ---
                // Low scores point Left (Red), high scores point Right (Green)
                const angle = Math.PI + (Math.max(0, Math.min(1, percentage)) * Math.PI); 

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
        
        const reasonsContainer = document.getElementById('aiReasons');
        reasonsContainer.innerHTML = ''; 

        // Build carousel
        let currentCard = 0;

        function renderCard(index) {
            const item = data.reasons[index];
            console.log(data)
            const container = document.getElementById('aiReasons');

            container.style.opacity = '0';
            container.style.transition = 'opacity 0.2s';

            setTimeout(() => {
                container.innerHTML = `
                    <div style="
                        background: #eee;
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    ">
                        <!-- Header badge -->
                        <div style="
                            background: ${item.color};
                            padding: 12px 10px;
                            text-align: center;
                        ">
                            <span style="
                                color: white;
                                font-weight: 900;
                                font-size: 15px;
                                padding: 4px 16px;
                                border-radius: 6px;
                                font-family: monospace;
                                letter-spacing: 0.5px;
                            ">${item.title}</span>
                        </div>

                        <!-- Body -->
                        <div style="padding: 18px 20px;">
                            <p style="
                                color: black;
                                font-size: 14px;
                                margin: 0 0 14px 0;
                                line-height: 1.6;
                            ">${item.desc}</p>

                            <p style="
                                color: ${item.color};
                                font-size: 13px;
                                margin: 0;
                                line-height: 1.6;
                            ">💡 ${item.advice}</p>
                        </div>
                    </div>
                `;
                document.getElementById('cardCounter').innerText = `${index + 1} / ${data.reasons.length}`;
                container.style.opacity = '1';
            }, 150);
        }

        window.changeCard = function(dir) {
            currentCard = (currentCard + dir + data.reasons.length) % data.reasons.length;
            renderCard(currentCard);
        };

        renderCard(0);

        document.getElementById('ledgerWallet').innerText = data.walletAddress;
        document.getElementById('ledgerBlock').innerText = data.blockNumber;
        document.getElementById('ledgerTime').innerText = data.timestamp;
        document.getElementById('ledgerGas').innerText = data.gasFee;
        document.getElementById('ledgerHash').innerText = `0x${data.blockHash}`;
    } else {
        document.getElementById('aiReasons').innerHTML = "<li>No data found. Please submit an application first.</li>";
    }
}
