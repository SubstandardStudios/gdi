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

var playButtonRect;

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

var characterSelectionScreen;

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
    if(this.mainLoop)this.mainLoop();
  }
  
  this.toggleOff = function(){//Kills loop, then calls cleanUpFunction.
    this.on = false;
    if(cleanUpFunction)cleanUpFunction();
  }
  
}

//ENDING OF GENERAL PURPOSE CLASSES




//Start Screen Code! --------------------------------------------------------------------------------------------
function drawPlayButton() {
  var height = ($(window).height()/13 > 50) ? $(window).height()/13 : 50;
  ctx.font = (height-8)+"px 'Aclonica'";
  
  var width = (ctx.measureText('START').width > roundToMaxOrMin($(window).width()/5, 250, 50)) ? ctx.measureText('START').width+8 : roundToMaxOrMin($(window).width()/5, 250, 50);
  //(ctx.measureText('START').width > (($(window).width()/5 > 150) ? ($(window).width()/5 < 300 ? )150)) ? ctx.measureText('START').width+8 : ($(window).width()/5 > 150) ? $(window).width()/5 : 150;
  
  playButtonRect = {
    x:$(window).width()/2-width/2,
    y:$(window).height()/2-height/2+height/3,
    width:width,
    height:height
  };
  
  counterForBox++;
  if(counterForBox > 10){colorForBox = !colorForBox;counterForBox = 0;}
  ctx.fillStyle = colorForBox ? colorOne : colorTwo;
  ctx.fillRect($(window).width()/2-width/2, $(window).height()/2-height/2+height/3, width, height);
  ctx.fillStyle = 'black';
  ctx.lineWidth = 4;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  ctx.fillText('START', $(window).width()/2, $(window).height()/2+height/2.5);

  ctx.beginPath();
  ctx.setLineDash([20,10]);
  ctx.lineDashOffset = -playButtonSet;
  ctx.strokeRect($(window).width()/2-width/2, $(window).height()/2-height/2+height/3, width, height);
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
  
  function makeNewMaps(){
    hideContent();
    placeContent();
    woodenBackground.alive = false;
    stonePillar.alive = false;
    woodenBackground.mapPlanks(true);
    stonePillar.mapPlanks(true);
  }
  
  //End of event listeners
  characterSelectionScreen = new toggleFunction(
    undefined,
    function(){      
      window.addEventListener('resize', makeNewMaps);
    },
    function(){
      window.removeEventListener('resize', makeNewMaps);
      hideContent();
    }
  );
  
  function cleanUp(){
    ctx.globalAlpha = 1;
    
    woodenBackground = new displayAcrossScreen([plankStart, plankMiddle, plankOddsAndEnds, plankEnd], undefined, undefined, true);
    stonePillar = new displayAcrossScreen([stoneTile], 0, 175);
    
    characterSelectionScreen.toggleOn();
    
    woodenBackground.drawPlanks(true, function(){
      stonePillar.drawPlanks(true, function(){
        placeContent();
      });
    });
  }
  
  function updateLoop(){
    playButtonSet++;
    if(playButtonSet > 210)playButtonSet = 0;
    //Passing around a huge number could cause lag, so we'll shorten it every once in a while.
    
    makeBackgroundScreen();
    titleScreenBubbles.drawMap();
    drawTitle();
    drawPlayButton();
    ctx.globalAlpha = .5;
    /* //The following code is for making sure that everything is centered correctly. Essentially, it's living proof of my OCD.
    ctx.beginPath();
    ctx.moveTo($(window).width()/2,0);
    ctx.lineTo($(window).width()/2, $(window).height());
    ctx.stroke();
    */
  }
  
  var startScreenUpdate = new toggleFunction(updateLoop, undefined, cleanUp, [true, 30]);
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
      
      if(Math.floor(Math.random()*100) === 1)titleScreenBubbles.glideTo(index, Math.floor(Math.random()*$(window).width()), Math.floor(Math.random()*$(window).height()));
      if(Math.floor(Math.random()*2000) === 1)element[3] = (element[3] === colorOne) ? colorTwo : colorOne;
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
    var height = ($(window).height()/8 > 100) ? $(window).height()/8 : 100;
	ctx.font = "bold " + height + "px 'Aclonica'";
    ctx.textBaseline = 'bottom';
	ctx.textAlign = 'center';
	ctx.fillText('GDI', $(window).width()/2, $(window).height()/2-height/10);
	//End Title
}

