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

 /*
  * Generate the control menu on the left side for the plots tab
  *
  * Jun 2014
  * @Author: Yichao S/ Eduardo Velasco
  *
  * @Input:
  * @Ouput: 
  */ 
var PlotsMenu = (function () {
    var tabType = {
            ONE_GENE: "one_gene",
            TWO_GENES: "two_genes",
            CUSTOM: "custom"
        },
        oneGene = {
            plot_type : {
                MRNA_COPY_NO : {
                    value : "mrna_vs_copy_no",
                    text : "mRNA vs. Copy Number"
                },
                MRNA_METHYLATION : {
                    value : "mrna_vs_dna_methylation",
                    text : "mRNA vs. DNA Methylation"
                },
                RPPA_MRNA : {
                    value : "rppa_vs_mrna",
                    text : "RPPA Protein Level vs. mRNA"
                }
            },
            data_type : {
                MRNA : {
                    label: "- mRNA -",
                    id: "one_gene_data_type_mrna",
                    value: "mrna",
                    genetic_profile : []
                },
                COPY_NO : {
                    label: "- Copy Number -",
                    id: "one_gene_data_type_copy_no",
                    value: "copy_no",
                    genetic_profile : []
                },
                METHYLATION : {
                    label: "- DNA Methylation -",
                    id: "one_gene_data_type_dna_methylation",
                    value: "dna_methylation",
                    genetic_profile : []
                },
                RPPA : {
                    label: "- RPPA Protein Level -",
                    id: "one_gene_data_type_rppa",
                    value: "rppa",
                    genetic_profile : []
                }                
            },
            status : {
                has_mrna : false,
                has_dna_methylation : false,
                has_rppa : false,
                has_copy_no : false
            }
        },
        twoGenes = {
            plot_type : {
                MRNA : { 
                    value : "mrna", 
                    name :  "mRNA Expression" 
                },
                COPY_NO : { 
                    value : "copy_no", 
                    name :  "Copy Number Alteration" 
                },
                METHYLATION : { 
                    value : "dna_methylation", 
                    name :  "DNA Methylation" 
                },
                RPPA : { 
                    value : "rppa", 
                    name :  "RPPA Protein Level" 
                }                
            },
            data_type : {  //Only contain genetic profiles that has data available for both genes
                // "mutations" : {
                //     genetic_profile : []
                // },
                MRNA : {
                    id: "two_genes_data_type_mrna",
                    genetic_profile : []
                },
                COPY_NO : {
                    id: "two_genes_data_type_copy_no",
                    genetic_profile : []
                },
                METHYLATION : {
                    id: "two_genes_data_type_dna_methylation",
                    genetic_profile : []
                },
                RPPA : {
                    id: "two_genes_data_type_rppa",
                    genetic_profile : []
                }                  
            }
        };

    function fetchContent(plotsType, selectedGenes) { 
        if (plotsType === tabType.ONE_GENE) {
            var selectedGene = selectedGenes.geneX;
            oneGene.data_type.MRNA.genetic_profile = Plots.getGeneticProfiles(selectedGene).genetic_profile_mrna;
            oneGene.data_type.COPY_NO.genetic_profile = Plots.getGeneticProfiles(selectedGene).genetic_profile_copy_no;
            oneGene.data_type.METHYLATION.genetic_profile = Plots.getGeneticProfiles(selectedGene).genetic_profile_dna_methylation;
            oneGene.data_type.RPPA.genetic_profile = Plots.getGeneticProfiles(selectedGene).genetic_profile_rppa;
            oneGene.status.has_mrna = (oneGene.data_type.MRNA.genetic_profile.length !== 0);
            oneGene.status.has_copy_no = (oneGene.data_type.COPY_NO.genetic_profile.length !== 0);
            oneGene.status.has_dna_methylation = (oneGene.data_type.METHYLATION.genetic_profile.length !== 0);
            oneGene.status.has_rppa = (oneGene.data_type.RPPA.genetic_profile.length !== 0);
        } else if (plotsType === tabType.TWO_GENES) {
            var geneX = selectedGenes.geneX, 
                geneY = selectedGenes.geneY;
            //content.genetic_profile_mutations = Plots.getGeneticProfiles(geneX).genetic_profile_mutations;
            twoGenes.data_type.MRNA = ControlPanelUtil.mergeList(
                Plots.getGeneticProfiles(geneX).genetic_profile_mrna,
                Plots.getGeneticProfiles(geneY).genetic_profile_mrna
            );
            twoGenes.data_type.COPY_NO = ControlPanelUtil.mergeList(
                Plots.getGeneticProfiles(geneX).genetic_profile_copy_no,
                Plots.getGeneticProfiles(geneY).genetic_profile_copy_no
            );
            twoGenes.data_type.METHYLATION = ControlPanelUtil.mergeList(
                Plots.getGeneticProfiles(geneX).genetic_profile_dna_methylation,
                Plots.getGeneticProfiles(geneY).genetic_profile_dna_methylation
            );
            twoGenes.data_type.RPPA = ControlPanelUtil.mergeList(
                Plots.getGeneticProfiles(geneX).genetic_profile_rppa,
                Plots.getGeneticProfiles(geneY).genetic_profile_rppa
            );
        } else {
            ///TODO: custom 
        }
    }

    function drawOneGeneGeneList() {
        ControlPanelUtil.generateGeneList("one_gene_gene_list", gene_list);
    }

    function drawOneGenePlotType() {
        //$("#one_gene").children("#type_div").show();
        //$("#one_gene").children("#type").empty();
        //$("#one_gene").children("#plot_type_div").empty();
        //$("#one_gene").children("#data_type_div").empty();
        if (oneGene.status.has_mrna && oneGene.status.has_copy_no) {
            ControlPanelUtil.appendDropDown(
                '#one_gene_plot_type',
                oneGene.plot_type.MRNA_COPY_NO.value,
                oneGene.plot_type.MRNA_COPY_NO.text
            );
        }
        if (oneGene.status.has_mrna && oneGene.status.has_dna_methylation) {
            ControlPanelUtil.appendDropDown(
                '#one_gene_plot_type',
                oneGene.plot_type.MRNA_METHYLATION.value,
                oneGene.plot_type.MRNA_METHYLATION.text
            );
        }
        if (oneGene.status.has_mrna && oneGene.status.has_rppa) {
            ControlPanelUtil.appendDropDown(
                '#one_gene_plot_type',
                oneGene.plot_type.RPPA_MRNA.value,
                oneGene.plot_type.RPPA_MRNA.text
            );
        }
    }

    function drawOneGeneDataType() { //Drop down menu for genetic profiles
        for (var key in oneGene.data_type) {
            var _singleDataTypeObj = oneGene.data_type[key];
            $("#one_gene_data_type").append(
                "<div id='" + _singleDataTypeObj.value + "_dropdown' style='padding:5px;'>" +
                    "<label for='" + _singleDataTypeObj.id + "'>" + _singleDataTypeObj.label + "</label><br>" +
                    "<select id='" + _singleDataTypeObj.id + "' value='" + _singleDataTypeObj.value + "' onchange='PlotsView.init();PlotsMenu.updateLogScaleOption();' class='plots-select'></select></div>"
            );
            for (var index in _singleDataTypeObj.genetic_profile) { //genetic_profile is ARRAY!
                var item_profile = _singleDataTypeObj.genetic_profile[index];
                $("#" + _singleDataTypeObj.id).append(
                    "<option value='" + item_profile[0] + "|" + item_profile[2] + "'>" + item_profile[1] + "</option>");
            }
        }        
    }

    function drawTwoGenesGeneList() {
        ControlPanelUtil.generateGeneList("two_genes_gene_list_x", gene_list);
        var tmp_gene_list = jQuery.extend(true, [], gene_list);
        var tmp_gene_holder = tmp_gene_list.pop(); //Move the last gene on the list to the first
        tmp_gene_list.unshift(tmp_gene_holder);
        ControlPanelUtil.generateGeneList("two_genes_gene_list_y", tmp_gene_list);
    }

    function drawTwoGenesPlotType() {
        //$("#two_genes_plot_type").empty();
        ControlPanelUtil.appendDropDown("#two_genes_plot_type", twoGenes.plot_type.MRNA.value, twoGenes.plot_type.MRNA.name);
        if (twoGenes.data_type.COPY_NO.length !== 0) {
            var _flag = false;
            $.each(twoGenes.data_type.COPY_NO, function(index, val) {
                if (!ControlPanelUtil.dataIsDiscretized(val[1])) {
                    _flag = true;
                }
            });     //If contains continuous data type
            if (_flag) {
                ControlPanelUtil.appendDropDown("#two_genes_plot_type", twoGenes.plot_type.COPY_NO.value, twoGenes.plot_type.COPY_NO.name);
            }
        }
        if (twoGenes.data_type.METHYLATION.length !== 0) {
           ControlPanelUtil.appendDropDown("#two_genes_plot_type", twoGenes.plot_type.METHYLATION.value, twoGenes.plot_type.METHYLATION.name);
        }
        if (twoGenes.data_type.RPPA.length !== 0) {
           ControlPanelUtil.appendDropDown("#two_genes_plot_type", twoGenes.plot_type.RPPA.value, twoGenes.plot_type.RPPA.name);
        }
    }

    function drawTwoGenesDataType() { //Drop down menu for genetic profiles
        //$("#two_genes_data_type_div").empty();
        $("#two_genes_data_type_div").append(
            "<select id='two_genes_data_type' onchange='PlotsTwoGenesView.init();PlotsTwoGenesMenu.updateLogScaleCheckBox();' class='plots-select'>");

        if ($("#two_genes_plot_type").val() === values.MRNA) {
            twoGenes.data_type.MRNA.forEach (function (profile) {
                $("#two_genes_data_type")
                    .append("<option value='" + profile[0] + "|" + profile[2] + "'>" + profile[1] + "</option>");
            });
            //setPlatFormDefaultSelection();
        } else if ($("#two_genes_plot_type").val() === values.COPY_NO) {
            twoGenes.data_type.COPY_NO.forEach (function (profile) {
                if (!dataIsDiscretized(profile[1])) {
                    $("#two_genes_data_type")
                        .append("<option value='" + profile[0] + "|" + profile[2] + "'>" + profile[1] + "</option>");
                }
            });
        } else if ($("#two_genes_plot_type").val() === values.METHYLATION) {
            twoGenes.data_type.METHYLATION.forEach (function (profile) {
                $("#two_genes_data_type")
                    .append("<option value='" + profile[0] + "|" + profile[2] + "'>" + profile[1] + "</option>");
            });
        } else if ($("#two_genes_plot_type").val() === values.RPPA) {
            twoGenes.data_type.RPPA.forEach (function (profile) {
                $("#two_genes_data_type")
                    .append("<option value='" + profile[0] + "|" + profile[2] + "'>" + profile[1] + "</option>");
            });
        }
        $("#two_genes_data_type_div").append("</select>");              
    }

    function setOneGeneDefaultSel() {
        //-----Copy No Priority List: discretized(gistic, rae), continuous
        $('#one_gene_data_type #copy_no > option').each(function() {
            if (this.text.toLowerCase().indexOf("(rae)") !== -1) {
                $(this).prop('selected', true);
                return false;
            }
        });
        $("#data_type_copy_no > option").each(function() {
            if (this.text.toLowerCase().indexOf("gistic") !== -1) {
                $(this).prop('selected', true);
                return false;
            }
        });
        var userSelectedCopyNoProfile = "";
        $.each(geneticProfiles.split(/\s+/), function(index, value){
            if (value.indexOf("cna") !== -1 || value.indexOf("log2") !== -1 ||
                value.indexOf("CNA")!== -1 || value.indexOf("gistic") !== -1) {
                userSelectedCopyNoProfile = value;
                return false;
            }
        });
        $("#data_type_copy_no > option").each(function() {
            if (this.value === userSelectedCopyNoProfile){
                $(this).prop('selected', true);
                return false;
            }
        });
        //----mRNA Priority List: User selection, RNA Seq V2, RNA Seq, Z-scores
        var userSelectedMrnaProfile = "";  //Get user selection from main query
        $.each(geneticProfiles.split(/\s+/), function(index, value){
            if (value.indexOf("mrna") !== -1) {
                userSelectedMrnaProfile = value;
                return false;
            }
        });
        $("#data_type_mrna > option").each(function() {
            if (this.text.toLowerCase().indexOf("z-scores") !== -1){
                $(this).prop('selected', true);
                return false;
            }
        });
        $("#data_type_mrna > option").each(function() {
            if (this.text.toLowerCase().indexOf("rna seq") !== -1 &&
                this.text.toLowerCase().indexOf("z-scores") === -1){
                $(this).prop('selected', true);
                return false;
            }
        });
        $("#data_type_mrna > option").each(function() {
            if (this.text.toLowerCase().indexOf("rna seq v2") !== -1 &&
                this.text.toLowerCase().indexOf("z-scores") === -1){
                $(this).prop('selected', true);
                return false;
            }
        });
        $("#data_type_mrna > option").each(function() {
            if (this.value === userSelectedMrnaProfile){
                $(this).prop('selected', true);
                return false;
            }
        });
        //----DNA Methylation Priority List: hm450, others
        $('#data_type_dna_methylation > option').each(function() {
            if (this.text.toLowerCase().indexOf("hm450") !== -1) {
                $(this).prop('selected', true);
                return false;
            }
        });        
    }

    function setTwoGenesDefaultSel() {
        //----mRNA Priority List: RNA Seq V2, RNA Seq, Z-scores
        if ($("#two_genes_plot_type").val() === values.MRNA) {
            $("#two_genes_data_type > option").each(function() {
                if (this.text.toLowerCase().indexOf("z-scores")){
                    $(this).prop('selected', true);
                    return false;
                }
            });
            $("#two_genes_data_type > option").each(function() {
                if (this.text.toLowerCase().indexOf("rna seq") !== -1 &&
                    this.text.toLowerCase().indexOf("z-scores") === -1){
                    $(this).prop('selected', true);
                    return false;
                }
            });
            $("#two_genes_data_type > option").each(function() {
                if (this.text.toLowerCase().indexOf("rna seq v2") !== -1 &&
                    this.text.toLowerCase().indexOf("z-scores") === -1){
                    $(this).prop('selected', true);
                    return false;
                }
            });
        }
        //----DNA methylation priority list: hm450, hm27
        if ($("#two_genes_plot_type").val() === values.METHYLATION) {
            $('#two_genes_data_type > option').each(function() {
                if (this.text.toLowerCase().indexOf("hm450") !== -1) {
                    $(this).prop('selected', true);
                    return false;
                }
            });
        }
    }

    function drawErrMsgs() {
        $("#one_gene_type_specification").hide();
        $("#menu_err_msg").append("<h5>Profile data missing for generating this view.</h5>");
    }

    function setDefaultMrnaSelection() {
        var userSelectedMrnaProfile = "";  //from main query
        //geneticProfiles --> global variable, passing user selected profile IDs
        $.each(geneticProfiles.split(/\s+/), function(index, value){
            if (value.indexOf("mrna") !== -1) {
                userSelectedMrnaProfile = value;
                return false;
            }
        });

        //----Priority List: User selection, RNA Seq V2, RNA Seq, Z-scores
        $("#data_type_mrna > option").each(function() {
            if (this.text.toLowerCase().indexOf("z-scores") !== -1){
                $(this).prop('selected', true);
                return false;
            }
        });
        $("#data_type_mrna > option").each(function() {
            if (this.text.toLowerCase().indexOf("rna seq") !== -1 &&
                this.text.toLowerCase().indexOf("z-scores") === -1){
                $(this).prop('selected', true);
                return false;
            }
        });
        $("#data_type_mrna > option").each(function() {
            if (this.text.toLowerCase().indexOf("rna seq v2") !== -1 &&
                this.text.toLowerCase().indexOf("z-scores") === -1){
                $(this).prop('selected', true);
                return false;
            }
        });
        $("#data_type_mrna > option").each(function() {
            if (this.value === userSelectedMrnaProfile){
                $(this).prop('selected', true);
                return false;
            }
        });
    }

    function setDefaultMethylationSelection() {
        $('#data_type_dna_methylation > option').each(function() {
            if (this.text.toLowerCase().indexOf("hm450") !== -1) {
                $(this).prop('selected', true);
                return false;
            }
        });
    }

    function updateVisibility() {
        $("#one_gene_log_scale_x_div").remove();
        $("#one_gene_log_scale_y_div").remove();
        var currentPlotsType = $('#plots_type').val();
        if (currentPlotsType.indexOf("copy_no") !== -1) {
            Util.toggleVisibilityX("data_type_copy_no_dropdown");
            Util.toggleVisibilityY("data_type_mrna_dropdown");
            Util.toggleVisibilityHide("data_type_dna_methylation_dropdown");
            Util.toggleVisibilityHide("data_type_rppa_dropdown");
        } else if (currentPlotsType.indexOf("dna_methylation") !== -1) {
            Util.toggleVisibilityX("data_type_dna_methylation_dropdown");
            Util.toggleVisibilityY("data_type_mrna_dropdown");
            Util.toggleVisibilityHide("data_type_copy_no_dropdown");
            Util.toggleVisibilityHide("data_type_rppa_dropdown");
        } else if (currentPlotsType.indexOf("rppa") !== -1) {
            Util.toggleVisibilityX("data_type_mrna_dropdown");
            Util.toggleVisibilityY("data_type_rppa_dropdown");
            Util.toggleVisibilityHide("data_type_copy_no_dropdown");
            Util.toggleVisibilityHide("data_type_dna_methylation_dropdown");
        }
        updateLogScaleOption();
    }

    function updateLogScaleOption() {
        $("#one_gene_log_scale_x_div").empty();
        $("#one_gene_log_scale_y_div").empty();
        var _str_x = "<input type='checkbox' id='log_scale_option_x' checked onchange='PlotsView.applyLogScaleX();'/> log scale";
        var _str_y = "<input type='checkbox' id='log_scale_option_y' checked onchange='PlotsView.applyLogScaleY();'/> log scale";
        if ($("#plots_type").val() === content.one_gene_tab_plots_type.mrna_copyNo.value) {
            if ($("#data_type_mrna option:selected").val().toUpperCase().indexOf(("rna_seq").toUpperCase()) !== -1 &&
                $("#data_type_mrna option:selected").val().toUpperCase().indexOf(("zscores").toUpperCase()) === -1) {
                $("#one_gene_log_scale_y_div").append(_str_y);
            }
        } else if ($("#plots_type").val() === content.one_gene_tab_plots_type.mrna_methylation.value) {
            if ($("#data_type_mrna option:selected").val().toUpperCase().indexOf(("rna_seq").toUpperCase()) !== -1 &&
                $("#data_type_mrna option:selected").val().toUpperCase().indexOf(("zscores").toUpperCase()) === -1) {
                $("#one_gene_log_scale_y_div").append(_str_y);
            }
        } else if ($("#plots_type").val() === content.one_gene_tab_plots_type.rppa_mrna.value) {
            if ($("#data_type_mrna option:selected").val().toUpperCase().indexOf(("rna_seq").toUpperCase()) !== -1 &&
                $("#data_type_mrna option:selected").val().toUpperCase().indexOf(("zscores").toUpperCase()) === -1) {
                $("#one_gene_log_scale_x_div").append(_str_x);
            }
        }
    }

    return {
        init: function () {
            $("#menu_err_msg").empty();

            //Fetch the content for the control panel from the result of the AJAX call
            fetchContent(
                tabType.ONE_GENE, 
                {   
                    geneX: gene_list[0], 
                    geneY: gene_list[0]
                }
            );
            fetchContent(
                tabType.TWO_GENES, 
                {   
                    geneX: gene_list[0], 
                    geneY: gene_list[1] //TODO: DOM doesn't work
                }
            );
            
            //------ Render Drop down Menus
            //-------------- One Gene
            drawOneGeneGeneList();
            drawOneGenePlotType();
            drawOneGeneDataType();
            setOneGeneDefaultSel();
            //-------------- Two Genes
            drawTwoGenesGeneList();
            drawTwoGenesPlotType();
            drawTwoGenesDataType(); 
            setTwoGenesDefaultSel

            // if (oneGene.status.has_mrna && 
            //    (oneGene.status.has_copy_no || 
            //     oneGene.status.has_dna_methylation || 
            //     oneGene.status.has_rppa)) {
            //         drawMenu();
            //         setDefaultMrnaSelection();
            //         setDefaultCopyNoSelection();
            //         setDefaultMethylationSelection();
            //         updateVisibility();
            // } else {
            //     drawErrMsgs();
            // }
        },
        updateMenu: function() {
            $("#menu_err_msg").empty();
            fetchFrameContent(document.getElementById("gene").value);
            if(status.has_mrna && (status.has_copy_no || status.has_dna_methylation || status.has_rppa)) {
                drawMenu();
                setDefaultMrnaSelection();
                setDefaultCopyNoSelection();
                setDefaultMethylationSelection();
                updateVisibility();
            } else {
                drawErrMsgs();
            }
        },
        updateDataType: function() {
            setDefaultMrnaSelection();
            setDefaultCopyNoSelection();
            setDefaultMethylationSelection();
            updateVisibility();
        },
        updateLogScaleOption: updateLogScaleOption,
        getStatus: function() {
            return status;
        }
    };
}()); //Closing PlotsMenu