import { addTasksToAddRichTexts } from './rich-text.js';
import { addTasksToAddDirectChildren } from './children.js';
import { h, getColorClassName, addBlockIdToHast, hasChildren } from '../utils.js';

import { Context } from '../types.js';

const getListItemHast = (context: Context, block: any) => {
  const data = block[block.type];

  const colorClassName = getColorClassName(data.color);
  const className = colorClassName ? [colorClassName] : undefined;

  const hast = h('li', { className }, []);

  addTasksToAddDirectChildren(context, hast, data.children);
  addTasksToAddRichTexts({
    context,
    block,
    hast,
    richTexts: data.rich_text,
    wrapRichTexts: hasChildren(data),
  });

  addBlockIdToHast(context, block, hast);

  return hast;
};

const handler = (context: Context, block: any) => {
  const blockType = block.type;

  const tagName = blockType === 'bulleted_list' ? 'ul' : 'ol';
  const hast = h(tagName, []);

  const listItems = block[blockType];
  listItems.forEach((listItem: any) => {
    hast.children.push(getListItemHast(context, listItem));
  });

  return hast;
};

export default handler;
