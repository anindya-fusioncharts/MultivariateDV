/*---------chart body start---------*/
function Chart(drawComponents,parsedJSON){
	this.drawComponents=drawComponents;
	this.parsedJSON=parsedJSON;
}
Chart.prototype.drawChartHeading=function(selector,parsedJSON) {
	var width=parsedJSON.chart.width*Math.ceil(window.innerWidth/((1+0.32)*parsedJSON.chart.width))-0.33*parsedJSON.chart.width;
	var chartHeadings=new DrawComponents(selector,width,50,parsedJSON.chart.marginX,parsedJSON.chart.marginY,0,"Heading");
	var point;
	point={
		x: chartHeadings.width- Math.floor(chartHeadings.width*0.53),
		y:50-30
	};
	chartHeadings.drawText(point,".35em",parsedJSON.chart.caption,"Caption");	

	point={
		x: chartHeadings.width- Math.floor(chartHeadings.width*0.53),
		y:50-10
	};
	chartHeadings.drawText(point,".35em",parsedJSON.chart.subCaption,"subCaption");	

	var br=document.createElement("br");
	document.getElementById(selector).appendChild(br);		
}

Chart.prototype.drawSelectSpace=function(elements,event){
	selectSpace.style.left="0px";
	selectSpace.style.top="0px";
	selectSpace.style.width="0px";
	selectSpace.style.height="0px";

	mousedown=true;

	this.reset(elements);

	var x= event.clientX;
	var y=event.pageY;	

	selectSpace.style.left=x+"px";
	selectSpace.style.top=y+"px";
	mouseLeft=x;
	mouseTop=y;
}

Chart.prototype.resizeSelectSpace=function(elements,event){
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
		this.select(elements);

	}	
}

Chart.prototype.destroySelectSpace=function(event){
	mousedown=false;	
	selectSpace.style.left="0px";
	selectSpace.style.top="0px";
	selectSpace.style.width="0px";
	selectSpace.style.height="0px";	
}
/*---------chart body end------------*/
