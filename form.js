const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;

    // Show the form
    if (url === "/" && method === "GET") {
        res.setHeader("Content-Type", "text/html");

        return res.end(`
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Node Form</title>
                </head>
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

    // Handle form submission
    if (url === "/message" && method === "POST") {
        const body = [];

        req.on("data", (chunk) => {
            body.push(chunk);
        });

        req.on("end", () => {
            const parsedBody = Buffer.concat(body).toString();
            // parsedBody = "username=Sharad"

            const username = parsedBody.split("=")[1];

            fs.writeFile("message.txt", username, (err) => {
                if (err) {
                    console.log(err);
                }

                // Redirect back to home page
                res.statusCode = 302;
                res.setHeader("Location", "/");
                return res.end();
            });
        });

        return;
    }

    // Default response
    res.statusCode = 404;
    res.end("Page Not Found");
});

server.listen(3000, () => {
    console.log("Server is running on port 3000");
});