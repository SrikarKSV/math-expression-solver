const form = document.querySelector("form");
const result = document.querySelector("p");

form.addEventListener("submit", handleSubmit);

function handleSubmit(e) {
  e.preventDefault();

  const bracketRegex = /\([0-9+-/*^ ]+\)/;
  let expression = e.target.expression.value.trim();

  if (bracketRegex.test(expression)) {
    expression.match(new RegExp(bracketRegex, "g")).forEach((rawExp) => {
      const solvedExp = solveExpression(rawExp.replace(/[()]/g, ""));
      expression = expression.replace(rawExp, solvedExp);
    });
    console.log("After bracket", expression);
  }

  expression = solveExpression(expression);

  // TODO: Do something about expression like (3-4) / (2-3)
  result.textContent = `Result: ${expression}`;
  console.log(expression);
}

function solveExpression(expression) {
  if (!expression) return 0;

  const addOrSubRegex =
    /(?<![\+|-])([0-9]+\.?[0-9]*|\.[0-9]+)\s*(\+|-)\s*([0-9]+\.?[0-9]*|\.[0-9]+)/;
  const divideOrMultiplyRegex =
    /(?<![\/|\*])([0-9]+\.?[0-9]*|\.[0-9]+)\s*(\/|\*)\s*([0-9]+\.?[0-9]*|\.[0-9]+)/;
  const exponentRegex =
    /([0-9]+\.?[0-9]*|\.[0-9]+)\s*(\^)\s*([0-9]+\.?[0-9]*|\.[0-9]+)/;

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
  console.log("Matches", expression.match(new RegExp(regex, "g")));
  expression.match(new RegExp(regex, "g")).forEach((rawExp) => {
    console.log("Expression", rawExp);
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

    console.log("Result", result);
    expression = expression.replace(rawExp, result.toString());
  });

  if (regex.test(expression)) return solveOperation(expression, regex);

  return expression;
}
