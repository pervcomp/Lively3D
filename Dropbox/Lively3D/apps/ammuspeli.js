var Ammuspeli = function() {
		
	//Consteja
	CANVAS_LEVEYS_AMMUSPELI = 630;
	CANVAS_KORKEUS_AMMUSPELI = 630;
	ALKUELAMA_AMMUSPELI = 200;
	ALKUPISTEET_AMMUSPELI = 0;
	VIHOLLISJOUKKUE_AMMUSPELI = 1;
	PELAAJAJOUKKUE_AMMUSPELI = 0;

	PELAAJA_ALKUSIJAINTI_Y_AMMUSPELI = 535;
	VIHOLLIS_ALKUSIJAINTI_Y_AMMUSPELI = 51;
	RATA_AX_AMMUSPELI = 80;
	RATA_BX_AMMUSPELI = 200;
	RATA_CX_AMMUSPELI = 320;
	RATA_AY_ALKU_AMMUSPELI = 70;
	RATA_AY_LOPPU_AMMUSPELI = 540;
	RATA_BY_ALKU_AMMUSPELI = 70;
	RATA_BY_LOPPU_AMMUSPELI = 540;
	RATA_CY_ALKU_AMMUSPELI = 70;
	RATA_CY_LOPPU_AMMUSPELI = 540;
	PISTE_SIJAINTI_X_AMMUSPELI = 470;
	PISTE_SIJAINTI_Y_AMMUSPELI = 40;
	ELAMA_SIJAINTI_X_AMMUSPELI = 385;
	ELAMA_SIJAINTI_Y_AMMUSPELI = 500;
	BONUS0_MITTARI_X_AMMUSPELI = 393;
	BONUS0_MITTARI_Y_AMMUSPELI = 100
	BONUS1_MITTARI_X_AMMUSPELI = 393;
	BONUS1_MITTARI_Y_AMMUSPELI = 180
	BONUS2_MITTARI_X_AMMUSPELI = 393;
	BONUS2_MITTARI_Y_AMMUSPELI = 260
	AIKAPALKKI_PITUUS_AMMUSPELI = 200;

	HAPPO_AMMUS_SADE_AMMUSPELI = 20;
	HAPPO_AMMUS_LEVEYS_AMMUSPELI = 40;
	HAPPO_AMMUS_PITUUS_AMMUSPELI = 40;
	PIIKKI_AMMUS_PITUUS_ETU_AMMUSPELI = 30;
	PIIKKI_AMMUS_PITUUS_TAKA_AMMUSPELI = 8;
	PIIKKI_AMMUS_LEVEYS_AMMUSPELI = 8;
	TULIPALLO_AMMUS_SADE_AMMUSPELI = 20;
	TULIPALLO_AMMUS_LEVEYS_AMMUSPELI = 40;
	TULIPALLO_AMMUS_PITUUS_AMMUSPELI = 40;
	ALKUNOPEUS_AMMUSPELI = 4;
	HAPPO_AMMUSPELI = 0;
	PIIKKI_AMMUSPELI = 1;
	TULIPALLO_AMMUSPELI = 2;
	ELAMA_VAHENNYS_AMMUSPELI = 20;
	PISTE_LISAYS_AMMUSPELI = 10;
	BONUS_PISTE_LISAYS_AMMUSPELI = 10;
	BONUS_KESTO_AMMUSPELI = 10000;
	MAKSIMINOPEUS_AMMUSPELI = 9;
	NOPEUDEN_KASVATUSVALI_AMMUSPELI = 25;
	VIHOLLISTOIMINNAN_NOPEUS_AMMUSPELI = 1000;
	NOPEUTUS_MAARA_AMMUSPELI = 200;
	PERUSVOIMAKKUUS_AMMUSPELI = 0;
	BONUS_VOIMAKKUUS_AMMUSPELI = 3;
	NORMAALI_VOIMAKKUUS_AMMUSPELI = 1;
	BONUS_MAHDOLLISUUS_AMMUSPELI = 95;
	BONUS_AMMUS_SADE_AMMUSPELI = 23;
	PIIKKI_VARI_AMMUSPELI = '800000';
	HAPPO_VARI_AMMUSPELI = 'green';
	TULIPALLO_VARI_AMMUSPELI = 'red';
	BONUS_HIDASTUS_AMMUSPELI = 3;
	PELAAJAN_AMMUSNOPEUS_AMMUSPELI = 7;
	NIMI_MAX_AMMUSPELI = 3;
	BONUS_MITTARI_KERROIN_AMMUSPELI = 50;
	//Constit loppuu

	//Luodaan uusi canvas
	var canvas = document.createElement("canvas");
	canvas.setAttribute('width', CANVAS_LEVEYS_AMMUSPELI);
	canvas.setAttribute('height', CANVAS_KORKEUS_AMMUSPELI);
	//document.body.appendChild(uusiCanv) ei tarvita
	var ctx = canvas.getContext("2d");
	var top_tulokset = new Array();
	var top_nimet = new Array();
	var graphs_AMMUSPELI = new Array();
	var audios_AMMUSPELI = new Array();
	
	var LivelyApp;

	//Ammuksen rakentaja
	var Ammus_AMMUSPELI = function(joukkue, rata, tyyppi, nopeus, voimakkuus, bonus) {
		this.joukkue = joukkue;
		this.rata = rata;
		this.tyyppi = tyyppi;
		this.sijaintiY = 0;
		this.sijaintiX = 0;
		this.leveys = 1;
		this.pituus = 1;
		this.sade = 1;
		this.nopeus = nopeus;
		this.liikkeenMuutos = 0;
		//Kuinka paljon elämää ammuksella on (vain vihollisilla voi olla yli 1)
		this.voimakkuus = voimakkuus;
		//Minkä bonuksen vihollisen tappamisesta saa (Vihollisen bonus kertoo, minkä bonuksen saa. Pelaaja ammuksen bonus kertoo, onko ammuksella läpäisy-
		//bonusta. Tämä on tiedettävä, koska muuten läpäisytilanteissa voisi kuolla, jos pelaajan bonus loppuisi ennen kun Ammus_AMMUSPELI on osunut.
		this.bonus = bonus;
		this.tarkistaTormays = ammusTarkistaTormays_AMMUSPELI;
		this.liiku = ammusLiiku_AMMUSPELI;
		this.vahennaElamaa = ammusVahennaElamaa_AMMUSPELI;
		
		//Y-sijainnin määritys joukkueen perusteella
		if (joukkue == PELAAJAJOUKKUE_AMMUSPELI) {
			this.sijaintiY = PELAAJA_ALKUSIJAINTI_Y_AMMUSPELI;
		}
		else { this.sijaintiY = VIHOLLIS_ALKUSIJAINTI_Y_AMMUSPELI; }
		
		//X-sijainnin määritys radan perusteella
		if (rata == 0) { this.sijaintiX = RATA_AX_AMMUSPELI; }
		else if (rata == 1 ) { this.sijaintiX = RATA_BX_AMMUSPELI; }
		else if (rata == 2 ) { this.sijaintiX = RATA_CX_AMMUSPELI; }
		
		if (tyyppi == HAPPO_AMMUSPELI) {
			this.sade = HAPPO_AMMUS_SADE_AMMUSPELI;
			this.leveys = HAPPO_AMMUS_LEVEYS_AMMUSPELI;
			this.pituus = HAPPO_AMMUS_PITUUS_AMMUSPELI;
		}
		
		else if (tyyppi == PIIKKI_AMMUSPELI) {
			this.pituus = PIIKKI_AMMUS_PITUUS_ETU_AMMUSPELI;
			this.leveys = PIIKKI_AMMUS_LEVEYS_AMMUSPELI;
		}
		
		else if (tyyppi == TULIPALLO_AMMUSPELI) {
			this.sade = TULIPALLO_AMMUS_SADE_AMMUSPELI;
			this.leveys = TULIPALLO_AMMUS_LEVEYS_AMMUSPELI;
			this.pituus = TULIPALLO_AMMUS_PITUUS_AMMUSPELI;
		}
	}

	var ammusVahennaElamaa_AMMUSPELI = function() {
		this.voimakkuus -= 1;
	}

	//Räjähdys-olion rakentaja
	var Rajahdys_AMMUSPELI = function(sijaintiX, sijaintiY, tyyppi) {
		this.sijaintiX = sijaintiX;
		this.sijaintiY = sijaintiY;
		this.tyyppi = tyyppi;
		this.vaihe = 0;
	}

	//Tarkistaa onko ammus törmännyt toiseen ammukseen tai saapunut vastakkaiseen aloituspaikkaan
	var ammusTarkistaTormays_AMMUSPELI = function(ammukset, pelaaja, rajahdykset) {
	//This-ammuksen yläreunan Y-koordinaatti ja vastuksen alareunan Y-koordinaatti
		var oma_ylempi = 0;
		var vastus_alempi = 0;	
		if (this.tyyppi == HAPPO_AMMUSPELI && this.joukkue == PELAAJAJOUKKUE_AMMUSPELI) { 
			oma_ylempi = (this.sijaintiY);
		}
		
		if (this.tyyppi == PIIKKI_AMMUSPELI && this.joukkue == PELAAJAJOUKKUE_AMMUSPELI) {
			oma_ylempi = (this.sijaintiY-this.pituus);
		}
		
		if (this.tyyppi == TULIPALLO_AMMUSPELI && this.joukkue == PELAAJAJOUKKUE_AMMUSPELI) {
			oma_ylempi = (this.sijaintiY);
		}
		//Käydään kaikki ammukset läpi
		for (var i = ammukset.length-1; i >= 0; --i) {
		
			//Vastustajan ammuksen alareuna
			if (ammukset[i].tyyppi == HAPPO_AMMUSPELI && ammukset[i].joukkue == VIHOLLISJOUKKUE_AMMUSPELI) { 
				vastus_alempi = ammukset[i].sijaintiY+ammukset[i].sade*2;
			}
		
			if (ammukset[i].tyyppi == PIIKKI_AMMUSPELI && ammukset[i].joukkue == VIHOLLISJOUKKUE_AMMUSPELI) {
				vastus_alempi = ammukset[i].sijaintiY+ammukset[i].pituus;
			}
		
			if (ammukset[i].tyyppi == TULIPALLO_AMMUSPELI && ammukset[i].joukkue == VIHOLLISJOUKKUE_AMMUSPELI) {
				vastus_alempi = ammukset[i].sijaintiY+ammukset[i].sade*2;
			}
			//Törmäys tapahtuu jos on sama x-koordinaatti (eli sama rata) ja eri joukkue
			if ( ammukset[i] != this && this.sijaintiX == ammukset[i].sijaintiX && this.joukkue != ammukset[i].joukkue ) {
				if (this.joukkue == PELAAJAJOUKKUE_AMMUSPELI && oma_ylempi <= vastus_alempi){
					var pistemaara = PISTE_LISAYS_AMMUSPELI;
					//Pelaajalla on tuplapiste-bonus
					if (pelaaja.bonukset[1] == true) { pistemaara += BONUS_PISTE_LISAYS_AMMUSPELI; }
					//Luodaan räjähdys oman ammuksen kohdalle, koska se tuhoutuu aina
					var oma_rajahdys = new Rajahdys_AMMUSPELI(this.sijaintiX, this.sijaintiY, this.tyyppi);
					rajahdykset.push(oma_rajahdys);
					
					//Räjähdyksestä syntyvä ääniefekti
					var efekti = document.createElement('audio');
					efekti.setAttribute('src', audios_AMMUSPELI[0]);
					efekti.play();
					
					//Tasapeli, ei käy mitään
					if (this.tyyppi == ammukset[i].tyyppi) {
						//Vastustajan räjähdys
						ammukset[i].vahennaElamaa();
						this.vahennaElamaa();
						if (ammukset[i].voimakkuus <= 0) {
							var vastus_rajahdys = new Rajahdys_AMMUSPELI(ammukset[i].sijaintiX, ammukset[i].sijaintiY, ammukset[i].tyyppi);
							rajahdykset.push(vastus_rajahdys);
							delete ammukset[i];
							ammukset.splice(i, 1);
						}
						
						if (this.voimakkuus <= 0) {
							var index = ammukset.indexOf(this);
							ammukset.splice(index, 1);
							delete this;
						}
						return;
					}
					
					//HAPPO_AMMUSPELI häviää TULIPALLO_AMMUSPELIlle
					if (this.tyyppi == HAPPO_AMMUSPELI && ammukset[i].tyyppi == TULIPALLO_AMMUSPELI) {
						this.vahennaElamaa();
						if (this.voimakkuus <= 0) {
							var index = ammukset.indexOf(this);
							ammukset.splice(index, 1);
							//Pelaaja menettää hävitystä ammuksesta vain jos ammusta ei ammuttu läpimeno-bonuksen aikana
							if (this.bonus == 0) {
								pelaaja.vahennaElamaa();
							}
							delete this;
						}
						return;
					}
					
					//HAPPO_AMMUSPELI voittaa piikin
					if (this.tyyppi == HAPPO_AMMUSPELI && ammukset[i].tyyppi == PIIKKI_AMMUSPELI) {
						//Vastustajan räjähdys
						ammukset[i].vahennaElamaa();
						this.vahennaElamaa();
						if (ammukset[i].voimakkuus <= 0) {
							var vastus_rajahdys = new Rajahdys_AMMUSPELI(ammukset[i].sijaintiX, ammukset[i].sijaintiY, ammukset[i].tyyppi);
							rajahdykset.push(vastus_rajahdys);
							//Bonus-ammuksesta saa väliaikaisen bonuksen.
							if (ammukset[i].bonus > 0) {
								pelaaja.bonukset[ammukset[i].bonus - 1] = true;
								pelaaja.uudistaBonukset[ammukset[i].bonus - 1] = true;
							}
							delete ammukset[i];
							ammukset.splice(i, 1);
							pelaaja.lisaaPisteita(pistemaara);
						}
						
						if (this.voimakkuus <= 0 && !this.bonus) {
							var index = ammukset.indexOf(this);
							ammukset.splice(index, 1);
							delete this;
						}
						return;
					}
					
					//PIIKKI_AMMUSPELI häviää hapolle
					if (this.tyyppi == PIIKKI_AMMUSPELI && ammukset[i].tyyppi == HAPPO_AMMUSPELI) {
						this.vahennaElamaa();
						if (this.voimakkuus <= 0) {
							var index = ammukset.indexOf(this);
							ammukset.splice(index, 1);
							//Pelaaja menettää hävitystä ammuksesta vain jos ammusta ei ammuttu läpimeno-bonuksen aikana
							if (this.bonus == 0) {
								pelaaja.vahennaElamaa();
							}
							delete this;
						}
						return;
					}
					
					//PIIKKI_AMMUSPELI voittaa TULIPALLO_AMMUSPELIn
					if (this.tyyppi == PIIKKI_AMMUSPELI && ammukset[i].tyyppi == TULIPALLO_AMMUSPELI) {
						//Vastustajan räjähdys
						ammukset[i].vahennaElamaa();
						this.vahennaElamaa();
						if (ammukset[i].voimakkuus <= 0) {
							var vastus_rajahdys = new Rajahdys_AMMUSPELI(ammukset[i].sijaintiX, ammukset[i].sijaintiY, ammukset[i].tyyppi);
							rajahdykset.push(vastus_rajahdys);
							//Bonus-ammuksesta saa väliaikaisen bonuksen.
							if (ammukset[i].bonus > 0) {
								pelaaja.bonukset[ammukset[i].bonus - 1] = true;
								pelaaja.uudistaBonukset[ammukset[i].bonus - 1] = true;
							}
							delete ammukset[i];
							ammukset.splice(i, 1);
							pelaaja.lisaaPisteita(pistemaara);
						}
						
						if (this.voimakkuus <= 0 && !this.bonus) {
							var index = ammukset.indexOf(this);
							ammukset.splice(index, 1);
							delete this;
						}
						return;
					}
					
					//TULIPALLO_AMMUSPELI voittaa hapon
					if (this.tyyppi == TULIPALLO_AMMUSPELI && ammukset[i].tyyppi == HAPPO_AMMUSPELI) {
						//Vastustajan räjähdys
						ammukset[i].vahennaElamaa();
						this.vahennaElamaa();
						if (ammukset[i].voimakkuus <= 0) {
							var vastus_rajahdys = new Rajahdys_AMMUSPELI(ammukset[i].sijaintiX, ammukset[i].sijaintiY, ammukset[i].tyyppi);
							rajahdykset.push(vastus_rajahdys);
							//Bonus-ammuksesta saa väliaikaisen bonuksen.
							if (ammukset[i].bonus > 0) {
								pelaaja.bonukset[ammukset[i].bonus - 1] = true;
								pelaaja.uudistaBonukset[ammukset[i].bonus - 1] = true;
							}
							delete ammukset[i];
							ammukset.splice(i, 1);
							pelaaja.lisaaPisteita(pistemaara);
						}
						
						if (this.voimakkuus <= 0 && !this.bonus) {
							var index = ammukset.indexOf(this);
							ammukset.splice(index, 1);
							delete this;
						}
						return;
					}
					
					//TULIPALLO_AMMUSPELI häviää piikille
					if (this.tyyppi == TULIPALLO_AMMUSPELI && ammukset[i].tyyppi == PIIKKI_AMMUSPELI) {
						this.vahennaElamaa();
						if (this.voimakkuus <= 0) {
							var index = ammukset.indexOf(this);
							ammukset.splice(index, 1);
							//Pelaaja menettää hävitystä ammuksesta vain jos ammusta ei ammuttu läpimeno-bonuksen aikana
							if (this.bonus == 0) {
								pelaaja.vahennaElamaa();
							}
							delete this;
						}
						return;
					}
				}
			}
		}
		
		//Vihollisen ammus on saapunut pelaajan aloituspisteeseen
		if (this.sijaintiY >= PELAAJA_ALKUSIJAINTI_Y_AMMUSPELI && this.joukkue == VIHOLLISJOUKKUE_AMMUSPELI) {
			var index = ammukset.indexOf(this);
			ammukset.splice(index, 1);
			pelaaja.vahennaElamaa();
			delete this;
			return;
		}
		
		//Pelaajan ammus on saapunut vihollisen aloituspisteeseen
		else if (this.sijaintiY <= VIHOLLIS_ALKUSIJAINTI_Y_AMMUSPELI && this.joukkue == PELAAJAJOUKKUE_AMMUSPELI) {
			var index = ammukset.indexOf(this);
			ammukset.splice(index, 1);
			delete this;
			return;
		}
	}

	//Liikuta ammusta
	var ammusLiiku_AMMUSPELI = function() {
		if (this.joukkue == VIHOLLISJOUKKUE_AMMUSPELI) {
			this.sijaintiY += this.nopeus;
		}
		
		else { this.sijaintiY -= this.nopeus; }
		this.liikkeenMuutos += 1;
		if (this.liikkeenMuutos > 2) { this.liikkeenMuutos = 0; }
	}

	//Pelaajan rakentaja
	var Pelaaja_AMMUSPELI = function() {
		this.elama = ALKUELAMA_AMMUSPELI;
		this.pisteet = ALKUPISTEET_AMMUSPELI;
		this.vahennaElamaa = pelaajaVahennaElamaa_AMMUSPELI;
		this.lisaaPisteita = pelaajaLisaaPisteita_AMMUSPELI;
		this.bonukset = [false, false, false];
		this.uudistaBonukset = [false, false, false];
	}

	//Vähennä pelaajan elämää
	var pelaajaVahennaElamaa_AMMUSPELI = function() {
		this.elama -= ELAMA_VAHENNYS_AMMUSPELI;
	}

	//Lisää pelaajalle pisteitä
	var pelaajaLisaaPisteita_AMMUSPELI = function(pistemaara) {
		this.pisteet += pistemaara;
	}

	//Vihollisen toimintaan ja pelin nopeutumiseen liittyviä ajastimen asioita
	var Ajastin_AMMUSPELI = function() {
		this.arvo = 0;
		this.nopeutusPaalla = false;
		//Tässä on ammuksille annettava nopeus. Vähän tyhmää pitää se tässä mutta nyt se vaan on näin.
		this.nopeus = ALKUNOPEUS_AMMUSPELI;
		this.vihollisToiminnanNopeus = VIHOLLISTOIMINNAN_NOPEUS_AMMUSPELI;
		//Pelaajan voittavat ammukset menevät vihollisista läpi ja häviävät ammukset eivät tee vahinkoa pelaajalle
		this.bonus0_paalla = false;
		//Tuhotuista ammuksista saa tuplapisteet
		this.bonus1_paalla = false;
		//Vastustajan ammukset hidastuvat
		this.bonus2_paalla = false;
		this.omanopeus = PELAAJAN_AMMUSNOPEUS_AMMUSPELI;
		this.bonus0_jaljella = 0;
		this.bonus1_jaljella = 0;
		this.bonus2_jaljella = 0;
		
		//Kellonaikoja käytetään bonus-mittarin vähentämiseen
		this.kellonAika1 = new Date();
		this.kellonAika2 = new Date();
		this.kumpiKello = true;
		this.muutaKelloa = ajastinKellonMuutos_AMMUSPELI;
		
		this.bonus2timer;
		this.jaljellatimer2;
		this.bonus1timer;
		this.jaljellatimer1;
		this.bonus0timer;
		this.jaljellatimer0;
		
		this.clear = ajastinClear_AMMUSPELI;
		this.bonusPaalle = ajastinBonusPaalle_AMMUSPELI;
		this.bonusPois = ajastinBonusPois_AMMUSPELI;
	}

	//Tyhjennä ajastimen arvo
	var ajastinClear_AMMUSPELI = function() {
		this.arvo = 0;
	}

	//Laittaa bonuksen pelaajalle päälle
	var ajastinBonusPaalle_AMMUSPELI = function(bonus) {
		if (bonus == 0) { this.bonus0_paalla = true; }
		else if (bonus == 1) { this.bonus1_paalla = true; }
		else if (bonus == 2) { this.bonus2_paalla = true; }
	}

	//Poistaa bonuksen pelaajalta
	var ajastinBonusPois_AMMUSPELI = function(bonus, timer) {
		if (bonus == 0) { this.bonus0_paalla = false; }
		else if (bonus == 1) { this.bonus1_paalla = false; }
		else if (bonus == 2) { this.bonus2_paalla = false; }
		window.clearTimeout(timer);
	}
	
	var ajastinKellonMuutos_AMMUSPELI = function() {
	
		if (this.kumpiKello) { 
			this.kellonAika1 = new Date();
			this.kumpiKello = false;
		}
		
		else { 
			this.kellonAika2 = new Date();
			this.kumpiKello = true;
		}
	}
	

//----//Peliä pyörittävä funktio. Kutsutaan alku-funktiosta tasaisin väliajoin--------------------------------------------------------------------
	var peli_AMMUSPELI = function (canvas, ctx, ammukset, ajastin, pelaaja, timer, rajahdykset) {
		//"Neutralisoidaan" alku-funktiosta jäänyt onkeypress
		document.onkeypress = function(event) { return true; }
		//Käyttäjä ampuu ammuksia
		document.onkeydown = function(event) {
			//Q:sta tai numpadin 7:sta ammutaan TULIPALLO_AMMUSPELI 0-radalle.
			if (event.keyCode == '81' || event.keyCode == '36') {
				var uusi = new Ammus_AMMUSPELI(PELAAJAJOUKKUE_AMMUSPELI, 0, TULIPALLO_AMMUSPELI, ajastin.omanopeus, NORMAALI_VOIMAKKUUS_AMMUSPELI, pelaaja.bonukset[0]);
				ammukset.push(uusi);
				return;
			}
			
			//A:sta tai numpadin 4:sta ammutaan ympyrä 0-radalle
			else if (event.keyCode == '65' || event.keyCode == '37') {
				var uusi = new Ammus_AMMUSPELI(PELAAJAJOUKKUE_AMMUSPELI, 0, PIIKKI_AMMUSPELI, ajastin.omanopeus, NORMAALI_VOIMAKKUUS_AMMUSPELI, pelaaja.bonukset[0]);
				ammukset.push(uusi);
				return;
			}
			
			//Z:sta tai numpadin 1:stä ammutaan neliö 0-radalle
			else if (event.keyCode == '90' || event.keyCode == '35') {
				var uusi = new Ammus_AMMUSPELI(PELAAJAJOUKKUE_AMMUSPELI, 0, HAPPO_AMMUSPELI, ajastin.omanopeus, NORMAALI_VOIMAKKUUS_AMMUSPELI, pelaaja.bonukset[0]);
				ammukset.push(uusi);
				return;
			}
			
			//W:stä tai numpadin 8:stä ammutaan TULIPALLO_AMMUSPELI 1-radalle
			else if (event.keyCode == '87' || event.keyCode == '38') {
				var uusi = new Ammus_AMMUSPELI(PELAAJAJOUKKUE_AMMUSPELI, 1, TULIPALLO_AMMUSPELI, ajastin.omanopeus, NORMAALI_VOIMAKKUUS_AMMUSPELI, pelaaja.bonukset[0]);
				ammukset.push(uusi);
				return;
			}
			
			//S:stä tai numpadin 5:sta ammutaan ympyrä 1-radalle
			else if (event.keyCode == '83' || event.keyCode == '12') {
				var uusi = new Ammus_AMMUSPELI(PELAAJAJOUKKUE_AMMUSPELI, 1, PIIKKI_AMMUSPELI, ajastin.omanopeus, NORMAALI_VOIMAKKUUS_AMMUSPELI, pelaaja.bonukset[0]);
				ammukset.push(uusi);
				return;
			}
			
			//X:stä tai numpadin 2:sta ammutaan neliö 1-radalle
			else if (event.keyCode == '88' || event.keyCode == '40') {
				var uusi = new Ammus_AMMUSPELI(PELAAJAJOUKKUE_AMMUSPELI, 1, HAPPO_AMMUSPELI, ajastin.omanopeus, NORMAALI_VOIMAKKUUS_AMMUSPELI, pelaaja.bonukset[0]);
				ammukset.push(uusi);
				return;
			}
			
			//E:stä tai numpadin 9:stä ammutaan TULIPALLO_AMMUSPELI 2-radalle
			else if (event.keyCode == '69' || event.keyCode == '33') {
				var uusi = new Ammus_AMMUSPELI(PELAAJAJOUKKUE_AMMUSPELI, 2, TULIPALLO_AMMUSPELI, ajastin.omanopeus, NORMAALI_VOIMAKKUUS_AMMUSPELI, pelaaja.bonukset[0]);
				ammukset.push(uusi);
				return;
			}
			
			//D:stä tai numpadin 6:sta ammutaan ympyrä 2-radalle
			else if (event.keyCode == '68' || event.keyCode == '39') {
				var uusi = new Ammus_AMMUSPELI(PELAAJAJOUKKUE_AMMUSPELI, 2, PIIKKI_AMMUSPELI, ajastin.omanopeus, NORMAALI_VOIMAKKUUS_AMMUSPELI, pelaaja.bonukset[0]);
				ammukset.push(uusi);
				return;
			}
			
			//C:stä tai numpadin 3:sta ammutaan neliö 2-radalle
			else if (event.keyCode == '67' || event.keyCode == '34') {
				var uusi = new Ammus_AMMUSPELI(PELAAJAJOUKKUE_AMMUSPELI, 2, HAPPO_AMMUSPELI, ajastin.omanopeus, NORMAALI_VOIMAKKUUS_AMMUSPELI, pelaaja.bonukset[0]);
				ammukset.push(uusi);
				return;
			}
		}
		
		//Kellonajan muutos
		ajastin.muutaKelloa();
		
		//Satunnaisaika vihollisen toiminnalle
		var satunnaisAika = Math.random();
		if (ajastin.arvo == 0) {
			ajastin.arvo = setTimeout(function() { 
			vihollisToiminta_AMMUSPELI(ammukset, ajastin); }, satunnaisAika*1000+ajastin.vihollisToiminnanNopeus);
		}
		
		//Piirrä pelimaailma
		piirra_AMMUSPELI(canvas, ctx, ammukset, pelaaja, rajahdykset, ajastin);

		//Tarkista pelaajan elämä
		if (pelaaja.elama <= 0) {
//////////////////////////////Pelaaja kuoli, piirretään loppuruudun alkuosa///////// LOPETETAAN PELI /////////////////////////////////////////////////
			ctx.clearRect(0,0,CANVAS_LEVEYS_AMMUSPELI, CANVAS_KORKEUS_AMMUSPELI);
			ctx.fillStyle = "rgba(255, 255, 40, 0.8)";
			ctx.fillRect(45, 40, 490, 55);
			ctx.fillRect(210, 113, 127, 55);
			ctx.fillStyle = 'red';
			ctx.font = "bold  28pt sans-serif";
			ctx.fillText("Peli loppui. Anna nimesi:", 55, 77);
			ctx.fillText("_____", 220, 150);
			//sijoitetaan pelaajan pisteet
			var pisteet = pelaaja.pisteet
			delete pelaaja;
			window.clearInterval(timer);
			//Tuhotaan jäljellä olevat ammukset
			for (var i = ammukset.length; i >= 0; --i) {
				delete ammukset[i];
				ammukset.splice(i, 1);
			}
			delete ajastin;
			delete ammukset;
			window.clearTimeout(nopeustimer);
			
			//Tuhotaan jäljellä olevat räjähdykset
			for (var i = rajahdykset.length-1; i >= 0; --i) {
				delete rajahdykset[i];
				rajahdykset.splice(i, 1);
			}
			delete rajahdykset;
			//Taulukko, johon pelaajan nimi sijoitetaan
			var tulosNimi = new Array();
			//Kutsutaan funktiota, jossa pelaaja antaa nimensä
			annaNimi_AMMUSPELI(ctx, pisteet, tulosNimi);
		}
		
		//Liikuta ammuksia
		liiku_AMMUSPELI(ammukset, pelaaja, rajahdykset);
		
		//Pelin nopeuttamisen ajastin
		if (!ajastin.nopeutusPaalla && ajastin.nopeus < MAKSIMINOPEUS_AMMUSPELI) {
			var nopeustimer = setTimeout( function() { nopeutaPelia_AMMUSPELI(nopeustimer, ajastin); }, 1000*NOPEUDEN_KASVATUSVALI_AMMUSPELI);
			ajastin.nopeutusPaalla = true;
		}
		
		//Bonus0:n ajastin
		if (pelaaja.bonukset[0] && pelaaja.uudistaBonukset[0]) {
			pelaaja.uudistaBonukset[0] = false;
			window.clearInterval(ajastin.jaljellatimer0);
			window.clearTimeout(ajastin.bonus0timer);
			ajastin.bonus0timer = setTimeout( function() { pelaaja.bonukset[0] = false; 
														ajastin.bonusPois(0, ajastin.bonus0timer); 
														window.clearInterval(ajastin.jaljellatimer0);
														ajastin.bonus0_jaljella = 0; }, BONUS_KESTO_AMMUSPELI);
			ajastin.bonusPaalle(0);
			ajastin.bonus0_jaljella = AIKAPALKKI_PITUUS_AMMUSPELI*BONUS_MITTARI_KERROIN_AMMUSPELI;
			ajastin.jaljellatimer0 = setInterval(function () {
				ajastin.bonus0_jaljella -= Math.abs(ajastin.kellonAika1-ajastin.kellonAika2);}, 40);
		}
		
		//Bonus1:n ajastin
		if (pelaaja.bonukset[1] && pelaaja.uudistaBonukset[1]) {
			pelaaja.uudistaBonukset[1] = false;
			window.clearInterval(ajastin.jaljellatimer1);
			window.clearTimeout(ajastin.bonus1timer);
			ajastin.bonus1timer = setTimeout( function() { pelaaja.bonukset[1] = false; 
														ajastin.bonusPois(1, ajastin.bonus1timer);
														window.clearInterval(ajastin.jaljellatimer1);
														ajastin.bonus1_jaljella = 0; }, BONUS_KESTO_AMMUSPELI);
			ajastin.bonusPaalle(1);
			ajastin.bonus1_jaljella = AIKAPALKKI_PITUUS_AMMUSPELI*BONUS_MITTARI_KERROIN_AMMUSPELI;
			ajastin.jaljellatimer1 = setInterval(function () {
				ajastin.bonus1_jaljella -= Math.abs(ajastin.kellonAika1-ajastin.kellonAika2);}, 40);
			
		}
		
		//Bonus2:n ajastin
		if (pelaaja.bonukset[2] && pelaaja.uudistaBonukset[2]) {
			pelaaja.uudistaBonukset[2] = false;
			window.clearInterval(ajastin.jaljellatimer2);
			window.clearTimeout(ajastin.bonus2timer);
			var vanhaNopeus = ajastin.nopeus;
			ajastin.bonus2timer = setTimeout( function() { pelaaja.bonukset[2] = false;
														ajastin.bonusPois(2, ajastin.bonus2timer); 
														ajastin.nopeus = vanhaNopeus;
														window.clearInterval(ajastin.jaljellatimer2);
														ajastin.bonus2_jaljella = 0;
														//Muutetaan hitaiden ammusten nopeus tavalliseksi
														normalisoiNopeus_AMMUSPELI(ajastin.nopeus, ammukset) }, BONUS_KESTO_AMMUSPELI);
			ajastin.bonusPaalle(2);
			//Vihollisten toiminta hidastuu bonus 2:n seurauksena
			ajastin.nopeus = BONUS_HIDASTUS_AMMUSPELI;
			ajastin.bonus2_jaljella = AIKAPALKKI_PITUUS_AMMUSPELI*BONUS_MITTARI_KERROIN_AMMUSPELI;
			ajastin.jaljellatimer2 = setInterval(function () {
				ajastin.bonus2_jaljella -= Math.abs(ajastin.kellonAika1-ajastin.kellonAika2);}, 40);
		}
	}

	//Nopeuttaa ammuksien nopeutta ja esiintymisväliä
	var nopeutaPelia_AMMUSPELI = function (nopeustimer, ajastin) {
		ajastin.nopeus++;
		window.clearTimeout(nopeustimer);
		ajastin.nopeutusPaalla = false;
		ajastin.vihollisToiminnanNopeus -= NOPEUTUS_MAARA_AMMUSPELI;
	}

	//Vihollinen ampuu satunnaisesti jonkin ammuksen jollekkin radalle.
	var vihollisToiminta_AMMUSPELI = function (ammukset, ajastin) {
	//Arvotaan luku väliltä 0-2
		var rata = Math.floor(Math.random()*3);
		var tyyppi = Math.floor(Math.random()*3);
		//Bonus-ammus tulee jos erikoinen saa arvon BONUS_MAHDOLLISUUS_AMMUSPELI-100. Mahdolliset arvot ovat väliltä 0-100.
		var erikoinen = Math.random()*100;
		if (erikoinen > BONUS_MAHDOLLISUUS_AMMUSPELI) {
			var bonusluku = Math.ceil(Math.random()*3);
			var uusi = new Ammus_AMMUSPELI(VIHOLLISJOUKKUE_AMMUSPELI, rata, tyyppi, ajastin.nopeus, BONUS_VOIMAKKUUS_AMMUSPELI, bonusluku);
			ammukset.push(uusi);
		}
		
		else {
			var uusi = new Ammus_AMMUSPELI(VIHOLLISJOUKKUE_AMMUSPELI, rata, tyyppi, ajastin.nopeus, NORMAALI_VOIMAKKUUS_AMMUSPELI, 0);
			ammukset.push(uusi);
		}
		window.clearTimeout(ajastin.arvo);
		ajastin.clear();
		
	}

	//Käy kaikki vihollisen ammukset läpi ja muuttaa niiden nopeuden normaaliksi
	var normalisoiNopeus_AMMUSPELI = function(nopeus, ammukset) {
		for (var i = 0; i < ammukset.length; ++i) {
			if (ammukset[i].joukkue == VIHOLLISJOUKKUE_AMMUSPELI) {
				ammukset[i].nopeus = nopeus;
			}
		}
	}

	//Tarkistaa ammuksen sijainnin muihin ammuksiin nähden ja sen jälkeen liikuttaa ammuksia
	var  liiku_AMMUSPELI = function(ammukset, pelaaja, rajahdykset) {
		for (var i = ammukset.length-1; i >= 0; --i) {
			ammukset[i].tarkistaTormays(ammukset, pelaaja, rajahdykset);
		}
		
		for (var i = ammukset.length-1; i >= 0; --i) {
			ammukset[i].liiku();
		}
		
	}
	
	//Piirtää pelimaailman pohjan
	var piirraAlku_AMMUSPELI = function(canvas, ctx) {
		//Tyhjennetään ruutu
		ctx.clearRect(0,0,CANVAS_LEVEYS_AMMUSPELI,CANVAS_KORKEUS_AMMUSPELI);
		//Pelialue
		ctx.beginPath();
		ctx.strokeStyle = 'black';
		//Ammustausta
		var my_gradient = ctx.createLinearGradient(0, 0, 0, 700);
		my_gradient.addColorStop(0, "black");
		my_gradient.addColorStop(0.5, "rgb(0,150,255)");
		ctx.fillStyle = my_gradient;
		ctx.fillRect(0, 0, 370, 700);
		
		//Tietopuolen tausta
		ctx.fillStyle = "8B7D7B";
		ctx.fillRect(370, 0, 260, 700);
		ctx.strokeRect(370, 0, 260, 700);
	}

	//Piirtää pelimaailman
	var piirra_AMMUSPELI = function(canvas, ctx, ammukset, pelaaja, rajahdykset, ajastin) {
		//Ratojen taustan tyhjennys
		var my_gradient = ctx.createLinearGradient(0, 0, 0, 700);
		my_gradient.addColorStop(0, "black");
		my_gradient.addColorStop(0.5, "rgb(0,150,255)");
		ctx.fillStyle = my_gradient;
		ctx.fillRect(RATA_AX_AMMUSPELI-30, 0, 60, CANVAS_KORKEUS_AMMUSPELI);
		ctx.fillRect(RATA_BX_AMMUSPELI-30, 0, 60, CANVAS_KORKEUS_AMMUSPELI);
		ctx.fillRect(RATA_CX_AMMUSPELI-30, 0, 60, CANVAS_KORKEUS_AMMUSPELI);
		
		//Radat
		ctx.lineCap = 'round';
		ctx.lineWidth = 70;
		ctx.strokeStyle = 'B0C4DE';
		
		//Rata 0
		ctx.beginPath();
		ctx.moveTo(RATA_AX_AMMUSPELI, RATA_AY_ALKU_AMMUSPELI);
		ctx.lineTo(RATA_AX_AMMUSPELI, RATA_AY_LOPPU_AMMUSPELI);
		ctx.stroke();
		
		//Rata 1
		ctx.beginPath();
		ctx.moveTo(RATA_BX_AMMUSPELI, RATA_BY_ALKU_AMMUSPELI);
		ctx.lineTo(RATA_BX_AMMUSPELI, RATA_BY_LOPPU_AMMUSPELI);
		ctx.stroke();
		
		//Rata 2
		ctx.beginPath();
		ctx.moveTo(RATA_CX_AMMUSPELI, RATA_CY_ALKU_AMMUSPELI);
		ctx.lineTo(RATA_CX_AMMUSPELI, RATA_CY_LOPPU_AMMUSPELI);
		ctx.stroke();
		
		ctx.strokeStyle = 'black';
		ctx.lineWidth = 1;
		
		//Tyhjennetään tietopuolen muuttuvat kohdat
		ctx.fillStyle = "8B7D7B";
		ctx.fillRect(BONUS0_MITTARI_X_AMMUSPELI-20, PISTE_SIJAINTI_Y_AMMUSPELI-20, AIKAPALKKI_PITUUS_AMMUSPELI+100, 500);
		
		//Pelaajan elämämittari
		if (pelaaja.elama > 0) {
			ctx.fillStyle = 'red';
			ctx.fillRect(ELAMA_SIJAINTI_X_AMMUSPELI, ELAMA_SIJAINTI_Y_AMMUSPELI, pelaaja.elama,10);
		}
		
		//Pelaajan bonusmittari 1:
		if (pelaaja.bonukset[0]) {
			ctx.fillStyle = 'FF9912';
			ctx.fillRect(BONUS0_MITTARI_X_AMMUSPELI, BONUS0_MITTARI_Y_AMMUSPELI, ajastin.bonus0_jaljella/BONUS_MITTARI_KERROIN_AMMUSPELI, 10);
			ctx.font = "bold 12pt Verdana"
			ctx.fillText("Bonus: Tehokkaat ammukset", BONUS0_MITTARI_X_AMMUSPELI-20, BONUS0_MITTARI_Y_AMMUSPELI-12);
		}
		
		//Pelaajan bonusmittari 2:
		if (pelaaja.bonukset[1]) {
			ctx.fillStyle = 'FF9912';
			ctx.fillRect(BONUS1_MITTARI_X_AMMUSPELI, BONUS1_MITTARI_Y_AMMUSPELI, ajastin.bonus1_jaljella/BONUS_MITTARI_KERROIN_AMMUSPELI, 10);
			ctx.font = "bold 12pt Verdana"
			ctx.fillText("Bonus: 2xPisteet", BONUS1_MITTARI_X_AMMUSPELI-20, BONUS1_MITTARI_Y_AMMUSPELI-12);
		}
		
		//Pelaajan bonusmittari 3:
		if (pelaaja.bonukset[2]) {
			ctx.fillStyle = 'FF9912';
			ctx.fillRect(BONUS2_MITTARI_X_AMMUSPELI, BONUS2_MITTARI_Y_AMMUSPELI, ajastin.bonus2_jaljella/BONUS_MITTARI_KERROIN_AMMUSPELI, 10);
			ctx.font = "bold 12pt Verdana"
			ctx.fillText("Bonus: Hitaat viholliset", BONUS2_MITTARI_X_AMMUSPELI-20, BONUS2_MITTARI_Y_AMMUSPELI-12);
		}
		
		
		//Pelaajan pisteet
		var pisteTeksti = pelaaja.pisteet.toString();
		ctx.fillStyle = 'EE9A00';
		ctx.font = "bold 20pt sans-serif";
		ctx.fillText(pisteTeksti,PISTE_SIJAINTI_X_AMMUSPELI,PISTE_SIJAINTI_Y_AMMUSPELI);

		
		//Ammusten piirtäminen
		for (var i = 0; i < ammukset.length; ++i) {
			ctx.beginPath();
			//Ammus on happoammus
			if (ammukset[i].tyyppi == HAPPO_AMMUSPELI) {
				var ammusKuva = new Image(40, 40);
				
				if (ammukset[i].joukkue == VIHOLLISJOUKKUE_AMMUSPELI) {
					ammusKuva.src = graphs_AMMUSPELI[3];
				}
				
				if (ammukset[i].joukkue == PELAAJAJOUKKUE_AMMUSPELI) { 
					ammusKuva.src = graphs_AMMUSPELI[1];
				}
				
				if (ammukset[i].liikkeenMuutos == 0) {
					ctx.drawImage(ammusKuva, 0, 0, 40,40 , ammukset[i].sijaintiX-ammukset[i].leveys/2, ammukset[i].sijaintiY, 
									ammukset[i].leveys, ammukset[i].pituus);
				}
				
				else if (ammukset[i].liikkeenMuutos == 1) {
					ctx.drawImage(ammusKuva, 0, 40, 40,40 , ammukset[i].sijaintiX-ammukset[i].leveys/2, ammukset[i].sijaintiY, 
									ammukset[i].leveys, ammukset[i].pituus);
				}
				
				else if (ammukset[i].liikkeenMuutos == 2) {
					ctx.drawImage(ammusKuva, 0, 80, 40,40 , ammukset[i].sijaintiX-ammukset[i].leveys/2, ammukset[i].sijaintiY, 
									ammukset[i].leveys, ammukset[i].pituus);
				}
				
				//Onko ammuksella bonusta
				if (ammukset[i].bonus > 0) {
					ctx.fillStyle = 'rgba(225, 0, 150, 0.4)';
					ctx.beginPath();
					ctx.arc(ammukset[i].sijaintiX, ammukset[i].sijaintiY+20, BONUS_AMMUS_SADE_AMMUSPELI, 0, Math.PI*2, true);
					ctx.fill();
				}
				continue;
			}
			
			//Ammus on piikki
			else if (ammukset[i].tyyppi == PIIKKI_AMMUSPELI) {
				ctx.fillStyle = PIIKKI_VARI_AMMUSPELI;
				if (ammukset[i].joukkue == VIHOLLISJOUKKUE_AMMUSPELI) {
					ctx.moveTo(ammukset[i].sijaintiX-10, ammukset[i].sijaintiY);
					ctx.lineTo(ammukset[i].sijaintiX, ammukset[i].sijaintiY+30);
					ctx.lineTo(ammukset[i].sijaintiX+10, ammukset[i].sijaintiY);
					ctx.lineTo(ammukset[i].sijaintiX, ammukset[i].sijaintiY-8);
					ctx.lineTo(ammukset[i].sijaintiX-10, ammukset[i].sijaintiY);
				}
				
				else {
					ctx.moveTo(ammukset[i].sijaintiX-10, ammukset[i].sijaintiY);
					ctx.lineTo(ammukset[i].sijaintiX, ammukset[i].sijaintiY-30);
					ctx.lineTo(ammukset[i].sijaintiX+10, ammukset[i].sijaintiY);
					ctx.lineTo(ammukset[i].sijaintiX, ammukset[i].sijaintiY+8);
					ctx.lineTo(ammukset[i].sijaintiX-10, ammukset[i].sijaintiY);
				}
				ctx.fill();
				ctx.stroke();
				//Onko ammuksella bonusta
				if (ammukset[i].bonus > 0) {
					ctx.fillStyle = 'rgba(225, 0, 150, 0.4)';
					ctx.beginPath();
					ctx.arc(ammukset[i].sijaintiX, ammukset[i].sijaintiY, BONUS_AMMUS_SADE_AMMUSPELI, 0, Math.PI*2, true);
					ctx.fill();
				}
				continue;
			}
			
			//Ammus on tulipallo
			else if (ammukset[i].tyyppi == TULIPALLO_AMMUSPELI) {
				var ammusKuva = new Image(40, 40);
				ammusKuva.crossOrigin = "";
				
				if (ammukset[i].joukkue == VIHOLLISJOUKKUE_AMMUSPELI) {
					ammusKuva.src = graphs_AMMUSPELI[4];
				}
				
				if (ammukset[i].joukkue == PELAAJAJOUKKUE_AMMUSPELI) { 
					ammusKuva.src = graphs_AMMUSPELI[2];
				}
				
				if (ammukset[i].liikkeenMuutos == 0) {
					ctx.drawImage(ammusKuva, 0, 0, 40,40 , ammukset[i].sijaintiX-ammukset[i].leveys/2, ammukset[i].sijaintiY, 
									ammukset[i].leveys, ammukset[i].pituus);
				}
				
				else if (ammukset[i].liikkeenMuutos == 1) {
					ctx.drawImage(ammusKuva, 0, 40, 40,40 , ammukset[i].sijaintiX-ammukset[i].leveys/2, ammukset[i].sijaintiY, 
									ammukset[i].leveys, ammukset[i].pituus);
				}
				
				else if (ammukset[i].liikkeenMuutos == 2) {
					ctx.drawImage(ammusKuva, 0, 80, 40,40 , ammukset[i].sijaintiX-ammukset[i].leveys/2, ammukset[i].sijaintiY, 
									ammukset[i].leveys, ammukset[i].pituus);
				}
				
				//Onko ammuksella bonusta
				if (ammukset[i].bonus > 0) {
					ctx.fillStyle = 'rgba(225, 0, 150, 0.4)';
					ctx.beginPath();
					ctx.arc(ammukset[i].sijaintiX, ammukset[i].sijaintiY+20, BONUS_AMMUS_SADE_AMMUSPELI, 0, Math.PI*2, true);
					ctx.fill();
				}
				continue;
			}
		}

		//Räjähdykset
		for (var i = rajahdykset.length-1; i >= 0; --i) {
			if (rajahdykset[i].vaihe >= 5) {
				delete rajahdykset[i].vaihe;
				rajahdykset.splice(i, 1);
				continue;
			}
			
			if (rajahdykset[i].tyyppi == HAPPO_AMMUSPELI) { ctx.fillStyle = HAPPO_VARI_AMMUSPELI; }
			else if (rajahdykset[i].tyyppi == PIIKKI_AMMUSPELI) { ctx.fillStyle = PIIKKI_VARI_AMMUSPELI; }
			else if (rajahdykset[i].tyyppi == TULIPALLO_AMMUSPELI) { ctx.fillStyle = TULIPALLO_VARI_AMMUSPELI; }
			//Vasemmalle ylös lentävä osa
			ctx.fillRect(rajahdykset[i].sijaintiX-rajahdykset[i].vaihe*5-5, rajahdykset[i].sijaintiY-rajahdykset[i].vaihe*5,10,10);
			ctx.strokeRect(rajahdykset[i].sijaintiX-rajahdykset[i].vaihe*5-5, rajahdykset[i].sijaintiY-rajahdykset[i].vaihe*5,10,10);
			//Vasemmalle alas lentävä osa
			ctx.fillRect(rajahdykset[i].sijaintiX-rajahdykset[i].vaihe*5-5, rajahdykset[i].sijaintiY+rajahdykset[i].vaihe*5,10,10);
			ctx.strokeRect(rajahdykset[i].sijaintiX-rajahdykset[i].vaihe*5-5, rajahdykset[i].sijaintiY+rajahdykset[i].vaihe*5,10,10);
			//Oikealle ylös lentävä osa
			ctx.fillRect(rajahdykset[i].sijaintiX+rajahdykset[i].vaihe*5-5, rajahdykset[i].sijaintiY-rajahdykset[i].vaihe*5,10,10);
			ctx.strokeRect(rajahdykset[i].sijaintiX+rajahdykset[i].vaihe*5-5, rajahdykset[i].sijaintiY-rajahdykset[i].vaihe*5,10,10);
			//Oikealla alas lentävä osa
			ctx.fillRect(rajahdykset[i].sijaintiX+rajahdykset[i].vaihe*5-5, rajahdykset[i].sijaintiY+rajahdykset[i].vaihe*5,10,10);
			ctx.strokeRect(rajahdykset[i].sijaintiX+rajahdykset[i].vaihe*5-5, rajahdykset[i].sijaintiY+rajahdykset[i].vaihe*5,10,10);
			rajahdykset[i].vaihe += 1;
			
		}
	}

	//Näytetään pelaajan loppupisteet
	var pelinLopetus_AMMUSPELI = function(ctx, pisteet, nimi) {
	//Estetään useamman uuden pelin aloitus
		var saakoJatkaa = true;
	//Muutetaan stringiksi
		var tulosNimi = new String(nimi);
		//Uusimmat pisteet ja nimi
		top_tulokset.push(pisteet);
		top_nimet.push(tulosNimi);

	//Bubble-sort taulukon alkioille
		for (var i = top_tulokset.length-1; i > 0; --i) {
			if (top_tulokset[i] > top_tulokset[i-1]) {
				var apu = top_tulokset[i-1];
				var apu2 = top_nimet[i-1];
				top_tulokset[i-1] = top_tulokset[i];
				top_nimet[i-1] = top_nimet[i];
				top_tulokset[i] = apu;
				top_nimet[i] = apu2;
				continue;
			}
		}

		ctx.fillStyle = "rgba(255, 255, 40, 0.8)";
		ctx.fillRect(140, 360, 300, 275);
		ctx.fillStyle = 'red';
		ctx.font = "bold  30pt sans-serif";
		ctx.fillText("Top 3:",225, 400);

		//Tulostetaan top3-lista
		for (var i = 0; i < top_tulokset.length; ++i) {
			if (i == 3) { break; }
			//tulosNimessä on jostain syystä tullut pilkkuja väliin, ilmeisesti String.fromCharCode(event.keyCode) seurauksena.
			ctx.fillText((i+1)+". "+top_nimet[i].charAt(0)+top_nimet[i].charAt(2)+top_nimet[i].charAt(4)+" - "+top_tulokset[i], 150, 460+i*70);
		}
		
		if (top_tulokset.length > 3) {
			top_tulokset.pop();
			top_nimet.pop();
		}
		delete tulosNimi;
		
		//Lopputekstit
		var pisteTeksti = pisteet.toString();
		ctx.fillStyle = "rgba(255, 255, 40, 0.8)";
		ctx.fillRect(85, 215, 390, 50);
		ctx.fillRect(40, 270, 500, 40);
		ctx.fillStyle = 'red';
		ctx.font = "bold  28pt sans-serif";
		ctx.fillText("Pisteesi: "+pisteTeksti,95,250);
		ctx.font = "bold 18pt sans-serif";
		ctx.fillText("Paina 'enter' aloittaaksesi uuden pelin",50,300);
		//Väliyönnin painaminen aloittaa uuden pelin
		document.onkeydown = function(event) { if (event.keyCode == '13' && saakoJatkaa) {
													saakoJatkaa = false;
													document.onkeydown = function() {true;}
													ctx.clearRect(0,0,CANVAS_LEVEYS_AMMUSPELI, CANVAS_KORKEUS_AMMUSPELI);
													uusi_AMMUSPELI();
												} 
											}
	}

	//Pelaaja antaa NIMI_MAX_AMMUSPELI-pituisen nimen
	var annaNimi_AMMUSPELI = function(ctx, pisteet, tulosNimi) {
		//Onko pelaaja painanut jotain nappia
		document.onkeydown = function(event) {
			var nimi = "";
			//Talleteaan pelaajan painaman merkin numeroarvo
			tulosNimi.push(String.fromCharCode(event.keyCode));
			for (var i = 0; i < tulosNimi.length; ++i) {
				var luku = tulosNimi[i];
				nimi += luku;
			}
			//Piirretään pelajaan nimi canvakselle
			ctx.fillText(nimi, 220, 150);
			//Onko annettu 3 kirjainta
			if (tulosNimi.length >= NIMI_MAX_AMMUSPELI) { pelinLopetus_AMMUSPELI(ctx, pisteet, tulosNimi); }
		}
		//Jos nimi ei ole vielä 3 merkin mittainen, kutsutaan tätä funktiota
		if (tulosNimi.length < NIMI_MAX_AMMUSPELI) { annaNimi_AMMUSPELI(ctx, pisteet, tulosNimi); }
	}
	
/////Pelin aloittavat funktiot//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	var piirraAlkuruutu_AMMUSPELI = function() {
		var alkuruutu = new Image();
		alkuruutu.crossOrigin = "";
		alkuruutu.src = graphs_AMMUSPELI[0];
		alkuruutu.onload = function() { 
			ctx.drawImage(alkuruutu, 0, 0);
			saakoAloittaa_AMMUSPELI = true;
		}
	}
	
	this.aloita_AMMUSPELI = function() {
		uusi_AMMUSPELI();
	}
	
	var uusi_AMMUSPELI = function() {
		//Taulukko, jossa on ammukset
		var ammukset = new Array();
		//Ajastin huolehtii uusien ammusten luomisesta
		var ajastin = new Ajastin_AMMUSPELI();
		//Pelaaja pitää sisällään käyttäjän pistesaldon ja elämäpisteet
		var pelaaja = new Pelaaja_AMMUSPELI();
		//Taulukko, jossa on ammusten törmäyksestä tapahtuvat räjähdykset
		var rajahdykset = new Array();
		//Pelimaailman pohjan piirtäminen
		piirraAlku_AMMUSPELI(canvas, ctx);
		//Peliä 40ms välein kutsuva interval
		var timer = setInterval( function() { peli_AMMUSPELI(canvas, ctx, ammukset, ajastin, pelaaja, timer, rajahdykset); }, 40);
	}
	
	var piirraLatausRuutu = function() {
		ctx.fillStyle = 'white';
		ctx.font = "bold  36pt sans-serif";
		ctx.fillText("Loading", 100, 100);
	}
	
