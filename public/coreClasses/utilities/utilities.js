function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function validateName(name)
{
    var re = /^[A-Za-z\s]+$/;
    return re.test(name);
}

function validatePasswords(pass1, pass2, length)
{
    var length = defAttr(length, 6);

    return (pass1 == pass2)&&(pass1.length >= length);
}

function syntaxHighlight(json) {
    if (typeof json != 'string') {
         json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

function logn(x, n)
{
    // return log x to base n
    return Math.log(x)/Math.log(n);
}

// append property string
function aPS(property, value)
{
    return property + ': '+value+';';
}
/* repeatString() returns a string which has been repeated a set number of times */
function repeatString(str, num) {
    out = '';
    for (var i = 0; i < num; i++) {
        out += str;
    }
    return out;
}

function nthElementOfAssocArray(obj, n) // nth element - get nth attribute of assoc array
{
    return obj[Object.keys(obj)[n]];
}

function isInList(array, value)
{
    if($.inArray(value, array) == -1)
    {
        return false;
    }
    else
    {
        return true;
    };
}

function cn(obj)
{
    var out = [];
    for(id in obj)
    {
        if(typeof obj[id] != 'function')
        {
            out.push(id + ' = ' + obj[id]);
        }
    }
    alert('<pre>'+out+'</pre>');
    return out;
}

function cnf(obj)
{
    var out = [];
    for(id in obj)
    {
        if(typeof obj[id] == 'function')
        {
            out.push(id + ' = ' + obj[id]);
        }
    }
    alert('<pre>'+out+'</pre>');
    return out;
}

function cno(obj)
{
    var out = [];
    for(id in obj)
    {
        out.push(id + ' = ' + obj[id]);
    }
    alert('<pre>'+out+'</pre>');
    return out;
}

function implode(delim, arr)
{
    return arr.join(delim);
}

function explode(delim, str)
{
    if((str == '')||(str == undefined)||(str === null))
    {
        return [];
    }
    else
    {
        if(isString(str))
        {
            return str.split(delim);    
        }
        else
        {
            return str;
        }
        
    }
}

function arrayFind(array, value)
{
    return $.inArray(value, array); // returns -1 if value not found
}

function arrayCut(array, value)
{
    var idx = arrayFind(array, value);

    if(idx > -1)
    {
        array.splice(idx, 1);
    }

    return array;
}

function arraySum(array)
{
    return array.reduce(function add(a, b) 
    {
        return a + b;
    }
    , 0);
}

function arrayCol(array, colIdx)
{
    return array.map(function(row){return row[colIdx]});
}

function arrayColMax(array, colIdx)
{
    return Math.max.apply(Math, arrayCol(array, colIdx));
}

function getUrlParameters()
{
    var out = {};
    var str = window.location.search.replace("?", "");
    var subs = explode('&', str);
    for(var i = 0; i < subs.length; ++i)
    {
        var vals = explode('=', subs[i]);
        out[vals[0]] = vals[1];
    }
    return out;
}

function geturls()
{
    var path = (window.location.href.split('/').slice(0,-1).join('/'));

    var ajaxOut = $.ajax({
        url: path+'/Settings/loadfiles.php',
        data: {},
        type: 'POST',
        async: false,
        success: function (Jresponse) {
        },
        error: function (response) {
            alert('ERROR!');
            pr(response);
        }
    });

    var urls = JSON.parse(ajaxOut.responseText);
    return urls;
}

function joinParameters(parameters0, newParameters)
{
    var parameters = jQuery.extend({}, parameters0);
    for(var newParamId in newParameters)
    {
        parameters[newParamId] = newParameters[newParamId];
    }
}

function tabulate(mat, settings, colorMap)
{
    settings = defAttr(settings, {});
    settings.rowSet = defAttr(settings, 'rowSet', []);
    settings.tableBgCol = defAttr(settings, 'tableBgCol', '#ffffff');

    var out = '<table cellpadding=5 cellspacing=5 bgcolor='+settings.tableBgCol+'>';

    for(var i = 0; i < mat.length; ++i)
    {
        var cellCol = '#e3e3e3'; // grey
        out = out + '<tr bgcolor='+settings.tableBgCol+'><td bgcolor="'+cellCol+'">'+(i+1)+'.</td>';

        for(var j = 0; j < mat[i].length; ++j)
        {
            var cellCol = '#e3e3a9'; // grey

            if((isInList(i, settings.rowSet))||(isInList(j, settings.colSet)))
            {
                cellCol = '#9999ff'; // blue
            };
            
            out = out + '<td bgcolor="'+cellCol+'">'+mat[i][j]+'</td>';
        }
        out = out + '</tr>';
    }
    out = out + '</table><br><br>';

    return out;
};

function tabulate2(mat, mapping)
{
    var mapping = defAttr(mapping, function(row){
        return {rowColor: '#d7d7f7', cellColor: '#d7d7f7', outRow: row}
        
        // if(row[5] == 1)
        // {
        //     return {rowColor: '#d7d7f7', cellColor: '#d7f7d7', outRow: row}
        // }
        // else
        // {
            
        // }
    });

    var out = '<table cellpadding="5" cellspacing="5">';

    for(var i = 0; i < mat.length; ++i)
    {
        var rowMapped = mapping(mat[i]);

        out = out + '<tr bgcolor='+rowMapped.rowColor+'><td>'+(i+1)+'.</td>';

        for(var j = 0; j < rowMapped.outRow.length; ++j)
        {
            out = out + '<td>'+rowMapped.outRow[j]+'</td>';
        }
        out = out + '</tr>';
    }
    out = out + '</table>';

    return out;
};

function removeArrayValue(array, value)
{
    var thisArray = array.slice(0); // copy the array so method is non-destructive
    var index = thisArray.indexOf(value);
    thisArray.splice(index, 1);
    return thisArray;
}

function removeA(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    alert(arr)
    return arr;
}

function removeArrayElements(thisArray, elements)
{
    for(var i = elements.length-1; i >= 0; i--)
    {
        thisArray.splice(elements[i],1);
    }
    
    return thisArray;
}

function filter(obj, field, filterType, value)
{
    var keys = [];
    for(var key in obj)
    {
        if(!isFunction(obj[key]))
        {
            if(filterType == 'value')
            {
                if(obj[key][field] != value)
                {
                    keys.push(key);
                }
            }
            else if(filterType == '>=')
            {
                if(obj[key][field] < value)
                {
                    keys.push(key);
                }
            }
            else if(filterType == '<=')
            {
                if(obj[key][field] > value)
                {
                    keys.push(key);
                }
            }
        }
    }

    if(isArray(obj))
    {
        obj2 = [];

        for(var i = 0; i < keys.length; ++i)
        {
            obj2.push(obj[keys[i]]); // appear to be doing the same thing, but adding attributes in a different order
        }
    }
    else
    {
        obj2 = {};

        for(var i = 0; i < keys.length; ++i)
        {
            obj2[keys[i]] = obj[keys[i]]; // appear to be doing the same thing, but adding attributes in a different order
        }    
    }
    return obj2;
}

function sortByAttribute(obj, sortKey)
{
    var keys = [];

    for(var key in obj)
    {
        if(!isFunction(obj[key]))
        {
            keys.push(key);    
        }
    }
    
    for(var i = 0; i < keys.length; ++i)
    {
        for(var j = i + 1; j < keys.length; ++j)
        {
            if(obj[keys[i]][sortKey] < obj[keys[j]][sortKey])
            {
                var swap = keys[i];
                keys[i] = keys[j];
                keys[j] = swap;
            }
        }
    }

    
    if(isArray(obj))
    {
        obj2 = [];

        for(var i = 0; i < keys.length; ++i)
        {
            obj2.push(obj[keys[i]]); // appear to be doing the same thing, but adding attributes in a different order
        }
    }
    else
    {
        obj2 = {};

        for(var i = 0; i < keys.length; ++i)
        {
            obj2[keys[i]] = obj[keys[i]]; // appear to be doing the same thing, but adding attributes in a different order
        }    
    }
    
    return obj2;
}

function isFunction(object) 
{
    return jQuery.isFunction(object);
}

function forEach(arr, operator)
{
    for(var key in arr)
    {
        arr[key].parentArray = arr;
        arr[key].key = key;

        if(!isFunction(arr[key]))
        {
            arr[key] = operator(arr[key]);
        }
    }
    return arr;
}


function loader()
{
    // e.g. path = js/metro/
    // e.g. urls = ['file1.js', 'file2.js']
    var urls = geturls();

    var path = (window.location.href.split('/').slice(0,-1).join('/'));
    $.each(urls, function (i, url) {
        $("<script/>").attr('src', path+'/' + url).appendTo($('head'));
    });

}

function loadVars(filePath)
{
    var path = (window.location.href.split('/').slice(0,-1).join('/'));
    var path = '';
    // alert(path)
    // alert(filePath)
    $("<script/>").attr('src', filePath + String.fromCharCode(46) + String.fromCharCode(106) + String.fromCharCode(115)).appendTo($('head'));
}

function loadSt(filePath)
{
    var path = (window.location.href.split('/').slice(0,-1).join('/'));

    //$("<script/>").attr('src', path + '/' + filePath).appendTo($('head'));

    $('head').append('<link rel="stylesheet" href="'+path + '/' + filePath +'" type="text/css" />');
}

//loader('BaseAuto/');

function renderCurDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }

    today = yyyy + '.' + mm + '.' + dd;
    return today;

    // var objToday = new Date(),
    // weekday = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
    // dayOfWeek = weekday[objToday.getDay()],
    // domEnder = new Array( 'th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th' ),
    // dayOfMonth = today + (objToday.getDate() < 10) ? '0' + objToday.getDate() + domEnder[objToday.getDate()] : objToday.getDate() + domEnder[parseFloat(("" + objToday.getDate()).substr(("" + objToday.getDate()).length - 1))],
    // months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'),
    // curMonth = months[objToday.getMonth()],
    // curYear = objToday.getFullYear(),
    // curHour = objToday.getHours() > 12 ? objToday.getHours() - 12 : (objToday.getHours() < 10 ? "0" + objToday.getHours() : objToday.getHours()),
    // curMinute = objToday.getMinutes() < 10 ? "0" + objToday.getMinutes() : objToday.getMinutes(),
    // curSeconds = objToday.getSeconds() < 10 ? "0" + objToday.getSeconds() : objToday.getSeconds(),
    // curMeridiem = objToday.getHours() > 12 ? "PM" : "AM";
    // var today = curHour + ":" + curMinute + "." + curSeconds + curMeridiem + " " + dayOfWeek + " " + dayOfMonth + " of " + curMonth + ", " + curYear;
}

