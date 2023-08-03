const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const VELOCITY = 1;
let gameOver = false;		//checks if the game is over
let myCats = [];      //an array of cats
// let update_iteration = 0;
// let update_every = 500; 
//level 0 - sleep speed, level 1 - walk speed, level 2 jog speed, level 3 run speed
// let my_speeds = [[0.5, 0.75, 1, 1.25, 1.5], [2, 2.25, 2.5], [3, 3.25, 3.5], [4, 4.25, 4.5]]  
let my_speeds = [[0.5], [1.5], [2.5], [3.5]]
let update_every = [[1500, 2500, 3200, 4000], [1000, 2000, 3000, 4000], [1800, 2800, 3800, 4800]];
//first 5 levels consist of 1 cat

const currentScore = parseInt(localStorage.getItem('currentScore'));

// Determine the value of numCats based on the conditions
let numCats;

if (currentScore <= 5) {
    numCats = 1;
} else if (currentScore <= 10) {
    numCats = 2;
} else {
    numCats = 3;
}

// Declare numCats as a global variable
window.numCats = numCats;

const mapCollection = {
  map1: [
    // Map 1 original map
    ['-', '-', ' ', ' ', '-', '-','-', '-', '-', '-', '-', '-', '-', '-', '-'],
			 ['-', ' ', ' ', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-'],
			 ['-', ' ', '-', '-', ' ', ' ','-', ' ', ' ', ' ', ' ', '-', '-', ' ', '-'],
			 ['-', ' ', '-', ' ', ' ', '-','-', ' ', '-', ' ', ' ', ' ', ' ', ' ', '-'],
			 ['-', ' ', '-', ' ', ' ', ' ',' ', ' ', '-', ' ', '-', '-', ' ', ' ', '-'],
			 ['-', ' ', ' ', ' ', ' ', ' ','-', '-', '-', ' ', ' ', ' ', ' ', ' ', '-'],
			 ['-', ' ', ' ', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-'],
			 ['-', ' ', '-', ' ', ' ', '-','-', '-', '-', '-','-', ' ', ' ', ' ', '-'],
			 ['-', ' ', '-', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-'],
			 ['-', ' ', '-', ' ', ' ', ' ',' ', ' ', '-', ' ', ' ', '-', '-', '-', '-'],
			 ['-', ' ', '-', ' ', ' ', '-',' ', ' ', '-', ' ', ' ', ' ', ' ', ' ', '-'],
			 ['-', ' ', '-', ' ', ' ', '-',' ', ' ', '-', ' ', ' ', ' ', ' ', ' ', '-'],
			 ['-', ' ', '-', ' ', ' ', '-','-', ' ', ' ', ' ', ' ', '-', '-', ' ', '-'],
			 ['-', ' ', ' ', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-'],
			 ['-', '-', '-', '-', '-', '-','-', '-', '-', '-', '-', '-', '-', '-', '-']
  ],
  map2: [
  	// Map 2 three straight lines
    ['-', '-', ' ', ' ', '-', '-','-', '-', '-', '-', '-', '-', '-', '-', '-'],
			 ['-', ' ', ' ', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-'],
			 ['-', ' ', '-', '-', '-', '-','-', '-', '-', ' ', ' ', ' ', '-', ' ', '-'],
			 ['-', ' ', '-', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' ', ' ', '-', ' ', '-'],
			 ['-', ' ', '-', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' ', ' ', '-', ' ', '-'],
			 ['-', ' ', '-', ' ', '-', ' ',' ', '-', ' ', ' ', '-', ' ', '-', ' ', '-'],
			 ['-', ' ', '-', ' ', '-', ' ',' ', '-', ' ', ' ', '-', ' ', '-', ' ', '-'],
			 ['-', ' ', '-', ' ', '-', ' ',' ', '-', ' ', ' ','-', ' ', '-', ' ', '-'],
			 ['-', ' ', '-', ' ', '-', ' ',' ', '-', ' ', ' ', '-', ' ', '-', ' ', '-'],
			 ['-', ' ', '-', ' ', '-', ' ',' ', '-', ' ', ' ', '-', ' ', '-', ' ', '-'],
			 ['-', ' ', '-', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' ', ' ', '-', ' ', '-'],
			 ['-', ' ', '-', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' ', ' ', '-', ' ', '-'],
			 ['-', ' ', '-', ' ', ' ', ' ','-', '-', '-', '-', '-', '-', '-', ' ', '-'],
			 ['-', ' ', ' ', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-'],
			 ['-', '-', '-', '-', '-', '-','-', '-', '-', '-', '-', '-', '-', '-', '-']
  ],
  map3: [
  	// Map 3 zig zag 
    ['-', '-', ' ', ' ', '-', '-','-', '-', '-', '-', '-', '-', '-', '-', '-'],
			 ['-', ' ', ' ', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-'],
			 ['-', ' ', '-', '-', '-', '-','-', '-', '-', '-', ' ', ' ', '-', ' ', '-'],
			 ['-', ' ', ' ', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' ', ' ', '-', ' ', '-'],
			 ['-', ' ', ' ', ' ', '-', '-','-', '-', '-', '-', '-', '-', '-', ' ', '-'],
			 ['-', ' ', '-', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' ', ' ', '-', ' ', '-'],
			 ['-', ' ', '-', '-', '-', '-','-', '-', '-', '-', '-', ' ', '-', ' ', '-'],
			 ['-', ' ', '-', ' ', ' ', ' ',' ', ' ', ' ', ' ',' ', ' ', '-', ' ', '-'],
			 ['-', ' ', '-', ' ', '-', '-','-', '-', '-', '-', '-', '-', '-', ' ', '-'],
			 ['-', ' ', '-', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' ', ' ', '-', ' ', '-'],
			 ['-', ' ', '-', '-', '-', '-','-', '-', '-', '-', '-', ' ', ' ', ' ', '-'],
			 ['-', ' ', '-', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-'],
			 ['-', ' ', '-', ' ', ' ', '-','-', '-', '-', '-', '-', '-', '-', ' ', '-'],
			 ['-', ' ', ' ', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-'],
			 ['-', '-', '-', '-', '-', '-','-', '-', '-', '-', '-', '-', '-', '-', '-']
  ],
  map4: [
  	// Map 4 double horizontal zig zag
    ['-', '-', ' ', ' ', '-', '-','-', '-', '-', '-', '-', '-', '-', '-', '-'],
			 ['-', ' ', ' ', ' ', ' ', ' ','-', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-'],
			 ['-', ' ', '-', '-', '-', '-','-', ' ', '-', '-', '-', '-', '-', ' ', '-'],
			 ['-', ' ', '-', ' ', '-', ' ',' ', ' ', '-', ' ', ' ', ' ', '-', ' ', '-'],
			 ['-', ' ', ' ', ' ', '-', ' ','-', ' ', '-', ' ', '-', ' ', ' ', ' ', '-'],
			 ['-', ' ', ' ', ' ', '-', ' ','-', ' ', '-', ' ', '-', ' ', ' ', ' ', '-'],
			 ['-', ' ', '-', ' ', ' ', ' ','-', ' ', ' ', ' ', '-', ' ', '-', ' ', '-'],
			 ['-', ' ', '-', '-', '-', '-','-', '-', '-', '-','-', '-', '-', ' ', '-'],
			 ['-', ' ', '-', ' ', ' ', ' ','-', ' ', ' ', ' ', '-', ' ', '-', ' ', '-'],
			 ['-', ' ', ' ', ' ', '-', ' ','-', ' ', '-', ' ', '-', ' ', ' ', ' ', '-'],
			 ['-', ' ', ' ', ' ', '-', ' ','-', ' ', '-', ' ', '-', ' ', ' ', ' ', '-'],
			 ['-', ' ', '-', ' ', '-', ' ',' ', ' ', '-', ' ', ' ', ' ', '-', ' ', '-'],
			 ['-', ' ', '-', '-', '-', '-','-', ' ', '-', '-', '-', '-', '-', ' ', '-'],
			 ['-', ' ', ' ', ' ', ' ', ' ','-', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-'],
			 ['-', '-', '-', '-', '-', '-','-', '-', '-', '-', '-', '-', '-', '-', '-']
  ],
  map5: [
    // Map 5 modified double vertical zig zag
    ['-', '-', ' ', ' ', '-', '-','-', '-', '-', '-', '-', '-', '-', '-', '-'],
       ['-', ' ', ' ', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-'],
       ['-', ' ', '-', '-', ' ', ' ','-', '-', '-', ' ', ' ', '-', '-', ' ', '-'],
       ['-', ' ', '-', ' ', ' ', ' ',' ', '-', ' ', ' ', ' ', ' ', '-', ' ', '-'],
       ['-', ' ', '-', '-', '-', '-',' ', '-', ' ', '-', '-', '-', '-', ' ', '-'],
       ['-', ' ', '-', ' ', ' ', ' ',' ', '-', ' ', ' ', ' ', ' ', '-', ' ', '-'],
       ['-', ' ', '-', ' ', '-', '-','-', '-', '-', '-', '-', ' ', '-', ' ', '-'],
       ['-', ' ', '-', ' ', ' ', ' ',' ', '-', ' ', ' ',' ', ' ', '-', ' ', '-'],
       ['-', ' ', '-', '-', '-', '-',' ', ' ', ' ', '-', '-', '-', '-', ' ', '-'],
       ['-', ' ', '-', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' ', ' ', '-', ' ', '-'],
       ['-', ' ', ' ', ' ', '-', '-','-', '-', '-', '-', '-', ' ', ' ', ' ', '-'],
       ['-', ' ', ' ', ' ', ' ', ' ',' ', '-', ' ', ' ', ' ', ' ', ' ', ' ', '-'],
       ['-', ' ', '-', '-', '-', '-','-', '-', '-', '-', '-', '-', '-', ' ', '-'],
       ['-', ' ', ' ', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-'],
       ['-', '-', '-', '-', '-', '-','-', '-', '-', '-', '-', '-', '-', '-', '-']
  ],
};

function get_discrete_X(position_x) {
  return parseInt((position_x - startingX + 1) / (Boundary.width));   // + 1 is to fix a rounding error
}

function get_discrete_Y(position_y) {
  return parseInt((position_y - startingY + 1) / (Boundary.height));  // + 1 is to fix a rounding error
}

function get_continuous_X(position_x) {
  return position_x * Boundary.width + startingY;
}

function get_continuous_Y(position_y) {
  return position_y * Boundary.height + startingX;
}

// Function to get a random map key that hasn't been used yet
function getRandomUnusedMapKey() {
  const mapKeys = Object.keys(mapCollection);
  const usedMapKeys = JSON.parse(localStorage.getItem('usedMapKeys')) || [];

  // Filter out the used map keys
  const availableMapKeys = mapKeys.filter(key => !usedMapKeys.includes(key));

  if (availableMapKeys.length === 0) {
    // If all maps have been used once, reset the usedMapKeys to start reusing maps
    localStorage.removeItem('usedMapKeys');
    return getRandomUnusedMapKey();
  }

  const randomIndex = Math.floor(Math.random() * availableMapKeys.length);
  return availableMapKeys[randomIndex];
}

// Function to get the map for the given key and mark it as used
function getMapAndMarkUsed(mapKey) {
  const map = mapCollection[mapKey];
  let usedMapKeys = JSON.parse(localStorage.getItem('usedMapKeys')) || [];
  usedMapKeys.push(mapKey);

  // If all maps have been used once, reset the usedMapKeys to start reusing maps
  if (usedMapKeys.length === Object.keys(mapCollection).length) {
    usedMapKeys = [];
    localStorage.removeItem('usedMapKeys'); // Clear the storage for reuse
  }

  localStorage.setItem('usedMapKeys', JSON.stringify(usedMapKeys));
  return map;
}

let map;
// Usage:
const randomMapKey = getRandomUnusedMapKey();

if (randomMapKey) {
  map = getMapAndMarkUsed(randomMapKey);
} else {
  // Handle the case where all maps have been used once and start reusing maps
  const reusedMapKey = getRandomUnusedMapKey();
  if (reusedMapKey) {
    map = getMapAndMarkUsed(reusedMapKey);
  } else {
    console.log('All maps have been used once. Starting to reuse maps.');
  }
}

class PriorityQueue {
  constructor() {
    this.heap = [];
  }

  // Helper function to get the index of the parent of a node
  getParentIndex(index) {
    return Math.floor((index - 1) / 2);
  }

  // Helper function to get the index of the left child of a node
  getLeftChildIndex(index) {
    return 2 * index + 1;
  }

  // Helper function to get the index of the right child of a node
  getRightChildIndex(index) {
    return 2 * index + 2;
  }

  // Helper function to swap two elements in the heap
  swap(index1, index2) {
    const temp = this.heap[index1];
    this.heap[index1] = this.heap[index2];
    this.heap[index2] = temp;
  }

  clear() {
    this.heap = [];
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  // Helper function to bubble up the element at the given index
  bubbleUp(index) {
    // If the current node is the root (index 0), no need to bubble up further
    if (index === 0) return;

    const parentIndex = this.getParentIndex(index);

    // If the current node has higher priority (smaller s_d) than its parent, swap them and continue bubbling up
    if (this.heap[index].s_d < this.heap[parentIndex].s_d) {
      this.swap(index, parentIndex);
      this.bubbleUp(parentIndex);
    }
  }

  // Helper function to bubble down the element at the given index
  bubbleDown(index) {
    const leftChildIndex = this.getLeftChildIndex(index);
    const rightChildIndex = this.getRightChildIndex(index);
    let highestPriorityIndex = index;

    // Find the node with the highest priority (smallest s_d) among the current node and its two children
    if (
      leftChildIndex < this.heap.length &&
      this.heap[leftChildIndex].s_d < this.heap[highestPriorityIndex].s_d
    ) {
      highestPriorityIndex = leftChildIndex;
    }

    if (
      rightChildIndex < this.heap.length &&
      this.heap[rightChildIndex].s_d < this.heap[highestPriorityIndex].s_d
    ) {
      highestPriorityIndex = rightChildIndex;
    }

    // If the node with the highest priority is not the current node, swap them and continue bubbling down
    if (highestPriorityIndex !== index) {
      this.swap(index, highestPriorityIndex);
      this.bubbleDown(highestPriorityIndex);
    }
  }

  // Insert a new node into the priority queue
  insert(node) {
    this.heap.push(node);
    this.bubbleUp(this.heap.length - 1);
  }

  // Remove and return the node with the highest priority (smallest s_d) from the priority queue
  extractMin() {
    if (this.heap.length === 0) return null;

    // If there is only one node, remove and return it
    if (this.heap.length === 1) return this.heap.pop();

    // Otherwise, remove the node with the highest priority (root), replace it with the last node,
    // and then bubble down the new root to its correct position
    const minNode = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.bubbleDown(0);
    return minNode;
  }
}

const pq = new PriorityQueue();

canvas.width = window.innerWidth
canvas.height = window.innerHeight

class Boundary {
	static width = 40
	static height = 40
	constructor({ position }) {
		this.position = position
		this.width = 40
		this.height = 40
	}

	draw() {
		//c.drawImage(this.image, this.position.x, this.position.y)
		if(get_discrete_X(this.position.x) < 0 || 
			get_discrete_Y(this.position.y) < 0 ||
			get_discrete_X(this.position.x) > map.length - 4 ||
			get_discrete_Y(this.position.y) > map[0].length - 4
			) {
      if((get_discrete_X(this.position.x) === map.length - 5 || get_discrete_X(this.position.x) === map.length - 6) &&
      (get_discrete_Y(this.position.y) > map[0].length - 4)) {
        c.fillStyle = 'transparent';
      }
      else {
        c.fillStyle = 'green'
      }
			
		}
		else {
			c.fillStyle = 'black'
		}
		
		c.fillRect(this.position.x, this.position.y, this.width, this.height)
	}
}

class Player {
	constructor({ position, velocity }) {
		this.position = position
		this.velocity = velocity
		this.image = new Image();
    this.image.src = 'mouse.png';
      //this used to be 18 so used the adjustment factor of 18 - this.radius when calculating fastest times
    this.radius = 13; // Adjust the radius of the player image
    this.my_velocity = VELOCITY;
    this.speed_level = 0;
	}


	draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = 'transparent';
    c.fill();
    c.closePath();

    // const imageRadius = this.radius * Math.sqrt(2);
    const imageRadius = this.radius;
    c.drawImage(
      this.image,
      this.position.x - imageRadius,
      this.position.y - imageRadius,
      imageRadius * 2,
      imageRadius * 2
    );

  }

  mouse_is_scared() {
    this.image.src = 'scared_mouse.png';
  }

  mouse_is_not_scared() {
    this.image.src = 'mouse.png';
  }

	update() {
		this.draw()
		//no going horizontal
		if(this.velocity.x != 0) {
			this.position.x += this.velocity.x 
		}
		else {
			this.position.y += this.velocity.y
		}
	}

  updateMouseImage() {
    if(this.speed_level === 0) {
      this.image.src = "mouse.png";
    }
    else if(this.speed_level === 1) {
      this.image.src = "lightning_mouse.png";
    }
    else if(this.speed_level === 2) {
      this.image.src = "mask_mouse.png";
    }
    else if(this.speed_level === 3) {
      this.image.src = "whisker_mouse.png";
    }
    else {
      this.image.src = "super_mouse.png";
    }
  }

  updateScaredMouse() {
    if(this.speed_level === 0) {
      this.image.src = "scared_mouse.png";
    }
    else if(this.speed_level === 1) {
      this.image.src = "scared_lightning_mouse.png";
    }
    else if(this.speed_level === 2) {
      this.image.src = "scared_mask_mouse.png";
    }
    else if(this.speed_level === 3) {
      this.image.src = "scared_whisker_mouse.png";
    }
    else {
      this.image.src = "scared_super_mouse.png";
    }
  }
}

class Cheese {
  constructor({position}) {
    this.image = new Image();
    this.position = position;
    this.taken = false;
    this.placed = false;
    this.image.src = 'cheese.png';
    this.radius = 18;
  }
  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = 'transparent';
    c.fill();
    c.closePath();

    // const imageRadius = this.radius * Math.sqrt(2);
    const imageRadius = this.radius;
    c.drawImage(
      this.image,
      this.position.x - imageRadius,
      this.position.y - imageRadius,
      imageRadius * 2,
      imageRadius * 2
    );
  }

  update_position(x, y) {
    this.position.x = x;
    this.position.y = y;
  }
}

function findSpotsForCheese(map) {
    const subMap = [];

    for (let row = 1; row < map.length - 1; row++) {
        const subRow = [];
        for (let col = 1; col < map[row].length - 1; col++) {
            subRow.push(map[row][col]);
        }
        subMap.push(subRow);
    }

    const emptyCoordinates = [];

    for (let row = 0; row < subMap.length; row++) {
        for (let col = 0; col < subMap[row].length; col++) {
            if (subMap[row][col] === ' ') {
                emptyCoordinates.push({ row, col });
            }
        }
    }

    if (emptyCoordinates.length === 0) {
        return null; // No empty space available
    }

    const randomIndices = [];
    while (randomIndices.length < 4) {
        const randomIndex = Math.floor(Math.random() * emptyCoordinates.length);
        if (!randomIndices.includes(randomIndex)) {
            randomIndices.push(randomIndex);
        }
    }

    const randomEmptyCoordinates = randomIndices.map(index => emptyCoordinates[index]);

    return randomEmptyCoordinates;
}

class Cat {
	constructor({ position, velocity }) {
		this.position = position
		this.velocity = velocity
		this.image = new Image();
    this.image.src = 'my_cat.png';
    this.radius = 18; // Adjust the radius of the player image
    this.go_flag = false;
    this.speed = 0;
    this.speed_level = -1;
    this.movement_in_progress = false;
    this.update_iteration = 0;
    this.path_iterations = 0;
    this.rows = [];
    this.col = [];
	}


	draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = 'transparent';
    c.fill();
    c.closePath();

    // const imageRadius = this.radius * Math.sqrt(2);
    const imageRadius = this.radius;
    c.drawImage(
      this.image,
      this.position.x - imageRadius,
      this.position.y - imageRadius,
      imageRadius * 2,
      imageRadius * 2
    );

  }

  updateAngryCat() {
    this.image.src = "angry_cat.png";
  }

  updateNormalCat() {
    this.image.src = "my_cat.png";
  }

  updateCatImage() {
    // console.log(this.speed_level);
    if(this.speed_level === 0) {
      this.image.src = "my_cat.png";
      // console.log("birdie");
    }
    else if(this.speed_level === 1) {
      this.image.src = "purdue_cat.png";
      // console.log("purdue cat");
    }
    else if(this.speed_level === 2) {
      this.image.src = "skate_board_cat.png";
    }
    else if(this.speed_level === 3) {
      this.image.src = "rage_cat.png";
    }
  }

  updateRageCat() {
    if(this.speed_level === 0) {
      this.image.src = "angry_cat.png";
      // console.log("birdie");
    }
    else if(this.speed_level === 1) {
      this.image.src = "angry_purdue_cat.png";
      // console.log("purdue cat");
    }
    else if(this.speed_level === 2) {
      this.image.src = "angry_skate_board_cat.png";
    }
    else if(this.speed_level === 3) {
      this.image.src = "angry_rage_cat.png";
    }
  }

  increaseSpeed() {
    if(this.speed_level !== 3) {
      this.speed_level++;
    }
  }

	update() {
		this.draw()
		this.position.x += this.velocity.x 
		this.position.y += this.velocity.y
	}
}

const boundaries = []

const keys = {
	w: {
		pressed: false
	},
	a: {
		pressed: false
	},
	s: {
		pressed: false
	},
	d: {
		pressed: false
	}
}

let lastKey = ''

const mapWidth = map[0].length * Boundary.width;		//number of columns
const mapHeight = map.length * Boundary.height;			//number of rows


//DIJKSTRA'S ALGORITHM
// Define the Node object
class Node {
  constructor() {
    this.value = 0;
    this.coordinate_x = 0;
    this.coordinate_y = 0;
    this.prev_row = 0;
    this.prev_col = 0;
    this.visited = 0; // BOOL TO INT
    this.s_d = 0;
    this.north = null;
    this.south = null;
    this.east = null;
    this.west = null;
    this.next = null; // for writing to fastest times
  }
}

function read_write_values(wall_mat) {
	//This function codes in the path lengths of the map
	const num_columns = map[0].length - 2
  const num_rows = map.length - 2
  const array = new Array(num_columns * num_rows); // create matrix of tiles

  let k = 0;
  // // 0th ROW IS WALL-LESS
  for(let i = 0; i < map.length; i++) {
  	if(i === 0 || i === (map.length - 1)) {
  			//don't account for border walls
  			continue;
  	}

  	for(let j = 0; j < map[0].length; j++) {
  		if(j === 0 || j === (map[0].length - 1)) {
  			//don't account for border walls
  			continue;
  		}
  		if(wall_mat[i][j] === '-') {
  			//we have a wall
  			array[k] = num_columns * num_rows
  		}
  		else {
  			//we have a path
  			array[k] = 1
  		}
  		k++;
  	}
  }
  return array;
}

function relax_node(node) {
  let key_return = null; // The next node with the shortest distance to explore

  if (node.north !== null) {
    const north_node = node.north;

    if (node.s_d + north_node.value < north_node.s_d) {
      north_node.s_d = node.s_d + north_node.value;
      north_node.prev_row = node.coordinate_x;
      north_node.prev_col = node.coordinate_y;

    }
    if(!north_node.visited) {
      pq.insert(north_node);
    }
    
  }

  if (node.west !== null) {
    const west_node = node.west;

    if (node.s_d + west_node.value < west_node.s_d) {
      west_node.s_d = node.s_d + west_node.value;
      west_node.prev_row = node.coordinate_x;
      west_node.prev_col = node.coordinate_y;
    }
    if(!west_node.visited) {
      pq.insert(west_node);
    }
  }

  if (node.east !== null) {
    const east_node = node.east;

    if (node.s_d + east_node.value < east_node.s_d) {
      east_node.s_d = node.s_d + east_node.value;
      east_node.prev_row = node.coordinate_x;
      east_node.prev_col = node.coordinate_y;
    }

    if(!east_node.visited) {
      pq.insert(east_node);
    }
  }

  if (node.south !== null) {
    const south_node = node.south;

    if (node.s_d + south_node.value < south_node.s_d) {
      south_node.s_d = node.s_d + south_node.value;
      south_node.prev_row = node.coordinate_x;
      south_node.prev_col = node.coordinate_y;
    }

    if(!south_node.visited) {
      pq.insert(south_node);
    }
  }

  node.visited = 1; // 1 instead of true
}

function grab_path(matrix, c_r, c_c, m_r, m_c, path_row, path_col) {
  let ctr = 0;
  // console.log(matrix);

  while (c_r !== m_r || c_c !== m_c) {
    let val = matrix[c_r][c_c];
    c_r = val.prev_row;
    c_c = val.prev_col;
    path_row[ctr] = c_r;
    path_col[ctr] = c_c;

    ctr++;
  }
  // Prevent loose ends of the array
  path_row[ctr] = -1;
  path_col[ctr] = -1;
}

function fastestTimes(values, cat_r, cat_c, mouse_r, mouse_c, row_path, col_path) {
	//clear previous values of the paths
	row_path.length = 0;
	col_path.length = 0;		

	const rows = (map.length - 2);
	const columns = (map[0].length - 2);
	const matrix = [];
	let k = 0;

	for (let i = 0; i < rows; i++) {
    matrix[i] = [];
    for (let j = 0; j < columns; j++) {
      const node = {
        value: values[k],
        coordinate_x: i,
        coordinate_y: j,
        prev_row: 0,
        prev_col: 0,
        visited: 0,
        s_d: 32767,
        north: null,
        south: null,
        east: null,
        west: null,
        next: null,
      };
      matrix[i][j] = node;
      k++;
    }
  }

  // Connect neighboring nodes
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      if (i === 0) {
        // First row
        matrix[i][j].north = null;
      } else {
        matrix[i][j].north = matrix[i - 1][j];
      }
      if (j === 0) {
        // First column
        matrix[i][j].west = null;
      } else {
        matrix[i][j].west = matrix[i][j - 1];
      }
      if (i === rows - 1) {
        // Last row
        matrix[i][j].south = null;
      } else {
        matrix[i][j].south = matrix[i + 1][j];
      }
      if (j === columns - 1) {
        // Last column
        matrix[i][j].east = null;
      } else {
        matrix[i][j].east = matrix[i][j + 1];
      }
    }
  }


  const parent_node = matrix[mouse_r][mouse_c];
  parent_node.s_d = parent_node.value;
  pq.clear();
  pq.insert(parent_node);
  while(!pq.isEmpty()) {
    relax_node(pq.extractMin());
  }
  // console.log(matrix);
  grab_path(matrix, cat_r, cat_c, mouse_r, mouse_c, row_path, col_path);

}

// Calculate offsets to center the map
const offsetX = Math.floor((canvas.width - mapWidth) / 2);
const offsetY = Math.floor((canvas.height - mapHeight) / 2);
const startingX = offsetX + Boundary.width + Boundary.width / 2;
const startingY = offsetY + Boundary.width + Boundary.width / 2

function updateScoreboard(shouldIncreaseScore) {

  // Get the current score from localStorage or initialize it if not present
  let currentScore = parseInt(localStorage.getItem('currentScore')) || 0;

  if (shouldIncreaseScore) {
    // Increase the current score if the player is moving on to the next level
    currentScore++;
  }

  // Get the high score from localStorage or initialize it if not present
  let highScore = parseInt(localStorage.getItem('highScore')) || 0;

  // Update the high score if the current score surpasses it
  if (currentScore > highScore) {
    highScore = currentScore;
    // Save the new high score to localStorage
    localStorage.setItem('highScore', highScore);
  }

  // Save the updated current score to localStorage
  localStorage.setItem('currentScore', currentScore);

  // Display the scores on the scoreboard element
  const scoreboardElement = document.getElementById('scoreboard');
  scoreboardElement.textContent = 'Score: ' + currentScore + ' - High Score: ' + highScore;


  // Get the size of the maze (canvas) and the scoreboard element
  const mazeWidth = canvas.width;
  const scoreboardWidth = scoreboardElement.clientWidth;
  const scoreboardHeight = scoreboardElement.clientHeight;

  // Set the padding from the top and right edges of the maze
  const paddingFromTop = 20;
  const paddingFromRight = 1000;

  // Calculate the top and right positions for the scoreboard
  const scoreboardTop = paddingFromTop;
  const scoreboardRight = mazeWidth - paddingFromRight - scoreboardWidth;

  // Position the scoreboard element
  scoreboardElement.style.position = 'fixed';
  scoreboardElement.style.top = startingY - 120 + 'px';
  // scoreboardElement.style.right = scoreboardRight + 'px';
  scoreboardElement.style.left = startingX + 200 + 'px';
}

//creation of the cats
for(let i = 0; i < numCats; i++) {
  const cat = new Cat({
  position: {
    x: startingX,
    y: startingY
  },
  velocity: {
    x: 0,
    y: 0
  }
})

  myCats.push(cat);
}

const player = new Player({
	position: {
		x: startingX + (Boundary.width * (map[0].length - 4)),
		y: startingY + (Boundary.width * (map.length - 3))
	 },
	 velocity: {
	 	x:0,
	 	y:0
	 }
})

map.forEach((row, i) => {
	row.forEach((symbol, j) => {
		switch (symbol) {
			case '-':
			boundaries.push(
				new Boundary({
					position: {
						 x: offsetX + Boundary.width * j,
              		     y: offsetY + Boundary.height * i
					}
				})
			)
			break
		}
	})
})

function circleCollidesWithRectangle({
	circle,
	rectangle
}) {
	return (circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height 
			&& circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x 
			&& circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y
			&& circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width)
}

let animate_iteration = 0;

function calculateDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function checkCollision(playerX, playerY, catX, catY) {
  const collisionDistance = 35; // The collision distance in units

  // Calculate the distance between the player and cat
  const distance = calculateDistance(playerX, playerY, catX, catY);

  // Return true if they are within the collision distance
  return distance <= collisionDistance;
}

function checkCollisionAndRestart() {
  for(let i = 0; i < myCats.length; i++) {
    if (!gameOver && checkCollision(player.position.x, player.position.y, myCats[i].position.x, myCats[i].position.y)) {
      gameOver = true;
      localStorage.setItem('currentScore', 0);
      alert("Game Over");
      window.location.reload();
    }
  }
}

function getRandomSpeed(arr) {
    // Generate a random index within the range of the array's length
    const randomIndex = Math.floor(Math.random() * arr.length);

    // Access and return the element at the random index
    return arr[randomIndex];
  }

  // let the_cheese = []

  // let coords = findSpotsForCheese(map)[0];
  // const cheese = new Cheese({
  //   position: {
  //     x: get_continuous_Y(coords.col),
  //     y: get_continuous_X(coords.row)
  //   }
  // })

  const emptyCoords = findSpotsForCheese(map);
  let cheese = [];
  if (emptyCoords && emptyCoords.length >= 4) {
      cheese = emptyCoords.slice(0, 4).map(coords => {
          return new Cheese({
              position: {
                  x: get_continuous_Y(coords.col),
                  y: get_continuous_X(coords.row)
              }
          });
      });

      // Now you have an array of four cheese objects
  }
  cheese[0].placed = true;


function animate() {

  checkCollisionAndRestart();
  updateScoreboard(false);

  if(player.position.y + 8 < startingY) {
    updateScoreboard(true);
    window.location.reload();
    return;
  }
  
	requestAnimationFrame(animate)
	c.clearRect(0, 0, canvas.width, canvas.height)

	animate_iteration++;

	if (keys.w.pressed && lastKey === 'w') {
		for (let i = 0; i < boundaries.length; i++) {
		const boundary = boundaries[i]
		if (circleCollidesWithRectangle({
			circle: {
				...player, 
				velocity: {
					x: 0,
					y: -player.my_velocity
				}
			},
			rectangle: boundary
			})
		) {
			player.velocity.y = 0
			break
		} else {
			player.velocity.x = 0
			player.velocity.y = -player.my_velocity;
		}
		}
	}
	else if (keys.a.pressed && lastKey === 'a') {
		for (let i = 0; i < boundaries.length; i++) {
		const boundary = boundaries[i]
		if (circleCollidesWithRectangle({
			circle: {
				...player, 
				velocity: {
					x: -player.my_velocity,
					y: 0
				}
			},
			rectangle: boundary
			})
		) {
			player.velocity.x = 0
			break
		} else {
			player.velocity.x = -player.my_velocity;
			player.velocity.y = 0
		}
		}
	}
	else if (keys.s.pressed && lastKey === 's') {
		for (let i = 0; i < boundaries.length; i++) {
		const boundary = boundaries[i]
		if (circleCollidesWithRectangle({
			circle: {
				...player, 
				velocity: {
					x: 0,
					y: player.my_velocity
				}
			},
			rectangle: boundary
			})
		) {
			player.velocity.y = 0
			break
		} else {
			player.velocity.x = 0
			player.velocity.y = player.my_velocity;
		}
		}
	}
	else if (keys.d.pressed && lastKey === 'd') {
		for (let i = 0; i < boundaries.length; i++) {
		const boundary = boundaries[i]
		if (circleCollidesWithRectangle({
			circle: {
				...player, 
				velocity: {
					x: player.my_velocity,
					y: 0
				}
			},
			rectangle: boundary
			})
		) {
			player.velocity.x = 0
			break
		} else {
			player.velocity.x = player.my_velocity;
			player.velocity.y = 0
		}
		}
	}

	boundaries.forEach((boundary) => {
		boundary.draw()
		if (circleCollidesWithRectangle({
			circle: player,
			rectangle: boundary
		})) {
			player.velocity.x = 0
			player.velocity.y = 0
		}

	})
	player.update();
  for(let j = 0; j < cheese.length; j++) {
    if(cheese[j].placed && !cheese[j].taken && checkCollision(player.position.x, player.position.y, cheese[j].position.x, cheese[j].position.y)) {
    player.my_velocity += 1;
    player.speed_level += 1;
    cheese[j].taken = true;
  }

  if(!cheese[j].taken && cheese[j].placed) {
    cheese[j].draw();
  }
  
  }
  
  

  function sameRowCol(arr) {
  if (arr.length <= 1) {
    // If the array has only one element or is empty, return false
    return false;
  }


  const lastValue = arr[arr.length - 1];
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] !== arr[0]) {
      // If any element is different from the first value, return false
      return false;
    }
  }

  // If all elements are the same (except for the last one), return true
  return true;
}

  for(let i = 0; i < myCats.length; i++) {
    if(sameRowCol(myCats[i].rows) || sameRowCol(myCats[i].col)) {
      // player.mouse_is_scared();
      player.updateScaredMouse();
      myCats[i].updateRageCat();
    }
    else {
      // player.mouse_is_not_scared();
      player.updateMouseImage();
      myCats[i].updateCatImage();
    }

    myCats[i].draw();
  }

	


  for(let i = 0; i < myCats.length; i++) {
    if((myCats[i].rows.length !== 0) && (myCats[i].col.length !== 0) && (myCats[i].rows[myCats[i].path_iterations] !== -1) && (myCats[i].col[myCats[i].path_iterations] !== -1)) {
    
    //NOTE EACH CAT NEEDS IT'S OWN FRIGGIN UPDATE ITERATION
    myCats[i].update_iteration++;

    if((myCats[i].update_iteration === 1) || ((myCats[i].update_iteration % update_every[i][myCats[i].speed_level]) === 0)) {
        console.log("updating");
        console.log(myCats);
        console.log(update_every[i][myCats[i].speed_level]);
    if(myCats[i].speed_level !== 3) {
      // let my_coord = findSpotsForCheese(map)[0];
      // cheese.update_position(get_continuous_Y(my_coord.col), get_continuous_X(my_coord.row));
      cheese[myCats[i].speed_level + 1].placed = true;
    }
      

      myCats[i].increaseSpeed();
      myCats[i].speed = getRandomSpeed(my_speeds[myCats[i].speed_level]);
    }

    cat_speed = myCats[i].speed;
    if(sameRowCol(myCats[i].rows) || sameRowCol(myCats[i].col)) {

      cat_speed = cat_speed + 1;
    }
    
    
    let direction_row = get_continuous_X(myCats[i].rows[myCats[i].path_iterations]) - myCats[i].position.y;
    let direction_col = get_continuous_Y(myCats[i].col[myCats[i].path_iterations]) - myCats[i].position.x;

    if (direction_row) {
        direction_row = direction_row > 0 ? 1 : -1;
    } else {
        direction_row = 0;
    }

    if (direction_col) {
        direction_col = direction_col > 0 ? 1 : -1;
    } else {
        direction_col = 0;
    }

    let new_row = myCats[i].position.y + direction_row * cat_speed;
    let new_col = myCats[i].position.x + direction_col * cat_speed;


    if (
    (new_row < get_continuous_X(myCats[i].rows[myCats[i].path_iterations]) && direction_row > 0) ||
    (new_row > get_continuous_X(myCats[i].rows[myCats[i].path_iterations]) && direction_row < 0) ||
    (new_col < get_continuous_Y(myCats[i].col[myCats[i].path_iterations]) && direction_col > 0) ||
    (new_col > get_continuous_Y(myCats[i].col[myCats[i].path_iterations]) && direction_col < 0)
    ) {
      myCats[i].movement_in_progress = true;
      let go_to_row = get_continuous_X(myCats[i].rows[myCats[i].path_iterations]);
      let go_to_col = get_continuous_Y(myCats[i].col[myCats[i].path_iterations]);
      let row_vector = go_to_row - myCats[i].position.y;
      let col_vector = go_to_col - myCats[i].position.x;

      if(row_vector) {
        if(row_vector > 0) {
          myCats[i].position.y += cat_speed;
        }
        else {
          myCats[i].position.y -= cat_speed;
        }
      }
      else if(col_vector) {
        if(col_vector > 0) {
          myCats[i].position.x += cat_speed;
        }
        else {
          myCats[i].position.x -= cat_speed;
        }
      }
    }
    else if(
    (new_row >= get_continuous_X(myCats[i].rows[myCats[i].path_iterations]) && direction_row > 0) ||
    (new_row <= get_continuous_X(myCats[i].rows[myCats[i].path_iterations]) && direction_row < 0) ||
    (new_col >= get_continuous_Y(myCats[i].col[myCats[i].path_iterations]) && direction_col > 0) ||
    (new_col <= get_continuous_Y(myCats[i].col[myCats[i].path_iterations]) && direction_col < 0)
    )
    {
      let go_to_row = get_continuous_X(myCats[i].rows[myCats[i].path_iterations]);
      let go_to_col = get_continuous_Y(myCats[i].col[myCats[i].path_iterations]);
      let row_vector = go_to_row - myCats[i].position.y;
      let col_vector = go_to_col - myCats[i].position.x;
      if(row_vector) {
        myCats[i].position.y = go_to_row;
      }
      else if(col_vector) {
        myCats[i].position.x = go_to_col;
      }
      myCats[i].movement_in_progress = false;
      myCats[i].path_iterations++;
    }
    
  }

    if(animate_iteration % 10 === 0) {
      myCats[i].go_flag = true;
    }

    if(animate_iteration === 1 || (myCats[i].go_flag && !myCats[i].movement_in_progress)) {
    //update CAT

    my_matrix = read_write_values(map)

    fastestTimes(my_matrix, get_discrete_Y(myCats[i].position.y), get_discrete_X(myCats[i].position.x), get_discrete_Y(player.position.y + 5), get_discrete_X(player.position.x + 5), myCats[i].rows, myCats[i].col)
    
    myCats[i].path_iterations = 0;

    myCats[i].go_flags = false;    //reset go_flag so we have to wait until the next iteration to update shortest path
  }
  }

}

animate()


window.addEventListener('keydown', ({key}) => {
	switch (key) {
		case 'w':
			keys.w.pressed = true
			lastKey = 'w'
			break
		case 'a':
			keys.a.pressed = true
			lastKey = 'a'
			break
		case 's':
			keys.s.pressed = true
			lastKey = 's'
			break
		case 'd':
			keys.d.pressed = true
			lastKey = 'd'
			break
	}
})

window.addEventListener('keyup', ({key}) => {
	switch (key) {
		case 'w':
			keys.w.pressed = false
			break
		case 'a':
			keys.a.pressed = false
			break
		case 's':
			keys.s.pressed = false
			break
		case 'd':
			keys.d.pressed = false
			break
	}
})

if ('ondeviceorientation' in window) {
    // Add an event listener for the 'deviceorientation' event
    window.addEventListener('deviceorientation', handleOrientation);
} else {
    alert("Device orientation not supported by this browser.");
}

// Add an event listener for the 'deviceorientation' event
window.addEventListener('deviceorientation', handleOrientation, true);
alert("now testing");
// Function to handle device orientation changes
function handleOrientation(event) {
    alert("has been called");
    // Display specific orientation data using alerts
    alert('Alpha: ' + event.alpha + '\nBeta: ' + event.beta + '\nGamma: ' + event.gamma);
}






