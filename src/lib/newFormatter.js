import {
  attributes,
  attributesDashed,
  builtinFunctions,
  builtinVariables,
  keywords,
  keywordsDashed,
} from "../languages/kewords";

export function toggleCase(monaco, editor, caseType) {
  if (
    !caseType ||
    ["lower", "lowercase", "upper", "uppercase"].indexOf(
      caseType.toLowerCase()
    ) < 0
  )
    return;
  const text = editor.getValue();
  const newText = text.replace(/\b(\w+)\b/g, function (match, p1) {
    if (
      keywords.indexOf(p1.toUpperCase()) > -1 ||
      attributes.indexOf(p1.toUpperCase()) > -1 ||
      attributesDashed.indexOf(p1.toUpperCase()) > -1 ||
      builtinFunctions.indexOf(p1.toUpperCase()) > -1 ||
      builtinVariables.indexOf(p1.toUpperCase()) > -1 ||
      keywordsDashed.indexOf(p1.toUpperCase()) > -1
    ) {
      if (
        caseType.toLowerCase() === "upper" ||
        caseType.toLowerCase() === "uppercase"
      )
        return p1.toUpperCase();
      return p1.toLowerCase();
    }
    return p1;
  });
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

export function formatCode(model, editor) {
  let formatModel = [];
  let blocks = ["do", "for", "repeat", "case", "catch", "finally"];
  let lComment = false;
  let iComment = 0;
  let lFunc = false;
  /***
   * Below variables are used to format variable assignments
   */
  let assign = 0;
  let lAssign = false;
  const assignments = [];
  /***
   * Below variables are used to format temp-table fields
   */
  let field = 0;
  let lField = false;
  const fields = [];

  let prev = null;
  let prevLength = 0;
  let prevScopeLength = 0;
  const scoped = [];
  let scopeNum = 0;
  let indent = 0;
  let codeText = model.getValue(); //.replace(new RegExp(/^\s+|\s+$/, "gm"), "");
  codeText = codeText.replace(new RegExp(/assign /, "ig"), "ASSIGN\n");
  // codeText = codeText.replace(new RegExp(/(?!\s).*(?= do:)/, "ig"), new RegExp(/(?!\s).*(?= do:)/, "ig") + "\nDO:");
  codeText = codeText.replace(new RegExp(/def /, "ig"), "DEFINE ");
  codeText = codeText.replace(new RegExp(/ var /, "ig"), " VARIABLE ");
  const doReg = new RegExp(/(?!\s).*(?= do:)/gim);

  let codeText1 = doReg.exec(codeText);
  while (codeText1) {
    if (!codeText1[0]?.startsWith("/*")) {
      const endIndex = codeText1.index + codeText1[0].length;
      codeText.replace(codeText1[0], codeText1[0] + "\n");
      console.log(codeText1, model.getPositionAt(codeText1.index), endIndex);
    }

    codeText1 = doReg.exec(codeText);
  }

  const codeLines = codeText.split("\n");
  let formattedText = "";

  // Add new token to register a line with its indent
  const addToken = (type, token, start, end, lineText) => {
    const lineType = lComment === true ? "comment" : type;
    let doPos = null;

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
    // lineText =
    //   lineType === "comment"
    //     ? `<span class="mtk8">${lineText}</span>"`
    //     : lineText;
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
    let line = codeLines[i] ? codeLines[i].trim() : "";
    let cleanLine = line ? line.toLowerCase() : "";

    if (
      line.indexOf("/*") > 0 &&
      line.indexOf("*/") > line.indexOf("/*") &&
      line.indexOf("*/") === line.length - 2
    ) {
      cleanLine = line.substring(0, line.indexOf("/*"))?.trim().toLowerCase();
    }

    // const reg = new RegExp("\\/\\*[^]*?\\*\\/|\\*[^]*?\\*\\/","gm");

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
          // if (cleanLine.endsWith(".")) {
          //   closeToken(i, "statement");
          // } else {
          iComment += 1;
          addToken("comment", word[0], i, null, line);
          lComment = true;
          // }
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
        // case "&if":
        if (word[0] === "function") lFunc = true;
        if (cleanLine.endsWith(" do:") || cleanLine.endsWith(" do"))
          addToken("block", "do", i, null, line);
        else addToken("block", word[0], i, null, line);
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
        if (word[0] === "assign") {
          lAssign = true;
          assign += 1;
        }
        if (cleanLine.endsWith(" do:") || cleanLine.endsWith(" do"))
          addToken("block", "do", i, null, line);
        else {
          if (cleanLine.startsWith("define variable ")) {
            const reg = new RegExp(
              // /(?<=^define variable)(\s+\S+\s+)(\w+)(\s+\w+\s+)(\S+)/
              /\b(?:def|define){1}[\s\t\n]+([inputo\-]*){1}[\s\t\n]+(?:param|parameter){1}[\s\t\n]+(?:table){1}[\s\t\n]+(?:for){1}[\s\t\n]+([\w\d\-\+]*)(?:\.[^\w\d\-\+]){1}/gim
            );
            const regToken = reg.exec(cleanLine);
            // console.log(regToken);
          }
          addToken("statement", word[0], i, null, line);
          // indent += 1;
        }
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
        if (cleanLine.endsWith("*/")) {
          closeToken(i, "comment", line);
          lComment = false;
          // break;
        }
        if (cleanLine === "") {
          addToken("text", null, i, i, line);
        } else {
          if (lAssign) {
            const exp = new RegExp(/(.*)(?=\=)/);
            const text = exp.exec(cleanLine)?.[0]?.trim();
            if (!text) {
              addToken(
                "text",
                null,
                i,
                i,
                String.fromCharCode(32).repeat(assignments[0]?.maxLength + 1) +
                  line
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
                if (obj) {
                  obj.lineText = obj.lineText.replace(exp, str);
                }

                line = line.replace(exp, str);
              }
            });
            prevLength = maxLength;
          }
          if (
            (cleanLine.endsWith("do:") || cleanLine.indexOf(" do ") > -1) &&
            lComment === false
          ) {
            // console.log(i, indent, cleanLine);
            // indent += 1;
            addToken("block", "do", i, null, line);
            break;
          }
          if (cleanLine.startsWith("&scoped-define") && lComment === false) {
            const reg = new RegExp(/(?<=&scoped-define)(\s+\w+\s+)/);
            const text = reg.exec(line);
            // const textFormatted = " " + text?.[0]?.trim() + " ";
            if (text?.[0]) {
              // console.log(text[0].length, textFormatted.length);
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

              // scoped.forEach((args) => {
              //   args.maxLength = maxLength;
              //   const obj = formatModel.find(
              //     (item) => item.start === args.lineNumber
              //   );
              //   const pad = maxLength - args?.beforeLength;
              //   const str =
              //     " " +
              //     args.beforeText +
              //     String.fromCharCode(32).repeat(pad + 1);
              //   if (obj) {
              //     obj.lineText = obj.lineText.replace(args.beforeText, str);
              //   }
              //   line = line.replace(text[0], str);

              // });
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
  console.log(formatModel);
  return formattedText;
}
