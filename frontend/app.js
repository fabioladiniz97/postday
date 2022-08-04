class App{
    constructor(){
        console.log("app works!")
        
        this.notes = []
        this.noteId = 0
        this.$placeholder = document.querySelector('#placeholder');
        this.$form = document.querySelector('#form')
        this.$noteTitle = document.querySelector('#note-title');
        this.$noteText = document.querySelector('#note-text')
        this.$formButtoms = document.querySelector('#form-buttons')
        this.$notes = document.querySelector('#notes')
        this.$modal = document.querySelector('.modal')
        this.$modalTitle = document.querySelector('.modal-title')
        this.$modalText = document.querySelector('.modal-text')
        this.$modalCloseButton = document.querySelector('.modal-close-button')
        this.$colorTooltip = document.querySelector('#color-tooltip')
        this.addEventListeners()
        this.displayNotes()
    }

    addEventListeners(){
        document.body.addEventListener('click', event =>{
            console.log(event.path[0].id)
            this.handleFormClick(event)
            //this.openModel(event)
            this.closeModal(event)
            if(event.path[2].id === 'notes'){
                this.openModel(event)
                this.selectNote(event)
            }

            if(event.target.matches('.color-option')){
                this.changeNoteColor(event)
            }

            if(event.target.matches('.toolbar-delete')){
                this.deleteNote(event)
            }
            
        })

        document.body.addEventListener('mouseover', event => {
            this.openTooltip(event)
        })

        document.body.addEventListener('mouseout', event =>{
            //console.log("MOUSE OUT")
            this.closeTooltip(event)
            
        })

        this.$colorTooltip.addEventListener('mouseover', function() {
            this.style.display = 'flex';  
          })
          
          this.$colorTooltip.addEventListener('mouseout', function() {
             this.style.display = 'none'; 
          })

        this.$form.addEventListener('submit', event => {
            //console.log(event.path[0].id)
            event.preventDefault();
            const title = this.$noteTitle.value;
            const text = this.$noteText.value;
            this.$noteText.value =""
            this.$noteTitle.value=""
            const hasNote = text && title
            if(hasNote){
                this.addNotes({title, text})
            }
            console.log(title.length, text.length)
            this.closeForm()
        })
    }

    handleFormClick(event){
        const isFormClicked = this.$form.contains(event.target)
        const isCloseClicked = event.path[0].id==='form-close-button'
        
        //console.log()
        
        
        if(isFormClicked){
            this.openForm()
        } else{
            this.closeForm( true)
        }
        //console.log(isCloseClicked())
        if(isCloseClicked){
            this.closeForm(false)
        }

        
    }

    openForm(){
        this.$form.classList.add('form-open');
        this.$formButtoms.style.display = 'block'
        this.$noteTitle.style.display = 'block';
    }

    openTooltip(event){
        if(!event.target.matches('.toolbar-color')){
            return
        }
        console.log("TOOLBAR OPEN")
        
        this.noteId = event.target.dataset.id; 
        const noteCoords = event.target.getBoundingClientRect();
        console.log(noteCoords)
        console.log(window.scrollY)
        const horizontal = noteCoords.left + window.scrollX
        const vertical = noteCoords.bottom + window.scrollY -20
        console.log(vertical)
        
        this.$colorTooltip.style.transform = `translate(${horizontal}px, ${vertical-294}px)`;
        this.$colorTooltip.style.display = 'flex';
    }

    closeTooltip(event){
        if(event.target.matches('.toolbar-color')){
            this.$colorTooltip.style.display = 'none';
            
        }
    }

    changeNoteColor(event){
        console.log(event.target.dataset.color)
        const color =event.target.dataset.color
        if(color){
            this.editNoteColor(color)
        }
    }

    closeForm(add){
        const title = this.$noteTitle.value;
        const text = this.$noteText.value;
        this.$noteText.value =""
        this.$noteTitle.value=""
        const hasNote = text || text
        if(hasNote && add){
            this.addNotes({title, text})
        }
        this.$formButtoms.style.display = 'none'
        this.$form.classList.remove('form-open');
        this.$noteTitle.style.display = 'none';
        this.$noteTitle.value=""
        this.$noteText.value=""
    }

    openModel(event){
        //console.log(event.target)
        if(event.target.closest('.note')){
            //console.log("closes clicked")
            this.$modal.classList.toggle('open-modal')

        }
    }

    closeModal(event){
        if(event.path[0].className === 'modal-close-button'){
            console.log(this.$modalTitle.value)
            this.editNotes()
            this.$modalTitle.value = ''
            this.$modalText.value = ''
            this.$modal.classList.toggle('open-modal')
        }
    }

    selectNote(event){
        console.log("select called")
        const $selectedNote = event.target.closest('.note')
        const [$noteTitle, $noteText] = $selectedNote.children
        this.noteId = Number($selectedNote.dataset.id)
        const {title, text} = this.notes[this.noteId -1]
        console.log(title, text)
        this.$modalTitle.value = title
        this.$modalText.value = text
    }

    addNotes(note){
        console.log("Adding notes", note.title, note.text)
        const newNote ={
            title: note.title,
            text: note.text,
            color: 'white',
            id: this.notes.length > 0 ? this.notes[this.notes.length - 1].id + 1 : 1
        }

        this.notes.push(newNote)
        console.log(this.notes)
        this.displayNotes()
    }

    editNotes() {
        
        //console.log("EDIT CALLED")
        
        const $title = this.$modalTitle.value
        const $text = this.$modalText.value
        this.notes = this.notes.map (note => {
            console.log(typeof(this.noteId), typeof(note.id), this.noteId == note.id)
            if (note.id === this.noteId){
                
                return {
                    ...note,
                    title: $title,
                    text: $text
                    
                }
            
            }
            return note
        })

        this.displayNotes()

    }

    deleteNote(event){
        console.log("DELETE CALLED")
        console.log(event.target.closest('.note').dataset.id)
        this.noteId = event.target.closest('.note').dataset.id
        this.notes = this.notes.filter(note => {
            //console.log($noteIdtoDelete)
            return (note.id != this.noteId)
        })
        console.log(this.notes)
        this.displayNotes()
    }

    editNoteColor(color){
        const $color = color
        this.notes = this.notes.map (note => {
            console.log(typeof(this.noteId), typeof(note.id), this.noteId == note.id, $color)
            if (note.id == this.noteId){
                //console.log("IF CALLED")
                return {
                    ...note,
                    color: $color
                    
                }
            
            }
            return note
        })
        //console.log(this.notes)
        this.displayNotes()
    }

    displayNotes(){
        console.log(this.notes)
        const hasNotes = this.notes.length > 0
        this.$placeholder.style.display = hasNotes ? 'none' : 'flex';


        this.$notes.innerHTML = this.notes.map(note => `
        <div style="background: ${note.color};" class="note" data-id="${note.id}">
            <div class="${note.title && 'note-title'}">${note.title}</div>
            <div class="note-text">${note.text}</div>
            <div class="toolbar-container">
            <div class="toolbar">
                
                
                <svg class="toolbar-color" data-id=${note.id} xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                
                <svg class="toolbar-delete" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </div>
            </div>
        </div>
        `).join("");

    }
}

new App