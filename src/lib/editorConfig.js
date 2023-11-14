import { conf, language } from "../languages/abl";
import { proSuggest } from "../languages/suggest";
import {
  saveAsFile,
  saveFile,
  OpenFile,
  getCodeStructure,
} from "./editorOperations";
import { formatCode, toggleCase } from "./newFormatter";
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
import CIcon from "../icons/c.png";
import TextFileIcon from "../icons/TextFile.png";

export function setupABLLanguage(monaco) {
  monaco.languages.register({
    id: "abl",
    aliases: ["openedge", "progress", "4gl"],
    extensions: [".p", ".i", ".w", ".t", ".cls"],
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
      console.log(lastWord);
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
            label: k,
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
          text: formatCode(model),
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
    setCursorPosition,
    setSelectedText,
    fileHandle,
    setFileHandle,
    setFile,
    payload,
    state,
    setStructure,
  } = params;
  editor.setValue(code ?? "");

  editor.getModel().onDidChangeContent((e) => {
    // monaco.editor.getModels().forEach((model) => model.dispose());
    const newText = editor.getValue();
    setCode(newText);
    // console.log("Text Changed");
  });

  editor.onDidPaste((e) => {
    // alert("Content pasted");
    const modelRange = new monaco.Range(1, 1, 10000, 1000);
    const editorDecorations = editor.getDecorationsInRange(modelRange);
    console.debug(modelRange, editorDecorations);
  });

  editor.onDidChangeCursorPosition((e) => {
    setCursorPosition(e.position);
  });

  editor.onKeyUp((e) => {
    if (e.code === "Period" || e.code === "Semicolon" || e.code === "Enter") {
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
      // const parsedCode = getSourceCode(editor.getValue())
    }
  );

  editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.KeyI, async () => {
    editor.getAction("editor.action.formatDocument").run();
    // const parsedCode = getSourceCode(editor.getValue())
  });
  editor.addCommand(
    monaco.KeyMod.Alt | monaco.KeyMod.Shift | monaco.KeyCode.KeyU,
    () => {
      toggleCase(monaco, editor, "upper");
    }
  );
  editor.addCommand(
    monaco.KeyMod.Alt | monaco.KeyMod.Shift | monaco.KeyCode.KeyL,
    () => {
      toggleCase(monaco, editor, "lower");
    }
  );
  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
    console.log(fileHandle);
    saveFile(fileHandle, editor, state);
    // console.log("Saved");
  });
  editor.addCommand(
    monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyS,
    () => {
      saveAsFile(setFileHandle, editor, state);
      console.log("Save As.....");
    }
  );
  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyO, () => {
    OpenFile(setFileHandle, setFile, setCode, payload);
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
    case "rpt":
    case "log":
      return "ini";
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
  const filePart = file.split(".");
  const extn =
    filePart.length === 0 ? "" : filePart[filePart.length - 1]?.toLowerCase();

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
