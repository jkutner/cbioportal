/*
 * Copyright (c) 2012 Memorial Sloan-Kettering Cancer Center.
 * This library is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as published
 * by the Free Software Foundation; either version 2.1 of the License, or
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY, WITHOUT EVEN THE IMPLIED WARRANTY OF
 * MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.  The software and
 * documentation provided hereunder is on an "as is" basis, and
 * Memorial Sloan-Kettering Cancer Center
 * has no obligations to provide maintenance, support,
 * updates, enhancements or modifications.  In no event shall
 * Memorial Sloan-Kettering Cancer Center
 * be liable to any party for direct, indirect, special,
 * incidental or consequential damages, including lost profits, arising
 * out of the use of this software and its documentation, even if
 * Memorial Sloan-Kettering Cancer Center
 * has been advised of the possibility of such damage.  See
 * the GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this library; if not, write to the Free Software Foundation,
 * Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA.
 */

 /** 
 *
 * Basic Scatter Plots Component. 
 *
 * @param: options -- includes style, canvas(position), elem(svg), text(titles, etc.)
 * @param: dataArr -- Json object from data proxy (x value, y value, qtip content, case id, etc.)
 * @param: dataAttr -- attributes of input data object (max, min, etc.)
 *
 * @output: a simple scatter plot 
 * 
 * @author: Yichao S
 * @date: Jan 2014
 *
 */

