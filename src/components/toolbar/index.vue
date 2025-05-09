<template>
  <div v-if="$toolbar.show" class="umo-toolbar-container">
    <toolbar-classic
      v-if="$toolbar.mode === 'classic'"
      :menus="toolbarMenus"
      :current-menu="currentMenu"
      @menu-change="menuChange"
    >
      <template
        v-for="item in options.toolbar?.menus"
        :key="item"
        #[`toolbar_${item}`]="props"
      >
        <slot :name="`toolbar_${item}`" v-bind="props" />
      </template>
    </toolbar-classic>
  </div>
</template>

<script setup lang="ts">
import type { DropdownOption } from 'tdesign-vue-next'

import { timeAgo } from '@/utils/time-ago'
const emits = defineEmits(['menu-change'])

const container = inject('container')
const editor = inject('editor')
const savedAt = inject('savedAt')
const options = inject('options')
const $toolbar = useState('toolbar', options)
let statusPopup = $ref(false)
const online = useOnline()

// 工具栏菜单
const defaultToolbarMenus = [
  { label: t('toolbar.base'), value: 'base' },
  { label: t('toolbar.insert'), value: 'insert' },
  { label: t('toolbar.table'), value: 'table' },
  { label: t('toolbar.tools'), value: 'tools' },
  { label: t('toolbar.page'), value: 'page' },
  { label: t('toolbar.export'), value: 'export' },
]
let toolbarMenus = defaultToolbarMenus
if (options.value.toolbar?.menus) {
  toolbarMenus = options.value.toolbar?.menus.map(
    (item: any) => defaultToolbarMenus.filter((menu) => menu.value === item)[0],
  )
}
let currentMenu = $ref(toolbarMenus[0].value)
const menuChange = (menu: string) => {
  currentMenu = menu
  emits('menu-change', menu)
}
// 监听如果当前编辑元素为table则切换到table菜单
watch(
  () => editor.value?.isActive('table'),
  (val: boolean, oldVal: boolean) => {
    if (val) {
      currentMenu = 'table'
    } else if (!val && oldVal) {
      currentMenu = 'base'
    }
  },
)
</script>

<style lang="less" scoped>
.umo-toolbar-container {
  display: flex;
  justify-content: space-between;
  user-select: none;
  border-bottom: solid 1px var(--umo-border-color);
  position: relative;
}
.umo-show-toolbar {
  cursor: pointer;
  position: absolute;
  right: 20px;
  font-size: 18px;
  padding: 3px 6px;
  z-index: 99;
  background-color: var(--umo-color-white);
  color: var(--umo-text-color-light);
  border-bottom-left-radius: var(--umo-radius);
  border-bottom-right-radius: var(--umo-radius);
  border: solid 1px var(--umo-border-color);
  border-top: none;
  &:hover {
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.08);
    color: var(--umo-primary-color);
  }
}
.umo-status {
  font-size: 12px;
  display: flex;
  align-items: center;
  cursor: pointer;
  &-online {
    width: 10px;
    height: 10px;
    background: rgb(26, 187, 26);
    border-radius: 50%;
    &.offline {
      background: rgb(187, 26, 26);
    }
  }
  &-saved {
    color: var(--umo-text-color-light);
    margin-left: 5px;
    .unsaved {
      color: var(--umo-error-color);
    }
  }
}
.umo-document-status-container {
  flex-direction: column;
  align-items: unset;
  padding: 12px 16px;
  color: var(--umo-text-color);
  min-width: 150px;
  cursor: default;
  .umo-document-button-container {
    margin: 8px 0 4px;
    display: flex;
    gap: 8px;
  }
}
</style>
