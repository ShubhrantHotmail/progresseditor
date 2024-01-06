import { conf, language } from "../languages/abl";
import { proSuggest } from "../languages/suggest";
import {
  saveAsFile,
  saveFile,
  OpenFile,
  getCodeStructure,
} from "./editorOperations";
import { formatCode } from "./newFormatter";
import { tables, fields } from "../data/tradesys";
import PIcon from "../icons/P.png";
import WIcon from "../icons/W.png";
import IIcon from "../icons/I.png";
import HtmlIcon from "../icons/html.png";
import XmlIcon from "../icons/xml.png";
import UnknownIcon from "../icons/UnknownFile.png";
import JsonIcon from "../icons/json.png";
import JsIcon from "../icons/js.png";
import ShIcon from "../icons/sh.png";
import JavaIcon from "../icons/java.png";
import CsvIcon from "../icons/csv.png";
import TextFileIcon from "../icons/TextFile.png";

export function setupABLLanguage(monaco) {
  monaco.languages.register({
    id: "abl",
    aliases: ["openedge", "progress", "4gl"],
    extensions: [".p", ".i", ".w", ".t", ".cls", ".pf", ".df"],
  });

  monaco.languages.setMonarchTokensProvider("abl", { ...language });
  monaco.languages.setLanguageConfiguration("abl", { ...conf });
  /*** Suggestion after entering Semicolon */
  monaco.languages.registerCompletionItemProvider("abl", {
    triggerCharacters: [":"],
    provideCompletionItems: (model, position) => {
      var word = model.getWordUntilPosition(position);
      var range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: 1,
        endColumn: word.endColumn - 1,
      };

      const lineArray = model.getValueInRange(range)?.trim()?.split(" ");

      if (
        lineArray?.[0]?.toLowerCase() === "do" ||
        lineArray?.[0]?.toLowerCase() === "do" ||
        lineArray?.[0]?.toLowerCase() === "for" ||
        lineArray?.[0]?.toLowerCase() === "repeat" ||
        lineArray?.[lineArray.length - 1]?.toLowerCase() === "do"
      )
        return null;

      // console.log(lineArray);
      const suggestions = [
        ...language.dashedProperties.map((k) => {
          return {
            label: k,
            kind: monaco.languages.CompletionItemKind.Property,
            insertText: k,
          };
        }),
      ];
      return { suggestions: suggestions };
    },
  });

  /*** Suggestion after entering period for table fields */
  monaco.languages.registerCompletionItemProvider("abl", {
    triggerCharacters: ["."],
    provideCompletionItems: (model, position) => {
      var word = model.getWordUntilPosition(position);
      var range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: 1,
        endColumn: word.endColumn - 1,
      };

      const lineArray = model.getValueInRange(range)?.trim()?.split(" ");
      const lastWord = lineArray?.[lineArray.length - 1];
      // console.log(lastWord);
      if (tables.indexOf(lastWord) === -1) return { suggestions: [] };

      const columns = fields?.find((item) => item?.table === lastWord)?.columns;
      if (!columns) return { suggestions: [] };

      // console.log(columns);
      const suggestions = [
        ...columns.map((k) => {
          return {
            label: k,
            kind: monaco.languages.CompletionItemKind.Field,
            insertText: k,
          };
        }),
      ];
      return { suggestions: suggestions };
    },
  });

  /*** General suggestion for all keywords */
  monaco.languages.registerCompletionItemProvider("abl", {
    // triggerCharacters: [":"],
    // triggerKind: true,
    provideCompletionItems: (model, position) => {
      var word = model.getWordUntilPosition(position);
      var range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };
      var customSuggestPatterns = proSuggest(monaco, range);
      const suggestions = [
        ...language.keywords.map((k) => {
          return {
            label: k,
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: k,
          };
        }),
        ...language.dashedKeywords.map((k) => {
          return {
            label: k,
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: k,
          };
        }),
        ...language.properties.map((k) => {
          return {
            label: k,
            kind: monaco.languages.CompletionItemKind.Property,
            insertText: k,
          };
        }),
        ...language.builtinVariables.map((k) => {
          return {
            label: k,
            kind: monaco.languages.CompletionItemKind.Variable,
            insertText: k,
          };
        }),
        ...language.builtinFunctions.map((k) => {
          return {
            label: k,
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: k,
          };
        }),
        ...tables.map((k) => {
          return {
            label: `${k}${String.fromCharCode(32).repeat(
              36 - k.length
            )}(Tradesys Table)`,
            kind: monaco.languages.CompletionItemKind.Enum,
            insertText: k,
          };
        }),
        ...customSuggestPatterns,
      ];
      return { suggestions: suggestions };
    },
  });
  monaco.languages.registerDocumentFormattingEditProvider("abl", {
    provideDocumentFormattingEdits: function (model, options, token) {
      // console.log(
      //   model.getLineCount(),
      //   model.getLineLength(model.getLineCount())
      // );

      return [
        {
          range: {
            startLineNumber: 0,
            startColumn: 0,
            endLineNumber: model.getLineCount(),
            endColumn: model.getLineLength(model.getLineCount()) + 1,
          },
          // text: ablFormatter(model, options),
          text: formatCode(model, monaco),
        },
      ];
    },
  });
}

