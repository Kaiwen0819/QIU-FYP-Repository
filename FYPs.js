import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";
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
const database = getDatabase(app);
const auth = getAuth();

// Add a search row dynamically
function addSearchRow() {
    const additionalRows = document.getElementById('additional-rows');
    const row = document.createElement('div');
    row.classList.add('search-group');
    row.innerHTML = `
        <select>
            <option>Select Browse Option</option>
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="issuedDate">Issued Date</option>
            <option value="matricNumber">Matric Number</option>
            <option value="subject">Subject</option>
        </select>
        <input type="text" placeholder="Enter keyword">
    `;
    additionalRows.appendChild(row);
}

// Reset the search form
function resetSearchForm() {
    // Reset form inputs
    document.getElementById('search-form').reset();

    // Clear dynamically added rows
    document.getElementById('additional-rows').innerHTML = '';

    // Clear only the table body, not the entire table
    const resultsBody = document.getElementById('results-body');
    if (resultsBody) {
        resultsBody.innerHTML = ''; // Clear previous search results
    }

    // Hide the table
    const resultsTable = document.getElementById('results-table');
    if (resultsTable) {
        resultsTable.style.display = 'none'; // Hide the table
    }
}


// Fetch and display search results
function fetchSearchResults(event) {
    event.preventDefault();

    const searchGroups = document.querySelectorAll('.search-group');
    const searchCriteria = Array.from(searchGroups).map((group) => {
        const select = group.querySelector('select');
        const input = group.querySelector('input');
        return { field: select.value, value: input.value.trim().toLowerCase() };
    });

    if (searchCriteria.some(criteria => !criteria.value)) {
        alert("Please fill out all search criteria.");
        return;
    }

    const resultsBody = document.getElementById('results-body');
    const resultsTable = document.getElementById('results-table');
    resultsBody.innerHTML = ""; // Clear previous results

    const submissionsRef = ref(database, 'submissions');
    onValue(submissionsRef, (snapshot) => {
        if (snapshot.exists()) {
            const submissions = snapshot.val();
            const filteredResults = Object.entries(submissions).filter(([key, submission]) =>
                searchCriteria.every(criteria =>
                    submission[criteria.field]?.toLowerCase().includes(criteria.value)
                )
            );

            if (filteredResults.length > 0) {
                if (resultsTable) {
                    resultsTable.style.display = "table"; // Show the table
                }
                filteredResults.forEach(([key, submission]) => {
                    const row = document.createElement('tr');

                    // Add Title
                    const titleCell = document.createElement('td');
                    titleCell.textContent = submission.title || "No title";
                    row.appendChild(titleCell);

                    // Add Author
                    const authorCell = document.createElement('td');
                    authorCell.textContent = submission.author || "No author";
                    row.appendChild(authorCell);

                    // Add Date Issued
                    const dateIssuedCell = document.createElement('td');
                    dateIssuedCell.textContent = submission.issueDate || "Not specified";
                    row.appendChild(dateIssuedCell);

                    // Add Matric Number
                    const matricNumberCell = document.createElement('td');
                    matricNumberCell.textContent = key;
                    row.appendChild(matricNumberCell);

                    // Add Subject
                    const subjectCell = document.createElement('td');
                    subjectCell.textContent = submission.subject || "Not specified";
                    row.appendChild(subjectCell);

                    // Add Files
                    const filesCell = document.createElement('td');
                    if (submission.pdfUrls && submission.pdfUrls.length > 0) {
                        const filesList = document.createElement('ul');
                        submission.pdfUrls.forEach(fileUrl => {
                            const fileItem = document.createElement('li');
                            fileItem.innerHTML = `<a href="${fileUrl}" target="_blank">View File</a>`;
                            filesList.appendChild(fileItem);
                        });
                        filesCell.appendChild(filesList);
                    } else {
                        filesCell.textContent = "No files available.";
                    }
                    row.appendChild(filesCell);

                    // Add Actions
                    const actionsCell = document.createElement('td');
                    actionsCell.innerHTML = `
                        <button class="btn-update" data-matric="${key}">Update</button>
                        <button class="btn-delete" data-matric="${key}">Delete</button>
                    `;
                    row.appendChild(actionsCell);

                    // Add event listeners for Update and Delete buttons
                    actionsCell.querySelector('.btn-update').addEventListener('click', function () {
                        const matricNumber = this.getAttribute('data-matric');
                        window.location.href = `Update.html?matricNumber=${matricNumber}`;
                    });

                    actionsCell.querySelector('.btn-delete').addEventListener('click', function () {
                        const matricNumber = this.getAttribute('data-matric');
                        if (confirm("Are you sure you want to delete this submission?")) {
                            const submissionRef = ref(database, `submissions/${matricNumber}`);
                    
                            // Remove row from UI immediately
                            row.remove();
                    
                            set(submissionRef, null)
                                .then(() => {
                                    alert("Submission deleted successfully!");
                                    
                                    // Re-run the search after deletion to update UI
                                    fetchSearchResults(new Event('submit'));
                                })
                                .catch((error) => {
                                    console.error("Error deleting submission:", error.message);
                                    alert("Failed to delete submission.");
                                });
                        }
                    });
                    
                    resultsBody.appendChild(row);
                });
            } else {
                if (resultsTable) {
                    resultsTable.style.display = "none"; // Hide table if no results
                    alert("No submissions found in the database.");
                }
            }
        } else {
            if (resultsTable) {
                resultsTable.style.display = "none"; // Hide table if no data in Firebase
            }
            alert("No submissions found in the database.");
        }
    }, (error) => {
        console.error("Error fetching data:", error.message);
        alert("An error occurred while fetching data.");
    });
}





// Attach event listeners
document.getElementById('add-column-btn').addEventListener('click', addSearchRow);
document.getElementById('search-form').addEventListener('submit', fetchSearchResults);
document.getElementById('reset-btn').addEventListener('click', resetSearchForm);
