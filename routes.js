const fs = require("fs");


const handler = (req, res) => {
    res.end("Hello");
};

const someText = "Node JS";

module.exports = {
    handler,
    someText
};
