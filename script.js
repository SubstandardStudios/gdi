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
var playButtonRect = {x:$(window).width()/2-75,y:$(window).height()/2+12,width:150,height:50};
var playButtonBoolean = true;
var titleScreenBubbles = new bubbles();
//End of start screen variables

//End of variable dictionary




//Start Screen Code! --------------------------------------------------------------------------------------------
function drawPlayButton() {
	counterForBox++;
	if(counterForBox > 10){colorForBox = !colorForBox;counterForBox = 0;}
	ctx.fillStyle = colorForBox ? 'Peru' : 'DarkGrey';
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
  
  window.addEventListener('resize', function(){
    var gameCanvas = document.getElementById("gameCanvas");
    gameCanvas.width = $(window).width();
    gameCanvas.height = $(window).height()-15;
  });
  
  window.addEventListener('resize', titleScreenBubbles.makeMap)
}

function makeBackgroundScreen(){
  //Background tile beginning
  for(var green = 0;green < ($(window).width() - $(window).width() % 20)/20+1;green++){
    for(var red = 0;red < ($(window).height() - $(window).height() % 20)/20+1;red++){
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
}

function bubbles(){
  
  this.makeMap = function(){
    
    this.map = []
    
    var bubbleCount = $(window).height() * $(window).width() / 15000;//Amount of bubbles
    
    for(var bubbles = 0;bubbles < bubbleCount;bubbles++){
      var circleX = Math.floor(Math.random() * $(window).width());
      var circleY = Math.floor(Math.random() * $(window).height());
    
      var bubbleLoops = Math.floor(Math.random() * 25) + 10; //This decides how many times this bubble should be looped, which dictates how big it is.
      
      var color = chooseFrom(['peru', 'DarkGrey']);
      
      var alphaLevel = (45-bubbleLoops)*0.005;
      
      this.map.push([circleX, circleY, bubbleLoops, color, alphaLevel]);
    }
  }
  
  this.drawMap = function(){
    
    this.map.forEach(function(element){
      
      ctx.fillStyle = element[3];
      
      for(var bubbleLoop = 0; bubbleLoop < element[2]; bubbleLoop++){
        ctx.globalAlpha = element[4];//How clear the bubbles get
        ctx.beginPath();
        ctx.arc(element[0] + Math.floor(Math.random()*(element[2]/1.75)), element[1] + Math.floor(Math.random()*(element[2]/1.75)), 2 + 2 * bubbleLoop, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
      }
      
      
    })
  }
  /*
  //If you can begin, then 'i' just need to push the 'g' over the 'n', and then it's brought into being!
  //Bubble code start
  var bubbleCount = $(window).height() * $(window).width() / 15000;//Amount of bubbles
  ctx.globalAlpha = 0.15;//How clear the bubbles get
  
  for(var bubbles = 0;bubbles < bubbleCount;bubbles++){
    var circleX = Math.floor(Math.random() * $(window).width());
    var circleY = Math.floor(Math.random() * $(window).height());
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
  */
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
    makeBackgroundScreen();
    titleScreenBubbles.drawMap();
    drawTitle();
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

startScreen();
startUpdate();
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
