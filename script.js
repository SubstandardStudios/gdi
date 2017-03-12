//'use strict';//This enforces stricter syntax, throwing more errors more often at even the tiniest mistakes. Great for testing stuff!

//Start of function dictionary

function printTest(){
	console.log("This function prints 'Test!' for testing purposes. Test!");
}
function setPixel(x, y, ctx) {
	ctx.fillRect(x - 0.5, y - 0.5, 1, 1 );	
}

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

function drawRotatedImage(ctx,img,x,y,width,height,deg){

    //Convert degrees to radian 
    var rad = deg * Math.PI / 180;

    //Set the origin to the center of the image
    ctx.translate(x + width / 2, y + height / 2);

    //Rotate the canvas around the origin
    ctx.rotate(rad);

    //draw the image    
    ctx.drawImage(img,width / 2 * (-1),height / 2 * (-1));

    //reset the canvas  
    ctx.rotate(rad * ( -1 ) );
    ctx.translate((x + width / 2) * (-1), (y + height / 2) * (-1));
		//console.log(img.width, img.height);
}

//End of function dictionary


//Image dictionary

var woodenPlank = new Image();
woodenPlank.src = 'http://piskel-imgstore-b.appspot.com/img/be5d630f-e430-11e6-a821-b98bdf48deb5.gif';

var stoneTile = new Image();
stoneTile.src = 'http://piskel-imgstore-b.appspot.com/img/1c118591-e431-11e6-8a51-b98bdf48deb5.gif';


//Plank Images
var plankOddsAndEnds = new Image();
plankOddsAndEnds.src = 'http://piskel-imgstore-b.appspot.com/img/e6497bcc-fe69-11e6-8da6-6d27f02baa93.gif';

var plankStart = new Image();
plankStart.src = 'http://piskel-imgstore-b.appspot.com/img/3cb97afa-fe6a-11e6-9fa4-6d27f02baa93.gif';

var plankEnd = new Image();
plankEnd.src = 'http://piskel-imgstore-b.appspot.com/img/7ea38cb3-fe6a-11e6-968e-6d27f02baa93.gif';

var plankMiddle = new Image();
plankMiddle.src = 'http://piskel-imgstore-b.appspot.com/img/a9387fab-fe6a-11e6-8e85-6d27f02baa93.gif';
//End of Plank Images

//Jacob's Bow images
var bowTop = new Image();
bowTop.src = 'http://piskel-imgstore-b.appspot.com/img/3d2e8480-fec1-11e6-86b8-6d27f02baa93.gif';

var bowBottom = new Image();
bowBottom.src = 'http://piskel-imgstore-b.appspot.com/img/e0a7aa21-fec0-11e6-80e8-6d27f02baa93.gif';

var bowMiddle = new Image();
bowMiddle.src = 'http://piskel-imgstore-b.appspot.com/img/77c948ae-fec0-11e6-8c5e-6d27f02baa93.gif';
//End of Jacob's Bow images

//End of image dictionary

/*
http://piskel-imgstore-b.appspot.com/img/a443234c-01cd-11e7-8b3b-c714d3e93f2a.gif
http://piskel-imgstore-b.appspot.com/img/256a5059-01ce-11e7-8da3-c714d3e93f2a.gif


http://piskel-imgstore-b.appspot.com/img/2d30ac66-01d0-11e7-9eed-c714d3e93f2a.gif


http://piskel-imgstore-b.appspot.com/img/7be9b16b-01ce-11e7-a65e-c714d3e93f2a.gif
http://piskel-imgstore-b.appspot.com/img/85bd4557-01d0-11e7-acaa-c714d3e93f2a.gif



*/






//Variable dictionary

//Variables for canvas
var cnv = document.getElementById('gameCanvas');
var ctx = cnv.getContext('2d');
//End of canvas variables

//Start screen variables
var playButtonSet = 0;
var onStartScreen = true;
var boxOn = false;
var colorForBox = true;
var counterForBox = 0;
var playButtonRect = {x:275,y:400,width:150,height:50};
var playButtonBoolean = true;
//End of start screen variables

