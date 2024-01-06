import { removeInvalidRightChar } from "./util";

// import * as vscode from 'vscode';

// enum CommentType { SingleLine, MultiLine }

// export interface SourceCode {
//     document: vscode.TextDocument;
//     fullSource?: string;
//     sourceWithoutComments?: string;
//     sourceWithoutStrings?: string;
// }

const ABL_ASLIKE = {
  AS: "as",
  LIKE: "like",
};

const ABL_PARAM_DIRECTION = {
  IN: "input",
  OUT: "output",
  INOUT: "input-output",
};

export function getSourceCode(source) {
  //   const source = document.getText();
  const code = {
    // document: vscode.TextDocument,
    fullSource: source,
    sourceWithoutComments: "",
    sourceWithoutStrings: "",
  };
  let prevChar = "";
  let nextChar = "";
  let thisChar = "";

  let inString = false;
  let inComment = false;
  let commentType = null;
  let stringChar = null;
  let charWOComments;
  let charWOStrings;

  for (let i = 0; i < source.length; i++) {
    thisChar = source[i];
    nextChar = source[i + 1];
    prevChar = source[i - 1];
    charWOComments = thisChar;
    charWOStrings = thisChar;

    switch (thisChar) {
      case "/":
        if (!inString) {
          // If we are not in a comment
          if ((!inComment && nextChar === "/") || prevChar === "/") {
            inComment = true;
            commentType = 1;
            charWOComments = " ";
            charWOStrings = " ";
          } else if (!inComment && nextChar === "*") {
            inComment = true;
            commentType = 2;
            charWOComments = " ";
            charWOStrings = " ";
          } else if (inComment && commentType === 2 && prevChar === "*") {
            inComment = false;
            commentType = null;
            charWOComments = " ";
            charWOStrings = " ";
          } else if (inComment) {
            charWOComments = " ";
            charWOStrings = " ";
          }
        } else {
          charWOStrings = " ";
        }
        break;
      case "\n":
        if (inComment && commentType === 1) {
          inComment = false;
          commentType = null;
        }
        break;
      case '"':
      case "'":
        if (!inComment) {
          charWOStrings = " ";
          if (stringChar === thisChar && inString && prevChar !== "~") {
            inString = false;
            stringChar = null;
          } else if (stringChar === null && !inString && !inComment) {
            inString = true;
            stringChar = thisChar;
          }
        } else {
          charWOComments = " ";
          charWOStrings = " ";
        }
        break;
      default:
        if (inComment) {
          charWOComments = " ";
          charWOStrings = " ";
        } else if (inString) {
          charWOStrings = " ";
        }
        break;
    }
    code.sourceWithoutComments += charWOComments;
    code.sourceWithoutStrings += charWOStrings;
  }

  return code;
}

export function getAllIncludes(sourceCode, editor) {
  const result = [];
  // let regexInclude: RegExp = new RegExp(/\{{1}([\w\d\-\\\/\.]+)(?:.|\n)*?\}{1}/gim);
  // 1 = include name
  const regexStart = new RegExp(/\{{1}([\w\d\-\\\/\.]+)/gim);
  // 1 = include name
  const regexEnd = new RegExp(/\}{1}/gim);
  //
  const text = sourceCode.sourceWithoutStrings;
  let resStart = regexStart.exec(text);
  let resEnd;
  while (resStart) {
    regexEnd.lastIndex = regexStart.lastIndex;
    resEnd = regexEnd.exec(text);
    if (resEnd) {
      const nm = resStart[1].trim().toLowerCase();
      // ignores {1} (include parameter) and {&ANYTHING} (global/scoped definition)
      if (
        Number.isNaN(Number.parseInt(nm, 10)) &&
        !nm.startsWith("&") &&
        !result.find((item) => item.name === nm)
      ) {
        const v = {};
        v.name = nm;
        v.line = editor.getModel().getPositionAt(resStart.index);
        result.push(v);
      }
      resStart = regexStart.exec(text);
    } else {
      break;
    }
  }
  return result;
}

