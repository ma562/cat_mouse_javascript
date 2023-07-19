const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const VELOCITY = 3;

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
		c.fillStyle = 'green'
		c.fillRect(this.position.x, this.position.y, this.width, this.height)
	}
}

class Player {
	constructor({ position, velocity }) {
		this.position = position
		this.velocity = velocity
		this.image = new Image();
    	this.image.src = 'mouse3.png';
    	this.radius = 18.5; // Adjust the radius of the player image
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

}

class Cat {
	constructor({ position, velocity }) {
		this.position = position
		this.velocity = velocity
		// this.radius = 15
		this.image = new Image();
    	this.image.src = 'cat3.png';
    	this.radius = 18; // Adjust the radius of the player image
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

const map = [['-', '-', '-', '-', '-', '-','-', '-', '-', '-', '-', '-', '-', '-', '-'],
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
			 ['-', ' ', '-', ' ', ' ', '-','-', ' ', '-', ' ', ' ', '-', '-', ' ', '-'],
			 ['-', ' ', ' ', ' ', ' ', ' ',' ', ' ', '-', ' ', ' ', ' ', ' ', ' ', '-'],
			 ['-', '-', '-', '-', '-', '-','-', '-', '-', '-', '-', '-', '-', '-', '-']
			]


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
	// console.log(wall_mat)
	//This function codes in the path lengths of the map
	const num_columns = map[0].length - 2
  const num_rows = map.length - 2
  const array = new Array(num_columns * num_rows); // create matrix of tiles
  // console.log(map[0].length)
  // console.log(map.length)
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
  let min = 32767; // SHORT MAX is 32767
  let key_return = null; // The next node with the shortest distance to explore

  if (node.north !== null) {
    const north_node = node.north;

    if (node.s_d + north_node.value < north_node.s_d) {
      north_node.s_d = node.s_d + north_node.value;
      north_node.prev_row = node.coordinate_x;
      north_node.prev_col = node.coordinate_y;

    }

    if (north_node.s_d < min && !north_node.visited) {
      min = north_node.s_d;
      key_return = north_node;
    }
  }

  if (node.west !== null) {
    const west_node = node.west;

    if (node.s_d + west_node.value < west_node.s_d) {
      west_node.s_d = node.s_d + west_node.value;
      west_node.prev_row = node.coordinate_x;
      west_node.prev_col = node.coordinate_y;
    }

    if (west_node.s_d < min && !west_node.visited) {
      min = west_node.s_d;
      key_return = west_node;
    }
  }

  if (node.east !== null) {
    const east_node = node.east;

    if (node.s_d + east_node.value < east_node.s_d) {
      east_node.s_d = node.s_d + east_node.value;
      east_node.prev_row = node.coordinate_x;
      east_node.prev_col = node.coordinate_y;
    }

    if (east_node.s_d < min && !east_node.visited) {
      min = east_node.s_d;
      key_return = east_node;
    }
  }

  if (node.south !== null) {
    const south_node = node.south;

    if (node.s_d + south_node.value < south_node.s_d) {
      south_node.s_d = node.s_d + south_node.value;
      south_node.prev_row = node.coordinate_x;
      south_node.prev_col = node.coordinate_y;
    }

    if (south_node.s_d < min && !south_node.visited) {
      min = south_node.s_d;
      key_return = south_node;
    }
  }

  node.visited = 1; // 1 instead of true
  return key_return;
}

function relax_all(parent_node) {
  for (let i = 0; i < 4; i++) {
    const return_node = relax_node(parent_node);
    if (return_node !== null) {
      relax_all(return_node);
    }
  }
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
    // console.log(path_row[ctr])
    // console.log(path_col[ctr])
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

  relax_all(parent_node);

  grab_path(matrix, cat_r, cat_c, mouse_r, mouse_c, row_path, col_path);

}



//DIJKSTRA' ALGORITHM






// Calculate offsets to center the map
const offsetX = Math.floor((canvas.width - mapWidth) / 2);
const offsetY = Math.floor((canvas.height - mapHeight) / 2);
const startingX = offsetX + Boundary.width + Boundary.width / 2;
const startingY = offsetY + Boundary.width + Boundary.width / 2


console.log("my values");
console.log(startingX);
console.log(startingY);
console.log("............");

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

const player = new Player({
	position: {
		// x: offsetX + Boundary.width + Boundary.width / 2,
		// y: offsetY + Boundary.width + Boundary.width / 2
		x: startingX + (Boundary.width * (map[0].length - 3)),
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
						// x: Boundary.width * j,
						// y: Boundary.height * i
						 x: offsetX + Boundary.width * j,
              		     y: offsetY + Boundary.height * i
					}
				})
			)
			// console.log(offsetX + Boundary.width * j)
			// console.log(Boundary.width)
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
let path_iteration = 0;
let inner_path_iteration = 0;
let x_direction = 0;
let y_direction = 0;
let rows = []
let col = []

function get_discrete_X(position_x) {
	return parseInt((position_x - startingX + 1) / (Boundary.width));		// + 1 is to fix a rounding error
}

function get_discrete_Y(position_y) {
	return parseInt((position_y - startingY + 1) / (Boundary.height));	// + 1 is to fix a rounding error
}

function get_continuous_X(position_x) {
	return position_x * Boundary.width + startingY;
}

function get_continuous_Y(position_y) {
	return position_y * Boundary.height + startingX;
}

function animate() {

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
					y: -VELOCITY
				}
			},
			rectangle: boundary
			})
		) {
			player.velocity.y = 0
			break
		} else {
			player.velocity.x = 0
			player.velocity.y = -VELOCITY
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
					x: -VELOCITY,
					y: 0
				}
			},
			rectangle: boundary
			})
		) {
			player.velocity.x = 0
			break
		} else {
			player.velocity.x = -VELOCITY
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
					y: VELOCITY
				}
			},
			rectangle: boundary
			})
		) {
			player.velocity.y = 0
			break
		} else {
			player.velocity.x = 0
			player.velocity.y = VELOCITY
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
					x: VELOCITY,
					y: 0
				}
			},
			rectangle: boundary
			})
		) {
			player.velocity.x = 0
			break
		} else {
			player.velocity.x = VELOCITY
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
			console.log('we are colliding')
			player.velocity.x = 0
			player.velocity.y = 0
		}

	})
	player.update()
	cat.draw();
	if((rows.length !== 0) && (col.length !== 0) && (rows[path_iteration] !== -1) && (col[path_iteration] !== -1)) {
		// if(rows[path_iteration] === -1 || col[path_iteration] === -1) {
		// 	break;
		// 
		//speed of cat should be either 2, 4, 5 (multiple of 40 which is the width of a square)
		
		// console.log(rows)
		// console.log(col)
		// cat.draw()
		// console.log(cat.position.x)
		// console.log(col[path_iteration])
		// console.log(cat.position);
		
		cat_speed = 5;

		//check that we have not met our goal yet
		//NOTE THAT THE LESS THAN DOES NOT INDICATE ANYTHING BECAUSE WE ARE GOING BOTH UP AND DOWN
		//cat.position.x is for columns
		//cat.position.y is for rows
		let direction_row = get_continuous_X(rows[path_iteration]) - cat.position.y;
		let direction_col = get_continuous_Y(col[path_iteration]) - cat.position.x;

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

		let new_row = cat.position.y + direction_row * cat_speed;
		let new_col = cat.position.x + direction_col * cat_speed;
		console.log("moving lazy cat");
		if (
    (new_row < get_continuous_X(rows[path_iteration]) && direction_row > 0) ||
    (new_row > get_continuous_X(rows[path_iteration]) && direction_row < 0) ||
    (new_col < get_continuous_Y(col[path_iteration]) && direction_col > 0) ||
    (new_col > get_continuous_Y(col[path_iteration]) && direction_col < 0)
		) {

			let go_to_row = get_continuous_X(rows[path_iteration]);
			let go_to_col = get_continuous_Y(col[path_iteration]);
			let row_vector = go_to_row - cat.position.y;
			let col_vector = go_to_col - cat.position.x;

			if(row_vector) {
				if(row_vector > 0) {
					cat.position.y += cat_speed;
				}
				else {
					cat.position.y -= cat_speed;
				}
			}
			else if(col_vector) {
				if(col_vector > 0) {
					cat.position.x += cat_speed;
				}
				else {
					cat.position.x -= cat_speed;
				}
			}
		}
		else if(
		(new_row >= get_continuous_X(rows[path_iteration]) && direction_row > 0) ||
    (new_row <= get_continuous_X(rows[path_iteration]) && direction_row < 0) ||
    (new_col >= get_continuous_Y(col[path_iteration]) && direction_col > 0) ||
    (new_col <= get_continuous_Y(col[path_iteration]) && direction_col < 0)
		)
		{

			let go_to_row = get_continuous_X(rows[path_iteration]);
			let go_to_col = get_continuous_Y(col[path_iteration]);
			let row_vector = go_to_row - cat.position.y;
			let col_vector = go_to_col - cat.position.x;
			if(row_vector) {
				cat.position.y = go_to_row;
			}
			else if(col_vector) {
				cat.position.x = go_to_col;
			}
			path_iteration++;
		}
		// cat.position.x += ((col[path_iteration] - cat.position.x)) * 3;
		// cat.position.y += ((rows[path_iteration] - cat.position.y)) * 3;
		
	}

	

	if(animate_iteration % 75 === 0) {

		//update CAT
		my_matrix = read_write_values(map)
		// console.log(my_matrix)
		// console.log(get_discrete_Y(cat.position.y))
		// console.log(get_discrete_X(cat.position.x))
		// console.log(cat.position)
		// console.log(player.position)
		// console.log(cat.position);
		// console.log(player.position);
		// console.log(get_discrete_Y(player.position.y))
		// console.log(get_discrete_X(player.position.x))
		// console.log(rows)
		// console.log(col)
		fastestTimes(my_matrix, get_discrete_Y(cat.position.y), get_discrete_X(cat.position.x), get_discrete_Y(player.position.y), get_discrete_X(player.position.x), rows, col)
		path_iteration = 0;
		inner_path_iteration = 0;
		console.log(rows)
		console.log(col)
		// console.log(cat.position);
	}
	if(animate_iteration === 0) {
		cat.update()
	}
	

}

animate()


// console.log(my_matrix)


// console.log(player.position);
// //calculate how many tiles across
// console.log(Boundary.width * (map[0].length - 3))
// console.log(Boundary.height * (map.length - 3))
// console.log(player.position.y)
// console.log(player.position.x)
// let myStart_x = 
// let myStart_y = 
// fastestTimes(my_matrix, 4, 4, myStart_y, myStart_x, rows, )

// console.log(rows)
// console.log(paths)


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









