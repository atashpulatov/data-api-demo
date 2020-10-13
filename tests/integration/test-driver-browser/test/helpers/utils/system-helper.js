const clipboardy = require('clipboardy');

export function CheckClipboardContent() {
  return clipboardy.readSync();
}
