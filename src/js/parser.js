class Parser {
  proposition; // Proposition entered by the user, cleaned of whitespace, adds brackets if needed.
  // Removes any whitespace from the proposition.
  constructor(proposition_input) {
    this.proposition = proposition_input.replaceAll(' ','');
  }

  solver(expression) {
    // Generates all combinations of truth values for the variables.
    var variables = [... new Set(expression.replace(/\W/g, ''))];
    var set_count = 1 << variables.length;
    var truth_values = [];
    for (var i = 0; i < set_count; i++) {
      truth_values.push({});
      for (var j = 0; j < variables.length; j++) {
        if (((1 << j) & i) > 0) {
          truth_values[i][variables[j]] = true;
        }
        else {
          truth_values[i][variables[j]] = false;
        }
      }
      truth_values[i]["result"] = null;
    }

    var sub_characters, sub_solution;
    var final_solution = true;
    var most_recent_opening = null, next_closing = null;
    var characters, current_character, current_solutions;

    // Iterates over every possible combination of truth values for the variables.
    for (var t = 0; t < truth_values.length; t++){
      current_solutions = truth_values[t];
      // Proposition split into an array of characters, with each element being a single character.
      // For example, '(A∨B)' translates to ['(', 'A', '∨', 'B', ')'].
      characters = expression.split('');
      // Continually evaluates each sub-formula of the proposition until the array has been whittled down to a single Boolean expression.
      while (characters.length !== 1) {
        // Iterates over each character in the array, looking for the "deepest" subformaula to be evaluated.
        for (var i = 0; i < characters.length; i++) {
          current_character = characters[i];
          if (current_character === "(") {
            most_recent_opening = i;
            continue;
          }
          // Once an atomic proposition is identified, this proposition is evaluated.
          else if (current_character === ")" && most_recent_opening !== null) {
            next_closing = i;
            sub_characters = characters.slice(most_recent_opening, next_closing + 1);
            sub_solution = this.solve_sub(sub_characters, current_solutions);
            // The evaluated expression is removed, and replaced with a single Boolean expression.
            characters.splice(most_recent_opening, sub_characters.length);
            characters.splice(most_recent_opening, 0, sub_solution);
            // The brackets no longer exist, so the indexes need to be reset for the next subformula.
            most_recent_opening = null;
            next_closing = null;
            continue;
          }
        }
      }
      // Once the proposition has been evaluated to a single Boolean expression, this is appended to the dictionary representing the corresponding combination of truth values.
      truth_values[t]["result"] = sub_solution;
    }
    return truth_values;
  }

  // Evaluates an expression in the form (...) and returns a single Boolean expression.
  solve_sub(expression, truth_values) {
    // Removes opening and closing brackets, find all unique variables.
    var bracketless = expression.slice(1, -1);
    var variables = [... new Set(this.proposition.replace(/\W/g, ''))];
    const operators = ["∧", "∨", "→", "⟷"]
    var temp_op= null;
    var negate = false, result = null, variable_value;
    // Iterates over each character in the expression, brackets removed.
    for (var i = 0; i < bracketless.length; i++) {
      // If it's a negation, make note of this and continue to next character.
      if (bracketless[i] === "¬") {
        negate = true;
      }
      // If it's an operator, make note of this and continue to next character.
      else if (operators.includes(bracketless[i])) {
        temp_op = bracketless[i];
      }
      // If it's a variable or a Boolean value, then continue.
      else if (variables.includes(bracketless[i]) || bracketless[i] === true || bracketless[i] === false) {
        // Sets current term to whatever the variable or truth value represents,
        if (bracketless[i] === true || bracketless[i] === false) {
          variable_value = bracketless[i];
        }
        else {
          variable_value = truth_values[bracketless[i]];
        }
        // Negates the character if applicable.
        if (negate === true) {
          variable_value = !variable_value;
          negate = false;
        }
        // If the expression is still null, then set it as the first truth value in the expression.
        if (result === null) {
          result = variable_value;
        }
        // If it's not the first variable / Boolean value, and the last character was an operator, then perform the relevant Boolean operation.
        else if (temp_op !== null)
        {
          if (temp_op == "∧") {
            result = result && variable_value;
          }
          else if (temp_op == "∨") {
            result = (result || variable_value);
          }
          else if (temp_op == "→") {
            result = (!result || variable_value);
          }
          else if (temp_op == "⟷") {
            result = result === variable_value;
          }
          // Operation taken care of now.
          temp_op = null;
        }
      }
    }
    // Return a single Boolean value.
    return result;
  }
}
