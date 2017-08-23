class styleRegistry{
	
	constructor()
	{
		this.baseCssPath = 'mediaAssets/css/';
		this.baseFontPath = 'mediaAssets/fonts/';
		this.styles = {};
		this.fonts = {};

		this.styles['basic'] = {path: 'basic'};

		this.fonts['Zilla'] = {path: 'Zilla_Slab/ZillaSlab-Regular.ttf'};
	}

	loadCss(cssId)
	{
		this.injectCssToDoc(this.cssDefinition(cssId));
	}

	loadFont(fontId)
    {
    	this.injectCssToDoc("@font-face {font-family: '"+fontId+"';src: url(mediaAssets/fonts/"+this.fonts[fontId].path+") format('truetype');} ");
    }

    cssDefinition(cssId)
	{
		var thisCss = '';
		if(cssId == 'basic')
		{
			// var thisCss = "@font-face {font-family: 'Zilla';src: url(mediaAssets/fonts/Zilla_Slab/ZillaSlab-Regular.ttf) format('truetype');} h1, h2, h3, h4, h5, h6 {font-family: 'Zilla', 'Helvetica', 'Arial', 'sans-serif';font-weight: 200;letter-spacing: 1px;}";
			var thisCss = "h1, h2, h3, h4, h5, h6 {font-family: 'Zilla', 'Helvetica', 'Arial', 'sans-serif';font-weight: 200;letter-spacing: 1px;}";
		}
		return thisCss;
	}

	injectCssToDoc(css)
    {
    	var head = document.head || document.getElementsByTagName('head')[0],
    	style = document.createElement('style');

		style.type = 'text/css';
		if (style.styleSheet)
		{
  			style.styleSheet.cssText = css;
  		} 
  		else 
  		{
  			style.appendChild(document.createTextNode(css));
  		}

  		head.appendChild(style);
    }

    createStyleClass(className, css)
    {
        this.injectCssToDoc('.'+className+'{'+css+'}');
    }

    createStyleSubClass(className, subClassName, css)
    {
        this.injectCssToDoc('.'+className+' .'+subClassName+'{'+css+'}');
    }

    createCssClass(className, css)
    {
        this.injectCssToDoc(className+'{'+css+'}');
    }

    addGradient(fgColor, bgColor)
    {
        return 'background-color: #'+fgColor+';'+
            'background-image: -webkit-gradient(linear, left top, left bottom, from(#'+fgColor+'), to(#'+bgColor+'));'+
            'background-image: -webkit-linear-gradient(top, #'+fgColor+', #'+bgColor+');'+
            'background-image:    -moz-linear-gradient(top, #'+fgColor+', #'+bgColor+');'+
            'background-image:      -o-linear-gradient(top, #'+fgColor+', #'+bgColor+');'+
            'background-image:         linear-gradient(to bottom, #'+fgColor+', #'+bgColor+');';
    }

    
}
