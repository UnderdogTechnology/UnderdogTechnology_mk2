app.cmp.common.detailBox = {
    controller: function(args) {
        var ctrl = {
            hidden: m.prop(true),
            show: function(evt) {
                Velocity(util.q('#' + args.id + ' .d-box-content'), 'slideDown', app.model.settings.animationSpeed());
                ctrl.hidden(false);
            },
            hide: function(evt) {
                ctrl.hidden(true);
                
                Velocity(util.q('#' + args.id + ' .d-box-content'), 'slideUp', app.model.settings.animationSpeed()).then(args.onhide);
            },
            toggle: function(evt) {
                if(ctrl.hidden()) {
                    ctrl.show(evt);
                } else {
                    ctrl.hide(evt);
                }
                m.redraw();
            }
        };
        return ctrl;
    }, view: function(ctrl, args) {
        return m('div.d-box', {
                id: args.id,
                class: ctrl.hidden() ? 'd-box-hidden' : ''
            },
            m('div.d-box-header.primary', {
                    class: args.class,
                    onclick: ctrl.toggle
                },
                m('i.d-box-knob', {
                    class: 'fa fa-chevron-down'
                }),
            args.header),
            m('div.d-box-content', args.content)
        )
    }
};