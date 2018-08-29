var numDiceSelectElem = document.getElementById("selectDice");
var diceMat = document.getElementById("diceMat");
var currentRoll = []; //can be used for functions to get averages/roll history possible challenge

function getNumDice() {
  return numDiceSelectElem.options[numDiceSelectElem.selectedIndex].value;
}

function toggleDieYellow(dieID) {
  var die = document.getElementById(dieID);
  if(die.style.backgroundColor !== "yellow"){//if unselected
    die.style.backgroundColor = "yellow";
  }else{                                    //if already selected
    die.style.backgroundColor = "inherit";
  }
}

function dieRoll(){
  return Math.floor(Math.random() * 6) + 1;
}

function rollAll() {
  diceMat.innerHTML = ("");
  var num = getNumDice();
  var rolledNumbers = [];
  for (var i = 0; i < num; i++) { 
    var image = document.createElement("img");
    var roll = dieRoll();
    rolledNumbers.push(roll);
    image.src = ("tile" + roll + ".png");
    image.id = "dieNumber" + i;
    image.onclick = function() { toggleDieYellow(this.id); };
    diceMat.appendChild(image);
  }
  currentRoll = rolledNumbers;
}

function reRollSelectedOnly(){
  var dice = document.getElementById('diceMat').children;
  for (var i = 0; i < dice.length; i++){
    if(dice[i].style.backgroundColor !== "yellow"){//if unselected, reroll
      var roll = dieRoll();
      currentRoll[i] = roll
      dice[i].src = ("tile" + roll + ".png");
    }
  }
}

function toggleLiars(){
  var text = document.getElementById("liarsText");
  if(text.style.display === "block"){
    text.style.display = "none";
  }
  else{
    text.style.display = "block";
  }
}

function toggleYahtzee(){
  var text = document.getElementById("yahtzeeText");
  if(text.style.display === "block"){
    text.style.display = "none";
  }
  else{
    text.style.display = "block";
  }
}
