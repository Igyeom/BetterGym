const send = (s) => {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, s)
    })
};
document.querySelector("#vocab_hack").addEventListener("click", function () {
    send("vocab_hack")
});
/*
document.querySelector("#boxing_hack").addEventListener("click", function () {
    send("boxing_hack")
});
document.querySelector("#timer_acc").addEventListener("click", function () {
    if (document.querySelector("#timer_acc").style.color == "coral") {
        document.querySelector("#timer_acc").style.color = "lightgreen"
    } else {
        document.querySelector("#timer_acc").style.color = "coral"
    } send("timer_acc")
});
*/
document.querySelector("#clean_mode").addEventListener("click", function () {
    if (document.querySelector("#clean_mode").style.color == "coral") {
        document.querySelector("#clean_mode").style.color = "lightgreen"
    } else {
        document.querySelector("#clean_mode").style.color = "coral"
    }
    for (i of document.querySelectorAll(".hack")) {
        i.hidden = !i.hidden
    }
})
