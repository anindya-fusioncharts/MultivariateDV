"use strict";
/*---------------render start--------------*/
window.render=function(rawJSON,selector){
	var chartRenderEngine= new Engine(rawJSON,selector);
	chartRenderEngine.crossHairHandler();
}

/*----------render end----------------------------*/

/*--------drawcomponent start------------------------*/

function DrawComponents(selector,width,height,marginX,marginY,topMarginY){
	var percntWidth;
	this.marginX=marginX;
	this.marginY=marginY;
	this.topMarginY=topMarginY;
	this.paddingX0= this.marginX;	
	this.paddingY0= this.marginY;	
	this.paddingX1=this.marginX-5;
	this.paddingY1=this.marginY-5
	this.paddingX2=this.marginX-10;
	this.paddingY2=this.marginY-10;
	this.paddingTextX=this.marginX-30;
	this.paddingTextY=this.marginY-40;

	this.rootElement = document.getElementById(selector);		
	this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");	
	this.height=height;
	this.width=width;

	this.svg.setAttribute("class","chart");
	this.svg.setAttribute("height", this.height);			
	this.svg.setAttribute("width", this.width);

	percntWidth=Math.ceil((this.width)/window.innerWidth*100);
	percntWidth=percntWidth+0.32*percntWidth;
	this.svg.setAttribute("style","width:"+percntWidth+"%;");

	this.rootElement.appendChild(this.svg);	
	return this;
}

DrawComponents.prototype.coordinate=function(x,y){
	return {
		x: x + this.marginX ,
		y: this.height - (y+this.marginY)	
	};
}

DrawComponents.prototype.xShift=function(item,min,diff){
	return Math.floor(((item-min)/diff)*(this.width));
}

DrawComponents.prototype.yShift=function(item,min,diff){
	return Math.floor(((item-min)/(diff))*(this.height-this.marginY-7-this.topMarginY));
}

DrawComponents.prototype.drawLine=function(point1,point2,classIn){
	var line = document.createElementNS("http://www.w3.org/2000/svg","line");	
																				
	line.setAttribute("x1", point1.x);			
	line.setAttribute("y1", point1.y);			
	line.setAttribute("x2", point2.x);
	line.setAttribute("y2", point2.y);
	line.setAttribute("class",classIn);
	this.svg.appendChild(line);	
	return line;	
}

DrawComponents.prototype.drawText=function(point,dy,textIn,classIn,angle){
	var text=document.createElementNS("http://www.w3.org/2000/svg", "text");	

	text.setAttribute("x",(point.x).toString());
	text.setAttribute("y",(point.y).toString());
	text.innerHTML=textIn;	
	text.setAttribute('fill','#555');
	if(angle){
		var transform="rotate("+angle+" "+(point.x).toString()+","+(point.y).toString()+")";		
		text.setAttribute("transform",transform);	
	}

	text.setAttribute("class",classIn);	
	this.svg.appendChild(text);
	return text;
}

DrawComponents.prototype.drawPolygon=function(points,classIn){
	var polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");			
	polyline.setAttribute("points",points);		
	polyline.setAttribute("class",classIn);
	this.svg.appendChild(polyline);
	return polyline;
}

DrawComponents.prototype.drawPath=function(_path,classIn){
	var path=document.createElementNS("http://www.w3.org/2000/svg","path");
	path.setAttribute("d",_path);
	path.setAttribute("class",classIn);
	path.setAttribute("style","stroke:#1e7ac9; stroke-width:3; fill:transparent");

	this.svg.appendChild(path);
	return path;
}

DrawComponents.prototype.drawCircle= function(point,r,classIn,Xdata,Ydata){
	var circle=document.createElementNS("http://www.w3.org/2000/svg", "circle");	
	circle.setAttribute("cx",point.x);
	circle.setAttribute("cy",point.y);
	circle.setAttribute("r",r);
	circle.setAttribute("fill","#ffffff");
	circle.setAttribute("Xdata",Xdata);
	circle.setAttribute("Ydata",Ydata);
	circle.setAttribute("class",classIn);
	circle.style.zIndex=1000;
	this.svg.appendChild(circle);	
	return circle;
}

DrawComponents.prototype.drawRect=function(x,y,classIn,h,w,style,value,absoluteX,absoluteY){
	var rect=document.createElementNS("http://www.w3.org/2000/svg","rect");
	style=style||"stroke:#3E72CC;fill:#3E72CC";
	value=value||"";
	rect.setAttribute("x",x);
	rect.setAttribute("y",y);
	rect.setAttribute("height",h);
	rect.setAttribute("width",w);
	rect.setAttribute("style",style);
	rect.setAttribute("class",classIn);
	rect.setAttribute("value",value);
	rect.setAttribute("absoluteX",absoluteX);
	rect.setAttribute("absoluteY",absoluteY);		
	this.svg.appendChild(rect);
	return rect;
}

