const express = require("express");
const expressApp = express();
const PORT = 3000;
const path = require("path");
const { app, BrowserWindow } = require("electron");

expressApp.use(function (req, res, next) {
  console.log("Setting headers");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");

  next();
});

expressApp.use(express.static(path.join(__dirname, "/src")));
expressApp.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));


const createWindow = () => {
  const win = new BrowserWindow({
    width: 1600,
    height: 1000
  })

  //win.loadFile('index.html')
  console.log('loading url')
  win.loadURL("http://localhost:3000");
}

app.whenReady().then(() => {
  console.log('ready')
  createWindow()
})
