;(function(){ 

	window.render=function(input,selector){
		var chart= new chartInstantiate(selector,input);

		return this;
	}

	function chartInstantiate(selector,input){
		var parseJSON= JSONparse(input);
		parseJSON.xAxisTicks=[];
		parseJSON.xAxisTicks=xRangeTicks(parseJSON);

	}

	function JSONparse(input){
		var jsonData;
		var parsedJSON={};
		var noData,keys,flag;
		var uniqueKeys=[];

		if(typeof input =="string")
			jsonData=JSON.parse(input);
		else
			jsonData=input;
		
		parsedJSON.chart={};
		parsedJSON.chart.caption=jsonData.chart.caption || "Caption";
		parsedJSON.chart.subCaption=jsonData.chart.subCaption || "subCaption";
		parsedJSON.chart.height=jsonData.chart.height || 300;		
		parsedJSON.chart.height=(parsedJSON.chart.height>500 || parsedJSON.chart.height<200) ? 300 : parsedJSON.chart.height;
		parsedJSON.chart.width= jsonData.chart.width || 500;						
		parsedJSON.chart.width=(parsedJSON.chart.width>1000 || parsedJSON.chart.width<200)?500: parsedJSON.chart.width;
		parsedJSON.chart.marginX=80;
		parsedJSON.chart.marginY=90;
		parsedJSON.chart.xMap=jsonData.chart.xAxisMap;	

		noData=jsonData.data.length;
		for(var i=0,k=0; i<noData; i++){
			keys=Object.keys(jsonData.data[i]);
			
			if(k==0 && i==0)
				uniqueKeys[k]=keys[0];
		
			for(var j=0; j<keys.length; j++){
				flag=0;
				for(var l=0;l<uniqueKeys.length; l++){
					if(uniqueKeys[l]==keys[j]){
						flag=1;												
					}
				}
				if(flag==0 && keys[j]!=parsedJSON.chart.xMap){
					k++;
					uniqueKeys[k]=keys[j];
								
				}				
			}	
		}


		parsedJSON.chart.yMap=uniqueKeys;	
		parsedJSON.data=[];	

		for(var i=0; i< parsedJSON.chart.yMap.length;  i++){
			parsedJSON.data[i]=[];
			var k=0;
			for(var j=0;j<jsonData.data.length;  j++){
				if(jsonData.data[j][parsedJSON.chart.yMap[i]]!= undefined && jsonData.data[j][parsedJSON.chart.xMap]!= undefined){				
					parsedJSON.data[i][k]=[];
					parsedJSON.data[i][k][0]= Number(jsonData.data[j][parsedJSON.chart.yMap[i]]);
					parsedJSON.data[i][k][1]= new Date(jsonData.data[j][parsedJSON.chart.xMap]);
console.log(parsedJSON.data[i][k][1]);											
					k++;				
				}
			}
		}
		return parsedJSON;
	}

	function xRangeTicks(parsedJSON){

		var diff, diffDigit;
		var interval;
		var index;
		var tickValue;
		var ticks=[];
		var intermediateDate;
		var fixedDecimal;
		var date,xMax,xMin;

		for (var i=0; i<parsedJSON.data.length ;  i++){
			for(var  j=0; j<parsedJSON.data[i].length ; j++){
				if(xMax==undefined && xMin==undefined){
					xMax=parsedJSON.data[i][j][1];
					xMin=parsedJSON.data[i][j][1];
				}		
				date=parsedJSON.data[i][j][1];
//console.log(parsedJSON.data[i][j][1]);		
				if(xMax < date)
					xMax=date;
				if(xMin > date)
					xMin=date;
			}
		}
						
		diff=xMax.getTime() - xMin.getTime();
		
		if(parsedJSON.chart.width>=800)
			interval=10;
		if(k<=10 && parsedJSON.chart.width<800)
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
	

})();	