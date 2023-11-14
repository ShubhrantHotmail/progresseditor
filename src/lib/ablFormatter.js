// import * as vscode from 'vscode';
// import { CancellationToken, DocumentFormattingEditProvider, FormattingOptions, OnTypeFormattingEditProvider, Position, Range, TextDocument, TextEdit, workspace, WorkspaceConfiguration } from 'vscode';
// import { getOpenEdgeConfig } from '../ablConfig';
// import { ABL_MODE } from '../ablMode';

// export class ABLFormattingProvider implements DocumentFormattingEditProvider, OnTypeFormattingEditProvider {

//     constructor(context: vscode.ExtensionContext) {
//         context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider(ABL_MODE.language, this));
//     }

//     public provideDocumentFormattingEdits(document: TextDocument, options: FormattingOptions, token: CancellationToken): Thenable<TextEdit[]> {
//         if (document.languageId !== ABL_MODE.language) { return; }
//         return format(document, null, options);
//     }

//     public provideOnTypeFormattingEdits(document: TextDocument, position: Position, ch: string, options: FormattingOptions, token: CancellationToken): Thenable<TextEdit[]> {
//         // if (!onType) { return; }
//         if (document.languageId !== ABL_MODE.language) { return; }
//         return format(document, null, options);
//     }
// }

export function format(model, range, options) {
  return new Promise((resolve) => {
    // Create an empty list of changes
    const result = [];
    // Create a full document range
    if (range === null) {
      //   const start = new Position(0, 0);
      //   const end = new Position(
      //     model.getLineCount() - 1,
      //     model.getLineLength(model.getLineCount() - 1)
      //   );
      range = new Range({
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: model.getLineCount() - 1,
        endColumn: model.getLineLength(model.getLineCount() - 1),
      });
    }
    // Format the document with the user specified settings
    const formatter = new PatternFormat();
    var newText = formatter.document(
      model.getValue(),
      options,
      model.getLanguageId()
    );
    return resolve(newText);
    // SpacingFormat.document(document.getText(), options, document.languageId).then((newText) => {
    //     // Push the edit into the result array
    //     result.push(new TextEdit(range, newText));
    //     // Return the result of the change
    //     return resolve(result);
    // });
  });
}

