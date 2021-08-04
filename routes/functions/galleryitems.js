const fs = require("fs");
const path = require("path");

module.exports = (id) => {
  let data = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "../../public/data/projects.json"))
  );
  data = data.body;
  data = data.find((val) => val.id == parseInt(id));
  let toReturn = "";
  for (let href of data.screenshots) {
    let x = href;
    const categories = ["w-1", "w-2", "w-3"];
    let width = categories[Math.floor(Math.random() * categories.length)];


    let layout = `<div class="galleryItem ${width}">\n<img src="${x}" class="screenShot "></img>\n</div>`;
    toReturn += layout + "\n";
  }
  return toReturn;
};

module.exports.links = (id) => {
  let data = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "../../public/data/projects.json"))
  );
  data = data.body;
  data = data.find((val) => val.id == parseInt(id));
  let toReturn = "";
  for (let href of data.related) {
    let x = href;
    let layout = `<li class="linkItem">\n<a href="${x}" class="link">${x}</a>\n</li>`;
    toReturn += layout + "\n";
  }
  return toReturn;
};

let obj = {
  GitHub: {
    url: "/icons/github.svg",
    href: "https://github.com/",
  },
};



module.exports.tech = (id) => {
  let data = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "../../public/data/projects.json"))
  );
  data = data.body;
  data = data.find((val) => val.id == parseInt(id));
  let toReturn = "";
  for (let href of data.tech) {
    let x = href;
    let layout = `<img src="${obj[href].url}" class="icon" onclick="location.href='${obj[href].href}'"></img>`;
    toReturn += layout + "\n";
  }
  return toReturn;
};
