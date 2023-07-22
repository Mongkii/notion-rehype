import type { Plugin } from 'unified';
import type { VFile } from 'vfile';

import { notionToHast } from './notion-to-hast.js';
import { Options } from './types.js';

const notionRehype: Plugin<[Options]> = function (options) {
  this.Parser = (strFile: string, vFile: VFile) => {
    const blocks: any = vFile.data || JSON.parse(strFile);
    return notionToHast(blocks, options || {});
  };
};

export default notionRehype;
