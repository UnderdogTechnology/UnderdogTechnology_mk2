app.cmp.signIn = {
    controller: function(args) {
        if(args.signOut) {
            app.model.user.signOut();
        }
        
        var ctrl = {
            name: m.prop(null),
            password: m.prop(null),
            signIn: function(e) {
                e.preventDefault();
                app.model.user.signIn({
                    name: ctrl.name() || '',
                    password: ctrl.password() || ''
                }, '/');
            }
        };
        
        return ctrl;
    },
    view: function(ctrl, args) {
        return m('div.sign-in', [
            m('form.center-form.pure-form.pure-form-aligned', {
                onsubmit: ctrl.signIn
            }, [
                mutil.formGroup([
                    m('label', 'Username'),
                    m('input[type="text"].form-control', {
                        autocorrect: 'off',
                        autocapitalize: 'none',
                        placeholder: 'Username',
                        value: ctrl.name(),
                        onchange: m.withAttr('value', ctrl.name)
                    })
                ]),
                mutil.formGroup([
                    m('label', 'Password'),
                    m('input[type="password"].form-control', {
                        placeholder: 'Password',
                        value: ctrl.password(),
                        onchange: m.withAttr('value', ctrl.password)
                    })
                ]),
                mutil.formControls([
                    m('button[type="submit"].pure-button.btn.primary', 'Sign In'),
                    m('a.pure-button.btn.secondary', {
                        onclick: vutil.changeRoute.bind(this, '/sign-up')
                    }, 'Sign Up')
                ])
            ])
        ]);
    }
};
