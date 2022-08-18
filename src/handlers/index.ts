import type { Element, Text } from 'hast';

import handleParagraph from './paragraph.js';
import handleHeading from './heading.js';
import handleCallout from './callout.js';
import handleQuote from './quote.js';
import handleNormalList from './normal-list.js';
import handleTodoList from './to-do-list.js';
import handleToggle from './toggle.js';
import handleCode from './code.js';
import handleEmbed from './embed.js';
import handleImage from './image.js';
import handleVideo from './video.js';
import handleFile from './file.js';
import handleBookmark from './bookmark.js';
import handleEquation from './equation.js';
import handleDivider from './divider.js';
import handleColumnList from './column-list.js';
import handleColumn from './column.js';
import handleLinkPreview from './link-preview.js';
import handleLinkToPage from './link-to-page.js';
import handleSyncedBlock from './synced-block.js';
import handleTable from './table.js';

import { BlockType, Context } from '../types.js';
import { addBlockIdToHast } from '../utils.js';

import handleFootnotes from './footnotes.js';
import { addTasksToAddDirectChildren } from './children.js';
export { handleFootnotes, addTasksToAddDirectChildren as addTasksToAddHastChildren };

const isHeadingBlock = (block: any) => block.type.startsWith('heading_');

const handlerByBlockType = {
  [BlockType.paragraph]: handleParagraph,
  [BlockType.heading]: handleHeading,
  [BlockType.callout]: handleCallout,
  [BlockType.quote]: handleQuote,
  [BlockType.bulleted_list]: handleNormalList,
  [BlockType.numbered_list]: handleNormalList,
  [BlockType.to_do_list]: handleTodoList,
  [BlockType.toggle]: handleToggle,
  [BlockType.code]: handleCode,
  [BlockType.embed]: handleEmbed,
  [BlockType.image]: handleImage,
  [BlockType.video]: handleVideo,
  [BlockType.file]: handleFile,
  [BlockType.bookmark]: handleBookmark,
  [BlockType.equation]: handleEquation,
  [BlockType.divider]: handleDivider,
  [BlockType.column_list]: handleColumnList,
  [BlockType.column]: handleColumn,
  [BlockType.link_preview]: handleLinkPreview,
  [BlockType.link_to_page]: handleLinkToPage,
  [BlockType.synced_block]: handleSyncedBlock,
  [BlockType.table]: handleTable,
};

export const getBlockHast = (context: Context, block: any): Element | Text | null => {
  const blockType: BlockType = isHeadingBlock(block) ? BlockType.heading : block.type;
  const handler = handlerByBlockType[blockType];

  if (!handler) {
    return null;
  }

  const hast = handler(context, block);
  addBlockIdToHast(context, block, hast);

  return hast;
};
