const path = require('path');
const fs = require('fs');

/**
 * Gets a file path with a specified extension, keeping the same directory and filename base.
 *
 * @param {string} filePath - The original file path.
 * @param {string} extension - The desired extension (including the dot, e.g., '.pdf').
 * @returns {string} The new file path with the specified extension.
 *
 * @example
 * // Convert a .txt file to .pdf
 * const txtFilePath = './my_documents/report.txt';
 * const pdfFilePath = getFilePath(txtFilePath, '.pdf');
 * console.log(pdfFilePath); // Output: ./my_documents/report.pdf
 *
 * @example
 * // Change a .jpg to .png
 * const jpgFilePath = './images/photo.jpg';
 * const pngFilePath = getFilePath(jpgFilePath, '.png');
 * console.log(pngFilePath); // Output: ./images/photo.png
 *
 * @example
 * // Add a new extension to a file
 * const dataFilePath = './data/my_data.csv';
 * const backupFilePath = getFilePath(dataFilePath, '.bak');
 * console.log(backupFilePath); // Output: ./data/my_data.bak
 */
export function getFilePath(filePath, extension) {
  return path.join(path.dirname(filePath), path.basename(filePath, path.extname(filePath)) + extension);
}




// Define ANSI color codes
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  underscore: "\x1b[4m",
  blink: "\x1b[5m",
  reverse: "\x1b[7m",
  hidden: "\x1b[8m",

  fgBlack: "\x1b[30m",
  fgRed: "\x1b[31m",
  fgGreen: "\x1b[32m",
  fgYellow: "\x1b[33m",
  fgBlue: "\x1b[34m",
  fgMagenta: "\x1b[35m",
  fgCyan: "\x1b[36m",
  fgWhite: "\x1b[37m",

  bgBlack: "\x1b[40m",
  bgRed: "\x1b[41m",
  bgGreen: "\x1b[42m",
  bgYellow: "\x1b[43m",
  bgBlue: "\x1b[44m",
  bgMagenta: "\x1b[45m",
  bgCyan: "\x1b[46m",
  bgWhite: "\x1b[47m"
};

// Colored log function
 function coloredLog(message, color) {
  const colorCode = colors[color] || colors.fgWhite;
  console.log(`${colorCode}%s${colors.reset}`, message);
}



// Higher-order function to create specific color loggers
function createColorLogger(color) {
  return function(message) {
      coloredLog(message, color);
  };
}

// Create color-specific loggers
export const redLog = createColorLogger('fgRed');
export const greenLog = createColorLogger('fgGreen');
export const yellowLog = createColorLogger('fgYellow');
export const blueLog = createColorLogger('fgBlue');
export const magentaLog = createColorLogger('fgMagenta');
export const cyanLog = createColorLogger('fgCyan');
export const whiteLog = createColorLogger('fgWhite');


// Example usage
// coloredLog('This is a red text', 'fgRed');
// coloredLog('This is a green text', 'fgGreen');
// coloredLog('This is a yellow text', 'fgYellow');
// coloredLog('This is a blue text', 'fgBlue');
// coloredLog('This is a magenta text', 'fgMagenta');
// coloredLog('This is a cyan text', 'fgCyan');
// coloredLog('This is a white text', 'fgWhite');