//End of variable dictionary




//Start Screen Code! --------------------------------------------------------------------------------------------
function drawPlayButton() {
	counterForBox++;
	if(counterForBox > 10){colorForBox = !colorForBox;counterForBox = 0;}
	ctx.fillStyle = colorForBox ? 'Peru' : 'DarkGrey';
	ctx.fillRect(275, 400, 150, 50);
	ctx.fillStyle = 'black';
	ctx.lineWidth = 4;
	ctx.textAlign = 'center';
	ctx.font = "30px 'Press Start 2P'";
	ctx.fillText('PLAY!', 356, 443);
	
	ctx.beginPath();
	ctx.setLineDash([20,10]);
	ctx.lineDashOffset = -playButtonSet;
	ctx.strokeRect(275, 400, 150, 50);
	ctx.closePath();
}
function startScreen() {
	
	//Background tile beginning
  for(var green = 0;green < 35;green++){
    for(var red = 0;red < 35;red++){
      var size = 20;
      var tileX = green*size;
      var tileY = red*size;
      var greenColor = 4*green + 100 - 6*red;
      var redColor = 4*green + 180 - 6*red;
			var blueColor = 4*green + 19 - 6*red;
      ctx.fillStyle = 'rgb(' + redColor + ',' + greenColor + ',' + blueColor + ')';
      ctx.fillRect(tileX, tileY, size, size);
			
    }
  }//Background tile code end
	
	//Bubble code start
	var bubbleCount = 25;//Amount of bubbles
	ctx.globalAlpha = 0.15;//How clear the bubbles get
	
	for(var bubbles = 0;bubbles < bubbleCount;bubbles++){
		var circleX = Math.floor(Math.random() * 700);
		var circleY = Math.floor(Math.random() * 700);
		ctx.fillStyle = chooseFrom(['peru', 'DarkGrey']);
		var bubbleLoops = Math.floor(Math.random() * 25) + 10;
		//console.log(bubbleLoops)
		
		for(var bubbleLoop = 0; bubbleLoop < bubbleLoops; bubbleLoop++){
			var radius = 2 + 2 * bubbleLoop;
			ctx.beginPath();
			ctx.arc(circleX, circleY, radius, 0, Math.PI * 2, true);
			ctx.fill();

		}
	}
	ctx.globalAlpha = 1;
	ctx.fillStyle = 'black';
	//End of Bubble Code
	
	//Title
	ctx.font = "bold 75px 'Press Start 2P'";
	ctx.textAlign = 'center';
	ctx.fillText('Cogitatio', 350, 300);
	//End Title
}
//Code for the play button
//Code that does stuff when the play button is clicked
cnv.addEventListener('click', function doThisOnClick(evt) {
	var mousePos = getMousePos(cnv, evt);
	
	if(isInside(mousePos, playButtonRect)){ 
		cnv.removeEventListener('click', doThisOnClick);
		onStartScreen = false;
	}
});


//Code for the function that animates the play button
function startUpdate() {
	playButtonSet++;
	if(playButtonSet > 210)playButtonSet = 0;
	//Passing around a huge number could cause lag, so we'll shorten every once in a while.
	drawPlayButton();
	
	
	if(onStartScreen)setTimeout(startUpdate, 20);
	else{transition1Update();}
}

//END OF START SCREEN CODE ----------------------------------------------------------------------------------------------------------



//START OF CHARACTER SELECTION SCREEN CODE!------------------------------------------------------------------------------------------

//Variables associated with just this section of code
var rows = 0;
var columns = 0;

var contentPlaced = false;
var waveCount = 0;

var callBackCount = 0;

var boxCounter = 0;

var transition1 = true;
var transition2 = true;

var animationTitles = [
	'Dark Waves Transition',
	'Yzy Bow Firing',
	'Sparkle',
];


