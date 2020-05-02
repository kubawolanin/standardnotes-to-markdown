import * as minimist from "minimist";
import { config, Config } from "node-config-ts";
import * as fs from "fs";
import * as path from "path";
import * as matter from "gray-matter";
import * as slug from "slug";
import { pickBy } from "./utils";
import { Item } from "./types";

const argv = minimist(process.argv.slice(2));

const contentType = {
  snUserPreferences: "SN|UserPreferences",
  snPrivileges: "SN|Privileges",
  snComponent: "SN|Component",
  note: "Note",
  tag: "Tag",
};

const converter = (inputFile: string, config: Config) => {
  config = {
    outputExt: "md",
    ...config,
  };

  if (!inputFile) {
    return console.error("Input file is missing!");
  }

  const backupText = fs.readFileSync(path.resolve(inputFile));
  const backupJson = JSON.parse(backupText.toString());

  if (backupJson && backupJson.items) {
    console.log(`Found ${backupJson.items.length} items to process.`);

    const tags = backupJson.items.filter((item: Item) => {
      if (config.includeNotesWithTags.length) {
        return (
          item.content_type === contentType.tag &&
          config.includeNotesWithTags.includes(item.content.title)
        );
      }

      return item.content_type === contentType.tag;
    });

    const notes = backupJson.items.filter(
      (item: Item) => item.content_type === contentType.note
    );

    console.log(`Found ${notes.length} notes.`);

    tags.forEach((tag: Item) => {
      const referencedNotes = tag.content.references.filter(
        (ref) => ref.content_type === contentType.note
      );

      referencedNotes.forEach(({ uuid }) => {
        const foundNote = notes.find((note: Item) => note.uuid === uuid);

        if (!foundNote.content.tags) {
          foundNote.content.tags = [];
        }

        foundNote.content.tags.push(tag.content.title);
      });
    });

    const markdownNotes = notes
      .filter((note: Item) => {
        if (config.includeNotesWithTags.length) {
          return note.content.tags;
        }

        return note;
      })
      .map(
        ({ content: { title, text, tags }, created_at, updated_at }: Item) => {
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
        }
      )
      .filter(Boolean);

    markdownNotes.forEach((note: Item) => {
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

export { converter };
