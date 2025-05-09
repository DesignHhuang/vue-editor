import SearchReplace from '@sereneinserenade/tiptap-search-and-replace'
import Bold from '@tiptap/extension-bold'
import CharacterCount from '@tiptap/extension-character-count'
import Color from '@tiptap/extension-color'
import Dropcursor from '@tiptap/extension-dropcursor'
import Focus from '@tiptap/extension-focus'
import Highlight from '@tiptap/extension-highlight'
import Placeholder from '@tiptap/extension-placeholder'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import TableRow from '@tiptap/extension-table-row'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import TextColor from '@tiptap/extension-text-style'
import Typography from '@tiptap/extension-typography'
import Underline from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'
import type { Editor, Extension } from '@tiptap/vue-3'
import NodeRange from '@tiptap-pro/extension-node-range'
import { getHierarchicalIndexes } from '@tiptap-pro/extension-table-of-contents'
import { TableOfContents } from '@tiptap-pro/extension-table-of-contents'

import type { UmoEditorOptions } from '@/types'
import { shortId } from '@/utils/short-id'

import BulletList from './bullet-list'
import Callout from './callout'
import CodeBlock from './code-block'
import File from './file'
import FileHandler from './file-handler'
import FormatPainter from './format-painter'
import hr from './hr'
import Image from './image'
import Indent from './indent'
import Link from './link'
import Margin from './margin'
import Mention from './mention'
import getUsersSuggestion from './mention/suggestion'
import NodeAlign from './node-align'
import OrderedList from './ordered-list'
import Selection from './selection'
import Table from './table'
import TableCell from './table/cell'
import TableHeader from './table/header'
import Tag from './tag'
import TextAlign from './text-align'
import typeWriter from './type-writer'
import Video from './video'

export const getDefaultExtensions = ({
  container,
  options,
  uploadFileMap,
}: {
  container: string
  options: { value: UmoEditorOptions }
  uploadFileMap: { value: any }
}) => {
  const { document: doc, users, file } = options.value

  const extensions = [
    StarterKit.configure({
      bold: false,
      bulletList: false,
      orderedList: false,
      codeBlock: false,
      horizontalRule: false,
      dropcursor: false,
    }),
    Placeholder.configure({
      placeholder: () => String(l(doc?.placeholder ?? '')),
    }),
    Focus.configure({
      className: 'umo-node-focused',
      mode: 'all',
    }),
    FormatPainter,
    Bold.extend({
      renderHTML: ({ HTMLAttributes }: any) => ['b', HTMLAttributes, 0],
    }),
    Underline,
    Subscript,
    Superscript,
    Color,
    TextColor,
    Highlight.configure({
      multicolor: true,
    }),
    Indent,
    BulletList,
    OrderedList,
    TextAlign,
    NodeAlign,
    TaskItem.configure({ nested: true }),
    TaskList.configure({
      HTMLAttributes: {
        class: 'umo-task-list',
      },
    }),
    Margin,
    SearchReplace.configure({
      searchResultClass: 'umo-search-result',
    }),
    Link,
    Image,
    Video,
    File,
    CodeBlock,
    hr,
    Tag,
    Callout,

    // 表格
    Table,
    TableRow,
    TableHeader,
    TableCell,

    // 其他
    Mention.configure({
      suggestion: getUsersSuggestion(users ?? []),
    }),
    Selection,
    NodeRange,
    TableOfContents.configure({
      getIndex: getHierarchicalIndexes,
      scrollParent: () =>
        document.querySelector(
          `${container} .umo-zoomable-container`,
        ) as HTMLElement,
      getId: () => shortId(6),
    }),
    Typography.configure(doc?.typographyRules),
    CharacterCount.configure({
      limit: doc?.characterLimit !== 0 ? doc?.characterLimit : undefined,
    }),
    FileHandler.configure({
      allowedMimeTypes: file?.allowedMimeTypes,
      onPaste(editor: Editor, files: any) {
        //记录 已有位置
        const pageContainer = document.querySelector(
          `${container} .umo-zoomable-container`,
        ) as HTMLElement
        const scrollTop = pageContainer?.scrollTop || 0
        for (const file of files) {
          editor.commands.insertFile({
            file,
            uploadFileMap: uploadFileMap.value,
            autoType: true,
          })
        }
        // 恢复滚动位置
        if (pageContainer) {
          // 使用 setTimeout 确保 DOM 更新完成后再恢复滚动位置
          setTimeout(() => {
            pageContainer.scrollTop = scrollTop
          }, 0)
        }
      },
      onDrop: (editor: Editor, files: any, pos: number) => {
        for (const file of files) {
          editor.commands.insertFile({
            file,
            uploadFileMap: uploadFileMap.value,
            autoType: true,
            pos,
          })
        }
      },
    }),
    Dropcursor.configure({
      color: 'var(--umo-primary-color)',
    }),
    typeWriter,
  ]

  return extensions
}

export const inputAndPasteRules = (options: any) => {
  let enableRules: boolean | Extension[] = true
  const $document = useState('document', options)
  if (
    !options.value.document?.enableMarkdown ||
    !$document.value?.enableMarkdown
  ) {
    enableRules = [Typography, Image as Extension]
  }
  return enableRules
}
