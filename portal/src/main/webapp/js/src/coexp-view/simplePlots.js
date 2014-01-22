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
 * Generate Simple Plots for specific row in co-expression table
 * (when "expand" button's clicked)
 *
 * Author: Yichao
 * Date: Dec, 2013
 *
 * @param: DivName
 */

var SimplePlot = (function() {
    var canvas = {
            width: 580,
            height: 580,
            xLeft: 60,   //The left/starting point for x axis
            xRight: 560,   //The right/ending point for x axis
            yTop: 20,  //The top/ending point for y axis
            yBottom: 520  //The bottom/starting point for y axis
        },
        elem = {
            svg: "",
            xScale: "",
            yScale: "",
            xAxis: "",
            yAxis: "",
            dotsGroup: ""
        },
        singleDot = {
            x_val: "",
            y_val: "",
            case_id: ""
        },
        dotsArr = [],
        style = {
            dots_fill_color: "#58ACFA",
            dots_stroke_color: "#0174DF"
        },
        names = {
            header: "",
            plots: ""
        };
    var util = (function() {
        return {
            analyseData: function(inputArr) {
                var min = Math.min.apply(Math, inputArr);
                var max = Math.max.apply(Math, inputArr);
                var edge = (max - min) * 0.1;
                min -= edge;
                max += edge;
                return {
                    min: min,
                    max: max
                };
            }
        }
    }());

    function initScales() {
        var _yValArr = [];
        var _xValArr = [];
        $.each(dotsArr, function(index, val){
            _xValArr.push(val.x_val);
            _yValArr.push(val.y_val);
        });
        var _results_x = util.analyseData(_xValArr);
        var _results_y = util.analyseData(_yValArr);
        elem.xScale = d3.scale.linear()
            .domain([_results_x.min, _results_x.max])
            .range([canvas.xLeft, canvas.xRight]);

        elem.yScale = d3.scale.linear()
            .domain([_results_y.min, _results_y.max])
            .range([canvas.yBottom, canvas.yTop]);
    }

    function initAxis() {
        elem.xAxis = d3.svg.axis()
            .scale(elem.xScale)
            .orient("bottom");

        elem.yAxis = d3.svg.axis()
            .scale(elem.yScale)
            .orient("left");
    }

    function initCanvas(divName) {
        names.header = divName + "_header";
        names.plots = divName + "_plots";
        $("#" + divName + "_plot_loading_img").hide();
        $("#" + divName).append("<div id='" + names.header + "' style='padding-left: 100px; padding-top: 30px;'></div>");
        $("#" + divName).append("<div id='" + names.plots + "'></div>")
        elem.svg = d3.select("#" + names.plots).append("svg")
            .attr("width", canvas.width)
            .attr("height", canvas.height);
    }

    function drawAxis(gene1, gene2) {
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
        //Append Axis Titles
        var axisTitleGroup = elem.svg.append("svg:g");
        axisTitleGroup.append("text")
            .attr("x", canvas.xLeft + (canvas.xRight - canvas.xLeft) / 2)
            .attr("y", canvas.yBottom + 40)
            .style("text-anchor", "middle")
            .style("font-size", "13px")
            .text(gene1);
        axisTitleGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", (canvas.xLeft - canvas.xRight) / 2 - canvas.yTop)
            .attr("y", canvas.yTop)
            .style("text-anchor", "middle")
            .style("font-size", "13px")
            .text(gene2);
    }

    function getAlterationData(divName, gene1, gene2) {
        var paramsGetAlterationData = {
            cancer_study_id: window.PortalGlobals.getCancerStudyId(),
            gene_list: gene1 + " " + gene2,
            case_set_id: window.PortalGlobals.getCaseSetId(),
            case_ids_key: window.PortalGlobals.getCaseIdsKey()
        };
        $.post("getAlterationData.json", paramsGetAlterationData, getAlterationDataCallBack(divName, gene1, gene2), "json");
    }

    function convertData(result, gene1, gene2) {
        var geneXArr = result[gene1];
        var geneYArr = result[gene2];
        $.each(geneXArr, function(index) {
            var _singleDot = jQuery.extend(true, {}, singleDot);
            var _obj_x = geneXArr[index];
            var _obj_y = geneYArr[index];
            _singleDot.x_val = _obj_x["value"];
            _singleDot.y_val = _obj_y["value"];
            _singleDot.case_id = _obj_x["caseId"];
            dotsArr.push(_singleDot);
        });
    }

    function drawPlots() {
        elem.dotsGroup = elem.svg.append("svg:g");
        elem.dotsGroup.selectAll("path").remove();
        elem.dotsGroup.selectAll("path")
            .data(dotsArr)
            .enter()
            .append("svg:path")
            .attr("transform", function(d){
                return "translate(" + elem.xScale(d.x_val) + ", " + elem.yScale(d.y_val) + ")";
            })
            .attr("d", d3.svg.symbol()
                .size(20)
                .type("circle"))
            .attr("fill", style.dots_fill_color)
            .attr("stroke", style.dots_stroke_color)
            .attr("stroke-width", "1.2");
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

                var mouseOn = function() {
                    var dot = d3.select(this);
                    dot.transition()
                        .ease("elastic")
                        .duration(600)
                        .delay(100)
                        .attr("d", d3.svg.symbol().size(200).type("circle"));
                };

                var mouseOff = function() {
                    var dot = d3.select(this);
                    dot.transition()
                        .ease("elastic")//TODO: default d3 symbol is circle (coincidence!)
                        .duration(600)
                        .delay(100)
                        .attr("d", d3.svg.symbol().size(20).type("circle"));
                };
                elem.dotsGroup.selectAll("path").on("mouseover", mouseOn);
                elem.dotsGroup.selectAll("path").on("mouseout", mouseOff);
            }
        );
    }

    function appendHeader(gene1, gene2) {
        $("#" + names.header).append("<b>mRNA Expression: " + gene1 + " vs. " + gene2 + "</b>");
        var pdfConverterForm =
            "<form style='display:inline-block' action='svgtopdf.do' method='post' " +
                "onsubmit=\"this.elements['svgelement'].value=SimplePlot.loadCoexpPlotsSVG();\">" +
                "<input type='hidden' name='svgelement'>" +
                "<input type='hidden' name='filetype' value='pdf'>" +
                "<input type='hidden' name='filename' value='coexpression_plots-" + gene1 + "_" + gene2 + ".pdf'>" +
                "<input type='submit' value='PDF'></form>";
        $("#" + names.header).append(pdfConverterForm);
        var svgConverterForm =
            "<form style='display:inline-block' action='svgtopdf.do' method='post' " +
                "onsubmit=\"this.elements['svgelement'].value=SimplePlot.loadCoexpPlotsSVG();\">" +
                "<input type='hidden' name='svgelement'>" +
                "<input type='hidden' name='filetype' value='svg'>" +
                "<input type='hidden' name='filename' value='coexpression_plots-" + gene1 + "_" + gene2 + ".svg'>" +
                "<input type='submit' value='SVG'></form>";
        $("#" + names.header).append(svgConverterForm);
    }

    function loadCoexpPlotsSVG() {
        return $("#" + names.plots).html();
    }

    function getAlterationDataCallBack(divName, gene1, gene2) {
        return function(result) {
            convertData(result, gene1, gene2);
            initCanvas(divName);
            appendHeader(gene1, gene2);
            initScales();
            initAxis();
            drawAxis(gene1, gene2);
            drawPlots();
            addQtips();
        }
    }

    return {
        init: function(divName, gene1, gene2) {
            $("#" + divName).append(
                "<img id='" + divName + "_plot_loading_img' style='padding:220px;' src='images/ajax-loader.gif'>");
            getAlterationData(divName, gene1, gene2);
        },
        loadCoexpPlotsSVG: loadCoexpPlotsSVG
    }

}());


