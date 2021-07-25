function submit() {
    let title = document.querySelector(".form-title")
    let content = document.querySelector(".form-content")
    let secret = document.querySelector(".form-secret")
    let validate = document.querySelector(".validate")
    let toPost = {
        body: {
            date: Date.now(),
            name: title.value,
            content: content.value,
        },
        secret: secret.value
    }
    console.log(toPost)
    fetch("/blog/api", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(toPost)
    })
        .then(res => {
            if (res.ok) {
                validate.innerHTML = "Blog Post Created!"
            } else {
                validate.innerHTML = "Error: " + res.statusText
            }
        })
}


window.onload = () => {
    document.getElementById('content').addEventListener('keydown', function(e) {
        if (e.key == 'Tab') {
            e.preventDefault();
            let start = this.selectionStart;
            let end = this.selectionEnd;

            // set textarea value to: text before caret + tab + text after caret
            this.value = this.value.substring(0, start) +
                "\t" + this.value.substring(end);

            // put caret at right position again
            this.selectionStart =
                this.selectionEnd = start + 1;
        }
    });
}
