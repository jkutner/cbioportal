<%--
 - Copyright (c) 2015 Memorial Sloan-Kettering Cancer Center.
 -
 - This library is distributed in the hope that it will be useful, but WITHOUT
 - ANY WARRANTY, WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR FITNESS
 - FOR A PARTICULAR PURPOSE. The software and documentation provided hereunder
 - is on an "as is" basis, and Memorial Sloan-Kettering Cancer Center has no
 - obligations to provide maintenance, support, updates, enhancements or
 - modifications. In no event shall Memorial Sloan-Kettering Cancer Center be
 - liable to any party for direct, indirect, special, incidental or
 - consequential damages, including lost profits, arising out of the use of this
 - software and its documentation, even if Memorial Sloan-Kettering Cancer
 - Center has been advised of the possibility of such damage.
 --%>

<%--
 - This file is part of cBioPortal.
 -
 - cBioPortal is free software: you can redistribute it and/or modify
 - it under the terms of the GNU Affero General Public License as
 - published by the Free Software Foundation, either version 3 of the
 - License.
 -
 - This program is distributed in the hope that it will be useful,
 - but WITHOUT ANY WARRANTY; without even the implied warranty of
 - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 - GNU Affero General Public License for more details.
 -
 - You should have received a copy of the GNU Affero General Public License
 - along with this program.  If not, see <http://www.gnu.org/licenses/>.
--%>

<%--
  ~ Copyright (c) 2012 Memorial Sloan-Kettering Cancer Center.
  ~ This library is free software; you can redistribute it and/or modify it
  ~ under the terms of the GNU Lesser General Public License as published
  ~ by the Free Software Foundation; either version 2.1 of the License, or
  ~ any later version.
  ~
  ~ This library is distributed in the hope that it will be useful, but
  ~ WITHOUT ANY WARRANTY, WITHOUT EVEN THE IMPLIED WARRANTY OF
  ~ MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.  The software and
  ~ documentation provided hereunder is on an "as is" basis, and
  ~ Memorial Sloan-Kettering Cancer Center
  ~ has no obligations to provide maintenance, support,
  ~ updates, enhancements or modifications.  In no event shall
  ~ Memorial Sloan-Kettering Cancer Center
  ~ be liable to any party for direct, indirect, special,
  ~ incidental or consequential damages, including lost profits, arising
  ~ out of the use of this software and its documentation, even if
  ~ Memorial Sloan-Kettering Cancer Center
  ~ has been advised of the possibility of such damage.  See
  ~ the GNU Lesser General Public License for more details.
  ~
  ~ You should have received a copy of the GNU Lesser General Public License
  ~ along with this library; if not, write to the Free Software Foundation,
  ~ Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA.
  --%>

<%@ page import="org.mskcc.cbio.portal.dao.DaoTypeOfCancer" %>
<%@ page import="org.mskcc.cbio.portal.model.TypeOfCancer" %>
<%@ page import="org.mskcc.cbio.portal.dao.DaoException" %><%
    String cancerTypeId = cancerStudy.getTypeOfCancerId().trim();
    TypeOfCancer typeOfCancerById = DaoTypeOfCancer.getTypeOfCancerById(cancerTypeId);
    String trialKeywords = typeOfCancerById.getClinicalTrialKeywords();
%>

<style type="text/css">
</style>
<script type="text/javascript" src="js/lib/jquery.highlight-4.js?<%=GlobalProperties.getAppVersion()%>"></script>
<script type="text/javascript">
    // Build the table
    var populateSamplesTable = function() {
        $("#samples_table_wait").hide();
        
        table_text = '<table id="samples-table"></table>';
        var arrayUnique = function(a) {
            return a.reduce(function(p, c) {
                if (p.indexOf(c) < 0) p.push(c);
                return p;
            }, []);
        };
        var all_keys = [];
        all_keys = arrayUnique(($.map(clinicalDataMap, function (o) {return Object.keys(o)})));
        clinicalData = all_keys.map(function(k) {
            clicopy = {};
            clicopy["ATTR"] = k;
            Object.keys(clinicalDataMap).forEach(function(k2) {
               clicopy[k2] =  clinicalDataMap[k2][k] || "N/A";
            });
            return clicopy;
        });
        var samplesDataTable = $("#pv-samples-table").dataTable({
            "sDom": '<"H"<"trials-summary-table-name">fr>t<"F">',
            "bJQueryUI": true,
            "bDestroy": true,
            "aaData": clinicalData,
            "aoColumns": [{"sTitle":"ATTR","mData":"ATTR"}].concat(Object.keys(clinicalDataMap).map(function(k){return {"sTitle":k.replace(/_/g, ' '),"mData":k}})),
            "aaSorting": [[0,'asc']],
            "oLanguage": {
                "sInfo": "&nbsp;&nbsp;(_START_ to _END_ of _TOTAL_)&nbsp;&nbsp;",
                "sInfoFiltered": "",
                "sLengthMenu": "Show _MENU_ per page",
                "sEmptyTable": "Could not find any samples."
            },
            "iDisplayLength": -1
        }); 
        samplesDataTable.css("width","100%");
    };
    
    var samplesTableLoaded = false;
    function loadSamplesTable() {
        if (samplesTableLoaded) return;
        populateSamplesTable();
        samplesTableLoaded = true;
    }
    
    var populatePatientTable = function() {
        $("#patient_table_wait").hide();
        
        clinicalData = [];
        for (var key in patientInfo) {
            clinicalData.push([key, patientInfo[key]]);
        }
        table_text = '<table id="patient-info-table-'+patientId+'"></table>';
        var patientDataTable = $("#pv-patient-table").dataTable({
            "sDom": '<"H"<"trials-summary-table-name">fr>t<"F">',
            "bJQueryUI": true,
            "bDestroy": true,
            "aaData": clinicalData,
            "aoColumnDefs": [
                {
                    "aTargets": [ 0 ],
                    "sClass": "left-align-td",
                    "mRender": function ( data, type, full ) {
                        return '<b>'+data+'</b>';
                    }
                },
                {
                    "aTargets": [ 1 ],
                    "sClass": "left-align-td",
                    "bSortable": false
                }
            ],
            "aaSorting": [[0,'asc']],
            "oLanguage": {
                "sInfo": "&nbsp;&nbsp;(_START_ to _END_ of _TOTAL_)&nbsp;&nbsp;",
                "sInfoFiltered": "",
                "sLengthMenu": "Show _MENU_ per page"
            },
            "iDisplayLength": -1
        });
        patientDataTable.css("width","100%");
    };
    
    var patientTableLoaded = false;
    function loadPatientTable() {
        if (patientTableLoaded) return;
        populatePatientTable();
        patientTableLoaded = true;
    }
    
        $("#link-samples-table").click( function() {
        loadSamplesTable();
        loadPatientTable();
    });
</script>
    
<table id="pv-samples-table">
</table>
<div id="samples_table_wait"><img src="images/ajax-loader.gif"/></div>

<table id="pv-patient-table">
</table>
<div id="patient_table_wait"><img src="images/ajax-loader.gif"/></div>
