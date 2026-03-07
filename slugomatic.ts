import { extname, join } from "@std/path";

export const ALLOWED_FILE_EXTENSIONS: string[] = [".png", ".jpg", ".jpeg", ".webp", ".avif", ".svg"]

export type Format = "kebab" | "snake";

export type RenameTuple = [string, string];

export function slugify(text: string, format: Format): string {
    const separator = format === "kebab" ? "-" : "_";
    return text
        .toLowerCase() // Lower case text
        .replace(/[^a-z0-9]+/g, separator) // 
        .replace(new RegExp(`^\\${separator}+|\\${separator}+$`, "g"), ""); // 
}


export class Slugomatic {
    format : Format;

    constructor(format: Format = "kebab") {
        this.format = format;
    }

    validateExtension(filename: string): void {
    const ext = extname(filename).toLowerCase();
    if (!ALLOWED_FILE_EXTENSIONS.includes(ext)) {
      throw new Error(`Unsupported file type: '${ext}'. Only images are allowed.`);
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