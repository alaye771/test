import PositionElements from './positionElements.js';

class DragDrop {
    constructor() {
        this.positionElements = new PositionElements();
        this.selected = null;
        this.points = { correct: 0, wrong: 0 };
        this.timer = null;
        this.timeLimit = 0;   // ⏳ chrono par pièce
        this.globalTime = 300; // ⏰ chrono global pour tout le puzzle
        this.globalTimer = null;

        this.dragDropEvents();
        this.imageChange();

        // ✅ Lancer le chrono global dès le début
        this.startGlobalTimer();
    }

    // ---------------------------
    // ÉVÉNEMENTS DRAG & DROP
    // ---------------------------
    dragDropEvents() {
        const { draggableDivs, puzzleDivs } = this.positionElements.elements;

        draggableDivs.forEach(draggableDiv => {
            draggableDiv.addEventListener('dragstart', (e) => this.onDragStart(e));
            draggableDiv.addEventListener('dragend', () => this.clearTimer()); 
        });

        puzzleDivs.forEach((puzzleDiv, i) => {
            puzzleDiv.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
            });

            puzzleDiv.addEventListener('drop', () => {
                puzzleDiv.classList.remove("active");
                this.onDrop(i);
                this.clearTimer(); 
            });

            puzzleDiv.addEventListener('dragenter', () => puzzleDiv.classList.add("active"));
            puzzleDiv.addEventListener('dragleave', () => puzzleDiv.classList.remove("active"));
        });
    }

    // ---------------------------
    // CHRONO PAR PIÈCE
    // ---------------------------
    onDragStart(e) {
        this.selected = e.target;
        this.addProgressBar(this.selected);
        this.startTimer();
    }

    addProgressBar(piece) {
        const oldBar = piece.querySelector(".progress-bar");
        if (oldBar) oldBar.remove();

        const bar = document.createElement("div");
        bar.classList.add("progress-bar");
        piece.appendChild(bar);
    }

    startTimer() {
        let timeLeft = this.timeLimit;
        const bar = this.selected.querySelector(".progress-bar");

        this.clearTimer();

        this.timer = setInterval(() => {
            timeLeft--;

            if (bar) {
                const percent = (timeLeft / this.timeLimit) * 100;
                bar.style.width = percent + "%";
            }

            if (timeLeft <= 0) {
                clearInterval(this.timer);
                this.resetPiece(this.selected);
                this.selected = null;
            }
        }, 1000);
    }

    clearTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;

            if (this.selected) {
                const bar = this.selected.querySelector(".progress-bar");
                if (bar) bar.remove();
            }
        }
    }

    resetPiece(piece) {
        const { draggableZone } = this.positionElements.elements;
        piece.style.top = "0";
        piece.style.left = "0";
        piece.style.border = "1px solid red";
        draggableZone.append(piece);

        const bar = piece.querySelector(".progress-bar");
        if (bar) bar.remove();
    }

    // ---------------------------
    // CHRONO GLOBAL
    // ---------------------------
    startGlobalTimer() {
        const { modal, modalText, modalBtn } = this.positionElements.elements;

        let timeLeft = this.globalTime;

        const chronoDisplay = document.createElement("div");
        chronoDisplay.classList.add("global-chrono");
        chronoDisplay.textContent = `⏰ Temps restant : ${timeLeft}s`;
        document.body.appendChild(chronoDisplay);

        this.globalTimer = setInterval(() => {
            timeLeft--;
            chronoDisplay.textContent = `⏰ Temps restant : ${timeLeft}s`;

            if (timeLeft <= 0) {
                clearInterval(this.globalTimer);

                // ❌ Défaite : temps écoulé
                this.showModal(
                    modal,
                    modalText,
                    modalBtn,
                    `<h2 class="defeat-title">⏰ Temps écoulé !</h2>
                     <p>Vous n’avez pas terminé le puzzle à temps.</p>
                     <p>✅ Pièces correctes : <strong>${this.points.correct}</strong></p>
                     <p>❌ Erreurs : <strong>${this.points.wrong}</strong></p>
                     <p>👉 Cliquez sur "Rejouer" pour recommencer.</p>`,
                    "defeat"
                );
            }
        }, 1000);
    }

    // ---------------------------
    // DROP & ÉTAT DU JEU
    // ---------------------------
    onDrop(index) {
        const { puzzleDivs } = this.positionElements.elements;

        if (puzzleDivs[index].children.length === 0) {
            this.selected.style.top = '0';
            this.selected.style.left = '0';
            this.selected.style.border = 'none';
            puzzleDivs[index].append(this.selected);

            if (Number(this.selected.dataset.index) === index) {
                this.points.correct++;
                this.selected.classList.add("correct-piece");
            } else {
                this.points.wrong++;
                this.selected.classList.add("wrong-piece");
            }

            this.checkGameState();
        }
    }

    checkGameState() {
        const { puzzleDivs, modal, modalText, modalBtn, cellsAmount } = this.positionElements.elements;

        if (this.points.correct === cellsAmount) {
            clearInterval(this.globalTimer); // stop chrono global
            this.showModal(
                modal,
                modalText,
                modalBtn,
                `<h2 class="victory-title">🎉 VICTOIRE ! 🎉</h2>
                 <p>Bravo, vous avez terminé le puzzle.</p>
                 <p>✅ Pièces correctes : <strong>${this.points.correct}</strong></p>
                 <p>❌ Erreurs : <strong>${this.points.wrong}</strong></p>`,
                "victory"
            );
            return;
        }

        if (!puzzleDivs.some(div => !div.firstElementChild) && this.points.correct < cellsAmount) {
            clearInterval(this.globalTimer); // stop chrono global
            this.showModal(
                modal,
                modalText,
                modalBtn,
                `<h2 class="defeat-title">😢 DÉFAITE 😢</h2>
                 <p>Le puzzle est terminé, mais certaines pièces ne sont pas à leur place.</p>
                 <p>✅ Pièces correctes : <strong>${this.points.correct}</strong></p>
                 <p>❌ Erreurs : <strong>${this.points.wrong}</strong></p>
                 <p>👉 Cliquez sur "Rejouer" pour recommencer.</p>`,
                "defeat"
            );
        }
    }

    showModal(modal, textElement, modalBtn, message, state) {
        modal.style.opacity = "1";
        modal.style.visibility = "visible";

        if (textElement) {
            textElement.innerHTML = message;
            textElement.classList.add("modal-animate");
        }

        modalBtn.textContent = "🔄 Rejouer";
        modalBtn.className = state === "victory" ? "modal-btn victory-btn" : "modal-btn defeat-btn";
        modalBtn.onclick = () => location.reload();
    }

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
