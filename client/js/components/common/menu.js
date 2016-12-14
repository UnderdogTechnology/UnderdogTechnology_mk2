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
                    
                    if(app.shared.active.menu.parent) {
                        ctrl.parent = args.items[app.shared.active.menu.parent];
                        ctrl.showChildren();
                    }
                    
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
                
                if(active.parent && args.items[active.parent]) return args.items[active.parent].children;
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
        
        app.shared.active.menu = app.shared.active.menu || args.items[m.route()];
        app.shared.active.class = app.shared.active.menu.class;
        app.shared.menuItems = {};
        
        app.shared.swipe.add(app.model.settings.leftHand ? 'left' : 'right', ctrl.show);
        app.shared.swipe.add(app.model.settings.leftHand ? 'right' : 'left', ctrl.hide);
        
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
                    Object.keys(args.items).map(function(key, index) {
                        item = args.items[key];
                        if(item.parent || !app.model.user.hasAccess(item.auth)) return;
                        
                        app.shared.menuItems[key] = item;
                        
                        return m('li', {
                            role: 'presentation'
                        }, m('a', {
                            class: (app.shared.active.menu.href === key || app.shared.active.menu.parent === key ? '' : 'inverse-') + item.class,
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
                        item = args.items[key];
                        if(!app.model.user.hasAccess(item.auth)) return;
                        
                        app.shared.menuItems[key] = item;
                        
                        return m('li', {
                            role: 'presentation'
                        }, m('a', {
                            class: (app.shared.active.menu.href == key ? '' : 'inverse-') + item.class,
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