class Parser {
  proposition;
  constructor(proposition_input) {
    this.proposition = this.cleanString(proposition_input);
  }
  get proposition() {
    return propsotion
  }
  cleanString(proposition) {
    return proposition.replaceAll(' ','')
  }
}