function DarkWaves(callback){//Dark Wave!
		
	function advancingTriangle(whereToGo, rbgValuez){
		ctx.fillStyle = rbgValuez;
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(0, whereToGo*50);
		ctx.lineTo(whereToGo*50, 0);
		ctx.fill();
		}
		
	if(waveCount === 0){
		$('#rightSideBarOuter').hide();
		$('#mainAreaOuter').hide();
	}
		
	if(waveCount < 30)advancingTriangle(waveCount, 'rgb(0, 0, 0)');
	if(waveCount > 15 && waveCount < 45)advancingTriangle(waveCount - 15, 'rgb(40, 40, 40)');
	if(waveCount > 30 && waveCount < 60)advancingTriangle(waveCount - 30, 'rgb(80, 80, 80)');
	if(waveCount > 45 && waveCount < 75)advancingTriangle(waveCount - 45, 'rgb(120, 120, 120)');
	if(waveCount > 60 && waveCount < 90)advancingTriangle(waveCount - 60, 'rgb(160, 160, 160)');
	if(waveCount > 75 && waveCount < 105)advancingTriangle(waveCount - 75, 'rgb(200, 200, 200)');
	if(waveCount > 90 && waveCount < 120)advancingTriangle(waveCount - 90, 'rgb(240, 240, 240)');
	
	waveCount++;
		
	if(waveCount > 120)waveCount = 0;
		
	if(waveCount !== 0)setTimeout(function(){DarkWaves(callback)}, 50);
	else{callback()}
}

function clearScreen() {//Clear screen!
	transition1 = true;
	transition2 = true;
	rows = 0;
	columns = 0;
	transition1Update();
	$('#rightSideBarOuter').hide();
	$('#mainAreaOuter').hide();
}


var animationCode = [
  function() {
		DarkWaves(clearScreen);
	},
	
  function(){//Fire dat Yzy Bow!
		console.log('Pew! Pew! DEATH AND DESTRUCTION!');
	},
	
	function(){//Sparkle: a somewhat feminine, useful nonetheless, particle effect!
		console.log('Twinkle twinkle little star!');
	}
];



function drawPlank() {
	if(rows === 0){ctx.drawImage(plankStart, 0, 16 * columns);}
	else if(rows === 18){ctx.drawImage(plankEnd, 680, 16*columns);}
	else if(rows === 17)ctx.drawImage(plankMiddle, 20 + 40*(rows-1), 16 * columns);
	else{ctx.drawImage(chooseFrom([plankMiddle, plankMiddle, plankMiddle, plankMiddle, plankOddsAndEnds]), 20 + 40*(rows-1), 16 * columns);}
}

function transition1Update() {
	drawPlank();
	
	rows++
	
	if(rows > 18){columns++; rows = 0;}
	if(columns > 43){transition1 = false; rows = 0;}
	
	if(transition1)setTimeout(transition1Update, 1);
	else{transition2Update();}
}

function transition2Update() {
	ctx.drawImage(stoneTile, 175, stoneTile.height * rows);
	rows++;
	
	if(rows > 14){rows = 0; transition2 = false;}
	if(transition2)setTimeout(transition2Update, 30);
	else{placeContent();}
}

