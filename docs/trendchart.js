var qAt = document.URL.indexOf("?q=");
var urlParams = document.URL.substr(qAt+3);
var decodedParams = decodeURIComponent(urlParams);
var chartDef = JSON.parse(decodedParams); // Definition of the chart, as an object

function formatDate(date) {
    // Return formatted date string as we want to display
    var month = '' + (date.getMonth() + 1);
    var day = '' + date.getDate();
    var year = date.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

/*
 * Find the min/max date from the ChartDef
 */
var minDate = new Date(2100, 0, 1); //Month is 0-11 in JavaScript
var maxDate = new Date(2000, 0, 1);
chartDef.milestones.forEach(milestoneMinMaxDate);

function milestoneMinMaxDate(milestone) {
    milestone.d.forEach(plotpointMinMax);
}
function plotpointMinMax(plotPoint) {
    // Math.min is invoked on (automatically converted) Unix Epoch number. Then convert back to date.
    minDate = new Date(Math.min(minDate, new Date(plotPoint.r), new Date(plotPoint.p)));
    maxDate = new Date(Math.max(maxDate, new Date(plotPoint.r), new Date(plotPoint.p)));
}

/*
 * We now have the min/max dates. Calculate the dates for the grid lines: the axis dates.
 */
var axisDates = [];
if (chartDef.tsUnits == "Weeks") {
    // Move start date to a Monday
    var days = minDate.getDay(); // 0 = Sunday
    if (days==0) {
        days=-6;
    } else {
        days=1-days;
    }
    minDate.setDate(minDate.getDate() + days);
    let d = minDate;
    axisDates.push(new Date(d));
    do {
        d.setDate(d.getDate() + (7 * chartDef.tsCount)); // Increment by tsCount weeks
        axisDates.push(new Date(d));
    } while (d < maxDate) 
} else {
    // Set to first day of the month
    minDate = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
    let d = minDate;
    axisDates.push(new Date(d));
    do {
        d.setMonth(d.getMonth() + chartDef.tsCount); // Increment by tsCount months
        axisDates.push(new Date(d));
    } while (d < maxDate) 
}

const chartSize = chartDef.chartSize;
const leftMargin = 100;
const topMargin = 100;
const legendOverflowRight = 200;
const legendOverflowBottom = 200;
const legendMargin = leftMargin + (chartSize/2) + 50;
const canvasWidth = leftMargin + chartSize + legendOverflowRight;
const canvasHeight = topMargin + chartSize + legendOverflowBottom;
minDate = axisDates[0];
maxDate = axisDates[axisDates.length-1];
const dateRange = maxDate - minDate; // In seconds

function canvasXpos(date) {
    return leftMargin + chartSize * (date-minDate) / dateRange;
}
function canvasYpos(date) {
    return topMargin + chartSize * (maxDate-date) / dateRange;
}


document.getElementById('div-h1').innerText = chartDef.title
// initialize SVG.js
var draw = SVG('drawing')
draw.size(canvasWidth,canvasHeight);


// Draw horizontal gridlines
for (let i = 0; i < axisDates.length; i++) {
    var axisDate = axisDates[i];
    var lineLength = chartSize * (axisDate - minDate) / dateRange;
    var yPos = canvasYpos(axisDate);
    draw.line(leftMargin, yPos, leftMargin + lineLength, yPos).stroke({ width: 1 });

    var text = draw.plain(formatDate(axisDate))
    text.attr({ x: 0, y: (yPos+5) })
    text.font({ family: 'Helvetica', size: 12 })
}

// Draw vertical gridlines
for (let i = 0; i < axisDates.length; i++) {
    var axisDate = axisDates[i];
    var lineLength = chartSize * (maxDate - axisDate) / dateRange;
    var xPos = canvasXpos(axisDate);
    draw.line(xPos, topMargin, xPos, topMargin + lineLength).stroke({ width: 1 });

    var text = draw.plain(formatDate(axisDate))
    var yPos = topMargin -5; // give a little space
    // Move xPos across, 100 down. LineTo 50 across, -50 down
    text.path(`M ${xPos} ${yPos} l 50 -50`)
    text.font({ family: 'Helvetica', size: 12 })
}

// Draw diagonal line
draw.line(leftMargin, topMargin+chartSize, leftMargin+chartSize, topMargin).stroke({ width: 1 });

// Plot milestones
chartDef.milestones.forEach(plotMilestone);
function plotMilestone(milestone) {
    // Put the milestone code on the left axis
    var text = draw.plain(milestone.c);
    var firstMilestoneDate = new Date(milestone.d[0].p);
    text.attr({ x: (leftMargin-15), y: canvasYpos(firstMilestoneDate)+5 })
    text.font({ family: 'Helvetica', size: 12 })

    // Produce an array of point like this:
    // var polyline = draw.polyline([[0,0], [100,50], [50,100]])
    var points = []
    for (let i = 0; i < milestone.d.length; i++) {
        let x = canvasXpos(new Date(milestone.d[i].r));
        let y = canvasYpos(new Date(milestone.d[i].p));
        points.push([x,y]);
    }
    var polyline = draw.polyline(points).fill('none').stroke({ width: 2, color: '#3b5895' });
}

// Overlay a triangle to hide the lines under the triangle
var polygon = draw.polygon([ [leftMargin, (topMargin+chartSize)]
                           , [(leftMargin+chartSize), topMargin]
                           , [(leftMargin+chartSize), (topMargin+chartSize)]
                          ]).fill("#FFFFFF");

// Display the legend
displayLegend(chartDef.milestones);
function displayLegend(milestones) {
    var yPos = topMargin + (chartSize/2);
    for (let i = 0; i < milestones.length; i++) {
        let milestone  = milestones[i];
        var text = draw.plain(`${milestone.c} - ${milestone.n}`);
        text.attr({ x: legendMargin, y: yPos });
        text.font({ family: 'Helvetica', size: 14 });
        yPos += 20;
    }
}