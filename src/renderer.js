let notes = JSON.parse(localStorage.getItem('vyrnethos-notes')) || [];
let activeNoteId = null;

const notesList = document.getElementById('notes-list');
const newNoteBtn = document.getElementById('new-note-btn');
const editorContainer = document.getElementById('editor-container');
const editorPlaceholder = document.getElementById('editor-placeholder');
const noteTitleInput = document.getElementById('note-title');
const noteContentArea = document.getElementById('note-content');
const deleteNoteBtn = document.getElementById('delete-note-btn');
const saveStatus = document.getElementById('save-status');

// Window Controls
document.getElementById('min-btn').addEventListener('click', () => window.electronAPI.minimize());
document.getElementById('max-btn').addEventListener('click', () => window.electronAPI.maximize());
document.getElementById('close-btn').addEventListener('click', () => window.electronAPI.close());

function renderNotesList() {
    notesList.innerHTML = '';
    notes.sort((a, b) => b.updatedAt - a.updatedAt);
    
    notes.forEach(note => {
        const noteItem = document.createElement('div');
        noteItem.className = `note-item ${note.id === activeNoteId ? 'active' : ''}`;
        noteItem.innerHTML = `
            <div class="note-item-title">${note.title || 'Untitled Note'}</div>
            <div class="note-item-preview">${note.content || 'No content...'}</div>
        `;
        noteItem.onclick = () => selectNote(note.id);
        notesList.appendChild(noteItem);
    });
}

function selectNote(id) {
    activeNoteId = id;
    const note = notes.find(n => n.id === id);
    
    editorPlaceholder.classList.add('hidden');
    editorContainer.classList.remove('hidden');
    
    noteTitleInput.value = note.title;
    noteContentArea.value = note.content;
    
    renderNotesList();
}

function createNote() {
    const newNote = {
        id: Date.now().toString(),
        title: '',
        content: '',
        updatedAt: Date.now()
    };
    notes.unshift(newNote);
    saveNotes();
    selectNote(newNote.id);
}

function saveNotes() {
    localStorage.setItem('vyrnethos-notes', JSON.stringify(notes));
    saveStatus.textContent = 'Last saved at ' + new Date().toLocaleTimeString();
}

function updateActiveNote() {
    if (!activeNoteId) return;
    
    const noteIndex = notes.findIndex(n => n.id === activeNoteId);
    notes[noteIndex].title = noteTitleInput.value;
    notes[noteIndex].content = noteContentArea.value;
    notes[noteIndex].updatedAt = Date.now();
    
    saveNotes();
    renderNotesList();
}

function deleteActiveNote() {
    if (!activeNoteId) return;
    
    notes = notes.filter(n => n.id !== activeNoteId);
    activeNoteId = null;
    
    editorContainer.classList.add('hidden');
    editorPlaceholder.classList.remove('hidden');
    
    saveNotes();
    renderNotesList();
}

newNoteBtn.addEventListener('click', createNote);
noteTitleInput.addEventListener('input', updateActiveNote);
noteContentArea.addEventListener('input', updateActiveNote);
deleteNoteBtn.addEventListener('click', deleteActiveNote);

// Initialize
renderNotesList();