/*------drawcomponent end-------*/
/*--------tooltip start------------*/
function Tooltip(drawComponents,point,class_Tooltip,class_TooltipText){
	this.drawComponents=drawComponents;
	this.point=point;
	var tooltip=this.drawComponents.drawRect(point.x+5,point.y,class_Tooltip,10,0,"stroke:#8D6D60 ;stroke-width:1; fill:#FDD9CB");		
	var tooltipText=this.drawComponents.drawText(point,"","",class_TooltipText,0);

	tooltipText.setAttribute("style",'fill: #8D6D60');		
	tooltipText.setAttribute("class",class_TooltipText);

	this.drawComponents.svg.insertBefore(tooltip,tooltipText);
	return {
		"rect":tooltip,
		"text":tooltipText
	}
}


/*---------------tooltip end--------------*/
/*------axis start----------*/

function Axis(drawComponents){
	this.drawcomponents=drawComponents;
}

function YAxis(parsedJSON,drawComponents,iChart,tickPosDown){
	this.parsedJSON=parsedJSON;
	this.iChart=iChart;
	this.tickPosDown=tickPosDown;
	Axis.call(this,drawComponents);
}

YAxis.prototype.axisLine=function(tickList){
	var len,diff,plotFactor;
	var y1;
	var x1;
	var y2;
	var x2;	
	var points={},point1={},point2={};
	
	var ticktext;
	var min;
	
	len=tickList.length;

	diff=Math.abs(tickList[len-1]-tickList[0]);
	
	min=tickList[0];

	for(var i=0; i<tickList.length; i++){
		if(tickList[0]<0)
			y1=this.drawcomponents.yShift(tickList[i]-tickList[0],tickList[0]-tickList[0],diff);
		else
			y1=this.drawcomponents.yShift(tickList[i],tickList[0],diff);
		x1=-(this.drawcomponents.marginX-this.drawcomponents.paddingX2-4);
		y2=y1;
		x2=-(this.drawcomponents.marginX-this.drawcomponents.paddingX1-4);						
		point1=this.drawcomponents.coordinate(x1,y1);
		point2=this.drawcomponents.coordinate(x2,y2);		
		this.drawcomponents.drawLine(point1,point2,"yAxisTick");
	}			
}	

YAxis.prototype.yAxisTicksText=function(tickList){
	var y1;
	var x1;
	var y2;
	var x2;	
	var point={},point0={},point1={},point2={},point3={};
	var points;
	var tickText;
	var count=0;
	var yPrev=0;
	var yAxisTicks=[];
	var diff;
	var fixedDecimal;

	diff=Math.abs(tickList[tickList.length-1]-tickList[0]);
	for(var i=0; i<tickList.length; i++){
		if(tickList[0]<0)
			y1=this.drawcomponents.yShift(tickList[i]-tickList[0],tickList[0]-tickList[0],diff);
		else
			y1=this.drawcomponents.yShift(tickList[i],tickList[0],diff);
		x1=-(this.drawcomponents.marginX-this.drawcomponents.paddingX2-4);
		y2=y1;
		x2=-(this.drawcomponents.marginX-this.drawcomponents.paddingX1-4);

		point1=this.drawcomponents.coordinate(x1,y1);
		point2=this.drawcomponents.coordinate(x2,y2);	
		
		if( Math.abs(tickList[i])<1000){
			point=this.drawcomponents.coordinate(-(this.drawcomponents.marginX-this.drawcomponents.paddingTextX-8),(y1-4));
			if(tickList[tickList.length-1]<1)
				fixedDecimal=tickList[tickList.length-1].toString().length-2;
			else
				fixedDecimal=2;
			if(tickList[i]==0)
				tickText='0';
			else{
				if(tickList[i]%1==0)
					tickText=tickList[i].toString();
				else
					tickText=tickList[i].toFixed(fixedDecimal).toString();
			}							
		}
		if(Math.abs(tickList[i])>=1000 && Math.abs(tickList[i])<1000000){			
			tickText=tickList[i]/1000 + "" +"K";			
		}
		if(Math.abs(tickList[i])>=1000000 && Math.abs(tickList[i])<1000000000){		
			tickText=tickList[i]/1000000 + "" +"M";			
		}
		if(Math.abs(tickList[i])>=1000000000 && Math.abs(tickList[i])<1000000000000){		
			tickText=tickList[i]/1000000000 + "" +"B";			
		}
		if(Math.abs(tickList[i])>=1000000000000){		
			tickText=tickList[i]/1000000000000 + "" +"T";		
		}	

		point0=this.drawcomponents.coordinate(-1,y1);
		point1=this.drawcomponents.coordinate(this.drawcomponents.width,y1);
		point2=this.drawcomponents.coordinate(this.drawcomponents.width,yPrev);
		point3=this.drawcomponents.coordinate(-1,yPrev);

		points= point0.x+ ','+point0.y+' '+point1.x+','+point1.y+' '+point2.x+','+point2.y+' '+point3.x+','+point3.y+' '+point0.x+ ','+point0.y;
		if(i!=0)
			if(count%2==0)
				this.drawcomponents.drawPolygon(points,"divDash1");		
			else
				this.drawcomponents.drawPolygon(points,"divDash2");				
		count++;
		yPrev=y1;

		point=this.drawcomponents.coordinate(-(this.drawcomponents.marginX-this.drawcomponents.paddingTextX-8),(y1-5));
		yAxisTicks[i]=this.drawcomponents.drawText(point,".35em",tickText,"yAxisTickText");
	}
	return yAxisTicks;
}

