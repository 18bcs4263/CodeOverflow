var apiResult;
const url = "http://127.0.0.1:5000/contests/getAllContests"
const options = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
};

fetch(url, options)
    .then(data => {
        if (!data.ok) {
            throw Error(data.status);
        }
        return data.json();
    }).then(update => {
        console.log("Update");
        this.apiResult = update.items;
        this.addContestsToContainer(false);
    }).catch(e => {
        console.log(e);
    });


const container = document.getElementById("idContestContainer");
const btnUpcoming = document.getElementById("idUpcoming");
const btnPrevious = document.getElementById("idPrevious");

function addContestsToContainer(shouldAddPrevious) {

    container.innerHTML = ``
    console.log(container)
    apiResult.forEach((result, idx) => {
        const content = `<div class="col-3 my-4 mx-0">
    <div class="card">
        <img class="card-img-top mx-auto d-block" src="images/codeforces_logo.png" alt="Card image cap"
            style="width: 75%; height: 75%;">
        <div class="card-body">
            <h5 class="card-title">${result.name}</h5>
            <p class="card-text">${result.desc}</p>
            <a href="${result.link}" class="btn btn-primary">Go to website</a></div></div></div>`;
        if (result.isPrevious == shouldAddPrevious) {
            container.innerHTML += content
        }
    }

    )
}

btnUpcoming.addEventListener("click", function () {
    btnUpcoming.classList.add("active")
    btnPrevious.classList.remove("active")
    addContestsToContainer(false)

});

btnPrevious.addEventListener("click", function () {
    btnPrevious.classList.add("active")
    btnUpcoming.classList.remove("active")
    addContestsToContainer(true)
});

