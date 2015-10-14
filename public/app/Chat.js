var buttonClick = document.querySelector("#btnHide"),
            chat = document.querySelector("#chat");

buttonClick.addEventListener("click", function () {
    var history = document.querySelector("#history")
    if( buttonClick.id === "btnHide" ) {
        hide(buttonClick, chat, history);
    } else if ( buttonClick.id === "btnShow" ) {
        show(buttonClick, chat, history);
    } else {
        console.log("Erreur dans le toggle du chat.");
    }
}, false);


function hide(button, content, content2) {
    if( content.className.indexOf("hidden") === -1 ) {
        content.className += " hidden";
        content2.className = content2.className.replace("col-xs-9", "col-xs-12");
        button.id = "btnShow";
        console.log(button);
        button.innerHTML = "Show Chat";
    }
}

function show(button, content, content2) {
    if( content.className.indexOf("hidden") !== -1 ) {
        content.className = content.className.replace(" hidden","");
        content2.className = content2.className.replace("col-xs-12", "col-xs-9");
        button.id = "btnHide";
        button.innerHTML = "Hide Chat";
    }
}
