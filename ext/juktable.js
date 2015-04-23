function jukTable (_conf) {

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