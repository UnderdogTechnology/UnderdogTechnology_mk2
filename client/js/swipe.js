(function() {
    var startX;
    var startY;
    var distX;
    var distY;
    var maxTime = 300;
    var threshold = 100;
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
        
        for(var dir in swipe) {
            if(swipe.hasOwnProperty(dir) && swipe[dir] && commands.hasOwnProperty(dir)) {
                commands[dir]();
                m.redraw();
            }
        }
    });
    
    app.shared.swipe = {
        add: function(dir, cb) {
            commands[dir] = cb;
        }
    }
    
})();