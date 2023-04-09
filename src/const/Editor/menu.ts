/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable import/no-extraneous-dependencies */
import {
  wrapItem, Dropdown, joinUpItem, liftItem,
  selectParentNodeItem, undoItem, redoItem, icons, MenuItem, MenuElement, MenuItemSpec,
} from 'prosemirror-menu';
import { EditorState, Command } from 'prosemirror-state';
import { Schema, NodeType, MarkType } from 'prosemirror-model';
import { toggleMark } from 'prosemirror-commands';
import { wrapInList } from 'prosemirror-schema-list';
import { TextField, openPrompt } from './prompt';

function cmdItem(cmd: Command, options: Partial<MenuItemSpec>) {
  const passedOptions: MenuItemSpec = {
    label: options.title as string | undefined,
    run: cmd,
  };
  for (const prop in options) (passedOptions as any)[prop] = (options as any)[prop];
  if (!options.enable && !options.select) { passedOptions[options.enable ? 'enable' : 'select'] = (state) => cmd(state); }

  return new MenuItem(passedOptions);
}

function markActive(state: EditorState, type: MarkType) {
  const {
    from, $from, to, empty,
  } = state.selection;
  if (empty) return !!type.isInSet(state.storedMarks || $from.marks());
  return state.doc.rangeHasMark(from, to, type);
}

function markItem(markType: MarkType, options: Partial<MenuItemSpec>) {
  const passedOptions: Partial<MenuItemSpec> = {
    active(state) { return markActive(state, markType); },
  };
  for (const prop in options) (passedOptions as any)[prop] = (options as any)[prop];
  return cmdItem(toggleMark(markType), passedOptions);
}

function linkItem(markType: MarkType) {
  return new MenuItem({
    title: 'Add or remove link',
    icon: icons.link,
    active(state) { return markActive(state, markType); },
    enable(state) { return !state.selection.empty; },
    run(state, dispatch, view) {
      if (markActive(state, markType)) {
        toggleMark(markType)(state, dispatch);
        return true;
      }
      openPrompt({
        title: 'Create a link',
        fields: {
          href: new TextField({
            label: 'Link target',
            required: true,
          }),
          title: new TextField({ label: 'Title' }),
        },
        callback(attrs) {
          toggleMark(markType, attrs)(view.state, view.dispatch);
          view.focus();
        },
      });
      // NOTE: 正常に動いているか確認必要
      return undefined;
    },
  });
}

function wrapListItem(nodeType: NodeType, options: Partial<MenuItemSpec>) {
  return cmdItem(wrapInList(nodeType, (options as any).attrs), options);
}

type MenuItemResult = {
/// A menu item to toggle the [strong mark](#schema-basic.StrongMark).
  toggleStrong?: MenuItem

  /// A menu item to toggle the [emphasis mark](#schema-basic.EmMark).
  toggleEm?: MenuItem

  /// A menu item to toggle the [code font mark](#schema-basic.CodeMark).
  toggleCode?: MenuItem

  /// A menu item to toggle the [link mark](#schema-basic.LinkMark).
  toggleLink?: MenuItem

  /// A menu item to insert an [image](#schema-basic.Image).
  insertImage?: MenuItem

  /// A menu item to wrap the selection in a [bullet list](#schema-list.BulletList).
  wrapBulletList?: MenuItem

  /// A menu item to wrap the selection in an [ordered list](#schema-list.OrderedList).
  wrapOrderedList?: MenuItem

  /// A menu item to wrap the selection in a [block quote](#schema-basic.BlockQuote).
  wrapBlockQuote?: MenuItem

  /// A menu item to set the current textblock to be a normal
  /// [paragraph](#schema-basic.Paragraph).
  makeParagraph?: MenuItem

  /// A menu item to set the current textblock to be a
  /// [code block](#schema-basic.CodeBlock).
  makeCodeBlock?: MenuItem

  /// Menu items to set the current textblock to be a
  /// [heading](#schema-basic.Heading) of level _N_.
  makeHead1?: MenuItem
  makeHead2?: MenuItem
  makeHead3?: MenuItem
  makeHead4?: MenuItem
  makeHead5?: MenuItem
  makeHead6?: MenuItem

  /// A menu item to insert a horizontal rule.
  insertHorizontalRule?: MenuItem

  /// A dropdown containing the `insertImage` and
  /// `insertHorizontalRule` items.
  insertMenu: Dropdown

  /// A dropdown containing the items for making the current
  /// textblock a paragraph, code block, or heading.
  typeMenu: Dropdown

  /// Array of block-related menu items.
  blockMenu: MenuElement[][]

  /// Inline-markup related menu items.
  inlineMenu: MenuElement[][]

  /// An array of arrays of menu elements for use as the full menu
  /// for, for example the [menu
  /// bar](https://github.com/prosemirror/prosemirror-menu#user-content-menubar).
  fullMenu: MenuElement[][]
};

/// Given a schema, look for default mark and node types in it and
/// return an object with relevant menu items relating to those marks.
// eslint-disable-next-line import/prefer-default-export
export function buildMenuItems(schema: Schema): MenuItemResult {
  const r: MenuItemResult = {} as any;
  let mark: MarkType | undefined;
  if (schema.marks.strong) {
    mark = schema.marks.strong;
    r.toggleStrong = markItem(mark, { title: 'Toggle strong style', icon: icons.strong });
  }
  if (schema.marks.em) {
    mark = schema.marks.em;
    r.toggleEm = markItem(mark, { title: 'Toggle emphasis', icon: icons.em });
  }
  if (schema.marks.link) {
    mark = schema.marks.link;
    r.toggleLink = linkItem(mark);
  }

  let node: NodeType | undefined;
  if (schema.nodes.bullet_list) {
    node = schema.nodes.bullet_list;
    r.wrapBulletList = wrapListItem(node, {
      title: 'Wrap in bullet list',
      icon: icons.bulletList,
    });
  }
  if (schema.nodes.ordered_list) {
    node = schema.nodes.ordered_list;
    r.wrapOrderedList = wrapListItem(node, {
      title: 'Wrap in ordered list',
      icon: icons.orderedList,
    });
  }
  if (schema.nodes.blockquote) {
    node = schema.nodes.blockquote;
    r.wrapBlockQuote = wrapItem(node, {
      title: 'Wrap in block quote',
      icon: icons.blockquote,
    });
  }

  const cut = <T>(arr: T[]) => arr.filter((x) => x) as NonNullable<T>[];
  r.inlineMenu = [cut([r.toggleStrong, r.toggleEm, r.toggleCode, r.toggleLink])];
  r.blockMenu = [cut([r.wrapBulletList, r.wrapOrderedList, r.wrapBlockQuote, joinUpItem,
    liftItem, selectParentNodeItem])];
  r.fullMenu = r.inlineMenu.concat(
    [[undoItem, redoItem]],
    r.blockMenu,
  );

  return r;
}
