const $stdout = document.getElementById("stdout");

$stdout.addEventListener("DOMNodeInserted", () => {
  $stdout.scrollTop = $stdout.scrollHeight;
});

const script = document.createElement("script");
script.src = "gpt-2.js";
script.async = true;
document.body.appendChild(script);

$stdout.innerHTML = "Loading model...";

let top_k = 80;
let top_p = 0.9;
let temp = 0.8;
let repetition_penalty = 1.2;

const $output = document.getElementById("output");

$output.addEventListener("DOMNodeInserted", () => {
  $output.scrollTop = $output.scrollHeight;
});

function print(text) {
  $stdout.innerHTML += text + "<br>";
}

let isGenerating = false;
runawayGenerateTimer = null;

var Module = {
  print: print,
  printErr: print,

  callback: function(resultStr) {
    console.log(resultStr);
    if (resultStr === "<|endoftext|>") {
      $output.innerHTML += "\n";
      $input.diabled = false;
      isGenerating = false;
    } else {
      const text = $output.innerHTML + resultStr;
      $output.innerHTML = text.replace(/(User|Assistant):(\S)/g, "$1: $2");

      if (runawayGenerateTimer) clearTimeout(runawayGenerateTimer);
      runawayGenerateTimer = setTimeout(function() {
        $input.diabled = false;
        isGenerating = false;
      }, 10000);
    }
  },

  onRuntimeInitialized: function() {
    Module.init();

    $chat = document.getElementById("chat");
    $chat.style.display = "flex";

    $input = document.getElementById("inputPrompt");
    $profileDefault = document.getElementById("profile-default");
    $profileJoker = document.getElementById("profile-joker");
    $profileMaths = document.getElementById("profile-maths");

    $profileJoker.addEventListener("click", function(e) {
      top_k = 80;
      top_p = 0.9;
      temp = 0.8;
      repetition_penalty = 1.2;
    });

    $profileJoker.addEventListener("click", function(e) {
      top_k = 80;
      top_p = 0.75;
      temp = 0.8;
      repetition_penalty = 1.5;
    });

    $profileMaths.addEventListener("click", function(e) {
      top_k = 80;
      top_p = 0.51;
      temp = 0.8;
      repetition_penalty = 1.2;
    });

    $chat.addEventListener("submit", function(e) {
      e.preventDefault();

      if (isGenerating) return false;

      const inputPrompt = $input.value;
      $input.value = "";

      const prompt = "" + "User: " + inputPrompt + "\nAssistant:";

      console.log(prompt);

      console.log("top_k: " + top_k);
      console.log("top_p: " + top_p);
      console.log("temp: " + temp);
      console.log("repetition_penalty: " + repetition_penalty);

      Module.generate(prompt, top_k, top_p, temp, repetition_penalty);
      isGenerating = true;
      $input.diabled = true;

      return false;
    });
  }
};
