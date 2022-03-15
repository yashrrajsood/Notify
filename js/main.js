function addNote(){
    dataToSend = document.getElementById('inputTextToSend').value
    if (dataToSend == ""){
        fadeOutEffect('emptyFieldAlertDivider', 40);

    }else{
        document.getElementById('loadingDivider').style.display = '';
        fetch("http://localhost:3000/addNote/" + dataToSend)
        .then((res) => {
            res.text().then(function (data) {
                console.log("Note saved with id: ",data)
            });
            document.getElementById('inputTextToSend').value = ""
            document.getElementById('loadingDivider').style.display = 'none';
            fadeOutEffect('successAlert', 40);    
        })
        .catch((err) => {
            /* handle errors */
            console.log("ERROR on fetch request", err); 
        })
    }
}

window.onload = function what() {
    var inputBox = document.getElementById("inputTextToSend");
    inputBox.addEventListener('keydown', function(e){
        if (e.code === "Enter") { 
            addNote()
        }
    });
};


function openNav() {
    document.getElementById("mySidenav").style.width = "100%";
    loadNotes();
}
  
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById('noteListDivider').innerHTML = '';
}

function loadNotes(){
    fetch("http://localhost:3000/getNotes")
    .then((res) => {
        document.getElementById('noteListDivider').innerHTML = '';
        res.json().then(function (data) {
            if(data.length != 0){
                document.getElementById("notesNotFoundDivider").style.display = 'none';
            }else{
                document.getElementById("notesNotFoundDivider").style.display = '';
            }
            data.reverse();
            for (let i = 0; i < data.length; i++) {
                var tempId = data[i]['data']['id']
                var tempText = data[i]['data']['note_text']
                var tempTime = data[i]['data']['dateTime']
                document.getElementById('noteListDivider').innerHTML += 
                `
                <div id="noteCardElement" class="card">
                    <p id="noteTextInCard">${tempText}</p>
                    <p id="noteDateInCard">${tempTime}</p>
                    <img src="/images/deleteIcon.png" id="deleteIcon" onclick="deleteNote('${tempId}')">
                </div>
                `;
            }
        })
    })
    .catch((err) => {

    })
}

function deleteNote(noteId){
    fetch("http://localhost:3000/deleteNote/" + noteId)
        .then((res) => {
            console.log("Note with ID " + noteId + " deleted")
        })
        .catch((err) => {
            console.log("ERROR on fetch request", err); 
    })
    loadNotes();
}

function fadeOutEffect(docID, intervalTiming) {
    document.getElementById(docID).style.opacity = 1;
    var fadeTarget = document.getElementById(docID);
    var fadeEffect = setInterval(function () {
        if (!fadeTarget.style.opacity) {
            fadeTarget.style.opacity = 1;
        }
        if (fadeTarget.style.opacity > 0) {
            fadeTarget.style.opacity -= 0.01;
        } else {
            clearInterval(fadeEffect);
        }
    }, intervalTiming);
}
