import Elements from './elements.js'

class PositionElements {
	constructor() {
		this.elements = new Elements() 
		this.leftPositions = [0, 8, 16, 24, 32]
		this.topPositions = [0, 6, 12, 18]
		this.addDraggableDivs()
		
    } 

	shuffle(array) {
		return array.sort(() => Math.random() - 0.5)
   }

   shufflePositions() {
	return this.shuffle(this.leftPositions)
		.map((leftPosition) => {
			return this.shuffle(this.topPositions).map 
			((topPosition) => [leftPosition, topPosition])
			})
			.reduce((positions, item) => [...positions, ...item])
		}
		
		bgPositions() {
			return this.topPositions     
			.map((topPosition) => {
			return this.leftPositions.map((leftPosition) =>
			[topPosition, leftPosition])
		   })
			.reduce((positions, items) => [...positions, ...items]) 
		}

			addDraggableDivs() {
				const { cells, draggableDivs } = this.elements
				const bgPositions = this.bgPositions()
				const shufflePositions = this.shufflePositions()
				
				draggableDivs.forEach((div, i) => {
    div.style.backgroundImage = 'url(images/images.jpg)';
    cells.append(div);
    div.style.backgroundPosition = `-${bgPositions[i][1]}vw -${bgPositions[i][0]}vw`;
    div.style.left = `${shufflePositions[i][0]}vw`;
    div.style.top = `${shufflePositions[i][1]}vw`;
	})
   }
}

export default PositionElements
		