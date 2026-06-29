const repoContainer =
document.getElementById("repoContainer");

const bookmarkContainer =
document.getElementById("bookmarkContainer");

const searchBtn =
document.getElementById("searchBtn");

const darkModeBtn =
document.getElementById("darkModeBtn");

let chart;

// Search Button
searchBtn.addEventListener(
"click",
()=>{

const search =
document.getElementById("searchInput").value;

const language =
document.getElementById("languageFilter").value;

const sort =
document.getElementById("sortFilter").value;

fetchRepos(
search,
language,
sort
);

}
);

// Dark Mode
darkModeBtn.addEventListener(
"click",
()=>{
document.body.classList.toggle("dark");
}
);

// Fetch Repositories
async function fetchRepos(
search,
language,
sort
){

repoContainer.innerHTML =
"<h2>Loading...</h2>";

let query =
search || "stars:>10000";

if(language){
query += ` language:${language}`;
}

let sortParam = "stars";

if(sort==="forks"){
sortParam="forks";
}

if(sort==="updated"){
sortParam="updated";
}

const url =
`https://api.github.com/search/repositories?q=${query}&sort=${sortParam}&order=desc`;

try{

const response =
await fetch(url);

if(!response.ok){
throw new Error();
}

const data =
await response.json();

displayRepos(data.items);

createChart(data.items);

}
catch(error){

repoContainer.innerHTML =
"<h2>Error loading data</h2>";

}

}

// Display Repositories
function displayRepos(repos){

repoContainer.innerHTML="";

repos.slice(0,20).forEach(repo=>{

const note =
localStorage.getItem(
`note-${repo.name}`
);

const card =
document.createElement("div");

card.classList.add("repo-card");

card.innerHTML=`

<h3>${repo.name}</h3>

<p>
${repo.description || "No description"}
</p>

<p>
⭐ Stars:
${repo.stargazers_count}
</p>

<p>
🍴 Forks:
${repo.forks_count}
</p>

<p>
🐛 Issues:
${repo.open_issues_count}
</p>

<p>
👀 Watchers:
${repo.watchers_count}
</p>

<p>
📅 Updated:
${new Date(repo.updated_at).toLocaleDateString()}
</p>

<p>
💻 ${repo.language || "N/A"}
</p>

<a href="${repo.html_url}"
target="_blank">

View Repository

</a>

<br><br>

<button
class="bookmark-btn"
onclick="bookmarkRepo('${repo.name}')">

Bookmark

</button>

<button
class="note-btn"
onclick="addNote('${repo.name}')">

Add Note

</button>

<div class="note">

${note || ""}

</div>

`;

repoContainer.appendChild(card);

});

}

// Bookmark Repository
function bookmarkRepo(name){

let bookmarks =
JSON.parse(
localStorage.getItem("bookmarks")
) || [];

if(!bookmarks.includes(name)){

bookmarks.push(name);

localStorage.setItem(
"bookmarks",
JSON.stringify(bookmarks)
);

displayBookmarks();

alert(
"Repository Bookmarked"
);

}
else{

alert(
"Already Bookmarked"
);

}

}

// Remove Bookmark
function removeBookmark(name){

let bookmarks =
JSON.parse(
localStorage.getItem("bookmarks")
) || [];

bookmarks =
bookmarks.filter(
repo => repo !== name
);

localStorage.setItem(
"bookmarks",
JSON.stringify(bookmarks)
);

displayBookmarks();

}

// Add Note
function addNote(name){

const note =
prompt("Enter Note");

if(note){

localStorage.setItem(
`note-${name}`,
note
);

alert("Note Saved");

location.reload();

}

}

// Display Bookmarks
function displayBookmarks(){

bookmarkContainer.innerHTML="";

let bookmarks =
JSON.parse(
localStorage.getItem("bookmarks")
) || [];

bookmarks.forEach(repo=>{

const card =
document.createElement("div");

card.classList.add("bookmark-card");

card.innerHTML=`

<h3>${repo}</h3>

<button
class="remove-btn"
onclick="removeBookmark('${repo}')">

Remove

</button>

`;

bookmarkContainer.appendChild(card);

});

}

// Chart
function createChart(repos){

const ctx =
document.getElementById("repoChart");

const labels =
repos.slice(0,5).map(
repo=>repo.name
);

const stars =
repos.slice(0,5).map(
repo=>repo.stargazers_count
);

const forks =
repos.slice(0,5).map(
repo=>repo.forks_count
);

if(chart){
chart.destroy();
}

chart =
new Chart(ctx,{

type:"bar",

data:{

labels,

datasets:[

{
label:"Stars",
data:stars
},

{
label:"Forks",
data:forks
}

]

},

options:{
responsive:true
}

});

}

// Show Bookmarks
document
.getElementById("viewBookmarks")
.addEventListener(
"click",
()=>{

const bookmarks =
JSON.parse(
localStorage.getItem("bookmarks")
) || [];

if(bookmarks.length===0){

alert(
"No bookmarks yet"
);

return;

}

alert(
bookmarks.join("\n")
);

}
);

// Initial Load
displayBookmarks();

fetchRepos(
"",
"JavaScript",
"stars"
);