import type { Root, RootContent, Element, ElementContent, Text } from 'hast';

import { Context } from './types';

export function h(
  tagName: string,
  properties: Record<string, any>,
  children: ElementContent[]
): Element;
export function h(tagName: string, children: ElementContent[]): Element;
export function h(root: null, children: RootContent[]): Root;
export function h(text: 'text', value: string): Text;
export function h(raw: 'raw', value: string): Text;
export function h(...args: any[]): Root | Element | Text {
  if (args[0] === null) {
    return { type: 'root', children: args[1] };
  }
  if (['text', 'raw'].includes(args[0]) && typeof args[1] === 'string') {
    return { type: args[0], value: args[1] };
  }
  return Array.isArray(args[1])
    ? { type: 'element', tagName: args[0], children: args[1] }
    : { type: 'element', tagName: args[0], properties: args[1], children: args[2] };
}

export const notionPrefixFactory = (context: Context) => {
  const prefix = context.options.notionPrefix || 'notion-';
  return (str: string) => prefix + str;
};

export const getNotionFileUrlAndAttr = (
  context: Context,
  data: { type: string; [type: string]: string }
) => {
  const notionPrefix = notionPrefixFactory(context);
  const attrName = `data-${notionPrefix('file-type')}`;

  const fileType = data.type;

  return { url: data[fileType], attr: { [attrName]: fileType } };
};

export const hasChildren = (data: any) => (data.children?.length || 0) > 0;

export const addBlockIdToHast = (context: Context, block: any, hast: Element | Text) => {
  if (hast.type !== 'element' || !context.options.enableBlockId || !block.id) {
    return;
  }

  const notionPrefix = notionPrefixFactory(context);
  const attrName = `data-${notionPrefix('block-id')}`;

  hast.properties = objAssign(hast.properties, { [attrName]: block.id });
};

export const getColorClassName = (color: string) => {
  if (!color || color === 'default') {
    return '';
  }
  return `color-${color}`;
};

export const objAssign = <T extends {}, U>(props: T | undefined, newProps: U): T & U => {
  return Object.assign((props || {}) as T, newProps);
};

export const addClassToHast = (hast: Element, classItem: string) => {
  if (hast.properties?.className) {
    (hast.properties.className as string[]).push(classItem);
    return;
  }
  hast.properties = objAssign(hast.properties, { className: [classItem] });
};

const listItemTypes = new Set(['bulleted_list_item', 'numbered_list_item', 'to_do']);

export const groupBlocks = (blocks: any[] | undefined) => {
  const result: any[] = [];

  if (!blocks) {
    return result;
  }

  let curListItemType = '';
  let curListItems: any[] = [];

  const putListItemsToResult = () => {
    const curListType =
      curListItemType === 'to_do' ? 'to_do_list' : curListItemType.replace('_item', '');
    result.push({ type: curListType, [curListType]: curListItems });
  };

  const blocksCount = blocks.length;
  for (let i = 0; i < blocksCount; i += 1) {
    const block = blocks[i];

    if (!listItemTypes.has(block.type)) {
      if (curListItemType) {
        putListItemsToResult();
        curListItemType = '';
        curListItems = [];
      }
      result.push(block);
      continue;
    }

    if (!curListItemType) {
      curListItemType = block.type;
      curListItems = [block];
      continue;
    }

    if (curListItemType === block.type) {
      curListItems.push(block);
      continue;
    }

    putListItemsToResult();
    curListItemType = block.type;
    curListItems = [block];
  }

  if (curListItemType) {
    putListItemsToResult();
  }

  return result;
};

export const getFootnoteRefId = (index: number) => `user-content-fnref-${index}`;
export const getFootnoteContentId = (index: number) => `user-content-fn-${index}`;
