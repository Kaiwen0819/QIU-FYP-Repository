import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-storage.js";
import { getDatabase, ref as databaseRef, get, set } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";


// Firebase configuration
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
const storage = getStorage(app);
const database = getDatabase(app);
const auth = getAuth();

let latestSubmission = null; // Variable to store the most recent submission

// Add event listener for the Submit button
document.getElementById("fyp_submission_form").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent the form from submitting the default way

    // Collect form data
    const issueDate = document.getElementById("issue_date").value;
    const author = document.getElementById("author").value;
    const title = document.getElementById("title").value;
    const subject = document.getElementById("subject").value;
    const matricNumber = document.getElementById("matric_number").value;
    const files = document.getElementById("pdf").files; // Multiple PDF files

    // Validation to ensure fields are not empty
    if (!issueDate || !author || !title || !subject || !matricNumber || files.length === 0) {
        alert("Please fill out all fields and upload at least one PDF file before submitting.");
        return;
    }

    // Check if the user is signed in
    onAuthStateChanged(auth, function (user) {
        if (user) {
            console.log('User is signed in:', user);

            // Save data to Firebase Realtime Database
            const uniqueKey = Date.now(); // Use a unique key based on timestamp
            const submissionRef = databaseRef(database, `submissions/${matricNumber}`);

            const filePromises = Array.from(files).map(file => {
                // Save the PDF file to Firebase Storage
                const pdfStorageRef = storageRef(storage, `submissions/${matricNumber}/${file.name}`);
                return uploadBytes(pdfStorageRef, file).then(() => getDownloadURL(pdfStorageRef));
            });

            Promise.all(filePromises)
                .then((fileUrls) => {
                    // Save the rest of the data to Realtime Database, including the PDF URLs
                    latestSubmission = {
                        issueDate: issueDate,
                        author: author,
                        matricNumber: matricNumber,
                        title: title,
                        subject: subject,
                        timestamp: new Date().toISOString(),
                        pdfUrls: fileUrls,
                    };

                    return set(submissionRef, latestSubmission);
                })
                .then(() => {
                    const messageBox = document.getElementById("message-box");
                    messageBox.textContent = "Submission successfully saved!";
                    messageBox.style.color = "green"; // Change text color for success
                    document.getElementById("fyp_submission_form").reset(); // Reset the form
                })
                .catch((error) => {
                    const messageBox = document.getElementById("message-box");
                    messageBox.textContent = `Failed to save submission: ${error.message}`;
                    messageBox.style.color = "red"; // Change text color for errors
                    console.error("Error saving data:", error.message);
                });
        } else {
            console.log('No user is signed in.');
            alert("Please sign in to submit your project.");
            // Redirect to login page if needed
            window.location.href = "Login.html";
        }
    });
});

document.getElementById("view_submissions").addEventListener("click", function () {
    const submissionTable = document.getElementById("submission_table");
    const tableBody = submissionTable.querySelector("tbody");

    if (latestSubmission) {
        // Clear the table and display the most recent submission with Update and Delete buttons
        tableBody.innerHTML = `
            <tr>
                <td>${latestSubmission.issueDate}</td>
                <td>${latestSubmission.matricNumber}</td>
                <td>${latestSubmission.author}</td>
                <td>${latestSubmission.title}</td>
                <td>${latestSubmission.subject}</td>
                <td>
                    ${latestSubmission.pdfUrls.map(
                        (url) => `<a href="${url}" target="_blank">View File</a>`
                    ).join(", ")}
                </td>
                <td>
                    <button class="btn-update" data-matric="${latestSubmission.matricNumber}">Update</button>
                    <button class="btn-delete" data-matric="${latestSubmission.matricNumber}">Delete</button>
                </td>
            </tr>
        `;

        submissionTable.style.display = "table"; // Show the table

        // Add event listeners for Update and Delete buttons
        document.querySelectorAll(".btn-update").forEach((btn) =>
            btn.addEventListener("click", function () {
                const matricNumber = btn.getAttribute("data-matric");
                window.location.href = `Update.html?matricNumber=${matricNumber}`;
            })
        );

        document.querySelectorAll(".btn-delete").forEach((btn) =>
            btn.addEventListener("click", function () {
                const matricNumber = btn.getAttribute("data-matric");
                if (confirm("Are you sure you want to delete this submission?")) {
                    // Delete from Firebase
                    const submissionRef = databaseRef(database, `submissions/${matricNumber}`);
                    set(submissionRef, null)
                        .then(() => {
                            alert("Submission deleted successfully!");
                            submissionTable.style.display = "none"; // Hide the table after deletion
                            location.reload(); // Refresh the page after deletion
                        })
                        .catch((error) => {
                            console.error("Error deleting submission:", error);
                            alert("Failed to delete submission.");
                        });
                }
            })
        );
    } else {
        alert("No recent submission found. You can go to the Search FYP page to find your profile. (If you already submit one time!!)");
        window.location.href = "FYPs.html"; // Redirect to FYPs.html
    }
});

