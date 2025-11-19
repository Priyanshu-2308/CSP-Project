
const API = "backend.php";

const authView = document.getElementById("authView");
const appView = document.getElementById("appView");

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const showSignup = document.getElementById("showSignup");
const showLogin = document.getElementById("showLogin");

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const signupName = document.getElementById("signupName");
const signupEmail = document.getElementById("signupEmail");
const signupPassword = document.getElementById("signupPassword");

const searchInput = document.getElementById("searchInput");

const watchingGrid = document.getElementById("watchingGrid");
const watchedGrid = document.getElementById("watchedGrid");
const planGrid = document.getElementById("planGrid");

const addFloatingBtn = document.getElementById("addFloatingBtn");
const modal = document.getElementById("modal");
const titleInput = document.getElementById("titleInput");
const statusInput = document.getElementById("statusInput");
const genreInput = document.getElementById("genreInput");
const platformInput = document.getElementById("platformInput");
const notesInput = document.getElementById("notesInput");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");
const modalTitle = document.getElementById("modalTitle");

const profileBtn = document.getElementById("profileBtn");
const profileModal = document.getElementById("profileModal");
const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profilePicInput = document.getElementById("profilePicInput");
const profilePicSmall = document.getElementById("profilePicSmall");
const saveProfileBtn = document.getElementById("saveProfileBtn");
const logoutBtn = document.getElementById("logoutBtn");

const countWatching = document.getElementById("countWatching");
const countWatched = document.getElementById("countWatched");
const countPlan = document.getElementById("countPlan");

let currentUser = null;
let items = [];
let editingId = null;

function show(el) { el.classList.remove("hidden"); }
function hide(el) { el.classList.add("hidden"); }

async function api(action, payload = {}) {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ action, ...payload }),
  });
  return res.json();
}

