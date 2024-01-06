export const ENDPOINT = {
  rtbTaskApi: (mode, userid, wspace, wip, completed, deployed) =>
    `http://tisdev/tiscode/cgi/tiscode.sh/onetis/rtb/request/taskobject?mode=${mode}&tisid=${userid}&wspace=${wspace}&wip=${wip}&completed=${completed}&deployed=${deployed}`,
  rtbWspaceApi: () =>
    `http://tisdev/tiscode/cgi/tiscode.sh/onetis/rtb/request/wspacelist`,
  handleFileApi: (mode, file, lines, pos) =>
    `http://tisdev/tiscode/cgi/tiscode.sh/onetis/logviewer/server/handlefiles?readFile=${file}&mode=${mode}&linesRead=${lines}&readPosition=${pos}`,
  fetchRtbObject: (object, version) =>
    `http://tisdev/tiscode/cgi/tiscode.sh/onetis/logviewer/server/handlefiles?mode=readrtb&object=${object}&version=${version}`,
  readDirectoryApi: (path, today) =>
    `http://tisdev/tiscode/cgi/tiscode.sh/onetis/logviewer/server/listdir?path=${path}&type=all&today=${today}&showzerobyte=true`,
  fileHandlerApi: () =>
    `http://tisdev/tiscode/cgi/tiscode.sh/onetis/editor/api/filehandler`,
  searchRtb: (searchText, wspaceId, matched, hideComment) =>
    `http://tisdev/tiscode/cgi/tiscode.sh/onetis/rtb/request/searchrtb?search=${searchText}&wspace=${wspaceId}&mode=all&exactMatch=${matched}&hideComment=${hideComment}`,
  codeTextGetter: (object, version) =>
    `http://tisdev/tiscode/cgi/tiscode.sh/onetis/rtb/request/getcode?object=${object}&version=${version}`,
  fileOperationApi: (object) =>
    `http://tisdev/tiscode/cgi/tiscode.sh/onetis/editor/api/fileoperation`,
  getFileContentApi: () =>
    "http://tisdev/tiscode/cgi/tiscode.sh/onetis/connect/api/getmail",
};
