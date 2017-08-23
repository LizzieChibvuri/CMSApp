// For a given compound, specific styles must be defined
// The compound input specifies the object IDs and the content
// There will be default fonts and colors for the styles, which can be overridden [settings]

// For a theme, need to set the fonts and colors, perhaps some styles

// Style classes registry is available; whether loaded is noted; if not, the registry can load it
// Assets list is available; the assets loaded is also recorded so a precheck can be done before rendering

// load assets (e.g. fonts)
// create css

class aui{

	constructor(idSlug, type, content, parent)
	{
		this.type = defAttr(type, 'auiDiv');
		
		this.idSlug = idSlug;
		this.content = content;
		this.parent = parent;

		this.viewport = defAttr(content, 'viewport', -1);

		this.cssClass = '';
		this.cssStyle = '';

		this.children = {};

		this.clickEvents = {};

		this.id = parent.id + '_' + idSlug;
	}

	add(idSlug, type, content)
	{
		if(type == 'auiDiv')
		{
			var thisAui = new auiDiv(idSlug, content, this);
		}
		else if(type == 'auiDropButton')
		{
			var thisAui = new auiDropButton(idSlug, content, this);
		}
		else if(type == 'auiTabs')
		{
			var thisAui = new auiTabs(idSlug, content, this);
		}
		else if(type == 'auiNavbar')
		{
			var thisAui = new auiNavbar(idSlug, content, this);
		}
		
		this.children[idSlug] = thisAui;

		return thisAui;
	}

	render()
	{
		var that = this;
		
		$(document).ready( function()
		{
			if(that.uiExists(that.id))
			{
				that.renderUi();			
			}
			else
			{
				$('#'+that.parent.id).append('<div id="'+that.id+'"></div>');
				that.renderUi();
			}

			for(var key in that.children)
			{
				that.children[key].render();
			}
		});

		return this;
	}

	addObjsetContent(objSet, content)
	{
		for(var objKey in objSet)
		{
			for(var contentKey in content)
			{
				objSet[objKey][contentKey] = content[contentKey];
			}
		}

		return objSet;
	}

	uiText(id, content, uiType)
	{
		// uiType in case we need something other than div, e.g. li
		uiType = defAttr(uiType, 'div');
		// prefix in case we want to put this in a compartment instead of right at the root of the ui of this object
		var cssClass = '';
		var cssStyle = '';
		if(content.hasOwnProperty('cssClass'))
		{
			cssClass = 'class="'+content.cssClass+'"';
		}
		if(content.hasOwnProperty('cssStyle'))
		{
			cssStyle = 'style="'+content.cssStyle+'"';
		}

		return '<'+uiType+' id="'+id+'" '+cssClass+' '+cssStyle+'><a href="#">'+content.label+'</a></'+uiType+'>';
	}

	addUi(idSlug, content, uiType, parentId)
	{
		var parentId = defAttr(parentId, this.id);
		// uiType in case we need something other than div, e.g. li
		// prefix in case we want to put this in a compartment instead of right at the root of the ui of this object
		uiType = defAttr(uiType, 'div');

		$('#'+parentId).append(this.uiText(this.id+'_'+idSlug, content, uiType));

		if(content.hasOwnProperty('callback'))
		{
			$('#'+this.id+'_'+idSlug).on('click', content.callback);
		}
	}

	addUiSet(objs, prefix, uiType, parentId)
	{
		var pref1 = '';
		if(!((prefix == null)||(prefix == '')))
		{
			pref1 = '_'+prefix;
		}

		var parentId = defAttr(parentId, this.id+pref1);
		// uiType in case we need something other than div, e.g. li
		// prefix in case we want to put this in a compartment instead of right at the root of the ui of this object
		uiType = defAttr(uiType, 'div');

		for(var key in objs)
		{
			this.addUi(pref1+key, objs[key], uiType, parentId);
		}
	}

	setContent(content)
	{
		this.content = content;
		return this;
	}

	addClicker(id, handler)
	{
		// $()
	}

	uiExists(id)
    {
        return !!document.getElementById(id);
    }

    zelf()
    {
    	return this.parent.children[this.id]; // returns the present object, but the extended version, i.e. the higher order self
    }
    
}

class auiDiv extends aui{

	constructor(idSlug, content, parent)
	{
		super(idSlug, 'auiDiv', content, parent);
	}

	renderUi()
	{
		$('#'+this.id).html(this.content.script);
	}
}

class auiDropButton extends aui{
	
	constructor(idSlug, content, parent)
	{
		super(idSlug, 'auiDropButton', content, parent);
	}

