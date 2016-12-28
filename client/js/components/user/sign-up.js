app.cmp.user.signUp = {
    controller: function(args) {
        var ctrl = {
            name: m.prop(null),
            password: m.prop(null),
            cPassword: m.prop(null),
            email: m.prop(null),
            signUp: function(e) {
                e.preventDefault();
                
                if(app.model.user.isValid({
                    email: ctrl.email() || '',
                    name: ctrl.name() || '',
                    password: ctrl.password() || ''
                })) {
                    app.model.user.signIn({
                        name: ctrl.name() || '',
                        password: ctrl.password() || ''
                    }, '/', true).catch(function() {
                        app.model.user.signUp({
                            email: ctrl.email() || '',
                            name: ctrl.name() || '',
                            password: [
                                ctrl.password() || '',
                                ctrl.cPassword() || ''
                            ]
                        }, '/');
                    })
                }
                
            }
        };
        return ctrl;
    },
    view: function(ctrl, args) {
        return m('div.sign-up', [
            m('form.center-form.pure-form.pure-form-aligned', {
                onsubmit: ctrl.signUp
            }, [
                mutil.formGroup([
                    m('label', 'Email'),
                    m('input[type="email"].form-control', {
                        autocorrect: 'off',
                        autocapitalize: 'none',
                        placeholder: 'Email',
                        value: ctrl.email(),
                        oninput: m.withAttr('value', ctrl.email)
                    })
                ]),
                mutil.formGroup([
                    m('label', 'Username'),
                    m('input[type="text"].form-control', {
                        autocorrect: 'off',
                        autocapitalize: 'none',
                        placeholder: 'Username',
                        value: ctrl.name(),
                        oninput: m.withAttr('value', ctrl.name)
                    })
                ]),
                mutil.formGroup([
                    m('label', 'Password'),
                    m('input[type="password"].form-control', {
                        placeholder: 'Password',
                        value: ctrl.password(),
                        oninput: m.withAttr('value', ctrl.password)
                    })
                ]),
                mutil.formGroup([
                    m('label', 'Password'),
                    m('input[type="password"].form-control', {
                        placeholder: 'Password',
                        value: ctrl.cPassword(),
                        oninput: m.withAttr('value', ctrl.cPassword)
                    })
                ]),
                mutil.formControls([
                    m('a.pure-button.btn.secondary', {
                        onclick: vutil.changeRoute.bind(this, '/sign-in')
                    }, 'Sign In'),
                    m('button[type="submit"].pure-button.btn.primary', 'Sign Up')
                ])
            ])
        ]);
    }
};