function placeContent() {
	if(contentPlaced){
		$('#rightSideBarOuter').show();
		$('#mainAreaOuter').show();
		return;
	}
	else if(!contentPlaced)contentPlaced = true;
	
	$('#canvasCan').prepend('<div id = rightSideBarOuter style = position:absolute;top:0px;left:0px;height:700px;width:175px; zindex = 2 > </div>')
		$('#rightSideBarOuter').prepend('<div id = rightSideBarInner style = position:relative;height:700px;width:175px;></div>');
			$('#rightSideBarInner').prepend('<div style = padding-right:4px;margin-top:4px; zindex = 2 id = characterBox class = quickPlay></div>');
				$('.quickPlay').prepend('<p id = characterSubTitle>Quick Play</p>');
				$('.quickPlay').append('<hr id = thinHr>');
				$('.quickPlay').append('<p style = text-align:center;margin-top:0px; id = characterSubText>Play without having to generate a character first.</p>');
				$('.quickPlay').append('<hr style = margin-top:20px; id = thinHr>');
			$('#rightSideBarInner').append('<div style = padding-right:4px;margin-top:18px; zindex = 2 id = characterBox class = animationPlayGround></div>');
				$('.animationPlayGround').prepend('<p id = characterSubTitle>Animations</p>');
				$('.animationPlayGround').append('<hr id = thinHr>');
				$('.animationPlayGround').append('<p style = text-align:center;margin-top:0px; id = characterSubText>Test out some of our fresh animations!</p>');
				$('.animationPlayGround').append('<hr style = margin-top:20px; id = thinHr>');
			$('#rightSideBarInner').append('<div style = padding-right:4px;margin-top:18px; zindex = 2 id = characterBox class = inventoryTest></div>');
				$('.inventoryTest').prepend('<p id = characterSubTitle>Inventory</p>');
				$('.inventoryTest').append('<hr id = thinHr>');
				$('.inventoryTest').append('<p style = text-align:center;margin-top:0px; id = characterSubText>Test out the inventory system!</p>');
				//$('.inventoryTest').append('<hr style = margin-top:20px; id = thinHr>');
	
	$('#canvasCan').append('<div id = mainAreaOuter style = position:absolute;top:0px;left:222px;height:700px;width:478px; zindex = 2 ></div>');
		$('#mainAreaOuter').prepend('<div id = mainAreaInner style = position:relative;height:700px;width:478px; zindex = 2></div>');
	
	
	$('.animationPlayGround').click(function(){
		$('#mainAreaInner').empty();
		rows = 0;
		columns = 0;
		boxCounter = 0;
		$('#mainAreaInner').append('<div id = animationMainArea style = margin:auto;width:95%;height:95%;padding:5px;></div>');
		$('#animationMainArea').append('<div style = width:100%;height:50px; id = animationTitleBar><h3 style = text-align:center;>Animations</h3></div>');
		$('#animationMainArea').append('<hr style = margin-top:10px; id = thinHr>');
		
		for(columns = 0; columns < 6; columns++){
			$('#animationMainArea').append('<div style = width:100%;height:100px id = thisColumn' + columns + '></div>');
			for(rows = 0; rows < 4; rows++){
				if(rows === 0)$('#thisColumn' + columns).append('<div id = animationBox style = float:right; class = animationNumber' + boxCounter + '></div>');
				else if(rows === 1)$('#thisColumn' + columns).append('<div id = animationBox style = float:left; class = animationNumber' + boxCounter + '></div>');
				else if(rows === 2)$('#thisColumn' + columns).append('<div id = animationBox style = margin:auto; class = animationNumber' + boxCounter + '></div>');
				else if(rows === 3)$('#thisColumn' + columns).append('<hr style = margin-top:10px; id = thinHr>');
				if(rows < 3)boxCounter++;
			}
		}
		
		for(boxCounter;boxCounter !== -1; boxCounter--){
			if(boxCounter < 3) {
				$('.animationNumber' + boxCounter).append('<p margin-top:5px>' + animationTitles[boxCounter] + '</p>');
				$('.animationNumber' + boxCounter).click(animationCode[boxCounter]);
			}
		
			else{
				animationNumber = (boxCounter%3 === 0) ? boxCounter + 2 : boxCounter - 1;
				$('.animationNumber' + boxCounter).append('<p margin-top:5px>Animation #' + animationNumber + '</p>');
				$('.animationNumber' + boxCounter).click(function(){ console.log('No function yet! :D') });
			}
		}J
	});

	$('.inventoryTest').click(function(){
		$('#mainAreaInner').empty();
		$('#mainAreaInner').append('<div id = inventoryMainArea style = margin:auto;width:95%;height:95%;padding:5px;></div>');
		$('#inventoryMainArea').append('<div style = width:100%;height:50px; id = inventoryTitleBar><h3 style = text-align:center;margin-top:35px;>Inventory</h3></div>');
		$('#inventoryMainArea').append('<hr style = margin-top:10px; id = thinHr>');
	});
	
	$('.quickPlay').click(function(){
		DarkWaves(startGame);
	});
}

