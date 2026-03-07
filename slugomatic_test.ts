import { assertEquals, assertThrows } from "@std/assert";
import { slugify, Slugomatic } from "./slugomatic.ts";

Deno.test("slugify converts spaces and symbols to kebab-case", () => {
  assertEquals(slugify("Hello World!", "kebab"), "hello-world");
});

Deno.test("slugify converts spaces and symbols to snake_case", () => {
  assertEquals(slugify("My Image (1)", "snake"), "my_image_1");
});

Deno.test("Slugomatic validateExtension throws on invalid file", () => {
  const app = new Slugomatic();
  assertThrows(
    () => app.validateExtension("document.pdf"),
    Error,
    "Unsupported file type",
  );
});

Deno.test("Slugomatic validateExtension allows valid images", () => {
  const app = new Slugomatic();
  app.validateExtension("photo.png");
  app.validateExtension("graphic.svg");
});
