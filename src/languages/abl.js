import {
  attributes,
  attributesDashed,
  builtinFunctions,
  builtinVariables,
  keywords,
  keywordsDashed,
} from "./kewords";

var conf = {
  wordPattern:
    /(\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\=\+\-\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
  autoClosingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"', notIn: ["string"] },
    { open: "'", close: "'", notIn: ["string", "comment"] },
    { open: "`", close: "`", notIn: ["string", "comment"] },
    { open: "/*", close: " */", notIn: ["string", "comment"] },
    // { open: "do:", close: "end.", notIn: ["string", "comment"] },
    { open: "if ", close: "then", notIn: ["string", "comment"] },
    { open: "assign", close: ".", notIn: ["string", "comment"] },
    // { open: "repeat ", close: "end.", notIn: ["string", "comment"] },
  ],

  brackets: [
    ["{", "}", "delimiter.curly"],
    ["[", "]", "delimiter.square"],
    ["(", ")", "delimiter.parenthesis"],
    // [":", "end."],
    // ["for ", "end."],
    // ["then", ""],
    // ["when", ""],
    // ["assign", "."],
    // ["temp-table", "."],
    // ["function", "end function."],
    // ["procedure", "end procedure."],
    // ["finally", "end finally."],
    // ["catch", "end catch."],
    // ["case", "end case."],
  ],
  colorizedBracketPairs: [["{", "}"]],
  comments: {
    // lineComment: "//",
    blockComment: ["/*", "*/"],
  },
  surroundingPairs: [
    { open: '"', close: '"' },
    { open: "(", close: ")" },
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "'", close: "'" },
    { open: "`", close: "`" },
    { open: "/", close: "/" },
    { open: "*", close: "*" },
  ],
  // folding: {
  //   markers: {
  //     start: "^\\s*//\\s*#?region\\b",
  //     end: "^\\s*//\\s*#?endregion\\b",
  //   },
  // },
  // indentationRules: {
  //   increaseIndentPattern:
  //     "\bfor|\bdo:|assign\b|\bthen|\bcase|\brepeat\bFOR|\bDO:|\bASSIGN|\bTHEN|\bCASE|\bFINALLY|\bCATCH",
  //   decreaseIndentPattern: "\bend.|\bEND.|\bend |\bEND FINALLY.",
  // },
  indentationRules: {
    increaseIndentPattern: new RegExp("^.+:\\s*$|assign", "i"),
    decreaseIndentPattern: new RegExp("^\\s*end(\\.|\\s+.*\\.)$", "i"),
  },
  folding: {
    markers: {
      start: new RegExp("^.+:\\s*$", "i"),
      end: new RegExp("^\\s*end(\\.|\\s+.*\\.)$", "i"),
    },
  },
  // folding: {
  //   offSide: true,
  //   markers: {
  //     start: "^\\s*#\\s*region\\b",
  //     end: "^\\s*#\\s*endregion\\b",
  //   },
  // },
  onEnterRules: [
    {
      beforeText: new RegExp(
        "^\\s*(?:procedure|class|for|do|while|try|function|finally|catch|case|repeat).*?:\\s*$",
        "i"
      ),
      action: { indentAction: 1 },
    },
    {
      beforeText: new RegExp("^\\s*end..*?", "i"),
      action: { indentAction: 3 },
    },
  ],
};

