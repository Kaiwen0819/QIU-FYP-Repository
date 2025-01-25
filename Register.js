// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCdDARsBRoibXkpog7tMKZg2XRna8HmziA",
    authDomain: "fyp-database-qiu.firebaseapp.com",
    databaseURL: "https://fyp-database-qiu.firebaseio.com",
    projectId: "fyp-database-qiu",
    storageBucket: "fyp-database-qiu.firebasestorage.app",
    messagingSenderId: "333851888915",
    appId: "1:333851888915:web:1334d508e76bb4a8d29ee6",
    measurementId: "G-193CZ8VHZM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Wait for the DOM to load before attaching event listeners
document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("register-form");

    registerForm.addEventListener("submit", (event) => {
        event.preventDefault();

        // Get input values
        const matricNumber = document.getElementById("matric-number").value.trim();
        const password = document.getElementById("password").value;

        // Validate Matric Number
        const matricPattern = /^[A-Za-z0-9]+$/; // Only letters and numbers
        if (!matricPattern.test(matricNumber)) {
            alert("Invalid Matric Number! Only letters and numbers are allowed.");
            return;
        }

        if (!password) {
            alert("Password cannot be empty.");
            return;
        }

        // Create a pseudo email for Firebase authentication
        const pseudoEmail = `${matricNumber}@example.com`;

        // Register user in Firebase Authentication
        createUserWithEmailAndPassword(auth, pseudoEmail, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log("User created successfully:", user);
            })
            .then(() => {
                console.log("Data saved successfully in Firebase.");
                alert("Account successfully created!");
                window.location.href = "Login.html";
            })
            .catch((error) => {
                console.error("Error occurred:", error.message);
                alert(`Error: ${error.message}`);
            });

    });
});
