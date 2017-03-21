import React, { Component } from 'react';
import './App.css';
import Grid from './components/Grid/Grid';
import {GameState} from './GameState';


const FIELDTYPES ={
  floor: 0,
  wall: 1,
  apple: 2,
  snake: 3
};
const size = 20;

class App extends Component {
  constructor(props){
  	super(props);
    this.onTick = this.onTick.bind(this);
    this.pause = this.pause.bind(this);
    this.newGame = this.newGame.bind(this);
    this.onScore = this.onScore.bind(this);
    this.state = {
      gameState : new GameState(size,this.onLose,this.onScore)
    };
    this.bindArrowKeysAndPreventDefault();
  }
  onTick(){
    this.state.gameState.onTick();
    this.setState(this.state);
  }
  bindArrowKeysAndPreventDefault(){
    var that = this;
    window.addEventListener("keydown", function(e) {
      //arrow keys
      if([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
        that.state.gameState.keyPressed(e.keyCode);
        that.keyPressed();
      }
      //space
      if(32 === e.keyCode) {
        e.preventDefault();
      }
    }, false);
  }
  keyPressed(){
    if(this.state.gameState.state === "notStarted" || this.state.gameState.state === "paused"){
      this.state.gameState.state = "going";
      this.startGame();
    }
  }
  startGame(){
    document.getElementById("txt").innerHTML = "";
    document.getElementById("score").innerHTML = 0;
    this.interval = window.setInterval(()=>{
      this.onTick();
    },150);
  }
  newGame(){
    this.setState({gameState : new GameState(size,this.onLose,this.onScore)});
    window.clearInterval(this.interval);
  }
  pause(){
    if(this.state.gameState.state === "going"){
      window.clearInterval(this.interval);
      this.state.gameState.state = "paused";
      document.getElementById("txt").innerHTML = "PAUZA.</br>Wciśnij strzałke aby zacząć.";
    }
    
  }
  onLose(){
    window.clearInterval(this.interval);
    document.getElementById("txt").innerHTML = "KONIEC GRY";
  }
  onScore(){
    document.getElementById("score").innerHTML = this.state.gameState.score;
  }
  render() {
    return (
    <div className="app">
            <h1>Snake</h1>
            <button type="button" onClick={this.newGame}>Nowa gra</button> 
            <button type="button" onClick={this.pause}>Pauza</button> 
            <p>Wynik: <span id="score">0</span></p> 
            <Grid fieldTypes={FIELDTYPES} map={this.state.gameState.map}/>
            <p id="txt">Wciśnij strzałke aby zacząć.</p>
      </div>)
  }
  
}

export default App;