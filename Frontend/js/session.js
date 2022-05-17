var userStorage = localStorage.getItem("userToken")
var path = window.location.pathname;
var page = path.split("/").pop();
console.log(page);

if (userStorage == undefined) {
    if (!(page == "index.html" || page == "login.html" || page == "Signup.html"))
        window.location.href = "index.html"

} else if (page == "index.html" || page == "login.html" || page == "Signup.html") {
    window.location.href = "Home.html"
}

document.getElementById("idLogout").addEventListener("click", function () {
    localStorage.clear()
    window.location.href = "index.html"
})