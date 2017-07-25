//'use strict';//This enforces stricter syntax, throwing more errors more often at even the tiniest mistakes. Great for testing stuff!

//Start of function dictionary

/*
(function () {
    var old = console.log;
    var logger = document.getElementById('log');
    console.log = function () {
		for (var i = 0; i < arguments.length; i++) {
        if (typeof arguments[i] == 'object') {
            logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(arguments[i], undefined, 2) : arguments[i]) + '<br />';
        } else {
            logger.innerHTML += arguments[i] + '<br />';
        }
      }
    }
})();
*/
function printTest(){
	console.log("This function prints 'Test!' for testing purposes. Test!");
}
function setPixel(x, y, ctx) {
	ctx.fillRect(x - 0.5, y - 0.5, 1, 1 );	
}

function roundToMaxOrMin(value, max, min){
  if(value > max)return max;
  else if(value < min)return min;
  else return value;  
}

//Thanks disfated! :D
String.prototype.capitalize = function(lower) {
    return (lower ? this.toLowerCase() : this).replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

function distanceFrom(firstX, firstY, secondX, secondY){
	var leftOrRight = (firstX<secondX)? 'left' : 'right';
	var upOrDown = (firstY<secondY)? 'up' : 'down';
	var pixelDistanceX = secondX - firstX;
	var pixelDistanceY = secondY - firstY;
	
	return "Your click is " + pixelDistanceX + ' pixels(' + leftOrRight + '), and ' + pixelDistanceY + ' pixels(' + upOrDown + ') from the the top-left corner of the torso image.'
}

function plotLine(xStart, yStart, xEnd, yEnd, color, ctx){ //The start variables are where the lines start, the end variables are where the lines end. ctx is the canvas it's drawn on.
	var dx =  Math.abs(xEnd-xStart); //Delta X? I think it's the left-right distance between where the line starts and where the line is goin'. Is always positive, because lines are only drawn from left to right.
	var sx = xStart<xEnd ? 1 : -1;   //If the line goes left front the start point, the variable is -1, while if the line goes right from the starting point, the variable is poisitve one.
	var dy = -Math.abs(yEnd-yStart); //Delta Y? I think it's the up-down distance between where the line starts and where the line is goin'. Is always negative, because lines are only drawn from top to bottom.
	var sy = yStart<yEnd ? 1 : -1;   //If the starting point is below the ending point, this value is -1. If the starting point is above the ending point, the value is 1.
	
	var err = dx+dy;                 //How far it has to go on the x, and the y combined.
	var e2;                          //Right now we are just going to say that this this variable exists, and not give it a value. That I completely understand, it's the value in the loop that confuses me.
	
	ctx.fillStyle = color;
	
	while (true){                                  //This will loop!
																								 
		setPixel(xStart,yStart, ctx);                //And draw pixels!
		
		if (xStart == xEnd && yStart == yEnd) break; //Until we've reached the end of the line.
		
		
		
		e2 = 2*err;                                  //This assigns a variable, e2, to double the sum of the distance to go on both axis. This variable is assigned inside the loop, instead of outside because it needs to change too, if err is changed.
		
		if (e2 >= dy) {                              //If double the sum of the distance to go on both axis is more than or equal to the distance to go on the y axis...
			err += dy;                                 //Add the distance that we have to go on the y axis to double the sum of the distance to go on both axis. Why?
			xStart += sx;                              //Increase xStart by 1 if xEnd is to the right of xStart, or by -1 if it's to the left. TL;DR: make it closer by one pixel.
		}
		
		if (e2 <= dx) {                              //If double the sum of the distance to go on both axis is less than or equal to the distance to go on the x axis...                         
			err += dx;                                 //Add the distance that we have to go on the x axis to double the sum of the distance to go on both axis. Why?
			yStart += sy;                              //Increase xStart by 1 if xEnd is to the right of xStart, or by -1 if it's to the left. TL;DR: make it closer by one pixel.
		}
   
	}
}
//The comments display what I do understand. What I don't understand is the err and e2 situation, specifically why err is doubled, and what e2 and err represent(mathmatically?). 
//I'm also completly baffled as to why the if statements compare e2 to delta y and x, but I partially understand why they reassign e2 to err*2 each time in the loop, because they increase err and want e2 to represent err*2 even when err changes.
//I think Delta X & DeltaY (dx and dy) are the distance between the start and finish, but I'm not completely sure about that.
//Why they increase x if dy is more than e2 and vice versa is a bit confusing, on top of everything else.
//I understand that that the code works, because it does, I'm just not entirely sure how/why it does.
//If I don't understand something mathmatically(or in any other area), I can just research it until I do, but I'm not sure what I'm missing here.

//startCoords and endCoords are an array of x then y.
function getCoordsOnWayTo(startCoords, endCoords){
  //setup of constants:

  var xStart = startCoords[0];
  var yStart = startCoords[1];
  var xEnd = endCoords[0];
  var yEnd = endCoords[1];

  var dx =  Math.abs(xEnd-xStart);
  var sx = xStart<xEnd ? 1 : -1;
  var dy = -Math.abs(yEnd-yStart);
  var sy = yStart<yEnd ? 1 : -1;

  var err = dx+dy;
  var e2;

  //Done with setup of constants

  if(!(Math.floor(xStart) == xEnd && Math.floor(yStart) == yEnd)){
    e2 = 2*err;

    if (e2 >= dy){
      err += dy;
      xStart += sx;
    }

    if (e2 <= dx){
      err += dx;
      yStart += sy;
    }

    return [Math.floor(xStart), Math.floor(yStart)];
  }
  
  else return 'Coords Same';
}

function plotArmPart(firstX, firstY, secondX, secondY, innerColor, outerColor, ctx){
	for(var i = -1; i < 2; i++)plotLine(firstX+i*2, firstY+i, secondX+i*2, secondY+i, (i === 0)?outerColor:innerColor, ctx);
}
function logTypeOf(randomValue){console.log(typeof window.randomValue);}

function chooseFrom(anArray){ //This function chooses something from an array.
	return anArray[Math.floor(Math.random() * anArray.length)];
}
//This function grabs the mouse position!
function getMousePos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}
//Function to check whether a point is inside a rectangle!
function isInside(pos, rect){
    return pos.x > rect.x && pos.x < rect.x+rect.width && pos.y < rect.y+rect.height && pos.y > rect.y;
}

