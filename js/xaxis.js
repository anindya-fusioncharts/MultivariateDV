

function XAxis(parsedJSON,drawComponents,chartCount,tickPosDown){
	this.parsedJSON=parsedJSON;
	this.chartCount=chartCount;
	this.tickPosDown=tickPosDown;
	Axis.call(this,drawComponents);
	
}


XAxis.prototype.dateRangeTicks=function(){
	var parsedJSON=this.parsedJSON;
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

XAxis.prototype.xAxisTicksText=function(chartCount,tickList,tickPosDown){
	var x1= -(this.drawcomponents.marginX-this.drawcomponents.paddingX1)-1;
	var y1=0;
	var x2=this.drawcomponents.width;
	var y2=0;
	var point,point1,point2;
	var xTickStr="";
	var dateMax=tickList[tickList.length-1];
	var dateMin=tickList[0];
	var xDiff;
	var interval;

	var width=this.parsedJSON.chart.width;
	var xAxisTickList=this.parsedJSON.TickList.xAxis;
	var colPadding=0;
	if(this.parsedJSON.chart.type == 'column' && this.parsedJSON.chart.xAxisType !='date'){
		interval=(width)/(this.parsedJSON.TickList.xAxis.length);
		colPadding=interval/2-interval/5;	
	}
	interval= (width-(colPadding*2))/(this.parsedJSON.TickList.xAxis.length-1);

	if (this.parsedJSON.chart.xAxisType=='date')
		xDiff=tickList[tickList.length-1].getTime()-tickList[0].getTime();

	if(tickPosDown){				

		if(noChartRow>0) {

			for(var i=0; i<tickList.length; i++){
				if (this.parsedJSON.chart.xAxisType=='date')
					x1=this.drawcomponents.xShift(tickList[i].getTime(),tickList[0].getTime(),xDiff);
				else
					x1=xAxisTickList.indexOf(x) * interval + colPadding;
				y1=(this.drawcomponents.height-this.drawcomponents.marginY-this.drawcomponents.topMarginY-8);
				x2=x1;
				y2=(this.drawcomponents.height-this.drawcomponents.marginY-this.drawcomponents.topMarginY);				
				point=this.drawcomponents.coordinate((x1+2),y2);
				
				point1=this.drawcomponents.coordinate(x1,y1);
				point2=this.drawcomponents.coordinate(x2,y2);
				
				this.drawcomponents.drawLine(point1,point2,"xAxis");

				xTickStr=formatDate(dateMax,dateMin,tickList[i]);
				this.drawcomponents.drawText(point,".35em",xTickStr,"xAxisTickText1","270");					
			}
			noChartRow--;
		}
	}else{
		if((this.parsedJSON.chart.yMap.length - chartCount)<noChartRow && (this.parsedJSON.chart.yMap.length - chartCount)>= 0){
			for(var i=0; i<tickList.length; i++){
				if (this.parsedJSON.chart.xAxisType=='date')
					x1=this.drawcomponents.xShift(tickList[i].getTime(),tickList[0].getTime(),xDiff);
				else
					x1=xAxisTickList.indexOf(tickList[i]) * interval  + colPadding;				
				y1=-(this.drawcomponents.marginY-this.drawcomponents.marginY);
				x2=x1;
				y2=-(this.drawcomponents.marginY-this.drawcomponents.marginY+5);				
				
				point=this.drawcomponents.coordinate((x1+2),(y2));
				
				point1=this.drawcomponents.coordinate(x1,y1);
				point2=this.drawcomponents.coordinate(x2,y2);
				
				this.drawcomponents.drawLine(point1,point2,"xAxis");
				if(this.parsedJSON.chart.xAxisType=='date')
					xTickStr=formatDate(dateMax,dateMin,tickList[i]);
				else
					xTickStr=tickList[i];

				this.drawcomponents.drawText(point,".35em",xTickStr,"xAxisTickText2","270");				
			}					
		}
	}	
}

XAxis.prototype.draw=function(){
	this.xAxisTicksText(this.chartCount,this.parsedJSON.TickList.xAxis,this.tickPosDown);
}