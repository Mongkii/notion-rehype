import { addTasksToAddRichTexts } from './rich-text.js';
import { h, getColorClassName } from '../utils.js';

import { Context } from '../types.js';

const handler = (context: Context, block: any) => {
  const data = block[block.type];

  const headingLevel = block.type.replace('heading_', '');

  const colorClassName = getColorClassName(data.color);
  const className = colorClassName ? [colorClassName] : undefined;

  const hast = h(`h${headingLevel}`, { className }, []);

  addTasksToAddRichTexts({ context, block, hast, richTexts: data.rich_text });

  return hast;
};

export default handler;
