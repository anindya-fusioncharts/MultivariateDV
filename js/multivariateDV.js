;(function(){ //Imidiate invoke

	var ob = {};
	var xMax,xMin;
	var crossHairLine=[];
	var DataSet=[];
	var chartDraw={};
	var marginLeft= 0;
	var column=[];
	var noChartRow,chartCount=0;
	var selectSpace;
	var mousedown=false;
	var mouseLeft, mouseTop;

	window.CustomApi=function(selector){
		this.dataMap=ob.chart.yMap;
		this.data=DataSet;
		this.selector=selector;
	}

	CustomApi.prototype.Avg=function(func){
		ob.chart.yMap=avg(this.dataMap,this.data,func);
		this.chartInstantiate();
	}

/*	function avg(dataMapList,dataList,func){
		var dataMapListSize=dataMapList.length;
		var avgList=avgList(dataList);
		if(func=="ascending")
			return Asc(dataMapList,avgList);
		if(func=="descending")
			return Desc(dataMapList,avgList);
	} 
*/

	CustomApi.prototype.SortMax=function(func){
		if(func== "ascending")
			ob.chart.yMap=SortAsc(this.dataMap,this.data);	
		if(func=="descending")
			ob.chart.yMap=SortDesc(this.dataMap,this.data);	
		this.chartInstantiate();
	}
	
	CustomApi.prototype.chartInstantiate=function(){
		var charts=document.getElementsByClassName("chartSpace");
		while(charts.length)
			document.getElementById(this.selector).removeChild(charts[0]);
		DataSet=[];
		retriveData();
		if(ob.chart.type=="line"){
			linecharts(this.selector,tickPosDown);
		} else if(ob.chart.type=="column")
			columncharts(this.selector,tickPosDown); 
	}

	function avgList(dataList){
		var avgList=[]
		for(var i=0,sum=0; i< dataList.length; i++){
			for(var j=0; j<dataList[i].length;sum+=dataList[i][j][1],j++);
			avgList[i]=sum/j;
		}
		return avgList;
	}

	function SortAsc(dataMapList,dataList){
		var dataMapListSize=dataMapList.length;
		var max;
		var find_max;
		dataMaxArray=[];
		var temp;
		find_max=findMax(dataList[0]);
		
		for(var i=0; i<dataMapListSize; i++){
			dataMaxArray[i]=findMax(dataList[i]);			
		}

		for(var i=0;i<dataMaxArray.length; i++){
			for(var j=i+1; j<dataMaxArray.length;j++){
				if(dataMaxArray[i]>dataMaxArray[j]){
					temp=dataMaxArray[i];
					dataMaxArray[i]=dataMaxArray[j];
					dataMaxArray[j]=temp;

					temp=dataMapList[i];
					dataMapList[i]=dataMapList[j];
					dataMapList[j]=temp;
				}
			}
		}
		return dataMapList;
	}
	function SortDesc(dataMapList,dataList){
		var dataMapListSize=dataMapList.length;
		var max;
		var find_max;
		dataMaxArray=[];
		var temp;
		find_max=findMax(dataList[0]);
		
		for(var i=0; i<dataMapListSize; i++){
			dataMaxArray[i]=findMax(dataList[i]);			
		}

		for(var i=0;i<dataMaxArray.length; i++){
			for(var j=i+1; j<dataMaxArray.length;j++){
				if(dataMaxArray[i]<dataMaxArray[j]){
					temp=dataMaxArray[i];
					dataMaxArray[i]=dataMaxArray[j];
					dataMaxArray[j]=temp;

					temp=dataMapList[i];
					dataMapList[i]=dataMapList[j];
					dataMapList[j]=temp;
				}
			}
		}
		return dataMapList;
	}

	function findMax(list){
		var max=undefined;
		if(list[0][1])
			max=list[0][1];

		for(var i=1; i<list.length; i++){
			if(max< list[i][1])
				max=list[i][1];
		}
		return max;
	}
	window.render=function(user_input,selector){

		var user_input_raw=user_input;				
		if(typeof user_input=="string"){
			user_input=JSON.parse(user_input);
		}		
		
		chart_info(user_input);			
		retriveData();
		selectDiv(selector);
		tickPosDown=tickspoistion();
		
		if(tickPosDown){
			ob.chart.marginY=45;
			ob.chart.topMarginY=75;
		}else{
			ob.chart.marginY=75;
			ob.chart.topMarginY=45;							
					
		}

		drawChartHeading(selector);

		if(ob.chart.type=="line")
			linecharts(selector,tickPosDown);
		if(ob.chart.type=="column")
			columncharts(selector,tickPosDown); 

		window.customApiOb= new CustomApi(selector);
		
		//drawXAxisTitle(selector);
	}

	function tickspoistion(){
		noChartRow=Math.floor(100/(Math.ceil((ob.chart.width)/window.innerWidth*100)+8));
		if((ob.chart.yMap.length % noChartRow)==0)
			return false;
		else
			return true;
	}
	function selectDiv(selector){
		selectSpace=document.createElement("div");
		selectSpace.style.position="absolute";
		selectSpace.style.background ="#727272";
		selectSpace.style.color = "#727272";
		selectSpace.innerHTML = "";
		selectSpace.style.opacity="0.3";
		selectSpace.id="selectSpace";
		selectSpace.style.left=0+"px";
		selectSpace.style.top=0+"px";
		document.body.appendChild(selectSpace);
	}

	function linecharts(selector,tickPosDown){
		var point={};
		var pointStr='';
		var yDiff,xDiff;
		var retriveMonth;
		var svgLeft,svgTop;
		xRangeTicks();
		yRangeTicks();	
		chartCount=0;
		tickPosDown=tickspoistion();
		for(var i=0; i<ob.chart.yMap.length; i++){
			chartCount++;
			chartDraw = new Svg(selector,ob.chart.width,ob.chart.height,"chartSpace");						
			chartDraw.drawYaxis(ob.yAxisTicks[i],ob.chart.yMap[i],tickPosDown);			
			chartDraw.drawXaxis(i,ob.xAxisTicks,ob.chart.xMap);	
			pointStr='';

			xDiff=ob.xAxisTicks[ob.xAxisTicks.length-1].getTime()-ob.xAxisTicks[0].getTime();

			for(k=0;k<DataSet[i].length;k++){

				yDiff=ob.yAxisTicks[i][ob.yAxisTicks[i].length-1]-ob.yAxisTicks[i][0];					
				point=chartDraw.coordinate(chartDraw.xShift(DataSet[i][k][0],ob.xAxisTicks[0].getTime() ,xDiff), chartDraw.yShift(DataSet[i][k][1],ob.yAxisTicks[i][0],yDiff));		
				pointStr=pointStr+point.x + ','+ point.y + ' ';	
			}

			chartDraw.drawPoly(pointStr,'graph');	

			svgLeft=parseInt(chartDraw.svg.getBoundingClientRect().left);
			svgTop=parseInt(chartDraw.svg.getBoundingClientRect().top);
			for(k=0;k<DataSet[i].length;k++){				
				point=chartDraw.coordinate(chartDraw.xShift(DataSet[i][k][0],ob.xAxisTicks[0].getTime() ,xDiff), chartDraw.yShift(DataSet[i][k][1],ob.yAxisTicks[i][0],yDiff));		
				DataSet[i][k][2]=point.x;
				DataSet[i][k][3]=point.y;
				chartDraw.drawCircle(point,"plotPoint",(svgLeft+point.x),(svgTop+point.y));										
			}
			crossHairLine[i]= drawCrossHair(chartDraw,ob.yAxisTicks[i],"crossHair","rect");	

			chartDraw.svg.addEventListener("mousedown",function(event){drawSelectSpace(event,chartDraw,selector,"line");});
			chartDraw.svg.addEventListener("mousemove",function(event){ResizeSelectSpace(event,chartDraw,selector,"line");});
			chartDraw.svg.addEventListener("mouseup",function(event){DestroySelectSpace(event,chartDraw,selector,"line");});	
			chartDraw.svg.addEventListener("mouseleave",function(event){DestroySelectSpace(event,chartDraw,selector,"line");});	

		}		
	}
	
	function drawSelectSpace(event,svgOb,selector,type){
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
				plotPoint[i].setAttribute("fill","#f44336");
				plotPoint[i].setAttribute("r",6);	
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

	function ResizeSelectSpace(event,svgOb,selector,type){
		var x,y;
		if(mousedown){
			x=	parseInt(selectSpace.style.left);
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

	function DestroySelectSpace(event,svgOb,selector,type){
		mousedown=false;
		var selectSpace=document.getElementById("selectSpace");
		selectSpace.style.left="0px";
		selectSpace.style.top="0px";
		selectSpace.style.width="0px";
		selectSpace.style.height="0px";	
	}

/*	function drawXAxisTitle(selector){
		var xAxisTitle=new Svg(selector,ob.chart.width,40,"xAxisTitle");
		point={
			x:xAxisTitle.width- Math.floor(xAxisTitle.width/2 -xAxisTitle.marginX),
			y:15
		};	
		xAxisTitle.drawText(point,".35em",ob.chart.xMap,"xAxisTitleText");	
		var br=document.createElement("br");
		document.getElementById(selector).appendChild(br);		
	}
*/
	function drawChartHeading(selector) {
		var chartHeadings=new Svg(selector,window.innerWidth-200,50,"Heading");

		point={
			x: chartHeadings.width- Math.floor(chartHeadings.width/2 -chartHeadings.marginX),
			y:50-30
		};
		chartHeadings.drawText(point,".35em",ob.chart.caption,"Caption");	

		point={
			x: chartHeadings.width- Math.floor(chartHeadings.width/2 -chartHeadings.marginX),
			y:50-10
		};
		chartHeadings.drawText(point,".35em",ob.chart.subCaption,"subCaption");	
	
		var br=document.createElement("br");
		document.getElementById(selector).appendChild(br);		
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

//------------------------


	function chart_info(user_input){ //Initializing entities from json object or default value
		var noData,keys,flag;
		var uniqueKeys=[];
		ob.chart={};
		ob.chart.caption=user_input.chart.caption || "Caption";
		ob.chart.subCaption=user_input.chart.subCaption || "subCaption";
		ob.chart.height=user_input.chart.height || 300;		
		ob.chart.height=(ob.chart.height>500 || ob.chart.height<200) ? 300 : ob.chart.height;
		ob.chart.width= user_input.chart.width || 500;						
		ob.chart.width=(ob.chart.width>1000 || ob.chart.width<200)?500: ob.chart.width;
		ob.chart.type=user_input.chart.type||"line";
		ob.chart.marginX=80;
		ob.chart.marginY=20;
		ob.chart.topMarginY=60;
		ob.chart.xMap=user_input.chart.xAxisMap;	
		ob.data=user_input.data;	

		noData=ob.data.length;
		for(var i=0,k=0; i<noData; i++){
			keys=Object.keys(ob.data[i]);
			
			if(k==0 && i==0)
				uniqueKeys[k]=keys[0];
		
			for(var j=0; j<keys.length; j++){
				flag=0;
				for(var l=0;l<uniqueKeys.length; l++){
					if(uniqueKeys[l]==keys[j]){
						flag=1;												
					}
				}
				if(flag==0 && keys[j]!=ob.chart.xMap){
					k++;
					uniqueKeys[k]=keys[j];							
				}				
			}				
		}
		ob.chart.yMap=uniqueKeys;	
	}

	function retriveData(){
		for(var i=0; i<ob.chart.yMap.length; i++){
			DataSet[i]=[];
			for(var j=0,k=0;j<ob.data.length;j++){				
				if (ob.data[j][ob.chart.yMap[i]]!= undefined && ob.data[j][ob.chart.xMap] != undefined){
					DataSet[i][k]=[];
					DataSet[i][k][0]=new Date(ob.data[j][ob.chart.xMap].toString()).getTime();										
					DataSet[i][k][1]=ob.data[j][ob.chart.yMap[i]];
					k++;									
				}											
			}
			DataSet[i]=sortByDate(DataSet[i]);
		}
	}

	function xRangeTicks(){

		var diff, diffDigit;
		var interval;
		var index;
		var tickValue;
		var ticks=[];
		ob.xAxisTicks=[];
		var intermediateDate;
		var fixedDecimal;

		xMax=new Date(ob.data[0][ob.chart.xMap]);
		xMin=new Date(ob.data[0][ob.chart.xMap]);
		
		for (var i=0, k=0; i<ob.data.length; i++){
			if(ob.data[i][ob.chart.xMap]!=undefined){
					if(xMax==undefined && min==undefined){
						xMax=new Date(ob.data[i][ob.chart.xMap]);
						xMin=new Date(ob.data[i][ob.chart.xMap]);
					}
				var date=new Date(ob.data[i].date);
				if(xMax < date)
					xMax=date;
				if(xMin > date)
					xMin=date;
				k++;
			}			
		}
		diff=xMax.getTime() - xMin.getTime();
		
		if(ob.chart.height>=800)
			interval=10;
		if(k<=10 && ob.chart.height<800)
			interval=Math.floor(diff/(k-1));		
		else
			interval=Math.floor(diff/9);	

		if(ob.chart.height<300)
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
		ob.xAxisTicks=ticks;		
	}
		

	function yRangeTicks(){		
		//---------range set for y axis
		var diff,diffDigit,computedMin,computedMax;
		ob.yAxisTicks=[];
		var negativeFlag=0, negatedmin=0;
		var tickValue;
		var count=-1;
		var d,r;		
		var index;
		var flag=0;
		var max,min;
		var max_countDecimals;
		var decimalFlag=1;

		for(var i=0; i<ob.chart.yMap.length; i++){
			max=undefined;
			min=undefined;

			for(var j=0; j<ob.data.length; j++){
				if(ob.data[j][ob.chart.yMap[i]]!=undefined){
									
					if(max==undefined && min==undefined){
						max=ob.data[j][ob.chart.yMap[i]];
						min=ob.data[j][ob.chart.yMap[i]];
					}

					if(max<ob.data[j][ob.chart.yMap[i]])
						max=ob.data[j][ob.chart.yMap[i]];
					if(min>ob.data[j][ob.chart.yMap[i]])
						min=ob.data[j][ob.chart.yMap[i]];

					max_countDecimals=0;

					if(max_countDecimals<countDecimals(ob.data[j][ob.chart.yMap[i]]))
						max_countDecimals=countDecimals(ob.data[j][ob.chart.yMap[i]]);
				}
			}
			negatedmin=0;
			//------------ new min
			if(min!=max){
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
			
			} else{

				computedMin=min-5;
				computedMax=max+5;
				if(computedMin<0)
					negativeFlag=1;

				if(negativeFlag==1){
					negatedmin=computedMin;
					computedMax-=computedMin;
					computedMin=0;
				}				
				interval=0.5;
			}
			

			var ticks=[];
			ticks[0]=computedMin + negatedmin;

			tickValue=ticks[0];
			for(var j=1; tickValue<=(computedMax+negatedmin);j++){
			ticks[j]=ticks[j-1]  + interval*Math.pow(10,decimalFlag*(computedMax.toString().length-index));		
			tickValue=ticks[j];			
			}	
			ob.yAxisTicks[i]=ticks;					
		}
	}

	var countDecimals = function(value) {
	    if (Math.floor(value) !== value)
	        return value.toString().split(".")[1].length || 0;
	    return 0;
	}


	function Svg(selector,width,height,classIn){
		var percntWidth;

		this.marginX = ob.chart.marginX;	
		this.marginY = ob.chart.marginY;
		this.topMarginY=ob.chart.topMarginY;
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
		this.height=height||300;		
		this.width=width||500;
		
		
		if(classIn!="Heading" && classIn!="xAxisTitle"){
			this.height=(this.height>500 || this.height<200) ? 300 : this.height;
			this.width=(this.width>1000 || this.width<200)?500: this.width;
		}

		percntWidth=Math.ceil((this.width)/window.innerWidth*100)+8;
		this.svg.setAttribute("class",classIn);
		
		this.svg.setAttribute("height", this.height);	
		
		this.svg.setAttribute("width", this.width);

		if(classIn!="Heading")
			this.svg.setAttribute("style","width:"+percntWidth+"%;");
		this.rootElement.appendChild(this.svg);	
		return this;	
	}


	Svg.prototype.coordinate=function(x,y){
		return {
			x: x + this.marginX ,
			y: this.height - (y+this.marginY)	
		};
	}

	Svg.prototype.drawLine=function(x1,y1,x2,y2,classIn){
		var pos1 = this.coordinate(x1, y1);	
		var pos2= this.coordinate(x2, y2);	
		
		var line = document.createElementNS("http://www.w3.org/2000/svg","line");	
																					
		line.setAttribute("x1", pos1.x);			
		line.setAttribute("y1", pos1.y);			
		line.setAttribute("x2", pos2.x);
		line.setAttribute("y2", pos2.y);
		line.setAttribute("class",classIn);
		this.svg.appendChild(line);	
		return line;	
	}

	Svg.prototype.drawXaxis= function(noChart,tickList,tickPosDown){
		var x1= -(this.marginX-this.paddingX1)-1;
		var y1=0;
		var x2=this.width;
		var y2=0;
		var point={};
		var xTickStr="";
		var dateMax=ob.xAxisTicks[ob.xAxisTicks.length-1];
		var dateMin=ob.xAxisTicks[0];
		var xDiff=ob.xAxisTicks[ob.xAxisTicks.length-1].getTime()-ob.xAxisTicks[0].getTime();
console.log(tickPosDown);
			if(!tickPosDown){				
				if((ob.chart.yMap.length - chartCount)<noChartRow && (ob.chart.yMap.length - chartCount)>= 0){
					for(var i=0; i<ob.xAxisTicks.length; i++){
						x1=this.xShift(ob.xAxisTicks[i].getTime(),ob.xAxisTicks[0].getTime(),xDiff);
						y1=-(this.marginY-this.marginY);
						x2=x1;
						y2=-(this.marginY-this.marginY+5);				
						point=this.coordinate((x1+2),(y1-10));
						this.drawLine(x1,y1,x2,y2,"xAxis");
		//---------ticks text calculation
				//		if(noChart==(ob.chart.yMap.length-1)){
							if(xDiff<(1000*3600*24) && dateMax.getDate()==dateMin.getDate() && dateMax.getMonth()==dateMin.getMonth() && dateMax.getFullYear()==dateMin.getFullYear())
								xTickStr=ob.xAxisTicks[i].toString().split(' ')[4];
							if(dateMax.getDate()!=dateMin.getDate() && dateMax.getMonth()==dateMin.getMonth() && dateMax.getFullYear()==dateMin.getFullYear())
								xTickStr=ob.xAxisTicks[i].toString().split(' ')[0];
							if(dateMax.getMonth()!=dateMin.getMonth() && dateMax.getFullYear()==dateMin.getFullYear())
								xTickStr=ob.xAxisTicks[i].toString().split(' ')[1]+ "'"+ob.xAxisTicks[i].toString().split(' ')[2];
							if(dateMax.getFullYear()!=dateMin.getFullYear())
								xTickStr=ob.xAxisTicks[i].toString().split(' ')[1]+ "'"+ob.xAxisTicks[i].toString().split(' ')[2] + ","+ob.xAxisTicks[i].toString().split(' ')[3][2]+''+ob.xAxisTicks[i].toString().split(' ')[3][3];					
							this.drawText(point,".35em",xTickStr,"xAxisTickText1","270");				
				//		}
					}
				}
			}else{
				//-------noChart
				if(noChartRow>0) {
	//---------ticks draw and ticks text
	
					for(var i=0; i<ob.xAxisTicks.length; i++){
							x1=this.xShift(ob.xAxisTicks[i].getTime(),ob.xAxisTicks[0].getTime(),xDiff);
							y1=(this.height-this.marginY-this.topMarginY-8);
							x2=x1;
							y2=(this.height-this.marginY-this.topMarginY);				
							point=this.coordinate((x1+2),(y1+10));
							this.drawLine(x1,y1,x2,y2,"xAxis");

			//---------ticks text calculation
							if(xDiff<(1000*3600*24) && dateMax.getDate()==dateMin.getDate() && dateMax.getMonth()==dateMin.getMonth() && dateMax.getFullYear()==dateMin.getFullYear())
								xTickStr=ob.xAxisTicks[i].toString().split(' ')[4];
							if(dateMax.getDate()!=dateMin.getDate() && dateMax.getMonth()==dateMin.getMonth() && dateMax.getFullYear()==dateMin.getFullYear())
								xTickStr=ob.xAxisTicks[i].toString().split(' ')[0];
							if(dateMax.getMonth()!=dateMin.getMonth() && dateMax.getFullYear()==dateMin.getFullYear())
								xTickStr=ob.xAxisTicks[i].toString().split(' ')[1]+ "'"+ob.xAxisTicks[i].toString().split(' ')[2];
							if(dateMax.getFullYear()!=dateMin.getFullYear())
								xTickStr=ob.xAxisTicks[i].toString().split(' ')[1]+ "'"+ob.xAxisTicks[i].toString().split(' ')[2] + ","+ob.xAxisTicks[i].toString().split(' ')[3][2]+''+ob.xAxisTicks[i].toString().split(' ')[3][3];					
							this.drawText(point,".35em",xTickStr,"xAxisTickText","270");				

					}
				noChartRow--;					
			}
		}			
	}	

	Svg.prototype.drawYaxis= function(tickList,yAxisTitle,tickPosDown){
		
		var len,diff,plotFactor;
		var y1;
		var x1;
		var y2;
		var x2;
		var point={},point1={},point2={},point3={};
		var tickText;
		var count=0;
		var yPrev=0;
		var points;
		var fixedDecimal;
		var ticktext;
		var min;
		len=tickList.length;

		diff=Math.abs(tickList[len-1]-tickList[0]);
		
		min=tickList[0];

		for(var i=0; i<tickList.length; i++){
			if(tickList[0]<0)
				y1=this.yShift(tickList[i]-tickList[0],tickList[0]-tickList[0],diff);
			else
				y1=this.yShift(tickList[i],tickList[0],diff);
			x1=-(this.marginX-this.paddingX2-4);
			y2=y1;
			x2=-(this.marginX-this.paddingX1-4);						
						
			this.drawLine(x1,y1,x2,y2,"yAxisTick");
						

			if( Math.abs(tickList[i])<1000){
				point=this.coordinate(-(this.marginX-this.paddingTextX-8),(y1-4));
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
				this.drawText(point,".35em",tickText,"yAxisTickText");
			}
			if(Math.abs(tickList[i])>=1000 && Math.abs(tickList[i])<1000000){
				point=this.coordinate(-(this.marginX-this.paddingTextX-8),(y1-5));
				tickText=tickList[i]/1000 + "" +"K";
				this.drawText(point,".35em",tickText,"yAxisTickText");
			}
			if(Math.abs(tickList[i])>=1000000 && Math.abs(tickList[i])<1000000000){
				point=this.coordinate(-(this.marginX-this.paddingTextX-8),(y1-5));
				tickText=tickList[i]/1000000 + "" +"M";
				this.drawText(point,".35em",tickText,"yAxisTickText");
			}
			if(Math.abs(tickList[i])>=1000000000 && Math.abs(tickList[i])<1000000000000){
				point=this.coordinate(-(this.marginX-this.paddingTextX-8),(y1-5));
				tickText=tickList[i]/1000000000 + "" +"B";
				this.drawText(point,".35em",tickText,"yAxisTickText");
			}
			if(Math.abs(tickList[i])>=1000000000000){
				point=this.coordinate(-(this.marginX-this.paddingTextX-8),(y1-5));
				tickText=tickList[i]/1000000000000 + "" +"T";
				this.drawText(point,".35em",tickText,"yAxisTickText");
			}	
			point=this.coordinate(-1,y1);
			point1=this.coordinate(this.width,y1);
			point2=this.coordinate(this.width,yPrev);
			point3=this.coordinate(-1,yPrev);

			points= point.x+ ','+point.y+' '+point1.x+','+point1.y+' '+point2.x+','+point2.y+' '+point3.x+','+point3.y+' '+point.x+ ','+point.y;
			if(i!=0)
				if(count%2==0)
					this.drawPolygon(points,"divDash1");		
				else
					this.drawPolygon(points,"divDash2");				
			count++;
			yPrev=y1;
		} 
//titles yaxis
		if(tickPosDown){
			points= (this.marginX-2)+ ','+(this.height-5)+' '+(this.width+this.marginX)+','+(this.height-5)+' '+(this.width+this.marginX)+','+(this.height-40)+' '+(this.marginX-2)+','+(this.height-40)+' '+(this.marginX-2)+ ','+(this.height-20);
			this.drawPolygon(points,"titles");
			point={
				x:this.width/2+this.marginX,
				y:this.height-15
			};

			this.drawText(point,".5em",yAxisTitle,"yAxisTitle","0");

		}else{
			points= (this.marginX-2)+ ','+0+' '+(this.width+this.marginX)+','+0+' '+(this.width+this.marginX)+','+this.topMarginY+' '+(this.marginX-2)+','+this.topMarginY+' '+(this.marginX-2)+ ','+0;
			this.drawPolygon(points,"titles");		

			point={
				x:this.width/2+this.marginX,
				y:this.topMarginY-15
			};
			this.drawText(point,".5em",yAxisTitle,"yAxisTitle","0");		

		
		}
	}

	Svg.prototype.xShift=function(item,min,diff){
		return Math.floor(((item-min)/diff)*(this.width));
	}

	Svg.prototype.yShift=function(item,min,diff){
		return Math.floor(((item-min)/diff)*(this.height-this.marginY-7-this.topMarginY));
	}


	Svg.prototype.drawPoly=function(points,classIn){

		var polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");			
		polyline.setAttribute("points",points);		
		polyline.setAttribute("class",classIn);
		this.svg.appendChild(polyline);
		return polyline;
	}

	Svg.prototype.drawCircle= function(point,classIn,absoluteX,absoluteY){
		var circle=document.createElementNS("http://www.w3.org/2000/svg", "circle");	
		circle.setAttribute("cx",point.x);
		circle.setAttribute("cy",point.y);
		circle.setAttribute("r",4);
		circle.setAttribute("fill","#ffffff");
		circle.setAttribute("absoluteX",absoluteX);
		circle.setAttribute("absoluteY",absoluteY);
		circle.setAttribute("class",classIn);
		circle.style.zIndex=1000;
		this.svg.appendChild(circle);	
		return circle;
	}

	Svg.prototype.drawText=function(point,dy,textIn,classIn,angle){
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

	function drawCrossHair(svgOb,tickList,classIn,rectId){		
		
		var tooltip;
		var rectLeft,height;
		var diff=tickList[tickList.length-2]-tickList[0];
		var x1=-(svgOb.marginX-svgOb.paddingX1);
		var y1=svgOb.yShift(tickList[tickList.length-2],tickList[0],diff);
		var x2=x1;
		var y2=svgOb.yShift(tickList[0],tickList[0],diff);
		var point=svgOb.coordinate(-(svgOb.marginX-svgOb.paddingX1),svgOb.yShift(tickList[tickList.length-2],tickList[0],diff));
		
		var point1=svgOb.coordinate(-(svgOb.marginX-svgOb.paddingX1),svgOb.yShift(tickList[0],tickList[0],diff));
		height= point1.y-point.y+25;

		var rect=svgOb.drawRect(point.x+5,point.y-15,classIn,height,svgOb.width,"stroke:#black; fill:transparent");
		var crossHair=svgOb.drawLine(x1,y1,x2,y2,"crossHairLine");
		crossHair.setAttribute("visibility","hidden");	

		tooltip=tooltips(svgOb,point,"tooltip","tooltipText");
		rectLeft=rect.getBoundingClientRect().left;	
																   
		rect.addEventListener("mousemove",function(event){disPatchMouserollOver(event,rectLeft);},false);
		rect.addEventListener("mouserollover",syncCrossHair,false);
		rect.addEventListener("mouseout",hideCrossHair,false);		
	}

	function tooltips(svgOb,point,class_Tooltip,class_TooltipText){
		var tooltip=svgOb.drawRect(point.x+5,point.y,class_Tooltip,10,0,"stroke:#8D6D60 ;stroke-width:1; fill:#FDD9CB");		
		var tooltipText=svgOb.drawText(point,"","",class_TooltipText,0);

		tooltipText.setAttribute("style",'fill: #8D6D60');		
		tooltipText.setAttribute("class",class_TooltipText);

		svgOb.svg.insertBefore(tooltip,tooltipText);
		return {
			"rect":tooltip,
			"text":tooltipText
		}
	}

	Svg.prototype.drawRect=function(x,y,classIn,h,w,style,value,absoluteX,absoluteY){
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
	Svg.prototype.drawPolygon=function(points,classIn){
		var polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");			
		polygon.setAttribute("points",points);		
		polygon.setAttribute("class",classIn);
		this.svg.appendChild(polygon);
	}
//----------------------plotArea
	function plotArea(svgOb,tickList){
		var rectLeft,height;
		var diff=tickList[tickList.length-2]-tickList[0];
		var x1=-(svgOb.marginX-svgOb.paddingX1);
		var y1=svgOb.yShift(tickList[tickList.length-2],tickList[0],diff);
		var x2=x1;
		var y2=svgOb.yShift(tickList[0],tickList[0],diff);
		var point=svgOb.coordinate(-(svgOb.marginX-svgOb.paddingX1),svgOb.yShift(tickList[tickList.length-2],tickList[0],diff));
		
		var point1=svgOb.coordinate(-(svgOb.marginX-svgOb.paddingX1),svgOb.yShift(tickList[0],tickList[0],diff));
		height= point1.y-point.y+25

		var rect=svgOb.drawRect(point.x+5,point.y-15,"plotArea",height,svgOb.width,"stroke:#black; fill:transparent");
			
		return rect;
	}
//-----custom event
	var CustomMouseRollOver=new CustomEvent("mouserollover",{"detail":{x:"",y:"",left:""}});


//-----event handling 
	function disPatchMouserollOver(event,left){
		var crossHairArray=document.getElementsByClassName("crossHair");	
		left=Math.ceil(left);
		CustomMouseRollOver.detail.x=Math.ceil(event.clientX-left);
	
		for(var i=0; i<crossHairArray.length; i++){
		//	if(crossHairArray[i]!=event.target)
				crossHairArray[i].dispatchEvent(CustomMouseRollOver);
		}
	}

	function syncCrossHair(e){
		var adjustValue=0;
		var fixedDecimal;
		var index1,index2,slop,xRatio,sX1,sx2,sY1,sY2,cValue,yValue;
		var top,topLimit,bottomLimit,left,leftLimit,rightLimit;
		var x;	
		var keyIndex;
		var divTooltips=document.getElementsByClassName("tooltips");
		var chartAreaRect=document.getElementsByClassName("crossHair");
		var crossHair=document.getElementsByClassName("crossHairLine");

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
		x = e.detail.x+adjustValue;
		tooltipHeight=25;
		rect=document.getElementsByClassName("crossHair");

		for (var i=0; i<crossHair.length; i++){	
			crossHair[i].setAttribute("visibility","visible");	
			tooltip[i].setAttribute("visibility","hidden");
			tooltipText[i].setAttribute("visibility","hidden");

			rectX=parseInt(chartAreaRect[i].getAttribute("x"));
//rectX=chartAreaRect[i].getBoundingClientRect().left;
			crossHair[i].setAttribute("x1",(x+ rectX));
			crossHair[i].setAttribute("x2",(x+rectX));

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
				//textLength=6;
				tooltipWidth=textLength*padding+2*padding;

				tooltip[i].setAttribute("width",tooltipWidth.toString());
				tooltip[i].setAttribute("height",tooltipHeight);

/*				if(DataSet[i][keyIndex][1].toString().length>=6){					
					tooltipText[i].innerHTML=DataSet[i][keyIndex][1].toString().substring(0,6);
				}
				else  */
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
				
/*					if(((DataSet[i][index1][1] + xRatio* Math.abs(sX1-x1)).toFixed(fixedDecimal)).toString().length>=6){
						tooltipText[i].innerHTML=((DataSet[i][index1][1] + xRatio* Math.abs(sX1-x1)).toFixed(fixedDecimal)).toString().substring(0,6);
					}
					else */
					tooltipText[i].innerHTML=((DataSet[i][index1][1] + xRatio* Math.abs(sX1-x1)).toFixed(fixedDecimal)).toString();

					top=Math.floor(yValue);
					left=x1;
					textLength=tooltipText[i].innerHTML.toString().length;
					//textLength=6;

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

	function hideCrossHair(e){
		var element=document.getElementsByClassName("crossHairLine");
		var tooltip=document.getElementsByClassName("tooltip");
		var tooltipText=document.getElementsByClassName("tooltipText");		
		for (var i=0; i<element.length; i++){	
			element[i].setAttribute("visibility","hidden");
			tooltip[i].setAttribute("visibility","hidden");
			tooltipText[i].setAttribute("visibility","hidden");
		}
	}

	function columncharts(selector,tickPosDown){
		var columnMinDiff=0,columnDiff;
		var yDiff,xDiff;
		var x;
		var left,top;
		var point, point1;
		var height,width;
		var pointRightLimit;	
		var pointLowerLeftLimit;
		var plotAreaRect;
		var tooltipList=[],columns=[];
		var tooltip;


		xRangeTicks();
		yRangeTicks();	
		tickPosDown=tickspoistion();
		chartCount=0;
		for(var i=0,count=0; i<ob.chart.yMap.length; i++){
			chartCount++;

			chartDraw = new Svg(selector,ob.chart.width,ob.chart.height,"chartSpace");						
			chartDraw.drawYaxis(ob.yAxisTicks[i],ob.chart.yMap[i],tickPosDown);			
			chartDraw.drawXaxis(ob.xAxisTicks,ob.chart.xMap,tickPosDown);		

			xDiff=ob.xAxisTicks[ob.xAxisTicks.length-1].getTime()-ob.xAxisTicks[0].getTime();							

			pointLowerLeftLimit=chartDraw.coordinate(0,0);

			pointRightLimit=chartDraw.xShift(ob.xAxisTicks[ob.xAxisTicks.length-1].getTime(),ob.xAxisTicks[0].getTime(),xDiff)+chartDraw.marginX;
			
			if(i==0){
				for(var k=1;k<DataSet[i].length;k++){
					if(count<2){
						columnMinDiff=Math.abs(columnMinDiff-chartDraw.xShift(DataSet[i][k-1][0],ob.xAxisTicks[0].getTime() ,xDiff));
						count++;
					} else{
						columnDiff=Math.abs(chartDraw.xShift(DataSet[i][k-1][0],ob.xAxisTicks[0].getTime() ,xDiff)-chartDraw.xShift(DataSet[i][k][0],ob.xAxisTicks[0].getTime() ,xDiff))
						if(columnMinDiff>columnDiff){
							columnMinDiff=columnDiff;	
						}
					}								
				}	

				columnMinDiff= Math.floor(columnMinDiff/2.2);				
			}	
			
			svgLeft=parseInt(chartDraw.svg.getBoundingClientRect().left);
			svgTop=parseInt(chartDraw.svg.getBoundingClientRect().top);

			for(var k=0;k<DataSet[i].length;k++){
				yDiff=ob.yAxisTicks[i][ob.yAxisTicks[i].length-1]-ob.yAxisTicks[i][0];					
				point=chartDraw.coordinate(chartDraw.xShift(DataSet[i][k][0],ob.xAxisTicks[0].getTime() ,xDiff), chartDraw.yShift(DataSet[i][k][1],ob.yAxisTicks[i][0],yDiff));		

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
				DataSet[i][k][2]=x;
				DataSet[i][k][3]=point.y;
				column=chartDraw.drawRect(x,point.y,"column",height,width,"",DataSet[i][k][1],(svgLeft+x),(svgTop+point.y));								
			}

			tooltip=tooltips(chartDraw,point,"column_Tooltip","column_tooltipText");

			chartDraw.svg.addEventListener("mousedown",function(event){drawSelectSpace(event,chartDraw,selector,"column");});
			chartDraw.svg.addEventListener("mousemove",function(event){ResizeSelectSpace(event,chartDraw,selector,"column");});
			chartDraw.svg.addEventListener("mouseup",function(event){DestroySelectSpace(event,chartDraw,selector,"column");});	
			chartDraw.svg.addEventListener("mouseleave",function(event){DestroySelectSpace(event,chartDraw,selector,"column");});	
		}

		var column= document.getElementsByClassName("column");
		for(var i=0; i< column.length; i++){
			left=column[i].getAttribute("x");
			top=column[i].getAttribute("y");
			column[i].addEventListener("mousemove",function(event,left,top){return (function(){disPatchMouseOver(event,left,top);})}(event,left,top),false);
			column[i].addEventListener("mouserollover",highlightColumn,false);
			column[i].addEventListener("mouseout",unfocus,false);
				
		}	
	}

	function disPatchMouseOver(event,left,top){
		var column= document.getElementsByClassName("column");	
		CustomMouseRollOver.detail.x=left;
		CustomMouseRollOver.detail.y=top;
		for(var i=0; i<column.length; i++){	
				column[i].dispatchEvent(CustomMouseRollOver);						
		}
	}

	function highlightColumn(event){
		var left= event.detail.x;
		var top=event.detail.y;	
		var x;
		var padding,tooltipHeight;
		var column= document.getElementsByClassName("column");
		var tooltip= document.getElementsByClassName("column_Tooltip");
		var tooltipText= document.getElementsByClassName("column_tooltipText");
		tooltipHeight=25;
		padding=10;

		var topLimit=ob.chart.marginY;
		var bottomLimit=ob.chart.height- ob.chart.marginY;
		var rightLimit=ob.chart.width;
		var leftLimit=ob.chart.marginX;
		
		for (var i=0; i< column.length;i++){
			if(column[i].getAttribute("x")==left){
				column[i].setAttribute("style","fill:#B74947;");			
			}
		}		
		for(var i=0; i<DataSet.length; i++){

			for(var j=0; j<DataSet[i].length; j++){

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
		var tooltip= document.getElementsByClassName("column_Tooltip");
		var tooltipText= document.getElementsByClassName("column_tooltipText");		
		for (var i=0,k=0; i< column.length;k++,i++){
			column[i].setAttribute("style","fill:#3E72CC;");
		}
		for(var k=0;k<tooltip.length;k++){
			tooltip[k].setAttribute("visibility","hidden");
			tooltipText[k].setAttribute("visibility","hidden");
		}
	}

})();

window.onresize = function() {
    location.reload();
}