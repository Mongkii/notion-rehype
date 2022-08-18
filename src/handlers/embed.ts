import { h, notionPrefixFactory } from '../utils.js';

import { BlockType, Context } from '../types.js';

const handler = (context: Context, block: any) => {
  const data = block[BlockType.embed];

  const blockClass = notionPrefixFactory(context)(BlockType.embed);

  const hast = h('iframe', { src: data.url, className: [blockClass] }, []);

  return hast;
};

export default handler;
