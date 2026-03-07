import { extname, join } from "@std/path";

export const ALLOWED_EXTENSIONS: string[] = [
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".avif",
  ".svg",
];

export type SlugFormat = "kebab" | "snake";
export type RenameTuple = [string, string];

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

  async processDirectory(dirPath: string): Promise<void> {
    const plannedRenames: RenameTuple[] = [];

    for await (const entry of Deno.readDir(dirPath)) {
      if (entry.isFile) {
        try {
          this.validateExtension(entry.name);
          const newName = this.generateSafeName(entry.name);
          if (entry.name !== newName) {
            plannedRenames.push([entry.name, newName]);
          }
        } catch (error) {
          console.warn(`Skipped ${entry.name}: ${(error as Error).message}`);
        }
      }
    }

    if (plannedRenames.length === 0) {
      console.log("\nNo files need renaming.");
      return;
    }

    console.log(`\nFound ${plannedRenames.length} file(s) to rename:`);
    for (const [oldName, newName] of plannedRenames) {
      const oldPath = join(dirPath, oldName);
      const newPath = join(dirPath, newName);
      console.log(`Renamed: ${oldName} -> ${newName}`);
      await Deno.rename(oldPath, newPath);
    }
  }
}
