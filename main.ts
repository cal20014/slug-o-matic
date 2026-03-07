import { basename, dirname, join } from "@std/path";
import { type SlugFormat, slugify, Slugomatic } from "./slugomatic.ts";

if (import.meta.main) {
  console.log(`slug-o-matic
What would you like to do?

  1. Format text
  2. Rename single file
  3. Rename files in directory
`);

  const mode = prompt("Choose an option (1-3):");

  if (!["1", "2", "3"].includes(mode || "")) {
    console.log("Invalid option. Exiting.");
    Deno.exit(1);
  }

  console.log(`\nChoose a format:
  1. kebab-case  (my-file-name)
  2. snake_case  (my_file_name)
`);

  const format: SlugFormat = prompt("Choose a format (1-2):") === "2"
    ? "snake"
    : "kebab";
  const app = new Slugomatic(format);

  switch (mode) {
    case "1": {
      console.log("\nPaste or type your text, then press Enter:");
      while (true) {
        const text = prompt(">");
        if (!text) break;

        console.log(
          `\n [Original ]: \t${text}\n [Slugified]:\t${slugify(text, format)}`,
        );
        console.log("\nAnother? (paste text or press Enter to quit):");
      }
      break;
    }

    case "2": {
      const filePath = prompt("\nEnter the full path to the file:");
      if (!filePath) break;

      try {
        const fileName = basename(filePath);
        app.validateExtension(fileName);

        const safeName = app.generateSafeName(fileName);

        if (fileName === safeName) {
          console.log("\nFile name is already safe.");
          break;
        }

        console.log(`\nPreview:\n  Old: ${fileName}\n  New: ${safeName}`);

        if (prompt("\nRename this file? (y/n):")?.toLowerCase() === "y") {
          await Deno.rename(filePath, join(dirname(filePath), safeName));
          console.log("\nRenamed successfully.");
        } else {
          console.log("\nOperation cancelled.");
        }
      } catch (error) {
        console.error(`\nWarning: ${(error as Error).message}`);
      }
      break;
    }

    case "3": {
      const dirChoice = prompt(
        "\nEnter directory path to scan (press Enter for current folder):",
        ".",
      );
      if (dirChoice) await app.processDirectory(dirChoice);
      break;
    }
  }
}