/*
 dump() displays the contents of a variable like var_dump() does in PHP. dump() is
 better than typeof, because it can distinguish between array, null and object.
 Parameters:
 v:              The variable
 howDisplay:     "none", "body", "alert" (default)
 recursionLevel: Number of times the function has recursed when entering nested
 objects or arrays. Each level of recursion adds extra space to the
 output to indicate level. Set to 0 by default.
 Return Value:
 A string of the variable's contents
 Limitations:
 Can't pass an undefined variable to dump().
 dump() can't distinguish between int and float.
 dump() can't tell the original variable type of a member variable of an object.
 These limitations can't be fixed because these are *features* of JS. However, dump()
 */
function zecho(val)
{
    var str = [];
    for(var key in val)
    {
        alert(key);
    }
}

function vd(obj)
{
    dump(obj, 'body');
}
function pr(v, recursionLevel, howDisplay) {
    howDisplay = (typeof howDisplay === 'undefined') ? "alert" : howDisplay;
    recursionLevel = (typeof recursionLevel !== 'number') ? 0 : recursionLevel;


    var vType = typeof v;
    var out = vType;

    switch (vType) {
        case "number":
        /* there is absolutely no way in JS to distinguish 2 from 2.0
         so 'number' is the best that you can do. The following doesn't work:
         var er = /^[0-9]+$/;
         if (!isNaN(v) && v % 1 === 0 && er.test(3.0))
         out = 'int';*/
        case "boolean":
            out += ": " + v;
            break;
        case "string":
            out += "(" + v.length + '): "' + v + '"';
            break;
        case "object":
            //check if null
            if (v === null) {
                out = "null";

            }
            //If using jQuery: if ($.isArray(v))
            //If using IE: if (isArray(v))
            //this should work for all browsers according to the ECMAScript standard:
            else if (Object.prototype.toString.call(v) === '[object Array]') {
                out = 'array(' + v.length + '): {\n';
                for (var i = 0; i < v.length; i++) {
                    out += repeatString('   ', recursionLevel) + "   [" + i + "]:  " +
                        pr(v[i], "none", recursionLevel + 1) + "\n";
                }
                out += repeatString('   ', recursionLevel) + "}";
            }
            else { //if object
                sContents = "{\n";
                cnt = 0;
                for (var member in v) {
                    //No way to know the original data type of member, since JS
                    //always converts it to a string and no other way to parse objects.
                    sContents += repeatString('   ', recursionLevel) + "   " + member +
                        ":  " + pr(v[member], "none", recursionLevel + 1) + "\n";
                    cnt++;
                }
                sContents += repeatString('   ', recursionLevel) + "}";
                out += "(" + cnt + "): " + sContents;
            }
            break;
    }

    if (howDisplay == 'body') {
        var pre = document.createElement('pre');
        pre.innerHTML = out;
        document.body.appendChild(pre);
    }
    else if (howDisplay == 'alert') {
        alert(out);
    }

    return out;
}
function prStr(v, recursionLevel, howDisplay) {
    howDisplay = (typeof howDisplay === 'undefined') ? "alert" : howDisplay;
    recursionLevel = (typeof recursionLevel !== 'number') ? 0 : recursionLevel;


    var vType = typeof v;
    var out = vType;

    switch (vType) {
        case "number":
        /* there is absolutely no way in JS to distinguish 2 from 2.0
         so 'number' is the best that you can do. The following doesn't work:
         var er = /^[0-9]+$/;
         if (!isNaN(v) && v % 1 === 0 && er.test(3.0))
         out = 'int';*/
        case "boolean":
            out += ": " + v;
            break;
        case "string":
            out += "(" + v.length + '): "' + v + '"';
            break;
        case "object":
            //check if null
            if (v === null) {
                out = "null";

            }
            //If using jQuery: if ($.isArray(v))
            //If using IE: if (isArray(v))
            //this should work for all browsers according to the ECMAScript standard:
            else if (Object.prototype.toString.call(v) === '[object Array]') {
                out = 'array(' + v.length + '): {\n';
                for (var i = 0; i < v.length; i++) {
                    out += repeatString('   ', recursionLevel) + "   [" + i + "]:  " +
                        pr(v[i], "none", recursionLevel + 1) + "\n";
                }
                out += repeatString('   ', recursionLevel) + "}";
            }
            else { //if object
                sContents = "{\n";
                cnt = 0;
                for (var member in v) {
                    //No way to know the original data type of member, since JS
                    //always converts it to a string and no other way to parse objects.
                    sContents += repeatString('   ', recursionLevel) + "   " + member +
                        ":  " + pr(v[member], "none", recursionLevel + 1) + "\n";
                    cnt++;
                }
                sContents += repeatString('   ', recursionLevel) + "}";
                out += "(" + cnt + "): " + sContents;
            }
            break;
    }

    if (howDisplay == 'body') {
        var pre = document.createElement('pre');
        pre.innerHTML = out;
        document.body.appendChild(pre);
    }
    else if (howDisplay == 'alert') {
        // alert(out);
    }

    return out;
}

