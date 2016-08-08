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

function CrossTab(parsedJSON){	
	this.parsedJSON=parsedJSON;
	this.xDiff=this.parsedJSON.ticks.alterYaxis[this.parsedJSON.ticks.alterYaxis.length-1]- this.parsedJSON.ticks.alterYaxis[0];
}

CrossTab.prototype.header=function(drawComponents,widthPerSection){
	var i=1;
	var point,point1,point2;
	this.widthPerSection=widthPerSection;
	point1=drawComponents.coordinate(drawComponents.marginX-11,1);
	point2=drawComponents.coordinate(drawComponents.width,1);
	drawComponents.drawLine(point1,point2,"headerline");

	point=drawComponents.coordinate(drawComponents.marginX,10);
	drawComponents.drawText(point,"",this.parsedJSON.chart.category_name,"headerText");
	
	point=drawComponents.coordinate(this.widthPerSection*0.45,10);
	drawComponents.drawText(point,"",this.parsedJSON.chart.sub_category_name,"headerText");
	
	point1=drawComponents.coordinate(i*this.widthPerSection-11,0);
	point2=drawComponents.coordinate(i*this.widthPerSection-11,drawComponents.height);
	drawComponents.drawLine(point1,point2,"headerline");
	
	for(var j=0; j<this.parsedJSON.chart.tab_titlesList.length; j++){
		point=drawComponents.coordinate((i*this.widthPerSection+(this.widthPerSection/2))-11,10);
		drawComponents.drawText(point,"",this.parsedJSON.chart.tab_titlesList[j],"tab_titles");
		i++;
		point1=drawComponents.coordinate(i*this.widthPerSection-11,0);
		point2=drawComponents.coordinate(i*this.widthPerSection-11,drawComponents.height);
		drawComponents.drawLine(point1,point2,"headerline");
	}
	point1=drawComponents.coordinate((i)*this.widthPerSection-11,0);
	point2=drawComponents.coordinate((i)*this.widthPerSection-11,drawComponents.height);
	drawComponents.drawLine(point1,point2,"headerline");
}

CrossTab.prototype.category=function(drawComponents,category_name,sub_category_names,heightPerRow){
	
	var point,point1,point2;
	var classIn;
	point=drawComponents.coordinate(drawComponents.marginX,(drawComponents.height-20));
	drawComponents.drawText(point,"",category_name,"categoryText");

	for(var i=0; i<sub_category_names.length; i++){	
		if(sub_category_names[i]=="Total")
			classIn="HighlightedText";
		else
			classIn="categoryText";
		point=drawComponents.coordinate(this.widthPerSection*0.45,(drawComponents.height-20-i*heightPerRow));
		drawComponents.drawText(point,"",sub_category_names[i],classIn);
	}

	point1=drawComponents.coordinate(drawComponents.marginX-11,1);
	point2=drawComponents.coordinate(this.widthPerSection,1);
	drawComponents.drawLine(point1,point2,"sectionline");

	point1=drawComponents.coordinate(this.widthPerSection-11,0);
	point2=drawComponents.coordinate(this.widthPerSection-11,drawComponents.height+20);
	drawComponents.drawLine(point1,point2,"sectionline");
}