var ScatterPlots = (function() {

    var style = {},
        canvas = {},
        elem = {},
        text = {},
        dataArr = [],
        dataAttr = [];

    var axis_edge = 0.1;

    function initSettings(options, _dataAttr) { //Init with options
        style = jQuery.extend(true, {}, options.style);
        canvas = jQuery.extend(true, {}, options.canvas);
        elem = jQuery.extend(true, {}, options.elem);
        text = jQuery.extend(true, {}, options.text)
        dataAttr = jQuery.extend(true, {}, _dataAttr);
    }

    function convertData(_dataArr) {
        dataArr.length = 0;
        //convert json to array
        $.each(_dataArr, function(index, obj) {
            obj.qtip = "new qtip";
            dataArr.push(obj);
        });
    }

    function initSvgCanvas(divName) {
        elem.svg = d3.select("#" + divName).append("svg")
            .attr("width", canvas.width)
            .attr("height", canvas.height);
    }

    function initScales() {
        var _edge_x = (dataAttr.max_x - dataAttr.min_x) * axis_edge;
        var _edge_y = (dataAttr.max_y - dataAttr.min_y) * axis_edge;
        elem.xScale = d3.scale.linear()
            .domain([dataAttr.min_x - _edge_x, dataAttr.max_x + _edge_x])
            .range([canvas.xLeft, canvas.xRight]);
        elem.yScale = d3.scale.linear()
            .domain([dataAttr.min_y - _edge_y, dataAttr.max_y + _edge_y])
            .range([canvas.yBottom, canvas.yTop]);
    }

    function initAxis() {
        elem.xAxis = d3.svg.axis()
            .scale(elem.xScale)
            .orient("bottom")
            .tickSize(6, 0, 0);
        elem.yAxis = d3.svg.axis()
            .scale(elem.yScale)
            .orient("left")
            .tickSize(6, 0, 0);
    }

    function generateAxis() {
        elem.svg.append("g")
            .style("stroke-width", 2)
            .style("fill", "none")
            .style("stroke", "grey")
            .style("shape-rendering", "crispEdges")
            .attr("transform", "translate(0, " + canvas.yBottom + ")")
            .call(elem.xAxis)
            .selectAll("text")
            .style("font-family", "sans-serif")
            .style("font-size", "11px")
            .style("stroke-width", 0.5)
            .style("stroke", "black")
            .style("fill", "black");
        elem.svg.append("g")
            .style("stroke-width", 2)
            .style("fill", "none")
            .style("stroke", "grey")
            .style("shape-rendering", "crispEdges")
            .attr("transform", "translate(0, " + canvas.yTop + ")")
            .call(elem.xAxis.orient("bottom").ticks(0));
        elem.svg.append("g")
            .style("stroke-width", 2)
            .style("fill", "none")
            .style("stroke", "grey")
            .style("shape-rendering", "crispEdges")
            .attr("transform", "translate(" + canvas.xLeft + ", 0)")
            .call(elem.yAxis)
            .selectAll("text")
            .style("font-family", "sans-serif")
            .style("font-size", "11px")
            .style("stroke-width", 0.5)
            .style("stroke", "black")
            .style("fill", "black");
        elem.svg.append("g")
            .style("stroke-width", 2)
            .style("fill", "none")
            .style("stroke", "grey")
            .style("shape-rendering", "crispEdges")
            .attr("transform", "translate(" + canvas.xRight + ", 0)")
            .call(elem.yAxis.orient("left").ticks(0));
    }

    function appendAxisTitles() {
        var axisTitleGroup = elem.svg.append("svg:g");
        axisTitleGroup.append("text")
            .attr("x", canvas.xLeft + (canvas.xRight - canvas.xLeft) / 2)
            .attr("y", canvas.yBottom + 40)
            .style("text-anchor", "middle")
            .style("font-size", "12px")
            .style("font-weight", "bold") 
            .text(text.xTitle);
        axisTitleGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", (canvas.xLeft - canvas.xRight) / 2 - canvas.yTop)
            .attr("y", 50)
            .style("text-anchor", "middle")
            .style("font-size", "12px")
            .style("font-weight", "bold") 
            .text(text.yTitle);
    }

    function drawPlots() {
        elem.dotsGroup = elem.svg.append("svg:g");
        elem.dotsGroup.selectAll("path").remove();
        elem.dotsGroup.selectAll("path")
            .data(dataArr)
            .enter()
            .append("svg:path")
            .attr("transform", function(d){
                return "translate(" + elem.xScale(d.x_val) + ", " + elem.yScale(d.y_val) + ")";
            })
            .attr("d", d3.svg.symbol()
                .size(style.size)
                .type(style.shape))
            .attr("fill", style.fill)
            .attr("stroke", style.stroke)
            .attr("stroke-width", style.stroke_width);
    }

    function addQtips() {
        elem.dotsGroup.selectAll('path').each(
            function(d) {
                var content = "<font size='2'>";
                content += "<strong><a href='tumormap.do?case_id=" + d.case_id +
                           "&cancer_study_id=" + window.PortalGlobals.getCancerStudyId() +
                           "' target = '_blank'>" + d.case_id + "</a></strong><br></font>";

                $(this).qtip(
                    {
                        content: {text: content},
                        style: { classes: 'ui-tooltip-light ui-tooltip-rounded ui-tooltip-shadow ui-tooltip-lightyellow' },
                        show: {event: "mouseover"},
                        hide: {fixed:true, delay: 100, event: "mouseout"},
                        position: {my:'left bottom',at:'top right'}
                    }
                );

            }
        );
        //Hover Animation
        var mouseOn = function() {
            var dot = d3.select(this);
            dot.transition()
                .ease("elastic")
                .duration(600)
                .delay(100)
                .attr("d", d3.svg.symbol().size(style.size * 10).type(style.shape));
        };
        var mouseOff = function() {
            var dot = d3.select(this);
            dot.transition()
                .ease("elastic")
                .duration(600)
                .delay(100)
                .attr("d", d3.svg.symbol().size(style.size).type(style.shape));
        };
        elem.dotsGroup.selectAll("path").on("mouseover", mouseOn);
        elem.dotsGroup.selectAll("path").on("mouseout", mouseOff);
    }

    return {
        init: function(options, _dataArr, _dataAttr) {    //Init with options
            initSettings(options, _dataAttr);
            convertData(_dataArr);
            initSvgCanvas(options.names.body);
            initScales();
            initAxis();
            generateAxis();
            appendAxisTitles();
            drawPlots();
            addQtips();
        },
        update: function() {   //Update with new options
        }
    }

}());

