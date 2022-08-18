import { addTasksToAddDirectChildren } from './children.js';
import { h, notionPrefixFactory } from '../utils.js';

import { BlockType, Context } from '../types.js';

const handler = (context: Context, block: any) => {
  const data = block[BlockType.column];

  const blockClass = notionPrefixFactory(context)(BlockType.column);

  const hast = h('section', { className: [blockClass] }, []);
  addTasksToAddDirectChildren(context, hast, data.children);

  return hast;
};

export default handler;
