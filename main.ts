import { type SlugFormat, slugify, Slugomatic } from "./slugomatic.ts";

if (import.meta.main) {
  console.log(`slug-o-matic

What would you like to do?

  1. Format text
  2. Rename single file
  3. Rename files in directory
  (Press Enter or 'q' to exit)
`);

  const mode = prompt("Choose an option (1-3):")?.toLowerCase().trim();

  if (!mode || mode === "q") {
    exit();
  } else if (!["1", "2", "3"].includes(mode)) {
    console.log("Invalid option.");
    exit();
  } else {
    const format = promptFormat();
    console.log(`\nUsing format: ${format}-case\n`);

    const app = new Slugomatic(format);

    switch (mode) {
      case "1":
        textMode(format);
        break;
      case "2":
        await renameSingleFile(app);
        break;
      case "3":
        await renameFilesInDirectory(app);
        break;
    }
  }
}

function exit() {
  console.log("\nExiting.");
  Deno.exit(0);
}

function promptFormat(): SlugFormat {
  console.log(`
Choose a format:
  1. kebab-case  (my-file-name)
  2. snake_case  (my_file_name)
  (Press Enter or 'q' to exit)
`);

  let formatChoice: "1" | "2" | null = null;

  while (!formatChoice) {
    const input = prompt("Choose a format (1-2):")?.toLowerCase().trim();

    if (!input || input === "q") {
      exit();
    } else if (input === "1" || input === "2") {
      formatChoice = input;
    } else {
      console.log("Invalid entry. Choose 1 or 2.");
    }
  }

  return formatChoice === "1" ? "kebab" : "snake";
}

function promptConfirm(message: string): boolean {
  let confirmed: boolean | null = null;

  while (confirmed === null) {
    const input = prompt(message)?.toLowerCase().trim();

    if (input === "y" || input === "yes") {
      confirmed = true;
    } else if (input === "n" || input === "no") {
      confirmed = false;
    } else {
      console.log(
        "Invalid entry. Please enter 'y' or 'yes' to confirm, or 'n' or 'no' to cancel.",
      );
    }
  }

  return confirmed;
}

function textMode(format: SlugFormat) {
  console.log("\nPaste or type text. Press Enter to quit.");

  let text = prompt(">");
  while (text) {
    console.log(
      `\nOriginal : ${text}\nSlugified: ${slugify(text, format)}\n`,
    );
    text = prompt(">");
  }
}

async function renameSingleFile(app: Slugomatic) {
  const filePath = prompt("\nEnter the full path to the file:");

  if (filePath) {
    try {
      const task = await app.prepareSingleFile(filePath);

      if (!task) {
        console.log("\nFile name is already safe.");
      } else {
        console.log(`\nPreview:\n${task.oldName}\n  -> ${task.newName}`);

        if (promptConfirm("\nRename this file? (y/n):")) {
          await app.executeTasks([task]);
          console.log("\nRenamed successfully.");
        } else {
          console.log("\nOperation cancelled.");
        }
      }
    } catch (error) {
      console.error(`\nWarning: ${(error as Error).message}`);
    }
  }
}

async function renameFilesInDirectory(app: Slugomatic) {
  const dirChoice = prompt(
    "\nEnter directory path to scan (press Enter for current folder):",
    ".",
  );

  if (dirChoice) {
    console.log(`\nScanning directory: ${dirChoice}\n`);

    try {
      const tasks = await app.prepareDirectory(dirChoice);

      if (tasks.length === 0) {
        console.log("All files are already safe or skipped.");
      } else {
        console.log(`Preview (${tasks.length} files):\n`);

        for (const task of tasks) {
          console.log(`${task.oldName}\n  -> ${task.newName}\n`);
        }

        if (promptConfirm(`\nRename these ${tasks.length} files? (y/n):`)) {
          console.log(`\nRenaming ${tasks.length} files...\n`);
          await app.executeTasks(tasks);
          console.log("Directory rename complete.");
        } else {
          console.log("\nOperation cancelled.");
        }
      }
    } catch (error) {
      console.error(`Error: ${(error as Error).message}`);
    }
  }
}
