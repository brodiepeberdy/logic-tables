function submitProposition(form){
  var proposition_input = document.getElementById("proposition");
  var parser = new Parser(proposition_input.value)
  proposition_input.value = parser.proposition
  console.log(parser)
}

function appendProposition(button) {
    var proposition_input = document.getElementById("proposition");
    var character = button.innerHTML;
    proposition_input.value = proposition_input.value + character;
}

function clearProposition(button) {
    var proposition_input = document.getElementById("proposition");
    var character = button.innerHTML;
    if (character == "← Backspace") {
      proposition_input.value = proposition_input.value.substring(0, proposition_input.value.length - 1);
    }
    else if (character == "Clear") {
      proposition_input.value = ""
    }
}
