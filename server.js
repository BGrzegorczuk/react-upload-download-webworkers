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
    const {uid, filename, ext, size} = req.body;

    const fileData = {
        uid,
        filename,
        ext,
        size,
        chunksUploaded: 0
    };

    // TODO: permissions & validation checks
    // TODO: could check uploaded files md5, if the file's upload has already been started in the past
    DB[uid] = fileData;

    console.log("\nDB", DB);

    res.json(fileData);
});

app.post('/upload', function (req, res) {
    console.log("/upload", req.query);
    const { cn: chunkNumber, uid } = req.query;
    const name = `${uid}.chunk.${chunkNumber}`;
    const dst = fs.createWriteStream(`${__dirname}/files/${name}`);

    req.pipe(dst);
    req.on('end', function () {
        console.log('file stream END');
        res.writeHead(200);
        res.end();
        return;
    });
});

app.listen(80, function () {
    console.log("Server listening on port 80!");
});