export function setupEditor(params) {
  const {
    monaco,
    editor,
    code,
    setCode,
    setFileText,
    setCursorPosition,
    setSelectedText,
    fileHandle,
    setFileHandle,
    setFile,
    payload,
    state,
    setStructure,
  } = params;

  // console.log(editor, code);
  editor.setValue(code ?? "");
  // editor.onDidChangeModelContent((e) => {
  //   console.log(e);
  // });
  editor.onDidChangeModelContent((e) => {
    const newText = editor.getValue();
    // setCode(newText);
    if (e.isUndoing === true || e.isRedoing === true) {
      const data = getCodeStructure(editor);
      setStructure({
        ...data,
      });
    }
    localStorage.setItem("changed", newText);
    const originalText = localStorage.getItem("original");
    if (newText !== originalText) {
      payload({ type: "SAVED", value: false });
    } else payload({ type: "SAVED", value: true });
  });

  editor.onDidPaste((e) => {
    // const modelRange = new monaco.Range(1, 1, 10000, 1000);
    // const editorDecorations = editor.getDecorationsInRange(modelRange);
    const data = getCodeStructure(editor);
    setStructure({
      ...data,
    });
  });

  editor.onDidChangeCursorPosition((e) => {
    setCursorPosition(e.position);
    console.log(e.position);
    const obj = state.fileList?.find(
      (file) => file?.filePath === state?.remoteFile
    );
    if (obj) obj.position = e.position;
  });

  editor.onKeyUp((e) => {
    if (e.code === "Period" || e.code === "Semicolon" || e.code === "Enter") {
      // console.log(e.code);
      const data = getCodeStructure(editor);
      setStructure({
        ...data,
      });
    }
  });

  editor.onDidChangeCursorSelection((e) => {
    setSelectedText(editor.getModel().getValueInRange(editor.getSelection()));
  });

  editor.addCommand(
    monaco.KeyMod.Alt | monaco.KeyMod.Shift | monaco.KeyCode.KeyF,
    async () => {
      editor.getAction("editor.action.formatDocument").run();
      // setFileText(editor.getValue());
      localStorage.setItem("changed", editor.getValue());
      setCode(editor.getValue());
      // const parsedCode = getSourceCode(editor.getValue())
    }
  );

  // editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyI, async () => {
  //   editor.getAction("editor.action.formatDocument").run();
  //   // setFileText(editor.getValue());
  //   localStorage.setItem("changed", editor.getValue());
  //   setCode(editor.getValue());

  //   // const parsedCode = getSourceCode(editor.getValue())
  // });
  // editor.addCommand(
  //   monaco.KeyMod.Alt | monaco.KeyMod.Shift | monaco.KeyCode.KeyU,
  //   () => {
  //     toggleCase(monaco, editor, "upper");
  //   }
  // );
  // editor.addCommand(
  //   monaco.KeyMod.Alt | monaco.KeyMod.Shift | monaco.KeyCode.KeyL,
  //   () => {
  //     toggleCase(monaco, editor, "lower");
  //   }
  // );
  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
    // console.log(state);
    saveFile(
      setFileHandle,
      fileHandle,
      editor,
      setFile,
      setFileText,
      payload,
      state
    );
    // console.log("Saved");
  });
  editor.addCommand(
    monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyS,
    () => {
      saveAsFile(setFileHandle, editor, setFile, setFileText, payload, state);
      // console.log("Save As.....");
    }
  );
  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyO, () => {
    OpenFile(setFileHandle, setFile, setFileText, payload);
  });
  // editor.trigger(‘anyString’, 'editor.action.formatDocument');
}

