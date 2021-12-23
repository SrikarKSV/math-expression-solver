const form = document.querySelector("form");
const result = document.querySelector("p");

form.addEventListener("submit", handleSubmit);

function handleSubmit(e) {
  e.preventDefault();

  let expression = e.target.expression.value.trim();

  const bracketRegex = /\([0-9+-/*^ ]+\)/;

  if (bracketRegex.test(expression)) {
    expression.match(new RegExp(bracketRegex, "g")).forEach((rawExp) => {
      const solvedExp = solveExpression(rawExp.replace(/[()]/g, ""));
      expression = expression.replace(rawExp, solvedExp);
    });
  }

  expression = solveExpression(expression);

  result.textContent = `Result: ${expression}`;
}

function solveExpression(expression) {
  if (!expression) return 0;

  const addOrSubRegex =
    /([-]?\s*([0-9]+\.?[0-9]*|\.[0-9]+))\s*(\+|-)\s*([-]?\s*([0-9]+\.?[0-9]*|\.[0-9]+))/;

  const divideOrMultiplyRegex =
    /(?<![\/|\*]\s*)([-]?\s*([0-9]+\.?[0-9]*|\.[0-9]+))\s*(\/|\*)\s*([-]?\s*([0-9]+\.?[0-9]*|\.[0-9]+))/;

  // Find basic expressions like 5 ^ 3
  const exponentRegex =
    /([0-9]+\.?[0-9]*|\.[0-9]+)\s*(\^)\s*([0-9]+\.?[0-9]*|\.[0-9]+)/;

  if (exponentRegex.test(expression))
    expression = solveOperation(expression, exponentRegex);

  if (divideOrMultiplyRegex.test(expression))
    expression = solveOperation(expression, divideOrMultiplyRegex);

  if (addOrSubRegex.test(expression))
    expression = solveOperation(expression, addOrSubRegex);

  if (/ /g.test(expression)) {
    expression = expression
      .split(" ")
      .reduce((prev, current) => Number(prev) + Number(current), 0);
  }

  return expression;
}

function solveOperation(expression, regex) {
  expression.match(new RegExp(regex, "g")).forEach((rawExp) => {
    console.log("Expression", rawExp);
    const exp = rawExp.match(regex);

    const operation = exp.length === 4 ? exp[2] : exp[3];
    let num1 = Number(exp[1].replace(/ /g, "")); // Space between sign and value is removed
    let num2 = exp.length === 4 ? exp[3] : exp[4];
    num2 = Number(num2.replace(/ /g, ""));

    let result;

    switch (operation) {
      case "^": {
        result = Math.pow(num1, num2);
        break;
      }
      case "*": {
        result = num1 * num2;
        break;
      }
      case "/": {
        result = num1 / num2;
        break;
      }
      case "-": {
        result = num1 - num2;
        break;
      }
      case "+": {
        result = num1 + num2;
        break;
      }
    }

    expression = expression.replace(rawExp, result.toString());
  });

  if (regex.test(expression)) return solveExpression(expression, regex);

  return expression;
}
