(function () {
    var w = window,
        C = '___grecaptcha_cfg',
        cfg = w[C] = w[C] || {},
        N = 'grecaptcha';
    var gr = w[N] = w[N] || {};
    gr.ready = gr.ready || function (f) {
        (cfg['fns'] = cfg['fns'] || []).push(f);
    };
    w['__recaptcha_api'] = 'https://www.google.com/recaptcha/api2/';
    (cfg['render'] = cfg['render'] || []).push('6LevKusUAAAAAAFknhlV8sPtXAk5Z5dGP5T2FYIZ');
    (cfg['onload'] = cfg['onload'] || []).push('captchaCallback');
    w['__google_recaptcha_client'] = true;
    var d = document,
        po = d.createElement('script');
    po.type = 'text/javascript';
    po.async = true;
    po.src = 'https://www.gstatic.com/recaptcha/releases/-nejAZ5my6jV0Fbx9re8ChMK/recaptcha__d' +
            'e.js';
    po.crossOrigin = 'anonymous';
    po.integrity = 'sha384-OGRBVsqHxQtXTE/t/5eeCh6kkOfaeajMZAXfZ++SmEM5kHFdh/lpXYFmxA7EBbP0';
    var e = d.querySelector('script[nonce]'),
        n = e && (e['nonce'] || e.getAttribute('nonce'));
    if (n) {
        po.setAttribute('nonce', n);
    }
    var s = d.getElementsByTagName('script')[0];
    s
        .parentNode
        .insertBefore(po, s);
})();