const THEMES = {
  default: {
    "--bg": "#fff8f2",
    "--text": "#000000ff",
    "--page-accent": "#ffb5a7",
    "--card-bg": "#eaf7f1",
    "--note-bg": "#fff1c6",
    "--col-watching": "#d8f3dc",
    "--col-watched": "#e9d8fd",
    "--col-plan": "#ffe5d9",
    "--header-grad": "linear-gradient(90deg,#ffe5d9,#e9d8fd,#d8f3dc)",
  },

  thriller: {
    "--bg": "#0d0f14",
    "--text": "#e8e8e8",
    "--page-accent": "#ff4747",
    "--card-bg": "#1a1f27",
    "--note-bg": "#232a33",
    "--col-watching": "#1c2732",
    "--col-watched": "#2a3038",
    "--col-plan": "#161c22",
    "--header-grad": "linear-gradient(90deg,#0d0f14,#1a1f27,#0d0f14)",
  },

  romance: {
    "--bg": "#fff8fb",
    "--page-accent": "#ff7da5",
    "--card-bg": "#ffe7f0",
    "--note-bg": "#ffdce8",
    "--col-watching": "#ffd0dd",
    "--col-watched": "#ffe0eb",
    "--col-plan": "#ffeaf1",
    "--header-grad": "linear-gradient(90deg,#ffeaf1,#ffd0dd,#ffe0eb)",
  },

  action: {
    "--bg": "#fff6f2",
    "--page-accent": "#ff5436",
    "--card-bg": "#ffe3db",
    "--note-bg": "#ffd2c3",
    "--col-watching": "#ffb19c",
    "--col-watched": "#ffc6b4",
    "--col-plan": "#ffded5",
    "--header-grad": "linear-gradient(90deg,#ffded5,#ffb19c,#ffc6b4)",
  },

  drama: {
    "--bg": "#f3f6f9",
    "--page-accent": "#6a90c8",
    "--card-bg": "#e4edf7",
    "--note-bg": "#d4e1ee",
    "--col-watching": "#c2d3e5",
    "--col-watched": "#cddbeb",
    "--col-plan": "#dde8f2",
    "--header-grad": "linear-gradient(90deg,#dde8f2,#c2d3e5,#cddbeb)",
  },

  scifi: {
    "--bg": "#f2fbff",
    "--page-accent": "#29b8ff",
    "--card-bg": "#d8f1ff",
    "--note-bg": "#c5eaff",
    "--col-watching": "#aee1ff",
    "--col-watched": "#bae6ff",
    "--col-plan": "#daf4ff",
    "--header-grad": "linear-gradient(90deg,#daf4ff,#aee1ff,#bae6ff)",
  },

  horror: {
    "--bg": "#fff6f6",
    "--page-accent": "#c1121f",
    "--card-bg": "#ffdddd",
    "--note-bg": "#ffd0d0",
    "--col-watching": "#ffb8b8",
    "--col-watched": "#ffc7c7",
    "--col-plan": "#ffe2e2",
    "--header-grad": "linear-gradient(90deg,#ffe2e2,#ffb8b8,#ffc7c7)",
  },

  fantasy: {
    "--bg": "#f8f6ff",
    "--page-accent": "#a37aff",
    "--card-bg": "#e8deff",
    "--note-bg": "#d9eaff",
    "--col-watching": "#d0c4ff",
    "--col-watched": "#cbe3ff",
    "--col-plan": "#eee6ff",
    "--header-grad": "linear-gradient(90deg,#eee6ff,#d0c4ff,#cbe3ff)",
  },

  mystery: {
    "--bg": "#f4f4f8",
    "--page-accent": "#3f478a",
    "--card-bg": "#dedff0",
    "--note-bg": "#c9cbdd",
    "--col-watching": "#b8bad2",
    "--col-watched": "#c2c3d9",
    "--col-plan": "#d9dae8",
    "--header-grad": "linear-gradient(90deg,#d9dae8,#b8bad2,#c2c3d9)",
  },
  sliceoflife: {
  "--bg": "#fefbf5",
  "--page-accent": "#e7b971",
  "--card-bg": "#f7ecd8",
  "--note-bg": "#f2e3c6",
  "--col-watching": "#edd8b2",
  "--col-watched": "#f2e1c7",
  "--col-plan": "#faefdf",
  "--header-grad": "linear-gradient(90deg,#faefdf,#edd8b2,#f2e1c7)",
},
adult: {
  "--bg": "#1a1a20",
  "--page-accent": "#b84a6b",
  "--card-bg": "#2a2830",
  "--note-bg": "#34323c",
  "--col-watching": "#3f3d48",
  "--col-watched": "#484651",
  "--col-plan": "#2f2c35",
  "--header-grad": "linear-gradient(90deg,#1a1a20,#2a2830,#1a1a20)",
},
romcom: {
  "--bg": "#fffafc",
  "--page-accent": "#ff82c2",
  "--card-bg": "#ffe6f3",
  "--note-bg": "#ffd7ea",
  "--col-watching": "#ffc7e4",
  "--col-watched": "#ffd3ec",
  "--col-plan": "#ffebf6",
  "--header-grad": "linear-gradient(90deg,#ffebf6,#ffc7e4,#ffd3ec)",
},
crime: {
  "--bg": "#121417",
  "--page-accent": "#d32f2f",
  "--card-bg": "#1e2126",
  "--note-bg": "#292d33",
  "--col-watching": "#2f333a",
  "--col-watched": "#3a3f46",
  "--col-plan": "#25282d",
  "--header-grad": "linear-gradient(90deg,#121417,#1e2126,#121417)",
},


};


const KEYWORD_TO_THEME = {
  romance: "romance",
  love: "romance",
  thriller: "thriller",
  action: "action",
  horror: "horror",
  fantasy: "fantasy",
  mystery: "mystery",
  scifi: "scifi",
  drama: "drama",
  sliceoflife: "sliceoflife",
  crime: "crime",
  adult: "adult",
  romcom: "romcom",
};
function applyTheme(name) {
  const theme = THEMES[name] || THEMES.default;
  Object.keys(theme).forEach((k) =>
    document.documentElement.style.setProperty(k, theme[k])
  );
}
function themeFromQuery(q) {
  q = q.toLowerCase();
  for (const k in KEYWORD_TO_THEME) if (q.includes(k)) return KEYWORD_TO_THEME[k];
  return "default";
}

