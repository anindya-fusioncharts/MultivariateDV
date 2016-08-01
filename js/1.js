"use strict";

/*-------global functions and variables start-----------*/
var noChartRow;
var chartType;
var DataSet=[];
var selectSpace;
var mousedown=false;
var mouseLeft, mouseTop;
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
	internalDataStructure.chart.type=chartType=rawJSON.chart.type;	

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

function drawChartHeading(selector,parsedJSON) {
	var chartHeadings=new DrawComponents(selector,window.innerWidth-200,50,parsedJSON.chart.marginX,parsedJSON.chart.marginY,0,"Heading");
	var point;
	point={
		x: chartHeadings.width- Math.floor(chartHeadings.width/2 -chartHeadings.marginX),
		y:50-30
	};
	chartHeadings.drawText(point,".35em",parsedJSON.chart.caption,"Caption");	

	point={
		x: chartHeadings.width- Math.floor(chartHeadings.width/2 -chartHeadings.marginX),
		y:50-10
	};
	chartHeadings.drawText(point,".35em",parsedJSON.chart.subCaption,"subCaption");	

	var br=document.createElement("br");
	document.getElementById(selector).appendChild(br);		
}


/*-------global functions end----------------*/
/*---------custom event listener start--------------*/
var CustomMouseRollOver=new CustomEvent("mouserollover",{"detail":{x:"",y:"",left:""}});
/*-----------custom event listener stop----------------*/
/*---------on window resize-----------*/
window.onresize = function() {
    location.reload();
}
