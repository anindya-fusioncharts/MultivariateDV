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
	var svgLeft,svgTop;
	svgLeft=parseInt(this.drawComponents.svg.getBoundingClientRect().left);
	svgTop=parseInt(this.drawComponents.svg.getBoundingClientRect().top);
	DataSet[this.index]=[];
	for(var i=0; i< this.parsedJSON.data[this.index].length; i++){
		x=this.parsedJSON.data[this.index][i][0];
		y=this.parsedJSON.data[this.index][i][1];
		point.x=this.drawComponents.xShift(x,this.parsedJSON.TickList.xAxis[0],this.xDiff);
		point.y=this.drawComponents.yShift(y,this.parsedJSON.TickList.yAxis[this.index][0],this.yDiff);
		point=this.drawComponents.coordinate(point.x,point.y);

		anchor[i]=this.drawComponents.drawCircle(point,5,"plotPoint",x,y,(svgLeft+point.x),(svgTop+point.y));
		
		DataSet[this.index][i]=[];
		DataSet[this.index][i][0]=this.parsedJSON.data[this.index][i][0];
		DataSet[this.index][i][1]=this.parsedJSON.data[this.index][i][1];
		DataSet[this.index][i][2]=point.x;
		DataSet[this.index][i][3]=point.y;	
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

Column.prototype.col=function(count){
	var svgLeft,svgTop;
	var columnMinDiff,columnDiff;
	var point;
	var width,height;
	var x;
	var column=[];
	var pointLowerLeftLimit=this.drawComponents.coordinate(0,0);
	
	var pointRightLimit=this.drawComponents.xShift(this.parsedJSON.TickList.xAxis[this.parsedJSON.TickList.xAxis.length-1].getTime(),this.parsedJSON.TickList.xAxis[0].getTime(),this.xDiff)+this.drawComponents.marginX;
	
	columnMinDiff=0;
	

	for(var k=1;k<this.parsedJSON.data[0].length;k++){
		if(count<2){
			columnMinDiff=Math.abs(columnMinDiff-this.drawComponents.xShift(this.parsedJSON.data[0][k-1][0],this.parsedJSON.TickList.xAxis[0].getTime() ,this.xDiff));
			count++;
		} else{
			columnDiff=Math.abs(this.drawComponents.xShift(this.parsedJSON.data[0][k-1][0],this.parsedJSON.TickList.xAxis[0].getTime() ,this.xDiff)-this.drawComponents.xShift(this.parsedJSON.data[0][k][0],this.parsedJSON.TickList.xAxis[0].getTime() ,this.xDiff))
			if(columnMinDiff>columnDiff){
				columnMinDiff=columnDiff;	
			}
		}								
	}	
	columnMinDiff= Math.floor(columnMinDiff/2.2);				
	
	
	svgLeft=parseInt(this.drawComponents.svg.getBoundingClientRect().left);
	svgTop=parseInt(this.drawComponents.svg.getBoundingClientRect().top);
	DataSet[this.index]=[];
	for(var k=0;k<this.parsedJSON.data[this.index].length;k++){
		column[this.index]=[];
		point=this.drawComponents.coordinate(this.drawComponents.xShift(this.parsedJSON.data[this.index][k][0],this.parsedJSON.TickList.xAxis[0].getTime(),this.xDiff), this.drawComponents.yShift(this.parsedJSON.data[this.index][k][1],this.parsedJSON.TickList.yAxis[this.index][0],this.yDiff));		
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

		column[this.index][k]=this.drawComponents.drawRect(x,point.y,"column",height,width,"",this.parsedJSON.data[this.index][k][1],(svgLeft+x),(svgTop+point.y));								
		
		DataSet[this.index][k]=[];
		DataSet[this.index][k][0]=this.parsedJSON.data[this.index][k][0];
		DataSet[this.index][k][1]=this.parsedJSON.data[this.index][k][1];
		DataSet[this.index][k][2]=x;
		DataSet[this.index][k][3]=point.y;
		
		column[this.index][k].addEventListener("mousemove",disPatchMouseOver.bind(null, x, point.y));
		column[this.index][k].addEventListener("mouserollover",highlightColumn.bind(null,this.parsedJSON),false);
		column[this.index][k].addEventListener("mouseout",unfocus,false);

	}
	return column;
}
/*---------chart body end------------*/
