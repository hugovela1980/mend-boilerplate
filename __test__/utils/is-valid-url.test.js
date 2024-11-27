import isValidUrl from '../../utils/is-valid-url';

describe('isValidUrl', () => {
    test('returns true if the url is valid', () => {
        const mockUrl = 'http://mock-url.com';
        
        vi.spyOn(globalThis, 'URL').mockImplementation((url) => {
            if (url === 'http://mock-url.com') return { href: url };
            throw new Error('Invalid URL');
        });
        const result = isValidUrl(mockUrl);

        expect(result).toBe(true);
    });

    test('return false if the url is invalid', () => {
        const mockUrl = 'mock-invalid-url';

        const result = isValidUrl(mockUrl);

        expect(result).toBe(false);
    });
});