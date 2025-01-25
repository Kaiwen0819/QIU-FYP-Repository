import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-storage.js";
import { getDatabase, ref as databaseRef, get, update, remove } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";
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

const updateForm = document.getElementById("update_form");
const updateButton = document.getElementById("update_btn");
const deleteButton = document.getElementById("delete_btn");
const fileList = document.getElementById("file_list");

// Load files dynamically
const loadFiles = (matricNumber) => {
    const userRef = databaseRef(database, `submissions/${matricNumber}`);
    get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            const files = data.pdfUrls || [];
            fileList.innerHTML = ""; // Clear previous list
            files.forEach((url, index) => {
                const listItem = document.createElement("li");
                const link = document.createElement("a");
                link.href = url;
                link.target = "_blank";
                link.textContent = `File ${index + 1}`;
                listItem.appendChild(link);
                fileList.appendChild(listItem);
            });
        } else {
            fileList.innerHTML = "<li>No files found for this matric number.</li>";
        }
    }).catch((error) => {
        console.error("Error loading files:", error);
    });
};

document.getElementById("update_pdf").addEventListener("change", (event) => {
    const fileInput = event.target;
    const selectedFiles = Array.from(fileInput.files).map(file => file.name);
    document.getElementById("selected_files").value = selectedFiles.join("\n");
});


document.addEventListener("DOMContentLoaded", () => {
    const matricNumberInput = document.getElementById("matric_number");

    matricNumberInput.addEventListener("blur", () => {
        const matricNumber = matricNumberInput.value;
        if (!matricNumber) {
            alert("Please enter a matric number.");
            return;
        }
        loadFiles(matricNumber);
    });

    // Update data
    updateButton.addEventListener("click", () => {
        const issueDate = document.getElementById("issue_date").value;
        const matricNumber = document.getElementById("matric_number").value;
        const author = document.getElementById("author").value;
        const title = document.getElementById("title").value;
        const subject = document.getElementById("subject").value;
        const files = document.getElementById("update_pdf").files;

        if (!issueDate || !matricNumber || !author || !title || !subject || files.length === 0) {
            alert("Please fill out all fields and upload at least one file.");
            return;
        }

        onAuthStateChanged(auth, (user) => {
            if (user) {
                const userRef = databaseRef(database, `submissions/${matricNumber}`);
                get(userRef).then((snapshot) => {
                    let updateData = { issueDate, matricNumber, author, title, subject };
                    const filePromises = Array.from(files).map((file) => {
                        const pdfStorageRef = storageRef(storage, `submissions/${matricNumber}/${file.name}`);
                        return uploadBytes(pdfStorageRef, file).then(() => getDownloadURL(pdfStorageRef));
                    });

                    Promise.all(filePromises)
                        .then((fileUrls) => {
                            updateData.pdfUrls = snapshot.val()?.pdfUrls ? [...snapshot.val().pdfUrls, ...fileUrls] : fileUrls;
                            return update(userRef, updateData);
                        })
                        .then(() => {
                            alert("Information updated successfully!");
                            loadFiles(matricNumber); // Refresh file list
                            document.getElementById("update_form").reset(); // Reset the form
                        })
                        .catch((error) => console.error("Error updating data:", error));
                });
            } else {
                alert("Please sign in to update your information.");
            }
        });
    });

    // Delete data
    deleteButton.addEventListener("click", () => {
        const matricNumber = document.getElementById("matric_number").value;

        if (!matricNumber) {
            alert("Please enter the matric number to delete.");
            return;
        }

        onAuthStateChanged(auth, (user) => {
            if (user) {
                const userRef = databaseRef(database, `submissions/${matricNumber}`);

                get(userRef).then((snapshot) => {
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        const fileUrls = data.pdfUrls || [];

                        // Delete files from Firebase Storage
                        const deletePromises = fileUrls.map((url) => {
                            const fileRef = storageRef(storage, decodeURIComponent(url.split("/").pop().split("?")[0]));
                            return deleteObject(fileRef);
                        });

                        Promise.all(deletePromises)
                            .then(() => {
                                // Delete record from Firebase Database
                                return remove(userRef);
                            })
                            .then(() => {
                                alert("Record and associated files deleted successfully!");
                                fileList.innerHTML = "<li>No files found for this matric number.</li>";
                                location.reload(); // Refresh the page after deletion
                            })
                            .catch((error) => {
                                console.error("Error deleting record or files:", error);
                                alert("Failed to delete submission.");
                            });
                    } else {
                        alert("No record found for this matric number.");
                    }
                });
            } else {
                alert("Please sign in to delete your information.");
            }
        });
    });

});
