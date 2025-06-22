class Elements {
	constructor() {
        this.puzzle = document.querySelector('.puzzle')
		this.cellsAmount = 20
		this.puzzleDivs = []
		this.draggableDivs = [] 
		this.cells = document.querySelector('.cells')
		this.modal = document.querySelector('.modal');
        this.modalText = document.querySelector('.modal-text'); 
        this.modalBtn = document.querySelector('.modal-btn');
        this.attempt = document.querySelector('.attempt');
		this.finalImg = document.querySelector('.final-img');
        this.inputFile = document.getElementById('input-file'); 
        this.createElements()
     }

     createElements() {
		for (let index = 0; index < this.cellsAmount; index++) {
			const puzzleDiv = document.createElement('div')
			puzzleDiv.setAttribute('data-index', index)
			this.puzzle.append(puzzleDiv)
			this.puzzleDivs.push(puzzleDiv) 

            const draggableDivs = document.createElement('div')
			draggableDivs.setAttribute('data-index', index)
			draggableDivs.setAttribute('draggable', true)
			this.draggableDivs.push(draggableDivs) 
         } 
      } 
    }


export default Elements
