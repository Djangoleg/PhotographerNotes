const appPath = {
        'index': '/',
        'blog': '/blog',
        'filterBlog': '/blog/:tag',
        'editNote': '/note/:id',
        'createNote': '/note/create',
        'deleteNote': '/note/delete/:id',
        'login': '/login',
        'logout': '/logout',
        'registration': '/registration',
        'verify': '/verify/:username/:activation_key',
        'any': '*'
    };

export default appPath
