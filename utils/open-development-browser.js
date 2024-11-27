import open from 'open';
import config from 'config';
import isValidUrl from './is-valid-url.js';

const openDevBrowser = async (url) => {
    if (!config.get('server.isDevBrowserOn')) return;
    const devBrowserPage = config.get('server.devBrowserPage');
    const openUrl = url + devBrowserPage;
    const openSettings = { app: { name: 'chrome', arguments: ['--auto-open-devtools-for-tabs'] } }

    if (isValidUrl(openUrl)) await open(openUrl, openSettings);
    else throw new Error('Development browser failed to open because of invalid url');
};

export default openDevBrowser;
