    /*
        $('form').jukForm({
            data: {
                name:'Vasiy',
                lastname:'Petrov'
           }                
        });
    */
   
    /**
     * 
     * @param {type} conf
     * @returns {jQuery.fn@call;each}
     */
    jQuery.fn.jukForm = function (conf) 
    { 
        return this.each(function () 
        {
            var $form = jQuery(this);
            
            /**
             * Инициализация дефолтных значений
             */
            var default_config = {
                start_load:true,
                url: $form.attr('action'),
                update_url: $form.attr('action'),
                method: $form.attr('method'),
                data: function($form){
                    return $form.serializeArray();
                },
                success: function(data){
                    iniForm(data);
                },
                event_pre_set_input: function (input, index, value){
                    return true;
                },
                event_pre_add_class_error: function(input, index, value){
                    return true;
                },
                event_pre_add_class_success: function(input, index, value){
                    return true;
                },
                event_pre_remove_class: function(index, value){
                    return true;
                },
                event_update_success: function(index, value){
                    return true;
                },
                event_update_error: function(index, value){
                    return true;
                },
                event_run_ajax: function(){/**/},
                event_complete_ajax: function(){/**/},
                calss_error: 'uk-form-danger',
                calss_success: 'uk-form-success'                
            };
            /**
             * Замещение дефолтных значений значениями переданми в функцию
             */
            var config = jQuery.extend( default_config , conf);
            /**
             * загружаем данные в форму
             * 
             * @param {type} data
             * @returns {undefined}
             */
            var iniForm = function (data){
                jQuery.each(data, function(index, value){
                    var input = jQuery($form).find('[name="'+index+'"]');
     
                    if (input.get(0) !== undefined)
                    {
                        if (input.get(0).tagName === 'INPUT')
                        {
                            if (config.event_pre_set_input(input,index, value))
                            {
                                if (input.attr('type') == 'checkbox')
                                {
                                    if (value)
                                    {
                                        input.attr('checked','checked');
                                    }
                                }
                                else
                                input.val(value);
                                
                            }
                        }
                        
                        if (input.get(0).tagName === 'SELECT')
                        {
                            if (config.event_pre_set_input(input,index, value))
                            {
                                input.val(value);
                            }
                        }
                        
                        if (input.get(0).tagName === 'TEXTAREA')
                        {
                            if (config.event_pre_set_input(input,index, value))
                            {
                                input.html(value);
                            }
                        }
                    }
                });
            }
            
           
            /**
             * Если небыли переданы дание для загрузки в форму в саму функцию то делаем запрос на сервер
             */
            if (config.start_load === true)
            {
                if (config.data === undefined )
                {
                    jQuery.ajax({
                        type: config.method,
                        url: config.url,
                        data: $form.serializeArray(),
                        dataType: 'json',
                        beforeSend : function(){
                            config.event_run_ajax();
                        },
                        complete: function(){
                            config.event_complete_ajax();
                        },
                        success: config.success
                    });
                }
                else
                {
                    iniForm(config.data);
                }
            }
            /**
             * Обробатываем отправку формы
             */
            jQuery(this).submit(function () 
            {
                var allInput = jQuery($form).find('[name]');
                    
                jQuery.each(allInput, function(index,value){
                    if (config.event_pre_remove_class(index, value))
                    {
                        jQuery(value).removeClass(config.calss_error);
                        jQuery(value).removeClass(config.calss_success);
                    }
                });
                
                $.ajax({
                    type: config.method,
                    url: config.submit_url,
                    data: config.data($form),
                    dataType: 'json',
                    beforeSend: function(){
                        config.event_run_ajax();
                    },
                    complete: function(){
                        config.event_complete_ajax();
                    }
                }).done(function(json){
                    
                    config.event_complete_ajax();
                    
                    if (json.error)
                    {
                        if (config.event_update_error(json))
                        {
                            jQuery.each(json.fields, function(index, value)
                            {
                                var input = jQuery($form).find('[name="'+index+'"]');
                                if (config.event_pre_add_class_error(input,index, value))
                                {
                                    input.addClass(config.calss_error);
                                }
                            });
                        }
                    }
                    else
                    {
                        if (config.event_update_success(json))
                        {
                            jQuery.each(json, function(index, value)
                            {
                                var input = jQuery($form).find('[name="'+index+'"]');
                                if (config.event_pre_add_class_success(input,index, value))
                                {
                                    input.addClass(config.calss_success);
                                }
                            });
                        }
                    }
                    
                });
                return false;
            });
            
        });
    };