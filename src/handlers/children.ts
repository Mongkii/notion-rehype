import { Element, Root } from 'hast';

import { getBlockHast } from './index.js';
import { h, addClassToHast, notionPrefixFactory, groupBlocks } from '../utils.js';

import { Context } from '../types.js';

export const addTasksToAddDirectChildren = (
  context: Context,
  hast: Element | Root,
  children: any[] | undefined
) => {
  context.addTasks(groupBlocks(children), (child: any) => (ctx) => {
    const childHast = getBlockHast(ctx, child);
    childHast && hast.children.push(childHast);
  });
};

const handler = (context: Context, children: any[] | undefined): Element | null => {
  const wrapperClass = notionPrefixFactory(context)('children-wrapper');

  if (!children || children.length < 1) {
    return null;
  }

  const hast = h('div', { className: [wrapperClass] }, []);
  addTasksToAddDirectChildren(context, hast, children);

  return hast;
};

export const addTasksToAddWrappedChildren = (
  context: Context,
  hast: Element,
  children: any[] | undefined
) => {
  const childrenHast = handler(context, children);
  if (!childrenHast) {
    return;
  }
  context.addTasks(() => {
    hast.children.push(childrenHast);
  });
};

export default handler;
