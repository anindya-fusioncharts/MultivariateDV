/*-----------Line Chart--------------*/
function LineChart(drawComponents, parsedJSON, index) {
    this.index = index;
    Chart.call(this, drawComponents, parsedJSON);
    if (parsedJSON.chart.xAxisType == 'date')
        this.xDiff = this.parsedJSON.TickList.xAxis[this.parsedJSON.TickList.xAxis.length - 1].getTime() - this.parsedJSON.TickList.xAxis[0].getTime();
    this.yDiff = this.parsedJSON.TickList.yAxis[this.index][this.parsedJSON.TickList.yAxis[index].length - 1] - this.parsedJSON.TickList.yAxis[this.index][0];
}

LineChart.prototype = Object.create(Chart.prototype);
LineChart.prototype.constructor = LineChart;

LineChart.prototype.path = function() {
    var x, y;
    var point = {};
    var path;
    var pathPointString;
    var pathPoints = [];
    var marginX = this.parsedJSON.chart.marginX;
    var width = this.parsedJSON.chart.width;
    var xAxisTickList = this.parsedJSON.TickList.xAxis;
    var height = this.parsedJSON.chart.height;
    var marginY = this.parsedJSON.chart.marginY;
    var topMarginY = this.parsedJSON.chart.topMarginY;
    var interval = (width) / (this.parsedJSON.TickList.xAxis.length - 1);
    var midY = (height - marginY + topMarginY) / 2;
    pathPointString = 'M';
    for (var i = 0; i < this.parsedJSON.data[this.index].length; i++) {
        x = this.parsedJSON.data[this.index][i][0];
        y = this.parsedJSON.data[this.index][i][1];
        if (this.parsedJSON.chart.xAxisType == 'date')
            point.x = this.drawComponents.xShift(x, this.parsedJSON.TickList.xAxis[0], this.xDiff);
        else
            point.x = xAxisTickList.indexOf(x) * interval;
        point.y = this.drawComponents.yShift(y, this.parsedJSON.TickList.yAxis[this.index][0], this.yDiff);
        point = this.drawComponents.coordinate(point.x, point.y);
        pathPointString = pathPointString + point.x + ' ' + point.y + ', ';
        pathPoints[i] = {};
        pathPoints[i].x = point.x;        
        pathPoints[i].y = point.y;
    }
    if (this.parsedJSON.chart.animation == true) {
        pathPointString = "M";
        pathPointString = pathPointString + pathPoints[0].x + ' ' + midY + ', ' + pathPoints[pathPoints.length - 1].x + ' ' + midY;
    }
    path = this.drawComponents.drawPath(pathPointString, "path", pathPoints, midY);

    return path;
}

LineChart.prototype.animatePath = function(path,anchors) {
    var finalPoints,
        x1,
        x2,
        step = 100,
        incrementY = [],
        midY,
        immdiatePoints = [],
        pathString,
        flagIntervalStop;

    midY = path.config.y;
    finalPoints = path.config.finalPoints;

    for (var i = 0, len = finalPoints.length; i < len; i++) {
        immdiatePoints[i] = {};
        immdiatePoints[i].x = finalPoints[i].x;
        immdiatePoints[i].y = midY;
        incrementY[i] = (finalPoints[i].y - midY) / step;
    }

    var refreshIntervalId = setInterval(function() {
        pathString = "M";
        flagIntervalStop=1;
        for (var i = 0, len = finalPoints.length; i < len; i++) {
            if (midY < finalPoints[i].y && immdiatePoints[i].y <= finalPoints[i].y){
                immdiatePoints[i].y = immdiatePoints[i].y + incrementY[i];
                pathString = pathString + immdiatePoints[i].x + " " + immdiatePoints[i].y + ",";
                flagIntervalStop=0;
            }else if (midY > finalPoints[i].y && immdiatePoints[i].y >= finalPoints[i].y){
                immdiatePoints[i].y = immdiatePoints[i].y + incrementY[i];
                pathString = pathString + immdiatePoints[i].x + " " + immdiatePoints[i].y + ",";
                flagIntervalStop=0;
            }else 
                pathString = pathString + immdiatePoints[i].x + " " + immdiatePoints[i].y + ",";
        }   
        if(flagIntervalStop==1){
            clearInterval(refreshIntervalId);  
            for(var i=0, len=anchors.length; i<len; i++){   
                setTimeout(function(){ 
                    anchors[this].graphics.setAttribute("visibility", "visible");
                }.bind(i), Math.random()*500);                              
            }
        }
        else{
            path.graphics.setAttribute("d", pathString);           
        }
    }, 15);
}

