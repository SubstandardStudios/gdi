//Variable dictionary

//Variables for canvas
var cnv = document.getElementById('gameCanvas');
var ctx = cnv.getContext('2d');
//End of canvas variables

//Start screen variables
var playButtonSet = 0;
var boxOn = false;
var colorForBox = true;
var counterForBox = 0;
var playButtonRect = {x:$(window).width()/2-75,y:$(window).height()/2+12,width:150,height:50};
var playButtonBoolean = true;
var titleScreenBubbles = new bubbles();

var colorOneRGB = [Math.ceil(Math.random()*255), Math.ceil(Math.random()*255), Math.ceil(Math.random()*255)];
var colorTwoRGB = [Math.ceil(Math.random()*255), Math.ceil(Math.random()*255), Math.ceil(Math.random()*255)];

var colorOne = 'rgb(' + colorOneRGB[0] + ',' + colorOneRGB[1] + ',' + colorOneRGB[2] + ')';
var colorTwo = 'rgb(' + colorTwoRGB[0] + ',' + colorTwoRGB[1] + ',' + colorTwoRGB[2] + ')';

//Variables for the background tiles

var differenceRed = [colorOneRGB[0] - colorTwoRGB[0]];
var differenceGreen = [colorOneRGB[1] - colorTwoRGB[1]];
var differenceBlue = [colorOneRGB[2] - colorTwoRGB[2]];

//End of variables for the background tiles
//End of start screen variables

//End of variable dictionary

//BEGINNING OF GENERAL PURPOSE CLASSES!
//These are used in various places throughout the game.

function toggleFunction(mainFunction, startUpFunction, cleanUpFunction, updateDataArray){//This class is used for creating functions that can be turned on or off, and/or are looped.
  this.on = false;                                                                      //Not a necessity, of course, but really nice to have and saves time here and there.
  
  this.doesUpdate = (updateDataArray) ? (updateDataArray[0]) : false; //boolean, decides whether or not the function is recursive
  this.updateTime = (updateDataArray) ? (updateDataArray[1]) ? updateDataArray[1] : 0 : 0; //Integer, If the updateDataArray doesn't exist, or updateData[1] doesn't exist, this function, which decides how long the delay inbetween loops should be, is registered as zero.
  
  this.mainLoop = function(){//This function checks to see if the loop is active, if so, it calls the mainFunction, and then decides whether or not to loop again(and when).
    if(!this.on){return;}
    if(mainFunction)mainFunction();
    if(this.doesUpdate)setTimeout(this.mainLoop.bind(this), this.updateTime);
  }
  
  this.toggleOn = function(){//Calls our startUpFunction(if there is one), sets our loop status to on, and then begins the loop!
    if(startUpFunction)startUpFunction();
    this.on = true;
    this.mainLoop();
  }
  
  this.toggleOff = function(){//Kills loop, then calls cleanUpFunction.
    this.on = false;
    if(cleanUpFunction)cleanUpFunction();
  }
  
}

//ENDING OF GENERAL PURPOSE CLASSES




//Start Screen Code! --------------------------------------------------------------------------------------------
function drawPlayButton() {
	counterForBox++;
	if(counterForBox > 10){colorForBox = !colorForBox;counterForBox = 0;}
	ctx.fillStyle = colorForBox ? colorOne : colorTwo;
	ctx.fillRect($(window).width()/2-75, $(window).height()/2+12, 150, 50);
	ctx.fillStyle = 'black';
	ctx.lineWidth = 4;
	ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
	ctx.font = "30px 'Aclonica'";
	ctx.fillText('PLAY', $(window).width()/2, $(window).height()/2+39, 150, 50);
	
	ctx.beginPath();
	ctx.setLineDash([20,10]);
	ctx.lineDashOffset = -playButtonSet;
	ctx.strokeRect($(window).width()/2-75, $(window).height()/2+12, 150, 50);
	ctx.closePath();
}

