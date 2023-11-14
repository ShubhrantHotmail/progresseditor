export const ENDPOINT = {
  rtbTaskApi: (mode, userid, wspace, wip, completed, deployed) =>
    `http://tisdev/tiscode/cgi/tiscode.sh/onetis/rtb/request/taskobject?mode=${mode}&tisid=${userid}&wspace=${wspace}&wip=${wip}&completed=${completed}&deployed=${deployed}`,
  rtbWspaceApi: () =>
    `http://tisdev/tiscode/cgi/tiscode.sh/onetis/rtb/request/wspacelist`,
  handleFileApi: (mode, file) =>
    `http://tisdev/tiscode/cgi/tiscode.sh/onetis/logviewer/server/handlefiles?readFile=${file}&mode=${mode}&loadFull=true`,
  readDirectoryApi: (path) =>
    `http://tisdev/tiscode/cgi/tiscode.sh/onetis/logviewer/server/listdir?path=${path}&type=all&today=false&showzerobyte=true`,
  fileHandlerApi: () =>
    `http://tisdev/tiscode/cgi/tiscode.sh/onetis/editor/api/filehandler`,
};
