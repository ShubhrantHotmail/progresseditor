// import {
//   attributes,
//   attributesDashed,
//   builtinFunctions,
//   builtinVariables,
//   keywords,
//   keywordsDashed,
// } from "../languages/kewords";
// import { getComments } from "../parser/sourceParser";

function expandVariable(variable) {
  switch (variable?.toLowerCase()) {
    case "char":
      return "CHARACTER";
    case "int":
      return "INTEGER";
    case "dec":
    case "deci":
      return "DECIMAL";
    case "log":
      return "LOGICAL";
    default:
      return variable;
  }
}

export function parseTokens(monaco, codeText) {
  const tokens = monaco.editor.tokenize(codeText, "abl");
  const codeLines = codeText?.split("\n");
  const tokenList = [];

  tokens.map((token, index) => {
    if (token?.length === 1) {
      tokenList.push({
        lineNumber: index + 1,
        startColumn: 0,
        endColumn: codeLines[index]?.length - 1,
        tokenType: token[0]?.type,
        text: codeLines[index],
      });
    } else {
      token?.map((word, idx) => {
        let text = "";
        if (!token[idx + 1]) text = codeLines[index]?.substring(word?.offset);
        else
          text = codeLines[index]?.substring(
            word?.offset,
            token[idx + 1]?.offset
          );
        tokenList.push({
          lineNumber: index + 1,
          startColumn: word?.offset,
          endColumn: token[idx + 1]?.offset - 1,
          tokenType: word?.type,
          text: text,
        });
      });
    }
  });

  return tokenList;
}

export function toggleCase(monaco, editor, caseType) {
  if (
    !caseType ||
    ["lower", "lowercase", "upper", "uppercase"].indexOf(
      caseType.toLowerCase()
    ) < 0
  )
    return;
  const text = editor.getValue();
  const tokens = parseTokens(monaco, text);
  const codeLines = text.split("\n");

  let newText = "";

  for (let i = 0; i < codeLines.length; i += 1) {
    const token = tokens?.filter((item) => item?.lineNumber === i + 1);
    if (token) {
      token?.map((text) => {
        if (
          text?.tokenType === "keyword.p" ||
          text?.tokenType === "variable.p" ||
          text?.tokenType === "tag.p"
        )
          newText =
            caseType.toLowerCase() === "upper" ||
            caseType.toLowerCase() === "uppercase"
              ? newText + text?.text?.toUpperCase()
              : newText + text?.text?.toLowerCase();
        else newText = newText + text?.text;
      });
    } else newText = newText + "";
    newText += "\n";
  }
  // tokens.map((token, index) => {
  //   if (prevLineNumber < token?.lineNumber) newText = newText + "\n";
  //   if (
  //     token?.tokenType === "keyword.p" ||
  //     token?.tokenType === "variable.p" ||
  //     token?.tokenType === "tag.p"
  //   )
  //     newText =
  //       caseType.toLowerCase() === "upper" ||
  //       caseType.toLowerCase() === "uppercase"
  //         ? newText + token?.text?.toUpperCase()
  //         : newText + token?.text?.toLowerCase();
  //   else newText = newText ? newText + token?.text : newText + "\r";
  //   prevLineNumber = token?.lineNumber;
  // });

  // const newText = text.replace(/\b(\w+)\b/g, function (match, p1) {
  //   if (
  //     keywords.indexOf(p1.toUpperCase()) > -1 ||
  //     attributes.indexOf(p1.toUpperCase()) > -1 ||
  //     attributesDashed.indexOf(p1.toUpperCase()) > -1 ||
  //     builtinFunctions.indexOf(p1.toUpperCase()) > -1 ||
  //     builtinVariables.indexOf(p1.toUpperCase()) > -1 ||
  //     keywordsDashed.indexOf(p1.toUpperCase()) > -1
  //   ) {
  //     if (
  //       caseType.toLowerCase() === "upper" ||
  //       caseType.toLowerCase() === "uppercase"
  //     )
  //       return p1.toUpperCase();
  //     return p1.toLowerCase();
  //   }
  //   return p1;
  // });
  if (newText !== text) {
    const selection = editor.getSelection();
    editor.executeEdits("", [
      {
        range: new monaco.Range(
          1,
          1,
          editor.getModel().getLineCount(),
          editor.getModel().getLineMaxColumn(editor.getModel().getLineCount())
        ),
        text: newText,
      },
    ]);
    editor.setSelection(selection);
  }
}

