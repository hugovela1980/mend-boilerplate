import open from 'open';

const openDevBrowser = async (url) => {
    await open(url, {
        app: { name: 'chrome', arguments: ['--auto-open-devtools-for-tabs'] }
    });
};

export default openDevBrowser;