//END OF CHARACTER SELECTION SCREEN CODE!--------------------------------------------------------------------------------------------

//START OF GAME ENGINE CODE(Walking, attacking, inventory, stuff like that.) ----------------------------------------------

//Variables for game engine
var characterModel;

var destination = {x:0, y:0};
var origin      = {x:0, y:0};

var canvasListenerOut = false;
var animationCounter = 0;
//End of variables for game engine.

//Assisting functions for game engine! :D

function part(type, img, parent) {//parent should be torso, unless you're using a lower arm or hand! In that case, use upperarm or lowerarm, respectively Also, arm upper is the only one that needs two images, put them in the way we read: left to right :D
	
	this.image = img[0];
	this.width = this.image.width;
	this.height = this.image.height;
	
	this.type = type;
	
	if(this.type !== 'torsoFront')this.parent = parent;
	
	this.getPosition = function() {
		if(this.type === 'torsoFront'){
			this.x = 300 - this.width/2;
			this.y = 300 - this.height/2;
		}

		else if(this.type === 'legsFront'){
			this.x = parent.x;
			this.y = parent.y + parent.width;
		}

		else if(this.type === 'headFront'){
			this.x = parent.x + (parent.width - this.width)/2;
			this.y = parent.y - this.height;
		}

		else if(this.type === 'armUpper'){
			this.leftX = parent.x - this.width;
			this.positionValueLeftX = 6;

			this.leftY = parent.y  - 6;

			this.rightX = parent.x + parent.width;
			this.positionValueRightX = -6;

			this.rightY = parent.y - 6;
		}

		else if(this.type === 'armLower'){
			this.leftX = parent.leftX + parent.positionValueLeftX;
			this.positionValueLeftX = 0;

			this.leftY = parent.leftY + parent.height;
			this.positionValueLeftY = -6;

			this.rightX = parent.rightX;
			this.positionValueRightX = 0;

			this.rightY = parent.rightY + parent.height;
			this.positionValueRightY = -6;
		}

		else if(this.type === 'hand'){
			this.leftX = parent.leftX;
			this.positionValueLeftX = parent.positionValueLeftX;

			this.leftY = parent.leftY + parent.height;
			this.positionValueLeftY = -9;

			this.rightX = parent.rightX;
			this.positionValueRightX = 0;

			this.rightY = parent.rightY + parent.height;
			this.positionValueRightY = -9;
		}
	}
	
	console.log(this.type + ' ' + this.width + ' ' + this.height + ' ' + this.x + ' ' + this.y);
	
	this.draw = function(drawLeft, drawRight, canvasContext){//Also, remember, drawLeft and drawRight decide whether or not to draw those arms!  :D
		
		if(this.width === 0 || this.height === 0){
			this.width = this.image.width;
			this.height = this.image.height;
			this.getPosition();
			console.log(this.type + ' ' + this.width + ' ' + this.height + ' ' + this.x + ' ' + this.y);
		}
		
		if(this.type !== 'armUpper' && this.type !== 'armLower' && this.type !== 'hand')canvasContext.drawImage(this.image, this.x, this.y);
		
		else if(this.type === 'armUpper'){
			this.imageRi = img[1];
			//REMEMBER! this.image = img[0];
			if(drawRight)canvasContext.drawImage(this.imageRi, this.rightX + this.positionValueRightX, this.rightY);
			if(drawLeft)canvasContext.drawImage(this.image, this.leftX + this.positionValueLeftX, this.leftY);
		}
		else{
			if(drawLeft)canvasContext.drawImage(this.image, this.leftX + this.positionValueLeftX, this.leftY + this.positionValueLeftY);
			if(drawRight)canvasContext.drawImage(this.image, this.rightX + this.positionValueRightX, this.rightY + this.positionValueRightY);
		}
	}
	
	
	this.drawRotated = function(drawLeft, drawRight, canvasContext, degrees, addToWidth, addToHeight){
		if(this.type === 'armUpper'){
			this.imageRi = img[1];
			//REMEMBER! this.image = img[0];
			if(drawRight)drawRotatedImage(canvasContext, this.imageRi, this.rightX + this.positionValueRightX, this.rightY, this.width + addToWidth, this.height + addToHeight, degrees);
			if(drawLeft)drawRotatedImage(canvasContext, this.image, this.leftX + this.positionValueLeftX, this.leftY, this.width + addToWidth, this.height + addToHeight, degrees);
		}
		else{
			if(drawLeft)drawRotatedImage(canvasContext, this.image, this.leftX + this.positionValueLeftX, this.leftY + this.positionValueLeftY, this.width + addToWidth, this.height + addToHeight, degrees);
			if(drawRight)drawRotatedImage(canvasContext, this.image, this.rightX + this.positionValueRightX, this.rightY + this.positionValueRightY, this.width + addToWidth, this.height + addToHeight, degrees);
		}
	}
}






