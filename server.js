let express = require("express");

let app = express();

app.use(express.static(__dirname + "/dist/stable-diffusion"));

app.get("/*", (req, res) => {
  res.sendFile(__dirname + "/dist/stable-diffusion/index.html");
});

app.listen(process.env.PORT || 8080);
