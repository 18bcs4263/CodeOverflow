const skillsData = {
    "idSkill1": "Competitive Coding in C++",
    "idSkill2": "Competitive Coding in JAVA",
    "idSkill3": "Competitive Coding in PYTHON",
    "idSkill4": "MERN STACK",
    "idSkill5": "MEAN STACK",
    "idSkill6": "HTML CSS JAVASCRIPT",
    "idSkill7": "Android Development in JAVA",
    "idSkill8": "Android Development in KOTLIN",
    "idSkill9": "Android Development in FLUTTER",
    "idSkill10": "Machine Learning",
    "idSkill11": "Blockchain Development",
    "idSkill12": "Game Development",
}

var url = 'http://localhost:5000/users/get_matching_users/'

// Save these for future requests
var userId;
var authToken;

var container = document.getElementById("idSearchContainer")


function addContestsToContainer(users) {
    console.log(users.length)
    if(users.length == 0 ){
        container.innerHTML = `<h1 class="m-2" id="idNoResults">
        Sorry! no results found
        </h1>`;
    } else {
        container.innerHTML = ` `;
    }
    users.forEach(element => {
        var item =  `  <div class="card mb-3">
        <div class="card-body">
          <img src="images/user_image.png" class="float-left mr-3" style="width: 10%; height: 10%;">
          <h6 class="card-title ml-5">
            ${element.name}
          </h6>
          <button class="btn btn-primary my-auto float-right">Connect+</button>
        
          <p class="card-text">${element.description}</p>
          <p class="card-subtitle">Contact your coding buddy at ${element.email}</p>
        </div>
        </div>
        `
        container.innerHTML += item;
    });
}

function handleEvent() {
    var selected = [];
    var index = -1;
    var skillsToUpdate = []
    var input = document.getElementsByName("skillInputs")
    var query = searchBox.value
    for (var i =0 ; i<input.length ; i++) {
        index++;
        if (input[i].checked == true) {
            skillsToUpdate.push(skillsData[input[i].id])
        }
    }
    var update = {
        key: "100",
        skills: JSON.stringify(skillsToUpdate),
        query: query,
        token: localStorage.getItem("userToken")
    };
    if(query.length == 0) {
        update.query = null
    }
    console.log(update)
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
                throw Error(data.status);
            }
            return data.json();
        }).then(update => {
            addContestsToContainer(update)
        }).catch(e => {
            console.log(e);
        });

}

const searchBox = document.getElementById("idSearchBox")
searchBox.addEventListener("keypress", function (event) {
    console.log("event happened")
    if (event.key == "Enter") {
        event.preventDefault()
        handleEvent()
    }
})
/*handleEvent()*/

document.getElementById("search-addon").addEventListener("click",function(){
    handleEvent()
})