YAxis.prototype.title=function(tickPosDown,title){
	var points,point;
	var point0;
	var point1;
	var point2;
	var point3;

	if(tickPosDown){
		point0=this.drawcomponents.coordinate((0),(-this.drawcomponents.marginY+2));
		point1=this.drawcomponents.coordinate((this.drawcomponents.width),(-this.drawcomponents.marginY+2));
		point2=this.drawcomponents.coordinate((this.drawcomponents.width),(-this.drawcomponents.marginY+37));
		point3=this.drawcomponents.coordinate((0),(-this.drawcomponents.marginY+37));

		points= point0.x+ ','+point0.y+' '+point1.x+','+point1.y +' '+point2.x+','+point2.y+' '+point3.x+','+point3.y+' '+point0.x+ ','+point0.y;
		this.drawcomponents.drawPolygon(points,"titles");
		point={
			x:point2.x/2,
			y:point2.y+27
		};
	}else{
		point0=this.drawcomponents.coordinate((0),(this.drawcomponents.height -this.drawcomponents.topMarginY-30));
		point1=this.drawcomponents.coordinate((this.drawcomponents.width),(this.drawcomponents.height-this.drawcomponents.topMarginY-30));
		point2=this.drawcomponents.coordinate((this.drawcomponents.width),(this.drawcomponents.height-this.drawcomponents.topMarginY-78));
		point3=this.drawcomponents.coordinate((0),(this.drawcomponents.height-this.drawcomponents.topMarginY-78));

		points= point0.x+ ','+point0.y+' '+point1.x+','+point1.y +' '+point2.x+','+point2.y+' '+point3.x+','+point3.y+' '+point0.x+ ','+point0.y;		
		this.drawcomponents.drawPolygon(points,"titles");		
		point={
			x:point2.x/2,
			y:point2.y-15
		};
	}	
	return this.drawcomponents.drawText(point,".5em",title,"yAxisTitle","0");		
}

YAxis.prototype.draw=function(){
	this.axisLine(this.parsedJSON.TickList.yAxis[this.iChart]);
	this.yAxisTicksText(this.parsedJSON.TickList.yAxis[this.iChart]);
	this.title(this.tickPosDown,this.parsedJSON.chart.yMap[this.iChart].toUpperCase())	
}

function XAxis(parsedJSON,drawComponents,chartCount,tickPosDown){
	this.parsedJSON=parsedJSON;
	this.chartCount=chartCount;
	this.tickPosDown=tickPosDown;
	Axis.call(this,drawComponents);
}

