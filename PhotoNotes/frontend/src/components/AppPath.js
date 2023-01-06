const appPath = {
        'index': '/',
        'blog': '/blog',
        'editNote': '/note/edit/:id',
        'createNote': '/note/create',
        'deleteNote': '/note/delete/:id',
        'viewNote': '/note/view/:id',
        'login': '/login',
        'logout': '/logout',
        'registration': '/registration',
        'verify': '/verify/:username/:activation_key',
        'feedback': '/feedback',
        'profile': '/profile/view/:id',
        'checkkey': '/checkkey/:key/',
        'recoveryPwd': '/pwd',
        'any': '*'
    };

export default appPath;
