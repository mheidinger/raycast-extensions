import { Clipboard, getPreferenceValues, showToast, Toast, open } from "@raycast/api";

const preferenceValues = getPreferenceValues<ExtensionPreferences>();
const defaultJira = "https://jira.atlassian.com";

const issueKeyRegex = /^\w{2,}-\d+$/gm;
function isValidIssueKey(input: string): boolean {
  return issueKeyRegex.test(input);
}

async function openIssueFromClipboard() {
  const clipboardText = (await Clipboard.readText())?.trim();
  if (!clipboardText || clipboardText.length == 0) {
    await showToast(Toast.Style.Failure, "Clipboard empty");
    return;
  }

  if (!isValidIssueKey(clipboardText)) {
    await showToast(Toast.Style.Failure, "Clipboard Content is not a valid Jira Issue Key");
    return;
  }

  let baseURL = defaultJira;
  if (preferenceValues.baseUrl && preferenceValues.baseUrl.length > 0) {
    baseURL = preferenceValues.baseUrl.replace(/\/$/, "");
  }

  await open(baseURL + "/browse/" + clipboardText);
}

export default openIssueFromClipboard;
