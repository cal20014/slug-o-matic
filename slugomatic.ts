import { basename, dirname, extname, join } from "@std/path";

export const ALLOWED_EXTENSIONS: string[] = [
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".avif",
  ".svg",
];

export type SlugFormat = "kebab" | "snake";

export interface RenameTask {
  oldName: string;
  newName: string;
  oldPath: string;
  newPath: string;
}

const SYMBOL_TRANSLATION_MAP = {
  "&": "and",
  "+": "plus",
  "=": "equals",
  "<": "less than",
  ">": "greater than",
  "@": "at",
  "#": "number",
  "$": "dollar",
  "%": "percent",
} as const;

const SYMBOL_PATTERN = new RegExp(
  `[${Object.keys(SYMBOL_TRANSLATION_MAP).map((s) => `\\${s}`).join("")}]`,
  "g",
);

const ACCENTS_PATTERN = /[\u0300-\u036f]/g;

const TRIM_EDGES = {
  kebab: /^-+|-+$/g,
  snake: /^_+|_+$/g,
} as const;

export function slugify(text: string, format: SlugFormat): string {
  const separator = format === "kebab" ? "-" : "_";

  let slug = text
    .normalize("NFD")
    .replace(ACCENTS_PATTERN, "")
    .toLowerCase();

  slug = slug.replace(SYMBOL_PATTERN, (symbol) => {
    return `${separator}${
      SYMBOL_TRANSLATION_MAP[symbol as keyof typeof SYMBOL_TRANSLATION_MAP]
    }${separator}`;
  });

  slug = slug.replace(/[^a-z0-9]+/g, separator);

  return slug.replace(TRIM_EDGES[format], "");
}

export class Slugomatic {
  format: SlugFormat;

  constructor(format: SlugFormat = "kebab") {
    this.format = format;
  }

  validateExtension(filename: string): void {
    const ext = extname(filename).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      throw new Error(
        `Unsupported file type: '${ext}'. Only images are allowed.`,
      );
    }
  }

  generateSafeName(filename: string): string {
    const ext = extname(filename);
    const baseName = filename.slice(0, -ext.length);
    const safeBase = slugify(baseName, this.format);

    if (!safeBase) return filename;

    return `${safeBase}${ext.toLowerCase()}`;
  }

  async prepareSingleFile(filePath: string): Promise<RenameTask | null> {
    const fileName = basename(filePath);
    this.validateExtension(fileName);

    const safeName = this.generateSafeName(fileName);
    if (fileName === safeName) return null;

    const newPath = join(dirname(filePath), safeName);

    try {
      await Deno.stat(newPath);
      throw new Error(`Cannot rename: ${safeName} already exists.`);
    } catch (err) {
      if (!(err instanceof Deno.errors.NotFound)) throw err;
    }

    return { oldName: fileName, newName: safeName, oldPath: filePath, newPath };
  }

  async prepareDirectory(dirPath: string): Promise<RenameTask[]> {
    const tasks: RenameTask[] = [];
    const newNames = new Set<string>();

    for await (const entry of Deno.readDir(dirPath)) {
      if (entry.isFile) {
        const fileName = entry.name;

        try {
          this.validateExtension(fileName);
          const safeName = this.generateSafeName(fileName);

          if (fileName !== safeName) {
            if (newNames.has(safeName)) {
              console.warn(`Collision detected: ${safeName}`);
            } else {
              const newPath = join(dirPath, safeName);
              let fileExists = false;

              try {
                await Deno.stat(newPath);
                fileExists = true;
              } catch (err) {
                if (!(err instanceof Deno.errors.NotFound)) {
                  console.warn(
                    `Error checking path: ${(err as Error).message}`,
                  );
                }
              }

              if (fileExists) {
                console.warn(`Skipping: ${safeName} already exists.`);
              } else {
                newNames.add(safeName);
                tasks.push({
                  oldName: fileName,
                  newName: safeName,
                  oldPath: join(dirPath, fileName),
                  newPath,
                });
              }
            }
          }
        } catch (err) {
          console.warn(`Skipping ${fileName}: ${(err as Error).message}`);
        }
      }
    }

    return tasks;
  }

  async executeTasks(tasks: RenameTask[]): Promise<void> {
    for (const task of tasks) {
      await Deno.rename(task.oldPath, task.newPath);
    }
  }
}
