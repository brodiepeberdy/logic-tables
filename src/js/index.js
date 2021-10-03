// Triggered when the proposition is entered, handles solving of the proposition and generating the truth table.
function submitProposition(form){
  // Cleans the string of redundant whitespace, instantiates the Parser class for solving the proposition.
  var proposition_input = document.getElementById("proposition");
  var parser = new Parser(proposition_input.value);
  proposition_input.value = parser.proposition;
  parser.solver(parser.proposition);
  var truth_results = parser.evaluator();

  // Removes any existing truth tables. ID: "truth_table_results"
  var el = document.getElementById("truth_table_results");
  if (el) {
    el.parentNode.removeChild(el);
  }
  // New table created.
  var table = document.createElement('table');
  table.id = "truth_table_results";

  // Isolates unique variables within the proposition. For example, ((P∧Q)∨(S∨P)) would return an array ["P", "Q", "S"].
  var variables = [... new Set(parser.proposition.replace(/\W/g, ''))];
  // Creates the first row of the truth table - this labels each variable's corresponding column, and finally the propostion being solved.
  var tr, td, text;
  var tr = document.createElement('tr');
  for (var num = 0; num < variables.length; num++) {
    td = document.createElement('td');
    text = document.createTextNode(variables[num]);
    td.appendChild(text);
    tr.appendChild(td);
  }
  td = document.createElement('td');
  text = document.createTextNode(parser.proposition);
  td.appendChild(text); tr.appendChild(td); table.appendChild(tr);

  // Iterates over each row, each row uniquely defined by the combination of truth values, and their corresponding proposition's truth value.
  for (var row = 0; row < truth_results.length; row++){
    tr = document.createElement('tr');
    // Cycles through the dictionary at each element of the array representing a row.
    for (var num = 0; num < variables.length; num++) {
      td = document.createElement('td');
      text = document.createTextNode(truth_results[row][variables[num]]);
      td.appendChild(text); tr.appendChild(td);
    }
    // Further, adds the proposition's resulting truth value at the end of the row.
    td = document.createElement('td');
    text = document.createTextNode(truth_results[row]["result"]);
    td.appendChild(text); tr.appendChild(td); table.appendChild(tr);
  }
  // Table appended to the HTML page.
  var results_container = document.getElementById("results");
  results_container.appendChild(table);
}

// Appends the selected character to the end of the current proposition.
function appendProposition(button) {
    var proposition_input = document.getElementById("proposition");
    var character = button.innerHTML;
    proposition_input.value = proposition_input.value + character;
}

// Handles both the clearing of an entire proposition, and backspace (which deletes a single, most recently entered character).
function clearProposition(button) {
    var proposition_input = document.getElementById("proposition");
    var character = button.innerHTML;
    if (character == "← Backspace") {
      // Slices last character from the value.
      proposition_input.value = proposition_input.value.substring(0, proposition_input.value.length - 1);
    }
    else if (character == "Clear") {
      proposition_input.value = "";
    }
}
