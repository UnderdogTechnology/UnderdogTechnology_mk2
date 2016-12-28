app.cmp.user.settings = {
    controller: function(args) {
        var ctrl = {
            accountDetails: {
                name: m.prop(app.model.user.current.name || null),
                email: m.prop(app.model.user.current.email || null),
                password: m.prop(null),
                cPassword: m.prop(null),
                clear: function() {
                    ctrl.accountDetails.name(app.model.user.current.name || null);
                    ctrl.accountDetails.email(app.model.user.current.email || null);
                    ctrl.accountDetails.password(null);
                    ctrl.accountDetails.cPassword(null);
                }
            },
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
            m(app.cmp.common.detailBox, {
                id: 'account_details',
                onhide: ctrl.accountDetails.clear,
                header: 'Account Details',
                content: m('form.center-form.pure-form.pure-form-aligned', [
                    mutil.formGroup([
                        m('label', 'Username'),
                        m('input[type=text].form-control', {
                            autocorrect: 'off',
                            autocapitalize: 'none',
                            readOnly: !app.model.user.hasAccess('_admin'),
                            placeholder: 'Username',
                            value: ctrl.accountDetails.name()
                        })
                    ]),
                    mutil.formGroup([
                        m('label', 'Email'),
                        m('input[type=email].form-control', {
                            placeholder: 'Email',
                            value: ctrl.accountDetails.email(),
                            onchange: m.withAttr('value', ctrl.accountDetails.email)
                        })
                    ]),
                    mutil.formGroup([
                        m('label', 'New Password'),
                        m('input[type=password].form-control', {
                            placeholder: 'New Password',
                            value: ctrl.accountDetails.password(),
                            onchange: m.withAttr('value', ctrl.accountDetails.password)
                        })
                    ]),
                    mutil.formGroup([
                        m('label', 'Confirm Password'),
                        m('input[type=password].form-control', {
                            placeholder: 'Confirm Password',
                            value: ctrl.accountDetails.cPassword(),
                            onchange: m.withAttr('value', ctrl.accountDetails.cPassword)
                        })
                    ]),
                    mutil.formControls([
                        m('a.pure-button.btn.secondary', {
                            onclick: ctrl.accountDetails.clear
                        }, 'Cancel'),
                        m('button[type=submit].pure-button.btn.primary', 'Apply')
                    ])
                ])
            }),
            m(app.cmp.common.switch, {
                options: ['On', 'Off'],
                param: app.model.settings.leftHand,
                label: 'Left Hand Mode'
            }),
            m(app.cmp.common.switch, {
                options: ['On', 'Off'],
                param: app.model.settings.easyTouch,
                label: 'Easy Touch Mode',
                content: m(app.cmp.common.slider, {
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
            m(app.cmp.common.slider, {
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