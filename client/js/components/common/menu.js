app.cmp.common.menu = {
    controller: function(args) {
        var ctrl = {
            parent: null,
            visible: args.visible || m.prop(false),
            childVisible: args.childVisible || m.prop(false),
            show: function() {
                var vIn = {}
                
                vIn[app.model.settings.leftHand() ? 'left' : 'right'] = '0px';
                
                if(!ctrl.visible()) {
                    Velocity(util.q('.menu-wrapper .overlay'), 'fadeIn', app.model.settings.animationSpeed());
                    if(app.shared.active.menu.parent) {
                        ctrl.parent = args.items[app.shared.active.menu.parent];
                        ctrl.showChildren();
                    }
                    
                    ctrl.visible(true);
                }
                
                Velocity(util.q('.menu-one'), vIn, app.model.settings.animationSpeed())
            },
            hide: function() {
                var vIn = {}
                
                vIn[app.model.settings.leftHand() ? 'left' : 'right'] = '-300px';
                
                if(ctrl.visible()) {
                    Velocity(util.q('.menu-wrapper .overlay'), 'fadeOut', app.model.settings.animationSpeed());
                    
                    ctrl.visible(false);
                    ctrl.hideChildren();
                }
                
                Velocity(util.q('.menu-one'), vIn, app.model.settings.animationSpeed());
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
                
                var vIn = {}
                
                //util.q('.menu-one').removeAttribute('style')
                vIn[app.model.settings.leftHand() ? 'left' : 'right'] = '0px';
                
                Velocity(util.q('.menu-two'), vIn, app.model.settings.animationSpeed());
                
                ctrl.childVisible(true);
            },
            hideChildren: function() {
                var vIn = {}
                
                //util.q('.menu-one').removeAttribute('style')
                vIn[app.model.settings.leftHand() ? 'left' : 'right'] = '-300px';
                
                Velocity(util.q('.menu-two'), vIn, app.model.settings.animationSpeed());
                
                ctrl.childVisible(false);
                setTimeout(function() {
                    ctrl.parent = null;
                }, app.model.settings.animationSpeed());
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
            },
            apply: function() {
                /*
                    TODO: make active.menu and ctrl.parent refer to key instead of full obj
                */
                app.shared.active.menu = args.items[m.route()];
                app.shared.menuItems = {};
                
                var left = app.model.settings.leftHand() ? 'left' : false;
                var selectedMenu = (ctrl.getChildren() || []).length ? '.menu-two' : '.menu-one';
                
                if((ctrl.getChildren() || []).length) {
                    /*app.shared.swipe.add(left ? 'right' : 'left', {
                        callback: ctrl.show,
                        selector: '.menu-two',
                        ignore: '.menu-btn .overlay',
                        drag: {
                            cancel: ctrl.hideChildren,
                            selector: '.menu-two',
                            left: {
                                xMin: -300,
                                xMax: 0,
                                update: left || 'right'
                            },
                            right: {
                                xMin: -300,
                                xMax: 0,
                                update: left || 'right'
                            }
                        }
                    });
                    
                    app.shared.swipe.add(left || 'right', {
                        callback: ctrl.hideChildren,
                        drag: {
                            cancel: ctrl.show,
                            selector: '.menu-two',
                            left: {
                                xMin: -300,
                                xMax: 0,
                                update: left || 'right'
                            },
                            right: {
                                xMin: -300,
                                xMax: 0,
                                update: left || 'right'
                            }
                        }
                    });*/
                } else {
                    app.shared.swipe.add('show-menu', {
                        direction: left ? 'right' : 'left',
                        callback: ctrl.show,
                        selector: '.menu-one',
                        ignore: '.menu-btn .overlay',
                        drag: {
                            cancel: ctrl.hide,
                            selector: '.menu-one',
                            left: {
                                xMin: -300,
                                xMax: 0,
                                update: left || 'right'
                            },
                            right: {
                                xMin: -300,
                                xMax: 0,
                                update: left || 'right'
                            }
                        }
                    });
                    
                    app.shared.swipe.add('hide-menu', {
                        direction: left || 'right',
                        callback: ctrl.hide,
                        drag: {
                            cancel: ctrl.show,
                            selector: '.menu-one',
                            left: {
                                xMin: -300,
                                xMax: 0,
                                update: left || 'right'
                            },
                            right: {
                                xMin: -300,
                                xMax: 0,
                                update: left || 'right'
                            }
                        }
                    });
                }
            }
        };
        
        return ctrl;
    },
    view: function(ctrl, args) {
        ctrl.apply();
        
        return m('div.menu-wrapper', {
                class: app.model.settings.easyTouch() ? 'easy-touch' : ''
            }, [
            m('div.overlay', {
                onclick: ctrl.hide
            }),
            m('span.menu-btn.fa.fa-bars', {
                class: app.shared.active.menu.class,
                onclick: ctrl.toggle
            }),
            m('div.menu.menu-one.menu-one-' + (ctrl.visible() ? 'visible' : 'hidden'), [
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
                            m('span.item-label', item.label),
                            (item.children ? m('i.fa.fa-chevron-right.menu-show-children') : null)
                        ]))
                    })
                )
            ]),
            m('div.menu.menu-two.menu-two-' + (ctrl.childVisible() ? 'visible' : 'hidden'), [
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