XAxis.prototype.xAxisTicksText=function(chartCount,tickList,tickPosDown){
	var x1= -(this.drawcomponents.marginX-this.drawcomponents.paddingX1)-1;
	var y1=0;
	var x2=this.drawcomponents.width;
	var y2=0;
	var point,point1,point2;
	var xTickStr="";
	var dateMax=tickList[tickList.length-1];
	var dateMin=tickList[0];
	var xDiff=tickList[tickList.length-1].getTime()-tickList[0].getTime();

		if(tickPosDown){				

			if(noChartRow>0) {

				for(var i=0; i<tickList.length; i++){
					x1=this.drawcomponents.xShift(tickList[i].getTime(),tickList[0].getTime(),xDiff);
					y1=(this.drawcomponents.height-this.drawcomponents.marginY-this.drawcomponents.topMarginY-8);
					x2=x1;
					y2=(this.drawcomponents.height-this.drawcomponents.marginY-this.drawcomponents.topMarginY);				
					point=this.drawcomponents.coordinate((x1+2),(y1+this.drawcomponents.marginY+5));
					
					point1=this.drawcomponents.coordinate(x1,y1);
					point2=this.drawcomponents.coordinate(x2,y2);
					
					this.drawcomponents.drawLine(point1,point2,"xAxis");

					if(xDiff<(1000*3600*24) && dateMax.getDate()==dateMin.getDate() && dateMax.getMonth()==dateMin.getMonth() && dateMax.getFullYear()==dateMin.getFullYear())
						xTickStr=tickList[i].toString().split(' ')[4];
					if(dateMax.getDate()!=dateMin.getDate() && dateMax.getMonth()==dateMin.getMonth() && dateMax.getFullYear()==dateMin.getFullYear())
						xTickStr=tickList[i].toString().split(' ')[0];
					if(dateMax.getMonth()!=dateMin.getMonth() && dateMax.getFullYear()==dateMin.getFullYear())
						xTickStr=tickList[i].toString().split(' ')[1]+ "'"+tickList[i].toString().split(' ')[2];
					if(dateMax.getFullYear()!=dateMin.getFullYear())
						xTickStr=tickList[i].toString().split(' ')[1]+ "'"+tickList[i].toString().split(' ')[2] + ","+tickList[i].toString().split(' ')[3][2]+''+tickList[i].toString().split(' ')[3][3];					
					this.drawcomponents.drawText(point,".35em",xTickStr,"xAxisTickText1","270");					
				}
			noChartRow--;
			}
		}else{
			if((this.parsedJSON.chart.yMap.length - chartCount)<noChartRow && (this.parsedJSON.chart.yMap.length - chartCount)>= 0){
				for(var i=0; i<tickList.length; i++){
					x1=this.drawcomponents.xShift(tickList[i].getTime(),tickList[0].getTime(),xDiff);
					y1=-(this.drawcomponents.marginY-this.drawcomponents.marginY);
					x2=x1;
					y2=-(this.drawcomponents.marginY-this.drawcomponents.marginY+5);				
					
					point=this.drawcomponents.coordinate((x1+2),(y1-8));
					
					point1=this.drawcomponents.coordinate(x1,y1);
					point2=this.drawcomponents.coordinate(x2,y2);
					
					this.drawcomponents.drawLine(point1,point2,"xAxis");

					if(xDiff<(1000*3600*24) && dateMax.getDate()==dateMin.getDate() && dateMax.getMonth()==dateMin.getMonth() && dateMax.getFullYear()==dateMin.getFullYear())
						xTickStr=tickList[i].toString().split(' ')[4];
					if(dateMax.getDate()!=dateMin.getDate() && dateMax.getMonth()==dateMin.getMonth() && dateMax.getFullYear()==dateMin.getFullYear())
						xTickStr=tickList[i].toString().split(' ')[0];
					if(dateMax.getMonth()!=dateMin.getMonth() && dateMax.getFullYear()==dateMin.getFullYear())
						xTickStr=tickList[i].toString().split(' ')[1]+ "'"+tickList[i].toString().split(' ')[2];
					if(dateMax.getFullYear()!=dateMin.getFullYear())
						xTickStr=tickList[i].toString().split(' ')[1]+ "'"+tickList[i].toString().split(' ')[2] + ","+tickList[i].toString().split(' ')[3][2]+''+tickList[i].toString().split(' ')[3][3];					
					
					this.drawcomponents.drawText(point,".35em",xTickStr,"xAxisTickText1","270");				
				}

					
		}
	}	
}

XAxis.prototype.draw=function(){
	this.xAxisTicksText(this.chartCount,this.parsedJSON.TickList.xAxis,this.tickPosDown);
}
/*------axis end----------*/

/*---------chart body start---------*/
function chart(drawComponents,parsedJSON){
	this.drawComponents=drawComponents;
	this.parsedJSON=parsedJSON;

}

function LineChart(drawComponents,parsedJSON,index){
	this.index=index;		
	chart.call(this,drawComponents,parsedJSON);
	this.xDiff=this.parsedJSON.TickList.xAxis[this.parsedJSON.TickList.xAxis.length-1].getTime()-this.parsedJSON.TickList.xAxis[0].getTime();
	this.yDiff=this.parsedJSON.TickList.yAxis[this.index][this.parsedJSON.TickList.yAxis[index].length-1]-this.parsedJSON.TickList.yAxis[this.index][0];	
}

LineChart.prototype.path=function(){
	var x,y;
	var point={};
	var path;
	var paths;

	paths='M';
	for(var i=0; i< this.parsedJSON.data[this.index].length; i++){
		x=this.parsedJSON.data[this.index][i][0];
		y=this.parsedJSON.data[this.index][i][1];
		point.x=this.drawComponents.xShift(x,this.parsedJSON.TickList.xAxis[0],this.xDiff);
		point.y=this.drawComponents.yShift(y,this.parsedJSON.TickList.yAxis[this.index][0],this.yDiff);
		point=this.drawComponents.coordinate(point.x,point.y);
		paths=paths+point.x+' '+point.y+', ';
	}
	path=this.drawComponents.drawPath(paths,"path");
	return path;	
}

LineChart.prototype.anchor=function(){
	var x,y;
	var point={};
	var anchor=[];
	for(var i=0; i< this.parsedJSON.data[this.index].length; i++){
		x=this.parsedJSON.data[this.index][i][0];
		y=this.parsedJSON.data[this.index][i][1];
		point.x=this.drawComponents.xShift(x,this.parsedJSON.TickList.xAxis[0],this.xDiff);
		point.y=this.drawComponents.yShift(y,this.parsedJSON.TickList.yAxis[this.index][0],this.yDiff);
		point=this.drawComponents.coordinate(point.x,point.y);
		anchor[i]=this.drawComponents.drawCircle(point,5,"plotPoint",x,y)
	}
	return anchor;	
}

