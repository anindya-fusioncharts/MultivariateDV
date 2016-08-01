/*--------Engine start---------*/
function Engine(rawJSON,selector){

	
	
	this._drawComponents=[];
	this._crossHair=[],
	this._anchors=[];
	this._tooltip=[];
	this._columns=[];
	this.selector=selector;
	this.parsedJSON=parseJSON(rawJSON);
}
Engine.prototype.render=function(){
	var noChart;
	var tickPosDown;
	var _drawComponents;
	var _yAxis,_xAxis;
	var _lineChart,_columnChart;
	var point0={};
	var count=0;
	var _this=this;


	
	if(typeof this.customSort == "function"){
		this.customSort();
	}

	this.parsedJSON.TickList={};
	this.parsedJSON.TickList.xAxis=[];
	this.parsedJSON.TickList.xAxis=xRangeTicks(this.parsedJSON);

	this.parsedJSON.TickList.yAxis=[];
	this.parsedJSON.TickList.yAxis=yRangeTicks(this.parsedJSON);

	tickPosDown=tickspoistion(this.parsedJSON);
	
	if(tickPosDown){
		this.parsedJSON.chart.marginY=45;
		this.parsedJSON.chart.topMarginY=75;
	}else{
		this.parsedJSON.chart.marginY=75;
		this.parsedJSON.chart.topMarginY=45;										
	}
	selectDiv(this.selector);

	drawChartHeading(this.selector,this.parsedJSON);
	noChart=this.parsedJSON.chart.yMap.length;
	for(var i=0; i<noChart; i++){	
		this._anchors[i]=[];	
		this._drawComponents[i]= new DrawComponents(this.selector,this.parsedJSON.chart.width,this.parsedJSON.chart.height,this.parsedJSON.chart.marginX,this.parsedJSON.chart.marginY,this.parsedJSON.chart.topMarginY);
		
		_yAxis=new YAxis(this.parsedJSON,this._drawComponents[i],i,tickPosDown);
		_yAxis.draw();

		_xAxis=new XAxis(this.parsedJSON,this._drawComponents[i],i+1,tickPosDown);
		_xAxis.draw();	
		if(this.parsedJSON.chart.type=='line'){
			_lineChart=new LineChart(this._drawComponents[i],this.parsedJSON,i);
			_lineChart.path();
			this._anchors[i]=_lineChart.anchor();
			this._crossHair[i]=_lineChart.crossHair();
		}
		if(this.parsedJSON.chart.type=='column'){
			_columnChart=new Column(this._drawComponents[i],this.parsedJSON,i);
			this._columns[i]=_columnChart.col(count);

		}

		point0.x=0;
		point0.y=0;
		this._tooltip[i]=new Tooltip(this._drawComponents[i],point0,"tooltip","tooltipText");
		
		if(this.parsedJSON.chart.type=='line'){
			this._drawComponents[i].svg.addEventListener("mousedown",drawSelectSpace.bind(null,this._drawComponents[i],this.selector,"line"));
			this._drawComponents[i].svg.addEventListener("mousemove",resizeSelectSpace.bind(null,this._drawComponents[i],this.selector,"line"));
			this._drawComponents[i].svg.addEventListener("mouseup",destroySelectSpace.bind(null,this._drawComponents[i],this.selector,"line"));	
			this._drawComponents[i].svg.addEventListener("mouseleave",destroySelectSpace.bind(null,this._drawComponents[i],this.selector,"line"));			
	
		}

		if(this.parsedJSON.chart.type=='column'){
			this._drawComponents[i].svg.addEventListener("mousedown",drawSelectSpace.bind(null,this._drawComponents[i],this.selector,"column"));
			this._drawComponents[i].svg.addEventListener("mousemove",resizeSelectSpace.bind(null,this._drawComponents[i],this.selector,"column"));
			this._drawComponents[i].svg.addEventListener("mouseup",destroySelectSpace.bind(null,this._drawComponents[i],this.selector,"column"));	
			this._drawComponents[i].svg.addEventListener("mouseleave",destroySelectSpace.bind(null,this._drawComponents[i],this.selector,"column"));			

		}
	}
}

Engine.prototype.crossHairHandler=function(){
	var _this=this;
	var noChart=this.parsedJSON.chart.yMap.length;
	for(var i=0; i<noChart; i++){
		this._crossHair[i]._chartArea.addEventListener("mouserollover",syncCrossHair.bind(_this));		
		this._crossHair[i]._chartArea.addEventListener("mouseout",hideCrossHair);		
	}	
}

/*--------Engine end-------------*/
