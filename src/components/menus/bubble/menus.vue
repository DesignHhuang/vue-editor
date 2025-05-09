<template>
  <template
    v-if="
      editor?.isActive('horizontalRule') ||
      editor?.isActive('codeBlock') ||
      editor?.getAttributes('image').error
    "
  >
    <!-- <menus-bubble-node-delete /> -->
  </template>
  <template
    v-else-if="
      editor?.isActive('image') && !editor?.getAttributes('image').error
    "
  >
    <menus-toolbar-base-align-left />
    <menus-toolbar-base-align-center />
    <menus-toolbar-base-align-right />
    <div class="umo-bubble-menu-divider"></div>
    <menus-bubble-image-flip />
    <menus-bubble-image-proportion />
    <menus-bubble-image-draggable />
    <menus-bubble-image-reset />
    <div class="umo-bubble-menu-divider"></div>
    <menus-bubble-image-remove-background
      v-if="
        editor?.getAttributes('image')?.type.startsWith('image') ||
        ['image/png', 'image/jpeg'].includes(
          editor?.getAttributes('image')?.type,
        )
      "
    />
    <menus-bubble-image-preview
      v-if="
        editor?.getAttributes('image')?.type.startsWith('image') ||
        ['image/png', 'image/jpeg'].includes(
          editor?.getAttributes('image')?.type,
        )
      "
    />
    <menus-bubble-image-open />
    <div class="umo-bubble-menu-divider"></div>
    <menus-bubble-image-edit />
    <menus-bubble-node-duplicate
      v-if="
        editor?.isActive('image') && editor?.getAttributes('image').draggable
      "
    />
    <menus-bubble-node-tofile
      v-if="
        editor?.getAttributes('image').previewType !== null &&
        editor?.getAttributes('image').type.startsWith('image')
      "
    />
    <menus-bubble-node-delete />
  </template>
  <template v-else-if="editor?.isActive('video') || editor?.isActive('file')">
    <menus-toolbar-base-align-left />
    <menus-toolbar-base-align-center />
    <menus-toolbar-base-align-right />
    <div class="umo-bubble-menu-divider"></div>
    <menus-bubble-file-download v-if="editor?.isActive('file')" />
    <menus-bubble-node-tofile v-if="editor?.isActive('video')" />
    <menus-bubble-node-delete />
  </template>
  <template v-else-if="editor?.isActive('table')">
    <menus-toolbar-table-cells-align />
    <menus-toolbar-table-cells-background />
    <div class="umo-bubble-menu-divider"></div>
    <menus-toolbar-table-add-row-before />
    <menus-toolbar-table-add-row-after />
    <menus-toolbar-table-add-column-before />
    <menus-toolbar-table-add-column-after />
    <div class="umo-bubble-menu-divider"></div>
    <menus-toolbar-table-delete-row />
    <menus-toolbar-table-delete-column />
    <div class="umo-bubble-menu-divider"></div>
    <menus-toolbar-table-merge-cells />
    <menus-toolbar-table-split-cell />
  </template>
  <template v-else-if="editor?.isActive('tag')">
    <menus-bubble-tag-input />
    <menus-bubble-tag-builtin />
    <div class="umo-bubble-menu-divider"></div>
    <menus-bubble-tag-color />
    <menus-bubble-tag-background />
    <div class="umo-bubble-menu-divider"></div>
    <menus-bubble-tag-delete />
  </template>
  <template v-else>
    <menus-toolbar-base-bold />
    <menus-toolbar-base-italic />
    <menus-toolbar-base-underline />
    <menus-toolbar-base-strike />
    <div class="umo-bubble-menu-divider"></div>
    <menus-toolbar-base-align-dropdown />
    <menus-toolbar-insert-link v-if="!disableItem('link')" />
    <div class="umo-bubble-menu-divider"></div>
    <menus-toolbar-base-color />
    <menus-toolbar-base-background-color />
    <menus-toolbar-base-highlight v-if="!disableItem('highlight')" />
    <div class="umo-bubble-menu-divider"></div>
    <slot name="bubble_menu" />
  </template>
</template>

<script setup lang="ts">
const editor = inject('editor')
const options = inject('options')
const disableItem = (name: string) => {
  return options.value.toolbar?.disableMenuItems.includes(name)
}
</script>

<style lang="less">
.umo-bubble-menu-divider {
  width: 1px;
  border-right: solid 1px var(--umo-border-color-light);
  height: 16px;
  margin: 0 10px 0 5px;
  &:last-child:is(.umo-bubble-menu-divider) {
    display: none;
  }
}
</style>
