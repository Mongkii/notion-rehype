import { addCaptionToHast } from './caption.js';
import { h, getNotionFileUrlAndAttr, notionPrefixFactory } from '../utils.js';

import { BlockType, Context } from '../types.js';

const handler = (context: Context, block: any) => {
  const data = block[BlockType.video];
  const { url, attr: fileAttr } = getNotionFileUrlAndAttr(context, data);

  const blockClass = notionPrefixFactory(context)(BlockType.video);

  const hast = h('div', { className: [blockClass] }, [h('video', { src: url, ...fileAttr }, [])]);
  addCaptionToHast(context, hast, data.caption);

  return hast;
};

export default handler;
