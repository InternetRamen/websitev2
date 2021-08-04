var express = require("express");
var router = express.Router();
const fetch = require("node-fetch");
const fs = require("fs");
const getPosts = require("./functions/galleryitems");
const multer = require("multer");
const upload = multer();
const config = require("../config.json");
/* GET home page. */
const path = require("path");
router.get("/:projectID", function (req, res, next) {
  // https://source.unsplash.com/1600x900/
  let projectID = req.params.projectID;
  let data = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "../public/data/projects.json"))
  );
  data = data.body;
  data = data.find((val) => val.id == parseInt(projectID));
  if (!data) return res.sendStatus(404);

  console.log(req.params.projectID);
  res.render("projects/index", {
    name: data.name,
    content: data.content,
    images: getPosts(projectID),
    status: data.status,
    links: getPosts.links(projectID),
    icons: getPosts.tech(projectID),
  });
});
router.get("/", function (req, res, next) {
  res.redirect("/#projects");
});

function write(object, thumbnailPath, screenshotPaths) {
  let data = JSON.parse(
    fs.readFileSync(path.resolve(__dirname + "/../public/data/projects.json"))
  );
  if (object.tech === "N/A") {
    object.tech = [];
  } else {
    object.tech = object.tech.split("\n");
  }
  if (object.related === "N/A") {
    object.related = [];
  } else {
    object.related = object.related.split("\n");
  }

  object.thumbnail = thumbnailPath;
  object.screenshots = screenshotPaths;
  object.id = data.idCount + 1;
  data.idCount += 1;

  data.body.push(object);

  fs.writeFileSync(
    path.resolve(__dirname + "/../public/data/projects.json"),
    JSON.stringify(data, null, 4)
  );
}

function check(body, files, array) {
  if (!body || !files) return false;

  let toCheck = ["name", "status", "summary", "content", "tech", "related"];
  if (!body.body || !body.secret) return false;

  let textBody = body.body;

  if (
    Object.keys(textBody).some(
      (val) =>
        !toCheck.includes(val) ||
        textBody[val] === "" ||
        textBody[val] === undefined
    )
  )
    return false;
  if (array.find((val) => val.name === textBody.name)) return false;

  return true;
}

router.post(
  "/api",
  upload.fields([{ name: "thumbnail" }, { name: "screenshots" }]),
  async (req, res) => {
    let projectsJson = JSON.parse(
      fs.readFileSync(path.resolve(__dirname + "/../public/data/projects.json"))
    );
    projectsJson = projectsJson.body;
    let body = JSON.parse(req.body.text);
    let files = req.files;
    let screenshots = req.files.screenshots;
    let thumbnail = req.files.thumbnail[0];
    let secret = body.secret;
    if (secret !== config.projects) return res.sendStatus(401);
    if (!check(body, files, projectsJson)) return res.sendStatus(400);

    let thumbnailP = "";
    let screenshotP = [];

    console.log("Passed");
    let checklist = {};
    let thumbnailCheck = false;
    let doneCorrectly = false;
    for (let i in screenshots) {
      checklist[i] = false;
    }
    let promise = new Promise((resolve) => {
      let r = (Math.random() + 1).toString(36).substring(7);
      let thumbNailStream = fs.createWriteStream(
        path.resolve(__dirname + `/../public/uploads/thumbnails/${r}.jpeg`)
      );
      thumbNailStream.write(thumbnail.buffer);
      thumbNailStream.on("finish", () => {
        thumbnailCheck = true;
        thumbnailP = `/uploads/thumbnails/${r}.jpeg`;

        for (let j in screenshots) {
          let screenshot = screenshots[j];
          let x = (Math.random() + 1).toString(36).substring(7);
          let writeStream = fs.createWriteStream(
            path.resolve(__dirname + `/../public/uploads/screenshots/${x}.jpeg`)
          );
          writeStream.write(screenshot.buffer);
          writeStream.on("finish", () => {
            checklist[j] = true;
            screenshotP.push(`/uploads/screenshots/${x}.jpeg`);
            console.log(
              Object.values(checklist).every((v) => v === true),
              thumbnailCheck === true
            );
            if (
              Object.values(checklist).every((v) => v === true) &&
              thumbnailCheck === true
            ) {
              doneCorrectly = true;
              if (doneCorrectly == true) {
                write(body.body, thumbnailP, screenshotP);
                res.sendStatus(200);
              } else {
                res.sendStatus(500);
              }
            }
          });
          writeStream.on("error", (e) => {
            res.sendStatus(500);
            console.log(e);
          });
          writeStream.end();
        }
      });
      thumbNailStream.on("error", (e) => {
        res.sendStatus(500);
        console.log(e);
      });
      thumbNailStream.end();
    });
  }
);

module.exports = router;
