function submitProposition(form){
  var proposition_input = document.getElementById("proposition");
  var parser = new Parser(proposition_input.value)
  proposition_input.value = parser.proposition
  parser.solver(parser.proposition)
  var truth_results = parser.evaluator()
  console.log(truth_results)

  var variables = [... new Set(parser.proposition.replace(/\W/g, ''))];

  var el = document.getElementById("truth_table_results");
  if (el) {
    el.parentNode.removeChild(el);
  }

  var table = document.createElement('table');
  table.id = "truth_table_results";


  var tr = document.createElement('tr');
  for (var num = 0; num < variables.length; num++) {
    var td1 = document.createElement('td');
    var text1 = document.createTextNode(variables[num]);
    td1.appendChild(text1);
    tr.appendChild(td1);
  }
  var td1 = document.createElement('td');
  var text1 = document.createTextNode(parser.proposition);
  td1.appendChild(text1);
  tr.appendChild(td1);
  table.appendChild(tr);



  for (var row = 0; row < truth_results.length; row++){
    var tr = document.createElement('tr');
    for (var num = 0; num < variables.length; num++) {
      var td1 = document.createElement('td');
      var text1 = document.createTextNode(truth_results[row][variables[num]]);
      td1.appendChild(text1);
      tr.appendChild(td1);
    }
    var td1 = document.createElement('td');
    var text1 = document.createTextNode(truth_results[row]["result"]);
    td1.appendChild(text1);
    tr.appendChild(td1);
    table.appendChild(tr);
  }
  var results_container = document.getElementById("results");
  results_container.appendChild(table);


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