LineChart.prototype.anchor = function() {
    var x, y;
    var point = {};    
    var svgLeft, svgTop;
    var interval;
    var marginX = this.parsedJSON.chart.marginX;
    var width = this.parsedJSON.chart.width;
    var xAxisTickList = this.parsedJSON.TickList.xAxis;
    interval = (width) / (this.parsedJSON.TickList.xAxis.length - 1);
    this.anchor = [];
    svgLeft = parseInt(this.drawComponents.svg.getBoundingClientRect().left);
    svgTop = parseInt(this.drawComponents.svg.getBoundingClientRect().top);
    for (var i = 0; i < this.parsedJSON.data[this.index].length; i++) {
        x = this.parsedJSON.data[this.index][i][0];
        if (this.parsedJSON.chart.xAxisType == 'date') {
            point.x = this.drawComponents.xShift(x, xAxisTickList[0], this.xDiff);
        } else
            point.x = xAxisTickList.indexOf(x) * interval;
        y = this.parsedJSON.data[this.index][i][1];
        point.y = this.drawComponents.yShift(y, this.parsedJSON.TickList.yAxis[this.index][0], this.yDiff);
        point = this.drawComponents.coordinate(point.x, point.y);

        this.anchor[i] = this.drawComponents.drawCircle(point, 5, "plotPoint", x, y, (svgLeft + point.x), (svgTop + point.y));
        if (this.parsedJSON.chart.animation == true) {
            this.anchor[i].graphics.setAttribute("visibility", "hidden");
        }
    }
    return this.anchor;
}

LineChart.prototype.chartArea = function() {
    var point = {};
    var point1 = {};
    var x, y, h, w;
    var _chartArea;
    var left;
    x = 0;
    y = this.parsedJSON.TickList.yAxis[this.index][this.parsedJSON.TickList.yAxis[this.index].length - 1];

    point.x = x;
    point.y = this.drawComponents.yShift(y, this.parsedJSON.TickList.yAxis[this.index][0], this.yDiff);
    point = this.drawComponents.coordinate(point.x, point.y + 3);

    w = Math.abs(this.parsedJSON.chart.width);
    h = Math.abs(this.parsedJSON.chart.height - this.parsedJSON.chart.topMarginY - this.parsedJSON.chart.marginY);

    _chartArea = this.drawComponents.drawRect(point.x, point.y, "chartArea", h, w, "stroke:#black; fill:transparent");

    left = _chartArea.graphics.getBoundingClientRect().left;

    _chartArea.graphics.addEventListener("mousemove", function() {
        CustomMouseRollOver.detail.x = Math.ceil(event.clientX - left);
        _chartArea.graphics.dispatchEvent(CustomMouseRollOver);
    });
    return _chartArea;
}

LineChart.prototype.hairLine = function() {
    var point = {};
    var point1 = {};
    var x, y, h, w;
    var _hairLine;

    y = this.parsedJSON.TickList.yAxis[this.index][this.parsedJSON.TickList.yAxis[this.index].length - 1];

    point.x = 0;
    point.y = this.drawComponents.yShift(y, this.parsedJSON.TickList.yAxis[this.index][0], this.yDiff);
    point = this.drawComponents.coordinate(point.x, point.y);

    point1.x = point.x;
    point1.y = point.y + Math.abs(this.parsedJSON.chart.height - this.parsedJSON.chart.topMarginY - this.parsedJSON.chart.marginY) - 6;
    _hairLine = this.drawComponents.drawLine(point, point1, "HairLine");
    return _hairLine;
}

LineChart.prototype.crossHair = function() {
    var _chartArea, _hairLine;
    _chartArea = this.chartArea();
    _hairLine = this.hairLine();
    _hairLine.graphics.setAttribute("visibility", "hidden");
    return {
        "_chartArea": _chartArea,
        "_hairLine": _hairLine
    };
}

