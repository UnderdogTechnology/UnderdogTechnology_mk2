(function() {
    var startX;
    var startY;
    var distX;
    var distY;
    var lastX;
    var lastY;
    var maxTime = 300;
    var threshold = 100;
    var restraint = 80;
    var startTime;
    
    var commands = {};
    var swipe = {};
    var command;
        
    window.addEventListener('touchstart', function(e) {
        var touch = e.changedTouches[0];
        startX = lastX = touch.pageX;
        startY = lastY = touch.pageY;
        startTime = Date.now();
    });
    
    window.addEventListener('touchmove', function(e) {
        var touch = e.changedTouches[0];
        
        var dragX = touch.pageX;
        var dragY = touch.pageY;
        
        distX = dragX - startX;
        distY = dragY - startY;
        
        swipe = {
            left: dragX < startX,
            right: dragX > startX,
            up: dragY < startY,
            down: dragY > startY
        };
        
        swipe.bLtoTr = swipe.up && swipe.right;
        swipe.bRtoTl = swipe.up && swipe.left;
        
        swipe.tLtoBr = swipe.down && swipe.right;
        swipe.tRtoBl = swipe.down && swipe.left;
        
        for(var key in commands) {
            if(!commands.hasOwnProperty(key)) continue;
            
            var dir = commands[key].direction;
            
            if(!swipe.hasOwnProperty(dir) || !swipe[dir]) continue;
            
            command = commands[key];
            
            /*
                TODO: remove this tester check
            */
            if(!app.model.user.hasAccess('_admin')) return;
                
            if(command.drag && command.drag.selector)  {
                var drag = command.drag;
                var elem = util.q(drag.selector);
                var rect = elem.getBoundingClientRect();
                
                if(dragY > rect.bottom + restraint || dragY < rect.top - restraint) return;
                if(dragX > rect.right + restraint || dragX < rect.left - restraint) return;
                var drag = command.drag;
                
                if(drag[dir]) {
                    if(drag[dir].xMax && dragX > drag[dir].xMax) return;
                    if(drag[dir].xMin && dragX < drag[dir].xMin) return;
                    
                    if(drag[dir].yMax && dragY > drag[dir].yMax) return;
                    if(drag[dir].yMin && dragY < drag[dir].yMin) return;
                    
                    var vIn = {};
                    var update = drag[dir].update || dir;
                    
                    switch(update) {
                        case 'left':
                        case 'right':
                            if(dir === update) {
                                vIn[update] = (Math.max(Math.min(elem.style[update].replace('px', '') - Math.abs(dragX - lastX), drag[dir].xMax), drag[dir].xMin)) + 'px';
                            } else {
                                vIn[update] = (Math.max(Math.min(Math.abs(dragX - startX) + drag[dir].xMin, drag[dir].xMax), drag[dir].xMin)) + 'px';  
                            }
                            break;
                        case 'up':
                        case 'down':
                            if(dir === update) {
                                vIn[update] = (Math.max(Math.min(elem.style[update].replace('px', '') - Math.abs(dragY - lastY), drag[dir].yMax), drag[dir].yMin)) + 'px';
                            } else {
                                vIn[update] = (Math.max(Math.min(Math.abs(dragY - startY) + drag[dir].yMin, drag[dir].yMax), drag[dir].yMin)) + 'px';
                            }
                            break;
                    }
                    Velocity(elem, vIn, 0);
                }
            }
                
            lastX = dragX;
            lastY = dragY;
            
            return;
        }
    });
    
    window.addEventListener('touchend', function(e) {
        var touch = e.changedTouches[0];
        
        if(!command) return;
        if(Date.now() - startTime > maxTime && !command.drag) return;
        
        if(command.ignore) {
            var classList = e.target.classList; 
            for(var i in classList) {
                if(classList.hasOwnProperty(i) && command.ignore.indexOf(classList[i])  > -1) return;
            }
        }
        
        switch(command.direction) {
            case 'left':
            case 'right':
                if((distY < -threshold || distY > threshold) && (swipe.up || swipe.down)) return;
                if(distX > -threshold && distX < threshold) {
                    if(command.drag && command.drag.cancel) command.drag.cancel();
                    return;   
                }
                break;
            case 'up':
            case 'down':
                if((distX < -threshold || distX > threshold) && (swipe.left || swipe.right)) return;
                if(distY > -threshold && distY < threshold) {
                    if(command.drag && command.drag.cancel) command.drag.cancel();
                    return;
                };
                break;
        }
        
        if(command.selector)  {
            var elem = util.q(command.selector);
            var rect = elem.getBoundingClientRect();
            
            if(startY > rect.bottom + restraint || startY < rect.top - restraint) return;
            if(startX > rect.right + restraint || startX < rect.left - restraint) return;
        }
        
        command.callback();
        
        m.redraw();
    
        command = null;
        return;
    });
    
    app.shared.swipe = {
        add: function(key, obj) {
            commands[key] = obj;
        }
    }
    
})();