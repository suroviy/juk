juk = {};
juk.var = {};
juk.event = {};

juk.var.loadJsCss = {};
juk.var.loadJsCss.urlMap = {};

juk.loadJsCss = function (url){
    var d = $.Deferred();
    if (juk.var.loadJsCss.urlMap[url] === undefined)
    {
        juk.var.loadJsCss.urlMap[url] = url;
        yepnope.injectJs(juk.var.loadJsCss.urlMap[url],function(){
              d.resolve();
        });
    }
    else
    {
        d.resolve();
    }
    return d;
};


juk.str_replace = function (search, replace, string)
{
	// 1. все должно быть массивами
	search = [].concat(search);
	replace = [].concat(replace);

	// 2. выровнять массивы
	var len = replace.length - search.length;

	var p_last = search[search.length - 1];

	// 2.1. если массив строк поиска короче
	for (var i = 0; i < len; i++) {
		search.push(p_last);
	}

	// 2.2. если массив строк замены короче
	for (var i = 0; i < -len; i++) {
		replace.push('');
	}

	// 3. непосредственная замена
	var result = string;
	for (var i = 0; i < search.length; i++) {
		result = result.split(search[i]).join(replace[i]);
	}
	return result;
};

jQuery.fn.jukControllers = function ($actions,$func)
{
    
    return this.each(function ()
    {
        var $container = $(this);
        
        var $action = function ($value,$el) {
            var action = function() {
                this.container = $container;
                this.el = $el;
                this.func = $func;
                this.actions = $actions;
                this.action = $value.func;
            }
            return new action();
        }
        
        jQuery.each($actions, function(index, value){
            
            if (value.ini) {
                var a = $action(value,$container);
                a.action();
            }
            
            if (value.event) {
                juk.event[value.event] = $action(value,$container);
                //a.action();
            }

            if (value.click) {
                jQuery.each(value.click, function(i, v){
                    $( $container ).on( "click", v, function() {
                        var a = $action(value,$(this));
                        return a.action();
                    });            
                });
            }
            
        });
    });
}