LineChart.prototype.syncCrossHair = function(anchors, crossHairs, toolTips, adjustingValue, e) {
    var cx;
    var adjustingValue;
    var x;
    var fixedDecimal;
    var index1, index2, slop, xRatio, sX1, sX2, sY1, sY2, cValue, yValue;
    var top, topLimit, bottomLimit, left, leftLimit, rightLimit;
    var x;
    var keyIndex;
    var x1, y1, y2, rectX, rectWidth;
    var textLength;
    var padding;
    var tooltipHeight, tooltipWidth;
    var pointX, pointY;
    var parentOffset;
    var rect;
    var r;
    var limits = {};
    var posToolTips;
    var tooltipText;
    var toolTipSize = {};

    padding = 10;
    tooltipHeight = 25;

    x = e.detail.x + adjustingValue;

    for (var i = 0, len = crossHairs.length; i < len; i++) {
        crossHairs[i]._hairLine.graphics.setAttribute("visibility", "visible");
        crossHairs[i]._hairLine.graphics.setAttribute("x1", x);
        crossHairs[i]._hairLine.config.x1 = x;
        crossHairs[i]._hairLine.graphics.setAttribute("x2", x);
        crossHairs[i]._hairLine.config.x2 = x;

        toolTips[i].rect.graphics.setAttribute("visibility", "hidden");
        toolTips[i].text.graphics.setAttribute("visibility", "hidden");

        rectX = parseInt(crossHairs[i]._chartArea.config.x);
        rectWidth = parseInt(crossHairs[i]._chartArea.config.width);

        x1 = parseInt(crossHairs[i]._hairLine.config.x1);
        y1 = parseInt(crossHairs[i]._hairLine.config.y1);
        y2 = parseInt(crossHairs[i]._hairLine.config.y2);

        leftLimit = rectX;
        rightLimit = rectX + rectWidth;
        topLimit = y1;
        bottomLimit = y2;

        limits.bottomLimit = bottomLimit;
        limits.rightLimit = rightLimit;
        limits.topLimit = topLimit;

        toolTipSize.tooltipHeight = tooltipHeight;

        for (var j = 0; j < anchors[i].length; j++) {
            cx = anchors[i][j].config.cx;
            r = anchors[i][j].config.r;
            if ((x - r) <= cx && (x + r) >= cx) {
                anchors[i][j].graphics.setAttribute("r", 6);
                anchors[i][j].config.r = 6;
                anchors[i][j].graphics.setAttribute("style", "stroke:#f44336");
                toolTips[i].text.graphics.innerHTML = anchors[i][j].config.Ydata;
                textLength = anchors[i][j].config.Ydata.toString().length;

                tooltipWidth = textLength * padding + 2 * padding;
                toolTips[i].rect.graphics.setAttribute("width", tooltipWidth.toString());
                toolTips[i].rect.graphics.setAttribute("height", tooltipHeight);

                toolTipSize.tooltipWidth = tooltipWidth;
                left = anchors[i][j].config.cx;
                top = anchors[i][j].config.cy;
                posToolTips = placeTooltip(limits, left, top, toolTipSize);

                toolTips[i].rect.graphics.setAttribute("x", posToolTips.pointX);
                toolTips[i].rect.graphics.setAttribute("y", posToolTips.pointY - 10);

                toolTips[i].text.graphics.setAttribute("x", (posToolTips.pointX + Math.floor((tooltipWidth - (textLength * padding)) / 2)));
                toolTips[i].text.graphics.setAttribute("y", (posToolTips.pointY + 7));

                toolTips[i].rect.graphics.setAttribute("visibility", "visible");
                toolTips[i].text.graphics.setAttribute("visibility", "visible");

            } else {
                anchors[i][j].graphics.setAttribute("r", 5);
                anchors[i][j].config.r = 5;
                anchors[i][j].graphics.setAttribute("style", "stroke:#7CB5EC");
                if (j > 0) {
                    if (anchors[i][j - 1].config.cx < x && anchors[i][j].config.cx > x) {
                        sX1 = anchors[i][j - 1].config.cx;
                        sY1 = anchors[i][j - 1].config.cy;
                        sX2 = anchors[i][j].config.cx;
                        sY2 = anchors[i][j].config.cy;
                        slop = ((sY2 - sY1) / (sX2 - sX1)).toFixed(3);
                        cValue = (sY2 - slop * sX2);
                        yValue = Math.abs((slop * x1) + cValue);
                        xRatio = (anchors[i][j].config.Ydata - anchors[i][j - 1].config.Ydata) / Math.abs(sX1 - sX2);

                        if (anchors[i][j].config.Ydata % 1 != 0)
                            fixedDecimal = (anchors[i][j].config.Ydata % 1).toString().length;
                        else
                            fixedDecimal = 0;
                        tooltipText = ((anchors[i][j - 1].config.Ydata + xRatio * Math.abs(sX1 - x1)).toFixed(fixedDecimal)).toString();
                        toolTips[i].text.graphics.innerHTML = tooltipText;
                        textLength = tooltipText.length;
                        tooltipWidth = textLength * padding + 2 * padding;

                        toolTipSize.tooltipWidth = tooltipWidth;

                        top = Math.floor(yValue);
                        left = x1;
                        posToolTips = placeTooltip(limits, left, top, toolTipSize);

                        toolTips[i].rect.graphics.setAttribute("width", tooltipWidth.toString());
                        toolTips[i].rect.config.width = tooltipWidth.toString();

                        toolTips[i].rect.graphics.setAttribute("height", tooltipHeight);
                        toolTips[i].rect.config.height = tooltipHeight;

                        toolTips[i].rect.graphics.setAttribute("x", posToolTips.pointX);
                        toolTips[i].rect.graphics.setAttribute("y", posToolTips.pointY - 10);

                        toolTips[i].rect.config.x = posToolTips.pointX;
                        toolTips[i].rect.config.y = posToolTips.pointY;

                        toolTips[i].text.graphics.setAttribute("x", (posToolTips.pointX + Math.floor((tooltipWidth - (textLength * padding)) / 2)));
                        toolTips[i].text.graphics.setAttribute("y", (posToolTips.pointY + 7));

                        toolTips[i].text.config.x = (posToolTips.pointX + Math.floor((tooltipWidth - (textLength * padding)) / 2));
                        toolTips[i].text.config.y = (posToolTips.pointY + 7);

                        toolTips[i].rect.graphics.setAttribute("visibility", "visible");
                        toolTips[i].text.graphics.setAttribute("visibility", "visible");
                    }
                }
            }
        }
    }
}

