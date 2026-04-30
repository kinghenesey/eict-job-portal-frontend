let allApplications = [];
let currentEditId = null;

// ================= LOAD APPLICATIONS =================
async function loadApplications() {
    try {
        const response = await fetch("https://eict-job-portal-backend.onrender.com/applications");
        const data = await response.json();

        allApplications = data;
        displayApplications(data);

        updateStats(data); // 👈 NEW

    } catch (err) {
        console.error("Error loading applications:", err);
    }
}

// ================= DISPLAY =================
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

// ================= DELETE =================
async function deleteApplication(id) {
    try {
        await fetch(`https://eict-job-portal-backend.onrender.com/applications/${id}`, {
            method: "DELETE"
        });

        loadApplications();

    } catch (err) {
        console.error("Delete failed:", err);
    }
}

// ================= EDIT =================
function editApplication(id, name, email, position) {
    currentEditId = id;

    document.getElementById("editName").value = name;
    document.getElementById("editEmail").value = email;
    document.getElementById("editPosition").value = position;

    document.getElementById("editModal").style.display = "flex";
}

// ================= SAVE EDIT =================
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

// ================= CLOSE MODAL =================
function closeModal() {
    document.getElementById("editModal").style.display = "none";
}

// ================= UPDATE (OPTIONAL LEGACY FUNCTION) =================
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

// ================= TEAM MEMBER =================
async function addTeam() {
    const name = document.getElementById("teamName").value;
    const role = document.getElementById("teamRole").value;
    const image = document.getElementById("teamImage").value;

    if (!name || !role || !image) {
        alert("Please fill all fields");
        return;
    }

    await fetch("https://eict-job-portal-backend.onrender.com/team", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, role, image })
    });

    alert("Team member added!");

    document.getElementById("teamName").value = "";
    document.getElementById("teamRole").value = "";
    document.getElementById("teamImage").value = "";
}

// ================= DARK MODE =================
function toggleDarkMode() {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
}

// ================= THEME LOAD =================
window.addEventListener("load", () => {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark");
    }
});

// ================= SEARCH (CLEAN SINGLE VERSION) =================
document.getElementById("searchInput").addEventListener("input", function () {
    const value = this.value.toLowerCase();


    const filtered = allApplications.filter(app =>
        app.name.toLowerCase().includes(value)
    );

    displayApplications(filtered);
});

function updateStats(data) {
    const total = data.length;

    const frontend = data.filter(app => app.position.toLowerCase().includes("frontend")).length;
    const backend = data.filter(app => app.position.toLowerCase().includes("backend")).length;
    const fullstack = data.filter(app => app.position.toLowerCase().includes("full")).length;

    document.getElementById("totalApps").innerText = total;
    document.getElementById("frontendCount").innerText = frontend;
    document.getElementById("backendCount").innerText = backend;
    document.getElementById("fullstackCount").innerText = fullstack;
}

// ================= INITIAL LOAD =================
loadApplications();