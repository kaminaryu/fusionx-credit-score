if (document.getElementById('login-page')) {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const adminId = document.getElementById('adminId').value;
        const adminPin = document.getElementById('adminPin').value;
        const errorMsg = document.getElementById('loginError');

        if (adminId === "admin" && adminPin === "2026") {
            window.location.href = "admin.html";
        } else {
            errorMsg.style.display = "block"; 
        }
    });
}