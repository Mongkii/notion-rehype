import { h } from '../utils.js';

import { Context } from '../types.js';

const handler = (context: Context, block: any) => {
  const hast = h('hr', []);

  return hast;
};

export default handler;
