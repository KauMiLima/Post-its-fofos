const notesGrid = document.getElementById("notes-grid");
const addBtn = document.getElementById("add-btn");
const modal = document.getElementById("modal");
const titleInput = document.getElementById("title-input");
const noteInput = document.getElementById("note-input");

// Carrega as notas do localStorage ou inicia um array vazio
let notes = JSON.parse(localStorage.getItem("my_cute_notes")) || [];
let editId = null;
renderNotes();

// Abre o modal para uma nova nota
addBtn.onclick = () => {
  editId = null;
  titleInput.value = "";
  noteInput.value = "";
  modal.style.display = "flex";
};

// Fecha o modal
function closeModal() {
  modal.style.display = "none";
}

// Salva ou Atualiza a nota
function saveNote() {
  const title = titleInput.value.trim();
  const text = noteInput.value.trim();

  if (!title && !text) return; // Não salva se estiver tudo vazio

  if (editId !== null) {
    notes = notes.map((n) =>
      n.id === editId ? { ...n, title: title, content: text } : n,
    );
  } else {
    const newNote = {
      id: Date.now(),
      title: title,
      content: text,
      date: new Date().toLocaleDateString("pt-BR"),
    };
    notes.push(newNote);
  }

  updateStorage();
  renderNotes();
  closeModal();
}

// Remove a nota com a animação de "arrancar"
function deleteNote(id, event) {
  event.stopPropagation();
  const element = document.getElementById(`note-${id}`);
  element.classList.add("ripped-off"); // Aciona a animação do CSS

  setTimeout(() => {
    notes = notes.filter((n) => n.id !== id);
    updateStorage();
    renderNotes();
  }, 550);
}

// Carrega os dados da nota no modal para editar
function editNote(id) {
  const note = notes.find((n) => n.id === id);
  editId = id;
  titleInput.value = note.title;
  noteInput.value = note.content;
  modal.style.display = "flex";
}

// Atualiza o LocalStorage
function updateStorage() {
  localStorage.setItem("my_cute_notes", JSON.stringify(notes));
}

// Renderiza todos os Post-its na tela
function renderNotes() {
  notesGrid.innerHTML = "";
  notes.forEach((note) => {
    const div = document.createElement("div");
    div.className = "post-it";
    div.id = `note-${note.id}`;
    div.onclick = () => editNote(note.id);

    // Converte o Markdown do conteúdo para HTML
    const htmlContent = marked.parse(note.content);

    div.innerHTML = `
            <div class="delete-zone" onclick="deleteNote(${note.id}, event)">✖</div>
            <h4 class="post-it-title">${note.title || "Sem título"}</h4>
            <div class="content">${htmlContent}</div>
            <div class="date">${note.date}</div>
        `;
    notesGrid.appendChild(div);
  });
}

// Fechar modal ao clicar fora dele
window.onclick = (event) => {
  if (event.target == modal) closeModal();
};
