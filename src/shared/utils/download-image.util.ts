export function downloadImage(dataUrl: string, fileName: string) {
  const a = document.createElement('a');

  a.setAttribute('download', `${fileName}.png`);
  a.setAttribute('href', dataUrl);
  a.click();
}
