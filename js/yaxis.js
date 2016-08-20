function YAxis(parsedJSON, drawComponents, iChart, tickPosDown) {
    this.parsedJSON = parsedJSON;
    this.iChart = iChart;
    this.tickPosDown = tickPosDown;
    Axis.call(this, drawComponents);
}

YAxis.prototype.yRangeTicks = function() {
    var parsedJSON = this.parsedJSON;
    var diff, diffDigit, computedMin, computedMax;
    var negativeFlag = 0,
        negatedmin = 0;
    var max, min, max_countDecimals, countDeci;
    var ticks = [];
    var decimalFlag, count;
    var interval;
    var tickValue;
    var index;
    var d, r;
    var flag = 0;

    decimalFlag = 1;

    for (var i = 0; i < parsedJSON.data.length; i++) {
        max = undefined;
        min = undefined;
        for (var j = 0; j < parsedJSON.data[i].length; j++) {
            if (max == undefined && min == undefined) {
                max = parsedJSON.data[i][j][1];
                min = parsedJSON.data[i][j][1];
            }
            if (max < parsedJSON.data[i][j][1])
                max = parsedJSON.data[i][j][1];
            if (min > parsedJSON.data[i][j][1])
                min = parsedJSON.data[i][j][1];
            countDeci = countDecimals(parsedJSON.data[i][j][1]);
            if (max_countDecimals < countDeci)
                max_countDecimals = countDeci;
        }

        negatedmin = 0;
        //------------ new min

        if (min < 0) {
            min *= -1;

            count = -1;
            d = min;
            while (d) {
                r = Math.floor(d % 10);
                d = Math.floor(d / 10);
                count++;
            }
            computedMin = (r + 1) * Math.pow(10, count) * -1;
            negativeFlag = 1;
        } else {
            count = -1;
            d = min;
            while (d) {
                r = Math.floor(d % 10);
                d = Math.floor(d / 10);
                count++;
            }

            if (count)
                computedMin = r * Math.pow(10, count);
            else
                computedMin = 0;
        }
        //------------- new max
        if (max < 0) {
            max *= -1;
            count = -1;
            d = max;
            while (d) {
                r = Math.floor(d % 10);
                d = Math.floor(d / 10);
                count++;
            }

            if (count)
                computedMax = r * Math.pow(10, count);
            else
                computedMax = 0;

        } else {
            count = -1;
            d = max;
            while (d) {
                r = Math.floor(d % 10);
                d = Math.floor(d / 10);
                count++;
            }

            computedMax = (r + 1) * Math.pow(10, count);
        }

        if (computedMax % 1 != 0)
            computedMax = parseInt(computedMax.toString().split('.')[0] + '' + computedMax.toString().split('.')[1].substring(0, max_countDecimals));

        if (computedMin % 1 != 0)
            computedMin = parseInt(computedMin.toString().split('.')[0] + '' + computedMin.toString().split('.')[1].substring(0, max_countDecimals));


        if (negativeFlag == 1) {
            negatedmin = computedMin;
            computedMax -= computedMin;
            computedMin = 0;
        }
        if (Math.abs(computedMax) < 1) {
            decimalFlag = -1;
        }
        //------ticks

        index = 2;


        if (parseInt(computedMax.toString()[1]) == 0)
            index = 1;
        diffDigit = Math.floor(computedMax / Math.pow(10, (computedMax.toString().length - index))) - Math.floor(computedMin / Math.pow(10, (computedMax.toString().length - index)));

        if (Math.floor(computedMin / Math.pow(10, (computedMax.toString().length - index))) == 0)
            computedMin = 0;

        if (diffDigit >= 0 && diffDigit <= 1)
            interval = 0.25;
        else if (diffDigit >= 0 && diffDigit <= 1)
            interval = 0.25;
        else if (diffDigit > 1 && diffDigit <= 2)
            interval = 0.5;
        else if (diffDigit > 2 && diffDigit <= 6)
            interval = 1;
        else if (diffDigit > 6 && diffDigit <= 12)
            interval = 2;
        else if (diffDigit > 12 && diffDigit <= 20)
            interval = 4;
        else if (diffDigit > 20 && diffDigit <= 30)
            interval = 5;
        else if (diffDigit > 30 && diffDigit < 40)
            interval = 7;
        else if (diffDigit >= 40)
            interval = 10;


        ticks[i] = [];
        ticks[i][0] = computedMin + negatedmin;

        tickValue = ticks[i][0];
        for (var j = 1; tickValue <= (computedMax + negatedmin); j++) {
            ticks[i][j] = ticks[i][j - 1] + interval * Math.pow(10, decimalFlag * (computedMax.toString().length - index));
            tickValue = ticks[i][j];
        }
    }
    return ticks;
}


