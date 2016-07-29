/*----------Event Handling Functions start------------*/
function disPatchMouseOver(left,top, event){
	var column= document.getElementsByClassName("column");	
	CustomMouseRollOver.detail.x=left;
	CustomMouseRollOver.detail.y=top;
	for(var i=0; i<column.length; i++){	
			column[i].dispatchEvent(CustomMouseRollOver);						
	}
}
function destroySelectSpace(svgOb,selector,type,event){
	mousedown=false;	
	var selectSpace=document.getElementById("selectSpace");
	selectSpace.style.left="0px";
	selectSpace.style.top="0px";
	selectSpace.style.width="0px";
	selectSpace.style.height="0px";	
}
function highlightColumn(parsedJSON,event){
	var left= event.detail.x;
	var top=event.detail.y;	
	var x;
	var padding,tooltipHeight;
	var column= document.getElementsByClassName("column");
	var tooltip= document.getElementsByClassName("tooltip");
	var tooltipText= document.getElementsByClassName("tooltipText");
	tooltipHeight=25;
	padding=10;

	var textLength,tooltipWidth;
	var pointX,pointY;
	var topLimit=parsedJSON.chart.marginY;
	var bottomLimit=parsedJSON.chart.height- parsedJSON.chart.marginY;
	var rightLimit=parsedJSON.chart.width;
	var leftLimit=parsedJSON.chart.marginX;
	
	for (var i=0; i< column.length;i++){
		if(column[i].getAttribute("x")==left){
			column[i].setAttribute("style","fill:#B74947;");			
		}
	}	
	
	for(var i=0; i<parsedJSON.data.length; i++){

		for(var j=0; j<parsedJSON.data[i].length; j++){

			if(Math.floor(DataSet[i][j][2])==Number(left)) {	
				tooltipText[i].innerHTML=DataSet[i][j][1];

				top=Number(DataSet[i][j][3]);
				left=Number(DataSet[i][j][2]);

				textLength=tooltipText[i].innerHTML.toString().length;
				
				tooltipWidth=textLength*padding+2*padding;

				tooltip[i].setAttribute("width",tooltipWidth.toString());
				tooltip[i].setAttribute("height",tooltipHeight);

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

				tooltip[i].setAttribute("x",pointX);
				
				tooltipText[i].setAttribute("x",(pointX+Math.floor((tooltipWidth-(textLength*padding))/2)));

				tooltip[i].setAttribute("y",pointY-10);
				tooltipText[i].setAttribute("y",(pointY+7));

				tooltip[i].setAttribute("visibility","visible");
				tooltipText[i].setAttribute("visibility","visible");
			}
		}
	}				
}

function unfocus(event){
	var column= document.getElementsByClassName("column");
	var tooltip= document.getElementsByClassName("tooltip");
	var tooltipText= document.getElementsByClassName("tooltipText");		
	for (var i=0,k=0; i< column.length;k++,i++){
		column[i].setAttribute("style","fill:#3E72CC;");
	}
	for(var k=0;k<tooltip.length;k++){
		tooltip[k].setAttribute("visibility","hidden");
		tooltipText[k].setAttribute("visibility","hidden");
	}
}

function drawSelectSpace(svgOb,selector,type,event){
	selectSpace.style.left="0px";
	selectSpace.style.top="0px";
	selectSpace.style.width="0px";
	selectSpace.style.height="0px";

	mousedown=true;

	if(type=="line")
		resetLine();
	else if(type=="column")
		resetCol();

	var x= event.clientX;
	var y=event.pageY;	

	selectSpace.style.left=x+"px";
	selectSpace.style.top=y+"px";
	mouseLeft=x;
	mouseTop=y;
}

function resetLine(){
	var plotPoint=document.getElementsByClassName("plotPoint");
	
	for(var i=0; i< plotPoint.length; i++){
		plotPoint[i].setAttribute("fill","#ffffff");
		plotPoint[i].setAttribute("r",4);	
	}		
}

function resetCol(){
	var column=document.getElementsByClassName("column");
	
	for(var i=0; i< column.length; i++){
		column[i].setAttribute("style","fill:#3E72CC");		
	}		
}

function resizeSelectSpace(svgOb,selector,type,event){
	var x,y;
	if(mousedown){
	
		x=parseInt(selectSpace.style.left);
		y=parseInt(selectSpace.style.top);		
		if(mouseLeft>event.clientX){		
			selectSpace.style.left=Math.abs(event.clientX)+"px";
			selectSpace.style.width=Math.abs(mouseLeft- event.clientX)+"px";
		} else{

			selectSpace.style.width=Math.abs(x-event.clientX)+ "px";	
		}
		if(mouseTop>event.pageY){
			selectSpace.style.top=Math.abs(event.pageY)+"px";
			selectSpace.style.height=Math.abs(mouseTop- event.pageY)+"px";
		} else{
			selectSpace.style.height=Math.abs(y- event.pageY)+ "px";
		}
		if(type=="line"){
			selectPlotPoint();			
		}
		if(type=="column"){
			selectColumn();
		}										
	}	
}

