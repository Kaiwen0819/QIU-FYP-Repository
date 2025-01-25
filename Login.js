// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCdDARsBRoibXkpog7tMKZg2XRna8HmziA",
    authDomain: "fyp-database-qiu.firebaseapp.com",
    projectId: "fyp-database-qiu",
    storageBucket: "fyp-database-qiu.firebasestorage.app",
    messagingSenderId: "333851888915",
    appId: "1:333851888915:web:1334d508e76bb4a8d29ee6",
    measurementId: "G-193CZ8VHZM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.getElementById("submit");

    loginButton.addEventListener("click", async (event) => {
        event.preventDefault();

        // Get input values
        const matricNumber = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;

        // Validate Matric Number
        const matricPattern = /^[A-Za-z0-9]+$/; // Only letters and numbers
        if (!matricPattern.test(matricNumber)) {
            alert("Invalid Matric Number! Only letters and numbers are allowed or cannot be empty!");
            return;
        }

        if (!password) {
            alert("Password cannot be empty.");
            return;
        }

        // Convert Matric Number to pseudo-email
        const pseudoEmail = `${matricNumber}@example.com`;

        try {
            // Authenticate with Firebase
            const userCredential = await signInWithEmailAndPassword(auth, pseudoEmail, password);

            // Firebase authentication successful
            const user = userCredential.user;

            // Check the first letter of Matric Number
            const firstLetter = matricNumber.charAt(0).toLowerCase(); // Get first letter and convert to lowercase

            if (firstLetter === "q") {
                // Redirect to User.html if Matric Number starts with 'Q/q'
                alert("Login successful! Redirecting to User page...");
                window.location.href = "Home(User).html";
            } else if (firstLetter === "a") {
                // Redirect to Admin.html if Matric Number starts with 'A/a'
                alert("Login successful! Redirecting to Admin page...");
                window.location.href = "Home(Admin).html";
            } else {
                alert("Invalid Matric Number. It should start with 'Q' or 'A'.");
            }
        } catch (error) {
            // Handle login errors
            console.error("Login error:", error.message);
            alert(`Error: ${error.message}`);
        }
    });
});
