const fs = require("fs");

const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;

    if (url === "/" && method === "GET") {
        res.setHeader("Content-Type", "text/html");

        return res.end(`
            <html>
                <body>
                    <form action="/message" method="POST">
                        <label>Name:</label>
                        <input type="text" name="username">
                        <button type="submit">Add</button>
                    </form>
                </body>
            </html>
        `);
    }

    if (url === "/message" && method === "POST") {
        const body = [];

        req.on("data", chunk => {
            body.push(chunk);
        });

        req.on("end", () => {
            const parsedBody = Buffer.concat(body).toString();
            const username = parsedBody.split("=")[1];

            fs.writeFile("message.txt", username, () => {
                res.statusCode = 302;
                res.setHeader("Location", "/");
                res.end();
            });
        });

        return;
    }

    res.statusCode = 404;
    res.end("Page Not Found");
};

module.exports = requestHandler;