CrossTab.prototype.chartArea=function(drawComponents,heightPerRow,iCategory,iTabTitles){
	var point,point1,point2;
	var width;
	var percent;
	var color;
	var style;
	var lossDiff,profitDiff;
	var scale,ratio;
	lossDiff=Math.abs(this.parsedJSON.maxLossPrcnt-this.parsedJSON.minLossPrcnt)/this.parsedJSON.chart.numberOfColorVarient;
	profitDiff=Math.abs(this.parsedJSON.maxProfitPrcnt-this.parsedJSON.minProfitPrcnt)/this.parsedJSON.chart.numberOfColorVarient;

	point1=drawComponents.coordinate(drawComponents.marginX,1);
	point2=drawComponents.coordinate(this.widthPerSection,1);
	drawComponents.drawLine(point1,point2,"sectionline");

	point1=drawComponents.coordinate(this.widthPerSection-1,0);
	point2=drawComponents.coordinate(this.widthPerSection-1,drawComponents.height+20);
	drawComponents.drawLine(point1,point2,"sectionline");

	for(k=0; k<this.parsedJSON.data[iCategory][iTabTitles].length; k++){	

		if(this.parsedJSON.data[iCategory][iTabTitles][k][1] != undefined){	
			point1=drawComponents.coordinate(0,(drawComponents.height-7-k*heightPerRow));
			point2=drawComponents.coordinate(drawComponents.xShift(this.parsedJSON.data[iCategory][iTabTitles][k][1],this.parsedJSON.ticks.alterYaxis[0],this.xDiff), (drawComponents.height-20-k*heightPerRow));				
			width=Math.abs(point1.x - point2.x);	

			if(this.parsedJSON.data[iCategory][iTabTitles][k][0]<0){
				ratio=Math.abs(this.parsedJSON.data[iCategory][iTabTitles][k][0])/this.parsedJSON.data[iCategory][iTabTitles][k][1];				
				color="#"+getGradient(this.parsedJSON.chart.maxLossColor,this.parsedJSON.chart.minLossColor,ratio);
			}
			if(this.parsedJSON.data[iCategory][iTabTitles][k][0]>=0){
				ratio=this.parsedJSON.data[iCategory][iTabTitles][k][0]/this.parsedJSON.data[iCategory][iTabTitles][k][1];				
				color="#"+getGradient(this.parsedJSON.chart.maxProfitColor,this.parsedJSON.chart.minProfitColor,ratio);
			} 		
			style="stroke:"+color+";fill:"+color;			
			drawComponents.drawRect(point1.x,point1.y,"bar",15,width,style);
		}
	}
}

CrossTab.prototype.footer=function(drawComponents,widthPerSection){
	var i=1;
	var point,point1,point2;
	var ticksPos;
	var tickText;
	this.widthPerSection=widthPerSection;
	point1=drawComponents.coordinate(i*this.widthPerSection-11,0);
	point2=drawComponents.coordinate(i*this.widthPerSection-11,drawComponents.height);
	drawComponents.drawLine(point1,point2,"headerline");
	
	ticksPos=this.widthPerSection/(this.parsedJSON.ticks.alterYaxis.length-1);

	
	for(var j=0; j<this.parsedJSON.chart.tab_titlesList.length; j++){
		i++;
		for(var k=0; k<this.parsedJSON.ticks.alterYaxis.length; k++){			
			point1=drawComponents.coordinate((i-1)*this.widthPerSection-11+k*ticksPos,drawComponents.height-10);
			point2=drawComponents.coordinate((i-1)*this.widthPerSection-11+k*ticksPos,drawComponents.height);
			drawComponents.drawLine(point1,point2,"footerline");
			if(this.parsedJSON.ticks.alterYaxis[k]>=1000)
				tickText=numberShrink(this.parsedJSON.ticks.alterYaxis[k]);
			else
				tickText=this.parsedJSON.ticks.alterYaxis[k];
			if(k==0){
				point=drawComponents.coordinate((i-1)*this.widthPerSection-7+k*ticksPos,drawComponents.height-25);
				drawComponents.drawText(point,"",tickText,"yaxisticksText");				
			}
			if(k>=1 && k<(this.parsedJSON.ticks.alterYaxis.length-1)){
				point=drawComponents.coordinate((i-1)*this.widthPerSection-20+k*ticksPos,drawComponents.height-25);
				drawComponents.drawText(point,"",tickText,"yaxisticksText");
			}

			point=drawComponents.coordinate((i-1)*this.widthPerSection-11+(this.widthPerSection/2),drawComponents.height-60);
			drawComponents.drawText(point,"",this.parsedJSON.chart.titles,"title");

		}

		point1=drawComponents.coordinate(i*this.widthPerSection-11,0);
		point2=drawComponents.coordinate(i*this.widthPerSection-11,drawComponents.height);
		drawComponents.drawLine(point1,point2,"headerline");
	}
	point1=drawComponents.coordinate((i)*this.widthPerSection-11,0);
	point2=drawComponents.coordinate((i)*this.widthPerSection-11,drawComponents.height);
	drawComponents.drawLine(point1,point2,"headerline");	
}
/*---------chart body end------------*/