function selectColumn(){
	var selectSpace=document.getElementById("selectSpace");
	var x1=parseInt(selectSpace.style.left);
	var y1=parseInt(selectSpace.style.top);
	var x2=x1+ parseInt(selectSpace.style.width);
	var y2=y1+parseInt(selectSpace.style.height);
	var maxX=-1,minX=99999;
	var x,y,h,w;		
	var column=document.getElementsByClassName("column");

	for(var i=0,k=0; i< column.length; i++){
		x=Number(column[i].getAttribute("absoluteX"));
		y=Number(column[i].getAttribute("absoluteY"));
		h=Number(column[i].getAttribute("height"));
		w=Number(column[i].getAttribute("width"));

		if((x1 < x + w && x2 > x && y1 < y + h && y2 > y)){				
			column[i].setAttribute("style","fill:#B74947");	
			if(minX>=Number(column[i].getAttribute("x")))
				minX=Number(column[i].getAttribute("x"));
			if(maxX<Number(column[i].getAttribute("x")))
				maxX=Number(column[i].getAttribute("x"));
			k++
		}
		else
			column[i].setAttribute("style","fill:#3E72CC");
	}

	for(var i=0; i< column.length; i++){
		if((Number(column[i].getAttribute("x")))>=minX && Number(column[i].getAttribute("x")) <= maxX){
			column[i].setAttribute("style","fill:#B74947");					
		}			
	}
}

function syncCrossHair(e){
	var cx;
	var adjustingValue;
	var x;
	var fixedDecimal;
	var index1,index2,slop,xRatio,sX1,sX2,sY1,sY2,cValue,yValue;
	var top,topLimit,bottomLimit,left,leftLimit,rightLimit;
	var x;	
	var keyIndex;
	var chartAreaRect=document.getElementsByClassName("chartArea");
	var crossHair=document.getElementsByClassName("HairLine");

	var tooltip=document.getElementsByClassName("tooltip");
	var tooltipText=document.getElementsByClassName("tooltipText");
	var x1,y1,y2,rectX,rectWidth;
	var textLength;
	var padding;
	var tooltipHeight, tooltipWidth;
	var pointX,pointY;
	var parentOffset;
	var rect;	
	padding=10;
	tooltipHeight=25;	
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
			}			
		}
		this._tooltip[i].rect.setAttribute("visibility","hidden");
		this._tooltip[i].text.setAttribute("visibility","hidden");
	}


	for (var i=0; i<crossHair.length; i++){	
		crossHair[i].setAttribute("visibility","visible");	
		tooltip[i].setAttribute("visibility","hidden");
		tooltipText[i].setAttribute("visibility","hidden");
		rectX=parseInt(chartAreaRect[i].getAttribute("x"));


		x1=parseInt(crossHair[i].getAttribute("x1"));
		y1=parseInt(crossHair[i].getAttribute("y1"));
		y2=parseInt(crossHair[i].getAttribute("y2"));
		
		rectWidth= parseInt(chartAreaRect[i].getAttribute("width"));
		leftLimit=rectX;
		rightLimit=rectX+rectWidth;
		topLimit=y1;
		bottomLimit=y2;

		keyIndex=bSearch(DataSet[i],x1);

		if(keyIndex>=0){
			left=DataSet[i][keyIndex][2];
			top=DataSet[i][keyIndex][3];
			
			textLength=tooltipText[i].innerHTML.toString().length;
			tooltipWidth=textLength*padding+2*padding;

			tooltip[i].setAttribute("width",tooltipWidth.toString());
			tooltip[i].setAttribute("height",tooltipHeight);

			tooltipText[i].innerHTML=DataSet[i][keyIndex][1].toString();

			pointX=left+5;
			pointY=top-5;					
			if((rightLimit -25) <(left+tooltipWidth)){

				pointX=left-tooltipWidth-10;
			}

			if((top+tooltipHeight+5)>(bottomLimit)){
				pointY=top+tooltipHeight;
				while((pointY+tooltipHeight+5)>=(bottomLimit)){
					pointY--;					
				}											
			}

			if((top)< (topLimit +5)){
				pointY=top;
				while(pointY<=topLimit+15){					
					pointY++;
				}
			}				

			tooltip[i].setAttribute("x",pointX);
			tooltipText[i].setAttribute("x",(pointX+Math.floor((tooltipWidth-(textLength*padding))/2)));

			tooltip[i].setAttribute("y",pointY-10);
			tooltipText[i].setAttribute("y",(pointY+7));

			tooltip[i].setAttribute("visibility","visible");
			tooltipText[i].setAttribute("visibility","visible");
			
		} else{				
			keyIndex= Math.abs(keyIndex) -1;

			if(x1 < DataSet[i][DataSet[i].length-1][2] && x1 > DataSet[i][0][2]) {
				if(x1 > DataSet[i][keyIndex][2]) {
					index1=keyIndex;
					index2=keyIndex+1;
				} else {
					index1=keyIndex-1;
					index2=keyIndex;
				}
				sX1=DataSet[i][index1][2];
				sY1=DataSet[i][index1][3];
				sX2=DataSet[i][index2][2];
				sY2=DataSet[i][index2][3];

				slop=((sY2-sY1)/(sX2-sX1)).toFixed(3);
				cValue=(sY2- slop*sX2);
				yValue=Math.abs((slop* x1) + cValue);					
				xRatio=(DataSet[i][index2][1]-DataSet[i][index1][1])/Math.abs(sX1-sX2);
				if(DataSet[i][index2][1]%1 !=0)
					fixedDecimal=(DataSet[i][index2][1]%1).toString().length;
				else
					fixedDecimal=0;
				tooltipText[i].innerHTML=((DataSet[i][index1][1] + xRatio* Math.abs(sX1-x1)).toFixed(fixedDecimal)).toString();

				top=Math.floor(yValue);
				left=x1;
				textLength=tooltipText[i].innerHTML.toString().length;

				tooltipWidth=textLength*padding+2*padding;

				tooltip[i].setAttribute("width",tooltipWidth.toString());
				tooltip[i].setAttribute("height",tooltipHeight);

				pointX=left+5;

				pointY=top-5;			

				if((rightLimit -25) <(left+tooltipWidth)){

					pointX=left-tooltipWidth-10;
				}

				if((top+tooltipHeight+5)>(bottomLimit)){
					pointY=top+tooltipHeight;
					while((pointY+tooltipHeight+5)>=(bottomLimit)){
						pointY--;					
					}											
				}

				if((top)< (topLimit +5)){
					pointY=top;
					while(pointY<=topLimit+15){					
						pointY++;
					}
				}				

				tooltip[i].setAttribute("x",pointX);
				tooltipText[i].setAttribute("x",(pointX+Math.floor((tooltipWidth-(textLength*padding))/2)));

				tooltip[i].setAttribute("y",(pointY-10));
				tooltipText[i].setAttribute("y",(pointY+7));

				tooltip[i].setAttribute("visibility","visible");
				tooltipText[i].setAttribute("visibility","visible");

			} else {
				tooltip[i].setAttribute("visibility","hidden");
				tooltipText[i].setAttribute("visibility","hidden");
			}
		}
	}
}
function reset(chartInstances,type){
	
	for(var i=0; i< chartInstances.length; i++){
		for(var j=0; j<chartInstances[i].length; j++){
			if(type== 'line'){
				chartInstances[i][j].setAttribute("fill","#ffffff");
				chartInstances[i][j].setAttribute("r",5);
			}
			if(type=='column')
				chartInstances[i][j].setAttribute("style","fill:#3E72CC");		
		}
	}		
}

