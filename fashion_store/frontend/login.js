// frontend/login.js

const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');
const authMessage = document.getElementById('auth-message');

// Handle Signup
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    try {
        const res = await fetch('http://localhost:5000/api/users/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.msg || 'Signup failed');
        }
        authMessage.textContent = 'Signup successful! Please log in.';
        authMessage.className = 'alert alert-success';
    } catch (err) {
        authMessage.textContent = err.message;
        authMessage.className = 'alert alert-danger';
    }
});

// Handle Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    try {
        const res = await fetch('http://localhost:5000/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.msg || 'Login failed');
        }
        const { token } = await res.json();
        localStorage.setItem('token', token); // Save token

        // Redirect to the main homepage after successful login
        window.location.href = 'home.html';

    } catch (err) {
        authMessage.textContent = err.message;
        authMessage.className = 'alert alert-danger';
    }
});