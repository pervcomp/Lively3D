var Stocks = function(){

	var stockCanvasElement;
	var stockDrawingContext;

	this.initStocks = function(canvasElement) {
		if (!canvasElement) {
			canvasElement = document.createElement("canvas");
			canvasElement.setAttribute("style", "display: none");
			canvasElement.id = "stocks_canvas";
			//document.body.appendChild(canvasElement);
		}
		stockCanvasElement = canvasElement;
		stockCanvasElement.width = 512;
		stockCanvasElement.height = 512;
		
		stockDrawingContext = stockCanvasElement.getContext("2d");
		stockDrawingContext.fillStyle = "#F0F0F0";
		stockDrawingContext.fillRect(0,0,512,512); 
		stockDrawingContext.fillStyle = '#00f';
		stockDrawingContext.font = '20px sans-serif';
		stockDrawingContext.textBaseline = 'top';
		stockDrawingContext.fillText('Nokia', 10, 5);
		stockDrawingContext.strokeRect(5,3,150,30);

		stockDrawingContext.fillText('Microsoft', 170, 5);
		stockDrawingContext.strokeRect(165,3,150,30);

		stockDrawingContext.fillText('Intel', 330, 5);
		stockDrawingContext.strokeRect(325,3,150,30);
		
	// 	getStockValue("NASDAQ:MSFT");
	}

	this.getStockValue = function(name) {
		// http://finance.google.com/finance/info?q=NASDAQ:MSFT
		$.getJSON('http://finance.google.com/finance/info?callback=?&q=' + name, 
			function(obj) {
				// var obj = $.parseJSON(data.substring(3));
				if(obj[0].l) {
					stockDrawingContext.fillStyle = '#00f';
					stockDrawingContext.font = '128px sans-serif';
					stockDrawingContext.textBaseline = 'top';
					stockDrawingContext.fillText(obj[0].l, 80, 256);
					stockDrawingContext.font = '48px sans-serif';
					stockDrawingContext.fillText(obj[0].ec + " (" + obj[0].ecp + "%)", 80, 400);
				}
				else {
					stockDrawingContext.fillStyle = '#00f';
					stockDrawingContext.font = '64px sans-serif';
					stockDrawingContext.fillText("ERROR: Can not get stock data.", 120, 256);
				}
			}
		);
	}
	
	this.Open = function(){
		//ohjelman käynnistys jota kutsutaan kun ohjelma avataan työpöydältä
		console.log("Stocks: open");
	}
	
	this.Close = function(){
		//ohjelman sulkeminen jota kutsutaan kun avoin ohjelma suljetaan
		console.log("Stocks: close");

	}
	
	this.GetCanvas = function(){
		return stockCanvasElement;
	}

	var LivelyApp;
	this.SetLivelyApp = function(app){
		LivelyApp = app;
	}
	
	this.StartApp = function(){
		Lively3D.AllowAppStart(LivelyApp);
	}
};

var StocksInit = function(Stocks){
	var stocks = new Stocks();
	
	var stockclickFunc = function(data){
		// When the map is clicked, the canvas is updated
		stocks.initStocks(stocks.GetCanvas());
		var stockDrawingContext = stocks.GetCanvas().getContext('2d');
		var x = data.coord[0];
		var y = data.coord[1];
		if(y > 3 && y < 33) {
			if(x < 165) {
				stockDrawingContext.fillStyle = '#00f';
				stockDrawingContext.font = '64px sans-serif';
				stockDrawingContext.textBaseline = 'middle';
				stockDrawingContext.fillText("Nokia", 80, 150);	
				stocks.getStockValue("NYSE:NOK");
			}
			if(x < 325 && x > 165) {
				stockDrawingContext.fillStyle = '#00f';
				stockDrawingContext.font = '64px sans-serif';
				stockDrawingContext.textBaseline = 'middle';
				stockDrawingContext.fillText("Microsoft", 80, 150);
				stocks.getStockValue("NASDAQ:MSFT");
			}
			if(x > 325) {
				stockDrawingContext.fillStyle = '#00f';
				stockDrawingContext.font = '64px sans-serif';
				stockDrawingContext.textBaseline = 'middle';
				stockDrawingContext.fillText("Intel", 80, 150);	
				stocks.getStockValue("NASDAQ:INTC");
			}
		}
	};

	stocks.initStocks();
	stocks.EventListeners = {"click": stockclickFunc };
	return stocks;
};

var app = Lively3D.AddApplication('Stocks', Stocks, StocksInit);

app.StartApp();