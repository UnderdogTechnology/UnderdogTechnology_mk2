var items = {
    'Home': {
        label: 'Home',
        href: '/',
        icon: 'home',
        class: 'primary',
        auth: 'any'
    },
    'Sign Up': {
        label: 'Sign Up',
        href: '/sign-up',
        icon: 'user-plus',
        class: 'primary'
    },
    'Sign In': {
        label: 'Sign In',
        href: '/sign-in',
        icon: 'sign-in',
        class: 'primary'
    },
    'Sign Out': {
        label: 'Sign Out',
        href: '/sign-out',
        icon: 'sign-out',
        class: 'primary',
        auth: 'loggedin'
    },
    'Plan.it': {
        label: 'Plan.it',
        icon: 'rocket',
        class: 'primary planit',
        slogan: 'Randomize your choice.',
        children: ['Pi-Find','Pi-Edit'],
        auth: '_admin'
    },
    'Pi-Find': {
        label: 'Find',
        href: '/plan-it/find',
        icon: 'search',
        class: 'primary planit',
        parent: 'Plan.it',
        auth: '_admin'
    },
    'Pi-Edit': {
        label: 'Edit',
        href: '/plan-it/edit',
        icon: 'pencil-square-o',
        class: 'primary planit',
        parent: 'Plan.it',
        auth: '_admin'
    }
};

app.cmp.common.menu = {
    controller: function(args) {
        var speed = 275;
        var ctrl = {
            parent: null,
            visible: args.visible || m.prop(false),
            childVisible: args.childVisible || m.prop(false),
            show: function() {
                if(!ctrl.visible()) {
                    Velocity(util.q('.menu-wrapper .overlay'), 'fadeIn', speed);
                    
                    if(app.shared.active.menu.parent)
                        ctrl.showChildren();
                    
                    ctrl.visible(true);
                }
            },
            hide: function() {
                if(ctrl.visible()) {
                    Velocity(util.q('.menu-wrapper .overlay'), 'fadeOut', speed);
                    
                    ctrl.visible(false);
                    ctrl.hideChildren();
                }
            },
            showChildren: function(item, evt) {
                if(item) {
                    ctrl.parent = item;
                    evt.preventDefault();
                }
                
                item = item || app.shared.active.menu;
                
                util.shadeElem({
                    update: '.menu-heading',
                    from: '.inverse-' + item.class.replace(' ', '.'),
                    attr: 'color',
                    percent: .1
                });
                
                ctrl.childVisible(true);
            },
            hideChildren: function() {
                ctrl.childVisible(false);
                setTimeout(function() {
                    ctrl.parent = null;
                }, speed);
            },
            getChildren: function() {
                var active = ctrl.parent || app.shared.active.menu;
                if(active.children) return active.children;
                
                if(active.parent && items[active.parent]) return items[active.parent].children;
            },
            toggle: function() {
                if (ctrl.visible()) {
                    ctrl.hide();
                } else {
                    ctrl.show();
                }
            },
            changeRoute: function(key, evt) {
                evt.preventDefault();
                ctrl.hide();
                vutil.changeRoute(key);
            }
        };
        
        app.shared.active.menu = app.shared.active.menu || items['Home'];
        app.shared.menuItems = {};
        
        app.shared.swipe.add(app.settings.hand === 'right' ? 'left' : 'right', ctrl.show);
        app.shared.swipe.add(app.settings.hand, ctrl.hide);
        
        return ctrl;
    },
    view: function(ctrl, args) {
        return m('div.menu-wrapper', [
            m('div.overlay', {
                onclick: ctrl.hide
            }),
            m('span.menu-btn.fa.fa-bars', {
                class: app.shared.active.class,
                onclick: ctrl.toggle
            }),
            m('div.menu.menu-one-' + (ctrl.visible() ? 'visible' : 'hidden'), [
                m('ul',
                    Object.keys(items).map(function(key, index) {
                        item = items[key];
                        if(item.parent || !app.model.user.hasAccess(item.auth)) return;
                        
                        app.shared.menuItems[key] = item;
                        
                        return m('li', {
                            role: 'presentation'
                        }, m('a', {
                            class: (app.shared.active.menu.label == key ? '' : 'inverse-') + item.class,
                            onclick: item.children ? ctrl.showChildren.bind(this, item) : ctrl.changeRoute.bind(this, key)
                        }, [
                            m('i.nav-icon', {
                                class: 'fa fa-' + item.icon + ' fa-lg'
                            }),
                            m('span.item-label', item.label)
                        ]))
                    })
                )
            ]),
            m('div.menu.menu-two-' + (ctrl.childVisible() ? 'visible' : 'hidden'), [
                m('div.menu-heading', {
                    class: 'inverse-' + (ctrl.parent ? ctrl.parent.class : ''),
                    onclick: ctrl.hideChildren
                }, [
                    m('i.fa.fa-chevron-left'),
                    m('span', ctrl.parent ? ctrl.parent.label : '')
                ]),
                m('ul',
                    (ctrl.getChildren() || []).map(function(key, index) {
                        item = items[key];
                        if(!app.model.user.hasAccess(item.auth)) return;
                        
                        app.shared.menuItems[key] = item;
                        
                        return m('li', {
                            role: 'presentation'
                        }, m('a', {
                            class: (app.shared.active.menu.label == key ? '' : 'inverse-') + item.class,
                            href: key,
                            onclick: ctrl.changeRoute.bind(this, key)
                        }, [
                            m('i.nav-icon', {
                                class: 'fa fa-' + item.icon + ' fa-lg'
                            }),
                            m('span.item-label', item.label)
                        ]))
                    })
                )
            ])
        ]);
    }
};