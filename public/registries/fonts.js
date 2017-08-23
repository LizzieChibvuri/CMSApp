class fontRegistry{
	
	constructor()
	{
		this.basePath = 'mediaAssets/fonts/';
		this.fonts = {};

		this.fonts['Zilla'] = {path: 'Zilla_Slab/ZillaSlab-Regular.ttf'};
		this.fonts['Roboto'] = {path: 'Roboto_Condensed/RobotoCondensed-Regular.ttf'};
	}

	loadFont(id)
    {
    	$("head").prepend('@font-face {font-family: "'+id+'"; src: local("☺"),url('+this.basePath+this.fonts[id].path+') format("truetype");}');
    }
    
}