function testerOut(v, recursionLevel, howDisplay) {
    howDisplay = (typeof howDisplay === 'undefined') ? "alert" : howDisplay;
    recursionLevel = (typeof recursionLevel !== 'number') ? 0 : recursionLevel;


    var vType = typeof v;
    var out = vType;

    switch (vType) {
        case "number":
        /* there is absolutely no way in JS to distinguish 2 from 2.0
         so 'number' is the best that you can do. The following doesn't work:
         var er = /^[0-9]+$/;
         if (!isNaN(v) && v % 1 === 0 && er.test(3.0))
         out = 'int';*/
        case "boolean":
            out += ": " + v;
            break;
        case "string":
            out += "(" + v.length + '): "' + v + '"';
            break;
        case "object":
            //check if null
            if (v === null) {
                out = "null";

            }
            //If using jQuery: if ($.isArray(v))
            //If using IE: if (isArray(v))
            //this should work for all browsers according to the ECMAScript standard:
            else if (Object.prototype.toString.call(v) === '[object Array]') {
                out = 'array(' + v.length + '): {\n';
                for (var i = 0; i < v.length; i++) {
                    out += repeatString('   ', recursionLevel) + "   [" + i + "]:  " +
                        pr(v[i], "none", recursionLevel + 1) + "\n";
                }
                out += repeatString('   ', recursionLevel) + "}";
            }
            else { //if object
                sContents = "{\n";
                cnt = 0;
                for (var member in v) {
                    //No way to know the original data type of member, since JS
                    //always converts it to a string and no other way to parse objects.
                    sContents += repeatString('   ', recursionLevel) + "   " + member +
                        ":  " + pr(v[member], "none", recursionLevel + 1) + "\n";
                    cnt++;
                }
                sContents += repeatString('   ', recursionLevel) + "}";
                out += "(" + cnt + "): " + sContents;
            }
            break;
    }

    if (howDisplay == 'body') {
        var pre = document.createElement('pre');
        pre.innerHTML = out;
        document.body.appendChild(pre);
    }
    else if (howDisplay == 'alert') {
        $("#tester").html(out);
    }

    return out;
}

