/*------------column chart---------------*/
function Column(drawComponents,parsedJSON,index){
	this.index=index;		
	Chart.call(this,drawComponents,parsedJSON);
	this.xDiff=this.parsedJSON.TickList.xAxis[this.parsedJSON.TickList.xAxis.length-1].getTime()-this.parsedJSON.TickList.xAxis[0].getTime();
	this.yDiff=this.parsedJSON.TickList.yAxis[this.index][this.parsedJSON.TickList.yAxis[index].length-1]-this.parsedJSON.TickList.yAxis[this.index][0];		
}

Column.prototype = Object.create(Chart.prototype);
Column.prototype.constructor = Column;

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
	for(var k=0;k<this.parsedJSON.data[this.index].length;k++){
		
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
		column[k]=this.drawComponents.drawRect(x,point.y,"column",height,width,"",this.parsedJSON.data[this.index][k][1],(svgLeft+x),(svgTop+point.y));
	}
	return column;
}

Column.prototype.disPatchMouseOver=function(left,top,column, event){	
	CustomMouseRollOver.detail.x=left;
	CustomMouseRollOver.detail.y=top;
	for(var i=0; i<column.length; i++){	
		for(var j=0; j<column[i].length; j++){				
			column[i][j].graphics.dispatchEvent(CustomMouseRollOver);
		}
	}
}

Column.prototype.highlightColumn=function(columns,tooltips,limits,event){
	var left= event.detail.x;
	var top=event.detail.y;	
	var x;
	var padding,tooltipHeight;

	tooltipHeight=25;
	padding=10;

	var textLength,tooltipWidth;
	var pointX,pointY;
	var topLimit=limits.topLimit
	var bottomLimit= limits.bottomLimit;
	var rightLimit= limits.rightLimit;
	var leftLimit= limits.leftLimit;
	
	for(var i=0,len=columns.length; i<len; i++){
		for(var j=0,len1=columns[i].length; j<len1; j++){
			if(columns[i][j].config.x==left){
				columns[i][j].graphics.setAttribute("style","fill:#B74947;");
				tooltips[i].text.graphics.innerHTML=columns[i][j].config.value;
				textLength=columns[i][j].config.value.toString().length;				
				tooltipWidth=textLength*padding+2*padding;
				tooltips[i].rect.graphics.setAttribute("width",tooltipWidth.toString());
				tooltips[i].rect.graphics.setAttribute("height",tooltipHeight);
				top=columns[i][j].config.y;
				pointX=Number(left)+10;			
				pointY=top-5;		
				if((rightLimit -15) <(left+tooltipWidth)){
					pointX=left-tooltipWidth;
				}

				if((leftLimit+20) > pointX){
					pointX=left+leftLimit-pointX+15;
				}

				if((top+tooltipHeight)>(bottomLimit)){
					pointY=top+tooltipHeight;
					while((pointY+tooltipHeight-5)>=(bottomLimit)){
						pointY--;					
					}											
				}

				if((top)< (topLimit +5)){
					pointY=top;
					while(pointY<=topLimit+25){					
						pointY++;
					}
				}				
				tooltips[i].rect.graphics.setAttribute("x",pointX);
				tooltips[i].rect.graphics.setAttribute("y",pointY-10);
				tooltips[i].text.graphics.setAttribute("x",(pointX+Math.floor((tooltipWidth-(textLength*padding))/2)));			
				tooltips[i].text.graphics.setAttribute("y",(pointY+7));
				tooltips[i].rect.graphics.setAttribute("visibility","visible");
				tooltips[i].text.graphics.setAttribute("visibility","visible");

			}
		}
	}
}

Column.prototype.unfocus=function(columns,tooltips,event){		
	for(var i=0,len=columns.length; i<len; i++){
		for(var j=0, len1=columns[i].length; j<len1; j++){
			columns[i][j].graphics.setAttribute("style","fill:#3E72CC;");	
			tooltips[i].rect.graphics.setAttribute("visibility","hidden");	
			tooltips[i].text.graphics.setAttribute("visibility","hidden");			
		}	

	}
}

Column.prototype.reset=function(columns){	
	for(var i=0,len=columns.length; i< len; i++){
		for(var j=0, len1=columns[i].length; j<len1; j++){
			columns[i][j].graphics.setAttribute("style","fill:#3E72CC");				
		}
	}		
}

Column.prototype.select=function(columns){
	var selectSpace=document.getElementById("selectSpace");
	var x1=parseInt(selectSpace.style.left);
	var y1=parseInt(selectSpace.style.top);
	var x2=x1+ parseInt(selectSpace.style.width);
	var y2=y1+parseInt(selectSpace.style.height);
	var maxX=-1,minX=99999;
	var x,y,h,w;		

	for(var i=0,len=columns.length; i< columns.length; i++) {
		for(var j=0,len1=columns[i].length; j<len1; j++) {	
			x=Number(columns[i][j].config.absoluteX);
			y=Number(columns[i][j].config.absoluteY);
			h=Number(columns[i][j].config.height);
			w=Number(columns[i][j].config.width);

			if((x1 < x + w && x2 > x && y1 < y + h && y2 > y)){				
				columns[i][j].graphics.setAttribute("style","fill:#B74947");	
				if(minX>=Number(columns[i][j].config.x))
					minX=Number(columns[i][j].config.x);
				if(maxX<Number(columns[i][j].config.x))
					maxX=Number(columns[i][j].config.x);
			}
			else
				columns[i][j].graphics.setAttribute("style","fill:#3E72CC");
		}			
	}

	for(var i=0,len=columns.length; i< columns.length; i++){
		for(var j=0,len1=columns[i].length; j<len1; j++){	
			if((Number(columns[i][j].config.x))>=minX && Number(columns[i][j].config.x) <= maxX){
				columns[i][j].graphics.setAttribute("style","fill:#B74947");					
			}	
		}		
	}
}