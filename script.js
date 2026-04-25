const notesGrid = document.getElementById("notes-grid");
const addBtn = document.getElementById("add-btn");
const modal = document.getElementById("modal");
const titleInput = document.getElementById("title-input");
const noteInput = document.getElementById("note-input");


marked.setOptions({
  breaks: true,
  gfm: true,
});

let notes = JSON.parse(localStorage.getItem("my_cute_notes")) || [];
let editId = null;

function renderNotes() {
  notesGrid.innerHTML = "";
  notes.forEach((note) => {
    const div = document.createElement("div");
    div.className = "post-it";
    div.id = `note-${note.id}`;
    div.onclick = () => editNote(note.id);

    const htmlContent = marked.parse(note.content || "");

    div.innerHTML = `
            <div class="delete-zone" onclick="deleteNote(${note.id}, event)">✖</div>
            <h4 class="post-it-title">${note.title || "Sem título"}</h4>
            <div class="content">${htmlContent}</div>
            <div class="date">${note.date}</div>
        `;
    notesGrid.appendChild(div);
  });
}

function saveNote() {
  const title = titleInput.value.trim();
  const text = noteInput.value; 
  if (!title && !text.trim()) return;

  if (editId !== null) {
    notes = notes.map((n) =>
      n.id === editId ? { ...n, title: title, content: text } : n,
    );
  } else {
    notes.push({
      id: Date.now(),
      title,
      content: text,
      date: new Date().toLocaleDateString("pt-BR"),
    });
  }

  localStorage.setItem("my_cute_notes", JSON.stringify(notes));
  renderNotes();
  closeModal();
}

function deleteNote(id, e) {
  e.stopPropagation();
  const el = document.getElementById(`note-${id}`);
  el.classList.add("ripped-off");
  setTimeout(() => {
    notes = notes.filter((n) => n.id !== id);
    localStorage.setItem("my_cute_notes", JSON.stringify(notes));
    renderNotes();
  }, 550);
}

function editNote(id) {
  const note = notes.find((n) => n.id === id);
  editId = id;
  titleInput.value = note.title;
  noteInput.value = note.content;
  modal.style.display = "flex";
}

function closeModal() {
  modal.style.display = "none";
}

addBtn.onclick = () => {
  editId = null;
  titleInput.value = "";
  noteInput.value = "";
  modal.style.display = "flex";
};

window.onclick = (e) => {
  if (e.target == modal) closeModal();
};

renderNotes();