function character(parts){
	this.animationType = 'none';
	
	
	/*
	function getWholeArm(){
		var topPart;
		var middlePart;
		var bottomPart;
		
		parts.forEach(function(element){
			if(element.type === 'armUpper')topPart = element;
			else if(element.type === 'armLower')middlePart = element;
			else if(element.type === 'hand')bottomPart = element;
		});
			
		var c = document.createElement('canvas');
		c.width = topPart.width;
		c.height = topPart.height + (middlePart.height - 6) + (bottomPart.height - 3);
		var ctx = c.getContext("2d");
			
		middlePart.draw(false, true, ctx);
		topPart.draw(false, true, ctx);
		bottomPart.draw(false, true, ctx);
		
		return c.toDataURL("image/gif");
	}*/
	
	//this.wholeArm = getWholeArm();
	
	this.drawAll = function(animation, counter, canvasContext){
		
		if(animation === 'none'){//This one runs if no other animation is called!
			parts.forEach(function(element){
				if(element.type === 'torsoFront')element.draw(true, true, canvasContext);
			});
		}
		
		
		else if(animation === 'wave'){
			
			parts.forEach(function(element){
				element.draw(true, false, canvasContext);
				
				if(element.type === 'armUpper'){
					canvasContext.drawImage(this.wholeArm, element.rightX, element.rightY);
				}
				/*
				if(element.type === 'armUpper'){
					var armRotation = (counter*6 < 270)? 270 : counter*6;
					element.drawRotated(false, true, armRotation, element.positionValueLeftX, element.positionValueLeftY, element.positionValueRightX, element.positionValueRightY, 0, 0);
				}
				
				if(element.type === 'armLower'){
					var armRotation = (counter*6 < 270)? 360 : counter*6+90;
					element.drawRotated(false, true, armRotation, 0, 0, 0, -element.height - element.parent.height + 6, (element.parent.width - element.width), (element.parent.height - 6));
					
				}*/
			});

			if(counter === 0)this.animationType = 'none';
			
		}
		
		
	}
	
}

//End of assissting functions section! :D


//MAIN FUNCTION FOR STARTING UP GAME ENGINE! :D
function startGame(){
	$('#gameCanvas').html('<canvas id="gameCanvas" width="600" height="600">Your browser is too old: get a new one!</canvas>');
	
	/*
	console.log = (function (old_function, div_log) { 
    return function (text) {
        old_function(text);
        div_log.value += text;
    };
	} (console.log.bind(console), document.getElementById("error-log")));
	
	console.log('Test!');*/
	
	var cnv = document.getElementById('gameCanvas');
	var ctx = cnv.getContext('2d');
	setpixelated(ctx);
	
	gameLoad(ctx, cnv);
}

