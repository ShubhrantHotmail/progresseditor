export const proSuggest = (monaco, range) => {
  return [
    {
      label: "dvch",
      kind: monaco.languages.CompletionItemKind.Variable,
      insertText: ["DEFINE VARIABLE $0 AS CHARACTER   NO-UNDO."].join("\n"),
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "define-variable Statement",
      range: range,
    },
    {
      label: "dvin",
      kind: monaco.languages.CompletionItemKind.Variable,
      insertText: ["DEFINE VARIABLE $0 AS INTEGER     NO-UNDO."].join("\n"),
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "define-variable Statement",
      range: range,
    },
    {
      label: "dvin64",
      kind: monaco.languages.CompletionItemKind.Variable,
      insertText: ["DEFINE VARIABLE $0 AS INT64       NO-UNDO."].join("\n"),
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "define-variable Statement",
      range: range,
    },
    {
      label: "dvde",
      kind: monaco.languages.CompletionItemKind.Variable,
      insertText: ["DEFINE VARIABLE $0 AS DECIMAL     NO-UNDO."].join("\n"),
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "define-variable Statement",
      range: range,
    },
    {
      label: "dvda",
      kind: monaco.languages.CompletionItemKind.Variable,
      insertText: ["DEFINE VARIABLE $0 AS DATE        NO-UNDO."].join("\n"),
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "define-variable Statement",
      range: range,
    },
    {
      label: "dvdt",
      kind: monaco.languages.CompletionItemKind.Variable,
      insertText: ["DEFINE VARIABLE $0 AS DATETIME    NO-UNDO."].join("\n"),
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "define-variable Statement",
      range: range,
    },
    {
      label: "dvdtz",
      kind: monaco.languages.CompletionItemKind.Variable,
      insertText: ["DEFINE VARIABLE $0 AS DATETIME-TZ NO-UNDO."].join("\n"),
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "define-variable Statement",
      range: range,
    },
    {
      label: "dvlg",
      kind: monaco.languages.CompletionItemKind.Variable,
      insertText: ["DEFINE VARIABLE $0 AS LOGICAL     NO-UNDO."].join("\n"),
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "define-variable Statement",
      range: range,
    },
    {
      label: "dvlc",
      kind: monaco.languages.CompletionItemKind.Variable,
      insertText: ["DEFINE VARIABLE $0 AS LONGCHAR    NO-UNDO."].join("\n"),
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "define-variable Statement",
      range: range,
    },
    {
      label: "dvhn",
      kind: monaco.languages.CompletionItemKind.Variable,
      insertText: ["DEFINE VARIABLE $0 AS HANDLE      NO-UNDO."].join("\n"),
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "define-variable Statement",
      range: range,
    },
    {
      label: "dvwh",
      kind: monaco.languages.CompletionItemKind.Variable,
      insertText: ["DEFINE VARIABLE $0 AS WIDGET-HANDLE NO-UNDO."].join("\n"),
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "define-variable Statement",
      range: range,
    },
    {
      label: "dvchn",
      kind: monaco.languages.CompletionItemKind.Variable,
      insertText: ["DEFINE VARIABLE $0 AS COM-HANDLE  NO-UNDO."].join("\n"),
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "define-variable Statement",
      range: range,
    },
    {
      label: "dvmp",
      kind: monaco.languages.CompletionItemKind.Variable,
      insertText: ["DEFINE VARIABLE $0 AS MEMPTR      NO-UNDO."].join("\n"),
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "define-variable Statement",
      range: range,
    },
    {
      label: "dvrw",
      kind: monaco.languages.CompletionItemKind.Variable,
      insertText: ["DEFINE VARIABLE $0 AS RAW         NO-UNDO."].join("\n"),
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "define-variable Statement",
      range: range,
    },
    {
      label: "dtt",
      kind: monaco.languages.CompletionItemKind.Variable,
      insertText: ["DEFINE TEMP-TABLE $0 NO-UNDO."].join("\n"),
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "define-temp-table Statement",
      range: range,
    },
    {
      label: "ipch",
      kind: monaco.languages.CompletionItemKind.TypeParameter,
      insertText: ["DEFINE INPUT  PARAMETER $0 AS CHARACTER NO-UNDO."].join(
        "\n"
      ),
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "define-input-parameter Statement",
      range: range,
    },
    {
      label: "opch",
      kind: monaco.languages.CompletionItemKind.TypeParameter,
      insertText: ["DEFINE OUTPUT PARAMETER $0 AS CHARACTER NO-UNDO."].join(
        "\n"
      ),
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "define-input-parameter Statement",
      range: range,
    },
    {
      label: "ipin",
      kind: monaco.languages.CompletionItemKind.TypeParameter,
      insertText: ["DEFINE INPUT  PARAMETER $0 AS INTEGER NO-UNDO."].join("\n"),
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "define-input-parameter Statement",
      range: range,
    },
    {
      label: "opin",
      kind: monaco.languages.CompletionItemKind.TypeParameter,
      insertText: ["DEFINE OUTPUT PARAMETER $0 AS INTEGER NO-UNDO."].join("\n"),
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "define-input-parameter Statement",
      range: range,
    },
    {
      label: "ipde",
      kind: monaco.languages.CompletionItemKind.TypeParameter,
      insertText: ["DEFINE INPUT  PARAMETER $0 AS DECIMAL NO-UNDO."].join("\n"),
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "define-input-parameter Statement",
      range: range,
    },
    {
      label: "opde",
      kind: monaco.languages.CompletionItemKind.TypeParameter,
      insertText: ["DEFINE OUTPUT PARAMETER $0 AS DECIMAL NO-UNDO."].join("\n"),
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "define-input-parameter Statement",
      range: range,
    },
    {
      label: "ipda",
      kind: monaco.languages.CompletionItemKind.TypeParameter,
      insertText: ["DEFINE INPUT  PARAMETER $0 AS DATE NO-UNDO."].join("\n"),
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "define-input-parameter Statement",
      range: range,
    },
    {
      label: "opda",
      kind: monaco.languages.CompletionItemKind.TypeParameter,
      insertText: ["DEFINE OUTPUT PARAMETER $0 AS DATE NO-UNDO."].join("\n"),
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "define-input-parameter Statement",
      range: range,
    },
    {
      label: "ipdt",
      kind: monaco.languages.CompletionItemKind.TypeParameter,
      insertText: ["DEFINE INPUT  PARAMETER $0 AS DATETIME NO-UNDO."].join(
        "\n"
      ),
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "define-input-parameter Statement",
      range: range,
    },
    {
      label: "opdt",
      kind: monaco.languages.CompletionItemKind.TypeParameter,
      insertText: ["DEFINE OUTPUT PARAMETER $0 AS DATETIME NO-UNDO."].join(
        "\n"
      ),
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "define-input-parameter Statement",
      range: range,
    },
    {
      label: "iplg",
      kind: monaco.languages.CompletionItemKind.TypeParameter,
      insertText: ["DEFINE INPUT  PARAMETER $0 AS LOGICAL NO-UNDO."].join("\n"),
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "define-input-parameter Statement",
      range: range,
    },
    {
      label: "oplg",
      kind: monaco.languages.CompletionItemKind.TypeParameter,
      insertText: ["DEFINE OUTPUT PARAMETER $0 AS LOGICAL NO-UNDO."].join("\n"),
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "define-input-parameter Statement",
      range: range,
    },
    {
      label: "iphn",
      kind: monaco.languages.CompletionItemKind.TypeParameter,
      insertText: ["DEFINE INPUT  PARAMETER $0 AS HANDLE NO-UNDO."].join("\n"),
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "define-input-parameter Statement",
      range: range,
    },
    {
      label: "ophn",
      kind: monaco.languages.CompletionItemKind.TypeParameter,
      insertText: ["DEFINE OUTPUT PARAMETER $0 AS HANDLE NO-UNDO."].join("\n"),
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "define-input-parameter Statement",
      range: range,
    },
    {
      label: "iptt",
      kind: monaco.languages.CompletionItemKind.TypeParameter,
      insertText: ["DEFINE INPUT  PARAMETER TABLE FOR $0."].join("\n"),
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "define-input-parameter Statement",
      range: range,
    },
    {
      label: "optt",
      kind: monaco.languages.CompletionItemKind.TypeParameter,
      insertText: ["DEFINE OUTPUT PARAMETER TABLE FOR $0."].join("\n"),
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "define-input-parameter Statement",
      range: range,
    },
    {
      label: "iott",
      kind: monaco.languages.CompletionItemKind.TypeParameter,
      insertText: ["DEFINE INPUT-OUTPUT PARAMETER TABLE FOR $0."].join("\n"),
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "define-input-parameter Statement",
      range: range,
    },
    {
      label: "ioch",
      kind: monaco.languages.CompletionItemKind.TypeParameter,
      insertText: [
        "DEFINE INPUT-OUTPUT PARAMETER $0 AS CHARACTER NO-UNDO.",
      ].join("\n"),
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "define-input-parameter Statement",
      range: range,
    },
    {
      label: "ioin",
      kind: monaco.languages.CompletionItemKind.TypeParameter,
      insertText: ["DEFINE INPUT-OUTPUT PARAMETER $0 AS INTEGER NO-UNDO."].join(
        "\n"
      ),
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "define-input-parameter Statement",
      range: range,
    },
    {
      label: "ioda",
      kind: monaco.languages.CompletionItemKind.TypeParameter,
      insertText: ["DEFINE INPUT-OUTPUT PARAMETER $0 AS DATE NO-UNDO."].join(
        "\n"
      ),
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "define-input-parameter Statement",
      range: range,
    },
    {
      label: "iodt",
      kind: monaco.languages.CompletionItemKind.TypeParameter,
      insertText: [
        "DEFINE INPUT-OUTPUT PARAMETER $0 AS DATETIME NO-UNDO.",
      ].join("\n"),
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "define-input-parameter Statement",
      range: range,
    },
    {
      label: "iolg",
      kind: monaco.languages.CompletionItemKind.TypeParameter,
      insertText: ["DEFINE INPUT-OUTPUT PARAMETER $0 AS LOGICAL NO-UNDO."].join(
        "\n"
      ),
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "define-input-parameter Statement",
      range: range,
    },
    {
      label: "iode",
      kind: monaco.languages.CompletionItemKind.TypeParameter,
      insertText: ["DEFINE INPUT-OUTPUT PARAMETER $0 AS DECIMAL NO-UNDO."].join(
        "\n"
      ),
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "define-input-parameter Statement",
      range: range,
    },
    {
      label: "iohn",
      kind: monaco.languages.CompletionItemKind.TypeParameter,
      insertText: ["DEFINE INPUT-OUTPUT PARAMETER $0 AS HANDLE NO-UNDO."].join(
        "\n"
      ),
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "define-input-parameter Statement",
      range: range,
    },
    {
      label: "foreach",
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: ["FOR EACH $0:", "END."].join("\n"),
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "for-each Statement",
      range: range,
    },
    {
      label: "forfirst",
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: ["FOR FIRST $0:", "END."].join("\n"),
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "for-first Statement",
      range: range,
    },
    {
      label: "forlast",
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: ["FOR LAST $0:", "END."].join("\n"),
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "for-last Statement",
      range: range,
    },
    {
      label: "function-block",
      kind: monaco.languages.CompletionItemKind.Function,
      insertText: [
        "FUNCTION ${1:function-name} RETURNS ${2:data-type} (/* INPUT PARAMS */).",
        "\tDEFINE VARIABLE result AS ${3:data-type} NO-UNDO.",
        "\n\tRETURN result.",
        "END FUNCTION.",
      ].join("\n"),
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "function declaration",
      range: range,
    },
    {
      label: "proc-block",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: [
        "PROCEDURE ${1:pProc} /* PRIVATE */:",
        "\t$0",
        "END PROCEDURE.",
      ].join("\n"),
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "procedure declaration",
      range: range,
    },
    {
      label: "find-statement",
      kind: monaco.languages.CompletionItemKind.Reference,
      insertText: ["FIND $1 NO-ERROR.", "IF AVAILABLE $0 THEN"].join("\n"),
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "find statement",
      range: range,
    },
    {
      label: "LOOKUP",
      kind: monaco.languages.CompletionItemKind.Function,
      insertText: ["LOOKUP ( ${1:text} , ${2:list} )"].join("\n"),
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "lookup function",
      range: range,
    },
    {
      label: "DO:",
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: ["DO:", "\t$0", "END."].join("\n"),
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "do block",
      range: range,
    },
    {
      label: "REPEAT",
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: ["REPEAT ", "\t$0", "END."].join("\n"),
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "repeat block",
      range: range,
    },
    {
      label: "finally-block",
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: ["FINALLY:", "\t$0", "END FINALLY."].join("\n"),
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "finally block declaration",
      range: range,
    },
    {
      label: "catch-block",
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: [
        "CATCH err AS Progress.Lang.Error:",
        "\t$0",
        "END CATCH.",
      ].join("\n"),
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "catch block declaration",
      range: range,
    },
    {
      label: "main-block",
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: [
        "MAIN-BLOCK:",
        "DO ON ERROR UNDO , LEAVE:",
        "\t$0",
        "END.",
      ].join("\n"),
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "main declaration",
      range: range,
    },
    {
      label: "message-alert",
      kind: monaco.languages.CompletionItemKind.Function,
      insertText: ["MESSAGE $0", "\tVIEW-AS ALERT-BOX INFORMATION."].join("\n"),
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "alert-box declaration",
      range: range,
    },
    {
      label: "run-persistent",
      kind: monaco.languages.CompletionItemKind.Function,
      insertText: ["RUN ${1:ext-proc} PERSISTENT SET ${2:handle-var}."].join(
        "\n"
      ),
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Persistent run",
      range: range,
    },
    {
      label: "sc",
      kind: monaco.languages.CompletionItemKind.Keyword,
      insertText: ["&SCOPED-DEFINE $0"].join("\n"),
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Scoped defined pre-processor",
      range: range,
    },
    {
      label: "gl",
      kind: monaco.languages.CompletionItemKind.Keyword,
      insertText: ["&GLOBAL-DEFINE $0"].join("\n"),
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Scoped defined pre-processor",
      range: range,
    },
  ];
};