function setpixelated(context){
    context['imageSmoothingEnabled'] = false;       /* standard */
    context['mozImageSmoothingEnabled'] = false;    /* Firefox */
    context['oImageSmoothingEnabled'] = false;      /* Opera */
    context['webkitImageSmoothingEnabled'] = false; /* Safari */
    context['msImageSmoothingEnabled'] = false;     /* IE */
}

function drawRotatedFromCenter(degrees, image, context, axisX, axisY, positionX, positionY){
  context.clearRect(0,0,600,600);

  // save the unrotated context of the canvas so we can restore it later
  // the alternative is to untranslate & unrotate after drawing
  context.save();

  // move to the center of the canvas
  context.translate(axisX, axisY);

  // rotate the canvas to the specified degrees
  context.rotate(degrees*Math.PI/180);

  // draw the image
  // since the context is rotated, the image will be rotated also
  context.drawImage(image,-image.width/2 + positionX,-image.height/2 + positionY);

  // we’re done with the rotating so restore the unrotated context
  context.restore();
}

function fillArrayUpTo(anArray, upTo, filler){//The purpose of this function is to create an array full of empty arrays up to the specified number. This function is used in the map system.
  while(anArray.length !== upTo)anArray.push(filler);
}

function stringToRGBArray(stringOfRGB){
  return stringOfRGB.replace(/[^\d,]/g, '').split(',');
}

//Pretend an array is a circle: If you call for the element of the array that is one beyond the end of the array, you get the the first element, and vice versa.
function circularArray(array, direction, currentIndex){
  currentIndex = currentIndex + direction;
  if(currentIndex < 0)currentIndex = array.length - 1;
  else if(currentIndex > array.length-1)currentIndex = 0;
  
  return currentIndex;
}

//End of function dictionary


//Image dictionary

var woodenPlank = new Image();
woodenPlank.src = 'imgs/FillerPixelArt/WoodenPlank.gif';

var stoneTile = new Image();
stoneTile.src = 'imgs/FillerPixelArt/StoneTile.gif';


//Plank Images
var plankOddsAndEnds = new Image();
plankOddsAndEnds.src = 'imgs/FillerPixelArt/PlankOddsAndEnds.gif';

var plankStart = new Image();
plankStart.src = 'imgs/FillerPixelArt/PlankStart.gif';

var plankEnd = new Image();
plankEnd.src = 'imgs/FillerPixelArt/PlankEnd.gif';

var plankMiddle = new Image();
plankMiddle.src = 'imgs/FillerPixelArt/PlankMiddle.gif';
//End of Plank Images

/*
//Jacob's Bow images
var bowTop = new Image();
bowTop.src = 'http://piskel-imgstore-b.appspot.com/img/3d2e8480-fec1-11e6-86b8-6d27f02baa93.gif';

var bowBottom = new Image();
bowBottom.src = 'http://piskel-imgstore-b.appspot.com/img/e0a7aa21-fec0-11e6-80e8-6d27f02baa93.gif';

var bowMiddle = new Image();
bowMiddle.src = 'http://piskel-imgstore-b.appspot.com/img/77c948ae-fec0-11e6-8c5e-6d27f02baa93.gif';
//End of Jacob's Bow images
*/

//End of image dictionary

/*
http://piskel-imgstore-b.appspot.com/img/a443234c-01cd-11e7-8b3b-c714d3e93f2a.gif
http://piskel-imgstore-b.appspot.com/img/256a5059-01ce-11e7-8da3-c714d3e93f2a.gif


http://piskel-imgstore-b.appspot.com/img/2d30ac66-01d0-11e7-9eed-c714d3e93f2a.gif


http://piskel-imgstore-b.appspot.com/img/7be9b16b-01ce-11e7-a65e-c714d3e93f2a.gif
http://piskel-imgstore-b.appspot.com/img/85bd4557-01d0-11e7-acaa-c714d3e93f2a.gif



*/











//START OF GAME ENGINE CODE(Walking, attacking, inventory, stuff like that.) ----------------------------------------------

//Variables for game engine
var characterModel;

var screenheight;
var screenwidth;

//End of variables for game engine.

//Assisting functions for game engine! :D

function raceFromGroup(group){
  var val = Math.floor(Math.random() * 100) + 1;//This code generates a random number, 1-100 inclusive.
  var subRace = "";//This assigns the subRace variable to an empty string, so we can use it later.
  var raisedBy;
  
  group = group.capitalize(true);
  
  switch(group){
    case 'Inclus':
      return 'Inclus';

    case 'Kewer'://Agrakin is open to immigrants, and so the Humans and Impkin came.
      if (val < 90) {subRace = 'Kewer'}
      else if (val < 95) {subRace = 'Human'}
      else {subRace = 'Impkin'}
      
      if(subRace = 'Impkin')return [subRace, raisedBy];
      else return subRace;

    case 'Empyrean Guild'://All Empyreans are
      return 'Human';//human, as only humans are dumb enough to want to live on islands that float in the sky.

    case 'Hell Dweller'://However, there are many different races for Hell Dwellers, so their code is quite a bit more complicated.
      //However, when broken into parts, it's actually quite simple.

      //Remember those subrace and var variables we set up later? If not, check back and remember what they are, they are used a lot in the following code

      //THIS CODE PICKS THE RACE
      if(val <= 30) { subRace = "Uhk"; if (val > 29) { subRace = "Hell Hound";} }//This says if val is less than 30, then call the code inbetween the brackets. The code inbetween the brackets says if val is above 29, so then if it was 30, then your Ugh is a Hell Hound
      else if(val <= 50) { subRace = "Fiend"; if (val > 49) { subRace = "Blue Fiend";}}//This code is very similiar to the Uhk code; Only instead of having 30% of the population be Uhks, only 20% of the population is Fiend, so since all of the numbers below 30 have already been filtered out, we'll say all of the numbers below 50(and above 30) are Fiends. One percent of the total population(the number 50) would be Blue Fiendish.
      else if (val <= 65) { subRace = "Hell Gnome";}//15 percent of the population are Hell Gnomes, so 50 + 15 = 65.
      else if(val <= 80) { subRace = "Impkin";}//15 percent Impkin, 65 + 15 = 80
      else if(val <= 95) { subRace = 'Succubi';}//15% are Cubi, so 80 + 15 = 95
      else if (val <= 100) { subRace = "Human";}//5% are human, so 95+ 5 = 100. There we go, we now have code that generates a random hell dweller race.
      //END OF RACE PICKING CODE

      //var answer = subRace;
      if(subRace = 'Impkin')return [subRace, raisedBy];
      else return subRace;

    default:
      return "Error!";
  }
}

