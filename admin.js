let allApplications = [];

// LOAD DATA FROM BACKEND
async function loadApplications() {
    try {
        const response = await fetch("https://eict-job-portal-backend.onrender.com/applications");
        const data = await response.json();

        allApplications = data; // store for search
        displayApplications(data);

    } catch (err) {
        console.error("Error loading applications:", err);
    }
}

// DISPLAY DATA (REUSABLE)
function displayApplications(data) {
    const container = document.getElementById("applications");
    container.innerHTML = "";

    data.forEach((app) => {
        const div = document.createElement("div");

        div.innerHTML = `
            <p><strong>Name:</strong> ${app.name}</p>
            <p><strong>Email:</strong> ${app.email}</p>
            <p><strong>Position:</strong> ${app.position}</p>

            <p style="color:green;font-weight:bold;">Status: Active</p>

            <button onclick="editApplication('${app._id}', '${app.name}', '${app.email}', '${app.position}')">Edit</button>
            <button onclick="deleteApplication('${app._id}')">Delete</button>
        `;

        container.appendChild(div);
    });
}

// DELETE FUNCTION
async function deleteApplication(id) {
    try {
        await fetch(`https://eict-job-portal-backend.onrender.com/applications/${id}`, {
            method: "DELETE"
        });

        // reload after delete
        loadApplications();

    } catch (err) {
        console.error("Delete failed:", err);
    }
}

// SEARCH FUNCTION
document.getElementById("searchInput").addEventListener("input", function () {
    const value = this.value.toLowerCase();

    const filtered = allApplications.filter(app =>
        app.name.toLowerCase().includes(value)
    );

    displayApplications(filtered);
});

let currentEditId = null;

function editApplication(id, name, email, position) {
    currentEditId = id;

    document.getElementById("editName").value = name;
    document.getElementById("editEmail").value = email;
    document.getElementById("editPosition").value = position;

    document.getElementById("editModal").style.display = "flex";
}

async function saveEdit() {
    const name = document.getElementById("editName").value;
    const email = document.getElementById("editEmail").value;
    const position = document.getElementById("editPosition").value;

    try {
        await fetch(`https://eict-job-portal-backend.onrender.com/applications/${currentEditId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, position })
        });

        closeModal();
        loadApplications();

    } catch (err) {
        console.error("Update failed:", err);
    }
}

function closeModal() {
    document.getElementById("editModal").style.display = "none";
}

async function updateApplication(id, name, email, position) {
    try {
        await fetch(`https://eict-job-portal-backend.onrender.com/applications/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, position })
        });

        loadApplications();

    } catch (err) {
        console.error("Update failed:", err);
    }
}

// INITIAL LOAD
loadApplications();