class PatternFormat {
  document(source, formattingOptions, languageId) {
    // const config = workspace.getConfiguration("ablFormat");
    this.options = formattingOptions;
    this.source = source;
    this.langId = languageId;

    // Config base
    // const space = config.get < any > "space";
    // const newLine = config.get < any > "newLine";

    // this.space = space;
    // this.newLine = newLine;

    // const spaceOther = space.language[languageId];

    // const braceSpaceOpenBefore = space.brace.open.before;
    // const braceNewLine = newLine.brace;

    // const parenSpaceOpenBefore = space.parenthesis.open.before;
    // const parenSpaceOpenAfter = space.parenthesis.open.after;
    // const parenSpaceCloseBefore = space.parenthesis.close.before;

    let s = "";

    let ignoreSpace = false;
    let lastKeyword = "";

    let inString = false;
    let inComment = false;
    let commentType = null;

    let stringChar = null;
    // var textWords = '';

    let line = "";
    let depthLineDiff = 0;

    for (let i = 0; i < source.length; i++) {
      this.offset = i;
      this.char = source[i];
      this.next = source[i + 1];
      this.prev = source[i - 1];
      this.words = this.cleanArray(line.split(/[\s()[\];|'"{}.\t\n]/));
      // this.words = this.cleanArray(s.split(/[\s\(\)\[\];|'"\{\}\.\t\n]/));
      // this.words = this.cleanArray(textWords.split(/[\s\(\)\[\];|'"\{\}\.\t\n]/));
      this.last = this.words[this.words.length - 1];

      const _char = this.char;
      // considera blocos do progress

      const spaces = this.getSpaces(_char);

      switch (this.char) {
        case "/":
          // If we are not in a comment
          if ((!inComment && this.next === "/") || this.prev === "/") {
            inComment = true;
            commentType = CommentType.SingleLine;
          } else if (!inComment && this.next === "*") {
            inComment = true;
            commentType = CommentType.MultiLine;
          } else if (inComment && commentType === CommentType.MultiLine) {
            inComment = false;
            commentType = null;
          }
          // s += this.char;
          line += this.char;
          break;
        case "\n":
          if (inComment && commentType === CommentType.SingleLine) {
            inComment = false;
            commentType = null;
          }
          // s += this.char;
          s +=
            this.indent(this.depth + depthLineDiff) + line.trim() + this.char;
          line = "";
          depthLineDiff = 0;
          break;
        case '"':
        case "'":
          if (stringChar === this.char && inString) {
            inString = false;
            stringChar = null;
          } else if (stringChar === null && !inString) {
            inString = true;
            stringChar = this.char;
          }
          // s += this.char;
          line += this.char;
          break;
        case ":":
        case "{":
          if (inString || inComment) {
            // s += this.char;
            line += this.char;
            break;
          }
          ignoreSpace = true;
          //   if (!braceNewLine) {
          //     let c = 0;
          // for (const j in braceSpaceOpenBefore) {
          //   if (lastKeyword === j) {
          //     // s = s.trim();
          //     // s += this.spacePlaceholder(braceSpaceOpenBefore[j]);
          //     // s = s.trim();
          //     line = line.trim();
          //     line += this.spacePlaceholder(braceSpaceOpenBefore[j]);
          //     line = line.trim();
          //     c++;
          //     break;
          //   }
          // }
          // if (c === 0) {
          //   // s = s.trim();
          //   // s += this.spacePlaceholder(braceSpaceOpenBefore.other);
          //   // s = s.trim();
          //   line = line.trim();
          //   line += this.spacePlaceholder(braceSpaceOpenBefore.other);
          //   line = line.trim();
          // }
          //   } else {
          // var lineStr: string = this.lineAtIndex(s, s.length).trim();
          // if (lineStr != '') {
          // 	s += '\n' + this.indent(this.depth - 1);
          // }
          if (line.trim() !== "") {
            // s += '\n' + this.indent(this.depth - 1);
            // line += '\n' + this.indent(this.depth - 1);
            s += this.indent(this.depth + depthLineDiff) + line.trim() + "\n";
            line = "";
          }
          //   }
          this.depth++;
          depthLineDiff = -1;
          // s += this.char;
          line += this.char;
          break;
        case "}":
          if (inString || inComment) {
            // s += this.char;
            line += this.char;
            break;
          }
          ignoreSpace = true;
          this.depth--;
          // s += this.char;
          line += this.char;
          break;
        case "(":
          if (inString || inComment) {
            // s += this.char;
            line += this.char;
            break;
          }
          ignoreSpace = true;
          //   for (const j in parenSpaceOpenBefore) {
          //     if (this.last === j) {
          //       // s = s.trim();
          //       // s += this.spacePlaceholder(parenSpaceOpenBefore[j]);
          //       // s = s.trim();
          //       line = line.trim();
          //       line += this.spacePlaceholder(parenSpaceOpenBefore[j]);
          //       line = line.trim();
          //       lastKeyword = this.last;
          //       break;
          //     }
          //   }
          // s += this.char;
          line += this.char;
          //   for (const j in parenSpaceOpenAfter) {
          //     if (this.last === j) {
          //       // s = s.trim();
          //       // s += this.spacePlaceholder(parenSpaceOpenAfter[j]);
          //       // s = s.trim();
          //       line = line.trim();
          //       line += this.spacePlaceholder(parenSpaceOpenAfter[j]);
          //       line = line.trim();
          //       break;
          //     }
          //   }
          break;
        case ")":
          if (inString || inComment) {
            // s += this.char;
            line += this.char;
            break;
          }
          ignoreSpace = true;
          //   for (const j in parenSpaceCloseBefore) {
          //     if (lastKeyword === j) {
          //       // s = s.trim();
          //       // s += this.spacePlaceholder(parenSpaceCloseBefore[j]);
          //       // s = s.trim();
          //       line = line.trim();
          //       line += this.spacePlaceholder(parenSpaceCloseBefore[j]);
          //       line = line.trim();
          //       break;
          //     }
          //   }
          // s += this.char;
          line += this.char;
          break;
        case ",":
          //    case ':':
          if (inString || inComment) {
            // s += this.char;
            line += this.char;
            break;
          }
          ignoreSpace = true;
          // s = this.formatItem(this.char, s, spaces);
          line = this.formatItem(this.char, line, spaces);
          break;
        case ";":
          if (inString || inComment) {
            // s += this.char;
            line += this.char;
            break;
          }
          ignoreSpace = true;
          // s = this.formatItem(this.char, s, spaces);
          line = this.formatItem(this.char, line, spaces);
          break;
        case "?":
        case ">":
        case "<":
        case "=":
        case "!":
        case "&":
        case "|":
        case "+":
        case "-":
        case "*":
          // case '/':
          // case '%':
          if (inString || inComment) {
            // s += this.char;
            line += this.char;
            break;
          }
          ignoreSpace = true;
          // s = this.formatOperator(this.char, s, spaces);
          line = this.formatOperator(this.char, line, spaces);
          break;
        default:
          //   if (spaceOther && this.char in spaceOther) {
          //     if (inString || inComment) {
          //       // s += this.char;
          //       line += this.char;
          //       break;
          //     }
          //     ignoreSpace = true;
          //     // s = this.formatItem(this.char, s, new Spaces((spaceOther[this.char].before || 0), (spaceOther[this.char].after || 0)));
          //     line = this.formatItem(
          //       this.char,
          //       line,
          //       new Spaces(
          //         spaceOther[this.char].before || 0,
          //         spaceOther[this.char].after || 0
          //       )
          //     );
          //   } else {
          if (inString || inComment) {
            // s += this.char;
            line += this.char;
            break;
          }
          if (ignoreSpace && this.char === " ") {
            // Skip
          } else {
            // s += this.char;
            line += this.char;
            ignoreSpace = false;
          }
          //   }
          break;
      }

      // ver se funciona...
      /*if (this.words.length > 1) {
				textWords = this.words[this.words.length-1] + s;
			}*/
    }

    s += this.indent(this.depth) + line.trim();
    s = s.replace(new RegExp(PatternFormat.spacePlaceholderStr, "g"), " ");

    return s;
  }
  spacePlaceholderStr = " ";
  depth = 0;
  options = this.formattingOptions;
  source = this.source;
  langId = this.langId;
  offset = 0;
  prev = "";
  next = "";
  space;
  newLine;
  char;
  last;
  words = [];

  languageOverride(char) {
    if (
      this.space.language[this.langId] &&
      this.space.language[this.langId][char]
    ) {
      return this.space.language[this.langId][char];
    }
    return null;
  }

  getSpaces(char) {
    const spaces = new Spaces();
    // const config = workspace.getConfiguration("format");
    switch (char) {
      case "&":
        spaces.before = 1;
        spaces.after = 1;
        break;
      case "|":
        spaces.before = 1;
        spaces.after = 1;
        break;
      case ",":
        spaces.before = 1;
        spaces.after = 1;
        break;
      case ">":
        spaces.before = 1;
        spaces.after = 1;
        break;
      case "<":
        spaces.before = 1;
        spaces.after = 1;
        break;
      case "=":
        spaces.before = 1;
        spaces.after = 1;
        break;
      case "!":
        spaces.before = 1;
        spaces.after = 1;
        break;
      case "?":
        spaces.before = 1;
        spaces.after = 1;
        break;
      case ":":
        spaces.before = 1;
        spaces.after = 1;
        break;
      case "-":
        if (this.next === "-" || this.prev === "-" || this.next.match(/\d/)) {
          spaces.before = 0;
          spaces.after = 0;
        } else {
          spaces.before = 1;
          spaces.after = 1;
        }
        break;
      case "+":
        if (this.next === "+" || this.prev === "+") {
          spaces.before = 0;
          spaces.after = 0;
        } else {
          spaces.before = 1;
          spaces.after = 1;
        }
        break;
      case ";":
        spaces.before = 1;
        spaces.after = 1;
        break;
      case "*":
        spaces.before = 1;
        spaces.after = 1;
        break;
      case "/":
        spaces.before = 1;
        spaces.after = 1;
        break;
      case "%":
        spaces.before = 1;
        spaces.after = 1;
        break;
    }
    return spaces;
  }

  formatItem(char, s, spaces) {
    const override = this.languageOverride(char);
    if (override) {
      spaces = override;
    }
    s = s.trim();
    s += PatternFormat.spacePlaceholderStr.repeat(spaces.before);
    s += char;
    s += PatternFormat.spacePlaceholderStr.repeat(spaces.after);
    return s.trim();
  }

  formatOperator(char, s, spaces) {
    const override = this.languageOverride(char);
    if (override) {
      spaces = override;
    }
    s = s.trim();
    if (
      this.prev &&
      this.notBefore(this.prev, "=", "!", ">", "<", "?", "%", "&", "|", "/")
    ) {
      s += PatternFormat.spacePlaceholderStr.repeat(spaces.before);
    }
    s = s.trim();
    s += char;
    s = s.trim();
    if (
      this.next &&
      this.notAfter(this.next, "=", ">", "<", "?", "%", "&", "|", "/")
    ) {
      if (char !== "?" || this.source.substr(this.offset, 4) !== "?php") {
        s += PatternFormat.spacePlaceholderStr.repeat(spaces.after);
      }
    }
    return s.trim();
  }

  notBefore(prev, ...char) {
    for (const c in char) {
      if (char[c] === prev) {
        return false;
      }
    }
    return true;
  }

  notAfter(next, ...char) {
    for (const c in char) {
      if (char[c] === next) {
        return false;
      }
    }
    return true;
  }

  cleanArray(arr) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === "") {
        arr.splice(i, 1);
        i--;
      }
    }
    return arr;
  }