//END OF START SCREEN CODE ----------------------------------------------------------------------------------------------------------



//START OF CHARACTER SELECTION SCREEN CODE!------------------------------------------------------------------------------------------

//Variables associated with this section of code

var contentPlaced = false;
var waveCount = 0;

var callBackCount = 0;

var boxCounter = 0;



function displayAcrossScreen(imagesArray, maxRows, startX, edgeFitOverlap) {
  
    this.alive = true;
  
    this.plankStart = imagesArray[0];
    this.plankMiddle = (imagesArray[1]) ? imagesArray[1] : this.plankStart;
    this.plankMiddleTwo = (imagesArray[2]) ? imagesArray[2] : this.plankMiddle;
    this.plankEnd = (imagesArray[3]) ? imagesArray[3] : this.plankMiddleTwo;
    
    this.startX = (startX)?0+startX:0;
    
    this.map = [];
  
    //this.edgeFitOverlap = edgeFitOverlap;
  
    this.mapPlanks = function(drawAfter, timeBreak, callBack){
      
      this.map = [];
      
      this.maxRows = (maxRows || maxRows === 0) ? maxRows : Math.ceil($(window).width()/this.plankMiddle.width);
      this.maxColumns = Math.ceil($(window).height()/this.plankMiddle.height);
      
      this.originalScreenDimensions = [$(window).width(), $(window).height()];
      
      this.addTo = 0;
      
      this.index = 0;
      
      this.waitBuffer = 0;
      
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
      this.alive = true;
      if(drawAfter)this.drawPlanks(timeBreak, callBack);
    };
    
    this.mapPlanks();
    
    this.drawPlanks = function(timeBreak, callback){
      if(!this.alive){
        if(callback)callback();
        return;
      }
      
      var element = this.map[this.index];
      if(element)ctx.drawImage(element[0], element[1], element[2]);
      
      if(this.index < this.map.length-1){
        this.index++;
        
        if(timeBreak){
          this.waitBuffer = this.waitBuffer + 1;
          
          if(this.waitBuffer >= this.maxRows*this.maxColumns/100){
            this.waitBuffer = 0;
            setTimeout(this.drawPlanks.bind(this, timeBreak, callback), 1);
          }
          else this.drawPlanks(timeBreak, callback);
        }
        else this.drawPlanks(timeBreak, callback);
      }
      
      else{
        this.alive=false;
        this.index = 0;
        if(callback)callback();
      }
    };
}

function DarkWaves(callback){//Dark Wave!

  function advancingTriangle(whereToGo, rbgValuez, clear){
    ctx.fillStyle = rbgValuez;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, whereToGo*($(window).height()/12));
    ctx.lineTo(whereToGo*($(window).width()/12), 0);
    if(!clear)ctx.fill();
    else {
      ctx.save();
      ctx.clip();
      ctx.clearRect(0, 0, cnv.width, cnv.height);
      ctx.restore();
    }
  }

  if(waveCount === 0)hideContent();

  if(waveCount < 30)advancingTriangle(waveCount, 'rgb(0, 0, 0)');
  if(waveCount > 15 && waveCount < 45)advancingTriangle(waveCount - 15, 'rgb(40, 40, 40)');
  if(waveCount > 30 && waveCount < 60)advancingTriangle(waveCount - 30, 'rgb(80, 80, 80)');
  if(waveCount > 45 && waveCount < 75)advancingTriangle(waveCount - 45, 'rgb(120, 120, 120)');
  if(waveCount > 60 && waveCount < 90)advancingTriangle(waveCount - 60, 'rgb(160, 160, 160)');
  if(waveCount > 75 && waveCount < 105)advancingTriangle(waveCount - 75, 'rgb(200, 200, 200)');
  if(waveCount > 90 && waveCount < 120)advancingTriangle(waveCount - 90, 'rgb(240, 240, 240)', true);

  waveCount = waveCount+5;

  if(waveCount > 120)waveCount = 0;

  if(waveCount !== 0)setTimeout(function(){DarkWaves(callback);}, 50);
  else if(callback)callback();
}