function startScreen() {
  
  var gameCanvas = document.getElementById("gameCanvas");
  
  titleScreenBubbles.makeMap();
  
  gameCanvas.width = $(window).width();
  gameCanvas.height = $(window).height();
  
  $('body').css('overflow', 'hidden');
  $('html').css('overflow', 'hidden');
  
  
  //Event listeners section
  
  
  window.addEventListener('resize', function(){
    playButtonRect = {x:$(window).width()/2-75,y:$(window).height()/2+12,width:150,height:50};
    var gameCanvas = document.getElementById("gameCanvas");
    gameCanvas.width = $(window).width();
    gameCanvas.height = $(window).height()-16;
  });

  window.addEventListener('resize', titleScreenBubbles.makeMap);

  cnv.addEventListener('click', function doThisOnClick(evt){
    var mousePos = getMousePos(cnv, evt);
    
    if(isInside(mousePos, playButtonRect)){ 
      cnv.removeEventListener('click', doThisOnClick);
      window.removeEventListener('resize', titleScreenBubbles.makeMap);
      startScreenUpdate.toggleOff();
    }

    titleScreenBubbles.map.forEach(function(element, index){
      titleScreenBubbles.glideTo(index, mousePos.x, mousePos.y);
    });
  });
  
  
  //End of event listeners
  
  
  function cleanUp(){
    woodenBackground = new displayAcrossScreen([plankStart, plankMiddle, plankOddsAndEnds, plankEnd], undefined, undefined, true);
    stonePillar = new displayAcrossScreen([stoneTile], 0, 175);
    woodenBackground.drawPlanks(1, function(){stonePillar.drawPlanks(3, function(){characterSelectUpdate(); placeContent();});});
  }
  
  function updateLoop(){
    playButtonSet++;
    if(playButtonSet > 210)playButtonSet = 0;
    //Passing around a huge number could cause lag, so we'll shorten it every once in a while.
    makeBackgroundScreen();
    titleScreenBubbles.drawMap();
    drawTitle();
    drawPlayButton();
  }
  
  var startScreenUpdate = new toggleFunction(updateLoop, undefined, cleanUp, [true, 16]);
  startScreenUpdate.toggleOn();
}

function makeBackgroundScreen(){
  //Background tile beginning
  var numberOfTilesWide = ($(window).width() - $(window).width() % 20)/20+1;
  var numberOfTilesHigh = ($(window).height() - $(window).height() % 20)/20+1;
  
  for(var tileX = 1; tileX <= numberOfTilesWide; tileX++){
    for(var tileY = 1; tileY <= numberOfTilesHigh; tileY++){
      
      var redColor = Math.ceil(differenceRed[0]/numberOfTilesWide)*tileX + colorOneRGB[0] - tileY*Math.ceil(differenceRed[0]/numberOfTilesHigh);
      var greenColor = Math.ceil(differenceGreen[0]/numberOfTilesWide)*tileX + colorOneRGB[1] - tileY*Math.ceil(differenceGreen[0]/numberOfTilesHigh);
      var blueColor = Math.ceil(differenceBlue[0]/numberOfTilesWide)*tileX + colorOneRGB[2] - tileY*Math.ceil(differenceBlue[0]/numberOfTilesHigh);
      
      ctx.fillStyle = 'rgb(' + redColor + ',' + greenColor + ',' + blueColor + ')';
      ctx.fillRect(tileX*20-20, tileY*20-20, 20, 20);
    }
  }//Background tile code end
}