function nameFromRace(race, raisedBy){
  var firstPart = [];
  var lastPart  = [];
  var blacklist = [];
  var completeName = '';
  
  race = race.capitalize(true);

  var whichName = Math.floor(Math.random() * 20 + 1);

  switch(race){
    case 'Kewer'://Favors ending words in consonants g and z, uses a and o as most common vowel.
      firstPart = ['Swogg', 'Tragg', 'Raz', 'Ag'];
      lastPart  = ['lah', 'ack', 'ak', 'rakin'];

      return chooseFrom(firstPart) + chooseFrom(lastPart);

    case 'Human'://These should sound like english names, within reason. etaoin shrdlu are most common letters in english.
      firstPart = ["Jak", "Jac", "Jam", "Ger", 'Anth', "Robb", "Gid", "Der", "Sal"];
      lastPart  = ['e', "ard", "ean", 'ony', "ick", "es", "us", "ob"];
      var firstName = chooseFrom(firstPart) + chooseFrom(lastPart);
      var lastName  = chooseFrom(firstPart) + chooseFrom(lastPart);
      completeName = firstName + ' ' + lastName;
      blacklist = ['Sales', 'Sale', 'Robbob'];//These names will be blocked.
      
      //The following line works because indexOf returns 0 if the item isn't in the list.
      if (blacklist.indexOf(firstName) === -1 && blacklist.indexOf(lastName) === -1) {
        return completeName;
      }
      else {
        //console.log('Name blacklisted!');
        return nameFromRace('Human');
      }
      break;


    case 'Inclus'://Soft consonants only
      firstPart =   chooseFrom(["Yil", "Lis", "Yeow", "Shis", "Swill"]);
      middlePart  = chooseFrom(["ill", "ol", "ee", 'o', '', "'"]);//Empty ones so that there could be no middle part
      lastPart =    chooseFrom(["o", 'ye', 'oah', 'oso', '']);//Empty so that there could be no last part

      if (middlePart === "'")lastPart = lastPart.charAt(0).toUpperCase();
      if (middlePart === "'" && lastPart === '')middlePart = '';
      return firstPart + middlePart + lastPart;

    case 'Succubi':
      firstPart = ['Succ', 'Beaut', 'Lust', 'Nub', 'Volup', 'Curv', 'Bux', 'Scand'];
      middlePart = 'ul'
      lastPart  = ['ent', 'ence', 'issa', 'ica', 'tuous'];

      return chooseFrom(firstPart) + middlePart + chooseFrom(lastPart);


    case "Hell Gnome":
      firstPart = ['Oct', 'Jul', 'Sept', 'Null', 'Mor', "Unit", "Bin", 'Tern', "Quad", 'Noven', 'Den', 'Cent', 'Millen'];
      lastPart  = ['avius', 'ulius', 'ius', 'ullus', 'pheus', 'ero', 'ace', 'etus', 'onius'];

      return chooseFrom(firstPart) + chooseFrom(lastPart);

    case 'Fiend': //Guttural noises
      firstPart = ["Teshk", "Ficksh", "Thekt", "Ught", "Deght", "Kicksh", 'Flektsh', 'Flesht', 'Vegth'];
      lastPart  = ["ekt", "igth", "egst", "erkt", "'Jiktheh", 'akth', 'othked', ''];

      return chooseFrom(firstPart) + chooseFrom(lastPart);


    case 'Blue Fiend': //More unconventional Fiend names
      firstPart = ["Zhaan", "Racksh", "Delv", "Ugh", "Neagh"];
      lastPart  = ["ian", "sikt", "blasht", "frahk", "atik", "'Jaktan"];

      return chooseFrom(firstPart) + chooseFrom(lastPart);

    case 'Uhk':

      if (whichName === 1)//Easter egg pet names
      {
        return chooseFrom(["Mr. Mittens", "Pokey", "Crack-Head", "Sparky", "Guido", "Buckwheat", "Rug", "Fluffy", "Spanky", "Napoleon", "Bonaparte", "Rygel"]);
      }

      else
      { //Traditional Uhk names will depend upon eh and similiar vowels, along with soft consonants
        firstPart = ["Meh", 'Yeh', 'Seh', 'Reh', 'Weh', 'Bleh', 'Phle'];
        lastPart  = ["m", 's', 'r', 'weh', 'gm'];//Option to have no last part

        return chooseFrom(firstPart) + chooseFrom(lastPart);
      }
      break;

    case 'Hell Hound':
      return chooseFrom(["Mr. Mittens", "Pokey", "Crack-Head", "Sparky", "Guido", "Buckwheat", "Rugrat", "Fluffy", "Spanky", "Napoleon", "Bonaparte", "Arty"]);

    case 'Impkin':
      return nameFromRace(raisedBy);
      
    default:
      return "Unkown Race";
  }

}