var language = {
  defaultToken: "",
  tokenPostfix: ".p",
  ignoreCase: true,
  keywords: [...keywords],
  dashedKeywords: [...keywordsDashed],
  dashedKeywordsString: keywordsDashed.join("|"),
  properties: [...attributes],
  propertiesString: attributes.join("|"),
  dashedProperties: [...attributesDashed],
  dashedPropertiesString: attributesDashed.join("|"),
  builtinVariables: [...builtinVariables],
  builtinFunctions: [...builtinFunctions],
  operators: [
    "<",
    ">",
    "<>",
    "<=",
    ">=",
    "+",
    "-",
    "**",
    "*",
    "/",
    "%",
    "&",
    "|",
    "^",
    "!",
    "~",
    "?",
    ":",
    "=",
    "@",
  ],
  symbols: /[=><!~?:&|+\*\/\^%]+/,
  escapes:
    /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  digits: /\d+(_+\d+)*/,
  octaldigits: /[0-7]+(_+[0-7]+)*/,
  binarydigits: /[0-1]+(_+[0-1]+)*/,
  hexdigits: /[[0-9a-fA-F]+(_+[0-9a-fA-F]+)*/,
  regexpctl: /[(){}\[\]\$\^|\*+?\.]/,
  regexpesc:
    /\\(?:[bBdDfnrstvwWn0\\\/]|@regexpctl|c[A-Z]|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4})/,
  // tables: tables.join(),

  tokenizer: {
    // root: [[/[{}]/, "delimiter.bracket"], { include: "common" }],
    root: [
      { include: "numbers" },
      { include: "preproc" },
      // [/(?<=\*\/)[^]*?\*\//gm, "custom-comment"],
      [/\w*-\w*/, ""],
      [
        // /#?[a-z_$][\w$]*/,
        /[\w@#$]+/,
        {
          cases: {
            "@keywords": "keyword",
            // "@properties": { token: "keyword:$0" },
            "@operators": "operator",
            "@builtinVariables": "variable",
            "@builtinFunctions": "variable.predefined",
            "@default": "identifier",
          },
        },
      ],
      // [/[A-Z][\w\$]*/, "type.identifier"],
      { include: "@whitespace" },
      [
        /\/(?=([^\\\/]|\\.)+\/([dgimsuy]*)(\s*)(\.|;|,|\)|\]|\}|$))/,
        { token: "regexp", bracket: "@open", next: "@regexp" },
      ],
      [/[{}()\[\]]/, "@brackets"],
      [/[<>](?!@symbols)/, "@brackets"],
      [/@symbols/, { cases: { "@operators": "operator", "@default": "" } }],
      [/!(?=([^=]|$))/, "delimiter"],

      [/(@digits)[eE]([\-+]?(@digits))?/, "number.float"],
      [/(@digits)\.(@digits)([eE][\-+]?(@digits))?/, "number.float"],
      [/0[xX](@hexdigits)n?/, "number.hex"],
      [/0[oO]?(@octaldigits)n?/, "number.octal"],
      [/0[bB](@binarydigits)n?/, "number.binary"],
      [/(@digits)n?/, "number"],
      [/[;,.]/, "delimiter"],
      [/"([^"\\]|\\.)*$/, "string.invalid"],
      [/'([^'\\]|\\.)*$/, "string.invalid"],
      [/"/, "string", "@string_double"],
      [/'/, "string", "@string_single"],
      [/`/, "string", "@string_backtick"],
      // [/(\/\*[^]*?\*\/|\*[^]*?\*\/)/m, "comment"],
    ],
    whitespace: [
      [/[ \t\r\n]+/, ""],
      [/\/\*\*(?!\/)/, "comment.doc", "@jsdoc"],
      [/\/\*/, "comment", "@comment"],
      [/\/\/.*$/, "comment"],
    ],
    comment: [
      [/[^\/*]+/, "comment"],
      [/\/\*/, "comment", "@push"], // nested comment
      ["\\*/", "comment", "@pop"],
      [/[\/*]/, "comment"],
      // [/\/\*[^]*?\*\/|\*[^]*?\*\//, "comment"],
    ],
    jsdoc: [
      [/[^\/*]+/, "comment.doc"],
      [/\*\//, "comment.doc", "@pop"],
      [/[\/*]/, "comment.doc"],
    ],
    regexp: [
      [
        /(\{)(\d+(?:,\d*)?)(\})/,
        [
          "regexp.escape.control",
          "regexp.escape.control",
          "regexp.escape.control",
        ],
      ],
      [
        /(\[)(\^?)(?=(?:[^\]\\\/]|\\.)+)/,
        [
          "regexp.escape.control",
          { token: "regexp.escape.control", next: "@regexrange" },
        ],
      ],
      [/(\()(\?:|\?=|\?!)/, ["regexp.escape.control", "regexp.escape.control"]],
      [/[()]/, "regexp.escape.control"],
      [/@regexpctl/, "regexp.escape.control"],
      [/[^\\\/]/, "regexp"],
      [/@regexpesc/, "regexp.escape"],
      [/\\\./, "regexp.invalid"],
      [
        /(\/)([dgimsuy]*)/,
        [{ token: "regexp", bracket: "@close", next: "@pop" }, "keyword.other"],
      ],
    ],
    regexrange: [
      // [/-/, "regexp.escape.control"],
      [/\^/, "regexp.invalid"],
      [/@regexpesc/, "regexp.escape"],
      [/[^\]]/, "regexp"],
      [
        /\]/,
        {
          token: "regexp.escape.control",
          next: "@pop",
          bracket: "@close",
        },
      ],
    ],
    string_double: [
      [/[^\\"]+/, "string.quote"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }],
    ],
    string_single: [
      [/[^\\']+/, "string.quote"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/'/, { token: "string.quote", bracket: "@close", next: "@pop" }],
    ],
    string_backtick: [
      [/\$\{/, { token: "delimiter.bracket", next: "@bracketCounting" }],
      [/[^\\`$]+/, "string.quote"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/`/, { token: "string.quote", bracket: "@close", next: "@pop" }],
    ],
    bracketCounting: [
      [/\{/, "delimiter.bracket", "@bracketCounting"],
      [/\}/, "delimiter.bracket", "@pop"],
      // { include: "common" },
    ],
    numbers: [
      [/0[xX][0-9a-fA-F]*/, "number"],
      // [/[$][+-]*\d*(\.\d*)?/, "number"],
      [/((\d+(\.\d*)?)|(\.\d+))([eE][\-+]?\d+)?/, "number"],
    ],
    preproc: [
      // [/(?<!\w)&\w+[-]+\w+/, "variable.predefined"],

      // [/\{.*$/, "white"],
      [/\&analyze.*$/, "preproc"],
      // [/\{/, "curlenclosed"],
      // [/\}/, "curlenclosed"],
      [/{([^}]*)}/, "curlenclosed"],
      // [/([^\s]*)\/\w+\.\w+|([^\s]*)\/\w+/, "directory"],
      [/TEMP-TABLE/, "keyword"],
      [/scoped-define/, "keyword"],
      [/global-define/, "keyword"],
      [/@dashedKeywordsString/, "keyword"],
      [/@dashedPropertiesString/, "tag"],
      [/^(\s*)(@propertiesString)$/, "tag"],
      // [/@tables/, "variable,predefined"],
    ],
  },
};

export { conf, language };