/////////////////PELIN ALOITTAVAT FUNKTIOT PÄÄTTYY//////////////////////////////////////////////////////////////////////////////////////////////////
	
	this.ResourcePath = 'Resources/Ammuspeli/';
	
	this.ResourceHandlers = {
		graf: function(resources) {
			for (var i in resources) {
				graphs_AMMUSPELI.push(resources[i]);
			}
		},
		audio: function(resources) {
			for (var i in resources) {
				audios_AMMUSPELI.push(resources[i]);
			}
		}
	}
		
	
	this.Resources = {
		graf: ['graf/alkuohje.png', 'graf/happo.png', 'graf/tulipallo.png', 'graf/happo_inverted.png', 'graf/tulipallo_inverted.png'],
		audio: ['audio/Collision8-Bit.ogg']
	}
	
	var unloadedResources = {graf: true, audio: true};
	
	this.ResourcesLoaded = function(resource){
		piirraLatausRuutu();
		unloadedResources[resource] = false;
		var AllResourcesLoaded = true;
		for ( var i in unloadedResources ){
			if (unloadedResources[i] == true){
				AllResourcesLoaded = false;
			}
		}
		
		if ( AllResourcesLoaded == true ){
			piirraAlkuruutu_AMMUSPELI();
			LivelyApp.StartApp();
		}
		
	}
	
	this.GetCanvas = function() {
		return canvas;
	}
	
	this.GetState = function(){
		var state = {
			tulokset: top_tulokset,
			nimet: top_nimet
		};
		
		return state;
	}
	
	this.SetState = function(state){
		top_tulokset = state.tulokset;
		top_nimet = state.nimet;
	}
	
	this.SetLivelyApp = function(app){
		LivelyApp = app;
	}
	
	this.StartApp = function(){
		Lively3D.AllowAppStart(LivelyApp);
	}
}

var initAmmuspeli = function(Ammuspeli){
	var ammuspeliApp = new Ammuspeli();
	saakoAloittaa_AMMUSPELI = false;
	Lively3D.LoadResources(ammuspeliApp);
	var onkeypressFunc = function(event) {
		if (saakoAloittaa_AMMUSPELI) {
			saakoAloittaa_AMMUSPELI = false;
			ammuspeliApp.aloita_AMMUSPELI();					
		}
	}
	
	ammuspeliApp.EventListeners = {"keypress": onkeypressFunc};
	
	return ammuspeliApp;
}

Lively3D.AddApplication("Ammuspeli", Ammuspeli, initAmmuspeli);