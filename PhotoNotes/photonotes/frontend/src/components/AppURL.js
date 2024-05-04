const url = {
    dev: `http://${window.location.hostname}:8000`,
    prod: `https://${window.location.hostname}:8443`,
    get: function () {
        if ((window.location.hostname === 'myphotonotes.tech') ||
            (window.location.hostname === 'www.myphotonotes.tech') ||
            (window.location.hostname === 'fbs.home') ||
            (window.location.hostname === 'www.fbs.home')) {
            return this.prod;
        } else {
            return this.dev;
        }
    }
}

export default url