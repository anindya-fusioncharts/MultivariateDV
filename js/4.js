/*--------Engine start---------*/
function Engine(rawJSON,selector){

	
	
	this._drawComponents=[];
	this._crossHair=[],
	this._anchors=[];
	this._tooltip=[];
	this._columns=[];
	this.selector=selector;
	this.parsedJSON=parseJSON(rawJSON,selector);	
}
Engine.prototype.render=function(){
		if(this.parsedJSON.chart.type=='line'){
			this.lineChart();
		}
		
		if(this.parsedJSON.chart.type=='column'){
			this.columnChart();
		}
		if(this.parsedJSON.chart.type=='crosstab'){
			this.crossTab();
		}
		
}

Engine.prototype.lineChart=function(){
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
	
		_lineChart=new LineChart(this._drawComponents[i],this.parsedJSON,i);
		_lineChart.path();
		this._anchors[i]=_lineChart.anchor();
		this._crossHair[i]=_lineChart.crossHair();
	
		point0.x=0;
		point0.y=0;
		this._tooltip[i]=new Tooltip(this._drawComponents[i],point0,"tooltip","tooltipText");
			
		this._drawComponents[i].svg.addEventListener("mousedown",drawSelectSpace.bind(null,this._drawComponents[i],this.selector,"line"));
		this._drawComponents[i].svg.addEventListener("mousemove",resizeSelectSpace.bind(null,this._drawComponents[i],this.selector,"line"));
		this._drawComponents[i].svg.addEventListener("mouseup",destroySelectSpace.bind(null,this._drawComponents[i],this.selector,"line"));	
		this._drawComponents[i].svg.addEventListener("mouseleave",destroySelectSpace.bind(null,this._drawComponents[i],this.selector,"line"));			
	}		
}

Engine.prototype.columnChart=function(){
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
	
		_columnChart=new Column(this._drawComponents[i],this.parsedJSON,i);
		
		this._columns[i]=_columnChart.col(count);
		point0.x=0;
		point0.y=0;
		this._tooltip[i]=new Tooltip(this._drawComponents[i],point0,"tooltip","tooltipText");	

		this._drawComponents[i].svg.addEventListener("mousedown",drawSelectSpace.bind(null,this._drawComponents[i],this.selector,"column"));
		this._drawComponents[i].svg.addEventListener("mousemove",resizeSelectSpace.bind(null,this._drawComponents[i],this.selector,"column"));
		this._drawComponents[i].svg.addEventListener("mouseup",destroySelectSpace.bind(null,this._drawComponents[i],this.selector,"column"));	
		this._drawComponents[i].svg.addEventListener("mouseleave",destroySelectSpace.bind(null,this._drawComponents[i],this.selector,"column"));			
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

Engine.prototype.crossTab=function(){
	var n=0,m=0;
	var heightPerRow=30,heightHeader=30,heightFooter=70;
	var marginX;
	this._drawComponentsCharts=[];
	this.parsedJSON.ticks={};
	this.parsedJSON.ticks.alterYaxis=crosstabYticks(this.parsedJSON.data);
	this.parsedJSON.ticks.ordinalAlterXaxis=this.parsedJSON.chart.subCategoryList;	

	this.widthScreen=window.innerWidth-60;
	this.widthPerSubChart=Math.ceil(this.widthScreen/(this.parsedJSON.chart.tab_titlesList.length+1));
	var crossTab=new CrossTab(this.parsedJSON);	
	this._drawComponents[n]= new DrawComponents(this.selector,this.widthScreen,heightHeader,10,0,0,"noPercent");	
	crossTab.header(this._drawComponents[n],this.widthPerSubChart);
	n++;	
	for(var i=0; i<this.parsedJSON.chart.categoryList.length; i++){		
		this._drawComponents[n]= new DrawComponents(this.selector,this.widthPerSubChart,(heightPerRow*this.parsedJSON.chart.subCategoryList[i].length),10,0,0,"noPercent");
		crossTab.category(this._drawComponents[n],this.parsedJSON.chart.categoryList[i],this.parsedJSON.chart.subCategoryList[i],heightPerRow);		
		for(var j=0; j<this.parsedJSON.chart.tab_titlesList.length; j++){	
			this._drawComponentsCharts[m]= new DrawComponents(this.selector,this.widthPerSubChart,(heightPerRow*this.parsedJSON.chart.subCategoryList[i].length),0,0,0,"noPercent");
			crossTab.chartArea(this._drawComponentsCharts[m],heightPerRow,i,j);
			m++;
		}
		n++;
	}
	this._drawComponents[n]= new DrawComponents(this.selector,this.widthScreen,heightFooter,10,0,0,"noPercent");	
	crossTab.footer(this._drawComponents[n],this.widthPerSubChart);
}

/*--------Engine end-------------*/
