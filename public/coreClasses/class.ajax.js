// For a given compound, specific styles must be defined
// The compound input specifies the object IDs and the content
// There will be default fonts and colors for the styles, which can be overridden [settings]

// For a theme, need to set the fonts and colors, perhaps some styles

// Style classes registry is available; whether loaded is noted; if not, the registry can load it
// Assets list is available; the assets loaded is also recorded so a precheck can be done before rendering

// load assets (e.g. fonts)
// create css

class ajaxGet{

	constructor(settings)
	{
		this.getType = defAttr(settings, 'getType', 'POST');
        this.returnType = defAttr(settings, 'returnType', 'JSON');
        this.path = defAttr(settings, 'path', '');
        
	}

	executeGet(parameters, callbacks)
    {
    	var that = this;
        $.ajax(
        {   
            type: that.getType,
            url: that.path,
            dataType: that.returnType,   //expect html to be returned
            enctype: 'multipart/form-data',
            data: parameters,
            success: function(response)
            {
                if(isString(response))
                {
                    if(isJsonString(response))
                    {
                        var dataResponse = JSON.parse(response);
                    }
                    else
                    {
                        var dataResponse = response;
                    }
                }
                else
                {
                    var dataResponse = response;
                }

                that.executeCallbacks(callbacks, dataResponse, parameters);
            },
            error: function(jqXHR, textStatus, errorThrown) 
            {
                pr({x:2, jqXHR:jqXHR, textStatus:textStatus, errorThrown:errorThrown});
            }
        });
    }

    executeCallbacks(callbacks, dataResponse, parameters)
    {
    	var getType = {};
		
		if(callbacks && getType.toString.call(callbacks) === '[object Function]')
    	{
    		return callbacks(dataResponse, parameters);
    	}
    	else if(callbacks.isArray(callbacks))
    	{
    		for(var i = 0; i < callbacks.length; ++i)
    		{
    			executeCallbacks(callbacks[i], dataResponse, parameters)
    		}
    	}
    	else
    	{
    		alert('callback type unknown')
    	}
    }

       
}