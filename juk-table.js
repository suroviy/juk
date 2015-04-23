jQuery.fn.jukTable = function (action, conf) 
{
    if (action === 'reload') 
    {        
        return this.each(function () 
        {
            var $form = $(this);
            
            var config = jQuery.extend({
                url: $form.attr('data-x-url'),
                event_run_ajax: function () {/**/},
                event_complete_ajax: function () {/**/}
            }, conf);

            jQuery.ajax({
                type: 'POST',
                url: config.url,
                dataType: 'html',
                success : function(data){
                    config.event_complete_ajax();
                    $form.find('tbody').html(data);
                },
                beforeSend : function(){
                    config.event_run_ajax();
                },
                complete: function(){
                    ///config.event_complete_ajax();
                },
            });
           
        });
    }
}