function modifiersForPart(part, race, group, profession, mortalName, gender){
  var secondaryClass;
  
  var pronouns;
  if(gender === 'male')pronouns = ['he', 'his', 'him'];
  else if (gender === 'female')pronouns = ['she', 'her', 'her'];
  else pronouns = ['they', 'their']
  
  switch(part){
    case 'face':
      switch(profession){
        case 'mage':
          var nameArray = ['wise', 'friendly'];
          var name = chooseFrom(nameArray);
          
          switch(name){
            case 'wise':
              var story = "Something in the shape of " + mortalName[0] + "'s brow suggests that " + pronouns[0] + " is knowledgable in many subjects.";
              var bonusToStats = {charismaAcademic:5, wisdom:3}
              break;
              
            case 'friendly':
              var story = "Something in " + mortalName[0] + "'s eyes suggests that " + pronouns[0] + " is someone you can trust.";
              var bonusToStats = {charismaGeneral:3}
              break;
          }
          
          return [name, bonusToStats, story, secondaryClass];
          
          
        case 'rogue':
          var nameArray = ['mischievous', 'charming'];
          var name = chooseFrom(nameArray);
          
          switch(name){
            case 'mischievous':
              var story = "Something in the way that the edges of " + mortalName[0] + "'s mouth crease suggest that " + pronouns[0] + "'s up to no good.";
              var bonusToStats = {charismaCriminal:4, sneaking:2, stealing:2}
              break;
              
            case 'charming':
              var story = "Something in the shape of " + mortalName[0] + "'s cheekbones draws the eye, and suggests that " + pronouns[1] + " words conceal another meaning.";
              var bonusToStats = {charismaGeneral:2, charismaCriminal:3}
              break;
          }
          
          return [name, bonusToStats, story, secondaryClass];
          
        
        case 'warrior':
          var nameArray = ['simple', 'charismatic'];
          var name = chooseFrom(nameArray);
          
          switch(name){
            case 'simple':
              var story = "Something in the way that " + mortalName[0] + "'s wide forhead is shaped suggests that " + pronouns[0] + " possesses unparalleled stupidity.";
              var bonusToStats = {wisdom:-3, strength:5}
              break;
              
            case 'charismatic':
              var story = "Something in the way that " + mortalName[0] + "'s features are put together makes him quite pleasant to be around.";
              var bonusToStats = {charismaGeneral:1, charismaMilitary:3}
              break;
          }
          
          return [name, bonusToStats, story, secondaryClass];
      }
      break;
      
    case 'limbs':
      switch(profession){
          
        case 'mage':
          var nameArray = ['weak', 'weak', 'weak', 'weak', 'disfigured'];
          for(var i = 0; i < 12; i++)nameArray.push('long');
          var name = chooseFrom(nameArray);
          
          switch(name){
              
            case 'long':
              var story = mortalName[0] + '\'s long limbs allow ' + pronouns[2] + ' to pry books off of distant shelves, and they often do so.';
              var bonusToStats = {wisdom:3};
              break;
              
            case 'weak':
              var story = mortalName[0] + "'s weak limbs weren't much good at physical labor or playing outside, so " + mortalName[0] + " read books and practiced channeling magic.";
              var bonusToStats = {wisdom:5, magic:5, strength:-4};
              break;
              
            case 'nimble':
              var story = mortalName[0] + " once used " + pronouns[1] + " nimble appendages to steal a few magical tomes from the forbidden section of the library. Soon afterwards, " + pronouns[0] + " cast " + pronouns[1] + " first spell.";
              var bonusToStats = {magic:5, sneaking:3, stealing:2};
              var secondaryClass = 'rogue'
              break;
          }
          return [name, bonusToStats, story, secondaryClass];
          
        case 'rogue':
          var nameArray = ['nimble', 'disfigured', 'disfigured', 'disfigured', 'disfigured'];
          for(var i = 0; i < 12; i++)nameArray.push('long');
          var name = chooseFrom(nameArray);
          
          switch(name){
            case 'long':
              var story = mortalName[0] + " discovered early on in " + pronouns[1] + " life that " + pronouns[1] + " long limbs are quite useful for reaching into the pockets of the unwary.";
              var bonusToStats = {stealing:3};
              break;
              
            case 'nimble':
              var story = mortalName[0] + " once used " + pronouns[1] + " nimble appendages to steal a few magical tomes from the forbidden section of the library. Soon afterwards, " + pronouns[0] + " cast " + pronouns[1] + " first spell.";
              var bonusToStats = {magic:5, sneaking:3, stealing:2};
              var secondaryClass = 'mage'
              break;
              
            case 'disfigured':
              var story = mortalName[0] + "'s disfigured limbs were often the subject of ridicule by other children."
                +" That is, until " + mortalName[0] + " stole a knife from an unwary shopkeeper, and proceeded to break into the home of the tortorous childrens' leader. Once there, " + pronouns[0] + " waited until their tormenter fell asleep, and proceeded to sever one of his toes."
                +" The next day, when the bully began to tease " + mortalName[0] + " yet again, " + pronouns[0] + " returned the toe to it's open-mouthed owner, who never again spoke to " + mortalName[0] + ".";
              var bonusToStats = {sneaking:5, stealing:2};
              break;
          }
          return [name, bonusToStats, story, secondaryClass];
          
        case 'warrior':
          var nameArray = ['strong', 'long', 'quick'];
          var name = chooseFrom(nameArray);
          
          switch(name){
            case 'long':
              var story = mortalName[0] + " often uses the extra reach provided to " + pronouns[2] + " by " + pronouns[1] + " long limbs in battle, and doing so allows " + pronouns[2] + " to better attack unprotected areas.";
              var bonusToStats = {criticalChance:3, fighting:5};
              break;

            case 'strong':
              var story = "Years spent toiling away at physically intensive tasks have strengthened " + mortalName[0] + "'s limbs. " + pronouns[0].capitalize() + " often uses these strong limbs to bash in the heads of those " + pronouns[0] + " isn't quite fond of.";
              var bonusToStats = {strength:4};
              break;
              
            case 'quick':
              var story = mortalName[0] + " spent most of " + pronouns[1] + " childhood running errands for local merchants. These merchants often payed " + mortalName[0] + " extra if " + pronouns[0] + " could do a job quickly. This practice has made " + mortalName[0] + "'s limbs quick and nimble.";
              var bonusToStats = {dexterity:4, speed:4};
              break;
          }
          return [name, bonusToStats, story, secondaryClass];
      }
      break;
    
    case 'torso':
      switch(profession){
        case 'mage':
          var nameArray = ['maimed'];
          for(var i = 0; i < 12; i++)nameArray.push('pale');
          var name = chooseFrom(nameArray);
          
          switch(name){
            case 'maimed':
              var story = "One murky night, " + mortalName[0] + " was traveling alone in the wilderness. " + pronouns[0].capitalize() + " bore a torch in one hand, and held a channeling tome of travel in the other. " + pronouns[0].capitalize() + " heard something stir in a nearby patch of foilage, and, in a fright, " + pronouns[0] + " channeled " + pronouns[1] + " magic into the tome. Fortunately, the tome brought " + pronouns[2] + " home, but channeling all of " + pronouns[1] + " at once had scarred " + pronouns[1] + " torso with deep red welts.";
              var bonusToStats = {generalCharisma:-2, wisdom:3};
              break;
            
            case 'pale':
              var story = "A life spent inside reading books has left " + mortalName[0] + " with remarkably pale skin.";
              var bonusToStats = {wisdom:5};
              break;
          }
          return [name, bonusToStats, story, secondaryClass];
          
        case 'rogue':
          var nameArray = ['scarred', 'tattoed'];
          var name = chooseFrom(nameArray);
          
          switch(name){
            case 'scarred':
              var story = mortalName[0] + " was once in the process of robbing the local baker's cellar, when the baker stumbled across " + pronouns[2] + ". " + mortalName[0] + " was flogged almost to the point of death, and to this day " + pronouns[0] + " bears long red scars across his back and torso. The next time someone stumbled across " + mortalName[0] + " as " + pronouns[0] + " was stealing something, " + mortalName[0] + " killed them.";
              var bonusToStats = {charismaCriminal:2, stealing:3, sneaking:3};
              break;
            
            case 'tattoed':
              var story = "Dark, swirling tattoos cover " + mortalName[0] + "'s chest, marking him as a rogue.";
              var bonusToStats = {charismaGeneral:-3, charismaCriminal:6}
              break;
          }
          return [name, bonusToStats, story, secondaryClass];
          
        case 'warrior':
          var nameArray = ['scarred', 'muscled'];
          var name = chooseFrom(nameArray);
          
          switch(name){
            case 'scarred':
              var story = "Plenty of fighting practice has left jagged scars that cover " + mortalName[0] + "'s torso.";
              var bonusToStats = {fighting:7, charismaMilitary:2};
              break;
            
            case 'muscled':
              var story = "Intensive physical labor has left " + mortalName[0] + " with firm muscles all across " + pronouns[1] + " torso.";
              var bonusToStats = {strength:5};
              break;
          }
          return [name, bonusToStats, story, secondaryClass];
      }
      
  }
  
  
}

