import { Readable } from 'stream';

const bufferToStream = buffer => {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
}

export default bufferToStream;