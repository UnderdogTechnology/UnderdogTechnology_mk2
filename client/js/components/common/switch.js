app.cmp.common.switch = {
    controller: function(args) {
        var ctrl = {
            showContent: function(evt) {
                Velocity(util.q('.tgl-content', util.parent(evt.currentTarget, '.tgl-wrapper')), 'slideDown', app.model.settings.animationSpeed());
            },
            hideContent: function(evt) {
                Velocity(util.q('.tgl-content', util.parent(evt.currentTarget, '.tgl-wrapper')), 'slideUp', app.model.settings.animationSpeed());
            }
        };
        
        return ctrl;
    }, view: function(ctrl, args) {
        return m('div.tgl-wrapper', [
            m('label.tgl-label', args.label),
            m('div.tgl', [
                m('label.tgl-btn', {
                        class: args.param() ? 'tgl-on' : 'tgl-off'
                    },
                    m('div.tgl-opt.secondary', {
                        onclick: ctrl.hideContent
                    }, args.options[0]),
                    m('div.separator'),
                    m('div.tgl-opt.primary', {
                        onclick: ctrl.showContent
                    }, args.options[1]),
                    m('input[type="checkbox"].tgl-switch', {
                        checked: args.param(),
                        onchange: m.withAttr('checked', args.onchange || args.param)
                    })
                )
            ]), m('div.tgl-content', {
                hidden: !args.content
            }, args.content)
        ]);
    }
};