function effect(type){
  
  switch(type){
    case 'magic orb':
      //fall through
    case 'magic ball':
      //fall through
    case 'magical ball':
      //fall through
    case 'magical orb':
      this.durationCounter = 0;//Incremented each time the orb is drawn, if duration isn't false.
      this.duration = false;//integer representing times to be looped before the orb stops being drawn. False for infinite duration.
      this.shouldAutoUpdate = false;//Dictates whether or not the drawing function should call itself.
      this.updateRate = 30;//Integer, milliseconds. If the orb is self drawn, this dictates how often it should update itself.
      
      this.loopSpacing = false;//How much space inbetween each loop. 0 works, if false the value will be generated algorithmically.
      this.loops = 10;//Dictates how many loops the orb should have. More loops causes more lag, but makes the orb look more whispy around the edges.
      this.alphaTransparency = 0.4;//Integer, dictates translucency
      
      this.frequencyOfColorChange = 0.01;//Decimal representing percentage chance orb has of changing color each time it's drawn.
      this.shouldColorChange = true;//Boolean, if true, activeColor is reassigned to a randomly selected color from the colors array.
      this.shouldColorFade = true;//Fades into the next color instead of directly changing.
      this.isColorFading = false;//Used internally if shouldColorFade is true. If it is true, the color will start fading.
      this.activeColorValues = false;//Used internally if shouldColorFade is true. Stores the values of the active color.
      this.fadeToColorValues = false;//Used internally if shouldColorFade is true. Stores the values of the color selected for fading to.
      this.fadeMax = 300;//Used internally to count level of fade.
      this.colors = ['rgb(255, 0, 0)', 'rgb(0, 255, 0)', 'rgb(0, 0, 255)','rgb(0, 0, 0)', 'rgb(255, 255, 255)'];//Any color values should work(excluding RGBA).
      this.activeColor = 'rgb(255, 255, 255)';//Color the orb is currently being drawn as.
      
      this.alive = true;//Dictates whether or not the orb is drawn. Can be changed externally. Is set to false at the end of duration.
      this.x = $(window).width()/2;//Drawn to this coordinate, will change if shouldGlide is true.
      this.y = $(window).height()/2;//Drawn to this coordinate, will change if shouldGlide is true.
      
      this.speed = 5;//Dictates how many times the movement loop is iterated before a time delay is enacted.
      this.isGliding = false;//Boolean, if true x and y will gradually change to glideX and glide Y.
      this.glideX = false;//Integer(0 inclusive), or false for gliding to any(randomly selected) location. A-Okay to change externally.
      this.glideY = false;//Integer(0 inclusive), or false for gliding to any(randomly selected) location. A-Okay to change externally.
      
      this.size = 20;//Integer, size in pixels. Changes if shouldSizeChange is true.
      this.shouldSizeChange = true;//Boolean, if true then size changes gradually inbetween sizeMax and sizeMin
      this.maxSize = 20;//Maximum size in px, disreguarded if this.shouldSizeChange === false
      this.minSize = 15;//Minimum size in px, disreguarded if this.shouldSizeChange === false
      this.growthRate = 1;//Number to be added to size after growthBuffer fills to growthBufferMax.
      this.growthBufferMax = 10;//Number of times function has to be iterated before growthRate is added to size.
      this.growthBuffer = 0;//Used internally to slow growth.
      this.growing = true;//Boolean, Used internally (if shouldSizeChange is true), if false then the orb is shrinking.
      
      this.degreeOfWobble = 5;//Integer, amount of pixels to drift away from set x value by.
      this.shouldWobble = true;//If this is true, a random number in between degreeOfWobble and -degreeOfWobble offsets where each layer is drawn.
      
      ///Use me externally to make the orb draw itself! :D
      this.startUp = function(){
        if(this.shouldAutoUpdate){
          updateLoop = setInterval(this.draw.bind(this), this.updateRate);
        }
      }
      
      //Use me externally for gliding to a random location! :D
      this.glideRandom = function(){
        this.isGliding = true;
        this.glideX = Math.floor(Math.random()*$(window).width());
        this.glideY = Math.floor(Math.random()*$(window).height());
      }
      
      
      this.draw = function(){
        if(this.alive && this.shouldAutoUpdate)ctx.clearRect(0, 0, $(window).width(), $(window).height());
        
        if(this.shouldColorChange){
          if(Math.floor(Math.random()*100) < this.frequencyOfColorChange*100){
            
            if(this.shouldColorFade && !this.isColorFading){
              this.isColorFading = true;
              this.fadeToColorValues = stringToRGBArray(chooseFrom(this.colors));
              this.activeColorValues = stringToRGBArray(this.activeColor);
            }
            
            else if(!this.shouldColorFade)this.activeColor = chooseFrom(this.colors);
          }
        }
        
        if(this.isColorFading){
          for(var i = 0; i < 3; i++){
            if(this.activeColorValues[i] !== this.fadeToColorValues[i]){
              if(this.fadeToColorValues[i] > this.activeColorValues[i])this.activeColorValues[i] = this.activeColorValues[i]*1 + 1;
              else if(this.fadeToColorValues[i] < this.activeColorValues[i])this.activeColorValues[i] = this.activeColorValues[i]*1 - 1;
            }
          }
          
          this.activeColor = 'rgb(' + this.activeColorValues[0] + ',' + this.activeColorValues[1] + ',' + this.activeColorValues[2] + ')';
          this.fadeToColor = 'rgb(' + this.fadeToColorValues[0] + ',' + this.fadeToColorValues[1] + ',' + this.fadeToColorValues[2] + ')';
          
          if(this.activeColor === this.fadeToColor){
            this.isColorFading = false;
          }
          
        }
        
        if(this.shouldSizeChange){
          this.growthBuffer = this.growthBuffer + 1;
          if(this.growthBuffer >= this.growthBufferMax){
            this.growthBuffer = 0;
            //Logic controlling growth:
            if(this.growing){
              this.size = this.size + this.growthRate;
              if(this.size > this.maxSize)this.growing = false;
            }
            else {
              this.size = this.size - this.growthRate;
              if(this.size < this.minSize)this.growing = true;
            }
          }
        }
        
        if(this.isGliding){
          for(var i = 0; i <= this.speed; i++){
            var newCoords = getCoordsOnWayTo([this.x, this.y], [this.glideX, this.glideY]);
            
            if(newCoords == 'Coords Same'){
              this.isGliding = false;
              break;
            }

            else {
              this.x = newCoords[0];
              this.y = newCoords[1];
            }
          }
        }
        
        ctx.fillStyle = this.activeColor;
        
        for(var i = 0;i < this.loops;i++){
          ctx.globalAlpha = this.alphaTransparency;
          ctx.beginPath();
          ctx.arc(this.x + ((this.shouldWobble) ? Math.floor(Math.random()*(this.degreeOfWobble*2)-this.degreeOfWobble) : 0),this.y + ((this.shouldWobble) ? Math.floor(Math.random()*this.degreeOfWobble) : 0), this.size*2/(i/2+1),0,Math.PI * 2,true);
          ctx.closePath();
          ctx.fill();
        }
      }
      
      this.draw.bind(this)
      
      break;
      
    default:
      console.log('Oh deity, ye must be oh so very confused: such an effect is not within our realm of existence.');
      break;
  }
}


