// eslint-disable-next-line import/no-extraneous-dependencies
import { Schema } from 'prosemirror-model';

export const schema = new Schema({
  nodes: {
    doc: {
      content: 'block+',
    },

    paragraph: {
      content: 'inline*',
      group: 'block',
      parseDOM: [{ tag: 'p' }],
      toDOM() { return ['p', 0]; },
    },

    blockquote: {
      content: 'block+',
      group: 'block',
      parseDOM: [{ tag: 'blockquote' }],
      toDOM() { return ['blockquote', 0]; },
    },

    horizontal_rule: {
      group: 'block',
      parseDOM: [{ tag: 'hr' }],
      toDOM() { return ['div', ['hr']]; },
    },

    ordered_list: {
      content: 'list_item+',
      group: 'block',
      attrs: { order: { default: 1 }, tight: { default: false } },
      parseDOM: [{
        tag: 'ol',
        getAttrs(dom) {
          return {
            order: (dom as HTMLElement).hasAttribute('start') ? +(dom as HTMLElement).getAttribute('start')! : 1,
            tight: (dom as HTMLElement).hasAttribute('data-tight'),
          };
        },
      }],
      toDOM(node) {
        return ['ol', {
          start: node.attrs.order === 1 ? null : node.attrs.order,
          'data-tight': node.attrs.tight ? 'true' : null,
        }, 0];
      },
    },

    bullet_list: {
      content: 'list_item+',
      group: 'block',
      attrs: { tight: { default: false } },
      parseDOM: [{ tag: 'ul', getAttrs: (dom) => ({ tight: (dom as HTMLElement).hasAttribute('data-tight') }) }],
      toDOM(node) { return ['ul', { 'data-tight': node.attrs.tight ? 'true' : null }, 0]; },
    },

    list_item: {
      content: 'paragraph block*',
      defining: true,
      parseDOM: [{ tag: 'li' }],
      toDOM() { return ['li', 0]; },
    },

    text: {
      group: 'inline',
    },

    hard_break: {
      inline: true,
      group: 'inline',
      selectable: false,
      parseDOM: [{ tag: 'br' }],
      toDOM() { return ['br']; },
    },
  },

  marks: {
    em: {
      parseDOM: [{ tag: 'i' }, { tag: 'em' },
        { style: 'font-style', getAttrs: (value) => value === 'italic' && null }],
      toDOM() { return ['em']; },
    },

    strong: {
      parseDOM: [{ tag: 'b' }, { tag: 'strong' },
        { style: 'font-weight', getAttrs: (value) => /^(bold(er)?|[5-9]\d{2,})$/.test(value as string) && null }],
      toDOM() { return ['strong']; },
    },

    link: {
      attrs: {
        href: {},
        title: { default: null },
        target: { default: '_blank' },
      },
      inclusive: false,
      parseDOM: [{
        tag: 'a[href]',
        getAttrs(dom) {
          return { href: (dom as HTMLElement).getAttribute('href'), title: (dom as HTMLElement).getAttribute('title') };
        },
      }],
      toDOM(node) { return ['a', node.attrs]; },
    },
  },
});

export default schema;
