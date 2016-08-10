/*--------drawcomponent start------------------------*/

function DrawComponents(selector,width,height,marginX,marginY,topMarginY,noPercent){
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

	if(noPercent==undefined){
		percntWidth=Math.ceil((this.width)/(window.innerWidth)*100);
		percntWidth=percntWidth+0.33*percntWidth;
		this.svg.setAttribute("style","width:"+percntWidth+"%;");
	}
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
	return{
			config:{
				x1: point1.x,
				y1: point1.y,
				x2: point2.x,
				y2: point2.y
			},
			graphics:line
		};	
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
	return{
			config:{
				x: point.x,
				y: point.y
			},
	 		graphics:text
		};
}

DrawComponents.prototype.drawPolygon=function(points,classIn){
	var polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");			
	polyline.setAttribute("points",points);		
	polyline.setAttribute("class",classIn);
	this.svg.appendChild(polyline);
	return {
			config:{
				points:points
			},
			graphics:polyline
		};
}

DrawComponents.prototype.drawPath=function(_path,classIn){
	var path=document.createElementNS("http://www.w3.org/2000/svg","path");
	path.setAttribute("d",_path);
	path.setAttribute("class",classIn);
	path.setAttribute("style","stroke:#1e7ac9; stroke-width:3; fill:transparent");

	this.svg.appendChild(path);
	return {
			config: {
				path: _path
			},
			graphics: path
		};
}

DrawComponents.prototype.drawCircle= function(point,r,classIn,Xdata,Ydata,absoluteX,absoluteY){
	var circle=document.createElementNS("http://www.w3.org/2000/svg", "circle");	
	circle.setAttribute("cx",point.x);
	circle.setAttribute("cy",point.y);
	circle.setAttribute("r",r);
	circle.setAttribute("fill","#ffffff");
	circle.setAttribute("Xdata",Xdata);
	circle.setAttribute("Ydata",Ydata);
	circle.setAttribute("absoluteX",absoluteX);
	circle.setAttribute("absoluteY",absoluteY);	
	circle.setAttribute("class",classIn);
	this.svg.appendChild(circle);	
	return {
			config:{
				cx: point.x,
				cy: point.y,
				r: r,
				Ydata: Ydata,
				Xdata: Xdata,
				absoluteX: absoluteX,
				absoluteY: absoluteY
			},
			graphics: circle
		};
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
	return {
			config: {
				x: x,
				y: y,
				height: h,
				width: w,
				value: value,
				absoluteX: absoluteX,
				absoluteY: absoluteY
			},
			graphics:rect
		};
}

/*------drawcomponent end-------*/