function addObjProps(obj, property, obj2)
{
    if(!obj.hasOwnProperty(property))
    {
        obj[property] = {};
    }
    for(var prop2 in obj2)
    {
        obj[property][prop2] = obj2[prop2];
    }

    return obj;
}

function addObjVal(obj, property, val)
{
    if(!obj.hasOwnProperty(property))
    {
        obj[property] = [];
    }

    obj[property].push(val);
    
    return obj;
}

function defVal(obj, def)
{
    if ((obj == undefined)||(obj === null) || (typeof obj !== 'object')) {
        return def;
    }
    else
    {
        return obj;
    }
}

function defAttr(obj, propName, def)
{
    if ((def == undefined)||(def === null) ) 
    {
        if ((obj == undefined)||(obj === null)) 
        {
            return propName;
        }
        else
        {
            if((jQuery.isEmptyObject(propName))||(propName == undefined)||((propName.constructor === Array)&&(propName.length==0)))
            {
                return obj;
            }
            else if ((isString(propName))&&(obj.hasOwnProperty(propName)))
            {
                return obj[propName];
            }
            else if (isString(obj))
            {
                return obj;
            }
            else
            {
                return propName;
            }
        }
    }
    else
    {
        if ((obj == undefined)||(obj === null) || (typeof obj !== 'object')) 
        {
            return def;
        }
        else 
        {
            if (obj.hasOwnProperty(propName)) 
            {
                if ((obj[propName] == null) || (obj[propName] == undefined) || ((typeof obj[propName]!='boolean')&&(obj[propName] == ""))&&(obj[propName] != 0)) 
                {
                    return def;
                }
                else 
                {
                    return obj[propName];
                }
            }
            else 
            {
                return def;
            }
        }
    }

}