export function cleanupComments(monaco, editor) {
  const text = editor.getValue();
  const tokens = parseTokens(monaco, text);
  const codeLines = text.split("\n");

  let newText = "";

  for (let i = 0; i < codeLines.length; i += 1) {
    const token = tokens?.filter((item) => item?.lineNumber === i + 1);
    if (token?.length === 1 && token?.[0]?.tokenType === "comment.p") continue;
    if (token) {
      token?.map((text) => {
        if (text?.tokenType !== "comment.p") newText = newText + text?.text;
      });
    } else newText = newText + "";
    newText += "\n";
  }

  if (newText !== text) {
    const selection = editor.getSelection();
    editor.executeEdits("", [
      {
        range: new monaco.Range(
          1,
          1,
          editor.getModel().getLineCount(),
          editor.getModel().getLineMaxColumn(editor.getModel().getLineCount())
        ),
        text: newText,
      },
    ]);
    editor.setSelection(selection);
  }
}

export function formatCode(model, monaco) {
  let formatModel = [];
  let blocks = ["do", "for", "repeat", "case", "catch", "finally"];
  let lComment = false;
  let iComment = 0;
  let lFunc = false;
  let lPut = false;
  /***
   * Below variables are used to format variable assignments
   */
  let assign = 0;
  let lAssign = false;
  const assignments = [];
  let prevLength = 0;
  /***
   * Below variables are used to format temp-table fields
   */
  let field = 0;
  let lField = false;
  const fields = [];
  let prevFieldLength = 0;
  /***
   * Below variables are used to format define variable
   * Not applied to parmeters
   */
  let define = 0;
  let lDefine = false;
  const defines = [];
  let prevDefineLength = 0;
  let prevVarLength = 0;
  /***
   * Below variables are used to format &scoped-define
   */
  let prevScopeLength = 0;
  const scoped = [];
  let scopeNum = 0;

  let prev = null;
  let indent = 0;
  let codeText = model.getValue(); //.replace(new RegExp(/^\s+|\s+$/, "gm"), "");
  // codeText = codeText.replace(new RegExp(/assign /, "ig"), "ASSIGN\n");
  // codeText = codeText.replace(new RegExp(/(?!\s).*(?= do:)/, "ig"), new RegExp(/(?!\s).*(?= do:)/, "ig") + "\nDO:");
  // codeText = codeText.replace(new RegExp(/def /, "ig"), "DEFINE ");
  // codeText = codeText.replace(new RegExp(/ var /, "ig"), " VARIABLE ");

  const defRegex = new RegExp(/(def)(\s+)/, "igm");
  let replToken = defRegex.exec(codeText);

  while (replToken) {
    codeText = codeText.replace(replToken?.[0], "DEFINE ");
    replToken = defRegex.exec(codeText);
  }

  const varRegex = new RegExp(/(var)(\s+)/, "igm");
  replToken = varRegex.exec(codeText);

  while (replToken) {
    codeText = codeText.replace(replToken?.[0], "VARIABLE ");
    replToken = varRegex.exec(codeText);
  }

  const tokens = parseTokens(monaco, codeText);

  const codeLines = codeText.split("\n");
  let formattedText = "";

  function formatDefineStatement(line, i, mode) {
    if (mode === "define") {
      if (lDefine === false) {
        define += 1;
        lDefine = true;
        prevDefineLength = 0;
        prevVarLength = 0;
      }
    } else {
      if (lField === false) {
        field += 1;
        lField = true;
        prevFieldLength = 0;
        prevVarLength = 0;
      }
    }
    const defineExp =
      mode === "define"
        ? new RegExp(/(?<=define variable)(\s+[-_a-zA-Z0-9]+\s+)/, "i")
        : new RegExp(/(?<=field)(\s+[-_a-zA-Z0-9]+\s+)/, "i");
    // const varExp = new RegExp(/(?<=as)(\s+\w+\s+)/, "i");
    const varExp = new RegExp(
      /(?<=as)(\s+[-_.a-zA-Z0-9]+\s+)|(?<=as)(\s+[-_.a-zA-Z0-9]+)|(?<=like)(\s+[-_.a-zA-Z0-9]+\s+)|(?<=like)(\s+[-_.a-zA-Z0-9]+)/,
      "i"
    );

    const text = defineExp.exec(line)?.[0]?.trim();
    const vartype = expandVariable(varExp.exec(line)?.[0]?.trim());

    const maxLength =
      text?.length < prevDefineLength ? prevDefineLength : text?.length;
    const vartypeLength =
      vartype?.length < prevVarLength ? prevVarLength : vartype?.length;

    defines.push({
      mode,
      index: mode === "define" ? define : field,
      lineNumber: i + 1,
      line,
      beforeText: text,
      beforeLength: text?.length,
      maxLength,
      beforeVartypeText: vartype,
      beforeVartypeLength: vartype?.length ?? 0,
      vartypeLength,
    });

    defines.forEach((args) => {
      if (
        args.mode === mode &&
        args.index === (mode === "define" ? define : field)
      ) {
        args.maxLength = maxLength;
        args.vartypeLength = vartypeLength;

        const obj = formatModel.find((item) => item.start === args.lineNumber);
        const pad = maxLength - args?.beforeLength;
        const str =
          " " + args.beforeText + String.fromCharCode(32).repeat(pad + 1);

        const padVar = vartypeLength - args?.beforeVartypeLength;
        const strVar =
          (args.line?.toLowerCase()?.indexOf(" as ") > -1 ? "   " : " ") +
          args.beforeVartypeText +
          String.fromCharCode(32).repeat(padVar + 1);
        // const afterText = " " + afterExp.exec(cleanLine)?.[0]?.trim();

        if (obj) {
          obj.lineText = obj.lineText.replace(defineExp, str);
          obj.lineText = obj.lineText.replace(varExp, strVar);
          // if (afterText !== "undefined")
          //   obj.lineText = obj.lineText.replace(afterExp, afterText);
        } else {
          line = line.replace(defineExp, str);
          line = line.replace(varExp, strVar);
        }
      }
    });
    prevDefineLength = maxLength;
    prevVarLength = vartypeLength;
    return line;
  }

  // Add new token to register a line with its indent
  const addToken = (type, token, start, end, lineText) => {
    const lineType = lComment === true ? "comment" : type;
    let doPos = null;
    if (lComment === false) {
      if (
        lDefine === true &&
        (lineText?.trim()?.startsWith("/*") || lineText?.trim() === "")
      )
        lDefine = true;
      else {
        if (lineText.toLowerCase().startsWith("define variable"))
          lDefine = true;
        else {
          lDefine = false;
          if (lineText.trim().toLowerCase().startsWith("field ")) {
            // if (lField === false) {
            //   field += 1;
            //   lField = true;
            //   prevFieldLength = 0;
            //   prevVarLength = 0;
            // }
            // const fieldExp = new RegExp(
            //   /(?<=field)(\s+[-_a-zA-Z0-9]+\s+)/,
            //   "i"
            // );
            // const varExp = new RegExp(
            //   /(?<=as)(\s+[-_a-zA-Z0-9]+\s+)|(?<=like)(\s+[-_.a-zA-Z0-9]+\s+)/,
            //   "i"
            // );

            // const text = fieldExp.exec(lineText)?.[0]?.trim();
            // const variable = varExp.exec(lineText)?.[0]?.trim();
            // const maxLength =
            //   text?.length < prevFieldLength ? prevFieldLength : text?.length;
            // const maxVarLength =
            //   variable?.length < prevVarLength
            //     ? prevVarLength
            //     : variable?.length;
            // // console.log(start + 1, text, prevFieldLength, maxLength);
            // fields.push({
            //   index: field,
            //   lineNumber: start + 1,
            //   lineText,
            //   beforeText: text,
            //   beforeLength: text?.length,
            //   maxLength,
            //   maxVarLength,
            // });

            // fields.forEach((args) => {
            //   if (args.index === field) {
            //     args.maxLength = maxLength;
            //     args.maxVarLength = maxVarLength;

            //     const obj = formatModel.find(
            //       (item) => item.start === args.lineNumber
            //     );
            //     const pad = maxLength - args?.beforeLength;
            //     const str =
            //       " " +
            //       args.beforeText +
            //       String.fromCharCode(32).repeat(pad + 1);

            //     // const afterText = " " + afterExp.exec(cleanLine)?.[0]?.trim();

            //     if (obj) {
            //       obj.lineText = obj.lineText.replace(fieldExp, str);
            //       // if (afterText !== "undefined")
            //       //   obj.lineText = obj.lineText.replace(afterExp, afterText);
            //     }
            //     lineText = lineText.replace(fieldExp, str);

            //     const variable = varExp.exec(lineText)?.[0]?.trim();

            //     if (variable) {
            //       const varText =
            //         " " +
            //         variable +
            //         String.fromCharCode(32).repeat(
            //           args.maxVarLength - variable.length
            //         );
            //       lineText = lineText.replace(varExp, varText);
            //     }
            //     // if (afterText !== "undefined")
            //     // line = line.replace(afterExp, afterText);
            //   }
            // });
            // prevFieldLength = maxLength;
            // prevVarLength = maxVarLength;
            lineText = formatDefineStatement(lineText, start, "field");
          }
        }
      }
    }
    if (lineType === "block" && token.toLowerCase().indexOf("do") > -1) {
      const prevToken = formatModel[prev];
      doPos =
        lineText.split(" ")?.[0]?.toLowerCase() === "do" ||
        lineText.split(" ")?.[0]?.toLowerCase() === "do:"
          ? "start"
          : "other";

      // console.log(start, lineText.split(" ")?.[0], doPos);
      if (
        prevToken &&
        prevToken?.type === "statement" &&
        prevToken?.end === null
      ) {
        prevToken.end = prevToken?.start;
        // if (doPos === "start")
        // console.log(start, type, token, lineText);
        indent -= 1;
      }

      if (
        prevToken &&
        prevToken?.type === "block" &&
        prevToken?.token === "on" &&
        prevToken?.end === null
      ) {
        prevToken.end = prevToken?.start;
        // if (doPos === "start")
        // console.log(start, type, token, lineText);
        indent -= 1;
      }
    }
    if (lineType === "statement" && token.toLowerCase() === "if") {
      const prevToken = formatModel[prev];
      if (
        prevToken &&
        prevToken?.type === "statement" &&
        prevToken?.token?.toLowerCase() === "else" &&
        prevToken?.end === null
      ) {
        prevToken.end = prevToken?.start;
        // console.log(start, type, token, lineText);
        indent -= 1;
      }
    }
    if (lineType === "statement") prev = start;
    if (lineType === "block" && token === "on") {
      prev = start;
    }

    const obj = {
      type: lineType,
      token,
      start: start + 1,
      end: end ? end + 1 : null,
      lineText,
      indent,
    };
    formatModel.push(obj);
    if (lineType === "block" || lineType === "statement") {
      // if (doPos !== "other")
      indent += 1;
    }
    if (lineType === "comment" && lineText.indexOf("*/") > -1) {
      lComment = false;
      iComment -= 1;
    }
  };

  // Close blocks and statements and reduce indent by 1
  const closeToken = (end, type, lineText) => {
    let startLine = null;

    if (lComment === true && type !== "comment") {
      if (lineText) addToken("comment", "null", end + 1, end + 1, lineText);
      return;
    }
    if (type === "comment") {
      for (let i = 0; i <= end; i += 1) {
        const token = formatModel[i];
        if (token?.type === type && token?.end === null) {
          formatModel[i].end = end + 1;
        }
      }
      iComment -= 1;
      return;
    }

    lFunc = false;
    lAssign = false;
    prevLength = 0;
    lField = false;
    lPut = false;

    for (let i = formatModel.length - 1; i > -1; i -= 1) {
      const token = formatModel[i];
      if (token?.type === type && token?.end === null) {
        formatModel[i].end = end + 1;
        startLine = formatModel[i].start;
        const startObj = formatModel.find((item) => item?.start === end + 1);
        if (startObj) {
          startObj.type = "end";
          startObj.token = formatModel[i].token;
          startObj.start = formatModel[i].start;
          startObj.end = end + 1;
        }
        // console.log(end, lineText);
        indent -= 1;
        if (type !== "statement") break;
      }
    }
    if (type === "block" && lineText)
      addToken("end", "block", startLine, end, lineText);
  };

  for (let i = 0; i < codeLines.length; i += 1) {
    let line1 = "";
    tokens
      ?.filter((item) => item?.lineNumber === i + 1)
      ?.map((token, index) => {
        if (token?.tokenType !== "comment.p") line1 = line1 + token?.text;
      });

    let line = codeLines[i] ? codeLines[i].trim() : "";
    let cleanLine = line1 ? line1.toLowerCase()?.trim() : "";

    const regexp = new RegExp('"[^"]+"', "g");
    cleanLine = cleanLine.replace(regexp, "");

    const regexp1 = new RegExp("'[^']+'", "g");
    cleanLine = cleanLine.replace(regexp1, "");

    const word = cleanLine.split(/[\s()[\];|'"{}.\t\n]/);

    switch (word[0].toLowerCase()) {
      case "//":
        addToken("comment", word[0], i, i, line);
        break;

      case "/*":
        if (cleanLine.endsWith("*/")) {
          addToken("comment", word[0], i, i, line);
        } else {
          iComment += 1;
          addToken("comment", word[0], i, null, line);
          lComment = true;
        }
        break;

      case "*/":
        closeToken(i, "comment");
        addToken("comment", word[0], i, i, line);
        lComment = false;
        break;

      case "do":
      case "do:":
      case "for":
      case "repeat":
      case "repeat:":
      case "case":
      case "catch":
      case "finally:":
      case "procedure":
      case "function":
        if (
          word[0] === "for" &&
          cleanLine.indexOf("each") < 0 &&
          cleanLine.indexOf("first") < 0 &&
          cleanLine.indexOf("last") < 0
        ) {
          addToken("text", "for", i, i, line);
        } else {
          if (word[0] === "function") lFunc = true;
          if (cleanLine.endsWith(" do:") || cleanLine.endsWith(" do"))
            addToken("block", "do", i, null, line);
          else addToken("block", word[0], i, null, line);
        }

        if (cleanLine.split(" ")?.indexOf("end") > -1) {
          closeToken(i, "block");
        }
        // indent += 1;
        break;

      case "if":
      case "else":
      case "find":
      case "when":
      case "assign":
      case "put":
      case "disp":
      case "display":
      case "export":
      case "on":
      case "run":
      case "form":
      case "def":
      case "define":
      case "message":
      case "enable":
      case "disable":
      case "temp-table":
        if (lAssign === false && lPut === false) {
          if (cleanLine.endsWith(" do:") || cleanLine.endsWith(" do"))
            addToken("block", "do", i, null, line);
          else {
            if (cleanLine.startsWith("define variable ")) {
              line = formatDefineStatement(line, i, "define");
            }
            addToken("statement", word[0], i, null, line);
          }
        } else {
          addToken(
            "text",
            word[0],
            i,
            null,
            String.fromCharCode(32).repeat(assignments[assign]?.maxLength + 3) +
              line
          );
        }
        if (word[0] === "assign" || cleanLine.indexOf(" assign") > -1) {
          lAssign = true;
          assign += 1;
        }
        if (word[0] === "put" || cleanLine.indexOf(" put") > -1) lPut = true;
        break;

      case "end":
      case "end.":
        // case "&endif":
        closeToken(i, "block", line);
        break;

      default:
        if (cleanLine.startsWith("/*")) {
          lComment = true;
        }
        if (cleanLine.endsWith("*/") || cleanLine.indexOf("*/") > -1) {
          closeToken(i, "comment", line);
          lComment = false;
          // break;
        }
        if (cleanLine === "") {
          addToken("text", null, i, i, line);
        } else {
          if (lAssign) {
            const exp = new RegExp(/^.*?(?==)/, "i");
            const afterExp = new RegExp(/(?<=^.*?=[^=]*).*/);
            const text = exp.exec(line)?.[0]?.trim();

            if (!text) {
              // console.log(text, line);
              addToken(
                "text",
                null,
                i,
                i,
                line.endsWith(".")
                  ? line
                  : String.fromCharCode(32).repeat(
                      assignments[0]?.maxLength + 3
                    ) + line
              );
              if (line.endsWith(".")) closeToken(i, "statement");
              continue;
            }
            const maxLength =
              text?.length < prevLength ? prevLength : text?.length;
            assignments.push({
              index: assign,
              lineNumber: i + 1,
              line,
              beforeText: text,
              beforeLength: text?.length,
              maxLength,
            });

            assignments.forEach((args) => {
              if (args.index === assign) {
                args.maxLength = maxLength;
                const obj = formatModel.find(
                  (item) => item.start === args.lineNumber
                );
                const pad = maxLength - args?.beforeLength;
                const str =
                  args.beforeText + String.fromCharCode(32).repeat(pad + 1);

                const afterText = " " + afterExp.exec(line)?.[0]?.trim();

                if (obj) {
                  obj.lineText = obj.lineText.replace(exp, str);
                  // if (afterText !== "undefined")
                  //   obj.lineText = obj.lineText.replace(afterExp, afterText);
                }
                line = line.replace(exp, str);
                if (afterText !== "undefined")
                  line = line.replace(afterExp, afterText);
              }
            });
            prevLength = maxLength;
          }
          if (
            (cleanLine.endsWith("do:") || cleanLine.indexOf(" do ") > -1) &&
            lComment === false
          ) {
            addToken("block", "do", i, null, line);
            break;
          }
          if (
            (cleanLine.startsWith("&scoped-define") ||
              cleanLine.startsWith("&global-define")) &&
            lComment === false
          ) {
            const reg = cleanLine.startsWith("&scoped-define")
              ? new RegExp(/(?<=&scoped-define)(\s+\w+\s+)/, "i")
              : new RegExp(/(?<=&global-define)(\s+\w+\s+)/, "i");
            const text = reg.exec(line);

            if (text?.[0]) {
              const maxLength =
                text?.[0].trim().length < prevScopeLength
                  ? prevScopeLength
                  : text?.[0].trim().length;

              scoped.push({
                index: scopeNum,
                lineNumber: i + 1,
                line,
                beforeText: text[0].trim(),
                beforeLength: text?.[0].trim().length,
                maxLength,
              });

              scoped.forEach((args) => {
                args.maxLength = maxLength;
                const pad = maxLength - args?.beforeLength;
                const newText = reg.exec(args.line)?.[0];
                const obj = formatModel.find(
                  (item) => item.start === args.lineNumber
                );
                const textFormtted =
                  " " +
                  newText.trim() +
                  String.fromCharCode(32).repeat(pad + 1);
                if (obj) {
                  obj.lineText = args.line.replace(newText, textFormtted);
                  // console.log(obj);
                }

                line = line.replace(newText, textFormtted);
              });
              prevScopeLength = maxLength;
            }
          }
          addToken("text", null, i, null, line);
        }
        break;
    }
    if (cleanLine.endsWith(".")) {
      if (cleanLine.endsWith("forward.")) {
        closeToken(i, "block");
        continue;
      }
      if (cleanLine.indexOf(" in ") > -1 && lFunc === true) {
        closeToken(i, "block");
        continue;
      }
      closeToken(i, "statement");
      continue;
    }

    if (cleanLine.indexOf("/*") > 0) {
      iComment += 1;
      lComment = true;
    }

    if (cleanLine.indexOf("*/") > -1) {
      // console.log(i, line);
      if (lComment === true) closeToken(i, "comment", line);
      lComment = false;
      continue;
    }
  }

  formatModel.forEach((obj) => {
    // console.log(obj);
    const spaceString = new Array(obj?.indent + 1).join("    ");
    const str = spaceString + (obj?.lineText ?? "");
    formattedText =
      formattedText === "" ? str ?? "" : formattedText + "\n" + (str ?? "");
  });
  // console.log(defines);
  return formattedText;
}
