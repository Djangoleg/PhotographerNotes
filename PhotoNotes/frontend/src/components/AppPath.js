const appPath = {
        'index': '/',
        'blog': '/blog/:tag/:p',
        'editNote': '/note/:id/:tag/:p',
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
        'any': '*'
    };

export default appPath;
