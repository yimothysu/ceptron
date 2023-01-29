var ipc = require('electron').ipcRenderer;
var confirmButton = document.getElementById('confirmButton');

document.addEventListener("DOMContentLoaded", pageLoaded);

function pageLoaded(){
    alert('settingsrender');
}

console.log("called");

confirmButton.addEventListener('click', function(){
    console.log("CLICKED");
    const settingsVals = JSON.stringify({
        OpenAIKey: document.getElementById("OpenAI").value,
    });
    ipc.send('settings-change', settingsVals);
});
