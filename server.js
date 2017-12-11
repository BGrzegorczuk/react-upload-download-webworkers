const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

let DB = {}; // TODO: redis or mongo DB should be used
let CHUNK_NO = 1;

app.use(cors());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', function (req, res) {
    res.send("Hello from the server");
});

app.post('/init_upload', function (req, res) {
    console.log("init_upload", req.body);
    const {md5, filename, ext, totalBytes, chunksTotal} = req.body;

    let chunksProcessed = 0;
    let processedBytes = 0;

    if (DB[md5]) {
        chunksProcessed = DB[md5].chunksProcessed;
        processedBytes = DB[md5].processedBytes;
    }

    const fileData = {
        md5,
        filename,
        ext,
        totalBytes,
        processedBytes,
        chunksProcessed,
        chunksTotal
    };

    // TODO: permissions & validation checks
    DB[md5] = fileData;

    console.log("\nDB", DB);

    res.json(fileData);
});

app.post('/upload', function (req, res) {
    console.log("/upload", req.query);
    const { cn: chunkNumber, pb: processedBytes, md5 } = req.query;
    const name = `${md5}.chunk.${chunkNumber}`;
    const dst = fs.createWriteStream(`${__dirname}/files/${name}`);

    req.pipe(dst);
    req.on('end', function () {
        DB[md5].chunksProcessed = parseInt(chunkNumber, 10);
        DB[md5].processedBytes = parseInt(processedBytes, 10);
        console.log(DB[md5]);
        console.log('file stream END');
        res.writeHead(200);
        res.end();
        return;
    });
});

app.post('/upload_finish', function (req, res) {
    // console.log("upload_finish", req.body);
    // const {filename, ext, totalBytes, chunksTotal} = req.body;
    //
    // const fileData = {
    //     filename,
    //     ext,
    //     totalBytes,
    //     chunksProcessed: 0,
    //     chunksTotal
    // };
    //
    // // TODO: permissions & validation checks
    // // TODO: could check uploaded files md5, if the file's upload has already been started in the past
    // DB[md5] = fileData;
    //
    // console.log("\nDB", DB);
    console.log('/upload_finish');

    const response = {'file upload': "success"};

    res.json(response);
});

app.listen(80, function () {
    console.log("Server listening on port 80!");
});
