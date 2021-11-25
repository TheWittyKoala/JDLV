let columns = 200
let rows = 63

let running = false

let timer
let reproductionTime = 100

function createWorld(rows, columns) {

	let grid = new Array(rows)

	for (let i = 0; i < grid.length; i++) {
		grid[i] = new Array(columns)
	}

	return grid
}

let world = createWorld(rows, rows)
let nextGen = createWorld(rows, rows)

function zeros(grid) {
	for (let i = 0; i < rows; i++) {
	    for (let j = 0; j < columns; j++) {
	      grid[i][j] = 0
	    }
	}

	return grid
}

function reset() {
	world = zeros(world)
	nextGen = zeros(nextGen)


	for (let i = 0; i < rows; i++) {
	    for (let j = 0; j < columns; j++) {
	      world[i][j] = 0
	      nextGen[i][j] = 0
	    }
	}

}

function applyNextGen() {
	for (let i = 0; i < rows; i++) {
	    for (let j = 0; j < columns; j++) {
	    	world[i][j] = nextGen[i][j]
	    }
	}

	for (let i = 0; i < rows; i++) {
	    for (let j = 0; j < columns; j++) {
	      nextGen[i][j] = 0
	    }
	}
}

function init() {
	createGrid()
	reset()
	setUpListeners()
}

function createGrid() {
	let worldContainer = document.getElementById("worldContainer")

	 if (!worldContainer) {
	    console.error("Oups... une erreur est survenue :/")
  	}

  	let table = document.createElement("table")

  	for (let i = 0; i < rows; i++) {
  		let tr = document.createElement("tr")

  		for (let j = 0; j < columns; j++) {
  			let cell = document.createElement("td")

  			cell.setAttribute("id", i+"_"+j)
  			cell.setAttribute("class", "dead")

  			cell.onclick = cellClickListener

  			tr.appendChild(cell)
  		}

  		table.appendChild(tr)
  	}

  	worldContainer.appendChild(table)
}

function cellClickListener() {
	let cellLocation = this.id.split("_")

	let row = cellLocation[0]
	let column = cellLocation[1]

	let population = this.getAttribute("class")

	if (population.indexOf("alive") > -1) {
	    this.setAttribute("class", "dead")
	    world[row][column] = 0

	} else {
	    this.setAttribute("class", "alive")
	    world[row][column] = 1

	}
}

function updateView() {
  for (let i = 0; i < rows; i++) {
	

    for (let j = 0; j < columns; j++) {
      let cell = document.getElementById(i + "_" + j)

      if (world[i][j] == 0) {

        cell.setAttribute("class", "dead")
      } else {

        cell.setAttribute("class", "alive")
      }
    }
  }
}

function setUpListeners() {
  let startBtn = document.getElementById("start")
  startBtn.onclick = start

  let resetBtn = document.getElementById("reset")
  resetBtn.onclick = clear

  let randomBtn = document.getElementById("random")
  randomBtn.onclick = randomizer
}

function randomizer() {
	if (running) return;

	clear()

	for (let i = 0; i < rows; i++) {

		for (let j = 0; j < columns; j++) {
		  let isAlive = Math.round(Math.random()- 0.35)

		  if (isAlive == 1) {

		    let cell = document.getElementById(i + "_" + j)
		    cell.setAttribute("class", "alive")

		    world[i][j] = 1
		  }
		}
	}
}

function start() {
	if (!running) {
		this.innerHTML = "Pause"
		running = true
		play()
	} else {
		this.innerHTML = "Lancer"
		running = false
		clearTimeout(timer);
	}
}

function clear() {
  running = false
  clearTimeout(timer);

  let startBtn = document.getElementById("start")
  startBtn.innerHTML = "Lancer";

  let cellsList = document.getElementsByClassName("alive")
  let cells = []

  for (let i = 0; i < cellsList.length; i++) {
    cells.push(cellsList[i])
  }

  for (let i = 0; i < cells.length; i++) {
    cells[i].setAttribute("class", "dead")
  }

  reset()
}

function play() {
	nextGeneration()

	if (running) {
		timer = setTimeout(play, reproductionTime)
	}
}

function nextGeneration() {
	for (let i = 0; i < rows; i++) {

	    for (let j = 0; j < columns; j++) {
	      applyRules(i, j)
	    }
	}

	applyNextGen()
	updateView()
}

function applyRules(row, column) {
	let numNeighbors = countNeighbors(row, column);

	if (world[row][column] == 1) {

	    if (numNeighbors < 2) {
	      nextGen[row][column] = 0;

	    } else if (numNeighbors == 2 || numNeighbors == 3) {
	      nextGen[row][column] = 1;

	    } else if (numNeighbors > 3) {
	      nextGen[row][column] = 0;

	    }
	  } else if (world[row][column] == 0) {

		    if (numNeighbors == 3) {
		      nextGen[row][column] = 1;

		    }
	  }
}

function countNeighbors(row, column) {
	let count = 0

	if ( row == 0 || row == rows-1 || column == 0 || column == columns-1 ) {
        count += 2
    } else {
        if (row - 1 >= 0) {
		    if (world[row - 1][column] == 1) count++;
		}
		  if (row - 1 >= 0 && column - 1 >= 0) {
		    if (world[row - 1][column - 1] == 1) count++;
		}
		  if (row - 1 >= 0 && column + 1 < columns) {
		    if (world[row - 1][column + 1] == 1) count++;
		}
		  if (column - 1 >= 0) {
		    if (world[row][column - 1] == 1) count++;
		}
		  if (column + 1 < columns) {
		    if (world[row][column + 1] == 1) count++;
		}
		  if (row + 1 < rows) {
		    if (world[row + 1][column] == 1) count++;
		}
		  if (row + 1 < rows && column - 1 >= 0) {
		    if (world[row + 1][column - 1] == 1) count++;
		}
		  if (row + 1 < rows && column + 1 < columns) {
		    if (world[row + 1][column + 1] == 1) count++;
		}
      }

	return count;
}

window.onload = init()