export function getAllVariables(sourceCode, editor) {
  const result = [];
  // let regexDefineVar: RegExp = new RegExp(/(?:def|define){1}(?:[\s\t\n]|new|shared)+(?:var|variable){1}(?:[\s\t\n]+)([\w\d\-]+)[\s\t\n]+(as|like){1}[\s\t\n]+([\w\d\-\.]+)/gim);
  const regexDefineVar = new RegExp(
    /(?:def|define){1}(?:[\s\t\n]|new|shared)+(?:var|variable){1}(?:[\s\t\n]+)([\w\d\-]+)[\s\t\n]+(as|like){1}[\s\t\n]+([\w\d\-\.]+)([\n\s\t\w\d\-\'\"]*)\./gim
  );
  // 1 = var name
  // 2 = as | like
  // 3 = type | field like
  // 4 = details (extent, no-undo, initial, etc)
  const text = sourceCode.sourceWithoutStrings;
  let res = regexDefineVar.exec(text);
  while (res) {
    const v = {};
    try {
      v.name = res[1].trim();
      v.asLike = res[2].trim();
      v.dataType = removeInvalidRightChar(res[3].trim()); // removeInvalidRightChar to remove special chars because is accepted in this capture group
      //   v.line = sourceCode.document.positionAt(res.index).line;
      v.line = editor.getModel().getPositionAt(res.index);
      v.additional = (res[4] || "").trim();
      result.push(v);
      // tslint:disable-next-line:no-empty
    } catch (err) {
      console.error(err);
    } // suppress errors
    res = regexDefineVar.exec(text);
  }
  return result;
}

export function getAllIOParameters(sourceCode, editor) {
  const result = [];
  /* Primitive types */
  // let regexParams: RegExp = new RegExp(/\b(?:def|define){1}[\s\t\n]+([inputo\-]*){1}[\s\t\n]+(?:param|parameter){1}[\s\t\n]+([\w\d\-\.]*){1}[\s\t\n]+(as|like){1}[\s\t\n]+([\w\d\-\.]+)/gim);
  let regexParams = new RegExp(
    /\b(?:def|define){1}[\s\t\n]+([inputo\-]*){1}[\s\t\n]+(?:param|parameter){1}[\s\t\n]+([\w\d\-\.]*){1}[\s\t\n]+(as|like){1}[\s\t\n]+([\w\d\-\.]+)([\n\s\t\w\d\-\'\"]*)\./gim
  );
  // 1 = input | output | input-output
  // 2 = name
  // 3 = as | like
  // 4 = type | field like
  // 5 = details
  const text = sourceCode.sourceWithoutStrings;
  let res = regexParams.exec(text);
  while (res) {
    const v = {};
    try {
      v.name = res[2].trim();
      v.asLike = res[3].trim();
      v.dataType = removeInvalidRightChar(res[4].trim()); // removeInvalidRightChar to remove special chars because is accepted in this capture group
      //   v.line = sourceCode.document.positionAt(res.index).line;
      v.line = editor.getModel().getPositionAt(res.index);
      if (res[1].toLowerCase() === "input") {
        v.direction = ABL_PARAM_DIRECTION.IN;
      } else if (res[1].toLowerCase() === "output") {
        v.direction = ABL_PARAM_DIRECTION.OUT;
      } else {
        v.direction = ABL_PARAM_DIRECTION.INOUT;
      }
      v.additional = (res[5] || "").trim();
      result.push(v);
      // tslint:disable-next-line:no-empty
    } catch {} // suppress errors
    res = regexParams.exec(text);
  }
  /* Temp-table */
  regexParams = new RegExp(
    /\b(?:def|define){1}[\s\t\n]+([inputo\-]*){1}[\s\t\n]+(?:param|parameter){1}[\s\t\n]+(?:table){1}[\s\t\n]+(?:for){1}[\s\t\n]+([\w\d\-\+]*)(?:\.[^\w\d\-\+]){1}/gim
  );
  // 1 = input | output | input-output
  // 2 = name
  res = regexParams.exec(text);
  while (res) {
    const v = {};
    try {
      v.name = res[2].trim();
      v.asLike = ABL_ASLIKE.AS;
      v.dataType = "temp-table";
      //   v.line = sourceCode.document.positionAt(res.index).line;
      v.line = editor.getModel().getPositionAt(res.index);
      if (res[1].toLowerCase() === "input") {
        v.direction = ABL_PARAM_DIRECTION.IN;
      } else if (res[1].toLowerCase() === "output") {
        v.direction = ABL_PARAM_DIRECTION.OUT;
      } else {
        v.direction = ABL_PARAM_DIRECTION.INOUT;
      }
      result.push(v);
    } catch (err) {
      console.error(err);
    } // suppress errors
    res = regexParams.exec(text);
  }
  /* Buffer */
  regexParams = new RegExp(
    /\b(?:def|define){1}[\s\t\n]+(?:param|parameter){1}[\s\t\n]+(?:buffer){1}[\s\t\n]+([\w\d\-]+){1}[\s\t\n]+(?:for){1}[\s\t\n]+(temp-table[\s\t\n]+)*([\w\d\-\+]*)(?:\.[^\w\d\-\+])+/gim
  );
  // 1 = name
  // 2 = undefined | temp-table
  // 3 = buffer reference
  res = regexParams.exec(text);
  while (res) {
    const v = {};
    try {
      v.name = res[1].trim();
      v.asLike = ABL_ASLIKE.AS;
      v.dataType = "buffer";
      //   v.line = sourceCode.document.positionAt(res.index).line;
      v.line = editor.getModel().getPositionAt(res.index);
      v.direction = ABL_PARAM_DIRECTION.IN;
      v.additional = res[3];
      result.push(v);
    } catch {} // suppress errors
    res = regexParams.exec(text);
  }
  //
  return result.sort((v1, v2) => {
    return v1.line - v2.line;
  });
}

export function getAllProcedures(sourceCode, editor) {
  const result = [];
  // let regexMethod = new RegExp(/\b(proc|procedure|func|function){1}[\s\t\n]+([\w\d\-]+)(.*?)[\.\:]{1}(.|[\n\s])*?(?:end\s(proc|procedure|func|function)){1}\b/gim);
  // 1 = function | procedure
  // 2 = name
  // 3 = aditional details (returns xxx...)
  // 4 = code block (incomplete)

  const regexStart = new RegExp(
    /^(?:proc|procedure){1}[\s\t\n]+([\w\d\-]+)(.*?)(?:[\.\:][^\w\d\-\+])/gim
  );
  // 1 = function | procedure
  // 2 = name
  // 3 = aditional details (returns xxx...)
  const regexEnd = new RegExp(/\b(?:end[\s\t]+(proc|procedure)){1}\b/gim);
  //
  const text = sourceCode.sourceWithoutStrings;
  let resStart = regexStart.exec(text);
  let resEnd;
  while (resStart) {
    regexEnd.lastIndex = regexStart.lastIndex;
    resEnd = regexEnd.exec(text);
    if (resEnd) {
      const m = {};
      try {
        // console.log(resStart);
        if (resStart[1]?.toLowerCase() === "procedure") {
          m.name = resStart[2].trim();
          m.line = editor.getModel().getPositionAt(resStart.index);
          m.lineAt = editor
            .getModel()
            .getPositionAt(resStart.index)?.lineNumber;
          m.lineEnd = editor
            .getModel()
            .getPositionAt(regexEnd.lastIndex)?.lineNumber;
          m.params = [];
          result.push(m);
        } else if (resStart[0]?.toLowerCase()?.startsWith("procedure")) {
          m.name = resStart[1];
          m.line = editor.getModel().getPositionAt(resStart.index);
          m.lineAt = editor
            .getModel()
            .getPositionAt(resStart.index)?.lineNumber;
          m.lineEnd = editor
            .getModel()
            .getPositionAt(regexEnd.lastIndex)?.lineNumber;
          m.params = [];
          result.push(m);
        }
        // tslint:disable-next-line:no-empty
      } catch {} // suppress errors
      resStart = regexStart.exec(text);
    } else {
      break;
    }
  }
  return result;
}

export function getAllFunctions(sourceCode, editor) {
  const result = [];
  // let regexMethod = new RegExp(/\b(proc|procedure|func|function){1}[\s\t\n]+([\w\d\-]+)(.*?)[\.\:]{1}(.|[\n\s])*?(?:end\s(proc|procedure|func|function)){1}\b/gim);
  // 1 = function | procedure
  // 2 = name
  // 3 = aditional details (returns xxx...)
  // 4 = code block (incomplete)

  const regexFuncBlock = new RegExp(
    /(?:func|function){1}[\s\t\n]+([\w\d\-]+)(.*?)(?:[^\w\d\-\+]){1}(?:return|returns){1}[\s\t\n]+([\w\d\-]+)(.*?)(?:[^\w\d\-\+])+|(?:end[\s\t\n]+(function|func)){1}/gim
  );
  const regexStart = new RegExp(
    // /\b(?:func|function){1}[\s\t\n]+([\w\d\-]+)(.*?)(?:[\.\:][^\w\d\-\+])/gim
    // /\b(?:func|function){1}[\s\t\n]+([\w\d\-]+)(.*?)(?:[^\w\d\-\+]){1}(?:return|returns){1}[\s\t\n]+([\w\d\-]+)(.*?)+/gim
    // /\b(?:func|function){1}[\s\t\n]+([\w\d\-]+)(.*?)(?:[^\w\d\-\+]){1}(?:return|returns){1}[\s\t\n]+([\w\d\-]+)(.*?)+|(?:input|output|input-output]*){1}[\s\t\n]+([\w\d\-]+)(.*?)/gim
    /\b(?:func|function){1}[\s\t\n]+([\w\d\-]+)(.*?)(?:[^\w\d\-\+]){1}(?:return|returns){1}[\s\t\n]+([\w\d\-]+)(.*?)|(?<!define )(?:input|output|input-output]*){1}[\s\t\n]+([\w\d\-]+)(.*?)(?:as|like){1}[\s\t\n]+([\w\d\-]+)(.*?)|(?:input|output|input-output){1}(?! parameter | from | close| to )[\s\t\n]+([\w\d\-]+)(.*?)/gim
  );
  // 1 = function | procedure
  // 2 = name
  // 3 = aditional details (returns xxx...)
  const regexEnd = new RegExp(/\b(?:end[\s\t]+(func|function)){1}\b/gim);
  //
  const text = sourceCode.sourceWithoutStrings;
  let resStart = regexStart.exec(text);
  let resEnd;
  let resBlock = regexFuncBlock.exec(text);
  //   console.log(resBlock, resStart);
  while (resStart) {
    regexEnd.lastIndex = regexStart.lastIndex;
    resEnd = regexEnd.exec(text);
    resBlock = regexFuncBlock.exec(text);
    if (resEnd) {
      const m = {};
      try {
        const dupe = result?.find((item) => item?.name === resStart[1]);
        if (dupe) {
          dupe.line = editor.getModel().getPositionAt(resStart.index);
          dupe.lineAt = editor
            .getModel()
            .getPositionAt(resStart.index)?.lineNumber;
          dupe.lineEnd = editor
            .getModel()
            .getPositionAt(regexEnd.lastIndex)?.lineNumber;
        } else {
          if (resStart[1]) {
            m.name = resStart[1];
            m.line = editor.getModel().getPositionAt(resStart.index);
            m.lineAt = editor
              .getModel()
              .getPositionAt(resStart.index)?.lineNumber;
            m.lineEnd = editor
              .getModel()
              .getPositionAt(regexEnd.lastIndex)?.lineNumber;
            m.retuns = resStart[3];
            m.params = [];
            result.push(m);
          }
        }

        if (resStart?.[0]?.toLowerCase()?.trim()?.startsWith("input")) {
          const obj = result[result?.length - 1];
          // console.log(result, obj, resStart);
          obj?.params.push({
            name: resStart?.[9] ? "" : resStart?.[5],
            dataType: resStart?.[9] ?? resStart?.[7],
          });
        }
        // tslint:disable-next-line:no-empty
      } catch (err) {
        console.error(err);
      } // suppress errors
      resStart = regexStart.exec(text);
    } else {
      break;
    }
  }
  return result;
}

export function getAllCommentedLines(sourceCode, editor) {
  let open = 0;
  let close = 0;
  // const regex = new RegExp(/\/\*[^]*?\*\/|\*[^]*?\*\//, "gm");
  const regex = new RegExp(/(?:\/\*|\*\/)/, "gm");
  let res = regex.exec(sourceCode.fullSource);
  const result = [];

  while (res) {
    if (res[0] === "/*") {
      open += 1;
      const pos = editor.getModel().getPositionAt(res.index);
      result.push({
        class: "comment",
        index: open,
        startLineNumber: pos.lineNumber,
        startColumn: pos.column,
      });
    }

    if (res[0] === "*/") {
      close += 1;
      const obj = result.find((item) => item.index === close);
      if (obj) {
        const pos = editor.getModel().getPositionAt(res.index);
        obj.endLineNumber = pos.lineNumber;
        obj.endColumn = pos.column + 2;
      }
    }
    res = regex.exec(sourceCode.fullSource);
  }
  // console.log(result);
  return result;
}

export function getCurlyContent(sourceCode, editor) {
  let open = 0;
  let close = 0;
  const regex = new RegExp(/(?:{|})/, "gm");
  let res = regex.exec(sourceCode.fullSource);
  const result = [];

  while (res) {
    if (res[0] === "{") {
      open += 1;
      const pos = editor.getModel().getPositionAt(res.index);
      result.push({
        class: "curly",
        index: open,
        startLineNumber: pos.lineNumber,
        startColumn: pos.column,
      });
    }

    if (res[0] === "}") {
      close += 1;
      const obj = result.find((item) => item.index === close);
      if (obj) {
        const pos = editor.getModel().getPositionAt(res.index);
        obj.endLineNumber = pos.lineNumber;
        obj.endColumn = pos.column + 2;
      }
    }
    res = regex.exec(sourceCode.fullSource);
  }
  return result;
}

export function getTempTables(sourceCode, editor) {
  let open = 0;
  let close = 0;
  const regex = new RegExp(
    /(?:def|define)(?:[\s\t\n]|new|shared)+(?:temp-table)(?:[\s\t\n]+)([\w\d\-]+)[\s\t\n]/,
    "gim"
  );
  let res = regex.exec(sourceCode.fullSource);
  let idx = 0;
  const result = [];
  while (res) {
    const pos = editor.getModel().getPositionAt(res.index);
    idx += 1;
    result.push({
      class: "temptable",
      index: idx,
      name: res?.[1],
      line: pos,
      startLineNumber: pos.lineNumber,
      startColumn: pos.column,
      fields: [],
    });
    res = regex.exec(sourceCode.fullSource);
  }

  idx = 0;
  const code = sourceCode.fullSource.split("\n");
  for (let i = 0; i < code.length; i++) {
    const line = code[i];
    const cleanLine = line?.toLowerCase()?.trim();

    // console.log(cleanLine);

    if (
      (cleanLine.startsWith("def") || cleanLine.startsWith("define")) &&
      cleanLine.indexOf("temp-table") > -1
    )
      idx += 1;

    if (cleanLine.startsWith("field") || cleanLine.startsWith("fields")) {
      const fieldExp = new RegExp(
        /(?:field|fields){1}(?:[\s\t\n]+)([\w\d\-]+)[\s\t\n]+(as|like){1}[\s\t\n]+([\w\d\-\.]+)([\n\s\t\w\d\-\'\"]*)/,
        "i"
      );
      const obj = result.find((item) => item.index === idx);
      // console.log(obj);
      const field = fieldExp.exec(cleanLine);
      if (obj) obj.fields?.push({ name: field?.[1], dataType: field?.[3] });
    }
  }

  // console.log(result);
  return result;
}

export const getComments = (sourceCode, model) => {
  const regex = new RegExp(
    /\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\//,
    "gim"
  );
  let res = regex.exec(sourceCode);
  let idx = 0;
  const result = [];
  while (res) {
    const pos = model.getPositionAt(res.index);
    idx += 1;
    result.push({
      class: "comment",
      index: idx,
      name: res?.[0],
      line: pos,
      expIndex: res?.index,
    });
    res = regex.exec(sourceCode);
  }

  return result;
};
