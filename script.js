const grid = document.getElementById("grid");
const addBtn = document.getElementById("addBtn");
const modal = document.getElementById("modal");
const titleInput = document.getElementById("titleInput");
const statusInput = document.getElementById("statusInput");
const genreInput = document.getElementById("genreInput");
const notesInput = document.getElementById("notesInput");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");
const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("filterSelect");

let items = [];
let editingId = null;
const API_URL = "backend.php";

async function loadItems() {
const res = await fetch(API_URL);
items = await res.json();
render();
}


addBtn.addEventListener("click", () => openModal());
cancelBtn.addEventListener("click", closeModal);
saveBtn.addEventListener("click", saveItem);

function openModal(id = null) {
editingId = id;
if (id) {
const item = items.find(i => i.id === id);
titleInput.value = item.title;
statusInput.value = item.status;
genreInput.value = item.genre;
notesInput.value = item.notes;
document.getElementById("modalTitle").textContent = "Edit Title";
} else {
titleInput.value = "";
statusInput.value = "Plan to Watch";
genreInput.value = "";
notesInput.value = "";
document.getElementById("modalTitle").textContent = "Add Title";
}
modal.classList.remove("hidden");
}

function closeModal() {
modal.classList.add("hidden");
editingId = null;
}


async function saveItem() {
const title = titleInput.value.trim();
if (!title) return alert("Enter a title!");

const itemData = {
title,
status: statusInput.value,
genre: genreInput.value,
notes: notesInput.value,
};

let res;
if (editingId) {
itemData.id = editingId;
res = await fetch(API_URL, {
method: "PUT",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(itemData),
});
} else {
res = await fetch(API_URL, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(itemData),
});
}

const data = await res.json();
if (data.success) {
await loadItems();
closeModal();
} else {
alert(data.error || "Something went wrong!");
}
}


async function deleteItem(id) {
if (!confirm("Delete this item?")) return;
const res = await fetch(API_URL, {
method: "DELETE",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ id }),
});
const data = await res.json();
if (data.success) loadItems();
}


function render() {
const q = searchInput.value.toLowerCase();
const filter = filterSelect.value;
grid.innerHTML = "";

const filtered = items.filter(i => {
const matchesQuery =
i.title.toLowerCase().includes(q) ||
i.notes.toLowerCase().includes(q) ||
i.genre.toLowerCase().includes(q);
const matchesFilter = filter === "All" || i.status === filter;
return matchesQuery && matchesFilter;
});

if (filtered.length === 0) {
grid.innerHTML = `<p style="color:#999;text-align:center;">No titles found.</p>`;
return;
}

filtered.forEach(item => {
const card = document.createElement("div");
card.className = "card";
card.innerHTML = `       <div>         <h3>${item.title}</h3>         <small>${item.genre || "No genre"}</small>         <div class="badge ${item.status}">${item.status}</div>       </div>       <div class="note-section">${item.notes || "No notes yet."}</div>       <div class="actions">         <button class="edit">Edit</button>         <button class="delete">Delete</button>       </div>
    `;
card.querySelector(".edit").addEventListener("click", () => openModal(item.id));
card.querySelector(".delete").addEventListener("click", () => deleteItem(item.id));
grid.appendChild(card);
});
}

searchInput.addEventListener("input", render);
filterSelect.addEventListener("change", render);

window.addEventListener("DOMContentLoaded", loadItems);
