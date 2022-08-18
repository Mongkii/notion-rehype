export type Task = (context: Context) => void;

export interface Options {
  notionPrefix?: string;
  enableNestedParagraph?: boolean;
  enableBlockId?: boolean;
  convertRawHtml?: (richTextObj: any) => string;
  pageReference?: { [pageId: string]: any };
  footnoteReference?: { [blockId: string]: any };
  footnoteTitle?: string;
  footnoteBackLabel?: string;
}

export interface Context {
  addTasks<T>(array: T[] | undefined, iterFunc: (item: T, index: number) => Task): void;
  addTasks(task: Task): void;
  addFootnote(footnode: any): number;
  options: Options;
}

export enum BlockType {
  paragraph = 'paragraph',
  heading = 'heading',
  callout = 'callout',
  quote = 'quote',
  bulleted_list = 'bulleted_list',
  numbered_list = 'numbered_list',
  to_do_list = 'to_do_list',
  // to_do = 'to_do', // uses to_do_list instead
  toggle = 'toggle',
  code = 'code',
  embed = 'embed',
  image = 'image',
  video = 'video',
  file = 'file',
  bookmark = 'bookmark', // will turn into normal link
  equation = 'equation',
  divider = 'divider',
  column_list = 'column_list',
  column = 'column',
  link_preview = 'link_preview', // will turn into normal link, and it'd be never 'live'
  link_to_page = 'link_to_page', // TODO: type: 'database_id' is not supported
  synced_block = 'synced_block', // TODO: only original block is implemented
  table = 'table',
  // table_row = 'table_row', // intergrated in table handler
  // TODO: These types need to be implemented
  // child_page = 'child_page',
  // child_database = 'child_database',
  // pdf = 'pdf',
  // table_of_contents = 'table_of_contents',
  // template = 'template', // May never be implemented
}