var animationTitles = [
  'Dark Waves Transition',
  'Yzy Bow Firing',
  'Sparkle',
  'Magic Orb',
  "Don't Press!"
];

var animationCode = [
  function(){
    if(!(typeof magicalOrb == "undefined"))magicalOrb.alive = false;
    characterSelectionScreen.toggleOff();
    DarkWaves(
      function(){
        characterSelectionScreen.toggleOn();
        
        woodenBackground.mapPlanks();
        stonePillar.mapPlanks();
        
        woodenBackground.drawPlanks(true, function(){
          stonePillar.drawPlanks(true, function(){
            placeContent();
            $('#animationTest').click();
          });
        });
      }
    );
  },
	
  function(){//Fire down upon them!
    console.log('My tongue is sharp, but my arrow is sharper!');
  },
	
  function(){//Sparkle: a somewhat feminine, useful nonetheless, particle effect!
    console.log('Twinkle twinkle little star!');
  },
  
  function(){
    if(typeof magicalOrb == "undefined"){
      magicalOrb = new effect('magical orb');
      magicalOrb.frequencyOfColorChange = 1;
      magicalOrb.speed = 10;
      magicalOrb.maxSize = 25;
      magicalOrb.minSize = 15;
      magicalOrb.size = 1;
      orbUpdateLoop();
      
      $('#canvasCan').mouseover(
        function(event){
          var rect = cnv.getBoundingClientRect();
          magicalOrb.glideX = event.clientX - rect.left;
          magicalOrb.glideY = event.clientY - rect.top;
          magicalOrb.isGliding = true;
        }
      );
    }
    else {
      magicalOrb.alive = !magicalOrb.alive;
      
      if(magicalOrb.alive){
        orbUpdateLoop();
        $('#canvasCan').mouseover(
          function(event){
            var rect = cnv.getBoundingClientRect();
            magicalOrb.glideX = event.clientX - rect.left;
            magicalOrb.glideY = event.clientY - rect.top;
            magicalOrb.isGliding = true;
          }
        );
      }
    }
    
    function orbUpdateLoop(){
      if(!magicalOrb.alive){
        ctx.globalAlpha = 1;
        stonePillar.alive = true;
        woodenBackground.alive = true;
        woodenBackground.drawPlanks();
        stonePillar.drawPlanks();
        
        $('#canvasCan').off("mouseover");
        return;
      }
      
      ctx.globalAlpha = .5;
      stonePillar.alive = true;
      woodenBackground.alive = true;
      woodenBackground.drawPlanks();
      ctx.globalAlpha = 1;
      stonePillar.drawPlanks();
      
      magicalOrb.degreeOfWobble = magicalOrb.size*1.25;
      magicalOrb.speed = magicalOrb.size*1.75;
      magicalOrb.alphaTransparency = (0.01 * magicalOrb.size*1.5)+0.15;
      magicalOrb.draw();
      
      setTimeout(orbUpdateLoop, magicalOrb.updateRate);
    }
  }
];

function hideContent(){//Clear screen!
	$('#leftSideBar').remove();
	$('#mainArea').remove();
}

