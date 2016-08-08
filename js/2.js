
/*---------------render start--------------*/
window.render=function(rawJSON,selector){
	try {	
		var chart= new Engine(rawJSON,selector);
		
		chart.customSort=function(){
			var dataList=this.parsedJSON.data;
			var dataMapList=this.parsedJSON.chart.yMap;

		//	console.log(dataList,dataMapList);
		}
		chart.render();
		if(chartType=="line"){
			chart.crossHairHandler();
		}
	} catch(err){
		document.getElementById(selector).innerHTML="Chart can not be rendered.";
	}
	
}

/*----------render end----------------------------*/

