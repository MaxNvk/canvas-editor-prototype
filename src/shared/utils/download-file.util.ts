export function downloadFile(dataUrl: string, fileName: string) {
  const a = document.createElement('a');

  a.setAttribute('download', fileName);
  a.setAttribute('href', dataUrl);
  a.click();
}
