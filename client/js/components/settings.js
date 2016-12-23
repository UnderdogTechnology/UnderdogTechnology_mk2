app.cmp.settings = {
    controller: function(args) {
        var ctrl = {
            name: m.prop(app.model.user.current.name || null),
            email: m.prop(app.model.user.current.email || null),
            password: m.prop(null),
            cPassword: m.prop(null)
        };
        return ctrl;
    },
    view: function(ctrl, args) {
        
        return m('div.settings', [
            m.component(app.cmp.common.detailBox, {
                id: 'account_details',
                header: 'Account Details',
                content: m('form.center-form.pure-form.pure-form-aligned', [
                    mutil.formGroup([
                        m('label', 'Username'),
                        m('input[type=text].form-control', {
                            autocorrect: 'off',
                            autocapitalize: 'none',
                            readonly: true,
                            placeholder: 'Username',
                            value: ctrl.name()
                        })
                    ]),
                    mutil.formGroup([
                        m('label', 'Email'),
                        m('input[type=email].form-control', {
                            placeholder: 'Email',
                            value: ctrl.email(),
                            onchange: m.withAttr('value', ctrl.email)
                        })
                    ]),
                    mutil.formGroup([
                        m('label', 'New Password'),
                        m('input[type=password].form-control', {
                            placeholder: 'New Password',
                            value: ctrl.password(),
                            onchange: m.withAttr('value', ctrl.password)
                        })
                    ]),
                    mutil.formGroup([
                        m('label', 'Confirm Password'),
                        m('input[type=password].form-control', {
                            placeholder: 'Confirm Password',
                            value: ctrl.cPassword(),
                            onchange: m.withAttr('value', ctrl.cPassword)
                        })
                    ]),
                    mutil.formControls([
                        m('a.pure-button.btn.secondary', 'Cancel'),
                        m('button[type=submit].pure-button.btn.primary', 'Apply')
                    ])
                ])
            }),
            m.component(app.cmp.common.switch, {
                options: ['On', 'Off'],
                param: app.model.settings.leftHand,
                label: 'Left Hand Mode'
            }),
            m.component(app.cmp.common.switch, {
                options: ['On', 'Off'],
                param: app.model.settings.easyTouch,
                label: 'Easy Touch Mode',
                content: m.component(app.cmp.common.slider, {
                    param: app.model.settings.animationSpeed,
                    label: 'Y Offset (' + app.model.settings.animationSpeed() + 'px)',
                    min: 100,
                    max: 300
                })
            }),
            m.component(app.cmp.common.slider, {
                param: app.model.settings.animationSpeed,
                label: 'Animation Speed (' + app.model.settings.animationSpeed() + 'ms)',
                min: 100,
                max: 300
            })
        ]);
    }
};