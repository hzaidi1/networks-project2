async function getIP() {
    const ipDisplay = document.getElementById('ip-address');
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        ipDisplay.innerText = data.ip;
    } catch (error) {
        ipDisplay.innerText = "Check Connection";
        console.error("Error:", error);
    }
}

function handleStatusClick() {
    const display = document.getElementById('status-display');
    const protocol = window.location.protocol.toUpperCase(); 
    
    display.innerHTML = `
        <div style="margin-top: 10px; padding: 10px; border-left: 3px solid #7d5ba6;">
            <strong>Protocol:</strong> ${protocol}<br>
            <strong>Status:</strong> 200 OK
        </div>
    `;
}

window.onload = () => {
    getIP();
    const btn = document.getElementById('check-status');
    if (btn) {
        btn.onclick = handleStatusClick;
    }
};