const operators = ["=", "+", "(", ","];

export function ablFormatter(model) {
  //   console.log(model.getValue());
  const codeText = model.getValue();
  const codeArray = codeText.split("\n");

  let newText = codeText;
  let indent = 0;
  let lAssign = false;
  let lFunc = false;
  let lIfElse = true;
  let lElseIf = false;
  let lIf = false;
  let lElse = false;
  let lDo = false;
  let lDef = false;
  let lWhen = false;
  let lComment = false;
  let lDisp = false;
  let lQuote = false;
  let lRun = false;
  let lFind = false;
  let lOpenQuery = false;
  let lCase = false;
  let lForm = false;
  let lMessage = false;
  let formattedText = "";
  const tokens = [];
  const ifToken = [];
  const elseToken = [];
  // console.clear();
  for (let i = 0; i < codeArray.length; i += 1) {
    let line = codeArray[i].trim();
    let lowline = line.toLowerCase();
    let quotePos = -1;
    line = formatChar(line);

    // const lastIndent = tokens[tokens.length - 1]
    //   ? tokens[tokens.length - 1]?.indent
    //   : 0;
    if (indent < 0) indent = 0;
    // console.log(i, indent);
    // if (indent < lastIndent) indent = lastIndent;

    if (lowline.startsWith("/*")) {
      formattedText = formatLine(formattedText, line, indent);
      lComment = true;
      if (lowline.endsWith("*/")) lComment = false;
      // tokens.push(addToken("comment", i, lComment));
      continue;
    }

    if (lowline.endsWith("*/")) {
      if (lComment === true) {
        formattedText = formatLine(formattedText, line, indent);
        lComment = false;
        // tokens.push(addToken("comment", i, lComment));
        continue;
      }
      if (lowline.indexOf("/*") > -1) {
        lowline = lowline.substring(0, lowline.indexOf("/*"))?.trim();
        // console.log(i, lowline);
      }
    }
    if (lowline.startsWith("//") || lComment === true) {
      formattedText = formatLine(formattedText, line, indent);
      continue;
    }

    if (lowline.startsWith("'") || lowline.startsWith('"')) lQuote = true;
    if (lowline.endsWith("'") || lowline.endsWith('"')) lQuote = false;

    if (lowline.indexOf("'") > -1) quotePos = lowline.indexOf("'");
    if (lowline.indexOf('"') > -1) {
      quotePos =
        quotePos !== -1 && quotePos < lowline.indexOf('"')
          ? quotePos
          : lowline.indexOf('"');
    }

    console.log(i, lowline, { lDo, lIf, lElse, lElseIf, lAssign, indent });

    // if (lowline.startsWith("if")) {
    //   ifToken.push(addToken("if", i, null, indent));
    // }
    // if (lowline.startsWith("else")) {
    //   ifToken.push(addToken("else", i, null, indent));
    // }
    // console.log({
    //   line: i,
    //   content: lowline,
    //   indent,
    //   lAssign,
    //   lIf,
    //   lElse,
    //   lDo,
    //   lWhen,
    //   lDisp,
    //   lFunc,
    //   lQuote,
    // });
    if (
      lowline.startsWith("for ") ||
      lowline.indexOf(" for each ") > -1 || // then for each :
      lowline.indexOf(" for first ") > -1 || // then for first :
      lowline.indexOf(" for last ") > -1 || // then for last :
      lowline.startsWith("do:") ||
      lowline.indexOf(" do ") > -1 ||
      lowline.startsWith("repeat") ||
      lowline.startsWith("assign") ||
      lowline.startsWith("function ") ||
      lowline.startsWith("procedure ") ||
      lowline.startsWith("finally") ||
      lowline.startsWith("catch") ||
      lowline.startsWith("if") ||
      lowline.startsWith("else") ||
      lowline.startsWith("def ") ||
      lowline.startsWith("define ") ||
      lowline.startsWith("case ") ||
      lowline.startsWith("when ") ||
      lowline.startsWith("run ") ||
      lowline.startsWith("put ") ||
      lowline.startsWith("export ") ||
      lowline.startsWith("find ") ||
      lowline.startsWith("disp") ||
      lowline.startsWith("form ") ||
      // lowline.indexOf("message") > -1 ||
      lowline === "form"
      // lowline.indexOf(" = ") > -1
    ) {
      if (lowline.startsWith("for ") || lowline.startsWith("repeat")) {
        tokens.push(addToken("for", i, null, indent));
      }

      // console.log(lowline, i, indent);
      if (lowline.startsWith("do:")) {
        lDo = true;
        tokens.push(addToken("do", i, null, indent));
        if (lIf === true || lElse === true) {
          lIf = false;
          lElse = false;
          indent -= 1;

          for (let j = tokens.length - 1; j > -1; j -= 1) {
            if (tokens[j].type === "if" && tokens[j].close === null) {
              tokens.splice(j, 1);
              break;
            }
          }
        }

        if (lWhen === true) {
          lWhen = false;
          indent -= 1;
        }
        // if (ifToken) ifToken[ifToken.length - 1].close = i;
      }
      // console.log(i, lowline, lIf, lElse, lElseIf, lAssign, indent);
      if (lowline.startsWith("when ")) {
        // if (lWhen === false){
        // console.log(lowline, lowline.endsWith(" do:"), lowline.endsWith("."));
        // console.log({ i, lCase, lWhen, lDo, indent });

        if (lowline.endsWith(" do:") || lowline.endsWith(".")) {
          if (lowline.endsWith(".")) indent -= 1;
          // console.log("When do. No when flag");
          if (lowline.endsWith("do:"))
            tokens.push(addToken("do", i, null, indent));
          lWhen = false;
        } else {
          if (lWhen) {
            indent -= 1;
          }
          lWhen = true;
        }
        // console.log({ i, lCase, lWhen, lDo, indent });
        formattedText = formatLine(formattedText, line, indent);
        indent += 1;
        continue;
        // }
      }

      formattedText = formatLine(formattedText, line, indent);

      if (
        lowline.indexOf(" for each ") > -1 || // then for each :
        lowline.indexOf(" for first ") > -1 || // then for first :
        lowline.indexOf(" for last ") > -1
      ) {
        const eachIndex = lowline.indexOf(" for each ");
        const lastIndex = lowline.indexOf(" for last ");
        const firstIndex = lowline.indexOf(" for first ");
        // console.log(" FOR Intermediate", {
        //   eachIndex,
        //   lastIndex,
        //   firstIndex,
        //   quotePos,
        // });
        if (
          quotePos > -1 &&
          (eachIndex > quotePos ||
            lastIndex > quotePos ||
            firstIndex > quotePos)
        )
          continue;
        // console.log(" FOR Intermediate");
        tokens.push(addToken("for", i, null, indent));
      }

      indent += 1;

      if (lowline.startsWith("case")) {
        lCase = true;
        tokens.push(addToken("case", i, null, indent));
      }

      if (lowline.startsWith("open query")) {
        lOpenQuery = true;
        if (lowline.endsWith(".")) {
          lOpenQuery = false;
          indent -= 1;
        }
      }

      if (lowline.startsWith("form ") || lowline === "form") {
        lForm = true;
        if (lowline.endsWith(".")) {
          lForm = false;
          indent -= 1;
        }
      }

      if (lowline.startsWith("run ")) {
        lRun = true;
        if (lowline.endsWith(".")) {
          lRun = false;
          indent -= 1;

          lIf = false;
          lElse = false;

          for (let j = tokens.length - 1; j > -1; j -= 1) {
            const token = tokens[j];
            if (token.type === "if" && token.close === null) {
              indent -= 1;
              tokens[j].indent = indent;
              tokens[j].close = i;
            }
          }
        }
      }

      if (lowline.startsWith("find ")) {
        lFind = true;
        if (lowline.endsWith(".") || lIf || lElse || lElseIf) {
          lFind = false;
          indent -= 1;

          lIf = false;
          lElse = false;
          lElseIf = false;

          for (let j = tokens.length - 1; j > -1; j -= 1) {
            const token = tokens[j];
            if (token.type === "if" && token.close === null) {
              indent -= 1;
              tokens[j].indent = indent;
              tokens[j].close = i;
            }
          }
        }
      }

      if (
        lowline.startsWith("disp") ||
        lowline.startsWith("put ") ||
        lowline.startsWith("export ")
      ) {
        lDisp = true;
        if (lowline.endsWith(".")) {
          lDisp = false;
          indent -= 1;
          if (lIf || lElse) {
            indent -= 1;
            lIf = false;
            lElse = false;
          }
          continue;
        }
      }

      if (lowline.startsWith("assign")) {
        if (lowline.endsWith(".")) {
          indent -= 1;
          lAssign = false;

          if (lIf || lElse || lWhen) {
            indent -= 1;
            lIf = false;
            lElse = false;
            lWhen = false;

            for (let j = tokens.length - 1; j > -1; j -= 1) {
              const token = tokens[j];
              if (token.type === "if" && token.close === null) {
                // indent -= 1;
                tokens[j].indent = indent;
                tokens[j].close = i;
              }
            }
          }
          continue;
        } else lAssign = true;
      }

      if (lowline.indexOf(" do ") > -1 && lowline.indexOf(" do ") < quotePos) {
        if (lowline.startsWith("'") || lowline.startsWith('"')) continue;

        lDo = true;
        tokens.push(addToken("do", i, null, indent));
      }
      if (lowline.startsWith("def ") || lowline.startsWith("define ")) {
        lDef = true;
        if (lowline.endsWith(".")) {
          lDef = false;
          indent -= 1;
        }
      }

      if (lowline.startsWith("if") || lowline.startsWith("else")) {
        if (lowline.endsWith(".")) {
          indent -= 1;

          if (lAssign === true) {
            lAssign = false;
            indent -= 1;
          }
          if (lIf || lElse) {
            indent -= 1;
            lIf = false;
            lElse = false;
            for (let j = tokens.length - 1; j > -1; j -= 1) {
              const token = tokens[j];
              if (token.type === "if" && token.close === null) {
                // console.log("Closing", tokens[j]);
                // indent -= 1;
                tokens[j].indent = indent;
                tokens[j].close = i;
              }
            }
          }
          // console.log("Dot", i, lowline, lIf, lElse, lElseIf, lAssign, indent);
          // continue;
        } else {
          if (lowline.startsWith("if")) {
            // ifToken.push(addToken("if", i, null, indent));

            if (lAssign === true || lDisp === true) {
              indent -= 1;
            } else {
              tokens.push(addToken("if", i, null, indent));
              lIf = true;
              if (lElse) {
                lElse = false;
                lIf = false;
                for (let j = tokens.length - 1; j > -1; j -= 1) {
                  if (tokens[j].type === "if" && tokens[j].close === null) {
                    indent -= 1;
                    tokens.splice(j, 1);
                    break;
                  }
                }
                lElseIf = true;
                // indent -= 1;
              }
            }
          }
          if (lowline.startsWith("else")) {
            // ifToken.push(addToken("else", i, null, indent));
            if (lAssign === true || lDisp === true || lElse === true) {
              indent -= 1;
            } else {
              tokens.push(addToken("if", i, null, indent));
              if (lAssign === true) indent -= 1;
              else lElse = true;
            }
          }
          // lIfElse = true;
        }
        if (lowline.endsWith("do:")) {
          if (lowline.startsWith("if")) {
            lIf = false;
            // if (ifToken) ifToken.splice(ifToken.length - 1, 1);
            for (let j = tokens.length - 1; j > -1; j -= 1) {
              if (tokens[j].type === "if" && tokens[j].close === null) {
                tokens.splice(j, 1);
                break;
              }
            }
          }
          if (lowline.startsWith("else")) {
            // if (ifToken) ifToken.splice(ifToken.length - 1, 1);
            for (let j = tokens.length - 1; j > -1; j -= 1) {
              if (tokens[j].type === "if" && tokens[j].close === null) {
                tokens.splice(j, 1);
                break;
              }
            }
            lElse = false;
          }

          // lElse = false;
          lDo = true;
          tokens.push(addToken("do", i, null, indent));
        }
      }

      if (lowline.startsWith("function ")) {
        if (
          lowline.endsWith(" forward.") ||
          (lowline.indexOf(" in ") > -1 && lowline.endsWith("."))
        )
          indent -= 1;
        else lFunc = true;
        // console.log(line, indent);
      }

      // if (lowline.indexOf(" = ") > -1) {
      //   lAssign = true;
      //   if (lowline.endsWith(".")) {
      //     lAssign = false;
      //     indent -= 1;
      //   }
      // }
      continue;
    }

    if (lowline.endsWith(" forward.")) {
      // console.log(line, indent);
      formattedText = formatLine(formattedText, line, indent);
      indent -= 1;
      lFunc = false;
      continue;
    }

    if (lowline.startsWith("do ")) {
      if (lIf === true || lElse === true) {
        indent -= 1;
        lIf = false;
        lElse = false;
        // if (ifToken) ifToken.splice(ifToken.length - 1, 1);
        for (let j = tokens.length - 1; j > -1; j -= 1) {
          if (tokens[j].type === "if" && tokens[j].close === null) {
            tokens.splice(j, 1);
            break;
          }
        }
      }
      if (lWhen === true) {
        indent -= 1;
        lWhen = false;
      }
      formattedText = formatLine(formattedText, line, indent);
      lDo = true;
      tokens.push(addToken("do", i, null, indent));
      indent += 1;
      continue;
    }

    if (lowline.endsWith("do:")) {
      if (lIf === true || lElse === true) {
        indent -= 1;
        // if (ifToken) ifToken.splice(ifToken.length - 1, 1);
        for (let j = tokens.length - 1; j > -1; j -= 1) {
          if (tokens[j].type === "if" && tokens[j].close === null) {
            tokens.splice(j, 1);
            break;
          }
        }
      }
      if (lWhen === true) indent -= 1;
      formattedText = formatLine(formattedText, line, indent);
      lIf = false;
      lElse = false;
      lWhen = false;
      lDo = true;
      tokens.push(addToken("do", i, null, indent));
      indent += 1;
      continue;
    }

    if (lowline.startsWith("end.") || lowline.startsWith("end ")) {
      indent -= 1;
      formattedText = formatLine(formattedText, line, indent);
      lFunc = false;
      lDo = false;

      // if (tokens[tokens.length - 1]) tokens[tokens.length - 1].indent = indent;
      let doLine = { i: 0, index: -1 };
      let forLine = { i: 0, index: -1 };
      let caseLine = { i: 0, index: -1 };

      for (let j = tokens.length - 1; j > -1; j -= 1) {
        const token = tokens[j];
        if (token.type === "case" && token.close === null) {
          // tokens[j].indent = indent;
          // tokens[j].close = i;
          caseLine.i = token.open;
          caseLine.index = j;
          break;
        }
      }

      for (let j = tokens.length - 1; j > -1; j -= 1) {
        const token = tokens[j];
        if (token.type === "for" && token.close === null) {
          // tokens[j].indent = indent;
          // tokens[j].close = i;
          forLine.i = token.open;
          forLine.index = j;
          break;
        }
      }

      for (let j = tokens.length - 1; j > -1; j -= 1) {
        const token = tokens[j];
        if (token.type === "do" && token.close === null) {
          // tokens[j].indent = indent;
          // tokens[j].close = i;
          doLine.i = token.open;
          doLine.index = j;
          break;
        }
      }

      // console.log(doLine, forLine, caseLine);
      if (forLine.i > doLine.i) {
        tokens[forLine.index].close = i;
        tokens[forLine.index].indent = indent;
        continue;
      }

      if (caseLine.i > doLine.i) {
        tokens[caseLine.index].close = i;
        tokens[caseLine.index].indent = indent;
        continue;
      }

      if (tokens[doLine.index]) {
        tokens[doLine.index].indent = indent;
        tokens[doLine.index].close = i;
      }

      for (let j = tokens.length - 1; j > -1; j -= 1) {
        const token = tokens[j];
        if (token.type === "if" && token.close === null) {
          indent -= 1;
          tokens[j].indent = indent;
          tokens[j].close = i;
        }
      }

      // lIfElse = false;
      if (lElseIf === true) {
        lElseIf = false;
        indent -= 1;
        // console.log(i + 1, line, indent);
      }

      // lIf = false;
      continue;
    }

    if (lowline.endsWith(".")) {
      console.log({
        lOpenQuery,
        lDo,
        lIf,
        lElse,
        lElseIf,
        lWhen,
        lDisp,
        lAssign,
        lRun,
        lFind,
        lDef,
      });
      if (lOpenQuery === true) {
        lOpenQuery = false;
        indent -= 1;
      }

      if (lForm === true) {
        formattedText = formatLine(formattedText, line, indent);
        lForm = false;
        indent -= 1;
        continue;
      }

      if (lRun === true) {
        formattedText = formatLine(formattedText, line, indent);
        lRun = false;
        indent -= 1;

        lIf = false;
        lElse = false;
        for (let j = tokens.length - 1; j > -1; j -= 1) {
          const token = tokens[j];
          if (token.type === "if" && token.close === null) {
            indent -= 1;
            tokens[j].indent = indent;
            tokens[j].close = i;
          }
        }
        continue;
      }

      if (lWhen === true) {
        formattedText = formatLine(formattedText, line, indent);
        indent -= 1;
        // console.log(i, indent);
        lWhen = false;

        if (lAssign) {
          lAssign = false;
          indent -= 1;
        }
        if (lIf || lElse) {
          indent -= 1;
          lIf = false;
          lElse = false;
          lElseIf = false;
          for (let j = tokens.length - 1; j > -1; j -= 1) {
            const token = tokens[j];
            if (token.type === "if" && token.close === null) {
              tokens[j].indent = indent;
              tokens[j].close = i;
            }
          }
        }
        continue;
      }

      if (lFind === true) {
        formattedText = formatLine(formattedText, line, indent);
        indent -= 1;
        // console.log(i, indent);
        lFind = false;

        continue;
      }

      if (lAssign === true && (lIf === true || lElse === true)) {
        formattedText = formatLine(formattedText, line, indent);
        indent -= 2;
        lAssign = false;

        lIf = false;
        lElse = false;

        for (let j = tokens.length - 1; j > -1; j -= 1) {
          const token = tokens[j];
          if (token.type === "if" && token.close === null) {
            tokens[j].indent = indent;
            tokens[j].close = i;
          }
        }

        continue;
      }
      if (lIf === true) {
        formattedText = formatLine(formattedText, line, indent);

        lIf = false;

        if (lElseIf) lElse = false;
        lElseIf = false;

        for (let j = tokens.length - 1; j > -1; j -= 1) {
          const token = tokens[j];
          if (token.type === "if" && token.close === null) {
            console.log("Closing", tokens[j]);
            indent -= 1;
            tokens[j].indent = indent;
            tokens[j].close = i;
          }
        }
        if (lDisp) {
          indent -= 1;
          lDisp = false;
        }
        continue;
      }
      if (lElse === true) {
        formattedText = formatLine(formattedText, line, indent);

        lElse = false;
        lElseIf = false;
        for (let j = tokens.length - 1; j > -1; j -= 1) {
          const token = tokens[j];
          if (token.type === "if" && token.close === null) {
            indent -= 1;
            tokens[j].indent = indent;
            tokens[j].close = i;
          }
        }
        continue;
      }
      if (lDisp === true) {
        // formattedText = formatLine(formattedText, line, indent);
        indent -= 1;
        lDisp = false;

        lIf = false;
        lElse = false;
        for (let j = tokens.length - 1; j > -1; j -= 1) {
          const token = tokens[j];
          if (token.type === "if" && token.close === null) {
            indent -= 1;
            tokens[j].indent = indent;
            tokens[j].close = i;
          }
        }
        // continue;
      }

      if (lAssign === true || lDef === true) {
        formattedText = formatLine(formattedText, line, indent);
        indent -= 1;
        lAssign = false;
        lDef = false;
        continue;
      }

      if (lFunc && lowline.indexOf("in ") > -1) {
        formattedText = formatLine(formattedText, line, indent);
        indent -= 1;
        lFunc = false;
        continue;
      }
    }

    formattedText = formatLine(formattedText, line, indent);
  }
  console.log(tokens);
  return formattedText;
}

const handleIndent = (line, tabCount) => {
  //   console.log(line);
  //   console.log(tabCount);
  if (tabCount < 0) tabCount = 0;
  const spaceString = new Array(tabCount + 1).join("    ");

  // console.log(spaceString, line);

  const str = spaceString + (line ?? "");
  if (str === "undefined") return "";

  return str ?? "";
};

const formatLine = (formattedText, line, indent) => {
  const indentLine = handleIndent(line, indent);
  formattedText += formattedText === "" ? indentLine : `\n${indentLine}`;
  return formattedText;
};

const formatChar = (line) => {
  if (!line) return;
  let newLine = "";
  let lOperator = false;
  let lOpen = false;
  let lClose = false;

  for (let i = 0; i < line.length; i += 1) {
    let char = line[i];

    if (lOperator) {
      if (char !== " ") char = " " + char;
      lOperator = false;
    }
    lOperator = operators.indexOf(char) > -1;

    newLine += char;
  }
  //   console.log(newLine);
  return newLine;
};

const addToken = (type, open, close, indent) => {
  const token = { type, open, close, indent };
  return token;
};
