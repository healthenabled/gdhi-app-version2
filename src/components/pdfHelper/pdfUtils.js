import { rgb } from "pdf-lib";

export const hexToRgb = (h) => {
  let r = 0,
    g = 0,
    b = 0;

  // 3 digits
  if (h.length === 4) {
    r = "0x" + h[1] + h[1];
    g = "0x" + h[2] + h[2];
    b = "0x" + h[3] + h[3];

    // 6 digits
  } else if (h.length === 7) {
    r = "0x" + h[1] + h[2];
    g = "0x" + h[3] + h[4];
    b = "0x" + h[5] + h[6];
  }

  return rgb(+r / 255, +g / 255, +b / 255);
};

/**
 * Get path data for a rounded rectangle. Allows for different radius on each corner.
 * @param  {Number} w   Width of rounded rectangle
 * @param  {Number} h   Height of rounded rectangle
 * @param  {Number} tlr Top left corner radius
 * @param  {Number} trr Top right corner radius
 * @param  {Number} brr Bottom right corner radius
 * @param  {Number} blr Bottom left corner radius
 * @return {String}     Rounded rectangle SVG path data
 */
export const roundedRectData = function (w, h, tlr, trr, brr, blr) {
  return (
    "M 0 " +
    tlr +
    " A " +
    tlr +
    " " +
    tlr +
    " 0 0 1 " +
    tlr +
    " 0" +
    " L " +
    (w - trr) +
    " 0" +
    " A " +
    trr +
    " " +
    trr +
    " 0 0 1 " +
    w +
    " " +
    trr +
    " L " +
    w +
    " " +
    (h - brr) +
    " A " +
    brr +
    " " +
    brr +
    " 0 0 1 " +
    (w - brr) +
    " " +
    h +
    " L " +
    blr +
    " " +
    h +
    " A " +
    blr +
    " " +
    blr +
    " 0 0 1 0 " +
    (h - blr) +
    " Z"
  );
};

export const breakTextIntoLines = (text, size, font, maxWidth) => {
  const lines = [];
  let textIdx = 0;
  if (text != null) {
    while (textIdx < text.length) {
      let line = "";
      while (textIdx < text.length) {
        if (text.charAt(textIdx) === "\n") {
          lines.push(line);
          textIdx += 1;
          line = "";
          continue;
        }
        const newLine = line + text.charAt(textIdx);
        if (font.widthOfTextAtSize(newLine, size) > maxWidth) break;
        line = newLine;
        textIdx += 1;
      }
      lines.push(line);
    }
  }
  return lines;
};
