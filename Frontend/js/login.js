var url = 'http://localhost:5000/users/login/'
var user = 'test35';
var pass = 'mypassword';

// Save these for future requests
var userId;
var authToken;

var success = document.getElementById("loginSuccess")
var failed = document.getElementById("loginFail")


var button = document.getElementById('btn')
button.addEventListener("click", function () {
    success.style.visibility = 'hidden'
    failed.style.visibility = 'hidden'
    var user = document.getElementsByName("userEmail")[0].value
    console.log("User value: " + user)


    var pass = document.getElementsByName("userPassword")[0].value
    console.log("Password value: " + pass)
    if (user == "" || pass == "") {
        console.log("Values Not present " + pass + user);
        return;
    }
    console.log("Crossed the barrier")
    const update = {
        email: user,
        password: pass,
    };
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(update),
    };

    fetch(url, options)
        .then(data => {
            if (!data.ok) {
                failed.style.visibility = 'visible'
                throw Error(data.status);
            }
            if (data.status == 200) {
                success.style.visibility = 'visible'
            }
            return data.json();
        }).then(update => {
            console.log("Update");
            localStorage.setItem("userToken", update.token)
            window.location.href = "home.html"
            console.log(update + localStorage.getItem("userToken"))
        }).catch(e => {
            console.log(e);
        });

    // request.post(
    //     {
    //       uri: url,
    //       // I'm using form because it matches the urlEncoding behaviour expected by `restivus`
    //       form: { email: user, password: pass }
    //     },
    //     function(err, httpResponse, body) {
    //       if (err) {
    //         return console.error('post failed:', err);
    //       }
    //       var json = JSON.parse(body);
    //       authToken = json.data.authToken;
    //       userId = json.data.userId;
    //       console.log('Post successful!  Server responded with:', body);
    //     }
    //   );
})
// Use POST instead of GET

var form = document.getElementById("form-container");
function handleForm(event) { event.preventDefault(); }
form.addEventListener('submit', handleForm);

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
