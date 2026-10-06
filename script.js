const form = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");
const searchInput = document.querySelector("#search-input");
const clearAllButton = document.querySelector("#clear-all");
const storageKey = "quicknotes-notes";

let notes = JSON.parse(localStorage.getItem(storageKey) || "[]");

function saveNotes() {
  localStorage.setItem(storageKey, JSON.stringify(notes));
}

function render() {
  notesList.textContent = "";

  if (notes.length === 0) noteCount.textContent = "You have no notes yet.";
  else if (notes.length === 1) noteCount.textContent = "You have 1 note.";
  else noteCount.textContent = `You have ${notes.length} notes.`;

  const words = searchInput.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const visibleNotes = notes.filter(note =>
    words.every(word => note.text.toLowerCase().includes(word))
  );

  if (words.length > 0 && visibleNotes.length === 0) {
    const message = document.createElement("li");
    message.className = "empty-message";
    message.textContent = "No notes match your search.";
    notesList.append(message);
    return;
  }

  visibleNotes.forEach(note => {
    const card = document.createElement("li");
    card.className = `note-card category-${note.category}`;

    const category = document.createElement("span");
    category.className = "note-category";
    category.textContent = note.category;

    const text = document.createElement("p");
    text.className = "note-text";
    text.textContent = note.text;

    const date = document.createElement("small");
    date.className = "note-date";
    date.textContent = note.createdAt;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
      notes = notes.filter(item => item.id !== note.id);
      saveNotes();
      render();
    });

    card.append(category, text, date, deleteButton);
    notesList.append(card);
  });
}

form.addEventListener("submit", event => {
  event.preventDefault();

  const text = noteInput.value.trim();
  if (text === "") {
    errorMessage.textContent = "Please type a note first.";
    return;
  }
  if (text.length > 200) {
    errorMessage.textContent = "Notes must be 200 characters or fewer.";
    return;
  }

  errorMessage.textContent = "";
  const note = {
    id: Date.now(),
    text,
    category: noteCategory.value,
    createdAt: new Date().toLocaleString(),
  };

  notes.push(note);
  saveNotes();
  render();
  noteInput.value = "";
});

searchInput.addEventListener("input", render);

clearAllButton.addEventListener("click", () => {
  if (!confirm("Delete all notes?")) return;
  notes = [];
  saveNotes();
  render();
});

render();
