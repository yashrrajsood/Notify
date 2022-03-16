function addNote(){
    dataToSend = document.getElementById('inputTextToSend').value
    if (dataToSend == ""){
        fadeOutEffect('emptyFieldAlertDivider', 40);

    }else{
        var slider = document.getElementById("myRange");
        document.getElementById('loadingDivider').style.display = '';
        fetch("http://localhost:3000/addNote/" + dataToSend + "/" + slider.value)
        .then((res) => {
            res.text().then(function (data) {
                console.log("Note saved with id: " + data + ' [With importancd level of ' + slider.value + "]");
                slider.value = 1;
            });
            document.getElementById('inputTextToSend').value = "";
            document.getElementById("exMark").innerHTML = "!";
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

    var slider = document.getElementById("myRange");
    var output = document.getElementById("importanceTicker");
    output.innerHTML = slider.value; // Display the default slider value

    // Update the current slider value (each time you drag the slider handle)
    slider.oninput = function() {
        output.innerHTML = this.value;
        if(this.value == 1){
            document.getElementById("exMark").innerHTML = "!"
        }else if(this.value == 2){
            document.getElementById("exMark").innerHTML = "!!"
        }else if(this.value == 3){
            document.getElementById("exMark").innerHTML = "!!!"
        }else if(this.value == 4){
            document.getElementById("exMark").innerHTML = "!!!!"
        }else if(this.value == 5){
            document.getElementById("exMark").innerHTML = "!!!!!"
        }
    }
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
                var tempImportance = data[i]['data']['importance_level']
                if(tempImportance == 1){
                    tempImportance = "!"
                }else if(tempImportance == 2){
                    tempImportance = "!!"
                }else if(tempImportance == 3){
                    tempImportance = "!!!"
                }else if(tempImportance == 4){
                    tempImportance = "!!!!"
                }else if(tempImportance == 5){
                    tempImportance = "!!!!!"
                }
                document.getElementById('noteListDivider').innerHTML += 
                `
                <div id="noteCardElement" class="card">
                    <p id="noteTextInCard">${tempText}</p>
                    <p id="noteDateInCard">${tempTime}&nbsp&nbsp|&nbsp&nbsp<strong>${tempImportance}</strong></p>
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
