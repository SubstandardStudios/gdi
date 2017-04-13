//'use strict';//This enforces stricter syntax, throwing more errors more often at even the tiniest mistakes. Great for testing stuff!

//Start of function dictionary

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
	
	
	this.drawAll = function(animation, counter, canvasContext){
		
		if(animation === 'none'){//This one runs if no other animation is called!
			parts.forEach(function(element){
				element.draw(true, true, canvasContext);
			});
		}
		
		
		else if(animation === 'wave'){
			
			var rotationAmount;// This will be an integer that we will use to rotate the arm.
			
			if(counter < 30){//If the counter is above 30, then we are still moving the arm into place.
				rotationAmount = (counter*3) + 90;
				//console.log(rotationAmount);
			}
			else rotationAmount = -180;
			
			parts.forEach(function(element){
				if(element.type === 'armUpper' || element.type === 'armLower' || element.type === 'hand'){
					if(element.type === 'armUpper')element.drawRotated(element.rightX + element.width/2, element.rightY + element.height/2, rotationAmount, 0, 0, false, true, canvasContext);
					else if(element.type === 'armLower')element.drawRotated(parent.rightX + parent.width/2, parent.rightY + parent.height/2, rotationAmount, 0, 0, false, true, canvasContext)
				}
				element.draw(true, false, canvasContext);
			});

			if(counter === 50)this.animationType = 'none';
			
		}
		
		
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
		
		this.arrayForMap.splice(x>0?x:0, 0, []);
		
		for(var i = 0; i < fillUpTo; i++){
			this.arrayForMap[x>0?x:0].push(new tile(this.tileImage1));
		}
	}
	
	
	this.addColumn = function(y){
		for(i = 0; i < this.arrayForMap.length;i++){
			this.arrayForMap[i].splice(y>0?y:0, 0, new tile(this.tileImage1, i*25, (y+1)*25));
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
				if(typeof this.arrayForMap[0][y-counter] === 'undefined')this.addColumn(y-counter);
				
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
				var newTile = new tile(this.tileImage1, rows*25, columns*25);//var newTile = new tile((Math.round(Math.random()*100) !== 1) ? this.tileImage1 : this.tileImage2, rows*25, columns*25);
				this.arrayForMap[rows].push(newTile);
			}
		}
	}
	
	this.makeTiles();
	
	this.drawTiles = function(canvasContext){
		this.arrayForMap.forEach(function(element, index){
			var xIndex = index;
			element.forEach(function(element, index){
				element.draw(canvasContext, xIndex*25, index*25);
			});
		});
	}
}

//End of assisting functions section! :D


//MAIN FUNCTION FOR STARTING UP GAME ENGINE! :D
function startGame(){
	$('#canvasCan').html('<canvas id="gameCanvas" width="650" height="650">This human\'s web browser is incapable of using the graphical deity interface I have created...</canvas>');
	
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
	hellTerrain0.src = 'imgs/Tiles/Hell_Terrain_1.gif';
	
	var magmaTerrain0 = new Image();
	magmaTerrain0.src = 'imgs/Tiles/Magma_Terrain_1.gif';
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
				worldMap.addIsland(12, 12, 6);
				//worldMap.addColumn(5);
				//worldMap.addRow(-1);
				
				gameUpdate(ctx, cnv);
			}
		}
}

function gameUpdate(ctx, cnv){
	
	ctx.clearRect(0, 0, cnv.width, cnv.height);
	
	if(!(canvasListenerOut)){
		cnv.addEventListener('click', function(){player.animationType = 'wave';animationCounter = 0;});
		canvasListenerOut = true;
	}
	
	worldMap.drawTiles(ctx);
	player.drawAll(player.animationType, animationCounter, ctx);
	
	if(animationCounter < 51)animationCounter++;
	
	setTimeout(function(){gameUpdate(ctx, cnv);}, 50);
}

//END OF GAME ENGINE CODE!-------------------------------------------------------------------------------------------------





