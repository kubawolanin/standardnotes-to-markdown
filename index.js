const argv = require("minimist")(process.argv.slice(2));
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const slug = require("slug");
const { pickBy } = require("./utils");
const config = require("config");

const contentType = {
  snUserPreferences: "SN|UserPreferences",
  snPrivileges: "SN|Privileges",
  snComponent: "SN|Component",
  note: "Note",
  tag: "Tag",
};

const backupText = fs.readFileSync(path.resolve(argv._[0]));
const backupJson = JSON.parse(backupText);

if (backupJson && backupJson.items) {
  console.log(`Found ${backupJson.items.length} items to process.`);

  const tags = backupJson.items.filter(
    (item) => item.content_type === contentType.tag
  );

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

  const markdownNotes = notes.map(
    ({ content: { title, text, tags }, created_at, updated_at }) => {
      const meta = {
        title,
        created_at,
        updated_at,
        tags,
      };
      return {
        fileName: slug(title),
        fileText: matter.stringify(text, pickBy(meta)),
      };
    }
  );

  markdownNotes.forEach((note) => {
    fs.writeFileSync(
      path.join(config.outputDir, `${note.fileName}.${config.outputExt}`),
      note.fileText
    );
  });
}
