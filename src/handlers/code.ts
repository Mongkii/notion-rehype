import { addTasksToAddRichTexts } from './rich-text.js';
import { addCaptionToHast } from './caption.js';
import { h, notionPrefixFactory } from '../utils.js';

import { BlockType, Context } from '../types.js';

const handler = (context: Context, block: any) => {
  const data = block[BlockType.code];

  const code = h('code', { className: [`language-${data.language}`] }, []);
  addTasksToAddRichTexts({ context, block, hast: code, richTexts: data.rich_text, turnLineBreakToBr: false });

  const pre = h('pre', [code]);

  if (!data.caption || data.caption.length < 1) {
    return pre;
  }

  const blockClass = notionPrefixFactory(context)(BlockType.code);

  const hast = h('section', { className: [blockClass] }, [pre]);
  addCaptionToHast(context, hast, data.caption);

  return hast;
};

export default handler;
