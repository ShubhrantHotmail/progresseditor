export function parseQuestion(query) {
  const answer = {
    query,
    action: null,
    file: null,
    error: null,
    suggest: null,
    response: null,
    clarify: null,
    app: null,
    subapp: [],
    filetype: "",
    area: null,
    date: null,
  };

  let words = query?.split(" ");
  words = words.filter(Boolean); // Remove blank elements

  if (
    query.toLowerCase().indexOf("version") > -1 ||
    query.toLowerCase().indexOf("task") > -1 ||
    query.toLowerCase().indexOf("history") > -1 ||
    query.toLowerCase().indexOf("workspace") > -1 ||
    query.toLowerCase().indexOf("wspace") > -1 ||
    query.toLowerCase().indexOf("object") > -1 ||
    // query.toLowerCase().indexOf("rtb") > -1 ||
    query.toLowerCase().indexOf("round table") > -1 ||
    query.toLowerCase().indexOf("code") > -1 ||
    query.toLowerCase().indexOf("diff") > -1
  ) {
    const token = parseRtbQuestion(query);
    return token;
  }
  let action = "";
  let loc = "";
  let file = "";
  const apps = [
    { name: ["crd", "charles river", "cr"], folder: "crd" },
    { name: ["di"], folder: "DI" },
    { name: ["trdimp", "sim", "trade import", "sim import"], folder: "trdimp" },
    { name: ["stp"], folder: "stp" },
    { name: ["markit"], folder: "markit" },
    { name: ["appserver", "app server"], folder: "appsvr" },
  ];
  let areas = [
    "dev",
    "ut",
    "ut2",
    "rpt",
    "gpp",
    "sp1",
    "sp2",
    "sp3",
    "sp4",
    "sp5",
    "sp6",
    "sp7",
    "sp8",
    "sp9",
  ];
  let subapps = [
    "log",
    "logs",
    "inbound",
    "outbound",
    "archive",
    "exception",
    "pending",
    "backup",
    "save",
    "upload",
    "download",
  ];
  const filetypes = [
    { name: ["pdf", ".pdf"], extent: "*.pdf" },
    { name: ["csv", ".csv"], extent: "*.csv" },
    { name: ["text", "txt", ".txt"], extent: "*.txt" },
    { name: ["excel", ".xls"], extent: "*.xls*" },
    { name: ["log", ".log"], extent: "*.log" },
    { name: ["p", ".p"], extent: "*.p" },
    { name: ["shell script", "shell", ".sh"], extent: "*.sh" },
  ];
  let app = "";
  let subapp = "";
  let filetype = "";

  if (words?.length === 1 && words?.[0]?.split("/")?.length > 1) {
    answer.action = "open";
    answer.file = words[0];
    answer.file = answer.file.replaceAll("//", "/");
    return answer;
  }

  words.forEach((word, index) => {
    if (word === "") return;
    switch (word?.toLowerCase()) {
      case "open":
      case "view":
      case "list":
      case "go":
      case "show":
      case "explore":
      case "browse":
      case "fetch":
        action = "open";
        break;
      case "create":
      case "new":
      case "make":
        action = "create";
        break;
      // case "file":
      //   action = action + "file";
      //   file = words[index + 1];
      //   break;
      case "folder":
      case "dir":
      case "directory":
      case "path":
        if (["of", "in", "from"].indexOf(words[index + 1]) < 0)
          answer.app = words[index + 1];
        action = action + "folder";
        break;
      case "files":
      case "file":
        if (filetype === "") {
          filetype = "*" + words[index - 1];
          if (
            ["open", "show", "list", "get", "fetch", "view", "browse"].indexOf(
              words[index - 1]?.toLowerCase()
            ) > -1
          )
            filetype = "";
          answer.filetype = filetype;
        }
    }
    // if (apps.indexOf(word) > -1) app = word;
    apps?.forEach((item) => {
      // console.log(item, word, item?.name?.indexOf(word?.toLowerCase()));
      if (item?.name?.indexOf(word?.toLowerCase()) > -1) app = item.folder;
    });

    filetypes?.forEach((item) => {
      if (item?.name?.indexOf(word?.toLowerCase()) > -1) {
        filetype = item.extent;
        answer.filetype = filetype;
      }
    });

    if (word === "of" || word === "from") {
      // console.log(answer.app);
      app = words[index + 1];
      if (answer.app && answer.app !== "") answer.app = app + "/" + answer.app;
      else answer.app = app;
    }
    if (word === "in") {
      loc = words[index + 1];
      answer.area = loc;
    }
    if (word === "area" || word === "region") {
      loc = words[index + 1];
      answer.area = loc;
    }
    if (subapps.indexOf(word?.toLowerCase()) > -1) {
      subapp = word;
      answer.subapp = subapp;
    }
  });

  if (query?.toLowerCase()?.indexOf("today") > -1) answer.date = "today";

  answer.action = action;
  if (answer?.action === "") {
    answer.error = "Could not understand what action you want to perform?";
    answer.suggest = ["Open folder or file", "Create folder or file"];
    return answer;
  }

  if (
    query?.toLowerCase()?.indexOf("my home") > -1 &&
    (action === "open" || action === "openfolder")
  ) {
    answer.file = "/home/sn3";
    if (filetype !== "") answer.file = "/home/sn3/" + filetype;
    answer.response = "Opening your home directory.....";
    answer.file = answer.file.replaceAll("//", "/");
    return answer;
  }

  if (
    query?.toLowerCase()?.indexOf("my work") > -1 &&
    (action === "open" || action === "openfolder")
  ) {
    answer.file = "/sccs/work/sn3";
    if (filetype !== "") answer.file = "/sccs/work/sn3/" + filetype;
    answer.response = "Opening your work directory.....";
    answer.file = answer.file.replaceAll("//", "/");
    return answer;
  }

  if ((action === "open" || action === "openfolder") && file === "") {
    words.forEach((word, index) => {
      if (word === "") return;
      if (word === "open") file = words[index + 1];
    });
  }

  if (loc === "") {
    words.forEach((word, index) => {
      if (areas?.indexOf(word?.toLowerCase()) > -1) loc = word?.toLowerCase();
      // console.log(word, areas?.indexOf(word?.toLowerCase()));
    });
  }
  answer.file = file;

  if (loc !== "" && app !== "") {
    answer.app = app;
    // console.log("loc", loc, "app", app, "subapp", subapp);
    if (app === "appsvr") file = `/tis/data/appsvr/${loc}`;
    else file = `/onetis.${loc}/data/${answer.app}`;

    if (subapp !== "") file = file + "/" + subapp;
    answer.response = `opening folder ${file} .....`;
    answer.file = file;
    if (filetype !== "") answer.file = answer.file + "/" + filetype;
    answer.file = answer.file.replaceAll("//", "/");
    return answer;
  }
  if (answer.app === "appserver" || app === "appsvr") {
    file = `/tis/data/appsvr`;
    answer.response = `opening folder ${file} .....`;
    answer.file = file.replaceAll("//", "/");

    // if (filetype !== "") answer.file = answer.file + "/" + filetype;

    return answer;
  }

  if (action === "create" && file === "") {
    answer.error = "Be more specific on what to create. File or Folder?";
    answer.suggest = [
      "Try asking for Create file /your/folder/location/newfilename OR Create folder /your/folder/location/newfoldername",
      "Try asking for Create file <newfilename> in /your/folder/location OR Create folder <newfoldername> in /your/folder/location",
    ];
    return answer;
  }
  if (["open", "openfile", "openfolder"]?.indexOf(action) > -1) {
    if (file?.indexOf("/") < 0) {
      console.log(answer?.app, answer?.app?.split("/")?.length);
      if (answer?.app && answer?.app?.split("/")?.length >= 0) {
        answer.file =
          answer?.filetype === ""
            ? answer?.app + "/" + answer.file
            : answer?.app + "/" + answer.file + "/" + answer?.filetype;
      } else {
        answer.error =
          "You must mention full path of the file or folder which you want to open.";
        answer.suggest = [
          "Try asking for Open file /your/file/location OR Open folder /your/folder/location",
        ];
      }
      answer.file = answer.file.replaceAll("//", "/");
      return answer;
    }
    if (file === "") {
      answer.error = "File or folder is missing to take action on";
      return answer;
    }
  }

  console.log(answer.file);
  answer.response = "Performing action on your query. Please wait .....";

  //   answer.suggest = "Try to be more specific on what you want me to do for you.";
  return answer;
}

