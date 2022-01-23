var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");
var languageButtonsEl = document.querySelector("#language-buttons");

// display the repos //
var displayRepos = function(repos, searchTerm) {
    // check if api returned any repos //
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }

    // clear old content //
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    // loop over repos //
    for (var i = 0; i < repos.length; i++) {
        // format repo name //
        var repoName = repos[i].owner.login + "/" + repos[i].name;
        
        // create a container for each repo //
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

        // create a span element to hold repository name //
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        // append to container //
        repoEl.appendChild(titleEl);

        // create a status element //
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        // check if current repo has issues or not //
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML = "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        }

        // append status to container //
        repoEl.appendChild(statusEl);

        // append container to the DOM //
        repoContainerEl.appendChild(repoEl);
    }
};

// when form is submitted //
var formSubmitHandler = function(event) {
    event.preventDefault();
    
    // get value from input element //
    var username = nameInputEl.value.trim();

    // pops up error if name is blank //
    if (username) {
        getUserRepos(username);
        nameInputEl.value = "";
    } else {
        alert("Please enter a GitHub username");
    }
};

// function to fetch user repos //
var getUserRepos = function(user) {
    // format the git hub api url //
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    // make request to the url //
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
            displayRepos(data, user);
        }); 
        } else {
            alert("Error: GitHub User Not Found");
        }
    })
    .catch(function(error) {
        // notice this '.catch()' getting chained onto the end of the '.then()' //
        alert("Unable to connect to GitHub");
    });
};

// accepts language parameter, creates API endpoint, makes HTTP request using fetch() //
var getFeaturedRepos = function(language) {
    var apiUrl = "https://api.github.com/search/repositories?q=" + language + "is:featured&sort=help-wanted-issues";

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                displayRepos(data.items, language);
            });
        } else {
            alert('Error: GitHub User Not Found');
        }
    });
};

// button click handler language buttons //
var buttonClickHandler = function(event) {
    var language = event.target.getAttribute("data-language");

    if (language) {
        getFeaturedRepos(language);

        // clear old content //
        repoContainerEl.textContent = "";
    }
    
}

// event listeners //
userFormEl.addEventListener("submit", formSubmitHandler);
languageButtonsEl.addEventListener("click", buttonClickHandler);