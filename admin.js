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

// Reference to the submissions data
const submissionsRef = ref(database, "submissions");

// Fetch data and populate the table
const tableBody = document.getElementById("fyp-table").querySelector("tbody");

onValue(submissionsRef, (snapshot) => {
    console.log(snapshot.val()); // Log the full data for debugging
    tableBody.innerHTML = ""; // Clear the table before adding new rows

    snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();

        // Create a row for the submission
        const row = document.createElement("tr");

        // Generate file links for multiple PDFs
        let fileLinks = "N/A";
        if (data.pdfUrls && data.pdfUrls.length > 0) {
            fileLinks = data.pdfUrls.map((url, index) => 
                `<a href="${url}" target="_blank">File ${index + 1}</a>`
            ).join("<br>"); // Join links with a line break for display
        }

        row.innerHTML = `
            <td>${data.issueDate || "N/A"}</td>
            <td>${data.matricNumber || "N/A"}</td>
            <td>${data.author || "N/A"}</td>
            <td>${data.title || "N/A"}</td>
            <td>${data.subject || "N/A"}</td>
            <td>${fileLinks}</td>
        `;

        tableBody.appendChild(row);
    });
});