function selectPlotPoint(){
	var selectSpace=document.getElementById("selectSpace");
	var x1=parseInt(selectSpace.style.left);
	var y1=parseInt(selectSpace.style.top);
	var x2=x1+ parseInt(selectSpace.style.width);
	var y2=y1+parseInt(selectSpace.style.height);
	var maxX=-1,minX=99999;		
	var x,y;		
	var plotPoint=document.getElementsByClassName("plotPoint");
		
	for(var i=0,k=0; i< plotPoint.length; i++){
		x=Number(plotPoint[i].getAttribute("absoluteX"));
		y=Number(plotPoint[i].getAttribute("absoluteY"));

		if(x>=x1 && x<=x2 && y>=y1 && y<=y2){

			plotPoint[i].setAttribute("fill","#f44336");
			plotPoint[i].setAttribute("r",6);	

			if(minX>Number(plotPoint[i].getAttribute("cx")))
				minX=Number(plotPoint[i].getAttribute("cx"));

			if(maxX<Number(plotPoint[i].getAttribute("cx")))
				maxX=Number(plotPoint[i].getAttribute("cx"));				
		}
	}

	for(var i=0; i< plotPoint.length; i++){
		if((minX <= Number(plotPoint[i].getAttribute("cx"))) && Number(plotPoint[i].getAttribute("cx")) <= maxX){
			plotPoint[i].setAttribute("style","fill:#f44336");
			plotPoint[i].setAttribute("r",6);	
		
		}
	}
}

function hideCrossHair(e){
	var element=document.getElementsByClassName("HairLine");
	var tooltip=document.getElementsByClassName("tooltip");
	var tooltipText=document.getElementsByClassName("tooltipText");		
	for (var i=0; i<element.length; i++){	
		element[i].setAttribute("visibility","hidden");
		element[i].setAttribute("x1","1");
		element[i].setAttribute("x2","1");
		tooltip[i].setAttribute("visibility","hidden");
		tooltipText[i].setAttribute("visibility","hidden");
	}

	var plotPoint=document.getElementsByClassName("plotPoint");
	for(var i=0; i<plotPoint.length; i++){
		plotPoint[i].setAttribute("style","fill:#ffffff");
		plotPoint[i].setAttribute("r",5);
	}
}
/*----------Event Handling Functions stop------------*/