LineChart.prototype.chartArea=function(){
	var point={};
	var point1={};
	var x,y,h,w;
	var _chartArea;
	var left;
	x=this.parsedJSON.TickList.xAxis[0].getTime();
	y=this.parsedJSON.TickList.yAxis[this.index][this.parsedJSON.TickList.yAxis[this.index].length-1];	
	point.x=this.drawComponents.xShift(x,this.parsedJSON.TickList.xAxis[0],this.xDiff);
	point.y=this.drawComponents.yShift(y,this.parsedJSON.TickList.yAxis[this.index][0],this.yDiff);
	point=this.drawComponents.coordinate(point.x,point.y+3);

	w=Math.abs(this.parsedJSON.chart.width);
	h=Math.abs(this.parsedJSON.chart.height-this.parsedJSON.chart.topMarginY-this.parsedJSON.chart.marginY);
			
	_chartArea=this.drawComponents.drawRect(point.x,point.y,"chartArea",h,w,"stroke:#black; fill:transparent");
	
	left=_chartArea.getBoundingClientRect().left;

	_chartArea.addEventListener("mousemove",function(){
			CustomMouseRollOver.detail.x=Math.ceil(event.clientX-left);
			_chartArea.dispatchEvent(CustomMouseRollOver);
		});

	return _chartArea;
}

LineChart.prototype.hairLine=function(){
	var point={};
	var point1={};
	var x,y,h,w;
	var _hairLine;

	x=this.parsedJSON.TickList.xAxis[0].getTime();
	y=this.parsedJSON.TickList.yAxis[this.index][this.parsedJSON.TickList.yAxis[this.index].length-1];	
	point.x=this.drawComponents.xShift(x,this.parsedJSON.TickList.xAxis[0],this.xDiff);
	point.y=this.drawComponents.yShift(y,this.parsedJSON.TickList.yAxis[this.index][0],this.yDiff);
	point=this.drawComponents.coordinate(point.x,point.y);

	point1.x=point.x;
	point1.y=point.y+Math.abs(this.parsedJSON.chart.height-this.parsedJSON.chart.topMarginY-this.parsedJSON.chart.marginY)-6;
	_hairLine=this.drawComponents.drawLine(point,point1,"HairLine");
	return _hairLine;
}

LineChart.prototype.crossHair=function(){
	var _chartArea,_hairLine;
	_chartArea=this.chartArea();	
	_hairLine=this.hairLine();
	_hairLine.setAttribute("visibility","hidden");
	return {
		"_chartArea":_chartArea,
		"_hairLine":_hairLine
	};
}

function Column(drawComponents,parsedJSON,index){
	this.index=index;		
	chart.call(this,drawComponents,parsedJSON);
	this.xDiff=this.parsedJSON.TickList.xAxis[this.parsedJSON.TickList.xAxis.length-1].getTime()-this.parsedJSON.TickList.xAxis[0].getTime();
	this.yDiff=this.parsedJSON.TickList.yAxis[this.index][this.parsedJSON.TickList.yAxis[index].length-1]-this.parsedJSON.TickList.yAxis[this.index][0];		
}

