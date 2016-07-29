
/*---------------render start--------------*/
window.render=function(rawJSON,selector){
	var chart= new Engine(rawJSON,selector);
	
	chart.customSort=function(){
		var dataList=this.parsedJSON.data;
		var dataMapList=this.parsedJSON.chart.yMap;

		console.log(dataList,dataMapList);
	}
	chart.render();
	if(chartType=="line"){
		chart.crossHairHandler();
	}
	
}

/*----------render end----------------------------*/

