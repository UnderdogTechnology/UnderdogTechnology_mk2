app.cmp.settings = {
    controller: function(args) {
        var ctrl = {
            name: m.prop(app.model.user.current.name || null),
            email: m.prop(app.model.user.current.email || null),
            password: m.prop(null),
            cPassword: m.prop(null),
            getMaxMenuOffsest: function() {
                var ulHeight = window.getComputedStyle(util.q('.menu > ul'))['height'].replace('px','');
                var menuHeight = window.getComputedStyle(util.q('.menu'))['height'].replace('px','');
                
                return menuHeight - ulHeight;
            }
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
                    param: app.model.settings.easyTouchOffset,
                    label: 'Y Offset (' + app.model.settings.easyTouchOffset() + '%)',
                    min: 0,
                    max: 80,
                    oninput: function(v) {
                        app.model.settings.easyTouchOffset(v);
                        app.model.settings.apply();
                    }
                })
            }),
            m.component(app.cmp.common.slider, {
                param: app.model.settings.animationSpeed,
                label: 'Animation Speed (' + app.model.settings.animationSpeed() + 'ms)',
                min: 0,
                max: 500,
                oninput: function(v) {
                    app.model.settings.animationSpeed(v);
                    app.model.settings.apply();
                }
            })
        ]);
    }
};