Column.prototype.col=function(){
	var svgLeft,svgTop;
	var columnMinDiff;

	pointLowerLeftLimit=this.drawComponents.coordinate(0,0);

	pointRightLimit=this.drawComponents.xShift(this.parsedJSON.TickList.xAxis[this.parsedJSON.TickList.xAxis.length-1].getTime(),this.parsedJSON.TickList.xAxis[0].getTime(),this.xDiff)+chartDraw.marginX;
	
	if(i==0){

		for(var k=1;k<this.parsedJSON.data[this.index].length;k++){
			if(count<2){
				columnMinDiff=Math.abs(columnMinDiff-this.drawComponents.xShift(this.parsedJSON.data[this.index][k-1][0],this.parsedJSON.TickList.xAxis[0].getTime() ,this.xDiff));
				count++;
			} else{
				columnDiff=Math.abs(this.drawComponents.xShift(this.parsedJSON.data[this.index][k-1][0],this.parsedJSON.TickList.xAxis[0].getTime() ,xDiff)-chartDraw.xShift(this.parsedJSON.data[this.index][k][0],this.parsedJSON.TickList.xAxis[0].getTime() ,this.xDiff))
				if(columnMinDiff>columnDiff){
					columnMinDiff=columnDiff;	
				}
			}								
		}	

		columnMinDiff= Math.floor(columnMinDiff/2.2);				
	}	
	
	svgLeft=parseInt(this.drawComponents.svg.getBoundingClientRect().left);
	svgTop=parseInt(this.drawComponents.svg.getBoundingClientRect().top);

	for(var k=0;k<this.parsedJSON.data[this.index].length;k++){
		yDiff=this.parsedJSON.TickList.xAxis[this.index][this.parsedJSON.TickList.yAxis[this.index].length-1]-this.parsedJSON.TickList.yAxis[this.index][0];					
		point=this.drawComponents.coordinate(this.drawComponents.xShift(this.parsedJSON.data[this.index][k][0],this.parsedJSON.TickList.xAxis[0].getTime(),this.xDiff), this.drawComponents.yShift(this.parsedJSON.data[this.index][k][1],this.parsedJSON.TickList.yAxis[this.index][0],yDiff));		

		width=(columnMinDiff%2==0)?columnMinDiff:(columnMinDiff-1);
		x=point.x-width/2;
		if(x<pointLowerLeftLimit.x){
			x=x+Math.abs(x-pointLowerLeftLimit.x)-0.5;
		}			
		if((x+width)>pointRightLimit)
			x=x-Math.abs(x+width-pointRightLimit);

		height=Math.abs(point.y-pointLowerLeftLimit.y);	
		if(height==0){
			point.y-=3;
			height=3;
		}
		DataSet[this.index][k][2]=x;
		DataSet[this.index][k][3]=point.y;
		column=this.drawComponents.drawRect(x,point.y,"column",height,width,"",DataSet[i][k][1],(svgLeft+x),(svgTop+point.y));								
	}

}
/*---------chart body end------------*/
/*--------Engine start---------*/
function Engine(rawJSON,selector){
	var noChart;
	var tickPosDown;
	var _drawComponents;
	var _yAxis,_xAxis;
	var _lineChart,_columnChart;
	var point0={};
	this._crossHair=[],
	this._anchors=[];
	this._tooltip=[];
	this.selector=selector;
	this.parsedJSON=parseJSON(rawJSON);

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
	noChart=this.parsedJSON.chart.yMap.length;
	for(var i=0; i<noChart; i++){	
		this._anchors[i]=[];	
		_drawComponents= new DrawComponents(selector,this.parsedJSON.chart.width,this.parsedJSON.chart.height,this.parsedJSON.chart.marginX,this.parsedJSON.chart.marginY,this.parsedJSON.chart.topMarginY);
		
		_yAxis=new YAxis(this.parsedJSON,_drawComponents,i,tickPosDown);
		_yAxis.draw();

		_xAxis=new XAxis(this.parsedJSON,_drawComponents,i+1,tickPosDown);
		_xAxis.draw();	
		if(this.parsedJSON.chart.type=='line'){
			_lineChart=new LineChart(_drawComponents,this.parsedJSON,i);
			_lineChart.path();
			this._anchors[i]=_lineChart.anchor();
			this._crossHair[i]=_lineChart.crossHair();
		}else{
			_columnChart=new Column(_drawComponents,this.parsedJSON,i);
		}

		point0.x=0;
		point0.y=0;
		this._tooltip[i]=new Tooltip(_drawComponents,point0,"tooltip","tooltipText");
	}
}

Engine.prototype.crossHairHandler=function(){
	var _this=this;
	var noChart=this.parsedJSON.chart.yMap.length;
	for(var i=0; i<noChart; i++){
		this._crossHair[i]._chartArea.addEventListener("mouserollover",syncCrossHair.bind(_this));		
	}	
}

/*--------Engine end-------------*/
/*----------Event Handling Functions start------------*/
function syncCrossHair(e){
	var cx;
	var adjustingValue;
	var x;
	var keyIndex;
	var sX1,sx2,sY1,sY2;
	adjustingValue=this.parsedJSON.chart.marginX;
	x=e.detail.x+adjustingValue;
	for(var i=0; i<this._crossHair.length; i++){
		this._crossHair[i]._hairLine.setAttribute("visibility","visible");
		this._crossHair[i]._hairLine.setAttribute("x1",x);
		this._crossHair[i]._hairLine.setAttribute("x2",x);
		for(var j=0; j< this._anchors[i].length; j++){
			cx=this._anchors[i][j].getAttribute("cx");
			if((x-5)<=cx && (x+5)>=cx){
				this._anchors[i][j].setAttribute("r",7);
				this._anchors[i][j].setAttribute("style","fill:#f44336")
				this._tooltip[i].text.innerHTML=this._anchors[i][j].getAttribute("Ydata");
			}else{
				this._anchors[i][j].setAttribute("r",5);
				this._anchors[i][j].setAttribute("style","fill:#ffffff");
				if(j>0){
					if(x>=this._anchors[i][j-1].setAttribute("cx") && x<=this._anchors[i][j].setAttribute("cx")){

					}
				}
			}
		}
		this._tooltip[i].rect.setAttribute("visibility","hidden");
		this._tooltip[i].text.setAttribute("visibility","hidden");


	}
}
/*----------Event Handling Functions stop------------
/*-------global functions and variables start-----------*/
var noChartRow;
function tickspoistion(parsedJSON){
	var percntWidth;
	percntWidth=Math.ceil((parsedJSON.chart.width)/window.innerWidth*100);
	percntWidth=percntWidth+0.32*percntWidth;
	noChartRow=Math.floor(100/percntWidth);	
	if((parsedJSON.chart.yMap.length % noChartRow)==0)
		return false;
	else
		return true;
}