function placeContent(){
  
  //Starting the setting up of things
  
  //First, we'll remove already existing content, if any.
  hideContent();
  
  //These make some divs that essentially section off the screen.
  
  $('#canvasCan').append('<div id = leftSideBar style = position:absolute;top:0px;left:0px;height:100%;width:175px; zindex = 2 > </div>');
    $('#leftSideBar').append('<hr style = margin-top:8px;width:90%; id = thinHr>');
  $('#canvasCan').append('<div id = mainArea style = position:absolute;top:0px;left:222px;height:100%;width:' + (100 - 100*(222/$(window).width())) + '%; zindex = 2 ></div>');
  
  //Finished the setting up of screen sectioning.
  
  //Upcoming are functions that we use to stick things in these sectioned off divs.
  
  function addLeftBox(title, id, content, onClick){
    $('#leftSideBar').append('<div style = padding-right:4px;margin-top:4px; zindex = 2 id = ' + id + ' class = characterBox></div>');
      $('#'+id).append('<p id = characterSubTitle>' + title + '</p>');
      $('#'+id).hover(
        function(){
          $('#'+id).append('<hr id = thinHr>');
          $('#'+id).append('<p style = text-align:center;margin-top:0px; id = characterSubText>' + content + '</p>');
        },
        function(){
          $('#'+id).empty();
          $('#'+id).append('<p id = characterSubTitle>' + title + '</p>');
        }
      );
      if(onClick)$('#'+id).click(onClick);
    
    $('#leftSideBar').append('<hr style = margin-top:8px;width:90%; id = thinHr>');
  }
  
  function addMainArea(areaID, title){
    $('#mainArea').empty();
    $('#mainArea').append('<div id = ' + areaID + 'MainArea style = margin:auto;width:95%;height:95%;padding:5px;></div>');
    $('#' + areaID + 'MainArea').append('<div id = ' + areaID + 'TitleBar class = titleBox><h3 style = text-align:center;font-size:45px;margin-top:5px;margin-bottom:5px;>' + title + '</h3></div>');
  }
  
  //Finished the functions for sticking things in sectioned off divs.
  
  //Finished setting things up.
  
  
  
  
  addLeftBox('Quick Test', 'testBox', 'Test the Graphical Deity Interface', function(){
    DarkWaves(startGame);
  });
  
  
  addLeftBox('New Mortal', 'mortalMaker', "These will be quite useful...", function(){
    var group = 'empyrean guild';//We'll add in other races/groups once we have models for 'em.
    var gender = 'male';//Prolly gonna need a different playermodel for female...
    var race = raceFromGroup(group);
    var profession = chooseFrom(['mage', 'rogue', 'warrior']);//Add craftsman, bard, baker, and...
    
    if(typeof race == 'object'){
      var mortalName = nameFromRace(race[1]).split(/[ ]+/);
      race = race[0];
    }
    
    else var mortalName = nameFromRace(race).split(/[ ]+/);
    
    var body = {
      limbs:modifiersForPart('limbs', race, group, profession, mortalName, 'male'),
      face:modifiersForPart('face', race, group, profession, mortalName, 'male'),
      torso:modifiersForPart('torso', race, group, profession, mortalName, 'male')
    }
    
    
    addMainArea('mortalMaker', mortalName[0] + ' ' + mortalName[1]);
    $('#mortalMakerTitleBar').append('<h3 style = position:absolute;top:20px;right:5%;>' + profession.capitalize() + '</h3>');
    $('#mortalMakerMainArea').append('<hr id = thickishHr>');
    
    $('#mortalMakerMainArea').append('<div id = firstRowBox style = overflow-y:hidden;overflow-x:scroll;height:365px;width:100%;></div>');
    
    
    
    $('#firstRowBox').append('<div id = fullResCharacterBox></div>');
    
    $('#fullResCharacterBox').append('<h2 style = margin:0px;text-align:center;float:none;> Visual </h2>');
    $('#fullResCharacterBox').append('<hr id = thinHr>');
    
    $('#fullResCharacterBox').append('<div id = divOfLoading></div>');
      $('#divOfLoading').append('<h3 style = position:absolute;top:115px;left:30%>Loading</div>');
      $('#divOfLoading').append('<h4 style = position:absolute;top:125px;left:38% id = counterOfLoading>0/112</div>');
    
    $('#fullResCharacterBox').append('<hr id = thinHr style = position:absolute;bottom:25px;left:3%;width:93%;>');
    $('#fullResCharacterBox').append('<h3 style = position:absolute;bottom:5px;left:7%;> Representation </h3>');
    
    var statsAndStoryBoxWidth = $('#firstRowBox').width() - 225;
    
    var statsBoxIndex = 0;
    var statsBoxTitles = ['Description', 'Skills', 'Stats'];
    var statsBoxCode = [
      function(){
        for (var element in body){
          $('#statsAndStoryLeftDiv').append('<div id = ' + element + 'Box class = borderedBoxThin style = padding-top:2px;margin-bottom:10px;>' + element.capitalize() + '</div>');
          $('#statsAndStoryLeftDiv').append('<hr id = thinHr style = margin-bottom:10px;>');
          $('#statsAndStoryRightDiv').append('<p>' + body[element][2] + '</p>');
          
          $('#' + element + 'Box').click(function(){
            var element = this.id.slice(0, this.id.length-3);
            $('#statsAndStoryRightDiv').empty();
            $('#statsAndStoryRightDiv').append('<p>' + body[element][2] + '</p>');
            $('#statsAndStoryRightDiv').append('<hr id = thinHr>');
            $('#statsAndStoryRightDiv').append('<p>' + mortalName[0] + " draws the following from his " + body[element][0] + ' ' + (element == 'face' ? 'features' : element) + ' and related experiences:</p>');
            for (var attribute in body[element][1]){
              $('#statsAndStoryRightDiv').append('<p>' + (body[element][1][attribute] < 0 ? body[element][1][attribute]*-1 : body[element][1][attribute]) + ' levels ' + (body[element][1][attribute] < 0 ? 'lower' : 'higher') + ' ' + attribute.replace(/([A-Z])/g, ' $1').trim().capitalize() + '</p>');
            }
          });
        }
        $('#statsAndStoryLeftDiv').prepend('<hr id = thinHr style = margin-bottom:10px;>');
        $('#statsAndStoryLeftDiv').prepend('<div id = ' + 'story' + 'Box class = borderedBoxThin style = padding-top:2px;margin-bottom:10px;>' + 'Story' + '</div>');
        $('#storyBox').click(function(){
          $('#statsAndStoryRightDiv').empty();
          for (var element in body){
            $('#statsAndStoryRightDiv').append('<p>' + body[element][2] + '</p>');
          }
        });
        
        $('#statsAndStoryLeftDiv').children().last().remove();
        $('#statsAndStoryLeftDiv').children().first().css('margin-top', '5px');
        $('#statsAndStoryLeftDiv').children().first().click();
      },
      
      function(){
        console.log('Skills');
      },
      
      function(){
        console.log('Stats');
      }
    ]
    
    function changeStatsBoxContent(direction){
      $('#statsAndStoryLeftDiv').empty();
      $('#statsAndStoryRightDiv').empty();
      
      statsBoxIndex = statsBoxIndex + direction;
      if(statsBoxIndex < 0)statsBoxIndex = statsBoxTitles.length - 1;
      if(statsBoxIndex > statsBoxTitles.length - 1)statsBoxIndex = 0;
      $('#statsAndStoryTitleDiv').empty();
      $('#statsAndStoryTitleDiv').append(statsBoxTitles[statsBoxIndex]);
      statsBoxCode[statsBoxIndex].call();
      
      $('#leftyStoryButton').empty();
      $('#leftyStoryButton').append('<- ' + statsBoxTitles[circularArray(statsBoxTitles, -1, statsBoxIndex)]);
      $('#leftyStoryButton').css('width', '125px');
      $('#rightStoryButton').empty();
      $('#rightStoryButton').append(statsBoxTitles[circularArray(statsBoxTitles, 1, statsBoxIndex)] + ' ->');
      $('#rightStoryButton').css('width', '125px');
    }
    
    $('#firstRowBox').append('<div class = borderedBox id = statsAndStoryBox style = position:relative;text-align:center;margin-top:25px;float:right;width:' + statsAndStoryBoxWidth + 'px;height:305px;></div>');
    $('#statsAndStoryBox').append('<div id = statsAndStoryTitleDiv style = font-weight:bold;margin-top:4px;display:inline-block;font-size:25px;></div>');
    $('#statsAndStoryBox').append('<hr id = thinHr style = width:97.5%;position:absolute;top:35px;left:1%;>');
    $('#statsAndStoryBox').append('<div class = genericButton id = leftyStoryButton style = position:absolute;left:10px;top:5px;> <- </div>');
    $('#statsAndStoryBox').append('<div class = genericButton id = rightStoryButton style = position:absolute;right:10px;top:5px;> -> </div>');
    $('#statsAndStoryBox').append('<div id = statsAndStoryLeftDiv></div>');
    var rightSideWidth = $('#statsAndStoryBox').width()-115;
    var rightSideHeight = $('#statsAndStoryBox').height()-50;
    $('#statsAndStoryBox').append('<div id = statsAndStoryRightDiv style = width:' + rightSideWidth + 'px;height:' + rightSideHeight + 'px;></div>');
    changeStatsBoxContent(0);
    
    $('#leftyStoryButton').click(function(){
      changeStatsBoxContent(-1);
    });

    $('#rightStoryButton').click(function(){
      changeStatsBoxContent(1);
    });
    //Image loading script:
    
    var imagesInAnArray = [];
    var folder = 'imgs/spritesAndArmor/fullResSprites/humanStandard/';
    var counter = 0;
    
    for(var i = 0; i < 8; i++){
      imagesInAnArray.push([]);
      for(var i2 = 0; i2 < 14; i2++){
        imagesInAnArray[i].push(new Image());
        
        imagesInAnArray[i][i2].onload = function(){
          counter = counter + 1;
          
          $('#counterOfLoading').text(counter+'/112');
          
          if(counter === imagesInAnArray.length*14){
            
            $('#divOfLoading').empty();
            
            function changeSide(rightOrLeft){
              
              stonePillar.alive = true;
              woodenBackground.alive = true;
              woodenBackground.drawPlanks();
              stonePillar.drawPlanks();
              
              directionOfCharacter = directionOfCharacter + rightOrLeft;
              if(directionOfCharacter > 7)directionOfCharacter = 0;
              if(directionOfCharacter < 0)directionOfCharacter = 7;
              
              imagesInAnArray[directionOfCharacter].forEach(function(element){
                var position = $('#fullResCharacterBox').offset();
                ctx.drawImage(element, position.left + 23.5, position.top + 17);
              });
            }
            
            var directionOfCharacter = 0;
            changeSide(0);
            
            $('#fullResCharacterBox').append('<div class = genericButton id = leftyButtonBox style = position:absolute;left:10px;top:5px;> <- </div>');
            $('#fullResCharacterBox').append('<div class = genericButton id = rightButtonBox style = position:absolute;right:10px;top:5px;> -> </div>');
            
            $('#leftyButtonBox').click(function(){
              changeSide(-1);
            });
            
            $('#rightButtonBox').click(function(){
              changeSide(1);
            });
          }
        };
        
        imagesInAnArray[i][i2].src = folder + i + '/' + i2 + '.png';
      }
    }
    // End of image loading.
  });
  
  
  addLeftBox('Animations', 'animationTest', 'View animations used in GDI', function(){
    addMainArea('animation', 'Animation');
    
    //$('#animationMainArea').append('<div id = animationBoxesArea style = height:100%;width:95%;margin:auto;></div>');
    
    var numberOfBoxes = animationTitles.length;
    
    var columns = 0;
    var maxColumns = Math.floor($('#animationMainArea').width()/150);
    
    var leftOverAmount = $('#mainArea').width() - (maxColumns)*150;
    
    var numberOfFullRows = Math.floor(animationTitles.length/maxColumns);
    
    var addThisMuch = Math.round((maxColumns-animationTitles.length%maxColumns)/2);
    
    for(columns = 0; columns < maxColumns; columns++){
      $('#animationMainArea').append('<div style = position:absolute;overflow:hidden;width:131px;height:100%;top:115px;left:'+(leftOverAmount/2+150*columns)+'px; id = animationColumn' + columns + '></div>');
    }
    
    animationTitles.forEach(
      function(element, index){
        var goToColumn = ((index+1)/maxColumns > numberOfFullRows) ? index%maxColumns+addThisMuch : index%maxColumns;
        $('#animationColumn'+goToColumn).append('<div class=animationBox id = animationNumber' + index + '>'+ animationTitles[index] + '</div>');
        if(animationCode[index])$('#animationNumber'+index).click(animationCode[index]);
      }
    );
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