function gameLoad(ctx, cnv){
	
	var imageLoadCounter = 0;
	var allLoaded = false;
	
	//Cedric's basic playermodel images
	var syntheticArmLower = new Image();
	syntheticArmLower.src = 'imgs/ArmLowerSynthetic.gif';//'http://piskel-imgstore-b.appspot.com/img/c46121f0-0449-11e7-80d2-9d214acfe1e9.gif'
	
	var syntheticArmUpperRi = new Image();
	syntheticArmUpperRi.src = 'imgs/ArmUpperRightSynthetic.gif';
	
	var syntheticArmUpperLe = new Image();
	syntheticArmUpperLe.src = 'imgs/ArmUpperLeftSynthetic.gif';//'http://piskel-imgstore-b.appspot.com/img/502b9d1e-0533-11e7-978a-59d2b040d17b.gif';
	
	var syntheticHand = new Image();
	syntheticHand.src = 'imgs/HandSynthetic.gif';//'http://piskel-imgstore-b.appspot.com/img/1b55b091-05a1-11e7-925b-1756e446e1a5.gif';
	
	var syntheticTorsoFront = new Image();
	syntheticTorsoFront.src = 'imgs/TorsoFrontSynthetic.gif';//'http://piskel-imgstore-b.appspot.com/img/e8a45987-0516-11e7-9191-4f4fc7e31569.gif';
	
	var syntheticHeadFront = new Image();
	syntheticHeadFront.src = 'imgs/HeadFrontSynthetic.gif';//'http://piskel-imgstore-b.appspot.com/img/0d64b930-0449-11e7-96b2-9d214acfe1e9.gif';
	
	var syntheticLegFront = new Image();
	syntheticLegFront.src = 'imgs/LegsFrontSynthetic.gif';//'http://piskel-imgstore-b.appspot.com/img/220fea1c-0449-11e7-b65f-9d214acfe1e9.gif';
	//End of Cedric's playermodels
	
	var imagesInAnArray = [syntheticArmLower, syntheticArmUpperRi, syntheticHand, syntheticTorsoFront, syntheticHeadFront, syntheticLegFront];
	
	var imgs = imagesInAnArray, len = imgs.length, counter = 0;

		[].forEach.call( imgs, function( img ) {
			img.addEventListener( 'load', incrementCounter, false );
		});

		function incrementCounter() {
			counter++;
			if ( counter === len ) {
				gameUpdate(ctx, cnv);
			}
		}
	
	imagesInAnArray.forEach(function(element){
		ctx.drawImage(element, 0, 0);
	});
	
	var torso = new part('torsoFront', [syntheticTorsoFront]);
	var legsFront = new part('legsFront', [syntheticLegFront], torso);
	var headFront = new part('headFront', [syntheticHeadFront], torso);
	var armUpper = new part('armUpper', [syntheticArmUpperLe, syntheticArmUpperRi], torso);
	var armLower = new part('armLower', [syntheticArmLower], armUpper);
	var hand = new part('hand', [syntheticHand], armLower);
	
	player = new character([hand, armLower, armUpper, torso, headFront, legsFront]);
	
}

function gameUpdate(ctx, cnv){
	
	ctx.clearRect(0, 0, cnv.width, cnv.height);
	
	if(!(canvasListenerOut)){
		cnv.addEventListener('click', function(){player.animationType = 'wave';animationCounter = 50;});
		canvasListenerOut = true;
	}
	
	player.drawAll(player.animationType, animationCounter, ctx);
	
	if(animationCounter !== 0)animationCounter--;
	
	setTimeout(function(){gameUpdate(ctx, cnv);}, 50);
}

//END OF GAME ENGINE CODE!-------------------------------------------------------------------------------------------------






//startUpdate();
startGame();


//          LIST OF COOL GOOGLE FONTS
//
//Almendra                  Kind of fancy
//Annie use your telescope  Like handwriting
//Astloch                   Really castley looking
//Atomic Age                A combination of sci-fi and fantasy, if such concepts can be applied to fonts.
//Bigelow Rules             Haunted-housey
//Bilbo Swash Caps          Pretty, kind of fancy cursive
//Caesar Dressing           Tribal, almost
//Caveat                    Thin handwriting
//Cedarville Cursive        Messy, still legible cursiveish handwriting
