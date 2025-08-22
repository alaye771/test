import PositionElements from './positionElements.js';

class DragDrop {
    constructor() {
        this.positionElements = new PositionElements();
        this.selected = null;
        this.points = { correct: 0, wrong: 0 };

        this.dragDropEvents();
        this.imageChange();
    }

    // --------------------------- 🌟 ÉVÉNEMENTS DRAG & DROP
    dragDropEvents() {
        const { draggableDivs, puzzleDivs } = this.positionElements.elements;

        draggableDivs.forEach(draggableDiv => {
            draggableDiv.addEventListener('dragstart', (e) => this.onDragStart(e));
        });

        puzzleDivs.forEach((puzzleDiv, i) => {
            puzzleDiv.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
            });

            puzzleDiv.addEventListener('drop', () => {
                puzzleDiv.classList.remove("active");
                puzzleDiv.textContent = ""; // efface emoji
                puzzleDiv.classList.remove("emoji-correct", "emoji-wrong");
                this.onDrop(i);
            });

            puzzleDiv.addEventListener('dragenter', () => {
                puzzleDiv.classList.add("active");
                this.showEmojiFeedback(puzzleDiv, i);
            });

            puzzleDiv.addEventListener('dragleave', () => {
                puzzleDiv.classList.remove("active");
                puzzleDiv.textContent = ""; // efface emoji
                puzzleDiv.classList.remove("emoji-correct", "emoji-wrong");
            });
        });
    }

    onDragStart(e) {
        this.selected = e.target;
    }

    onDrop(index) {
        const { puzzleDivs } = this.positionElements.elements;

        // 🧩 Si la case est vide
        if (puzzleDivs[index].children.length === 0) {
            this.selected.style.top = '0';
            this.selected.style.left = '0';
            this.selected.style.border = 'none';
            puzzleDivs[index].append(this.selected);

            // Vérifie victoire/défaite
            this.checkGameState();
        }
    }

    // --------------------------- ✨ FEEDBACK VISUEL AVEC EMOJI + ANIMATION
    showEmojiFeedback(puzzleDiv, index) {
        if (!this.selected) return;

        const pieceIndex = Number(this.selected.dataset.index);
        const correctIndex = Number(puzzleDiv.dataset.index);

        if (pieceIndex === correctIndex) {
            puzzleDiv.textContent = "✅";
            puzzleDiv.classList.add("emoji-correct");
            puzzleDiv.classList.remove("emoji-wrong");
        } else {
            puzzleDiv.textContent = "❌";
            puzzleDiv.classList.add("emoji-wrong");
            puzzleDiv.classList.remove("emoji-correct");
        }
    }

    // --------------------------- ✅ VÉRIFICATION ÉTAT DU JEU
    checkGameState() {
        const { puzzleDivs, modal, modalText, modalBtn, cellsAmount } = this.positionElements.elements;

        this.points = { correct: 0, wrong: 0 };

        puzzleDivs.forEach(div => {
            const child = div.firstElementChild;
            if (child && Number(div.dataset.index) === Number(child.dataset.index)) {
                this.points.correct++;
            } else {
                this.points.wrong++;
            }
        });

        // 🎉 Victoire
        if (this.points.correct === cellsAmount) {
            this.showModal(
                modal, 
                modalText, 
                modalBtn, 
                `🎉 Bravo, tu as gagné ! ✅ Erreurs : ${this.points.wrong} 😅`
            );
            return;
        }

        // 😢 Défaite
        if (!puzzleDivs.some(div => !div.firstElementChild) && this.points.correct < cellsAmount) {
            this.showModal(
                modal, 
                modalText, 
                modalBtn, 
                "❌ Dommage, tu as perdu 😢\n👉 Réessaie encore !"
            );
        }
    }

    // --------------------------- 🪄 AFFICHAGE DU MODAL
    showModal(modal, textElement, modalBtn, message) {
        modal.style.opacity = "1";
        modal.style.visibility = "visible";

        if (textElement) textElement.textContent = message;
        modalBtn.textContent = "🔄 Rejouer";
        modalBtn.onclick = () => location.reload();
    }

    // --------------------------- 🖼️ CHANGEMENT D'IMAGE
    imageChange() {
        const { finalImg, inputFile, draggableDivs } = this.positionElements.elements;

        inputFile.addEventListener("change", () => {
            const url = URL.createObjectURL(inputFile.files[0]);

            finalImg.style.backgroundImage = `url(${url})`;
            draggableDivs.forEach(div => {
                div.style.backgroundImage = `url(${url})`;
            });

            this.points = { correct: 0, wrong: 0 };
        });
    }
}

export default DragDrop;