async function signup(e) {
  e.preventDefault();
  const res = await api("signup", {
    name: signupName.value,
    email: signupEmail.value,
    password: signupPassword.value,
  });
  if (res.success) await loadProfile();
  else alert(res.msg);
}
async function login(e) {
  e.preventDefault();
  const res = await api("login", {
    email: loginEmail.value,
    password: loginPassword.value,
  });
  if (res.success) {
    currentUser = res.user;
    showApp();
  } else alert(res.msg);
}
async function logout() {
  await api("logout");
  currentUser = null;
  hide(profileModal);
  showAuth();
}

async function loadProfile() {
  const res = await api("getProfile");
  if (res.success) {
    currentUser = res.user;
    showApp();
  } else {
    showAuth();
  }
}

saveProfileBtn.addEventListener("click", async () => {
  const avatarFile = profilePicInput.files?.[0];
  let avatarData = "";
  if (avatarFile) {
    const reader = new FileReader();
    reader.onload = async () => {
      avatarData = reader.result;
      await api("saveProfile", {
        name: profileName.value,
        avatar: avatarData,
      });
      await loadProfile();
      hide(profileModal);
    };
    reader.readAsDataURL(avatarFile);
  } else {
    await api("saveProfile", { name: profileName.value });
    await loadProfile();
    hide(profileModal);
  }
});
profileBtn.addEventListener("click", () => {
  if (!currentUser) return;
  profileName.value = currentUser.name;
  profileEmail.value = currentUser.email;
  show(profileModal);
});
logoutBtn.addEventListener("click", () => logout());

/* --- Items --- */
async function loadItems() {
  const res = await api("getItems");
  if (res.success) items = res.items;
  render();
}
async function saveItem(e) {
  e.preventDefault();
  const item = {
    id: editingId || "",
    title: titleInput.value,
    status: statusInput.value,
    genre: genreInput.value,
    notes: notesInput.value,
    platform: platformInput.value,
  };
  const res = await api("saveItem", { item });
  if (res.success) {
    closeModal();
    await loadItems();
  } else alert(res.msg);
}
async function deleteItem(id) {
  if (!confirm("Delete this item?")) return;
  await api("deleteItem", { id });
  await loadItems();
}

function openModal(id = null) {
  editingId = id;
  if (id) {
    const it = items.find((i) => i.id === id);
    if (!it) return;
    modalTitle.textContent = "Edit Title";
    titleInput.value = it.title;
    statusInput.value = it.status;
    genreInput.value = it.genre;
    platformInput.value = it.platform;
    notesInput.value = it.notes;
  } else {
    modalTitle.textContent = "Add Title";
    titleInput.value = "";
    statusInput.value = "Plan to Watch";
    genreInput.value = "";
    platformInput.value = "";
    notesInput.value = "";
  }
  show(modal);
}
function closeModal() {
  hide(modal);
  editingId = null;
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
    <div class="link-section">${
      item.platform
        ? `<button>Watch Now</button>`
        : "<p>No streaming link added.</p>"
    }</div>
    <div class="actions">
      <button class="edit">Edit</button>
      <button class="delete">Delete</button>
    </div>
  `;

  card.querySelector(".edit").onclick = () => openModal(item.id);
  card.querySelector(".delete").onclick = () => deleteItem(item.id);
  if (item.platform) {
    card.querySelector(".link-section button").onclick = () =>
      window.open(item.platform, "_blank");
  }
  return card;
}

function render() {
  const q = (searchInput.value || "").toLowerCase();
  const theme = themeFromQuery(q);
  applyTheme(theme);

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

function showApp() {
  hide(authView);
  show(appView);
  profilePicSmall.src = currentUser?.avatar || "";
  loadItems();
}
function showAuth() {
  show(authView);
  hide(appView);
}

showSignup.onclick = () => { hide(loginForm); show(signupForm); };
showLogin.onclick = () => { show(loginForm); hide(signupForm); };

signupForm.addEventListener("submit", signup);
loginForm.addEventListener("submit", login);
saveBtn.addEventListener("click", saveItem);
cancelBtn.addEventListener("click", closeModal);
addFloatingBtn.addEventListener("click", () => openModal());
searchInput.addEventListener("input", render);
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
    hide(profileModal);
  }
});

(async function boot() {
  await loadProfile();
  applyTheme("default");
})();
