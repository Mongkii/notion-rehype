# notion-rehype

Turn Notion blocks(from API) into rehype(hast), so you can make the most of the rich rehype ecosystem.

## Usage

```js
import { unified } from 'unified';
import notionRehype from 'notion-rehype';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';

const notionBlocks = [
  {
    // ... some properties omitted
    type: 'paragraph',
    paragraph: {
      // ... some properties omitted
      rich_text: [{ plain_text: 'This is a Notion paragraph' }],
    },
  },
];

const processor = unified()
  .use(notionRehype) // Parse Notion blocks to rehype AST
  .use(rehypeKatex) // Then you can use any rehype plugins to enrich the AST
  .use(rehypeStringify); // Turn AST to HTML string

// Due to the limitation of the `.process()` method,
// notion blocks should be passed in with a wrapper `{ data: xxx }`;
const vFile = unifiedInst.process({ data: notionBlocks });
// Or you can pass a string in.
// The plugin will use JSON.parse to parse any string argument.
const vFile = unifiedInst.process(JSON.stringify(notionBlocks));

const html = vFile.toString(); // get the output HTML string
assert(html === '<p>This is a Notion paragraph</p>');
```

## Plugin Options

The plugin offers many options to customize the output, you can set options in this way: `.use(notionRehype, { ...options })`

| Option                | Type                                                         | Default Value   | Description                                                                                                                                                                                                                                                                                                                                                                           |
| --------------------- | ------------------------------------------------------------ | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| notionPrefix          | string                                                       | `'notion-'`     | The prefix of the classes and attributes that relates to Notion. e.g. `<section class="notion-callout"><section>`, the `'notion-'` is the prefix.                                                                                                                                                                                                                                     |
| enableNestedParagraph | boolean                                                      | `false`         | Should paragraph elements supports nesting. If true, the paragraph element which has children will turn into `<div>` instead of `<p>`, since the `<p>` element doesn't allow nesting. Which might leads to lower accessibility                                                                                                                                                        |
| enableBlockId         | boolean                                                      | `false`         | Should add block id info to DOM or not. If true, the DOMs will have a `data-{prefix}-block-id` attribute.                                                                                                                                                                                                                                                                             |
| convertRawHtml        | `(richTextObj: any) => string \| false \| undefined \| null` | `undefined`     | A function to test should a `block.[type].rich_text` item turn to raw HTML. If should, this function returns the raw HTML value. e.g. `convertRawHtml: (richTextObj) => richTextObj.plain_text.startsWith('@@') ? richTextObj.plain_text.slice(2) : null`, will render like this: Notion Block: `'TEST. @@<span>test</span>. TEST'` -> Result: `<p>TEST. <span>test</span>. TEST</p`> |
| pageReference         | `{ [pageId: string]: any }`                                  | `{}`            | Used in link_to_page blocks, since the blocks don't contain page metadatas, the info should be passed in from the outside.                                                                                                                                                                                                                                                            |
| footnoteReference     | `{ [blockId: string]: any }`                                 | `{}`            | **[NOT STABLE - this option will change anytime following Notion Comment API changes. Use it at your own rick]** If a block has a 'footnote placeholder' (a rich_text item which is **inline code** and **text is `[^]`**), it will search for the relevant block comments, and use the comments as footnote for placeholder.                                                         |
| footnoteTitle         | string                                                       | `'Footnotes' `  | The Footnote Title. If set to `<hr>`, will render a hr element rather than a h2 title.                                                                                                                                                                                                                                                                                                |
| footnoteBackLabel     | string                                                       | `'Back to ref'` | The title and aria text for a footnote's 'go back' icon.                                                                                                                                                                                                                                                                                                                              |

## TODO

- [ ] Types support
- [ ] Unit tests
- [ ] Engineering (ESLint, Prettier, …etc.)
