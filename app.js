const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  solveExpression(e.target.expression.value);
});

function handleSubmit(e) {
  e.preventDefault();

  const bracketRegex = /\([0-9+-/*^ ]+\)/;
  const expression = e.target.expression.value.trim();

  expression = solveExpression(expression);
  console.log(expression);
}

function solveExpression(expression) {
  if (!expression) return 0;

  const addOrSubRegex =
    /(?<![\+|-])([0-9]+\.?[0-9]*|\.[0-9]+)\s*(\+|-)\s*([0-9]+\.?[0-9]*|\.[0-9]+)/;
  //   const subRegex = /\d{1,}\s*-\s*\d{1,}/;
  const divideOrMultiplyRegex =
    /(?<![\/|\*])([0-9]+\.?[0-9]*|\.[0-9]+)\s*(\/|\*)\s*([0-9]+\.?[0-9]*|\.[0-9]+)/;
  //   const multiplyRegex = /\d{1,}\s*\*\s*\d{1,}/;
  const exponentRegex =
    /([0-9]+\.?[0-9]*|\.[0-9]+)\s*(\^)\s*([0-9]+\.?[0-9]*|\.[0-9]+)/;
  const bracketRegex = /\([0-9+-/*^ ]+\)/;

  if (exponentRegex.test(expression))
    expression = solveOperation(expression, exponentRegex);

  if (divideOrMultiplyRegex.test(expression))
    expression = solveOperation(expression, divideOrMultiplyRegex);

  if (addOrSubRegex.test(expression))
    expression = solveOperation(expression, addOrSubRegex);

  return expression;
}

function solveOperation(expression, regex) {
  console.log("Initial", expression);
  console.log(expression.match(new RegExp(regex, "g")));
  expression.match(new RegExp(regex, "g")).forEach((rawExp) => {
    const operation = rawExp.match(regex)[2];
    const exp = rawExp.split(operation).map((num) => num.trim());
    console.log(operation);

    let result;

    switch (operation) {
      case "^": {
        result = Math.pow(Number(exp[0]), Number(exp[1]));
        break;
      }
      case "*": {
        result = Number(exp[0]) * Number(exp[1]);
        break;
      }
      case "/": {
        result = Number(exp[0]) / Number(exp[1]);
        break;
      }
      case "-": {
        result = Number(exp[0]) - Number(exp[1]);
        break;
      }
      case "+": {
        result = Number(exp[0]) + Number(exp[1]);
        break;
      }
    }

    expression = expression.replace(rawExp, result.toString());
    console.log("END", expression);
  });

  if (regex.test(expression)) return solveOperation(expression, regex);

  return expression;
}
