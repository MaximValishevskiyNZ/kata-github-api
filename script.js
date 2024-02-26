
const searchInput = document.querySelector('#search');
const suggestions = document.querySelector('.suggestions');
const reposList = document.querySelector('.repos-list');


async function getRepos(searchTerm) {
    const response = await fetch(`https://api.github.com/search/repositories?q=${searchTerm}`);
    const data = await response.json();

    return data.items.slice(0, 5).map(item => ({
        name: item.name,
        owner: item.owner.login,
        stars: item.stargazers_count
    }));
}

function displaySuggestions(repos) {
    suggestions.innerHTML = '';

    repos.forEach(repo => {
        const div = document.createElement('div');
        div.textContent = repo.name;

        div.addEventListener('click', () => {
            addRepo(repo);
            searchInput.value = '';
        });

        suggestions.appendChild(div);
    });
}

function addRepo(repo) {
    const item = document.createElement('li');

    item.innerHTML = `
    <span>${repo.name}</span>
    <span>by ${repo.owner}</span>
    <span>⭐${repo.stars}</span>
    <button class="remove">X</button>
  `;

    item.querySelector('button').addEventListener('click', () => {
        item.remove();
    });

    suggestions.innerHTML = '';
    reposList.appendChild(item);
}

let timeout;
const debounceDelay = 400;

searchInput.addEventListener('input', () => {
    if(timeout) {
        clearTimeout(timeout);
    }

    timeout = setTimeout(async () => {
        const searchTerm = searchInput.value.trim();

        if(!searchTerm) {
            suggestions.innerHTML = '';
            return;
        }

        const repos = await getRepos(searchTerm);

        displaySuggestions(repos);
    }, debounceDelay);
});


