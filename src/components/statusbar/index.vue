<template>
  <div class="umo-status-bar">
    <div class="umo-status-bar-left">
      <t-popup
        v-if="editor"
        v-model="showWordCount"
        trigger="click"
        placement="top-left"
      >
        <t-button
          class="umo-status-bar-button auto-width word-count"
          variant="text"
          size="small"
        >
          <span v-if="selectionCharacters > 0">
            {{ selectionCharacters }}/
          </span>
          <span class="umo-word-count">
            {{ editor.storage.characterCount.characters() }}</span
          >
          {{ t('wordCount.characters') }}
          <icon
            name="arrow-down"
            :style="{ transform: `rotate(${showWordCount ? '180deg' : 0})` }"
          />
        </t-button>
        <template #content>
          <div v-if="showWordCount" class="umo-word-count-detail">
            <div class="umo-word-count-title">{{ t('wordCount.title') }}</div>
            <ul>
              <li>
                {{ t('wordCount.input') }}
                <span>
                  {{ editor.storage.characterCount.characters() }}
                </span>
              </li>
              <li>
                {{ t('wordCount.selection') }}
                <span>{{ selectionCharacters }}</span>
              </li>
              <li v-if="options.document?.characterLimit > 0">
                {{ t('wordCount.limit') }}
                <span>
                  {{ options.document?.characterLimit }}
                </span>
              </li>
            </ul>
          </div>
        </template>
      </t-popup>
    </div>
    <div class="umo-status-bar-right">
      <t-dropdown
        :attach="container"
        :options="langs"
        placement="top-left"
        trigger="click"
        @click="changeLang"
      >
        <t-button
          class="umo-status-bar-button auto-width umo-lang-button"
          variant="text"
          size="small"
          v-text="lang"
        >
        </t-button>
      </t-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UseFullscreenReturn } from '@vueuse/core'
import type { DropdownOption } from 'tdesign-vue-next'

import type { SupportedLocale } from '@/types'
import { getShortcut } from '@/utils/shortcut'

const { locale } = useI18n()
const container = inject('container')
const editor = inject('editor')
const page = inject('page')
const options = inject('options')
const $document = useState('document', options)

const reset = inject('reset') as (silent: boolean) => void

// 字数统计
const showWordCount = $ref(false)
const selectionCharacters = computed(() => {
  if (editor.value) {
    const { selection } = editor.value.state
    const text = editor.value.state.doc.textBetween(
      selection.from,
      selection.to,
      '',
    )
    return text.length
  }
  return 0
})

// 页面全屏
const fullscreen = inject('fullscreen')

let documentFullscreen: UseFullscreenReturn = $ref(null)
onMounted(() => {
  documentFullscreen = useFullscreen(document.querySelector(container))
})

// 多语言
const langs = [
  { content: '🇨🇳 简体中文', value: 'zh-CN' },
  { content: '🇱🇷 English', value: 'en-US' },
  { content: '🇷🇺 Русский', value: 'ru-RU' },
]
const setLocale = inject('setLocale') as (value: SupportedLocale) => void

const lang = computed(
  () => langs.find((item) => item.value === locale.value)?.content,
)
const changeLang = (dropdownItem: DropdownOption) => {
  const value = dropdownItem.value as SupportedLocale
  if (lang.value === value) {
    return
  }
  const dialog = useConfirm({
    attach: container,
    theme: 'warning',
    header: t('changeLocale.title'),
    body: t('changeLocale.message'),
    confirmBtn: {
      theme: 'warning',
      content: t('changeLocale.confirm'),
    },
    onConfirm() {
      dialog.destroy()
      setTimeout(() => setLocale(value), 300)
    },
  })
}
</script>

<style lang="less" scoped>
.umo-status-bar {
  padding: 6px 10px;
  display: flex;
  justify-content: space-between;
  font-size: var(--umo-font-size-small);
  border-top: solid 1px var(--umo-border-color);

  @media screen and (max-width: 640px) {
    overflow-x: auto;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .umo-status-bar-split {
    height: 16px;
    width: 1px;
    background-color: var(--umo-border-color);
    margin: 0 10px;
  }
  .umo-status-bar-button {
    --td-comp-size-xs: 18px;
    --td-comp-paddingLR-l: 8px;
    --td-radius-default: 2px;
    font-size: 14px;
    margin: 0 4px;
    color: var(--umo-text-color);
    &:not(.auto-width) {
      width: var(--td-comp-size-xs);
    }
    &.auto-width {
      font-size: var(--umo-font-size-small);
      padding-left: 6px;
      padding-right: 6px;
    }
    &.word-count {
      padding-left: 2px;
      padding-right: 0;
      :deep(.umo-button__text) {
        display: flex;
        align-items: center;
        .umo-icon {
          margin-left: 3px;
          transform: rotate(180deg);
        }
      }
    }
    :deep(.umo-button__text) {
      padding: 0 5px;
    }
    &.active {
      background-color: var(--umo-button-hover-background);
      border-color: var(--umo-button-hover-background);
      color: var(--umo-primary-color);
    }
  }
  &-left {
    display: flex;
    align-items: center;
  }

  &-right {
    display: flex;
    align-items: center;
    .umo-lang-button {
      :deep(.umo-button__text) {
        display: flex;
        align-items: center;
        .umo-icon {
          font-size: 16px;
          margin-right: 3px;
        }
      }
    }
    @media screen and (max-width: 720px) {
      .umo-lang-button {
        display: none !important;
      }
    }
  }
}
</style>

<style lang="less">
.umo-word-count {
  margin-right: 0.25em;
  &-detail {
    padding: 10px 0 8px;
    width: 160px;
    font-size: 12px;
    color: var(--umo-text-color-light);
    ul {
      padding: 0;
      margin: 0;
    }
    li {
      list-style: none;
      cursor: default;
      padding: 0 12px;
      display: flex;
      justify-content: space-between;
      line-height: 28px;
      color: var(--umo-text-color);
      &:hover {
        background-color: var(--td-bg-color-container-hover);
      }
    }
  }
  &-title {
    padding: 0 12px;
    margin-bottom: 3px;
  }
}
</style>