function bubbles(){
  
  this.map = [];
  
  this.makeMap = function(){
    
    this.map = [];
    
    var bubbleCount = $(window).height() * $(window).width() / 25000;//Amount of bubbles
    
    for(var bubbles = 0;bubbles < bubbleCount;bubbles++){
      var circleX = Math.floor(Math.random() * $(window).width());
      var circleY = Math.floor(Math.random() * $(window).height());
    
      var bubbleLoops = Math.floor(Math.random() * 25) + 10; //This decides how many times this bubble should be looped, which dictates how big it is.
      
      var color = chooseFrom([colorOne, colorTwo]);
      
      var alphaLevel = (45-bubbleLoops)*0.008;
      
      var rect = {
        width:bubbleLoops*4+2,
        height:bubbleLoops*4+2,
        x:circleX-(bubbleLoops*2+2)/1.25,
        y:circleY-(bubbleLoops*2+2)/1.25
      };
      
      var colorOptions = [colorOne, colorTwo];
      
      var moving = false;
      
      this.map.push([circleX, circleY, bubbleLoops, color, alphaLevel, rect, colorOptions, moving]);
    }
  };
  
  this.drawMap = function(){
    
    this.map.forEach(function(element, index){
      
      if(Math.floor(Math.random()*2000) === 1)element[3] = (element[3] === colorOne) ? colorTwo : colorOne;
      if(Math.floor(Math.random()*100) === 1)titleScreenBubbles.glideTo(index, Math.floor(Math.random()*$(window).width()), Math.floor(Math.random()*$(window).height()));
      ctx.fillStyle = element[3];
      
      for(var bubbleLoop = 0; bubbleLoop <= element[2]; bubbleLoop++){
        ctx.globalAlpha = element[4];//How clear the bubbles get
        ctx.beginPath();
        ctx.arc(element[0] + Math.floor(Math.random()*(element[2]/1.25)), element[1] + Math.floor(Math.random()*(element[2]/1.25)), 2 + 2 * bubbleLoop, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
      }
      
      
    });
  };
  
  this.glideTo = function(indexOfGlidingBubble, glideToX, glideToY){
    //setup of constants:
    var glidingBubble = this.map[indexOfGlidingBubble];
    if(glidingBubble[7] === true) return;
    glidingBubble[7] = true;
    
    var xStart = glidingBubble[0];
    var yStart = glidingBubble[1];
    var xEnd = glideToX;
    var yEnd = glideToY;
    
    var dx =  Math.abs(xEnd-xStart);
	var sx = xStart<xEnd ? 1 : -1;
	var dy = -Math.abs(yEnd-yStart);
	var sy = yStart<yEnd ? 1 : -1;
	
	var err = dx+dy;
	var e2;
    
    var timesGoneCounter = 0;
    
    var speed = Math.floor(Math.random()*50)+10;
    
    //Done with setup of constants
    
    //Function for resetting the position of our glidingBubble
    function positionChange(x, y){
      glidingBubble[0] = x;
      glidingBubble[1] = y;
      glidingBubble[5] = {width:glidingBubble[2]*4+2,height:glidingBubble[2]*4+2,x:glidingBubble[0]-(glidingBubble[2]*2+2)/1.25,y:glidingBubble[1]-(glidingBubble[2]*2+2)/1.25};
    }
    
    function recursiveMovement(){
      
      timesGoneCounter++;
		
      if(!(xStart == xEnd && yStart == yEnd)){
		e2 = 2*err;
		
		if (e2 >= dy){
		  err += dy;
		  xStart += sx;
		}
        
		if (e2 <= dx){
		  err += dx;
		  yStart += sy;
		}
        
        if(timesGoneCounter > speed){
          timesGoneCounter = 0;
          positionChange(xStart,yStart);
          setTimeout(recursiveMovement, 16);
        }
        
        else recursiveMovement();
      }
      else glidingBubble[7] = false;
	}
    recursiveMovement();
  };
}
function drawTitle(){
	ctx.globalAlpha = 1;
	ctx.fillStyle = 'black';
	//End of Bubble Code
	
	//Title
	ctx.font = "bold 75px 'Aclonica'";
    ctx.textBaseline = 'bottom';
	ctx.textAlign = 'center';
	ctx.fillText('GDI', $(window).width()/2, $(window).height()/2-12);
	//End Title
}

//END OF START SCREEN CODE ----------------------------------------------------------------------------------------------------------



//START OF CHARACTER SELECTION SCREEN CODE!------------------------------------------------------------------------------------------

//Variables associated with this section of code

var contentPlaced = false;
var waveCount = 0;

var callBackCount = 0;

var boxCounter = 0;

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
		ctx.lineTo(0, whereToGo*($(window).height()/12));
		ctx.lineTo(whereToGo*($(window).width()/12), 0);
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
		
	if(waveCount !== 0)setTimeout(function(){DarkWaves(callback);}, 50);
	else{callback();}
}

function clearScreen() {//Clear screen!
	//new displayAcrossScreen(1, [plankStart, plankOddsAndEnds, plankMiddle, plankEnd]);
	$('#rightSideBarOuter').hide();
	$('#mainAreaOuter').hide();
}


var animationCode = [
  function(){
    DarkWaves(clearScreen);
  },
	
  function(){//Fire down upon them!
    console.log('My tongue is sharp, but my arrow is sharper!');
  },
	
  function(){//Sparkle: a somewhat feminine, useful nonetheless, particle effect!
    console.log('Twinkle twinkle little star!');
  }
];


