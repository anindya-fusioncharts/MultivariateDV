/*--------tooltip start------------*/
function tooltip(drawComponents,point,class_Tooltip,class_TooltipText){	
	var tooltipStyle="stroke:#8D6D60 ;stroke-width:1; fill:#FDD9CB";
	var tooltipTextStyle='fill: #8D6D60';
	var tooltip=drawComponents.drawRect(point.x+5,point.y,class_Tooltip,10,0,tooltipStyle);	
	var tooltipText=drawComponents.drawText(point,"","",class_TooltipText,0);
	tooltipText.graphics.setAttribute("style",tooltipTextStyle);			
	drawComponents.svg.insertBefore(tooltip.graphics,tooltipText.graphics);
	return {
		"rect":tooltip,
		"text":tooltipText
	}
}
/*---------------tooltip end--------------*/