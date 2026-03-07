# Slug-o-matic

A command-line utility built with Deno to safely format text and rename files or directories into URL-friendly slugs (kebab-case or snake_case). It includes built-in safety checks to prevent file overwrites and naming collisions.

## Instructions for Build and Use

[Software Demo](Put_Your_Video_Link_Here)

Steps to build and run:

1. Install `mise`.
2. Clone this repository.
3. Run `mise install` in the project directory to install Deno using mise. The Deno version is in the `mise.toml` file.

To run tests:

- Run `deno test` in the project directory.

For linting:

- Run `deno lint` in the project directory.

To format:

- Run `deno fmt` in the project directory.

To run `main.ts`:

- Run `deno run --allow-read --allow-write main.ts` in the project directory.

To create an executable of this program run:

- `deno compile --allow-read --allow-write --output slug-o-matic main.ts`

Instructions for use:

1. Run the script or executable.
2. Select a mode: format text, rename single file, or rename directory files.
3. Select a format: kebab-case or snake_case.
4. Follow the prompts.

## Development Environment

- `mise`
- Deno
- TypeScript
- Deno Standard Library (`@std/path`, `@std/assert`)
- VS Code

## Useful Websites to Learn More

- [Deno Website](https://deno.com/)
- [Deno Runtime Docs](https://docs.deno.com/runtime/)
- [Deno TypeScript Fundamentals](https://docs.deno.com/runtime/fundamentals/typescript/)
- [Deno Examples Reference](https://docs.deno.com/examples/)
- [Testing in Deno](https://docs.deno.com/examples/writing_tests/)
- [Testing Tutorial](https://docs.deno.com/examples/testing_tutorial/)
- [Deno Formatter (deno fmt)](https://docs.deno.com/examples/deno_fmt/)
- [Deno Hashbang Tutorial](https://docs.deno.com/examples/hashbang_tutorial/)
- [Deno Bites: TS Intro](https://deno.com/blog/deno-bites-ts-intro)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [TS from Scratch](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)
- [TS in 5 Minutes](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
- [TS in 5 Minutes: Functions](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-func.html)
- [TS in 5 Minutes: OOP](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-oop.html)
- [TS Tooling in 5 Minutes](https://www.typescriptlang.org/docs/handbook/typescript-tooling-in-5-minutes.html)
- [mise Deno Setup](https://mise.jdx.dev/lang/deno.html#deno)
- [Learn TypeScript (Interactive)](https://www.learn-ts.org/)
- [Codecademy: Learn TypeScript](https://www.codecademy.com/enrolled/courses/learn-typescript)
- [FreeCodeCamp: The Deno Handbook](https://www.freecodecamp.org/news/the-deno-handbook/)
- [FreeCodeCamp: Intro to Deno](https://www.freecodecamp.org/news/intro-to-deno/)
- [FreeCodeCamp: TS Beginners Guide](https://www.freecodecamp.org/news/typescript-for-beginners-guide/)
- [FreeCodeCamp: Learn TS in 1 Hour](https://www.freecodecamp.org/news/learn-typescript-in-1-hour/)
- [FreeCodeCamp: TS with React Handbook](https://www.freecodecamp.org/news/learn-typescript-with-react-handbook/)
- [Daily.dev: Deno Basics](https://daily.dev/blog/deno-basics-for-beginners)
- [Practical Guide to Deno TS Runtime](https://paiml.com/blog/2025-05-05-deno-typescript-runtime-practical-guide/)

## Future Work

- [ ] Add support for non-image file extensions
- [ ] Add PascalCase and camelCase support
- [ ] Add an undo feature for batch renames
- [ ] Add Dry run functionality and option to the menu and CLI
