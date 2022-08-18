import { addTasksToAddRichTexts } from './rich-text.js';
import { addTasksToAddDirectChildren } from './children.js';
import { h, getColorClassName, notionPrefixFactory } from '../utils.js';

import { BlockType, Context } from '../types.js';

const handler = (context: Context, block: any) => {
  const data = block[BlockType.toggle];

  const toggleSummary = h('summary', {}, []);

  const blockClass = notionPrefixFactory(context)(BlockType.toggle);
  const className: string[] = [blockClass];

  const colorClassName = getColorClassName(data.color);
  colorClassName && className.push(colorClassName);

  const hast = h('details', { className }, [toggleSummary]);

  addTasksToAddDirectChildren(context, hast, data.children);
  addTasksToAddRichTexts({ context, block, hast: toggleSummary, richTexts: data.rich_text });

  return hast;
};

export default handler;
