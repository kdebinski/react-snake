class Element{
	constructor(id,type){
		this.id = id;
		this.type = type;
	}
}
class SnakeElement{
	constructor(arr,next=null){
		this.coords = [];
		this.coords[0] = arr[0];
		this.coords[1] = arr[1];
		this.next = next;
	}
}
class Snake{
	constructor(direction){
		this.length = 0;
		this.head = null;
		this.direction = direction;
	}
	add(coords){
		let snakeElement = new SnakeElement(coords, null),
		current;

		if (this.head === null){
			this.head = snakeElement;
		} else {
			current = this.head;
			while(current.next){
				current = current.next;
			}
			current.next = snakeElement;
		}
		this.length++;
	}
	addFirst(coords){
		let temp = new SnakeElement(coords,this.head);
		this.head = temp;
		this.length++;
	}
	
	deleteLast(){
		var current = this.head;
		do{
			current = current.next;
		}while(current.next.next);
		current.next = null;
		this.length--;
	}
}

class GameState {
	constructor(size=20,onLose,onScore){
		this.size = size;
		this.map = [];
		this.snake = null;
		this.walls = [];
		this.apples = [];
		this.state = "notStarted";
		this.onLose = onLose;
		this.onScore = onScore;
		this.score = 0;

		this.init();
		this.draw();
	}
	init(){
		this.map = [];
		this.snake = generateInitialSnake();
		this.walls = generateWalls(this.size);
		this.generateRandomApple();
	}
	draw(){
		this.map = generateInitialMap(this.size);
		this.putWalls();
		this.putApples();
		this.putSnake();
	}
	generateRandomApple(){
		let placed = false, x, y;
		do{
			x = Math.floor((Math.random() * (this.size-1))+ 1);
			y = Math.floor((Math.random() * (this.size-1))+ 1);
			if(this.isEmpty(x,y)){
				placed = true;
			}
		}while(!placed);
		this.apples.push([x,y]);
		
	}
	isEmpty(x,y){
		return (!this.isSnake(x,y) && !this.isWall(x,y) && !this.isApple(x,y)) ? true : false;
	}
	isSnake(x,y){
		var found = false;
		var current = this.snake.head;
		do{
			if(current.coords[0]===x && current.coords[1]===y){
				found  = true;
				break;
			}
			current = current.next;
		}while(current);
		
		return found;
	}
	isApple(x,y){
		var found = false;
		for(let i=0;i<this.apples.length;i++){
			if(x===this.apples[i][0] && y===this.apples[i][1]){
				found = true;
			}
		}
		return found;
	}
	isWall(x,y){
		var found = false;
		for(let i=0;i<this.walls.length;i++){
			if(x===this.walls[i][0] && y===this.walls[i][1]){
				found = true;
			}
		}
		return found;
	}
	putWalls(){
		let x,y;
		for(let i=0;i<this.walls.length;i++){
			x = this.walls[i][1];
			y = this.walls[i][0];
			this.map[x][y].type = "wall";		
		}
	}
	putApples(){
		let x,y;
		for(let i=0;i<this.apples.length;i++){
			x = this.apples[i][1];
			y = this.apples[i][0];
			this.map[x][y].type = "apple";		
		}
	}
	putSnake(){
		let x,y;
		var current = this.snake.head;
		do{
			x = current.coords[1];
			y = current.coords[0];
			this.map[x][y].type = "snake";		
			current = current.next;
		}while(current);
	}
	clearSnake(){
		let x,y;
		var current = this.snake.head;
		do{
			x = current.coords[1];
			y = current.coords[0];
			this.map[x][y].type = "floor";		
			current = current.next;
		}while(current);
	}
	clearApple(coords){
		let index = -1;
		for(let i=0;i<this.apples.length;i++){
			if(this.apples[i][0]===coords[0] && this.apples[i][1]===coords[1]){
				index = i;
				break;
			}
		}
		if(index !== -1){
			this.apples.splice(index,1);
		}
	}
	keyPressed(code){
		this.setSnakeDirection(code);
	}
	setSnakeDirection(keyCode){
		switch(keyCode){
			case 37:
			if(this.snake.direction !== "e" && this.snake.direction !== "w"){
				this.snake.direction = "w";	
			}
			break;
			case 38:
			if(this.snake.direction !== "n" && this.snake.direction !== "s"){
				this.snake.direction = "n";	
			}
			break;
			case 39:
			if(this.snake.direction !== "e" && this.snake.direction !== "w"){
				this.snake.direction = "e";	
			}
			break;
			case 40:
			if(this.snake.direction !== "n" && this.snake.direction !== "s"){
				this.snake.direction = "s";	
			}
			break;
		}
	}
	moveSnake(){
		var newCoords = getNewCoords(this.snake.head.coords,this.snake.direction); 
		this.snake.addFirst(newCoords);
		this.snake.deleteLast();
	}
	checkMove(){
		var coords = getNewCoords(this.snake.head.coords,this.snake.direction);
		var result = false;
		if(this.isWall(coords[0],coords[1]) || this.isSnake(coords[0],coords[1])){
			this.loseGame();
			result = true;
		}
		if(this.isApple(coords[0],coords[1])){
			this.clearApple(coords);
			this.snake.add(coords);
			this.generateRandomApple();
			this.score++;
			this.onScore();
		}
		return result;
	}
	onTick(){
		if(this.state === "going"){
			var isLost = this.checkMove();
			if(!isLost){
				this.moveSnake();	
			}
		}
		this.draw();		
	}
	loseGame(){
		this.state = "end";
		this.onLose();
	}
}
function getNewCoords(coords,direction){
	let result = [];
	result[0] = coords[0];
	result[1] = coords[1];
	switch(direction){
		case "n":
		result[1] -=1;
		break;
		case "s":
		result[1] +=1;
		break;
		case "w":
		result[0] -=1;
		break;
		case "e":
		result[0] +=1;
		break; 
	}
	return result;
}
function generateInitialMap(size){
	let rows=[],
	row = [],
	id=0;
	for(let i=0;i<size;i++){
		row=[];
		for(let j=0;j<size;j++){
			row.push(new Element(id,"floor"));
			id++;	
		}
		rows.push(row);
	}
	
	return rows;
}
function generateWalls(size){
	let walls=[];
	for(let i=0;i<size;i++){
		walls.push([i,0]);
		walls.push([i,(size-1)]);
		if(i>0 || i<(size-2)){
			walls.push([0,i]);
			walls.push([(size-1),i]);
		}
	}
	return walls;
}
function generateInitialSnake(){
	let snake = new Snake("s");
	snake.add([1,3]);
	snake.add([1,2]);
	snake.add([1,1]);
	return snake;
}
//[[1,1],[1,2],[1,3]]
export {GameState};