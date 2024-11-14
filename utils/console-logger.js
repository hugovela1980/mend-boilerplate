const cnsl = (title, item1, item2, item3 = '', item4 = '', item5 = '', item6 = '') => {
    console.log(`================================================`);
    console.group(`================== ${title} ==================`);
    console.log('1 --> ', ' ', item1, '\n');
    console.log('2 --> ', ' ', item2, '\n');
    console.log('3 --> ', ' ', item3, '\n');
    console.log('4 --> ', ' ', item4, '\n');
    console.log('5 --> ', ' ', item5, '\n');
    console.log('6 --> ', ' ', item6);
    console.log(`================ ${title} END ================`);
    console.log(`==============================================\n\n\n\n`);
    console.groupEnd();
  }

 export default cnsl;