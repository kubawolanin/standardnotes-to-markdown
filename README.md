[![codecov](https://codecov.io/gh/kubawolanin/standardnotes-to-markdown/branch/master/graph/badge.svg)](https://codecov.io/gh/kubawolanin/standardnotes-to-markdown)

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
yarn start "./Standard Notes Decrypted Backup - Sun Apr 26 2020 09_38_12 GMT+0200.txt"
```

## TODO

- [x] Frontmatter support
- [x] Specify a output catalog
- [x] Slugify title
- [x] Tags support
- [ ] Configurable fields
- [x] Include only specific tags
- [x] Exclude specific tags
- [ ] Typescript
- [x] Tests
- [ ] Ensure output folder exists before trying to save to it
- [ ] Fallback values if no config param exists
- [ ] Remove falsy items from include/exclude
- [ ] CLI params for config (include,exclude etc)
- [ ] Allow converting only posts without tags
