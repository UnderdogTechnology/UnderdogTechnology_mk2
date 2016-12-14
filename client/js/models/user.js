(function() {
    
    function showMessage(r) {
        var name = r.error || r;
        if(name) {
            var a = {
                type: 'error',
                message: 'Something went wrong.',
                icon: 'fa-user-times'
            }
            switch(name) {
                /*
                    ERROR MESSAGES
                */
                case 'unauthorized':
                    a.message = 'Username or password is incorrect.';
                    break;
                case 'conflict':
                    a.message = 'Username is already taken.';
                    break;
                case 'forbidden':
                    a.message = 'Invalid username.';
                    break;
                case 'not_found':
                    a.message = 'You don\'t have permission to perform this action.';
                    break;
                case 'invalid_email':
                    a.message = 'Email must be supplied in the correct format.';
                    break;
                case 'invalid_password':
                    a.message = 'Password must be supplied in the correct format.';
                    break;
                case 'invalid_username':
                    a.message = 'Username must be alphanumeric and between 5 and 15 characters.';
                    break;
                case 'mismatch_password':
                    a.message = 'Passwords must match.';
                    break;
                case 'required_email':
                    a.message = 'Email is a required field.';
                    break;
                case 'required_password':
                    a.message = 'Password is a required field.';
                    break;
                case 'required_username':
                    a.message = 'Username is a required field.';
                    break;
                /*
                    WARNING MESSAGES
                */
                case 'no_connection':
                    a.message = 'Could not connect to the server';
                    a.type = 'warning';
                    a.icon = 'fa-plug';
                    break;
                /*
                    SUCCESS MESSAGES
                */
                case 'sign_up':
                    a.message = 'You have successfully signed up!';
                    a.type = 'success';
                    a.icon = 'fa-user';
                    break;
                case 'changed_password':
                    a.message = 'Password has been successfully updated.';
                    a.type = 'success';
                    a.icon = 'fa-user';
                    break;
                case 'changed_username':
                    a.message = 'Username has been successfully updated.';
                    a.type = 'success';
                    a.icon = 'fa-user';
                    break;
            }
            
            app.shared.alert.add(a);
            m.redraw();
            console.log(a);
        }
    }
    
    var user = app.model.user = {};
    
    user.current = null;
    
    user.isValid = function(obj, ignoreError) {
        var passed = true;
        
        for(var type in obj) {
            var value = obj[type];
            
            if(value) {
                var regex = null,
                    msgName = '',
                    valueTwo = null,
                    arePasswordsValid = true;
                    
                    switch(type) {
                        case 'email':
                            regex = /[A-Za-z0-9]+@[A-Za-z0-9]+\.[A-Za-z]{1,3}/;
                            msgName = 'invalid_email';
                            break;
                        case 'password':
                            regex = /[A-Za-z0-9]{8}/;
                            if(Array.isArray(value)) {
                                valueTwo = value[1];
                                value = value[0];
                            }
                            msgName = 'invalid_password';
                            break;
                        case 'username':
                            regex = /[A-Za-z0-9]{5,15}/;
                            msgName = 'invalid_username';
                            break;
                    }
                    
                    if(valueTwo) {
                        arePasswordsValid = (valueTwo === value && regex.test(valueTwo));
                        msgName = 'mismatch_password';
                    }
                    
                    if(!regex.test(value) || !arePasswordsValid) {
                        passed = false;
                        if(!ignoreError) showMessage(msgName);
                    }
            } else {
                switch(type) {
                    case 'email':
                        msgName = 'required_email';
                        break;
                    case 'password':
                        msgName = 'required_password';
                        break;
                    case 'username':
                        msgName = 'required_username';
                        break;
                }
                passed = false;
                if(!ignoreError) showMessage(msgName);
            }
        }
        return passed;
    };
    
    user.isLoggedIn = function() {
        return !!user.current;
    };
    
    user.hasAccess = function(auth) {
        if(auth === 'any') return true;
        
        if(user.isLoggedIn()) {
            if(auth === 'loggedin') return true;
            if(user.current.roles.indexOf(auth) !== -1) return true;
        } else if(auth == null) return true;
        
        return false;
    };
    
    user.signIn = function(obj, route) {
        if(!user.isValid(obj)) return;
        
        return app.db.remote.login(obj.username.toLowerCase(), obj.password).then(function() {
            return user.restoreUser();
        }).then(function() {
            if(route) vutil.changeRoute(route);
        }).catch(showMessage);
    };
    
    user.signUp = function(obj, route) {
        if(!user.isValid(obj)) return;
        
        return app.db.remote.signup(obj.username.toLowerCase(), obj.password[0], {
            metadata: {
                email: obj.email
            }
        }).then(function() {
            return app.model.user.signIn({
                username: obj.username,
                password: obj.password[0]
            }, route)
        }).then(function() {
            showMessage('sign_up');
        }).catch(showMessage);
    };
    
    user.signOut = function() {
        app.db.remote.logout();
        user.current = null;
    }
    
    user.getSession = function() {
        return app.db.remote.getSession().catch(function() {
            showMessage('no_connection');
        })
    }
    
    user.restoreUser = function() {
        if(!app.db.connected) return user.get();
        
        return user.getSession().then(function(s) {
           if(!s.userCtx.name) return;
           
           return user.get(s.userCtx.name, s.userCtx.roles);
        });
    };
    
    user.get = function(username, roles) {
        if(!app.db.connected) return app.db.local.get('_local/user').then(function(u) {
            user.current = u;
        })
        
        username = username || user.current.username;
        
        return app.db.remote.getUser(username.toLowerCase()).then(function(u){
            user.current = u;
            
            if(roles)
                user.current.roles = roles;
            
            return app.db.local.get('_local/user').then(function(r) {
                return app.db.local.put({
                    '_id': r['_id'],
                    '_rev': r['_rev'],
                    user: user.current
                });
            }).catch(function() {
                return app.db.local.put({
                    '_id': '_local/user',
                    user: user.current
                })
            }).catch(showMessage);
        })
    };
    
    user.update = function(obj) {
        if(!user.isValid(obj)) return;        
        
        var meta = {};
        var promises = [];
        
        for(var attr in obj) {
            if(obj.hasOwnProperty(attr)) {
                if(attr === 'password') {
                    promises.push(app.db.remote.changePassword(obj.username, obj.password)).then(function() {
                        showMessage('changed_password');
                    }).catch(showMessage)
                } else if (attr === 'username') {
                    promises.push(app.db.remote.changeUsername(obj.prevUsername, obj.username).then(function() {
                        showMessage('changed_username');
                        return user.restoreUser();
                    })).catch(showMessage)
                } else if( attr !== 'prevUsername') 
                    meta[attr] = obj[attr];
            }
        }
        
        if(Object.keys(meta).length) {
            promises.push(app.db.remote.putUser(obj.username, {
                metadata: meta
            })).then(user.restoreUser).catch(showMessage)
        }
        
        return promises;
    }
    
})();