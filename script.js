const form = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");

let notes = [];

function render() {
  notesList.textContent = "";

  if (notes.length === 0) noteCount.textContent = "You have no notes yet.";
  else if (notes.length === 1) noteCount.textContent = "You have 1 note.";
  else noteCount.textContent = `You have ${notes.length} notes.`;

  notes.forEach(note => {
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
  render();
  noteInput.value = "";
});

render();
