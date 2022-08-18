import { addCaptionToHast } from './caption.js';
import { h, getNotionFileUrlAndAttr, notionPrefixFactory } from '../utils.js';

import { BlockType, Context } from '../types.js';

const handler = (context: Context, block: any) => {
  const data = block[BlockType.file];
  const { url, attr: fileAttr } = getNotionFileUrlAndAttr(context, data);

  let lastSlashIndex = 0;
  for (let i = url.length - 1; i > -1; i -= 1) {
    if (url[i] === '/') {
      lastSlashIndex = i;
      break;
    }
  }
  const fileName = url.slice(lastSlashIndex + 1) || 'Unknown File';

  const blockClass = notionPrefixFactory(context)(BlockType.file);

  const hast = h('div', { className: [blockClass] }, [
    h('a', { src: url, ...fileAttr }, [h('text', fileName)]),
  ]);
  addCaptionToHast(context, hast, data.caption);

  return hast;
};

export default handler;
