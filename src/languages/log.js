export function setLanguageLog(monaco) {
  monaco.languages.register({
    id: "log",
    aliases: ["log", "error", "trace"],
    extensions: [".log", ".err", ".error", ".trace", ".txt", ".dat", ".log.*"],
  });

  monaco.languages.setMonarchTokensProvider("log", {
    ignoreCase: true,
    operators: [
      "<",
      ">",
      "<>",
      "<=",
      ">=",
      "+",
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
    tokenizer: {
      root: [
        { include: "numbers" },
        // [/\w*-\w*/, ""],
        [/info/, "log-info"],
        [/warning|warn/, "log-warning"],
        [/error/, "log-error"],
        [/debug/, "log-debug"],
        [/success|successful|successfully/, "log-success"],
        [
          /\d{4}\/\d{2}\/\d{2}|\d{2}\/\d{2}\/\d{4}|\d{2}\/\d{2}\/\d{2}/,
          "log-date",
        ],
        [/\d{2}:\d{2}:\d{2}|\d{2}:\d{2}:\d{2}\.\d+/, "log-time"],
        [/[-_.a-zA-Z0-9]+@[-_.a-zA-Z0-9]+/, "log-email"],
        [/\-/, "log-debug"],
        [
          /[\w@#$]+/,
          {
            cases: {
              "@operators": "operator",
            },
          },
        ],
        [/[{}()\[\]]/, "@brackets"],
        [/[<>](?!@symbols)/, "@brackets"],
        [/@symbols/, { cases: { "@operators": "operator", "@default": "" } }],
      ],
      numbers: [[/\s+[0-9]+\s|\s+[0-9]+$/, "number"]],
    },
  });
}
