/* eslint-disable import/no-extraneous-dependencies */
import markdownit from 'markdown-it';
import { MarkdownParser } from 'prosemirror-markdown';
// eslint-disable-next-line import/no-named-as-default
import schema from './schema';

type Token = any;

const listIsTight = (tokens: readonly Token[], i: number) => {
  // eslint-disable-next-line no-plusplus, no-param-reassign
  while (++i < tokens.length) {
    if (tokens[i].type !== 'list_item_open') return tokens[i].hidden;
  }
  return false;
};

export const parser = new MarkdownParser(schema, markdownit('commonmark', { html: false }), {
  blockquote: { block: 'blockquote' },
  paragraph: { block: 'paragraph' },
  list_item: { block: 'list_item' },
  bullet_list: { block: 'bullet_list', getAttrs: (_, tokens, i) => ({ tight: listIsTight(tokens, i) }) },
  ordered_list: {
    block: 'ordered_list',
    getAttrs: (tok, tokens, i) => ({
      order: +tok.attrGet('start') || 1,
      tight: listIsTight(tokens, i),
    }),
  },
  hr: { node: 'horizontal_rule' },
  hardbreak: { node: 'hard_break' },

  em: { mark: 'em' },
  strong: { mark: 'strong' },
  link: {
    mark: 'link',
    getAttrs: (tok) => ({
      href: tok.attrGet('href'),
      title: tok.attrGet('title') || null,
    }),
  },
});
