lara = {};    
lara.table = function(conf) {
    
    var $_move = {};
    var $_url_controller = conf.url_controller;
    var $_token = conf.token;
    
    var _move = function (source,target,point) {
        var d = $.Deferred();

        jQuery.ajax({
            type: 'POST',
            url: $_url_controller+'/dnd/?source='+source+'&target='+target+'&point='+point+'&_token=' + $_token,
            dataType: 'json'
        }).done(function (data) {
            juk.event.reload_table.action();
        }).fail(function (data) {
            juk.event.reload_table.action();
        });
        return d;
    }
    
    
    var jukTable = function(_conf) {

        var _tpl = null;
        var _fields = _conf.fields;
        var _rows = 'rows';
        var _table = $(_conf.el);
        var _el = _conf.el;
        var _url = _conf.url;
        var _token = _conf.token;
        var _success = {}

        var _view = function (value) {

            if (_tpl == undefined)
            {
                _tpl = _table.find('tbody').html();
            }

            _table.find('tbody').empty();
            
            if (_tpl == undefined)
            {
                alert('no tpl');
            }

            jQuery.each(value, function (index, val) {
                var tpl_val = [];
                var tpl_key = [];

                jQuery.each(_fields, function (i, v) {
                    tpl_key.push('[[' + i + ']]');
                    tpl_val.push(v(val));
                });

                rezult = juk.str_replace(tpl_key, tpl_val, _tpl);
                _table.find('tbody').append(rezult);
                
                if($_move.source !== undefined){
                    /*Нужно переделать*/
                    _table.find('.uk-icon-cut').removeClass('uk-icon-cut').addClass('uk-icon-paste');
                }
                
            });
        }

        this.table_load = function (id) {
            var d = $.Deferred();

            jQuery.ajax({
                type: 'POST',
                url: _url + id + '?_token='+ _token,
                dataType: 'json'
            }).done(function (data) {

                _success = data;
                _view(data[_rows]);
                d.resolve();     

            }).fail(function (data) {

            });
            return d;
        }

        this.set_tpl = function (tpl) {
            _tpl = tpl;
        }

        this.set_fields = function (fields) {
            _fields = fields;
        }

        this.set_rows = function (rows) {
            _rows = rows;
        }

        this.success = function (){
            return _success;
        }
    }
    
    
    $(conf.el).jukControllers({
        load: {
            func: function(){

                _tpl = this.container.find('tbody').html();
                $('#table').find('tbody').empty();
                this.func.set_tpl( _tpl );
                
                var func = this.func;
                var container = this.container;
                
                var id = this.el.attr('data-table-parent');
                container.find('[data-table-reload]').attr('data-table-parent',id);
  
                $.when(
                    juk.loadJsCss('/bower_components/juk/juk-loader.js')
                ).done(function () {
                    container.jukLoader('set');
                    
                    var def = func.table_load(id);
                    
                    def.done(function(){
                        container.jukLoader('remove');
                    });
                    
                    container.find('[data-table-reload]').attr('data-table-parent',id);
                });
                return false;
            },
            ini: true
        },
        reload_table: {
            func: function(){
                var container = this.container;
                var func = this.func;
                
                var id = container.find('[data-table-reload]').attr('data-table-parent');
                
                $.when(
                    juk.loadJsCss('/bower_components/juk/juk-loader.js')
                ).done(function () {
                    container.jukLoader('set');
                    var def = func.table_load(id);               
                    def.done(function(){ 
                        container.jukLoader('remove');
                    });                
                });
                
            },
            event:'reload_table'
        },
        load_down_folder: {
            func: function(){
                var func = this.func;
                var container = this.container;
                
                var id = this.el.attr('data-table-parent');
                if (id === undefined) {
                    id = 0;
                }
                
                $.when(
                    juk.loadJsCss('/bower_components/juk/juk-loader.js')
                ).done(function () {
                    container.jukLoader('set');

                    var def = func.table_load(id);               
                    def.done(function(){ 
                        container.jukLoader('remove');
                        var data = func.success();
                        container.find('[data-table-up]').attr('data-table-parent',data.parent_up);
                        container.find('[data-table-reload]').attr('data-table-parent',id);
                    });                
                });
                return false;
            },
            click: ['[data-table-parent]']
        },
        move: {
            func: function () {
                
                if ($_move.source === undefined) {
                    $_move.source = this.el.attr('data-table-move');
                }
                else {
                    var move = this.el.attr('data-table-move');
                    if (move != $_move.source) {
                        $_move.target = move;
                    }
                }
                
                if ($_move.target !== undefined) {
                    //_move($_move.source,$_move.target);
                    //$_move = {};
                    
                    var modal = UIkit.modal("[data-table-move-modal]");
                    modal.show();
                    
                    
                }
                this.container.find('[data-table-move-panel]').show();
                this.container.find('.uk-icon-cut').removeClass('uk-icon-cut').addClass('uk-icon-paste');
                
            },
            click: ['[data-table-move]']
        },
        move_ajax: {
            func: function () {
                
                var point = this.el.attr('data-table-move-method');
                
                if (point === 'this-append'){
                    point = 'append';
                    $_move.target = this.container.find('[data-table-reload]').attr('data-table-parent');
                }
                
                if (point === 'clear'){
                    $_move = {};
                    this.container.find('[data-table-move-panel]').hide();
                    this.container.find('.uk-icon-paste').removeClass('uk-icon-paste').addClass('uk-icon-cut');
                }
                else{
                    _move($_move.source,$_move.target,point);
                    $_move = {};
                    this.container.find('[data-table-move-panel]').hide();
                    var modal = UIkit.modal("[data-table-move-modal]");
                    modal.hide();
                }    
                
                
                
                //this.container.find('[data-table-move-panel]').html(this.el.attr('data-table-move'));
            },
            click: ['[data-table-move-method]']
        }
    },new jukTable(conf));
}