function part(type, img, parent) {//parent should be torso, unless you're using a lower arm or hand! In that case, use upperarm or lowerarm, respectively Also, arm upper is the only one that needs two images, put them in the way we read: left to right :D
	
    //IN THE NEAR FUTURE ALL OF THIS CODE WILL BE REPLACED BY SPRITER ANIMATIONS.
  
	this.image = img[0];
	
	ctx.drawImage(this.image, 0, 0);
	
	this.width = this.image.width;
	this.height = this.image.height;
	
	this.type = type;
	
	if(this.type !== 'torsoFront')this.parent = parent;
	
	if(this.type === 'armUpper' || this.type === 'armLower' || this.type === 'hand')this.imageRi = img[1];
	
	this.getPosition = function() {
		if(this.type === 'torsoFront'){
			this.x = 300 - (((this.image.width/2)%2 === 0) ? this.image.width/2 : Math.round(this.image.width/2));
			this.y = 300 - this.height/2;
		}

		else if(this.type === 'legsFront'){
			this.x = parent.x + (parent.width - this.width)/2;
			this.y = parent.y + parent.height - 3;
		}

		else if(this.type === 'headFront'){
			this.x = parent.x + (parent.width - this.width)/2;
			this.y = parent.y - this.height;
		}

		else if(this.type === 'armUpper'){
			this.leftX = parent.x - this.width;
			this.positionValueLeftX = 0;

			this.leftY = parent.y;

			this.rightX = parent.x + parent.width;
			this.positionValueRightX = 0;

			this.rightY = parent.y;
		}
		
		else if(this.type === 'armLower'){
			this.leftX = parent.leftX;
			this.positionValueLeftX = 0;

			this.leftY = parent.leftY + parent.height;
			this.positionValueLeftY = 0;

			this.rightX = parent.rightX + parent.width - this.width;
			this.positionValueRightX = 0;

			this.rightY = parent.rightY + parent.height;
			this.positionValueRightY = 0;
		}

		else if(this.type === 'hand'){
			this.leftX = parent.leftX;
			this.positionValueLeftX = 0;

			this.leftY = parent.leftY + parent.height;
			this.positionValueLeftY = 0;

			this.rightX = parent.rightX + parent.width - this.width;
			this.positionValueRightX = 0;

			this.rightY = parent.rightY + parent.height;
			this.positionValueRightY = 0;
		}
	}
	
	
	this.getPosition();
	
	
	this.draw = function(drawLeft, drawRight, canvasContext){//Also, remember, drawLeft and drawRight decide whether or not to draw those arms!  :D
		
		if(this.type !== 'armUpper' && this.type !== 'armLower' && this.type !== 'hand')canvasContext.drawImage(this.image, this.x, this.y);
		
		else if(this.type === 'armUpper'){
			if(drawRight)canvasContext.drawImage(this.imageRi, this.rightX + this.positionValueRightX, this.rightY);
			if(drawLeft)canvasContext.drawImage(this.image, this.leftX + this.positionValueLeftX, this.leftY);
		}
		else{
			if(drawLeft)canvasContext.drawImage(this.image, this.leftX + this.positionValueLeftX, this.leftY + this.positionValueLeftY);
			if(drawRight)canvasContext.drawImage(this.imageRi, this.rightX + this.positionValueRightX, this.rightY + this.positionValueRightY);
		}
	}
	
	this.drawRotated = function(fromX, fromY, rotateby, xWhere, yWhere, drawLeft, drawRight, canvasContext){
		if(this.type === 'armUpper' || this.type === 'hand' || this.type === 'armLower'){
			if(drawLeft)drawRotatedFromCenter(rotateby, this.imageRi, canvasContext, fromX, fromY, xWhere, yWhere);
			if(drawRight)drawRotatedFromCenter(rotateby, this.image, canvasContext, fromX, fromY, xWhere, yWhere);
		}
		/*
		 if(element.type === 'armLower'){
			drawRotatedFromCenter(counter, element.image, canvasContext, parent.leftX, parent.leftY, parent.leftX - element.leftX, parent.leftY - element.leftY);
			drawRotatedFromCenter(counter, element.image, canvasContext, parent.rightX, parent.rightY, parent.rightX - element.rightX, parent.rightY - element.rightY);
		}

		else if(element.type === 'hand'){
			drawRotatedFromCenter(counter, element.image, canvasContext, parent.parent.leftX, parent.parent.leftY, parent.parent.leftX - element.leftX, parent.parent.leftY - element.leftY);
			drawRotatedFromCenter(counter, element.image, canvasContext, parent.parent.rightX, parent.parent.rightY, parent.parent.leftX - element.leftX, parent.parent.leftY - element.leftY);
		}
		*/
		
		else drawRotatedFromCenter(rotateby, this.image, canvasContext, fromX, fromY, parent.X, parent.Y);
	}
}






