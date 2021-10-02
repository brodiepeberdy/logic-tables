class Parser {
  proposition;
  queue = [];

  // Removes any whitespace from the proposition.
  constructor(proposition_input) {
    this.proposition = proposition_input.replaceAll(' ','');
  }

  solver(expression, truth_values) {
    // (A) => A
    var containerOpening = expression.indexOf("(");
    var containerEnding = expression.lastIndexOf(")");
    var expression = expression.substring(1, expression.length-1);

    var firstOpening = expression.indexOf("(");
    var firstEnding = -1
    var contained = 0
    var first_found = false
    while (firstEnding == -1 && first_found == false) {
      for (var i = firstOpening + 1; i < expression.length; i++) {
        if (expression[i] == "(") {
          contained = contained + 1
        }
        else if (expression[i] == ")") {
          if (contained == 0) {
            firstEnding = i;
            first_found = true;
          }
          else {
            contained = contained - 1
          }
        }
      }
      break;
    }

    if (first_found == true) {
      this.solver(expression.substring(firstOpening, firstEnding + 1))
      var operator = expression[firstEnding + 1]
      console.log(operator)
      this.queue.push(operator);
    }
    else {
      console.log(expression)
      this.queue.push(expression);
    }

    var secondOpening = expression.substring(firstEnding + 2, expression.length).indexOf("(");
    var secondEnding = -1;
    contained = -1;
    var second_found = false;
    while (secondEnding == -1 && second_found == false) {
      for (var i = secondOpening + 1 + firstEnding + 1; i < expression.length; i++) {
        if (expression[i] == "(") {
          contained = contained + 1;
        }
        else if (expression[i] == ")") {
          if (contained == 0) {
            secondEnding = i;
            second_found = true;
          }
          else {
            contained = contained - 1
          }
        }
      }
      break;
    }

    if (second_found == true) {
      this.solver(expression.substring(secondOpening + 1 + firstEnding + 1, secondEnding + 1))
    }
  }

  evaluator() {
    const operators = ["∧", "∨", "→", "⟷"]

    // Generates all combinations of truth values for the variables.
    var variables = [... new Set(this.proposition.replace(/\W/g, ''))];
    var numberOfSets = 1 << variables.length;
    var truth_values = [];
    for (var i = 0; i < numberOfSets; i++) {
      truth_values.push({});
      for (var j = 0; j < variables.length; j++) {
        if (((1 << j) & i) > 0) {
          truth_values[i][variables[j]] = true;
        }
        else {
          truth_values[i][variables[j]] = false;
        }
      }
    }

    var truth_results = [], elements;
    var negate;
    var temp_result, temp_op;

    for (var t = 0; t < truth_values.length; t++) {
      var values = truth_values[t];
      for (var q = 0; q < this.queue.length; q++) {
        elements = this.queue[q].split(/([∧∨→⟷])/g).filter(Boolean);
        console.log(elements)

        temp_result = null;
        temp_op = null;
        for (var j = 0; j < elements.length; j++) {
          negate = false;
          if (elements[j].substring(0,1) === "¬") {
            elements[j] = elements[j].substring(1,2);
            negate = true;
          }
          if (variables.includes(elements[j])){
            try {
              var result = truth_values[t][elements[j]]
              if (negate === true) {
                result = !result;
              }
              if (temp_result == null) {
                temp_result = result;
              }
              else if (temp_op !== null) {
                if (temp_op == "∧") {
                  temp_result = temp_result && result;
                }
                else if (temp_op == "∨") {
                  temp_result = (temp_result || result);
                }
                else if (temp_op == "→") {
                  temp_result = (!temp_result || result);
                }
                else if (temp_op == "⟷") {
                  temp_result = temp_result === result;
                }
                truth_results.push(temp_result);
                temp_op = null;
              }

            }
            catch(err) {
              console.log("Looks like something went wrong!");
            }
          }
          else if (operators.includes(elements[j])){
            try {
              temp_op = elements[j];
              truth_results.push(temp_op);
            }
            catch(err) {
              console.log("Looks like something went wrong!");
            }
          }
        }
      }
      truth_results.push(" ")
    }

    var final = [];
    var temp_result = null, temp_op = null;
    for (var v = 0; v < truth_results.length; v++) {
      if (truth_results[v] == true || truth_results[v] == false) {
        if (truth_results[v] === " ") {
          final.push(temp_result);
          temp_result = null;
          temp_op = null;
        }
        else if (temp_result == null) {
          temp_result = truth_results[v];
        }
        else {
          if (temp_op == "∧") {
            temp_result = temp_result && temp_results[v];
          }
          else if (temp_op == "∨") {
            temp_result = temp_result || temp_results[v];
          }
          else if (temp_op == "→") {
            temp_result = (!temp_result || temp_results[v]);
          }
          else if (temp_op == "⟷") {
            temp_result = temp_result === temp_results[v];
          }
        }
      }
    }



    for (var v = 0; v < truth_values.length; v++) {
      truth_values[v]["result"] = final[v]
    }
    console.log(truth_values)
    return truth_values;
  }
}