LineChart.prototype.hideCrossHair = function(anchors, crossHairs, toolTips, e) {
    for (var i = 0, len = anchors.length; i < len; i++) {
        crossHairs[i]._hairLine.graphics.setAttribute("visibility", "hidden");
        crossHairs[i]._hairLine.graphics.setAttribute("x1", "1");
        crossHairs[i]._hairLine.graphics.setAttribute("x2", "1");

        toolTips[i].rect.graphics.setAttribute("visibility", "hidden");
        toolTips[i].text.graphics.setAttribute("visibility", "hidden");
        for (var j = 0, len1 = anchors[i].length; j < len1; j++) {
            anchors[i][j].graphics.setAttribute("style", "fill:#ffffff");
            anchors[i][j].graphics.setAttribute("r", 5);
            anchors[i][j].config.r = 5;
        }
    }
}

LineChart.prototype.reset = function(plotPoints) {
    for (var i = 0, len = plotPoints.length; i < len; i++) {
        for (var j = 0, len1 = plotPoints[i].length; j < len1; j++) {
            plotPoints[i][j].graphics.setAttribute("style", "stroke:#f44336");
            plotPoints[i][j].graphics.setAttribute("r", 5);
        }
    }
}

LineChart.prototype.select = function(plotPoints) {
    var x1 = parseInt(selectSpace.style.left);
    var y1 = parseInt(selectSpace.style.top);
    var x2 = x1 + parseInt(selectSpace.style.width);
    var y2 = y1 + parseInt(selectSpace.style.height);
    var maxX = -1,
        minX = 99999;
    var x, y;

    for (var i = 0, len = plotPoints.length; i < len; i++) {
        for (var j = 0, len1 = plotPoints[i].length; j < len1; j++) {
            x = Number(plotPoints[i][j].config.absoluteX);
            y = Number(plotPoints[i][j].config.absoluteY);

            if (x >= x1 && x <= x2 && y >= y1 && y <= y2) {
                plotPoints[i][j].graphics.setAttribute("style", "stroke:#f44336");
                plotPoints[i][j].graphics.setAttribute("r", 6);
                if (minX > Number(plotPoints[i][j].config.cx))
                    minX = Number(plotPoints[i][j].config.cx);

                if (maxX < Number(plotPoints[i][j].config.cx))
                    maxX = Number(plotPoints[i][j].config.cx);
            }
        }
    }

    for (var i = 0, len = plotPoints.length; i < len; i++) {
        for (var j = 0, len1 = plotPoints[i].length; j < len1; j++) {
            if (minX <= Number(plotPoints[i][j].config.cx) && Number(plotPoints[i][j].config.cx) <= maxX) {
                plotPoints[i][j].graphics.setAttribute("style", "stroke:#f44336");
                plotPoints[i][j].graphics.setAttribute("r", 6);

            }
        }
    }
}