YAxis.prototype.axisLine = function(tickList) {
    var len, diff, plotFactor;
    var y1;
    var x1;
    var y2;
    var x2;
    var points = {},
        point1 = {},
        point2 = {};

    var ticktext;
    var min;

    len = tickList.length;

    diff = Math.abs(tickList[len - 1] - tickList[0]);

    min = tickList[0];

    for (var i = 0; i < tickList.length; i++) {
        if (tickList[0] < 0)
            y1 = this.drawcomponents.yShift(tickList[i] - tickList[0], tickList[0] - tickList[0], diff);
        else
            y1 = this.drawcomponents.yShift(tickList[i], tickList[0], diff);
        x1 = -(this.drawcomponents.marginX - this.drawcomponents.paddingX2 - 4);
        y2 = y1;
        x2 = -(this.drawcomponents.marginX - this.drawcomponents.paddingX1 - 4);
        point1 = this.drawcomponents.coordinate(x1, y1);
        point2 = this.drawcomponents.coordinate(x2, y2);
        this.drawcomponents.drawLine(point1, point2, "yAxisTick");
    }
}

YAxis.prototype.yAxisTicksText = function(tickList, noDiv) {
    var y1;
    var x1;
    var y2;
    var x2;
    var point = {},
        point0 = {},
        point1 = {},
        point2 = {},
        point3 = {};
    var points;
    var tickText;
    var count = 0;
    var yPrev = 0;
    var yAxisTicks = [];
    var diff;
    var fixedDecimal;

    diff = Math.abs(tickList[tickList.length - 1] - tickList[0]);
    for (var i = 0; i < tickList.length; i++) {
        if (tickList[0] < 0)
            y1 = this.drawcomponents.yShift(tickList[i] - tickList[0], tickList[0] - tickList[0], diff);
        else
            y1 = this.drawcomponents.yShift(tickList[i], tickList[0], diff);
        x1 = -(this.drawcomponents.marginX - this.drawcomponents.paddingX2 - 4);
        y2 = y1;
        x2 = -(this.drawcomponents.marginX - this.drawcomponents.paddingX1 - 4);

        point1 = this.drawcomponents.coordinate(x1, y1);
        point2 = this.drawcomponents.coordinate(x2, y2);

        if (typeof tickList[i] == 'number') {
            if (Math.abs(tickList[i]) < 1000) {
                point = this.drawcomponents.coordinate(-(this.drawcomponents.marginX - this.drawcomponents.paddingTextX - 8), (y1 - 4));
                if (tickList[tickList.length - 1] < 1)
                    fixedDecimal = tickList[tickList.length - 1].toString().length - 2;
                else
                    fixedDecimal = 2;
                if (tickList[i] == 0)
                    tickText = '0';
                else {
                    if (tickList[i] % 1 == 0)
                        tickText = tickList[i].toString();
                    else
                        tickText = tickList[i].toFixed(fixedDecimal).toString();
                }
            }
            if (Math.abs(tickList[i]) >= 1000 && Math.abs(tickList[i]) < 1000000) {
                tickText = tickList[i] / 1000 + "" + "K";
            }
            if (Math.abs(tickList[i]) >= 1000000 && Math.abs(tickList[i]) < 1000000000) {
                tickText = tickList[i] / 1000000 + "" + "M";
            }
            if (Math.abs(tickList[i]) >= 1000000000 && Math.abs(tickList[i]) < 1000000000000) {
                tickText = tickList[i] / 1000000000 + "" + "B";
            }
            if (Math.abs(tickList[i]) >= 1000000000000) {
                tickText = tickList[i] / 1000000000000 + "" + "T";
            }
        }
        if (noDiv == undefined) {
            point0 = this.drawcomponents.coordinate(-1, y1);
            point1 = this.drawcomponents.coordinate(this.drawcomponents.width, y1);
            point2 = this.drawcomponents.coordinate(this.drawcomponents.width, yPrev);
            point3 = this.drawcomponents.coordinate(-1, yPrev);

            points = point0.x + ',' + point0.y + ' ' + point1.x + ',' + point1.y + ' ' + point2.x + ',' + point2.y + ' ' + point3.x + ',' + point3.y + ' ' + point0.x + ',' + point0.y;
            if (i != 0)
                if (count % 2 == 0)
                    this.drawcomponents.drawPolygon(points, "divDash1");
                else
                    this.drawcomponents.drawPolygon(points, "divDash2");
            count++;
            yPrev = y1;
        }
        point = this.drawcomponents.coordinate(-(this.drawcomponents.marginX - this.drawcomponents.paddingTextX - 8), (y1 - 5));
        yAxisTicks[i] = this.drawcomponents.drawText(point, ".35em", tickText, "yAxisTickText");
    }
    return yAxisTicks;
}

