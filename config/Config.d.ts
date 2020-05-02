/* tslint:disable */
/* eslint-disable */
declare module "node-config-ts" {
  interface IConfig {
    outputDir: string;
    slugTitle: boolean;
    outputExt: string;
    includeNotesWithTags: any[];
    excludeNotesWithTags: any[];
  }
  export const config: Config;
  export type Config = IConfig;
}
