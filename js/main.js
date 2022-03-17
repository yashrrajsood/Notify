var tag_list = [];

function addNote(){
    dataToSend = document.getElementById('inputTextToSend').value
    if (dataToSend == ""){
        fadeOutEffect('emptyFieldAlertDivider', 40);

    }else{
        var tagString = ""
        if (tag_list.length == 0){
            tagString = "null"
        }else{
            tagString = tag_list.join(',');
        }
        var slider = document.getElementById("myRange");
        document.getElementById('loadingDivider').style.display = '';
        fetch("http://localhost:3000/addNote/" + dataToSend + "/" + slider.value + "/" + tagString)
        .then((res) => {
            res.text().then(function (data) {
                console.log("Note saved with id: " + data + ' [With importancd level of ' + slider.value + "]");
                slider.value = 1;
            });
            resetPageInputs();
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

function addTag(tagName){
    var targetPill = document.getElementById("pill" + tagName)
    if(tag_list.includes(tagName)){
        for (var i = tag_list.length - 1; i >= 0; i--) {
            if (tag_list[i] === tagName) {
                tag_list.splice(i, 1);
            }
        }
        targetPill.style.backgroundColor = "rgba(244,92,67,1)";
        targetPill.style.color = "white";
    }else{
        tag_list.push(tagName)
        targetPill.style.backgroundColor = "white";
        targetPill.style.color = "grey";
    }
    console.log(tag_list)
}

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
            // data.reverse();
            for (let i = 0; i < data.length; i++) {
                var tempId = data[i]['data']['id']
                var tempText = data[i]['data']['note_text']
                var tempTime = data[i]['data']['dateTime']
                var tempImportance = data[i]['data']['importance_level']
                var tempTags = data[i]['data']['tags']
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
                    <div id="tagsDivider${tempText}">
                    </div>
                    <img src="/images/deleteIcon.png" id="deleteIcon" onclick="deleteNote('${tempId}')">
                </div>
                `;
                for(var x = 0; x < tempTags.length; x++){
                    document.getElementById('tagsDivider'+tempText).innerHTML += 
                    `
                    <button id="pills">${tempTags[x]}</button>
                    `;
                }
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

function resetPageInputs(){
    document.getElementById('inputTextToSend').value = "";
    document.getElementById("exMark").innerHTML = "!";
    document.getElementById('loadingDivider').style.display = 'none';
    document.getElementById('pillPersonal').style.backgroundColor = "rgba(244,92,67,1)";
    document.getElementById('pillPersonal').style.color = "white";
    document.getElementById('pillWork').style.backgroundColor = "rgba(244,92,67,1)";
    document.getElementById('pillWork').style.color = "white";
    document.getElementById('pillSchool').style.backgroundColor = "rgba(244,92,67,1)";
    document.getElementById('pillSchool').style.color = "white";
    document.getElementById('pillIdeas').style.backgroundColor = "rgba(244,92,67,1)";
    document.getElementById('pillIdeas').style.color = "white";
    document.getElementById('pillToDo').style.backgroundColor = "rgba(244,92,67,1)";
    document.getElementById('pillToDo').style.color = "white";
    document.getElementById('pillGroceries').style.backgroundColor = "rgba(244,92,67,1)";
    document.getElementById('pillGroceries').style.color = "white";
    document.getElementById('pillQuotes').style.backgroundColor = "rgba(244,92,67,1)";
    document.getElementById('pillQuotes').style.color = "white";
    tag_list = [];
}