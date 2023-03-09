console.log("Loaded BetterGym!");
const stopWatch = function () {};
try {
    document.querySelector(".btn-start").addEventListener("click", function () {
        let time = new Date().getTime();
        let i = setInterval(function () {
            document.querySelector(".timer").innerHTML = ((new Date().getTime() - time).toString().slice(0, -2) / 10).toFixed(1)
        }, 100);
    })
} catch {};
chrome.runtime.onMessage.addListener((message) => {
    var actualCode;
        if (message == "vocab_hack") {
            document.documentElement.setAttribute('onreset', 'for(var i=0;i<10;i++)nextQuestion()');
            document.documentElement.dispatchEvent(new CustomEvent('reset'));
            document.documentElement.removeAttribute('onreset');
        } else if (message == "timer_acc") {
            try {
                document.querySelector(".btn-start").addEventListener("click", function () {
                    let time = new Date().getTime();
                    let i = setInterval(function () {
                        document.querySelector(".timer").innerHTML = ((new Date().getTime() - time).toString().slice(0, -2) / 10).toFixed(1)
                    }, 100);
                })
            } catch {
                document.querySelector(".btn-start").removeEventListener("click", function () {
                    let time = new Date().getTime();
                    let i = setInterval(function () {
                        document.querySelector(".timer").innerHTML = ((new Date().getTime() - time).toString().slice(0, -2) / 10).toFixed(1)
                    }, 100);
                })
            }
        } else if (message == "boxing_hack") {
            //console.log("beta")
            document.documentElement.setAttribute('onreset', "gameData = {\"accents\":[{\"accent\":\"\u00e4\",\"characters\":\"a\"},{\"accent\":\"\u00f6\",\"characters\":\"o\"},{\"accent\":\"\u00fc\",\"characters\":\"u\"},{\"accent\":\"\u00df\",\"characters\":\"\"}],\"data\":[{\"id\":12056,\"category_id\":611,\"sentence\":\"Click the option that says CORRECT.\",\"translation\":\"CORRECT\",\"wrong1\":\"████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████\",\"wrong2\":\"████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████\",\"wrong3\":\"████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████\"}]}");
            document.documentElement.dispatchEvent(new CustomEvent('reset'));
            document.documentElement.removeAttribute('onreset');
        } else if (message == "debugger") debugger;
    }
)