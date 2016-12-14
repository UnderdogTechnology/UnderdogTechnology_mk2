app.cmp.settings = {
    controller: function(args) {
        var ctrl = {
            username: m.prop(app.model.user.current.name || null),
            email: m.prop(app.model.user.current.email || null),
            password: m.prop(null),
            cPassword: m.prop(null),
            leftHand: m.prop(app.model.settings.leftHand)
        };
        return ctrl;
    },
    view: function(ctrl, args) {
        
        return m('div.settings', [
            m.component(app.cmp.common.dBox, {
                header: 'Account Details',
                content: m('form.center-form.pure-form.pure-form-aligned', [
                    mutil.formGroup([
                        m('label', 'Username'),
                        m('input[type=text].form-control', {
                            autocorrect: 'off',
                            autocapitalize: 'none',
                            readonly: true,
                            placeholder: 'Username',
                            value: ctrl.username()
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
                        m('button[type=submit].pure-button.btn.primary', 'Apply'),
                        m('a.pure-button.btn.secondary', 'Cancel')
                    ])
                ])
            }),
            m.component(app.cmp.common.switch, {
                options: ['On', 'Off'],
                param: ctrl.leftHand,
                label: 'Left Hand Mode',
                onchange: function(value) {
                    app.model.settings.leftHand = value;
                    ctrl.leftHand(value);
                }
            })
        ]);
    }
};