function toDateString(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
}
window.onload = () => {
    let postList = document.querySelector(".post-ul")
    fetch("/data/posts.json")
        .then(res => res.json())
        .then(body => {
            let arr = body.body
            arr.forEach(val => {
                let element = document.createElement("li")
                element.classList.add("post")

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
}