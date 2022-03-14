function addNote(){
    dataToSend = document.getElementById('inputTextToSend').value
    if (dataToSend == ""){
        document.getElementById('emptyFieldAlertDivider').style.display = '';
        
        setInterval(function(){ 
            document.getElementById('emptyFieldAlertDivider').style.display = 'none'; 
        }, 1500);

    }else{
        document.getElementById('loadingDivider').style.display = '';
        fetch("http://localhost:3000/addNote/" + dataToSend)
        .then((res) => {
            res.text().then(function (data) {
                console.log("Note saved with id: ",data)
            });
            document.getElementById('inputTextToSend').value = ""
            document.getElementById('loadingDivider').style.display = 'none';
        })
        .catch((err) => {
            /* handle errors */
            console.log("ERROR on fetch request", err); 
        })
    }
}

/* Open the sidenav */
function openNav() {
    document.getElementById("mySidenav").style.width = "100%";
    loadNotes();
  }
  
/* Close/hide the sidenav */
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
