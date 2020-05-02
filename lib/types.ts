export type Config = {
  outputDir: string;
  slugTitle: Boolean;
  outputExt: "md" | "mdx";
  includeNotesWithTags: Array<string>;
  excludeNotesWithTags: Array<string>;
};

export enum ContentType {
  snUserPreferences = "SN|UserPreferences",
  snPrivileges = "SN|Privileges",
  snComponent = "SN|Component",
  note = "Note",
  tag = "Tag",
}

export type uuid = string;

export type Reference = {
  uuid: uuid;
  content_type: ContentType;
};

export type AppData = {
  [id: string]: {
    [key: string]: any;
  };
};

export type Item = {
  uuid: uuid;
  content_type: ContentType;
  created_at: "2020-03-29T20:24:45.767Z";
  updated_at: "2020-03-29T20:26:14.089Z";
  content: {
    references: Array<Reference>;
    appData?: AppData;
    title: string;
    text: string;
    tags: Array<string>;
  };
  fileName: string;
  fileText: string;
};
