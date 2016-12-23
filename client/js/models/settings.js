(function() {
   var settings = app.model.settings = {
       leftHand: m.prop(false),
       easyTouch: m.prop(false),
       animationSpeed: m.prop(275)
   };
   
   settings.apply = function() {
       applyCss();
   }
   
    var applyCss = function() {
        var declarations = {
            '.menu': util.format('transition: left <<s>>ms, right <<s>>ms;', {
                s: app.model.settings.animationSpeed()
            }),
            '.menu-btn': util.format('transition: background-color <<s>>ms, margin <<s>>ms;', {
                s: app.model.settings.animationSpeed()
            }),
            '.d-box': util.format('transition: height <<s>>ms;', {
                s: app.model.settings.animationSpeed()
            }),
            '.d-box-knob': util.format('transition: transform <<s>>ms;', {
                s: app.model.settings.animationSpeed()
            }),
            '.tgl-btn': util.format('transition: left <<s>>ms, transform <<s>>ms;', {
                s: app.model.settings.animationSpeed()
            }),
            '.alert': util.format('transition: all <<s>>ms ease 0s;', {
                s: app.model.settings.animationSpeed()
            })
        };
        
        var style = document.createElement('style');
        style.type = 'text/css';
        
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
        
        (document.head || document.getElementsByTagName('head')[0]).appendChild(style);
    }
})();