/**
 *
 * @param query
 */
export function parseRtbQuestion(query) {
  const wspaces = [
    { name: ["prod", "production"], wspace: "4-prod" },
    { name: ["ut", "ut2"], wspace: "3-ut" },
    { name: ["sp1"], wspace: "2-sp1" },
    { name: ["sp2"], wspace: "2-sp2" },
    { name: ["sp3"], wspace: "2-sp3" },
    { name: ["sp4"], wspace: "2-sp4" },
    { name: ["sp5"], wspace: "2-sp5" },
    { name: ["sp6"], wspace: "2-sp6" },
    { name: ["sp7"], wspace: "2-sp7" },
    { name: ["sp8"], wspace: "2-sp8" },
    { name: ["gpp"], wspace: "2-gpp" },
    { name: ["dev"], wspace: "1-dev" },
  ];

  const status = [
    { name: "wip", code: "W" },
    { name: "complete", code: "C" },
    { name: "completed", code: "C" },
    { name: "deployed", code: "D" },
  ];

  const objectExtents = [".p", "i", ".t", ".cls", ".sh", ".java", ".w", ".pf"];

  let words = query?.toLowerCase()?.split(" ");
  words = words.filter(Boolean); // Remove blank elements
  let task = null;
  const answer = {
    action: "",
    area: "",
    wspace: "4-prod",
    object: "",
    task: 0,
    taskstatus: "",
    response: null,
    suggest: null,
    version1: null,
    version2: null,
  };

  words?.forEach((word, index) => {
    try {
      task = Number(word);
      if (task > 0) {
        answer.task = task;
        answer.action = "task";
      }
    } catch (error) {}

    if (word === "code" || word === "object") answer.action = "object";
    if (word?.toLowerCase() === "version" || word?.toLowerCase() === "versions")
      answer.action = "version";

    if (word?.toLowerCase() === "hist" || word?.toLowerCase() === "history")
      answer.action = "history";

    status.forEach((stat) => {
      if (stat?.name === word?.toLowerCase()) answer.taskstatus = stat?.code;
    });

    if (word.indexOf(".") >= 0) {
      objectExtents.forEach((extent) => {
        if (word === extent) answer.object = "*" + word;
        else if (word.endsWith(extent)) answer.object = word;
      });
    }

    if (word?.indexOf("*") > -1) answer.object = word;

    wspaces.forEach((ws) => {
      if (ws.name.indexOf(word?.toLowerCase()) > -1) {
        answer.wspace = ws.wspace;
        answer.area = word?.toLowerCase();
      }
    });
  });

  if (answer.object === "" && answer.task === null) {
    answer.error = "I have found no answers for this query";
    answer.suggest = [
      "show versions of <Object-Name> in/from <Area-Name>",
      "show versions of *.p or *.w .... <*.File-Extension> in/from <Area-Name>",
      "list my WIP/Completed tasks in/from <Area-Name>",
      "Browse workspace <Area-Name>",
      "Show history of <Object>/<Task-Number>",
      "list objects from task <Task-Number>",
    ];
    return answer;
  }
  if (answer.task > 0) {
    if (answer.action === "history") answer.action = "taskhist";
    else if (answer.action === "status") answer.action = "taskstatus";
    else answer.action = "tasklist";
  }
  if (answer.object !== "") {
    if (answer.action === "version") answer.action = "objectversion";
    else if (answer.action === "history") answer.action = "objecthistory";
    else if (answer.action === "status") answer.action = "objectstatus";
    else answer.action = "objectviewer";
  }
  answer.response = "Fetching object details from Roundtable.....";
  return answer;
}