	renderUi()
	{
		var renderStr = 
		'<div class="dropdown" style="text-align: left; margin-left: 20px">'+
			'<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'+
				this.content.title+
				'<span class="caret" style: "margin-left: 5px"></span>'+
			'</button>'+
			'<ul class="dropdown-menu" aria-labelledby="dropdownMenu1">';

		for(var key in this.content.options)
		{
			var thisOpt = this.content.options[key];
			if(thisOpt.hasOwnProperty('href'))
			{
				renderStr = renderStr + '<li id="'+this.id+'_options_'+key+'"><a href="'+thisOpt.href+'">'+thisOpt.label+'</a></li>';
			}
			else if(thisOpt.hasOwnProperty('callback'))
			{
				renderStr = renderStr + '<li><div id="'+this.id+'_options_'+key+'">'+thisOpt.label+'</div></li>';
			}
		}

		renderStr = renderStr + '</ul></div>';
		
		$('#'+this.id).html(renderStr);

		// Nb: Can only add the action after the option has been rendered
		for(var key in this.content.options)
		{
			var thisOpt = this.content.options[key];

			if(thisOpt.hasOwnProperty('callback'))
			{
				// alert(thisOpt.callback)
				$('#'+this.id+'_options_'+key).on('click', thisOpt.callback);
				// $('#'+this.id+'_options_'+key).on('click', function(){alert(123)});
			}
		}
	}
}

class auiTabs extends aui{
	constructor(idSlug, content, parent)
	{
		super(idSlug, 'auiTabs', content, parent);
	}

	renderUi()
	{
		var renderStr = '<div id="'+this.id+'" class="bd-example bd-example-tabs" role="tabpanel" style: "margin-left:25px">'+
            '<ul class="nav nav-tabs" role="tablist" style: "margin-top:20px">';

        this.active = Object.keys(this.content.tabs)[0];

        for(var key in this.content.tabs)
        {
        	var thisTab = this.content.tabs[key];

            if(this.active == key)
            {
            	renderStr = renderStr +
                '<li class="nav-item active" id="'+this.id+'_'+key+'li">'+
                '<a role="tab" aria-expanded="true" data-toggle="tab" class="nav-link active" href="#'+this.id+'_'+key+'">'+thisTab.label+'</a></li>';
            }
            else
            {
                renderStr = renderStr +
                '<li class="nav-item" id="'+this.id+'_'+key+'li">'+
                '<a role="tab" data-toggle="tab" class="nav-link" href="#'+this.id+'_'+key+'">'+thisTab.label+'</a></li>';
            }
        }

        renderStr = renderStr + '</ul><div class="tab-content" id="'+this.id+'TabContent">';

        for(var key in this.content.tabs)
        {
        	var thisTab = this.content.tabs[key];

            if(this.active == key)
            {
                renderStr = renderStr +
                    '<div class="tab-pane active" style="padding:10px" id="'+this.id+'_'+key+'" role="tabpanel" aria-labelledby="'+this.id+'_'+key+'-tab">'+thisTab.script+'</div>';
            }
            else
            {
                renderStr = renderStr +
                    '<div class="tab-pane fade" style="padding:10px" id="'+this.id+'_'+key+'" role="tabpanel" aria-labelledby="'+this.id+'_'+key+'-tab">'+
                    	thisTab.script+
                    '</div>';
            }
        }

        renderStr = renderStr + '</div></div>';

        $('#'+this.id).html(renderStr);

        for(var key in this.content.tabs)
        {
        	var thisTab = this.content.tabs[key];

            // $('#'+this.id+'_'+key+'li').on('click', function(params){
            // 	pr(params.click)
            // 	alert(key)
            // })
        }
	}
}

class auiNavbar extends aui{
	
	constructor(idSlug, content, parent)
	{
		super(idSlug, 'auiNavbar', content, parent);
	}

	renderUi()
	{
		var title = defAttr(this.content, 'title', {});
		var left = defAttr(this.content, 'left', {});
		var right = defAttr(this.content, 'right', {});

		var renderStr = 
			'<nav class="navbar navbar-inverse" style="margin-bottom:10px; border-radius: 0px">'+
	            '<div class="container-fluid">'+
	                '<div class="navbar-header">'+
	                    '<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">'+
	                        '<span class="sr-only">Toggle navigation</span>'+
	                        '<span class="icon-bar"></span>'+
	                        '<span class="icon-bar"></span>'+
	                        '<span class="icon-bar"></span>'+
	                    '</button>'+
	                    '<a class="navbar-brand" href="#">'+
	                        '<div style="'+defAttr(title, 'cssStyle', '')+'">'+defAttr(title, 'label', 'Title')+'</div>'+
	                    '</a>'+
	                '</div>'+
	                '<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">'+
	                    '<ul class="nav navbar-nav" id="'+this.id+'_left">'+
                        '</ul>'+
	                    '<ul class="nav navbar-nav navbar-right" id="'+this.id+'_right">'+
	                    '</ul>'+
	                '</div>'+
	            '</div>'+
	        '</nav>';
	    $('#'+this.id).html(renderStr);

	    this.addUiSet(left, 'left', 'li');
	    this.addUiSet(right, 'right', 'li');

	    // for(var key in right)
	    // {
	    // 	$('#'+this.id+'_right').append('<li><a href="#">'+defAttr(right[key], 'label', key)+'</a></li>');
	    // }
	}
}