// import fs from 'fs';
// import path from 'path';

// const resizeImageWithSharp = (imagePath) => {
//     return new Promise((resolve, reject) => {
//       const imageStream = fs.createReadStream(imagePath);
//       const transformer = sharp().resize({ width: 200 });
        
//       transformer.on('error', (error) => {
//         reject(new Error(`Error creating preview for file: ${path.basename(imagePath)} - ${error.message}`));
//       });
      
//       const transformedStream = imageStream.pipe(transformer);
//       resolve(transformedStream);
//     });
//   };
  
// const Jimp = require('jimp').default;
// const resizeImageWithJimp = (imagePath) => {
  
//   return new Promise(async (resolve, reject) => {
//     Jimp.read(imagePath)
//       .then(image => {
//         image.resize(200, Jimp.AUTO);
//         return image.getBufferAsync(Jimp.MIME_JPEG)
//       })
//       .then(buffer => resolve({ buffer, mimeType: Jimp.MIME_JPEG}))
//       .catch(error => reject(new Error(`Error processing image: ${error.message}`)));
//   });
// };

// export { resizeImageWithSharp, resizeImageWithJimp };