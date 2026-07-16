const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  // Home Page
  if (url === "/" && method === "GET") {
    fs.readFile("message.txt", "utf8", (err, data) => {
      const messages = data ? data.split("\n") : [];

      let list = "";

      messages.forEach((msg) => {
        if (msg.trim() !== "") {
          list += `<li>${msg}</li>`;
        }
      });

      res.setHeader("Content-Type", "text/html");

      res.end(`
        <html>
          <body>

            <h2>Messages</h2>

            <ul>
              ${list}
            </ul>

            <form action="/message" method="POST">
                <input
                    type="text"
                    name="username"
                    placeholder="Enter message"
                />

                <button type="submit">
                    Add
                </button>
            </form>

          </body>
        </html>
      `);
    });

    return;
  }

  // Save Message
  if (url === "/message" && method === "POST") {
    const body = [];

    req.on("data", (chunk) => {
      body.push(chunk);
    });

    req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();

      const message = decodeURIComponent(
        parsedBody.split("=")[1].replace(/\+/g, " ")
      );

      fs.readFile("message.txt", "utf8", (err, data) => {
        const oldMessages = data || "";

        // // New message goes on top
        // const updatedMessages = message + "\n" + oldMessages;

        fs.writeFile("message.txt", messege, () => {
          res.statusCode = 302;
          res.setHeader("Location", "/");
          res.end();
        });
      });
    });

    return;
  }

  res.statusCode = 404;
  res.end("Page Not Found");
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});