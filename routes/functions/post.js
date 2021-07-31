const fs = require('fs')
const path = require("path");
const marked = require('markdown-it')();
function toDateString(date) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear()
  );
}
let data = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../../public/data/posts.json"))
);

module.exports = () => {
    let list = "";
    let dataArr = data.body
    for (let index in dataArr) {
        let post = dataArr[index]
        let prettyDate = new Date(post.date)
        let toAdd;
        if (post.content.length > 270) toAdd = post.content.substring(0, 270) + ". . .";
        toAdd = marked.render(toAdd);   
        let long = `<li class="post" style="order: ${index};">`
         + `\n<p class="date">${toDateString(prettyDate)}</p>`
         + `\n<a href="/blog/posts/${post.date}" class="post-title">${post.name}</a>`
         + `\n<p class="post-content">${toAdd}</p>`
         + `\n<p class="post-author">${post.author}</p>`
         + `</li>\n`
        list+=long;
    }

    return list;
};
/* 


    let postList = document.querySelector(".post-ul")
    fetch("/data/posts.json")
        .then(res => res.json())
        .then(body => {
            let arr = body.body
            let i = 0;
            arr.forEach(val => {
                let element = document.createElement("li")
                element.classList.add("post")
                element.style.order = i.toString();
                i++;
                let date = document.createElement("p")
                date.classList.add("date")
                let prettyDate = new Date(val.date)
                date.innerHTML = toDateString(prettyDate)
                element.appendChild(date)

                let title = document.createElement("a")
                title.href = `/blog/posts/${val.date}`
                title.classList.add("post-title")
                title.innerHTML = val.name
                element.appendChild(title)

                let content = document.createElement("p")
                content.classList.add("post-content")
                let toAdd = val.content
                if (val.content.length > 270) toAdd = val.content.substring(0, 270) + ". . .";
                content.innerHTML = marked(toAdd)
                element.appendChild(content)

                let author = document.createElement("p")
                author.classList.add("post-author")
                author.innerHTML = val.author
                element.appendChild(author)

                postList.appendChild(element)
            })

        })


 */
