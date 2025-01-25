// Firebase configuration and initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

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

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Reference to the supervisor scores data
const scoresRef = ref(database, "Supervisor");

const tableBody = document.getElementById("score-table").querySelector("tbody");

onValue(scoresRef, (snapshot) => {
    console.log(snapshot.val()); // Log the data for debugging
    tableBody.innerHTML = ""; // Clear the table before adding new rows

    snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${data.matricNumber || "N/A"}</td>
            <td>${data.presentation || "N/A"}</td>
            <td>${data.content || "N/A"}</td>
            <td>${data.innovation || "N/A"}</td>
            <td>${data.documentation || "N/A"}</td>
        `;

        tableBody.appendChild(row);
    });
});