function countDecimals(value) {
    if (Math.floor(value) !== value)
        return value.toString().split(".")[1].length || 0;
    return 0;
}

function parseJSON(rawJSON){
	var noData,keys,flag;
	var uniqueKeys=[],
		DataSet=[];
	var internalDataStructure={};

	internalDataStructure.chart={};
	internalDataStructure.chart.caption=rawJSON.chart.caption || "Caption";
	internalDataStructure.chart.subCaption=rawJSON.chart.subCaption || "subCaption";
	internalDataStructure.chart.height=rawJSON.chart.height || 300;		
	internalDataStructure.chart.height=(internalDataStructure.chart.height>500 || internalDataStructure.chart.height<200) ? 300 : internalDataStructure.chart.height;
	internalDataStructure.chart.width= rawJSON.chart.width || 500;						
	internalDataStructure.chart.width=(internalDataStructure.chart.width>1000 || internalDataStructure.chart.width<200)?500: internalDataStructure.chart.width;
	internalDataStructure.chart.type=rawJSON.chart.type||"line";
	internalDataStructure.chart.marginX=80;
	internalDataStructure.chart.marginY=20;
	internalDataStructure.chart.topMarginY=60;
	internalDataStructure.chart.xMap=rawJSON.chart.xAxisMap;
	internalDataStructure.chart.type=rawJSON.chart.type;	

	for(var i=0,k=0; i<rawJSON.data.length; i++){
		keys=Object.keys(rawJSON.data[i]);
		
		if(k==0 && i==0)
			uniqueKeys[k]=keys[0];

		for(var j=0; j<keys.length; j++){
			flag=0;
			for(var l=0;l<uniqueKeys.length; l++){
				if(uniqueKeys[l]==keys[j]){
					flag=1;												
				}
			}
			if(flag==0 && keys[j]!=internalDataStructure.chart.xMap){
				k++;
				uniqueKeys[k]=keys[j];							
			}				
		}				
	}

	internalDataStructure.chart.yMap=uniqueKeys;
	internalDataStructure.data=[];
	
	for(var i=0; i<internalDataStructure.chart.yMap.length; i++){
		DataSet[i]=[];
		for(var j=0,k=0;j<rawJSON.data.length;j++){				
			if (rawJSON.data[j][internalDataStructure.chart.yMap[i]]!= undefined && rawJSON.data[j][internalDataStructure.chart.xMap] != undefined){
				DataSet[i][k]=[];
				DataSet[i][k][0]=new Date(rawJSON.data[j][internalDataStructure.chart.xMap].toString()).getTime();										
				DataSet[i][k][1]=rawJSON.data[j][internalDataStructure.chart.yMap[i]];
				k++;									
			}											
		}
		DataSet[i]=sortByDate(DataSet[i]);
	}

	internalDataStructure.data=DataSet;

	return internalDataStructure;
}

function sortByDate(data){
    var swapped;
    do {
        swapped = false;
        for (var i=0; i < data.length-1; i++) {
            if (data[i][0] > data[i+1][0]) {
                var temp = data[i];
                data[i] = data[i+1];
                data[i+1] = temp;
                swapped = true;
            }
        }
    } while (swapped);
    return data;
}

