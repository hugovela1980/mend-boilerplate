const isValidUrl = (url) => {
    try {
        new URL(url); // If this works, the URL is valid
        return true;
    } catch (error) {
        return false;
    }
};

export default isValidUrl;