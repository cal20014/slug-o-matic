import { Slugomatic, type Format } from "./slugomatic.ts";

if (import.meta.main) {
  console.log("Welcome to Slugomatic!");
  
  const formatInput = prompt("Choose format (kebab/snake):", "kebab");
  const format: Format = formatInput === "snake" ? "snake" : "kebab";
  
  const dirChoice = prompt("Enter directory path to scan (press Enter for current folder):", ".");

  if (dirChoice) {
    const app = new Slugomatic(format);
    await app.processDirectory(dirChoice);
  }
}