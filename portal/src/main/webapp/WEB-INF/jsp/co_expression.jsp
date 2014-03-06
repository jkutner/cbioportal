<script type="text/javascript" src="js/src/coExpression.js"></script>
<script type="text/javascript" src="js/src/plots-view/PlotsBoilerplate.js"></script>
<script type="text/javascript" src="js/src/plots-view/data/CoexpPlotsProxy.js"></script>
<script type="text/javascript" src="js/src/plots-view/view/CoexpPlotsView.js"></script>
<script type="text/javascript" src="js/src/plots-view/CoexpPlots.js"></script>
<script type="text/javascript" src="js/src/plots-view/component/ScatterPlots.js"></script>
<script type="text/javascript" src="js/src/plots-view/component/PlotsHeader.js"></script>

<style>
    #coexp .coexp-table-filter-custom {
        width: 100%;
        float: left;
    }
    #coexp .datatables_filter {
        width: 300px;
        float: left;
        margin-left: 0px;
        text-align: left;
        font-size: 11px;
        padding-left: 6px;
    }

    #coexp .dataTables_info {
        float: left;
        width: auto;
    }
    #coexp .coexp-tabs-ref {
        font-size: 11px !important;
    }
    #coexp .coexp-table {
        width: 100%;
    }
    #coexp .coexp-plots {
        float: left;
    }
    #coexp p {
        font-size: 12px;
        display: block;
        text-align: left;
        font-family: Verdana,Arial,sans-serif;
        margin-bottom: 12px;
    }
    .ui-state-disabled {
        display: none;
    }  

</style>

<div class="section" id="coexp">
    <p style='margin-top: -25px;'>
        This table below lists the genes with the highest expression correlation with the query genes. Click on a row to see the corresponding correlation plot. 
        <img class='profile_help' src='images/help.png' title='
            Pearson correlations are computed first.  For genes with an absolute correlation greater than 0.3, the Spearman correlations are also computed. By default, only gene pairs with an absolute value > 0.3 in both measures are shown. Only the top 250 genes are shown.
        '>
    </p>
    <div id="coexp-tabs" class="coexp-tabs">
        <ul id='coexp-tabs-list'></ul>
        <div id='coexp-tabs-content'>
        </div>
    </div>
</div>

<script>
    $(document).ready( function() {
        var coexp_tab_init = false;
        $("#tabs").bind("tabsactivate", function(event, ui) {
            if (ui.newTab.text().trim().toLowerCase() === "co-expression") {
                if (coexp_tab_init === false) {
                    CoExpTable.initTabs();
                    CoExpTable.initView();
                    coexp_tab_init = true;
                } else {
                    $(window).trigger("resize");
                }
            }
        });
    });
</script>