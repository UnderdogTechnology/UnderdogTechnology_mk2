app.cmp.common.slider = {
    controller: function(args) {
        var ctrl = {};
        return ctrl;
    }, view: function(ctrl, args) {
        return m('div.slider-wrapper', [
            m('label.slider-label', args.label),
            m('input[type="range"]', {
                min: args.min,
                max: args.max,
                value: args.param(),
                onchange: m.withAttr('value', args.onchange || args.param)
            })
        ]);
    }
};