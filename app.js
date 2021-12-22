const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  solveExpression(e.target.expression.value);
});

function solveExpression(expression) {
  if (!expression) return 0;

  const addRegex = /\d{1,}\s*\+\s*\d{1,}/;
  const subRegex = /\d{1,}\s*-\s*\d{1,}/;
  const divideRegex = /\d{1,}\s*\/\s*\d{1,}/;
  const multiplyRegex = /\d{1,}\s*\*\s*\d{1,}/;
  const exponentRegex = /\d{1,}\s*\^\s*\d{1,}/;
  const bracketRegex = /\([0-9+-/*^ ]+\)/;

  if (exponentRegex.test(expression)) {
    console.log("exponenet");
    expression = solveOperation(expression, exponentRegex, "^");
  }

  console.log(expression);
}

function solveOperation(expression, regex, operation) {
  expression.match(new RegExp(regex, "g")).forEach((arr) => {
    const exp = arr.split(operation).map((num) => num.trim());
    expression = expression.replace(regex, Math.pow(exp[0], exp[1]));
  });

  return expression;
}

function solveExponent(expression, exponentRegex) {
  const exp = expression
    .match(exponentRegex)[0]
    .split("^")
    .map((num) => num.trim());
  return expression.replace(exponentRegex, Math.pow(exp[0], exp[1]));
}
