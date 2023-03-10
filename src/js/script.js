function run(script){
    document.documentElement.setAttribute('onreset', script);
    document.documentElement.dispatchEvent(new CustomEvent('reset'));
    document.documentElement.removeAttribute('onreset');
}

console.log("Loaded BetterGym!");
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
            run('for(var i=0;i<10;i++)nextQuestion()')
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
        } else if (message == "debugger") {debugger;}
        else {run("initialGameScore = " + message)}
    }
)