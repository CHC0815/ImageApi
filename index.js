const express = require('express');
const {
    createCanvas
} = require('canvas');


const app = express();
app.disable("x-powered-by");

app.get('/', (req, res) => {
    res.send('Image api');
});


app.get('/test', (req, res) => {
    res.sendFile("index.html", {
        root: __dirname
    });
});


app.get('/render', (req, res) => {
    var text = req.query.text || "No Input";

    var canvas = createCanvas(500, 500);
    var ctx = canvas.getContext('2d');

    // Write "Awesome!"
    ctx.font = '12px Impact';
    ctx.fillText(text, 10, 10);

    var size = ctx.measureText(text);
    var result = createCanvas(parseInt(size.width), 12);
    var result_ctx = result.getContext('2d');
    result_ctx.clearRect(0, 0, result.width, result.height);
    result_ctx.font = '12px Impact';
    result_ctx.fillStyle = "#ffffff";
    result_ctx.fillText(text, 0, 10);

    // set transparency
    var img = result_ctx.getImageData(0, 0, result.width, result.height);
    var data = img.data;
    var length = data.length;
    for (var i = 3; i < length; i += 4) {
        data[i] = 0;
    }
    img.data = data;
    ctx.putImageData(img, 0, 0);

    result.toBuffer((err, buf) => {
        if (err) {
            res.send("Error");
            throw err;
        }
        res.contentType("image/png");
        res.send(buf);
    }, 'image/png');
});


app.listen(3000, () => {
    console.log('Server started on port 3000');
});