function characterSelectUpdate(){
  
  characterSelectionScreen = new toggleFunction(
    undefined,
    function(){
      window.addEventListener('resize', function makeNewMaps(){woodenBackground.mapPlanks(true); stonePillar.mapPlanks(true);});
    },
    function(){
      window.removeEventListener('resize', makeNewMaps);
    }
  );
  characterSelectionScreen.toggleOn();
}


function displayAcrossScreen(imagesArray, maxRows, startX, edgeFitOverlap) {
  
    this.plankStart = imagesArray[0];
    this.plankMiddle = (imagesArray[1]) ? imagesArray[1] : this.plankStart;
    this.plankMiddleTwo = (imagesArray[2]) ? imagesArray[2] : this.plankMiddle;
    this.plankEnd = (imagesArray[3]) ? imagesArray[3] : this.plankMiddleTwo;
    
    this.startX = (startX)?0+startX:0;
    
    this.map = [];
  
    this.index = 0;
  
    //this.edgeFitOverlap = edgeFitOverlap;
  
    this.mapPlanks = function(drawAfter, timeBreak, callBack){
      this.map = [];
      
      this.maxRows = (maxRows || maxRows === 0) ? maxRows : Math.ceil($(window).width()/this.plankMiddle.width);
  
      this.maxColumns = Math.ceil($(window).height()/this.plankMiddle.height);
      
      this.addTo = 0;
      
      if(edgeFitOverlap){
        
        this.addTotal = this.maxColumns*this.plankMiddle.height - $(window).height()
        
        this.whichToAddTo = [];
          
        for(var i = 0; i < this.addTotal; i++){
          this.whichToAddTo.push(Math.floor(Math.random()*this.maxColumns));
        }
      }
      
      for(this.columns = 0; this.columns <= this.maxColumns; this.columns++){
        
        if(edgeFitOverlap){
          for(var i = 0; i < this.whichToAddTo.length; i++){
            if(this.whichToAddTo[i] == this.columns)this.addTo = this.addTo - 1;
          }
        }
        
        for(this.rows = 0; this.rows <= this.maxRows; this.rows++){
          
          if(this.rows === 0)this.map.push([
            this.plankStart,
            this.startX,
            this.plankMiddle.height * this.columns + this.addTo
          ]);
          
          else if(this.rows === this.maxRows)this.map.push([
            this.plankEnd,
            $(window).width() - (this.plankEnd.width+16),
            this.plankEnd.height * this.columns + this.addTo
          ]);
          
          
          else if(this.rows === this.maxRows-1)this.map.push([
            this.plankMiddle,
            $(window).width()-(this.plankEnd.width+16+this.plankMiddle.width),
            this.plankMiddle.height * this.columns + this.addTo
          ]);
          
          else this.map.push([
            chooseFrom([this.plankMiddle, this.plankMiddle, this.plankMiddle, this.plankMiddle, this.plankMiddleTwo]),
            20 + this.plankMiddle.width*(this.rows-1)+this.startX,
            this.plankMiddle.height * this.columns + this.addTo
          ]);
        }
      }
      
      if(drawAfter)this.drawPlanks(timeBreak, callBack);
    };
    
    this.mapPlanks();
    
    this.drawPlanks = function(timeBreak, callback){
      
      var element = this.map[this.index];
      //console.log(this.map);
      if(element)ctx.drawImage(element[0], element[1], element[2]);
      
      if(this.index < this.map.length-1){
        this.index++;
        if(timeBreak)setTimeout(this.drawPlanks.bind(this, timeBreak, callback), timeBreak);
        else this.drawPlanks(timeBreak, callback);
      }
      
      else{
        this.index = 0;
        if(callback)callback();
      }
    };
}

function placeContent() {
	if(contentPlaced){
		$('#rightSideBarOuter').show();
		$('#mainAreaOuter').show();
		return;
	}
	else if(!contentPlaced)contentPlaced = true;
	
	$('#canvasCan').prepend('<div id = rightSideBarOuter style = position:absolute;top:0px;left:0px;height:700px;width:175px; zindex = 2 > </div>');
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
				$('.animationNumber' + boxCounter).click(function(){ console.log('No function yet! :D');});
			}
		}
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

startScreen();
//startGame();


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