function yRangeTicks(parsedJSON){
	var diff,diffDigit,computedMin,computedMax;
	var negativeFlag=0, negatedmin=0;
	var max,min,max_countDecimals,countDeci;
	var ticks=[];
	var decimalFlag,count;
	var interval;
	var tickValue;
	var index;
	var d,r;	
	var flag=0;

	decimalFlag=1;

	for(var i=0; i<parsedJSON.data.length; i++){
		max=undefined;
		min=undefined;
		for(var j=0; j<parsedJSON.data[i].length; j++){
			if(max==undefined && min==undefined){
				max=parsedJSON.data[i][j][1];
				min=parsedJSON.data[i][j][1];
			}
			if(max<parsedJSON.data[i][j][1])
				max=parsedJSON.data[i][j][1];
			if(min>parsedJSON.data[i][j][1])
				min=parsedJSON.data[i][j][1];
			countDeci=countDecimals(parsedJSON.data[i][j][1]);
			if(max_countDecimals<countDeci)
				max_countDecimals=countDeci;
		}
		
		negatedmin=0;
		//------------ new min
		
			if(min <0) {
				min*=-1;

				count=-1;
				d=min;
				while(d){
					r=Math.floor(d%10);
					d=Math.floor(d/10);
					count++;
				}			
				computedMin=(r+1) * Math.pow(10,count) *-1;
				negativeFlag=1;
			} else {
				count=-1;
				d=min;
				while(d){
					r=Math.floor(d%10);
					d=Math.floor(d/10);
					count++;
				}

				if(count)
					computedMin=r * Math.pow(10,count);
				else
					computedMin=0;
			}
			//------------- new max
			if(max<0){
				max*=-1;
				count=-1;
				d=max;
				while(d){
					r=Math.floor(d%10);
					d=Math.floor(d/10);
					count++;
				}

				if(count)
					computedMax=r * Math.pow(10,count);
				else
					computedMax=0;			
			
			}else{
				count=-1;
				d=max;
				while(d){
					r=Math.floor(d%10);
					d=Math.floor(d/10);
					count++;
				}			
				
				computedMax=(r+1) * Math.pow(10,count);	
			}

			if(computedMax%1!=0)
				computedMax=parseInt(computedMax.toString().split('.')[0]+''+computedMax.toString().split('.')[1].substring(0,max_countDecimals));

			if(computedMin%1!=0)
				computedMin=parseInt(computedMin.toString().split('.')[0]+''+computedMin.toString().split('.')[1].substring(0,max_countDecimals));


			if(negativeFlag==1){
				negatedmin=computedMin;
				computedMax-=computedMin;
				computedMin=0;
			}
			if(Math.abs(computedMax)<1){
				decimalFlag=-1;
			}
			//------ticks
		
			index=2;


			if(parseInt(computedMax.toString()[1])==0)
				index=1;
			diffDigit=Math.floor(computedMax/Math.pow(10,(computedMax.toString().length-index)))-Math.floor(computedMin/Math.pow(10,(computedMax.toString().length-index)));

			if (Math.floor(computedMin/Math.pow(10,(computedMax.toString().length-index)))==0)
				computedMin=0;

			if(diffDigit>=0 && diffDigit<=1)
				interval=0.25;
			else if(diffDigit>=0 && diffDigit<=1)
				interval=0.25;
			else if(diffDigit>1 && diffDigit<=2)
				interval=0.5;
			else if(diffDigit>2 && diffDigit<=6)
				interval=1;
			else if(diffDigit>6 && diffDigit<=12)
				interval=2;
			else if(diffDigit>12 && diffDigit<=20)
				interval=4;
			else if(diffDigit>20 && diffDigit<=30)
				interval=5;
			else if(diffDigit>30 && diffDigit<40)
				interval=7;
			else if(diffDigit>=40)
				interval=10;	
		
		
		ticks[i]=[];
		ticks[i][0]=computedMin + negatedmin;

		tickValue=ticks[i][0];
		for(var j=1; tickValue<=(computedMax+negatedmin);j++){
		ticks[i][j]=ticks[i][j-1]  + interval*Math.pow(10,decimalFlag*(computedMax.toString().length-index));		
		tickValue=ticks[i][j];			
		}								
	}
	return ticks;		
}

function xRangeTicks(parsedJSON){
	var diff, diffDigit;
	var interval;
	var index;
	var tickValue;
	var ticks=[];
	var xMax,xMin;
	var intermediateDate;
	var fixedDecimal;

	xMax=undefined;
	xMin=undefined;
	
	for (var i=0,k=0; i<parsedJSON.data.length; i++){	
		for(var j=0;j<parsedJSON.data[i].length; j++) {
			if(xMax==undefined && xMin==undefined){
				xMax=new Date(parsedJSON.data[i][j][0]);
				xMin=new Date(parsedJSON.data[i][j][0]);
			}
			var date=new Date(parsedJSON.data[i][j][0]);
			if(xMax < date)
				xMax=date;
			if(xMin > date)
				xMin=date;

			k++;
		}
	}
	diff=xMax.getTime() - xMin.getTime();
	
	if(parsedJSON.chart.height>=800)
		interval=10;
	if(k<=10 && parsedJSON.chart.height<800)
		interval=Math.floor(diff/(k-1));		
	else
		interval=Math.floor(diff/9);	

	if(parsedJSON.chart.height<300)
		interval=6;

	tickValue=xMin;
	ticks[0]=xMin;
	for(var i=1 ;tickValue<=xMax; i++){
		
		intermediateDate=new Date(parseInt(ticks[i-1].getTime()+ interval)) ;
		if(intermediateDate<=xMax) {
			ticks[i]=intermediateDate;
		}	
		
		tickValue=intermediateDate;
	}
	return ticks;		
}

function bSearch(data,key){
	var minIndex = 0;
    var maxIndex = data.length - 1;
    var currentIndex;
    var currentElement;
 	
    while (minIndex <= maxIndex) {
        currentIndex = Math.floor((minIndex + maxIndex) / 2);
        currentElement = data[currentIndex][2];

        if ((currentElement+5) < key) {
            minIndex = currentIndex + 1;
        }
        else if ((currentElement-5) > key) {
            maxIndex = currentIndex - 1;
        }
        else {
            return currentIndex;
        }
    }	 
    return -1*(currentIndex+1);
}

/*-------global functions end----------------*/
/*---------custom event listener start--------------*/
var CustomMouseRollOver=new CustomEvent("mouserollover",{"detail":{x:"",y:"",left:""}});
/*-----------custom event listener stop----------------*/
/*---------on window resize-----------*/
window.onresize = function() {
    location.reload();
}