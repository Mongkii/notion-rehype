import { addTasksToAddRichTexts } from './rich-text.js';
import { addTasksToAddDirectChildren } from './children.js';
import {
  h,
  getColorClassName,
  notionPrefixFactory,
  addBlockIdToHast,
  hasChildren,
} from '../utils.js';

import { BlockType, Context } from '../types.js';

const getListItemHast = (context: Context, block: any) => {
  const data = block[block.type];

  const todoCheckbox = h('input', { type: 'checkbox', checked: data.checked, disabled: true }, []);

  const colorClassName = getColorClassName(data.color);
  const className = colorClassName ? [colorClassName] : undefined;

  const hast = h('li', { className }, [todoCheckbox]);

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
  const blockClass = notionPrefixFactory(context)(BlockType.to_do_list);

  const hast = h('ul', { className: [blockClass] }, []);

  const listItems = block[block.type];
  listItems.forEach((listItem: any) => {
    hast.children.push(getListItemHast(context, listItem));
  });

  return hast;
};

export default handler;
