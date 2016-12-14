/* global util,m */
(function() {
    var app = window.app = window.app || {};
    
    var db = app.db = {
        local: new PouchDB('localdb', {skipSetup: true}),
        remote: new PouchDB('http://' + (location.host || 'localhost').split(':')[0] + ':5984/remotedb', {skipSetup: true}),
        connected: true
    };
    
    db.remote.info().then(function() {
        db.local.sync(db.remote, {live: true, retry: true}).on('error', console.log.bind(console));
    }).catch(function(){
        db.connected = false;
    });
    
    app.shared = {
        active: {
            class: 'primary'
        }
    };
    
    app.settings = {
        hand: 'right'
    }
    
    var layout = function(title, content) {
        return m('div.layout', {
           class: app.settings.hand + '-hand' 
        }, [
            m(app.cmp.common.menu, {}),
            m('div.wrapper', [
                m('div.header', {
                    class: app.shared.active.class
                }, [
                    m('span', title)
                ]),
                m('div.content', content),
                m('div.loading',
                    m('img', {
                        src: '/images/loading.gif'
                    })
                )
            ]),
            m(app.cmp.common.alert, {})
        ])
    };
    
    var r = function(title, component, args) {
        return {
            controller: function() {},
            view: function(ctrl) {
                var cmp = m(component, args || {});
                
                return layout(title, cmp);
            }
        }
    }
    
    var loadRoutes = function() {
        app.model.user.restoreUser().then(function() {
            var cmp = app.cmp;
            
            m.route.mode = 'pathname';
            
            m.route(document.body, '/', {
                '/': r('Home', cmp.home),
                '/sign-in': r('Sign In', cmp.signIn),
                '/sign-out': r('Sign In', cmp.signIn, {
                    signOut: true
                })
            });
        })
    }
    
    var dependencies = {
        // MODELS
        models: [
            // UNDERDOG
            'user'
        ],
        // COMPONENTS
        components: [
            // COMMON
            'common/menu', 'common/alert',
            // UNDERDOG
            'home', 'sign-in'
        ]
    };
    
    var count = 0;
    
    var done = function(){
        if(++count == Object.keys(dependencies).length) {
            loadRoutes();
        }
    };
    
    app.cmp = {
        common: {}
    };
    
    app.model = {};
    
    // load modules
    for(var dep in dependencies) {
        if(dependencies.hasOwnProperty(dep) && dependencies[dep].length)
            app.loadModules('/js/' + dep + '/', dependencies[dep], done);
    }
}());