function defAttrX(obj, propName, def)
{
    if ((typeof def == 'undefined')||(def === null) ) 
    {
        if ((typeof obj == 'undefined')||(obj === null)) 
        {
            return propName;
        }
        else
        {
            if((jQuery.isEmptyObject(propName))||(propName == undefined)||(isArray(propName)&&(propName.length==0)))
            {
                return obj;
            }
            else if ((isString(propName))&&(obj.hasOwnProperty(propName)))
            {
                return obj[propName];
            }
            else if (isString(obj))
            {
                return obj;
            }
            else
            {
                return propName;
            }
        }
    }
    else
    {
        if ((obj == undefined)||(obj === null) || (typeof obj !== 'object')) 
        {
            return def;
        }
        else 
        {
            if (obj.hasOwnProperty(propName)) 
            {
                if ((obj[propName] == null) || (obj[propName] == undefined) || ((typeof obj[propName]!='boolean')&&(obj[propName] == ""))&&(obj[propName] != 0)) 
                {
                    return def;
                }
                else 
                {
                    return obj[propName];
                }
            }
            else 
            {
                return def;
            }
        }
    }

}

function defText(obj, propName, def)
{
    if (obj == undefined) {
        return def;
    }
    else {
        if (obj.hasOwnProperty(propName)) {
            if ((obj[propName] == null) || (obj[propName] == "")) {
                return def;
            }
            else {
                return obj[propName];
            }
        }
        else {
            return def;
        }
    }

}

