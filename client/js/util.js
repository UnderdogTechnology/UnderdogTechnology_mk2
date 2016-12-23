/* global m,localStorage */
/**
 ** Generic Utilities
 **/
 
var util = {
    q: function(q, c) {
        return (c || document).querySelector(q);
    },
    qq: function(q, c) {
        return [].slice.call((c || document).querySelectorAll(q));
    },
    parent: function(elem, sel) {
        count = 0;
        while(elem == null || count >= 10 || '.' + elem.className != sel) {
            elem = elem.parentNode;
            count++;
        }
        return elem;
    },
    extend: function(aObj, bObj, overwrite) {
        if(Array.isArray(aObj) && !Array.isArray(bObj)) {
                aObj.push(bObj);
        }
        else {
            for(var key in bObj)
            {
                if(Array.isArray(aObj)) {
                    aObj.push(bObj[key]);
                } else if(bObj.hasOwnProperty(key) && (!aObj.hasOwnProperty(key) || overwrite)) {
                    aObj[key] = bObj[key];
                }

            }
        }
        return aObj;
    },
    random: function(obj, cb) {
        var keys = Object.keys(obj),
        ranNum = Math.floor(Math.random() * keys.length);
        if(cb){
            return cb(obj[keys[ranNum]], keys[ranNum], ranNum, obj);
        }
        return obj[keys[ranNum]];
    },
    format: function(string, obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                string = string.replace(new RegExp('<<' + key + '>>', 'g'), obj[key]);
            }
        }
        return string;
    },
    shadeElem: function(args) {
        if(!args || !args.update || !args.attr) return false;
        var update = args.update;
        var from = args.from;
        
        if(typeof update === 'string') update = util.q(args.update);
        if(typeof from === 'string') from = util.q(args.from);
        
        var color = args.color || window.getComputedStyle(from || update)[args.attr];
        
        if(!color) return false;
        
        update.style.background = color.replace('rgb','rgba').replace(')', ',' + (args.percent || .1) + ')');
        
        return true;
    }
};

/**
 ** Velocity Specific Utilities
 **/
 
 var vutil = {
    changeRoute: function(id) { 
        var header = util.q('.header span');
        
        var item = app.shared.menuItems[id];
            
        Velocity(util.q('.content'), 'fadeOut', app.model.settings.animationSpeed())
        Velocity(util.q('.loading'), 'fadeIn', app.model.settings.animationSpeed())
        util.q('.header').className = 'header ' + item.class;
        util.q('.menu-btn').className = 'menu-btn fa fa-bars ' + item.class;
        Velocity(header, {
                fontSize: 0
            }, app.model.settings.animationSpeed()).then(function(el) {
                
            el[0].textContent = item.name;
            Velocity(el[0], 'reverse', app.model.settings.animationSpeed()).then(function() {
                m.route(item.href);
            });
        });
        
        app.shared.active.menu = item;
        app.shared.active.class = item.class;
    }    
 }
 ;
 
/**
 ** Mithril Specific Utilities
 **/
var mutil = {
    convertRating: function(rating) {
        var i = 0,
            arr = [];

        while (i < 5) {
            arr[arr.length] = m('i', {
                class: (i < rating ? 'fa fa-star' : 'fa fa-star o')
            });
            i++;
        }
        return arr;
    },
    formGroup: function(attrs, children) {
        return m('div.pure-control-group', attrs, children);
    },
    formControls: function(attrs, children) {
        return m('div.pure-controls', attrs, children);
    },
    icon: function(name, children) {
        return m('i.fa.fa-' + name, children);
    },
    withValidate: function(attr, type, prop, submit) {
        return function(evt) {
            var value = evt.target.value;
            prop(value);
            if(!value && !submit) return;
            var status = util.isValid(type, value);
            if(status && !status.isValid) {
                app.shared.alert.add({ type: 'error', message: status.message, icon: 'fa-pencil'});
            }
        };
    }
};

// reusable config attrs
mutil.c = {
    autofocus: function(elem, isInit) {
        elem.focus();
    }
};

/**
 ** Enumerators
 **/

var eutil = function(e, filter) {
    this.costs = [
        {
            'id': 1,
            'name': 'Free'
        }, {
            'id': 2,
            'name': 'Cheap'
        }, {
            'id': 3,
            'name': 'Pricey'
        }
    ];

    var tmp = this[e];

    if(filter) {
        tmp = tmp.filter(function(obj) {
            for(var f in filter) {
                return filter.hasOwnProperty(f) && obj.hasOwnProperty(f) && filter[f] == obj[f];
            }
        });
    }
    return tmp || [];
};