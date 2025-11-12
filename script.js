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
const watchingGrid = document.getElementById("watchingGrid");
const watchedGrid = document.getElementById("watchedGrid");
const planGrid = document.getElementById("planGrid");
const countWatching = document.getElementById("countWatching");
const countWatched = document.getElementById("countWatched");
const countPlan = document.getElementById("countPlan");

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
const duplicate = items.some(
(i) => i.title.toLowerCase() === title.toLowerCase() && i.id !== editingId
);
if (duplicate) {
alert("A title with this name already exists!");
return;
}

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

function createCard(item) {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <div>
      <h3>${item.title}</h3>
      <small>${item.genre || "No genre"}</small>
      <div class="badge ${item.status}">${item.status}</div>
    </div>
    <div class="note-section">${item.notes || "No notes yet."}</div>
    <div class="actions">
      <button class="edit">Edit</button>
      <button class="delete">Delete</button>
    </div>
  `;
  card.querySelector(".edit").onclick = () => openModal(item.id);
  card.querySelector(".delete").onclick = () => deleteItem(item.id);
  return card;
}

function render() {
  const q = (searchInput.value || "").toLowerCase();

  const filtered = items.filter(
    (i) =>
      i.title.toLowerCase().includes(q) ||
      i.genre.toLowerCase().includes(q) ||
      i.notes.toLowerCase().includes(q)
  );

  watchingGrid.innerHTML = "";
  watchedGrid.innerHTML = "";
  planGrid.innerHTML = "";

  filtered.forEach((it) => {
    const card = createCard(it);
    if (it.status === "Watching") watchingGrid.append(card);
    else if (it.status === "Watched") watchedGrid.append(card);
    else planGrid.append(card);
  });

  countWatching.textContent = `(${filtered.filter(i=>i.status==='Watching').length})`;
  countWatched.textContent = `(${filtered.filter(i=>i.status==='Watched').length})`;
  countPlan.textContent = `(${filtered.filter(i=>i.status==='Plan to Watch').length})`;
}

searchInput.addEventListener("input", render);
if(filterSelect)
    filterSelect.addEventListener("change", render);

window.addEventListener("DOMContentLoaded", loadItems);
