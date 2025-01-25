// Firebase configuration and initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCdDARsBRoibXkpog7tMKZg2XRna8HmziA",
    authDomain: "fyp-database-qiu.firebaseapp.com",
    databaseURL: "https://fyp-database-qiu-default-rtdb.firebaseio.com",
    projectId: "fyp-database-qiu",
    storageBucket: "fyp-database-qiu.firebasestorage.app",
    messagingSenderId: "333851888915",
    appId: "1:333851888915:web:1334d508e76bb4a8d29ee6",
    measurementId: "G-193CZ8VHZM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Form submission handler
document.getElementById("submitBtn").addEventListener("click", () => {
    const form = document.getElementById("markingForm");
    const matricNumber = form.matricNumber.value.trim();
    const data = {
        matricNumber,
        presentation: form.presentation.value,
        content: form.content.value,
        innovation: form.innovation.value,
        documentation: form.documentation.value,
    };

    if (!matricNumber) {
        alert("Matric number is required.");
        return;
    }

    const dbRef = ref(database, `Moderator/${matricNumber}`);
    set(dbRef, data)
        .then(() => {
            alert("Scores submitted successfully!");
            form.reset();
        })
        .catch((error) => {
            alert("Error: " + error.message);
            console.error("Error submitting data:", error);
        });
});
