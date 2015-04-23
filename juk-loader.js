/*    
if (typeof qb === "undefined") 
{
    qb = {};
};

qb.qLoader = {};
qb.qLoader.config = {};
*/
jQuery.fn.jukLoader = function (action, conf) 
{
    if (action === 'set') 
    {        
        //var config = jQuery.extend(qb.qLoader.config, conf);

        return this.each(function () 
        {
              var el = jQuery(this);
            
            config = jQuery.extend({
                className: 'x-loader',
                pathImageLoader: '/bower_components/juk/juk-loader/loader.gif'
            }, conf);
            
            var offset = el.offset();
            var dim = {
                left: offset.left,
                top: offset.top,
                width: el.outerWidth(),
                height: el.outerHeight()
            };
            
            if (!this.ajaxLoaderObject) 
            {
                this.ajaxLoaderObject = jQuery('<div class="' + config.className + '"></div>').css({
                    position: 'absolute',
                    left: dim.left + 'px',
                    top: dim.top + 'px',
                    width: dim.width + 'px',
                    height: dim.height + 'px'
                }).appendTo(document.body).hide();
               
                $('div.'+config.className).css({
                    background: '#F6FBFF   url('+config.pathImageLoader+' ) no-repeat 50% 50%',
                    opacity: '.6',
                    'z-index': '1040'
                });
            } 
            else 
            {
                this.ajaxLoaderObject.css({
                    position: 'absolute',
                    left: dim.left + 'px',
                    top: dim.top + 'px',
                    width: dim.width + 'px',
                    height: dim.height + 'px'
                });
            }
            this.ajaxLoaderObject.fadeIn();
        });
    }

    if (action === 'remove') 
    {
        return this.each(function () 
        {
            if (this.ajaxLoaderObject) 
            {
                this.ajaxLoaderObject.fadeOut();
            }
        });
    }
};