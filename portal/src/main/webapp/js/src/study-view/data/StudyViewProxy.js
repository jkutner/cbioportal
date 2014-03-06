/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var StudyViewProxy = (function() {
    
    var parObject = {
        studyId: "",
        caseIds: "",
        cnaProfileId: "",
        mutationProfileId: "",
        caseSetId: ""
    };
    var usefulData = {};
    var dataObject = {}; 
    var caseIdStr = '';
    var webserviceData = {};
    var clinicalAttributesData = {};
    var mutationsData = {};
    var cnaData = {};
    var obtainDataObject = [];
    obtainDataObject['attr'] = [];
    obtainDataObject['dataObjectM'] = [];
    
    function initLocalParameters(o){
        parObject.studyId = o.studyId;
        parObject.caseIds = o.caseIds;
        parObject.cnaProfileId = o.cnaProfileId;
        parObject.mutationProfileId = o.mutationProfileId;        
        parObject.caseSetId = o.caseSetId;
        caseIdStr = parObject.caseIds.join(' ');
    }
    
    function initAjaxParameters(){
        webserviceData = {
            cmd: "getClinicalData",
            format: "json",
            cancer_study_id: parObject.studyId,
            case_set_id: parObject.caseSetId
        };
        clinicalAttributesData = {
            cancer_study_id: parObject.studyId,
            case_list: caseIdStr
        };
        mutationsData = {
            cmd: "count_mutations",
            cases_ids: caseIdStr,
            mutation_profile: parObject.mutationProfileId
        };
        cnaData = {
            cmd: "get_cna_fraction",
            case_ids: caseIdStr,
            cancer_study_id: parObject.studyId
        };   
    }
    
    function getDataFunc(callbackFunc){
         $.when(  
                $.ajax({type: "POST", url: "webservice.do", data: webserviceData}), 
                $.ajax({type: "POST", url: "mutations.json", data: mutationsData}),
                $.ajax({type: "POST", url: "cna.json", data: cnaData}))

            .done(function(a1, a2, a3){
                usefulData = a1[0]['data'];

                for(var i=0; i < usefulData.length;i++){
                    if(usefulData[i]["sample"] in dataObject){
                        dataObject[usefulData[i]["sample"]][usefulData[i]["attr_id"]] = usefulData[i]["attr_val"];
                    }
                    else{
                        dataObject[usefulData[i]["sample"]] = [];
                        dataObject[usefulData[i]["sample"]][usefulData[i]["attr_id"]] = usefulData[i]["attr_val"];
                    }
                }

                var dataAttrA1 = a1[0]['attributes'];
                
                var keyNumMapping = [];
                
                for(var j = 0; j< parObject.caseIds.length ; j++){
                    var tmpArray = {};
                    tmpArray["CASE_ID"] = parObject.caseIds[j];
                    tmpArray["MUTATION_COUNT"] = "NA";
                    tmpArray["COPY_NUMBER_ALTERATIONS"] = "NA";
                    keyNumMapping[parObject.caseIds[j]] = j;
                    $.each(dataAttrA1,function(key,value){
                        tmpArray[value['attr_id']] = "NA";
                    });
                    obtainDataObject['dataObjectM'].push(tmpArray);
                }
                
                for(var key in dataObject){
                    for (var i = 0 ; i < dataAttrA1.length ; i++){
                        var tmpValue = dataObject[key][dataAttrA1[i]['attr_id']];
                        if(tmpValue === '' || tmpValue === undefined || tmpValue === 'na' || tmpValue === 'NA'){
                            tmpValue = 'NA';
                            obtainDataObject['dataObjectM'][keyNumMapping[key]][dataAttrA1[i]['attr_id']] = tmpValue;
                        }else
                            obtainDataObject['dataObjectM'][keyNumMapping[key]][dataAttrA1[i]['attr_id']] = dataObject[key][dataAttrA1[i]['attr_id']];
                    }
                       
                }
                
                obtainDataObject['attr'] = a1[0]['attributes'];
                
                var filteredA2 = removeExtraData(parObject.caseIds,a2[0]);
                var filteredA3 = removeExtraData(parObject.caseIds,a3[0]);
                if(Object.keys(filteredA2).length !== 0){
                    var newAttri1 = {};
                    newAttri1.attr_id = 'MUTATION_COUNT';
                    newAttri1.display_name = 'Mutation Count';
                    newAttri1.description = 'Mutation Count';
                    newAttri1.datatype = 'NUMBER';                        

                    jQuery.each(filteredA2, function(i,val){
                        if(val === undefined)
                            val = 'NA';
                        obtainDataObject['dataObjectM'][keyNumMapping[i]]['MUTATION_COUNT'] = val;
                    });    
                    obtainDataObject['attr'].push(newAttri1);
                }
                if(Object.keys(filteredA3).length !== 0){
                    var newAttri2 = {};
                    newAttri2.attr_id = 'COPY_NUMBER_ALTERATIONS';
                    newAttri2.display_name = 'Copy Number Alterations';
                    newAttri2.description = 'Copy Number Alterations';
                    newAttri2.datatype = 'NUMBER';

                    jQuery.each(filteredA3, function(i,val){
                        if(val === undefined)
                            val = 'NA';
                        obtainDataObject['dataObjectM'][keyNumMapping[i]]['COPY_NUMBER_ALTERATIONS'] = val;
                    }); 
                    obtainDataObject['attr'].push(newAttri2);
                }
                
                var caseidExist = false;
                for(var i=0 ; i<obtainDataObject['attr'].length; i++){
                    if(obtainDataObject['attr'][i].attr_id === 'CASE_ID'){
                        caseidExist = true;
                    }
                }
                if(!caseidExist){
                    var newAttri = {};
                    newAttri.attr_id = 'CASE_ID';
                    newAttri.display_name = 'patient';
                    newAttri.description = 'patient';
                    newAttri.datatype = 'NUMBER';
                    obtainDataObject['attr'].push(newAttri);
                }
                
                callbackFunc(obtainDataObject);
            });
    };
    
    function removeExtraData(_caseId,_data){
        var _newData = {};
        for(var i=0; i< _caseId.length ; i++){
            _newData[_caseId[i]] = _data[_caseId[i]];
        }
        return _newData;
    }
    
    return {
        init: function(o,callbackFunc){
            initLocalParameters(o);
            initAjaxParameters();
            getDataFunc(callbackFunc);
        }
    };
}());