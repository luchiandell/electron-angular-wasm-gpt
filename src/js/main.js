const $stdout = document.getElementById("stdout");

$stdout.addEventListener("DOMNodeInserted", () => {
  $stdout.scrollTop = $stdout.scrollHeight;
});

const script = document.createElement("script");
script.src = "gpt-2.js";
script.async = true;
document.body.appendChild(script);

$stdout.innerHTML = "Loading model...";

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

    $chat.addEventListener("submit", function(e) {
      e.preventDefault();

      if (isGenerating) return false;

      const inputPrompt = $input.value;
      $input.value = "";

      const prompt =
        "" +
        // 'A conversation between a human and an intelligent and helpful AI assistant:\n\n' +
        // 'Human: What is the capital of France?\n' +
        // 'Assistant: The capital of France is Paris.\n\n' +
        // 'Human: How many people live in Paris?\n' +
        // 'Assistant: About 2.2 million people live in Paris.\n\n' + $input.innerText + '\n' +
        "User: " +
        inputPrompt +
        "\nAssistant:";

      console.log(prompt);

      const top_k = 80;
      const top_p = 0.9;
      const temp = 0.8;
      const repetition_penalty = 1.2;

      Module.generate(prompt, top_k, top_p, temp, repetition_penalty);
      isGenerating = true;
      $input.diabled = true;

      return false;
    });
  }
};