function character(parts){
	this.animationType = 'none';
	
	
	this.drawAll = function(canvasContext){
		
      parts.forEach(function(element){
		element.draw(true, true, canvasContext);
      });
		
	}
	
}

function tile(image, x, y){
	
	ctx.drawImage(image, 0, 0);
	
	this.image = image;
	
	this.image.height = 25;
	this.image.width = 25;
	
	this.draw = function(canvasContext, x, y){
		canvasContext.drawImage(this.image, x, y);
	}
}

function gameMap(tileImage1, tileImage2, size){
	this.tileImage1 = tileImage1;
	this.tileImage2 = tileImage2;
	
	this.arrayForMap = [];
	
	this.addRow = function(x){
		var fillUpTo = this.arrayForMap[0].length;
		
		this.arrayForMap.splice(x>-1?x:0, 0, []);
		
		for(var i = 0; i < fillUpTo; i++){
			this.arrayForMap[x>-1?x:0].push(new tile(this.tileImage1));
		}
	}
	
	
	this.addColumn = function(y){
		for(i = 0; i < this.arrayForMap.length;i++){
			this.arrayForMap[i].splice(y>-1?y:0, 0, new tile(this.tileImage1, i*25, y*25));
		}
	}
	
	this.addIsland = function(x, y, size){
		var storedTile = this.arrayForMap[x][y];
		
		this.arrayForMap[x][y] = new tile(this.tileImage2, storedTile.x, storedTile.y);
		
		this.addThis = function(counter, changeXOrY, addToCounter, makeX){
			
			if(changeXOrY){
				if(typeof this.arrayForMap[x-counter] === 'undefined')this.addRow(x-counter);
				
				this.arrayForMap[x-counter > 0 ? x-counter : 0][y] = new tile(this.tileImage2);
				this.addThis(1, false, 1, x-counter);
				this.addThis(-1, false, -1, x-counter);
			}
			
			else{
				if(typeof this.arrayForMap[((makeX ? makeX : x) > 0 ? (makeX ? makeX : x) : 0)][y-counter] === 'undefined')this.addColumn(y-counter);
				
				this.arrayForMap[((makeX ? makeX : x) > 0 ? (makeX ? makeX : x) : 0)][y-counter] = new tile(this.tileImage2);
			}
			
			if(Math.round(Math.random()*Math.abs(counter)) < 1*size)this.addThis(counter+addToCounter, changeXOrY, addToCounter, makeX);
		}
		
		this.addThis(1, true, 1, false);
		this.addThis(1, false, 1, false);
		this.addThis(-1, true, -1, false);
		this.addThis(-1, false, -1, false)
		
	}
	
	this.makeTiles = function(){
		for(var rows = 0; rows < size; rows++){
			this.arrayForMap.push([]);
			for(var columns = 0; columns < size; columns++){
				var newTile = new tile(this.tileImage1, rows*20, columns*23);//var newTile = new tile((Math.round(Math.random()*100) !== 1) ? this.tileImage1 : this.tileImage2, rows*25, columns*25);
				this.arrayForMap[rows].push(newTile);
			}
		}
	}
	
	this.makeTiles();
	
	this.drawTiles = function(canvasContext){
		this.arrayForMap.forEach(function(element, index){
			var xIndex = index;
			element.forEach(function(element, index){
				element.draw(canvasContext, (xIndex-index)*32, ((index+xIndex)/2)*32);
			});
		});
	}
}

//End of assisting functions section! :D


//MAIN FUNCTION FOR STARTING UP GAME ENGINE! :D
function startGame(){
	//$('#gameCanvas').replaceWith('<canvas id="gameCanvas" width="600" height="600">This human\'s web browser is incapable of using the graphical deity interface I have created...</canvas>');
    var cnv = document.getElementById('gameCanvas');
	var ctx = cnv.getContext('2d');
	setpixelated(ctx);
	//ctx.translate(25, 25);
	
	gameLoad(ctx, cnv);
}

