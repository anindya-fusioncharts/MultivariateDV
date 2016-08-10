/*---------cross tab------------*/
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
	var k;
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