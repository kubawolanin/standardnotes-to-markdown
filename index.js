const argv = require("minimist")(process.argv.slice(2));
const config = require("config");
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const slug = require("slug");
const { pickBy } = require("./utils");

const contentType = {
  snUserPreferences: "SN|UserPreferences",
  snPrivileges: "SN|Privileges",
  snComponent: "SN|Component",
  note: "Note",
  tag: "Tag",
};

const converter = (inputFile, config) => {
  config = {
    outputExt: "md",
    ...config,
  };

  if (!inputFile) {
    return console.error("Input file is missing!");
  }

  const backupText = fs.readFileSync(path.resolve(inputFile));
  const backupJson = JSON.parse(backupText);

  if (backupJson && backupJson.items) {
    console.log(`Found ${backupJson.items.length} items to process.`);

    const tags = backupJson.items.filter((item) => {
      if (config.includeNotesWithTags.length) {
        return (
          item.content_type === contentType.tag &&
          config.includeNotesWithTags.includes(item.content.title)
        );
      }

      return item.content_type === contentType.tag;
    });

    const notes = backupJson.items.filter(
      (item) => item.content_type === contentType.note
    );

    console.log(`Found ${notes.length} notes.`);

    tags.forEach((tag) => {
      const referencedNotes = tag.content.references.filter(
        (ref) => ref.content_type === contentType.note
      );

      referencedNotes.forEach(({ uuid }) => {
        const foundNote = notes.find((note) => note.uuid === uuid);

        if (!foundNote.content.tags) {
          foundNote.content.tags = [];
        }

        foundNote.content.tags.push(tag.content.title);
      });
    });

    const markdownNotes = notes
      .filter((note) => {
        if (config.includeNotesWithTags.length) {
          return note.content.tags;
        }

        return note;
      })
      .map(({ content: { title, text, tags }, created_at, updated_at }) => {
        const meta = {
          title,
          created_at,
          updated_at,
          tags,
        };

        const hasExcludedTag = Boolean(
          config.excludeNotesWithTags.length &&
            tags &&
            tags.filter((tag) => config.excludeNotesWithTags.includes(tag))
              .length
        );

        if (hasExcludedTag) {
          return null;
        }

        return {
          fileName: slug(title),
          fileText: matter.stringify(text, pickBy(meta)),
        };
      })
      .filter(Boolean);

    markdownNotes.forEach((note) => {
      fs.writeFileSync(
        path.join(config.outputDir, `${note.fileName}.${config.outputExt}`),
        note.fileText
      );
    });
  }
};

if (require.main === module) {
  converter(argv._[0], config);
}

module.exports = {
  converter,
};