YAxis.prototype.title = function(tickPosDown, title) {
    var points, point;
    var point0;
    var point1;
    var point2;
    var point3;

    if (tickPosDown) {
        point0 = this.drawcomponents.coordinate((-1), (-this.drawcomponents.marginY + 2));
        point1 = this.drawcomponents.coordinate((this.drawcomponents.width), (-this.drawcomponents.marginY + 2));
        point2 = this.drawcomponents.coordinate((this.drawcomponents.width), (-this.drawcomponents.marginY + 37));
        point3 = this.drawcomponents.coordinate((-1), (-this.drawcomponents.marginY + 37));

        points = point0.x + ',' + point0.y + ' ' + point1.x + ',' + point1.y + ' ' + point2.x + ',' + point2.y + ' ' + point3.x + ',' + point3.y + ' ' + point0.x + ',' + point0.y;
        this.drawcomponents.drawPolygon(points, "titles");
        point = {
            x: (point2.x + this.drawcomponents.marginX) / 2,
            y: point2.y + 27
        };
    } else {
        point0 = this.drawcomponents.coordinate((-1), (this.drawcomponents.height - this.drawcomponents.topMarginY - 30));
        point1 = this.drawcomponents.coordinate((this.drawcomponents.width), (this.drawcomponents.height - this.drawcomponents.topMarginY - 30));
        point2 = this.drawcomponents.coordinate((this.drawcomponents.width), (this.drawcomponents.height - this.drawcomponents.topMarginY - 78));
        point3 = this.drawcomponents.coordinate((-1), (this.drawcomponents.height - this.drawcomponents.topMarginY - 78));

        points = point0.x + ',' + point0.y + ' ' + point1.x + ',' + point1.y + ' ' + point2.x + ',' + point2.y + ' ' + point3.x + ',' + point3.y + ' ' + point0.x + ',' + point0.y;
        this.drawcomponents.drawPolygon(points, "titles");
        point = {
            x: (point2.x + this.drawcomponents.marginX) / 2,
            y: point2.y - 15
        };
    }
    return this.drawcomponents.drawText(point, ".5em", title, "yAxisTitle", "0");
}

YAxis.prototype.draw = function() {
    this.axisLine(this.parsedJSON.TickList.yAxis[this.iChart]);
    this.yAxisTicksText(this.parsedJSON.TickList.yAxis[this.iChart]);
    this.title(this.tickPosDown, this.parsedJSON.chart.yMap[this.iChart].toUpperCase())
}
