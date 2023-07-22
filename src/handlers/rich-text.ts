import type { Element, Text } from 'hast';

import {
  h,
  getColorClassName,
  objAssign,
  getFootnoteRefId,
  getFootnoteContentId,
} from '../utils.js';

import { Context } from '../types.js';

const getHastsWithBr = (text: string) => {
  const hasBreak = text.includes('\n');
  if (!hasBreak) {
    return [h('text', text)];
  }

  const textParts = text.split('\n');
  const textPartsCount = textParts.length;

  const result: (Element | Text)[] = [];
  for (let i = 0; i < textPartsCount; i += 1) {
    const isLastPart = i === textPartsCount - 1;
    result.push(h('text', textParts[i]!));
    !isLastPart && result.push(h('br', []));
  }
  return result;
};

const annotationKeysInWrapperOrder = ['code', 'bold', 'italic', 'strikethrough', 'underline'];
const tagsByAnnotationKey = {
  code: 'code',
  bold: 'b',
  italic: 'i',
  strikethrough: 's',
  underline: 'u',
};

const handler = (
  context: Context,
  block: any | null,
  richTextObj: any,
  turnLineBreakToBr = true
): Element | Text => {
  const { type, plain_text, href, annotations } = richTextObj;

  const rawHtml = context.options.convertRawHtml?.(richTextObj);
  if (typeof rawHtml === 'string') {
    return h('raw', rawHtml);
  }

  let footnoteRefs: any[];
  const isFootnoteSign =
    annotations.code &&
    plain_text === '[^]' &&
    (footnoteRefs = block && context.options.footnoteReference?.[block.id]) &&
    footnoteRefs.length > 0;

  if (isFootnoteSign) {
    const footnodeCount = context.addFootnote(footnoteRefs!.shift());
    const id = getFootnoteRefId(footnodeCount);
    const contentId = getFootnoteContentId(footnodeCount);

    return h('sup', { className: ['footnote-ref'] }, [
      h('a', { id, href: `#${contentId}` }, [h('text', String(footnodeCount))]),
    ]);
  }

  let hasts: (Element | Text)[] = turnLineBreakToBr
    ? getHastsWithBr(plain_text)
    : [h('text', plain_text)];

  if (turnLineBreakToBr && plain_text.includes('\n')) {
  }

  annotationKeysInWrapperOrder.forEach((key) => {
    if (annotations[key]) {
      const wrapperTag = tagsByAnnotationKey[key as keyof typeof tagsByAnnotationKey];
      hasts = [h(wrapperTag, hasts)];
    }
  });
  if (href) {
    hasts = [h('a', { href }, hasts)];
  }

  if (hasts.length > 1) {
    hasts = [h('span', hasts)];
  }
  let hast = hasts[0]!;

  const mathClassName = type === 'equation' ? ['math', 'math-inline'] : [];
  const colorClassName = getColorClassName(annotations.color);
  const className = [...mathClassName, colorClassName].filter(Boolean);

  if (className.length > 0) {
    if (hast.type === 'text') {
      hast = h('span', [hast]);
    }
    hast.properties = objAssign(hast.properties, { className });
  }

  // TODO: Mention blocks

  return hast;
};

interface ParamsAddTasksToAddRichTexts {
  context: Context;
  block: any;
  hast: Element;
  richTexts: any[] | undefined;
  wrapRichTexts?: boolean;
  turnLineBreakToBr?: boolean;
}
export const addTasksToAddRichTexts = ({
  context,
  block,
  hast,
  richTexts,
  wrapRichTexts,
  turnLineBreakToBr,
}: ParamsAddTasksToAddRichTexts) => {
  let hastForRichTexts = hast;

  if (wrapRichTexts) {
    const wrapper = h('p', []);
    context.addTasks(() => hast.children.push(wrapper));

    hastForRichTexts = wrapper;
  }

  context.addTasks(richTexts, (richTextObj: any) => (ctx) => {
    hastForRichTexts.children.push(handler(ctx, block, richTextObj, turnLineBreakToBr));
  });
};

export default handler;
