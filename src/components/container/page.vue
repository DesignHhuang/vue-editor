<template>
  <div class="umo-page-container">
    <div class="umo-zoomable-container umo-scrollbar">
      <div
        class="umo-zoomable-content"
        :style="{
          height: pageZoomHeight,
        }"
      >
        <div
          class="umo-page-content"
          :style="{
            '--umo-page-background': pageOptions.background,
            '--umo-page-margin-top': (pageOptions.margin?.top ?? '0') + 'cm',
            '--umo-page-margin-bottom':
              (pageOptions.margin?.bottom ?? '0') + 'cm',
            '--umo-page-margin-left': (pageOptions.margin?.left ?? '0') + 'cm',
            '--umo-page-margin-right':
              (pageOptions.margin?.right ?? '0') + 'cm',
            '--umo-page-width': pageSize.width + 'cm',
            '--umo-page-height': pageSize.height + 'cm',
          }"
        >
          <div class="umo-page-node-header" contenteditable="false">
            <div class="umo-page-node-header-content"></div>
          </div>
          <div class="umo-page-node-content">
            <editor>
              <template #bubble_menu="props">
                <slot name="bubble_menu" v-bind="props" />
              </template>
            </editor>
          </div>
          <div class="umo-page-node-footer" contenteditable="false">
            <div class="umo-page-node-footer-content"></div>
          </div>
        </div>
      </div>
    </div>
    <t-image-viewer
      v-model:visible="imageViewer.visible"
      v-model:index="currentImageIndex"
      :images="previewImages"
      @close="imageViewer.visible = false"
    />
    <t-back-top
      :container="`${container} .umo-zoomable-container`"
      :visible-height="800"
      size="small"
      :offset="['25px', '30px']"
    />
  </div>
</template>

<script setup lang="ts">
import type { WatermarkOption } from '@/types'

const container = inject('container')
const imageViewer = inject('imageViewer')
const pageOptions = inject('page')

// 页面大小
const pageSize = $computed(() => {
  const { width, height } = pageOptions.value.size ?? { width: 0, height: 0 }
  return {
    width: pageOptions.value.orientation === 'portrait' ? width : height,
    height: pageOptions.value.orientation === 'portrait' ? height : width,
  }
})

// 页面内容变化后更新页面高度
let pageZoomHeight = $ref('')
const setPageZoomHeight = () => {
  const el = document.querySelector(`${container} .umo-page-content`)
  if (!el) {
    console.warn('The element <.umo-page-content> does not exist.')
    return
  }
  pageZoomHeight = `${(el.clientHeight * (pageOptions.value.zoomLevel ?? 1)) / 100}px`
}
watch(
  () => [
    pageOptions.value.zoomLevel,
    pageOptions.value.size,
    pageOptions.value.orientation,
  ],
  async () => {
    await nextTick()
    setTimeout(() => {
      setPageZoomHeight()
    }, 100)
  },
  { immediate: true, deep: true },
)

// FIXME:
const editorInstance = inject('editor')
watch(
  () => editorInstance.value?.getHTML(),
  () => {
    setPageZoomHeight()
  },
)

// 水印
const watermarkOptions = $ref<{
  x: number
  y?: number
  width?: number
  height: number
  type?: string
}>({
  x: 0,
  height: 0,
})
watch(
  () => pageOptions.value.watermark,
  ({ type }: Partial<WatermarkOption> = { type: '' }) => {
    if (type === 'compact') {
      watermarkOptions.width = 320
      watermarkOptions.y = 240
    } else {
      watermarkOptions.width = 480
      watermarkOptions.y = 360
    }
  },
  { deep: true, immediate: true },
)

// 图片预览
let previewImages = $ref<string[]>([])
let currentImageIndex = $ref<number>(0)

watch(
  () => imageViewer.value.visible,
  async (visible: boolean) => {
    if (!visible) {
      previewImages = []
      currentImageIndex = 0
      return
    }
    await nextTick()
    const images = document.querySelectorAll(
      `${container} .umo-page-node-content img[src]:not(.umo-icon)`,
    )
    Array.from(images).forEach((image, index) => {
      const src = image.getAttribute('src')
      const nodeId = image.getAttribute('data-id')
      previewImages.push(src)
      if (nodeId === imageViewer.value.current) {
        currentImageIndex = index
      }
    })
  },
)
</script>

<style lang="less" scoped>
.umo-page-container {
  height: 100%;
  display: flex;
  position: relative;
}

.umo-zoomable-container {
  flex: 1;
  padding: 0;
  scroll-behavior: smooth;
  .umo-zoomable-content {
    margin: 0 auto;
    box-shadow:
      rgba(0, 0, 0, 0.06) 0px 0px 10px 0px,
      rgba(0, 0, 0, 0.04) 0px 0px 0px 1px;
    .umo-page-content {
      transform-origin: 0 0;
      box-sizing: border-box;
      display: flex;
      position: relative;
      box-sizing: border-box;
      background-color: var(--umo-page-background);
      width: var(--umo-page-width);
      min-height: var(--umo-page-height);
      overflow: visible !important;
      display: flex;
      flex-direction: column;
      width: 100%;
      [contenteditable] {
        outline: none;
      }
    }
  }
}

.umo-page-node-header {
  height: var(--umo-page-margin-top);
  overflow: hidden;
}

.umo-page-node-footer {
  height: var(--umo-page-margin-bottom);
  overflow: hidden;
}

.umo-page-node-header,
.umo-page-node-footer {
  display: flex;
  justify-content: space-between;
}

.umo-page-node-header-content,
.umo-page-node-footer-content {
  flex: 1;
}

.umo-page-node-content {
  position: relative;
  box-sizing: border-box;
  flex-shrink: 1;
}

:deep(.umo-back-top) {
  position: absolute;
  &:hover {
    opacity: 0.9;
    background-color: var(--umo-color-white) !important;
    .umo-back-top__icon {
      color: var(--umo-primary-color);
    }
  }
}
</style>
