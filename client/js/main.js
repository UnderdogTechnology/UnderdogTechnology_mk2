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
        active: {}
    };
    
    var menuItems = {
        '/': {
            label: 'Home',
            href: '/',
            icon: 'home',
            class: 'primary',
            auth: 'any'
        },
        '/sign-up': {
            label: 'Sign Up',
            href: '/sign-up',
            icon: 'user-plus',
            class: 'primary'
        },
        '/sign-in': {
            label: 'Sign In',
            href: '/sign-in',
            icon: 'sign-in',
            class: 'primary'
        },
        '/sign-out': {
            label: 'Sign Out',
            href: '/sign-out',
            icon: 'sign-out',
            class: 'primary',
            auth: 'loggedin'
        },
        '/settings': {
            label: 'Settings',
            href: '/settings',
            icon: 'wrench',
            class: 'primary',
            auth: 'loggedin'
        },
        '/plan-it': {
            label: 'Plan.it',
            icon: 'rocket',
            class: 'primary planit',
            slogan: 'Randomize your choice.',
            children: ['/plan-it/find','/plan-it/edit'],
            auth: '_admin'
        },
        '/plan-it/find': {
            label: 'Find',
            href: '/plan-it/find',
            icon: 'search',
            class: 'primary planit',
            parent: '/plan-it',
            auth: '_admin'
        },
        '/plan-it/edit': {
            label: 'Edit',
            href: '/plan-it/edit',
            icon: 'pencil-square-o',
            class: 'primary planit',
            parent: '/plan-it',
            auth: '_admin'
        }
    };
    
    var layout = function(title, content) {
        return m('div.layout', {
           class: (app.model.settings.leftHand() ? 'left' : 'right') + '-hand' 
        }, [
            m(app.cmp.common.menu, {
                items: menuItems
            }),
            m('div.wrapper', [
                m('div.header', {
                    class:  menuItems[m.route()].class
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
            controller: function() {
                if(!app.model.user.hasAccess(menuItems[m.route()].auth)) {
                    m.route('/');
                }
            },
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
                '/sign-up': r('Sign Up', cmp.signUp),
                '/sign-in': r('Sign In', cmp.signIn),
                '/sign-out': r('Sign In', cmp.signIn, {
                    signOut: true
                }),
                '/settings': r('Settings', cmp.settings),
                '/plan-it/find': r('Find', cmp.planIt.find)
            });
        })
    }
    
    var dependencies = {
        // MODELS
        models: [
            // UNDERDOG
            'user', 'settings'
        ],
        // COMPONENTS
        components: [
            // PLAN.IT
            'plan-it/find',
            // COMMON
            'common/menu', 'common/alert', 'common/detail-box', 'common/switch', 'common/slider',
            // UNDERDOG
            'home', 'sign-up', 'sign-in', 'settings'
        ]
    };
    
    var count = 0;
    
    var done = function(){
        if(++count == Object.keys(dependencies).length) {
            loadRoutes();
            app.model.settings.apply();
        }
    };
    
    app.cmp = {
        common: {},
        planIt: {}
    };
    
    app.model = {};
    
    // load modules
    for(var dep in dependencies) {
        if(dependencies.hasOwnProperty(dep) && dependencies[dep].length)
            app.loadModules('/js/' + dep + '/', dependencies[dep], done);
    }
}());
