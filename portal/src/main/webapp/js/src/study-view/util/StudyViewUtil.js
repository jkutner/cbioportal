/* 
 * This class is designed to put all reusable functions.
 */


var StudyViewUtil = (function(){
    function showHideDivision(_listenedDiv, _targetDiv, _parentDiv){
        $(_targetDiv).css('display', 'none');
        $(_listenedDiv).hover(function(){
            if(typeof _parentDiv !== "undefined"){
                changePosition(_listenedDiv, _targetDiv, _parentDiv);
            }
            
            $(_targetDiv).stop().fadeIn('slow', function(){
                $(this).css('display', 'block');
            });
        }, function(){
            $(_targetDiv).stop().fadeOut('slow', function(){
                $(this).css('display', 'none');
            });
        });
    }
    
    function changePosition(_listenedDiv, _targetDiv, _parentDiv) {
        var _parentOffset = $(_parentDiv).offset(),
            _parentWidth = $(_parentDiv).width(),
            _targetWidth = $(_targetDiv).width(),
            _listenedOffset = $(_listenedDiv).offset(),
            _listenedWidth = $(_listenedDiv).width();

        if(_listenedWidth +_targetWidth+ _listenedOffset.left - _parentOffset.left > _parentWidth){
            $(_targetDiv).css({
                'left': -_targetWidth-3+'px',
                'border-left-width': '1px',
                'border-right-width': '0',
                'padding': '2px 0 4px 2px'
            });

            $(_targetDiv).children().css({
                'float': 'right',
                'display': 'block',
                'clear': 'right'
            });
        }else{
            $(_targetDiv).css({
                'left': _listenedWidth+'px',
                'border-left-width': '0',
                'border-right-width': '1px',
                'padding': '2px 2px 4px 0'
            });

            $(_targetDiv).children().css({
                'float': 'left',
                'display': 'block',
                'clear': 'left'
            });
        }
    }
    
    function echoWarningMessg(_content) {
        console.log("%c Error: "+ _content, "color:red");
    }
    
    //Input: array and delete item index
    //Output: changed array or false if no item found
    function arrayDeleteByIndex(_array, _index){
        if (_index > -1) {
            _array.splice(_index, 1);
            return _array;
        }else {
            return false;
        }
    }
    
    function arrayFindByValue(_array, _value){
        if(_array.indexOf(_value) === -1){
            return false;
        }else{
            return true;
        }
    }
    
    //Input: hex value. Exp: #000000
    //Output: rgb values. Exp: 0, 0, 0
    function hexToRgb(hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    
    //Input: rgb values. Exp: 0, 0, 0
    //Output: hex value. Exp: #000000
    function rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    
    //Input: rgb string. Exp: Rgb(0, 0, 0)
    //Output: rgb array. Exp: array(0, 0, 0)
    function rgbStringConvert(string) {
        var array = string.split("(")[1].split(")")[0].split(",");
        var arrayLength = array.length;
        
        for(var i = 0; i < arrayLength; i++){
            array[i] = Number(array[i].trim());
        }
        return array;
    }
    
    return{
        showHideDivision: showHideDivision,
        echoWarningMessg: echoWarningMessg,
        arrayDeleteByIndex: arrayDeleteByIndex,
        hexToRgb: hexToRgb,
        rgbToHex: rgbToHex,
        rgbStringConvert: rgbStringConvert,
        arrayFindByValue: arrayFindByValue,
        changePosition: changePosition
    };
})();