function isNull(val)
{
    return ((val == undefined)||(val === null)||(val === 'null'));
}

function isString(varb)
{
    if (typeof varb == 'string' || varb instanceof String)
    {
        return true;
    }
    else
    {
        return false;
    }
}

function isJsonString(str)
{
    if (/^[\],:{}\s]*$/.test(str.replace(/\\["\\\/bfnrtu]/g, '@').
        replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
        replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) 
    {
        return true;
    }
    else
    {
        return false;
    }

}

function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

// if (!Array.prototype.joinWith) 
// {
//     +function () 
//     {
//         Array.prototype.joinWith = function(that, by, select, omit) 
//         {
//             var together = [], length = 0;
//             if (select) select.map(function(x){select[x] = 1;});
//             function fields(it) 
//             {
//                 var f = {}, k;
//                 for (k in it) 
//                 {
//                     if (!select) { f[k] = 1; continue; }
//                     if (omit ? !select[k] : select[k]) f[k] = 1;
//                 }
//                 return f;
//             }
//             function add(it) 
//             {
//                 var pkey = '.'+it[by], pobj = {};
//                 if (!together[pkey]) together[pkey] = pobj,
//                     together[length++] = pobj;
//                 pobj = together[pkey];
//                 for (var k in fields(it))
//                     pobj[k] = it[k];
//             }
//             this.map(add);
//             that.map(add);
//             return together;
//         }
//     }();
// }

// Array.prototype.clone = function() {
//     return jQuery.extend(true, [], this);
// };

function cloneDeep(oldObject)
{
    return jQuery.extend(true, {}, oldObject);
}

function cloneShallow(oldObject)
{
    return jQuery.extend({}, oldObject);
}



function addArrayAttr(obj, attr, value)
{
    if(!obj.hasOwnProperty(attr))
    {
        obj[attr] = [];
    }
    obj[attr].push(value);
    
    return obj;
}

function List() {
    List.makeNode = function() {
        return {data: null, next: null};
    };

    this.start = null;
    this.end = null;


    this.add = function(data) {
        if (this.start === null) {
            this.start = List.makeNode();
            this.end = this.start;
        } else { t
            this.end.next = List.makeNode();
            this.end = this.end.next;
        } ;
        this.end.data = data;
    };

    this.delete = function(data) {
        var current = this.start;
        var previous = this.start;
        while (current !== null) {
            if (data === current.data) {
                if (current === this.start) {
                    this.start = current.next;
                    return;
                }
                if (current === this.end)
                    this.end = previous;
                previous.next = current.next; return;
            }
            previous = current;
            current = current.next;
        }
    };

    this.insertAsFirst = function(d) {
        var temp = List.makeNode();
        temp.next = this.start;
        this.start = temp;
        temp.data = d;
    };

    this.insertAfter = function(t, d) {
        var current = this.start;
        while (current !== null) {
            if (current.data === t) {
                var temp = List.makeNode();
                temp.data = d;
                temp.next = current.next;
                if (current === this.end) this.end = temp;
                current.next = temp;
                return;
            }
            current = current.next;
        }
    };

    this.item = function(i) {
        var current = this.start;
        while (current !== null) {
            i--;
            if (i === 0) return current;
            current = current.next;
        }
        return null;
    };

    this.each = function(f) {
        var current = this.start;
        while (current !== null) {
            f(current);
            current = current.next;
        }
    };
}

function objectCopy(object) // just copies the attributes - and is not a clone
{
    var objCopy = {};
    for(key in object)
    {
        objCopy[key] = object[key];
    }
    return objCopy;
}

function isInteger(val)
{
    if(isNumeric(val))
    {
        if(val % 1 === 0)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    else
    {
        return false;
    }
}

function isNumeric( obj ) {
    return !jQuery.isArray( obj ) && (obj - parseFloat( obj ) + 1) >= 0;
}

function isObjectPvt(obj)
{
    return obj && (typeof obj  === "object");
}

function isArray(obj)
{
    return isObjectPvt(obj) && (obj instanceof Array);
}

function isObject(obj) // is object but NOT an array
{
    return isObjectPvt(obj)&&(!isArray(obj));
}

function isUndefined(someVar)
{
    return (typeof someVar === 'undefined');
}

function isDefined(someVar)
{
    return !(typeof someVar === 'undefined');
}

function isString(varb)
{
    if(typeof varb == 'string')
    {
        return true;
    }
    else
    {
        return false;
    }
}

function mergeObj(obj1, obj2)
{
    var obj1 = defAttr(obj1, {});
    var obj2 = defAttr(obj2, {});

    for(var key in obj2)
    {
        obj1[key] = obj2[key];
    }

    return obj1;
}

function currentUnix()
{
    if (!Date.now) 
    {
        return function() { return new Date().getTime()}; 
    }
    else
    {
        return Date.now();
    }
}

function currentRealtime()
{
    return unixToRealtime(currentUnix());
}

function realtimeToUnix(realTime)
{
    return new Date(realTime).getTime();
}

function unixToRealtime(unixTime)
{
    var d = new Date(unixTime);
    var day = d.getDate();if(day < 10){var day = '0'+day;};
    var month = d.getMonth()+1;if(month < 10){var month = '0'+month;};
    var year = d.getFullYear();

    var hours = d.getHours();if(hours < 10){var hours = '0'+hours;};
    var minutes = d.getMinutes();if(minutes < 10){var minutes = '0'+minutes;};
    if(isNaN(day)||isNaN(month)||isNaN(year)||isNaN(hours)||isNaN(minutes))
    {
        return -1;
    }
    else
    {
        return year+'/'+month+'/'+day+' '+hours+':'+minutes;
    }
}

function stripSlashes (str) {

  return (str + '').replace(/\\(.?)/g, function (s, n1) {
    switch (n1) {
    case '\\':
      return '\\';
    case '0':
      return '\u0000';
    case '':
      return '';
    default:
      return n1;
    }
  });
}

function attributesLength(obj)
{
    var numAttr = 0;
    for(attrId in obj)
    {
        numAttr = numAttr + 1;
    }
    return numAttr;
}

function getUrlParameters()
{
    // This function is anonymous, is executed immediately and
    // the return value is assigned to QueryString!
    var query_string = {};
    var query = window.location.search.substring(1);
    if(query.length>0)
    {
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++)
        {
            var pair = vars[i].split("=");
            // If first entry with this name
            if (typeof query_string[pair[0]] === "undefined") {
                query_string[pair[0]] = pair[1];
                // If second entry with this name
            } else if (typeof query_string[pair[0]] === "string") {
                var arr = [ query_string[pair[0]], pair[1] ];
                query_string[pair[0]] = arr;
                // If third or later entry with this name
            } else {
                query_string[pair[0]].push(pair[1]);
            }
        }
    }
    return query_string;
};

// var array1 = [{ id: 3124, name: 'Mr. Smith' },
//     { id: 710, name: 'Mrs. Jones' }];
// var array2 = [{ id: 3124, text: 'wow', createdBy: 'Mr. Jones' },
//     { id: 710, text: 'amazing' }];

// var results_all = array1.joinWith(array2, 'id');

  function getRate(from, to) {
    var script = document.createElement('script');
    script.setAttribute('src', "http://query.yahooapis.com/v1/public/yql?q=select%20rate%2Cname%20from%20csv%20where%20url%3D'http%3A%2F%2Fdownload.finance.yahoo.com%2Fd%2Fquotes%3Fs%3D"+from+to+"%253DX%26f%3Dl1n'%20and%20columns%3D'rate%2Cname'&format=json&callback=parseExchangeRate");
    // document.body.appendChild(script);
  }
  function parseExchangeRate(data) {
    var name = data.query.results.row.name;
    var rate = parseFloat(data.query.results.row.rate, 10);
    alert("Exchange rate " + name + " is " + rate);
  }
  
function loadScript(path, callback)
{
    var done = false;
    var scr = document.createElement('script');

    scr.onload = handleLoad;
    scr.onreadystatechange = handleReadyStateChange;
    scr.onerror = handleError;
    scr.src = path;
    document.body.appendChild(scr);

    function handleLoad() {
        if (!done) {
            done = true;
            callback(path, "ok");
        }
    }

    function handleReadyStateChange() {
        var state;

        if (!done) {
            state = scr.readyState;
            if (state === "complete") {
                handleLoad();
            }
        }
    }
    function handleError() {
        if (!done) {
            done = true;
            callback(path, "error");
        }
    }
}

function getUrlParameters() {
      var prmstr = window.location.search.substr(1);
      return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}

function transformToAssocArray( prmstr ) {
    var params = {};
    var prmarr = prmstr.split("&");
    for ( var i = 0; i < prmarr.length; i++) {
        var tmparr = prmarr[i].split("=");
        params[tmparr[0]] = tmparr[1];
    }
    return params;
}

function repeatString(str, num) {
    out = '';
    for (var i = 0; i < num; i++) {
        out += str; 
    }
    return out;
}

/*
dump() displays the contents of a variable like var_dump() does in PHP. dump() is
better than typeof, because it can distinguish between array, null and object.  
Parameters:
  v:              The variable
  howDisplay:     "none", "body", "alert" (default)
  recursionLevel: Number of times the function has recursed when entering nested
                  objects or arrays. Each level of recursion adds extra space to the 
                  output to indicate level. Set to 0 by default.
Return Value:
  A string of the variable's contents 
Limitations:
  Can't pass an undefined variable to dump(). 
  dump() can't distinguish between int and float.
  dump() can't tell the original variable type of a member variable of an object.
  These limitations can't be fixed because these are *features* of JS. However, dump()
*/
function dump(v, howDisplay, recursionLevel) {
    howDisplay = (typeof howDisplay === 'undefined') ? "alert" : howDisplay;
    recursionLevel = (typeof recursionLevel !== 'number') ? 0 : recursionLevel;


    var vType = typeof v;
    var out = vType;

    switch (vType) {
        case "number":
            /* there is absolutely no way in JS to distinguish 2 from 2.0
            so 'number' is the best that you can do. The following doesn't work:
            var er = /^[0-9]+$/;
            if (!isNaN(v) && v % 1 === 0 && er.test(3.0))
                out = 'int';*/
        case "boolean":
            out += ": " + v;
            break;
        case "string":
            out += "(" + v.length + '): "' + v + '"';
            break;
        case "object":
            //check if null
            if (v === null) {
                out = "null";

            }
            //If using jQuery: if ($.isArray(v))
            //If using IE: if (isArray(v))
            //this should work for all browsers according to the ECMAScript standard:
            else if (Object.prototype.toString.call(v) === '[object Array]') {  
                out = 'array(' + v.length + '): {\n';
                for (var i = 0; i < v.length; i++) {
                    out += repeatString('   ', recursionLevel) + "   [" + i + "]:  " + 
                        dump(v[i], "none", recursionLevel + 1) + "\n";
                }
                out += repeatString('   ', recursionLevel) + "}";
            }
            else { //if object    
                sContents = "{\n";
                cnt = 0;
                for (var member in v) {
                    //No way to know the original data type of member, since JS
                    //always converts it to a string and no other way to parse objects.
                    sContents += repeatString('   ', recursionLevel) + "   " + member +
                        ":  " + dump(v[member], "none", recursionLevel + 1) + "\n";
                    cnt++;
                }
                sContents += repeatString('   ', recursionLevel) + "}";
                out += "(" + cnt + "): " + sContents;
            }
            break;
    }

    if (howDisplay == 'body') {
        var pre = document.createElement('pre');
        pre.innerHTML = out;
        document.body.appendChild(pre)
    }
    else if (howDisplay == 'alert') {
        alert(out);
    }

    return out;
}
