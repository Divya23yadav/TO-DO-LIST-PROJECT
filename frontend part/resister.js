async function register() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.message === "User registered successfully") {
        alert("Registration successful! Please login.");
        window.location.href = "login.html";
    } else {
        document.getElementById("message").innerText = data.error;
    }
}