export const getLang = (file) => {
  const filePart = file.split(".");
  const extn =
    filePart.length === 0 ? "" : filePart[filePart.length - 1]?.toLowerCase();

  switch (extn) {
    case "":
    case "txt":
    case "dat":
    case "out":
      return "plaintext";
    case "c":
      return "c";
    case "java":
      return "java";
    case "ini":
      return "ini";
    case "rpt":
    case "log":
    case "err":
    case "error":
    case "trace":
      return "log";
    case "p":
    case "i":
    case "w":
    case "cls":
    case "t":
    case "pf":
      return "abl";
    case "xml":
      return "xml";
    case "sh":
    case "ksh":
    case "bash":
      return "shell";
    case "htm":
    case "html":
      return "html";
    case "py":
      return "python";
    case "js":
    case "jsx":
      return "javascript";
    case "java":
      return "java";
    case "json":
      return "json";
    default:
      return "plaintext";
  }
};

export const getFileIcon = (file) => {
  const filePart = file?.split(".");
  const extn =
    filePart?.length === 0
      ? ""
      : filePart?.[filePart?.length - 1]?.toLowerCase();

  switch (extn) {
    case "":
    case "txt":
    case "dat":
    case "out":
    case "rpt":
    case "log":
      return TextFileIcon;
    case "csv":
      return CsvIcon;
    case "p":
      return PIcon;
    case "w":
      return WIcon;
    case "i":
      return IIcon;
    case "xml":
      return XmlIcon;
    case "sh":
    case "ksh":
    case "bash":
      return ShIcon;
    case "htm":
    case "html":
      return HtmlIcon;
    case "js":
    case "jsx":
      return JsIcon;
    case "java":
      return JavaIcon;
    case "json":
      return JsonIcon;
    default:
      return UnknownIcon;
  }
};

export const setDynamicCompletion = (monaco, structure) => {
  const tempTables = [];
  const fields = [];
  const variables = [...structure?.definedVariables];
  const functions = [...structure?.functions];
  const procedures = [...structure?.procedures];
  // const includeFiles = [...structure?.includeFiles];

  console.log(structure);
  structure?.tempTables?.map((table) => {
    tempTables.push(table?.name);
    fields.push({ columns: table?.fields, table: table?.name });
  });

  monaco.languages.registerCompletionItemProvider("abl", {
    provideCompletionItems: (model, position) => {
      const suggestions = [
        ...variables.map((k) => {
          return {
            label: `${k?.name}${String.fromCharCode(32).repeat(
              36 - k?.name?.length
            )}${k?.dataType}`,
            kind: monaco.languages.CompletionItemKind.Variable,
            insertText: k?.name,
          };
        }),
      ];
      return { suggestions: suggestions };
    },
  });
  monaco.languages.registerCompletionItemProvider("abl", {
    provideCompletionItems: (model, position) => {
      const suggestions = [
        ...functions.map((k) => {
          return {
            label: `${k?.name}${String.fromCharCode(32).repeat(
              36 - k?.name?.length
            )}${k?.retuns}`,
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: k?.name,
          };
        }),
      ];
      return { suggestions: suggestions };
    },
  });
  monaco.languages.registerCompletionItemProvider("abl", {
    provideCompletionItems: (model, position) => {
      const suggestions = [
        ...procedures.map((k) => {
          return {
            label: `${k?.name}${String.fromCharCode(32).repeat(
              36 - k?.name?.length
            )}(Procedure Block)`,
            kind: monaco.languages.CompletionItemKind.Method,
            insertText: k?.name,
          };
        }),
      ];
      return { suggestions: suggestions };
    },
  });
  monaco.languages.registerCompletionItemProvider("abl", {
    provideCompletionItems: (model, position) => {
      const suggestions = [
        ...tempTables.map((k) => {
          return {
            label: `${k}${String.fromCharCode(32).repeat(
              36 - k.length
            )}(Temp-Table)`,
            kind: monaco.languages.CompletionItemKind.EnumMember,
            insertText: k,
          };
        }),
      ];
      return { suggestions: suggestions };
    },
  });
  monaco.languages.registerCompletionItemProvider("abl", {
    triggerCharacters: ["."],
    provideCompletionItems: (model, position) => {
      var word = model.getWordUntilPosition(position);
      var range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: 1,
        endColumn: word.endColumn - 1,
      };

      const lineArray = model.getValueInRange(range)?.trim()?.split(" ");
      const lastWord = lineArray?.[lineArray.length - 1];
      // console.log(lastWord);
      if (tempTables.indexOf(lastWord) === -1) return { suggestions: [] };

      const columns = fields?.find((item) => item?.table === lastWord)?.columns;
      if (!columns) return { suggestions: [] };

      // console.log(columns);
      const suggestions = [
        ...columns.map((k) => {
          return {
            label: `${k.name}${String.fromCharCode(32).repeat(
              36 - k.name.length
            )}${k.dataType}`,
            kind: monaco.languages.CompletionItemKind.Field,
            insertText: k.name,
          };
        }),
      ];
      return { suggestions: suggestions };
    },
  });
};
