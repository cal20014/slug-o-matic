import { assertEquals, assertThrows } from "@std/assert";
import { slugify, Slugomatic } from "./slugomatic.ts";

Deno.test("slugify: converts image name to kebab case", () => {
  assertEquals(
    slugify("Battlestar Galactica Viper MKI", "kebab"),
    "battlestar-galactica-viper-mki",
  );
});

Deno.test("slugify: converts title to snake case", () => {
  assertEquals(
    slugify("The Way of Kings Map", "snake"),
    "the_way_of_kings_map",
  );
});

Deno.test("slugify: translates common symbols into English words", () => {
  assertEquals(
    slugify("Hero Section & Background + Overlay@2x", "kebab"),
    "hero-section-and-background-plus-overlay-at-2x",
  );
});

Deno.test("slugify: Handles accented characters", () => {
  assertEquals(
    slugify("Les Misérables Jean Valjean", "kebab"),
    "les-miserables-jean-valjean",
  );
});

Deno.test("slugify: Handles messy input", () => {
  assertEquals(
    slugify("dune arrakis spice fields (2024)...copy", "kebab"),
    "dune-arrakis-spice-fields-2024-copy",
  );
});

Deno.test("validateExtension: rejects unsupported file types", () => {
  const app = new Slugomatic();
  assertThrows(
    () => app.validateExtension("patrick_mcmanus_essay.docx"),
    Error,
    "Unsupported file type",
  );
});

Deno.test("validateExtension: allows supported image formats", () => {
  const app = new Slugomatic();
  const validFiles = [
    "enterprise.png",
    "millennium_falcon.svg",
    "arrakis.webp",
  ];

  for (const file of validFiles) {
    app.validateExtension(file);
  }
});
