import chalk from 'chalk';

const cld = (title, ...args) => {
    if (args.length === 0) return console.log('\n\nNo arguments were passed to console-logging-debugger \n');
    
    const formattedTitle = typeof title === 'string' ? title.toUpperCase() : 'UNKNOWN TITLE';
    
    console.log(chalk.black.bgWhite(`\n\n================================================`));
    console.log(chalk.black.bgWhite(`================== ${formattedTitle.toUpperCase()} ==================`));
    console.log(chalk.black.bgWhite(`================================================\n`));

    args.forEach((arg, i) => console.log(`(${i + 1})`, ' --> ', arg, ' <-- ', typeof arg, '\n'));

    console.log(chalk.black.bgWhite(`==============================================`));
    console.log(chalk.black.bgWhite(`================ ${formattedTitle.toUpperCase()} END ================`));
    console.log(chalk.black.bgWhite(`==============================================\n\n`));
    
    console.log(chalk.red.bgYellow(`==============================================`));
    console.log(chalk.red.bgYellow(`==============================================`));
};

// const args = [
//   [1,2,3],
//   'path/to/file',
//   15,
//   {a: 'first', b: 'second', c: 'thirdalkdsjfl,kajsdf,lkj', d: 'fourthl,aksjdf,lkjasdk,flj', e: 'fiftha,lkdjsf,lkjsa,dfklj'},

// ]
// true;

// cld('testing', ...args);
// cld('testing', ...args);
// cld('testing', ...args);
// cld('s;kdjff', ...args);
// cld();

export default cld;