const chatBox =
document.getElementById("chatBox");

const sendBtn =
document.getElementById("sendBtn");

const clearBtn =
document.getElementById("clearBtn");

const darkBtn =
document.getElementById("darkBtn");

const downloadBtn =
document.getElementById("downloadBtn");

let chatHistory =
JSON.parse(
localStorage.getItem("chatHistory")
) || [];

window.onload = () => {

chatHistory.forEach(chat => {

addMessage(
chat.text,
chat.type,
false
);

});

};

sendBtn.addEventListener(
"click",
sendMessage
);

document
.getElementById("userInput")
.addEventListener(
"keypress",
(e)=>{

if(e.key==="Enter"){
sendMessage();
}

}
);

darkBtn.addEventListener(
"click",
()=>{

document.body.classList.toggle(
"dark"
);

}
);

clearBtn.addEventListener(
"click",
()=>{

chatBox.innerHTML="";

localStorage.removeItem(
"chatHistory"
);

chatHistory=[];

}
);

downloadBtn.addEventListener(
"click",
()=>{

const blob =
new Blob(
[
JSON.stringify(
chatHistory,
null,
2
)
],
{
type:"text/plain"
}
);

const a =
document.createElement("a");

a.href =
URL.createObjectURL(blob);

a.download =
"chat-history.txt";

a.click();

}
);

async function sendMessage(){

const input =
document.getElementById("userInput");

const text =
input.value.trim();

if(!text) return;

addMessage(
text,
"user"
);

input.value="";

addMessage(
"Gemini is typing...",
"bot"
);

try{

const response =
await fetch(
"/chat",
{
method:"POST",

headers:{
"Content-Type":
"application/json"
},

body:JSON.stringify({
message:text
})
}
);

const data =
await response.json();

document
.querySelector(".bot:last-child")
.remove();

addMessage(
data.reply,
"bot"
);

}
catch{

document
.querySelector(".bot:last-child")
.remove();

addMessage(
"Error connecting to Gemini.",
"bot"
);

}

}

function addMessage(
text,
type,
save=true
){

const div =
document.createElement("div");

div.classList.add(
"message",
type
);

const time =
new Date()
.toLocaleTimeString(
[],
{
hour:"2-digit",
minute:"2-digit"
}
);

div.innerHTML = `
<div>${text}</div>
<span class="time">${time}</span>
`;

if(type==="bot"){

const copyBtn =
document.createElement("button");

copyBtn.textContent =
"Copy";

copyBtn.style.marginTop =
"10px";

copyBtn.onclick = ()=>{

navigator.clipboard
.writeText(text);

alert("Copied");

};

div.appendChild(copyBtn);

}

chatBox.appendChild(div);

chatBox.scrollTop =
chatBox.scrollHeight;

if(save){

chatHistory.push({
text,
type
});

localStorage.setItem(
"chatHistory",
JSON.stringify(
chatHistory
)
);

}

}