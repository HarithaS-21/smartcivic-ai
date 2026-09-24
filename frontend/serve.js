const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const MIME_TYPES = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".svg": "image/svg+xml"
};

const server = http.createServer((req, res) => {
    // Enable CORS for all local requests
    res.setHeader("Access-Control-Allow-Origin", "*");

    const cleanUrl = req.url.split("?")[0];
    const safePath = path.normalize(cleanUrl).replace(/^(\.\.[\/\\])+/, "");
    const filePath = path.join(__dirname, safePath === "/" || safePath === "\\" ? "index.html" : safePath);

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "text/plain";

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("404 Not Found");
        } else {
            res.writeHead(200, { "Content-Type": contentType });
            res.end(content);
        }
    });
});

server.listen(PORT, () => {
    console.log(`SmartCivic Frontend server active at http://localhost:${PORT}`);
});