  spacePlaceholder(length) {
    return PatternFormat.spacePlaceholderStr.repeat(length);
  }

  lineAtIndex(str, idx) {
    const first = str.substring(0, idx);
    const last = str.substring(idx);

    const firstNewLine = first.lastIndexOf("\n");
    let secondNewLine = last.indexOf("\n");

    if (secondNewLine === -1) {
      secondNewLine = last.length;
    }

    return str.substring(firstNewLine + 1, idx + secondNewLine);
  }

  indent(amount) {
    amount = amount < 0 ? 0 : amount;
    return PatternFormat.spacePlaceholderStr.repeat(amount * 4);
  }

  // identifica os then/else que quebram a linha (comando nao está ao lado)
  // a linha de baixo deve ser agregada junto a linha atual
  regexThenWithBreak = new RegExp(/(?:then|else){1}[\s\t]+(?![\w])/gi);
}

// class SpacingFormat {
//   constructor(source, formattingOptions, languageId) {
//     return getOpenEdgeConfig().then((oeConfig) => {
//       // trim right
//       if (oeConfig.format && oeConfig.format.trim === "right") {
//         const lines = source.split("\n");
//         for (let i = 0; i < lines.length; i++) {
//           lines[i] = lines[i].trimRight();
//         }
//         source = lines.join("\n");
//       }

//       return source;
//     });
//   }
// }

let CommentType = { SingleLine: 1, MultiLine: 2 };

class Spaces {
  before = 0;
  after = 0;

  constructor(before, after) {
    this.before = before;
    this.after = after;
  }
}
