Ext.ns('FrontendEditor');
FrontendEditor.browserCallback = function(data) {
    if (data) {
        window.parent.postMessage({
            mceAction: 'browserSelectCompleted',
            url: data.fullRelativeUrl
        }, '*');
    }
};
