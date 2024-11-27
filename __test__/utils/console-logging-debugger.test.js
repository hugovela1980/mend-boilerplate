import chalk from 'chalk';
import cld from '../../utils/console-logging-debugger.js';

vi.mock('chalk', () => ({
    default: {
        black: {
            bgWhite: vi.fn(text => `mock-black-bgWhite(${text})`)
        },
        red: {
            bgYellow: vi.fn(text => `mock-red-bgYellow(${text})`)
        }
    }
}));

describe('cld', () => {
    let consoleLogSpy;

    beforeEach(() => {
        consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    test('logs the title and arguments correctly', () => {
        const title = 'Test Title';
        const args = ['arg1', 44, { key: 'value'}];
        

        cld(title, ...args);

        expect(chalk.black.bgWhite).toHaveBeenCalledWith(expect.stringMatching(/TEST TITLE/));
        args.forEach((arg, i) => {
            expect(consoleLogSpy)
                .toHaveBeenCalledWith(`(${i + 1})`, ' --> ', arg, ' <-- ', typeof arg, '\n');
        });
    });

    test('logs a message when no arguments are passed', () => {
        const title = 'Test Title';
        
        cld(title);

        expect(consoleLogSpy).toHaveBeenCalledWith('\n\nNo arguments were passed to console-logging-debugger \n');
    });

    test('Fall back value when title is not a string', () => {
        const invalidTitle = { key: 'value' };
        const args = ['arg1', 44, { key: 'value'}];

        cld(invalidTitle, ...args);

        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringMatching(/UNKNOWN TITLE/));

    });
});