import { addTasksToAddDirectChildren } from './children.js';
import { h, notionPrefixFactory } from '../utils.js';

import { BlockType, Context } from '../types.js';

const handler = (context: Context, block: any) => {
  const notionPrefix = notionPrefixFactory(context);

  const data = block[BlockType.synced_block];
  const { synced_from } = data;

  const blockClass = notionPrefix(BlockType.synced_block);
  const syncType = synced_from ? 'reference' : 'original';
  const className = [blockClass, `${blockClass}-${syncType}`];

  const hast = h('section', { className }, []);

  if (synced_from) {
    hast.properties![`data-${notionPrefix('synced-from')}`] = synced_from.block_id;
  }

  addTasksToAddDirectChildren(context, hast, data.children);

  return hast;
};

export default handler;
