(function() {
    var startX;
    var startY;
    var distX;
    var distY;
    var maxTime = 300;
    var threshold = 100;
    var restraint = 80;
    var startTime;
    
    var commands = {};
        
    window.addEventListener('touchstart', function(e) {
        var touch = e.changedTouches[0];
        startX = touch.pageX;
        startY = touch.pageY;
        startTime = Date.now();
    });
    
    window.addEventListener('touchend', function(e) {
        if(Date.now() - startTime > maxTime) return;
        var touch = e.changedTouches[0];
        var distX = touch.pageX - startX;
        var distY = touch.pageY - startY;
        
        var swipe = {
            left: distX < (threshold * -1),
            right: distX > threshold,
            up: distY < (threshold * -1),
            down: distY > threshold
        };
        
        swipe.bLtoTr = swipe.up && swipe.right;
        swipe.bRtoTl = swipe.up && swipe.left;
        
        swipe.tLtoBr = swipe.down && swipe.right;
        swipe.tRtoBl = swipe.down && swipe.left;
        
        for(var dir in swipe) {
            if(swipe.hasOwnProperty(dir) && swipe[dir] && commands.hasOwnProperty(dir)) {
                switch(dir) {
                    case 'left':
                    case 'right':
                        if(swipe.up || swipe.down) return;
                        break;
                    case 'up':
                    case 'down':
                        if(swipe.left || swipe.right) return;
                        break;
                }
                
                if(commands[dir].selector)  {
                    
                    /* 
                        TODO: add animation
                    */
                    
                    var rect = util.q(commands[dir].selector).getBoundingClientRect();
                    
                    if(startY > rect.bottom + restraint || startY < rect.top - restraint) return;
                    if(startX > rect.right + restraint || startX < rect.left - restraint) return;
                }
                
                commands[dir].callback();
                m.redraw();
            }
        }
    });
    
    app.shared.swipe = {
        add: function(dir, obj) {
            commands[dir] = obj;
        }
    }
    
})();