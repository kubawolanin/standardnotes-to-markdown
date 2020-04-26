const fs = require("fs");
const path = require("path");
const rimraf = require("rimraf");
const mkdirp = require("mkdirp");
const test = require("tape");
const { converter } = require("../index");
// const defaultConfig = require("../config/default.json");

test("should convert test data to files", async (t) => {
  const OUTPUT_PATH = "./test/notes1";
  const config = {
    outputDir: OUTPUT_PATH,
    slugTitle: true,
    outputExt: "mdx",
    includeNotesWithTags: [],
    excludeNotesWithTags: [],
  };

  await mkdirp(OUTPUT_PATH);

  converter("./test/test data.txt", config);

  t.ok(fs.existsSync(OUTPUT_PATH), "notes folder exists");

  const outputFiles = fs.readdirSync(OUTPUT_PATH);
  t.equal(outputFiles.length, 22, "there are 22 notes");

  outputFiles.forEach((file) =>
    t.equal(path.extname(file), ".mdx", `${file} has the right extension`)
  );

  await rimraf(OUTPUT_PATH, (err) => {
    if (err) {
      console.error(err);
    }
  });
});

test("should include notes only with specific tags", async (t) => {
  const OUTPUT_PATH = "./test/notes2";
  const config = {
    outputDir: OUTPUT_PATH,
    slugTitle: true,
    outputExt: "md",
    includeNotesWithTags: ["banana"],
    excludeNotesWithTags: [],
  };

  await mkdirp(OUTPUT_PATH);

  converter("./test/test data.txt", config);

  const outputFiles = fs.readdirSync(OUTPUT_PATH);
  t.equal(outputFiles.length, 2, "there are 2 notes containing a 'banana' tag");

  outputFiles.forEach((file) =>
    t.equal(path.extname(file), ".md", `${file} has the right extension`)
  );

  await rimraf(OUTPUT_PATH, (err) => {
    if (err) {
      console.error(err);
    }
  });

  t.end();
});

test("should exclude notes with a tag", async (t) => {
  const OUTPUT_PATH = "./test/notes3";
  const config = {
    outputDir: OUTPUT_PATH,
    includeNotesWithTags: [],
    excludeNotesWithTags: ["apple"],
  };

  await mkdirp(OUTPUT_PATH);

  converter("./test/test data.txt", config);

  const outputFiles = fs.readdirSync(OUTPUT_PATH);
  t.equal(
    outputFiles.length,
    6,
    "there are 6 notes not containing a 'apple' tag"
  );

  await rimraf(OUTPUT_PATH, (err) => {
    if (err) {
      console.error(err);
    }
  });

  t.end();
});
