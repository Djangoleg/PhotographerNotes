const appPath = {
        'index': '/',
        'blog': '/blog/:tag/:p',
        'editNote': '/note/:id/:tag',
        'createNote': '/note/create',
        'deleteNote': '/note/delete/:id',
        'login': '/login',
        'logout': '/logout',
        'registration': '/registration',
        'verify': '/verify/:username/:activation_key',
        'feedback': '/feedback',
        'any': '*'
    };

export default appPath;
