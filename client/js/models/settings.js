(function() {
    var settings = app.model.settings = {
        leftHand: m.prop(false),
        easyTouch: m.prop(false),
        easyTouchOffset: m.prop(0),
        animationSpeed: m.prop(275)
    };
   
    settings.apply = function() {
        applyCss();
    }
   
    var applyCss = function() {
        var declarations = {
            '.menu-btn': util.format('transition: background-color <<s>>ms, margin <<s>>ms;', {
                s: settings.animationSpeed()
            }),
            '.d-box': util.format('transition: height <<s>>ms;', {
                s: settings.animationSpeed()
            }),
            '.d-box-knob': util.format('transition: transform <<s>>ms;', {
                s: settings.animationSpeed()
            }),
            '.tgl-btn': util.format('transition: left <<s>>ms, transform <<s>>ms;', {
                s: settings.animationSpeed()
            }),
            '.alert': util.format('transition: all <<s>>ms ease 0s;', {
                s: settings.animationSpeed()
            }),
            '.menu-wrapper.easy-touch .menu': util.format('padding-top: <<y>>%;', {
                y: settings.easyTouchOffset()
            })
        };
        
        var style = document.createElement('style');
        style.type = 'text/css';
        style.id = 'settings-css'
        
        var css = '';
        
        for(var dec in declarations) {
            if(!declarations.hasOwnProperty(dec)) continue;
            css += dec + '{' + declarations[dec] + '}';
        }
        
        if(style.styleSheet){
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
        
        var curSettings = util.q('#' + style.id);
        
        if(curSettings) curSettings.remove();
        
        (document.head || document.getElementsByTagName('head')[0]).appendChild(style);
    }
})();