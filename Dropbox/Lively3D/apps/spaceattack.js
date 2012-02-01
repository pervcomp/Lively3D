var Spaceattack = function(){
  var debug = false;
  var soundsOn = true;
  var backgroundOn = true;
  
  var intervalId = 0;
  var CanvasXSize = 800;
  var CanvasYSize = 400;
  
  //Create Canvas Element
  var canvas = document.createElement("canvas");
  canvas.setAttribute('width', CanvasXSize);
  canvas.setAttribute('height', CanvasYSize);
  //document.body.appendChild(canvas);
  ctx = canvas.getContext('2d');
  
  var audioSrc = [];
  var grafSrc = [];
  var Audio = { "BG1":0, "BG2":1, "DESTROY1":2, "DESTROY2":3,
    "EM1":4, "EM2":5, "GO1":6, "GO2":7, "SHOOT1":8, "SHOOT2":9,
    "SPEED1":10, "SPEED2":11 };
  var Graf = { "BG":0, "ENEMY":1, "AMMO":2, "SHIP":3, "START":4 };
  
  //Sound variables
  var music;
  var shoot;
  var destroy;
  var speedup;
  var gameover;
  var emergency;
  
  //Graphics
  var backgroundImg;
  var spaceShipImg;
  var enemyShipImg;
  var ammoImg;
  var startscreenImg;
  
  //Taustakuvan scrollaamiseen liittyv‰t muuttujat
  const FPS = 30;
  const SECONDSBETWEENFRAMES = 1/FPS;
  var speed = 20; //Pelin piirtonopeus millisekunteina
  var scale = 1.05; //Taustakuvan skaalaus
  var y = -4.5; //vertical offset
  var dx = 2;
  var imgW;
  var imgH;

  var x = 0;
  var clearX;
  var clearY;
  

  //Sankarin aluksen sijainti ja koko
  var spaceShip_Y;
  var spaceShip_X;
  var spaceShip_width;
  var spaceShip_height;

  //Pelaajan el‰m‰t
  var health = 5;
  var score = 0;
  var scorelist = new Array();
  const SCOREAMOUNT = 5;
  var speedCounter = 0;

  //Ammustaulukko. Jokainen ammus sis‰lt‰‰ x- ja y-koordinaatin, sek‰
  //tiedon siit‰, onko ammus ammuttu vai ei.
  var ammoArray = new Array();
  //Ajastin, joka rajoittaa ammusten laukaisun v‰list‰ aikaa.
  var ammoTimer = 0;
  //Ammusten koko
  var ammo_width;
  var ammo_height;
  var hitboxOffset;

  //Vihollistaulukko. Jokainen vihollinen sis‰lt‰‰ x- ja y-koordinaatin.
  var enemyArray = new Array();
  //Vihollisen koko
  var enemyShip_width;
  var enemyShip_height;

  var lastEnemyPosition;
  var enemySpeed;
  var sineWave;
  var currentTime;

  //Vihollisten ilmestymiseen liittyvi‰ muuttujia
  var enemyAppearMin = 0/(SECONDSBETWEENFRAMES*1000);
  var enemyAppearMax = 5000/(SECONDSBETWEENFRAMES*1000);
  var timeTillEnemyAppear = 100;

  //Keyboard control variables
  var upDown = false;
  var downDown = false;
  var leftDown = false;
  var rightDown = false;
  var spaceDown = false;
  var pelitilat = {"peliKaynnissa" : 0, "peliStop" : 1, "alkuRuutu" : 2, "gameOver" : 3 };
  var pelinTila = pelitilat.alkuRuutu;



  //LISƒINIT PELIN EKAA KƒYNNISTYSKERTAA VARTEN
  //-------------------------------------------
  var initScene = function() {
    //INITIALIZE SOUNDS
    music = document.createElement('audio');
    music.setAttribute('src', audioSrc[Audio.BG1]);
    music.setAttribute('src', audioSrc[Audio.BG2]);
    music.addEventListener('ended',
    function() {
      this.currentTime = 0;
    }, false );
    
    shoot = document.createElement('audio');
    shoot.setAttribute('src', audioSrc[Audio.SHOOT1]);
    shoot.setAttribute('src', audioSrc[Audio.SHOOT2]);
    
    destroy = document.createElement('audio');
    destroy.setAttribute('src', audioSrc[Audio.DESTROY1]);
    destroy.setAttribute('src', audioSrc[Audio.DESTROY2]);
    
    speedup = document.createElement('audio');
    speedup.setAttribute('src', audioSrc[Audio.SPEED1]);
    speedup.setAttribute('src', audioSrc[Audio.SPEED2]);
    
    gameover = document.createElement('audio');
    gameover.setAttribute('src', audioSrc[Audio.GO1]);
    gameover.setAttribute('src', audioSrc[Audio.GO2]);  
    
    emergency = document.createElement('audio');
    emergency.setAttribute('src', audioSrc[Audio.EM1]);
    emergency.setAttribute('src', audioSrc[Audio.EM2]);
    
    //INITIALIZE IMAGES
    backgroundImg = new Image();
	backgroundImg.crossOrigin = "";
    backgroundImg.src = grafSrc[Graf.BG];
    spaceShipImg = new Image();
	spaceShipImg.crossOrigin = "";
    spaceShipImg.src = grafSrc[Graf.SHIP];
    enemyShipImg = new Image();
	enemyShipImg.crossOrigin = "";
    enemyShipImg.src = grafSrc[Graf.ENEMY];
    ammoImg = new Image();
	ammoImg.crossOrigin = "";
    ammoImg.src = grafSrc[Graf.AMMO];
    
    //Ladataan aloituskuva ja piirret‰‰n se kun kuva on latautunut
    startscreenImg = new Image();
	startscreenImg.crossOrigin = "";
    startscreenImg.onload = function(){
      drawStartscreen();
    }
    startscreenImg.src = grafSrc[Graf.START];

    
    //Alustetaan taustakuvan scrollaukseen liittyv‰t muuttujat
    dx = 2;
    x = 0;
    imgW = backgroundImg.width*scale;
    imgH = backgroundImg.height*scale;

    //Haedaan hiscore-listan tulokset localstoragen muistista
    for( var i = 0; i < SCOREAMOUNT; ++i )
    {
      if( localStorage["SPACESHOOTER_score"+i] != undefined )
      {
        scorelist.push( parseInt(localStorage["SPACESHOOTER_score"+i]) );
      }
    }
  
  }


  var drawStartscreen = function() {
    ctx.drawImage( startscreenImg, 0, 0, CanvasXSize, CanvasYSize );
  }

  var init = function() {
    //Alustetaan taustakuvan scrollaamiseen liittyvi‰ muuttujia
    dx = 2;
    x = 0;
    imgW = backgroundImg.width*scale;
    imgH = backgroundImg.height*scale;
    if (imgW > CanvasXSize) { x = CanvasXSize-imgW; } // image larger than canvas
    if (imgW > CanvasXSize) { clearX = imgW; } // image larger than canvas
    else { clearX = CanvasXSize; }
    if (imgH > CanvasYSize) { clearY = imgH; } // image larger than canvas
    else { clearY = CanvasYSize; }
    
    spaceShip_width = spaceShipImg.width;
    spaceShip_height = spaceShipImg.height;
    spaceShip_Y = (CanvasYSize/2) - (spaceShip_height/2);
    spaceShip_X = 10;

    enemyShip_width = enemyShipImg.width;
    enemyShip_height = enemyShipImg.height;
    
    lastEnemyPosition = 0;
    enemySpeed = 1;
    sineWave = 0;
    currentTime = 0;
    enemyAppearMax = 5000/(SECONDSBETWEENFRAMES*1000);

    ammoTimer = 0;
    ammo_width = ammoImg.width;
    ammo_height = ammoImg.height;
    hitboxOffset = 5;
    
    enemyArray.length = 0;
    ammoArray.length = 0;
    
    //Nollataan pisteet ja palautetaan el‰m‰t
    health = 5;
    score = 0;
    speedCounter = 0;
    
    upDown = false;
    downDown = false;
    spaceDown = false;
    
    initAmmo();
    
    //Aloitetaan taustamusiikin soittaminen
    music.play();
    
    //Set Refresh Rate
    intervalId = setInterval(draw, SECONDSBETWEENFRAMES*1000);
  }

  var initAmmo = function() {
    for( var i = 0; i < 5; ++i )
    {
      ammoArray.push( {x: 0, y: 0, ammuttu: false} );
    }
  }

  //Asetetaan n‰pp‰inmuuttujat oikeaan tilaan sen perusteella, mit‰ painettiin
  var onKeyDown = function(evt) {
    
    //Enterin toiminta
    if( evt.keyCode == 13 &&
        ( pelinTila == pelitilat.gameOver || pelinTila == pelitilat.alkuRuutu ) )
    {
      pelinTila = pelitilat.peliKaynnissa;
      init();
    }
    
    //Pausen toiminta
    if( evt.keyCode == 80 && pelinTila == pelitilat.peliKaynnissa )
    {
      //Peli pauselle
      pelinTila = pelitilat.peliStop;
      clearInterval( intervalId );
      
      ctx.font = "bold 24pt cursive";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "yellow";
      ctx.fillText("Pause", CanvasXSize/2, CanvasYSize/2);
    }
    else if( evt.keyCode == 80 && pelinTila == pelitilat.peliStop )
    {
      //Peli takaisin k‰yntiin
      pelinTila = pelitilat.peliKaynnissa;
      intervalId = setInterval(draw, SECONDSBETWEENFRAMES*1000);
    }
    
    //Muten toiminta
    if( evt.keyCode == 77 && soundsOn == true && (pelinTila == pelitilat.peliKaynnissa
        || pelinTila == pelitilat.peliStop) )
    {
      music.pause()
      soundsOn = false;
    }
    else if( evt.keyCode == 77 && soundsOn == false && (pelinTila == pelitilat.peliKaynnissa
            || pelinTila == pelitilat.peliStop) )
    {
      music.play()
      soundsOn = true;
    }
    
    //Tausta-animaatio on/off
    if( evt.keyCode == 78 && backgroundOn == true )
    {
      backgroundOn = false;
    }
    else if( evt.keyCode == 78 && backgroundOn == false )
    {
      backgroundOn = true;
    }
    
    if (evt.keyCode == 38) upDown = true;
    if (evt.keyCode == 40) downDown = true;
    if (evt.keyCode == 37) leftDown = true;
    if (evt.keyCode == 39) rightDown = true;
    if (evt.keyCode == 32) spaceDown = true;
  }

  //Vapautetaan n‰pp‰inmuuttujat sen perusteella, mik‰ n‰pp‰in p‰‰stettiin ylˆs
  var onKeyUp = function(evt) {
    if (evt.keyCode == 38) upDown = false;
    if (evt.keyCode == 40) downDown = false;
    if (evt.keyCode == 37) leftDown = false;
    if (evt.keyCode == 39) rightDown = false;
    if (evt.keyCode == 32 ) spaceDown = false;
  }

  $(document).keydown(onKeyDown);
  $(document).keyup(onKeyUp);
   
   
  var draw = function() {
    //Clear Canvas
    ctx.clearRect(0,0,clearX,clearY);
    
    currentTime += 0.02;
    sineWave = Math.sin(currentTime) / 2;

    //Tulostellaan scrollaava taustakuva
    if( backgroundOn ){ drawBackground(); }
    
    //Piirret‰‰n pelaajan taistelualus (pilottina TAISTELU-JASKA)
    drawSpaceship();
    
    //Suoritetaan ammuksien ja vihollisten toiminnot
    ammoAction();
    enemyAction();
    
    //Piirret‰‰n ammukset ja viholliset
    drawAmmo();
    drawEnemies();
    
    //Tarkistetaan osuiko ammus viholliseen?
    checkAmmoHits();
    
    //P‰ivitet‰‰n pistetiedot ja el‰m‰t
    drawCurrentStatus();
    
    //Pelin loppuehtojen tarkistelu
    checkEndingClauses();
    
  }
  
  var drawBackground = function() {
    //reset, start from beginning
    if (x < (-imgW)) { x = 0; }
    //draw aditional image
    if (x < (-imgW+CanvasXSize)) { ctx.drawImage(backgroundImg,x+imgW-1,y,imgW,imgH); }
    
    //draw image
    ctx.drawImage(backgroundImg,x,y,imgW,imgH);
    
    //amount to move
    x -= dx;
  }

  var drawSpaceship = function() {
    //Move the space ship if up/down/left/right is currently pressed
    if (upDown && (spaceShip_Y - 5 >= 0 ) )
    {
      spaceShip_Y -= 5;
    }
    if (downDown && ( spaceShip_Y + spaceShip_height <= CanvasYSize ))
    {
      spaceShip_Y += 5;
    }
    if (leftDown && spaceShip_X - 5 >= 0 ) {
      spaceShip_X -= 5;
    }
    if (rightDown && spaceShip_X + 5 <= CanvasXSize/2 ) {
      spaceShip_X += 5;
    }
    
    if(debug){
    ctx.beginPath();
    ctx.fillStyle = "green";
    ctx.fillRect( spaceShip_X+25, spaceShip_Y+10, spaceShip_width-25, spaceShip_height-20 );
    }
   
    ctx.drawImage( spaceShipImg, spaceShip_X, spaceShip_Y, spaceShip_width, spaceShip_height );
  }


  var drawAmmo = function() {
    for( var i = 0; i < ammoArray.length; ++i )
    {
      if( ammoArray[i].ammuttu == true )
      {
        if(debug){
        ctx.fillStyle = "yellow";
        ctx.fillRect( ammoArray[i].x, ammoArray[i].y+hitboxOffset , ammo_width, ammo_height-2*hitboxOffset  );
        }
        ctx.drawImage( ammoImg, ammoArray[i].x, ammoArray[i].y, ammo_width, ammo_height );
      }
    }
  }


  var drawEnemies = function() {
    for( var i = 0; i < enemyArray.length; ++i )
    {
      if(debug){
      ctx.fillStyle = "red";
      ctx.fillRect( enemyArray[i].x+(enemyShip_width/2), enemyArray[i].y, enemyShip_width/2, enemyShip_height );
      }
      ctx.drawImage( enemyShipImg, enemyArray[i].x, enemyArray[i].y, enemyShip_width, enemyShip_height );
    }
  }


  var ammoAction = function() {
    //Jos on painettu space ja ammustimeri nollassa
    //(ei se ase ‰‰rettˆm‰n nopeasti voi laukoa)
    if( spaceDown && ammoTimer == 0 )
    {
      ammoTimer = 20;
      //Katsotaan onko ampumattomia ammuksia
      for( var i = 0; i < ammoArray.length; ++i )
      {
        //Jos on ampumattomia, ammutaan ensimm‰inen vapaa ammus
        if( ammoArray[i].ammuttu == false )
        {
          ammoArray[i].ammuttu = true;
          ammoArray[i].x = spaceShip_X + spaceShip_width;
          ammoArray[i].y = spaceShip_Y+(spaceShip_height/2)-(ammo_height/2);
          
      
          if( soundsOn ){ shoot.play(); }
          break;
        }
      }
    }
    
    if( ammoTimer > 0 )
    {
      //V‰hennet‰‰n ammustimeria yhdell‰.
      ammoTimer -= 1;
    }
    
    //K‰yd‰‰n kaikki ammukset l‰pi
    for( var i = 0; i < ammoArray.length; ++i )    
    {
      //Liikutellaan ammuttuja ammuksia.
      if( ammoArray[i].ammuttu )
      {
        ammoArray[i].x += 5;
      }
      //Nollataan ne ammukset, jotka ylitt‰v‰t pelialueen rajan.
      if( ammoArray[i].ammuttu && ammoArray[i].x > CanvasXSize-ammo_width )
      {
        ammoArray[i].ammuttu = false;
        ammoArray[i].x = 0;
        ammoArray[i].y = 0;
      }
    }
  }

  var createEnemy = function() {
    var x_koord = CanvasXSize;
    //Lasketaan mihin vihollinen ilmestyy y-akselilla. Jos uusi koordinaatti menee viimeksi
    //luodun vihollisen y-koordinaatin kanssa p‰‰llekk‰in, arvotaan uusi.
    do{
      var y_koord = Math.floor( (CanvasYSize-enemyShip_height - 9) * Math.random() ) + 10;
    }while( y_koord + enemyShip_height >= lastEnemyPosition && y_koord <= lastEnemyPosition + enemyShip_height )
    
    lastEnemyPosition = y_koord;
    enemyArray.push( { x: x_koord, y: y_koord } );
  }

  var enemyAction = function() {
    //Lasketaan vihollisen ilmestymiseen kuluva aika
    //Jos aikaa on j‰ljell‰, v‰hennet‰‰n ja menn‰‰n eteenp‰in.
    if( timeTillEnemyAppear > 0 )
    {
      timeTillEnemyAppear -= 1;
    }
    else
    {
      //Muuten luodaan uusi vihollinen ja arvotaan uusi aika
      createEnemy();
      timeTillEnemyAppear = Math.floor( (enemyAppearMax-(enemyAppearMin-1)) * Math.random() ) + enemyAppearMin;
    }

    //K‰yd‰‰n kaikki luodut viholliset l‰pi
    for( var i = 0; i < enemyArray.length; ++i )
    {
      //Liikutellaan vihollisia
      enemyArray[i].x -= enemySpeed;
      
      //Vaikeustason nouseminen
      //Tietyn pisterajan j‰lkeen viholliset alkavat liikkumaan myˆs ylˆs/alas
      if( score > 150 && score < 375  )
      {
        var dy = 3*sineWave;
        if( enemyArray[i].y + enemyShip_height + dy < CanvasYSize &&
            enemyArray[i].y + dy > 0 )
        {
          enemyArray[i].y += dy;
        }
/*        else
        {
          enemyArray[i].y += -dy;
        }
*/        
      }

      //Jos vihollinen ylitt‰‰ pelialueen vasemman reunan, poistetaan kyseinen vihulainen
      //ja v‰hennet‰‰n yksi el‰m‰
      if( enemyArray[i].x <= 0 )
      {
        removeByIndex( enemyArray, i );
        health -= 1;
        emergency.play();
      }
    }
    
    //Vaikeustason nouseminen
    //Vihollisten liike nopeutuu
    if( speedCounter == 6 )
    {
      enemyAppearMax = enemyAppearMax*(0.9);
      if( soundsOn ){ speedup.play(); }
      speedCounter = 0;
      enemySpeed += 1;
    }
  }


  //Pelin lopetusehtojen tarkistelu
  var checkEndingClauses = function() {
    //Loppuiko el‰m‰t?
    if( health == 0 )
    {
      endGame();
    }

    for( var i = 0; i < enemyArray.length; ++i )
    {
      //Jos vihollinen osuu pelaajan alukseen, peli p‰‰ttyy heti
      if( ( spaceShip_X + spaceShip_width >= enemyArray[i].x + enemyShip_width/2 ) &&
          ( spaceShip_X + 25 <= enemyArray[i].x + enemyShip_width ) &&
          ( (spaceShip_Y + 10 <= enemyArray[i].y + enemyShip_height) &&
            (spaceShip_Y + spaceShip_height - 20 >= enemyArray[i].y) ) )
      {
        endGame();
      }
    }
  }


  //Ammusten tˆrm‰ystarkistelu
  var checkAmmoHits = function() {
    for( var i = 0; i < ammoArray.length; ++i )
    {
      for( var j = 0; j < enemyArray.length; ++j )
      {
        //Jos ammus osuu viholliseen, poistetaan vihollinen, kyseinen ammus
        //ja lis‰t‰‰n pisteit‰
        //spaceShip_X + spaceShip_width < enemyArray[j].x &&
        if( ammoArray[i].ammuttu == true &&
            ammoArray[i].x + ammo_width >= enemyArray[j].x+(enemyShip_width/2) &&
            ammoArray[i].x < enemyArray[j].x+enemyShip_width &&
            ( ammoArray[i].y + ammo_height-hitboxOffset  >= enemyArray[j].y &&
              ammoArray[i].y+hitboxOffset  <= enemyArray[j].y + enemyShip_height ) )
        {
          ammoArray[i].ammuttu = false;
          removeByIndex( enemyArray, j );
          if( soundsOn ){ destroy.play();}
          score += 15;
          speedCounter += 1;
          //Jatketaan seuraavaan ammukseen
          continue;
        }
      }
    }
  }

  
  //Tulostaa pelin p‰‰ttymistekstin
  var endGame = function(){
    clearInterval( intervalId );
    
    //Clear Canvas
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,clearX,clearY);
    
    ctx.font = "bold 48pt cursive";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "red";
    
    ctx.fillText("Game over!", CanvasXSize/2, 30);
    ctx.font = "bold 18pt cursive";
    
    ctx.fillStyle = "yellow";
    ctx.fillText("Press enter to try again...", CanvasXSize/2, 80);
    
    ctx.fillText("High Scores", CanvasXSize/2, 150);
    
    //Talletetaan pisteet, mik‰li pelaaja p‰‰si 5 parhaan joukkoon
    saveScore();

    //Tulostetaan highscore-lista
    ctx.textAlign="left";
    var rivi = 190;
    for( var i = 0; i < scorelist.length; ++i )
    {
      ctx.fillText( (i+1) + ". " + scorelist[i], CanvasXSize/2 - 70, rivi);
      rivi += 40;
    }
      
    music.pause();
    music.currentTime=0;
    
    if( soundsOn ){ gameover.play(); }
    //Hyv‰ksyt‰‰n taas enterin painallukset
    pelinTila = pelitilat.gameOver;
  }

  
  //Tallentaa pelaajan pisteet
  var saveScore = function() {
    var sortNumber = function(a,b) {
      return b-a;
    }
    
    //Lis‰t‰‰n viimeisimm‰t pisteet pistelistaan ja
    //sortataan taulukko nousevaan j‰rjestykseen
    scorelist.push( score );
    scorelist.sort(sortNumber);
    
    //Jos listalla on enemm‰n kuin 5 alkiota, otetaan taulukosta vain viiden
    //parhaan tuloksen osajoukko ja hyl‰t‰‰n loput pisteet
    if( scorelist.length > 5 )
    { 
      scorelist = scorelist.slice(0,5);
    }

   //Talletetaan hiscore-listan tulokset localstoragen muistiin
    for( var i = 0; i < scorelist.length; ++i )
    {
      localStorage.setItem( "SPACESHOOTER_score"+i, scorelist[i] );
    }
  }

  
  //Piirt‰‰ n‰ytˆlle pisteet, j‰ljell‰ olevat el‰m‰t ja sound on/off -tekstin
  var drawCurrentStatus = function() {
    var output;
    ctx.font = "bold 12pt cursive";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillStyle = "red";
    
    output = "Score: " + score;
    ctx.fillText(output, 10, 10);
    
    output = "Health: " + health;
    ctx.fillText(output, 150, 10);
    
    if( soundsOn == true )
    {
      output = "Sounds: on" 
    }
    else if( soundsOn == false )
    {
      output = "Sounds: off";
    }
    ctx.fillText(output, 290, 10);
  }

  
  //Funktio yhden alkion poistamiseksi taulukosta.
  //Parametrit: arrayName - taulukko, josta poistetaan
  //            arrayIndex - poistettava indeksi
  var removeByIndex = function( arrayName, arrayIndex ) {
    arrayName.splice( arrayIndex, 1 ); 
  }

  
  
  //---------------------------------------------------------------
  //---------------------LIVELY INTERFACE--------------------------
  //---------------------------------------------------------------  
  this.ResourcePath = 'Resources/Spaceattack/';
  
  this.ResourceHandlers = {
    graf: function(resources){
      for ( var i in resources ){
        grafSrc.push(resources[i]);
      }
    },
    audio: function(resources){
      for ( var k in resources ){
        audioSrc.push(resources[k]);
      }
    }
	}
	
	this.Resources = {
		graf: ['graf/avaruusmaisema.png', 'graf/enemyship.png', 'graf/photon_torpedo_1.png', 'graf/sankari2.png', 'graf/startscreen.png'],
		audio: ['audio/dance-zone.mp3', 'audio/dance-zone.ogg', 'audio/destroyed.mp3', 'audio/destroyed.ogg',
            'audio/emergency.mp3', 'audio/emergency.ogg', 'audio/game_over.mp3', 'audio/game_over.ogg',
            'audio/shoot.mp3', 'audio/shoot.ogg', 'audio/speedup.mp3', 'audio/speedup.ogg']
	}
	
	
  var unloadedResources = {graf: true, audio: true};
	
  this.ResourcesLoaded = function(resource){
		
    unloadedResources[resource] = false;
		var AllResourcesLoaded = true;
		for ( var i in unloadedResources ){
			if (unloadedResources[i] == true){
				AllResourcesLoaded = false;
			}
		}
		
		if ( AllResourcesLoaded == true ){
      //Initialize
      initScene();
			LivelyApp.StartApp();
		}
	}
  
  var LivelyApp;
	this.SetLivelyApp = function(app){
		LivelyApp = app;
	}
  
  this.Open = function(){
    drawStartscreen();
  }
  
  this.Close = function(){
    clearInterval( intervalId );
    pelinTila = pelitilat.alkuRuutu;
  }
  
  this.GetCanvas = function(){
    return canvas;
	}
	
	this.StartApp = function(){
		Lively3D.AllowAppStart(LivelyApp);
	}
}


var initSpaceattack = function(Spaceattack){
	var spaceattackApp = new Spaceattack();
  
  Lively3D.LoadResources(spaceattackApp);
  
	//spaceattackApp.EventListeners = {};
	
	return spaceattackApp;
}


Lively3D.AddApplication("Spaceattack", Spaceattack, initSpaceattack);