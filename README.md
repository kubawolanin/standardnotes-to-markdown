# StandardNotes Backup to Markdown

This tool converts a backup file from StandardNotes to a set of Markdown files.

## My use case

I take notes and would like to quickly transform them to blog posts.
This tool makes it possible.

## Usage

1. Go to your [StandardNotes app](https://app.standardnotes.org/)
1. Click on 'Account' on the bottom left corner and download a decrypted data backup
   Note: This tool works 100% offline.
1. In console type the following command:

```bash
node index "./Standard Notes Decrypted Backup - Sun Apr 26 2020 09_38_12 GMT+0200.txt"
```

## TODO

- [x] Frontmatter support
- [ ] Specify a output catalog
- [ ] Slugify title
- [x] Tags support
- [ ] Configurable fields
- [ ] Include only specific tags
- [ ] Exclude specific tags
- [ ] Typescript
- [ ] Tests
- [ ] Ensure output folder exists before trying to save to it