function gameLoad(ctx, cnv){
	
	var imageLoadCounter = 0;
	var allLoaded = false;
	
	//Cedric's basic playermodel images
	var syntheticArmLowerLeft = new Image();
	syntheticArmLowerLeft.src = 'imgs/Sprites/Synthetic/ArmLowerLeftSynthetic.gif';//'http://piskel-imgstore-b.appspot.com/img/c46121f0-0449-11e7-80d2-9d214acfe1e9.gif'
	
	var syntheticArmLowerRight = new Image();
	syntheticArmLowerRight.src = 'imgs/Sprites/Synthetic/ArmLowerRightSynthetic.gif';//'http://piskel-imgstore-b.appspot.com/img/c46121f0-0449-11e7-80d2-9d214acfe1e9.gif'
	
	var syntheticArmUpperRi = new Image();
	syntheticArmUpperRi.src = 'imgs/Sprites/Synthetic/ArmUpperRightSynthetic.gif';
	
	var syntheticArmUpperLe = new Image();
	syntheticArmUpperLe.src = 'imgs/Sprites/Synthetic/ArmUpperLeftSynthetic.gif';//'http://piskel-imgstore-b.appspot.com/img/502b9d1e-0533-11e7-978a-59d2b040d17b.gif';
	
	var syntheticHandLeft = new Image();
	syntheticHandLeft.src = 'imgs/Sprites/Synthetic/handSynthetic.gif';//'http://piskel-imgstore-b.appspot.com/img/1b55b091-05a1-11e7-925b-1756e446e1a5.gif';
	
	var syntheticHandRight = new Image();
	syntheticHandRight.src = 'imgs/Sprites/Synthetic/handSynthetic.gif';
	
	var syntheticTorsoFront = new Image();
	syntheticTorsoFront.src = 'imgs/Sprites/Synthetic/TorsoFrontSynthetic.gif';//'http://piskel-imgstore-b.appspot.com/img/e8a45987-0516-11e7-9191-4f4fc7e31569.gif';
	
	var syntheticTorsoFront2 = new Image();
	syntheticTorsoFront2.src = 'imgs/Sprites/Synthetic/TorsoFrontSynthetic2.gif'
	
	var syntheticHeadFront = new Image();
	syntheticHeadFront.src = 'imgs/Sprites/Synthetic/HeadFrontSynthetic.gif';//'http://piskel-imgstore-b.appspot.com/img/0d64b930-0449-11e7-96b2-9d214acfe1e9.gif';
	
	var syntheticLegFront = new Image();
	syntheticLegFront.src = 'imgs/Sprites/Synthetic/LegsFrontSynthetic.gif';//'http://piskel-imgstore-b.appspot.com/img/220fea1c-0449-11e7-b65f-9d214acfe1e9.gif';
	//End of Cedric's playermodels
	
	//Beginning of Riley's Fiend Playermodel Images
	var redFiendArmLowerRi = new Image();
	redFiendArmLowerRi.src = 'imgs/Sprites/Fiend/Red_Fiend_Arm_Lower_Right.gif';
	
	var redFiendArmLowerLe = new Image();
	redFiendArmLowerLe.src = 'imgs/Sprites/Fiend/Red_Fiend_Arm_Lower_Left.gif';
	
	var redFiendArmUpperRi = new Image();
	redFiendArmUpperRi.src = 'imgs/Sprites/Fiend/Fiend_Shoulder_Right.gif';
	
	var redFiendArmUpperLe = new Image();
	redFiendArmUpperLe.src = 'imgs/Sprites/Fiend/Fiend_Shoulder_Left.gif';
	
	var redFiendHandRi =     new Image();
	redFiendHandRi.src =     'imgs/Sprites/Fiend/Red_Fiend_Hand_Right.gif';
	
	var redFiendHandLe =     new Image();
	redFiendHandLe.src =     'imgs/Sprites/Fiend/Red_Fiend_Hand_Left.gif';
	
	var redFiendTorsoFront = new Image();
	redFiendTorsoFront.src = 'imgs/Sprites/Fiend/Red_Fiend_Torso_Front.gif';
	
	var redFiendHeadFront =  new Image();
	redFiendHeadFront.src =  'imgs/Sprites/Fiend/Red_Fiend_Head.gif';
	
	var redFiendLegFront =   new Image();
	redFiendLegFront.src =   'imgs/Sprites/Fiend/Hell_Dweller_Jeans_Legs_Front.gif';
	//End of Riley's Fiend Playermodel Images
	
	//Start of Riley's amazing tile images
	var hellTerrain0 = new Image();
	hellTerrain0.src = 'imgs/Tiles/WaterNeedsDetail.png';
	//
	var magmaTerrain0 = new Image();
	magmaTerrain0.src = 'imgs/Tiles/TileGrass.png';
	//End of Riley's amazing tile images
	
	var imagesInAnArray = [hellTerrain0, magmaTerrain0, syntheticArmLowerLeft, syntheticArmLowerRight, syntheticArmUpperRi, syntheticHandLeft, syntheticHandRight, syntheticTorsoFront, syntheticTorsoFront2, syntheticHeadFront, syntheticLegFront, redFiendArmLowerRi, redFiendArmLowerLe, redFiendArmUpperRi, redFiendHandRi, redFiendHandLe, redFiendTorsoFront, redFiendHeadFront, redFiendLegFront];
	
	var imgs = imagesInAnArray, len = imgs.length, counter = 0;

		[].forEach.call( imgs, function( img ) {
			img.addEventListener( 'load', incrementCounter, false );
		});

		function incrementCounter() {
			counter++;
			if ( counter === len ) {
				var whichType = 'syntheticHuman';//var whichType = chooseFrom(['fiend', 'syntheticHuman']);
				
				if(whichType === 'syntheticHuman'){
					var torso = new part('torsoFront', [syntheticTorsoFront]);//var torso = new part('torsoFront', chooseFrom([[syntheticTorsoFront],[syntheticTorsoFront2]]));
					var legsFront = new part('legsFront', [syntheticLegFront], torso);
					var headFront = new part('headFront', [syntheticHeadFront], torso);
					var armUpper = new part('armUpper', [syntheticArmUpperLe, syntheticArmUpperRi], torso);
					var armLower = new part('armLower', [syntheticArmLowerLeft, syntheticArmLowerRight], armUpper);
					var hand = new part('hand', [syntheticHandLeft, syntheticHandRight], armLower);
				}
				
				else if(whichType === 'fiend'){
					var torso = new part('torsoFront', [redFiendTorsoFront]);
					var legsFront = new part('legsFront', [redFiendLegFront], torso);
					var headFront = new part('headFront', [redFiendHeadFront], torso);
					var armUpper = new part('armUpper', [redFiendArmUpperLe, redFiendArmUpperRi], torso);
					var armLower = new part('armLower', [redFiendArmLowerLe, redFiendArmLowerRi], armUpper);
					var hand = new part('hand', [redFiendHandLe, redFiendHandRi], armLower);
				}
				
				player = new character([headFront, hand, armLower, armUpper, legsFront, torso]);
				
				worldMap = new gameMap(magmaTerrain0, hellTerrain0, 24);
				//worldMap.addIsland(24, 24, 6);
				//worldMap.addColumn(5);
				//worldMap.addRow(-1);
				
				gameUpdate(ctx, cnv);
			}
		}
}

function gameUpdate(ctx, cnv){
	
	ctx.clearRect(0, 0, cnv.width, cnv.height);
	
	
	worldMap.drawTiles(ctx);
	player.drawAll(ctx);
	
	
	setTimeout(function(){gameUpdate(ctx, cnv);}, 50);
}

//END OF GAME ENGINE CODE!-------------------------------------------------------------------------------------------------





