<template>
  <div v-if="items.length > 0" class="umo-popup umo-mention-popup">
    <div class="umo-popup__content umo-dropdown">
      <div class="umo-dropdown__menu" style="padding: 0px; max-height: 320px">
        <div>
          <li
            v-for="(item, index) in items"
            :key="index"
            class="umo-dropdown__item umo-dropdown__item--theme-default umo-dropdown__item gap-1"
            :class="{ 'umo-dropdown__item--active': index === selectedIndex }"
            @click="selectItem(index)"
          >
            <img
              class="rounded-full size-8"
              src="https://avatars0.githubusercontent.com/u/970828?s=60&v=4"
            />
            <div class="flex flex-col justify-between items-baseline">
              <div class="text-sm leading-[16px] font-normal text-[#171717]">
                {{ item.label }}
              </div>
              <div
                class="text-[10px] leading-[16px] font-normal text-[#6C6C89]"
              >
                UI/UX Designer
              </div>
            </div>
          </li>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  command: {
    type: Function,
    required: true,
  },
})

let selectedIndex = $ref(0)

watch(
  () => props.items,
  () => {
    selectedIndex = 0
  },
)

const onKeyDown = ({ event }: any) => {
  if (event.key === 'ArrowUp') {
    upHandler()
    return true
  }

  if (event.key === 'ArrowDown') {
    downHandler()
    return true
  }

  if (event.key === 'Enter') {
    if (props.items.length === 0) {
      return false
    }
    enterHandler()
    return true
  }

  return false
}

const upHandler = () => {
  selectedIndex = (selectedIndex + props.items.length - 1) % props.items.length
}

const downHandler = () => {
  selectedIndex = (selectedIndex + 1) % props.items.length
}

const enterHandler = () => {
  selectItem(selectedIndex)
}

const selectItem = (index: number) => {
  const item = props.items[index]

  if (item) {
    props.command(item)
  }
}

defineExpose({
  onKeyDown,
})
</script>

<style lang="less">
.umo-node-mention {
  box-decoration-break: clone;
  color: var(--umo-primary-color);
  padding: 0.1em 0.2em;
  margin: 0 0.1em;
  border-radius: 0.2em;
  white-space: nowrap;
  cursor: default;
}
.umo-mention-popup {
  .umo-dropdown {
    &__item--active {
      font-weight: 600;
    }
  }
  &-empty {
    padding: 3px 5px;
    min-width: 100px;
    color: var(--umo-text-color-light);
  }
}
</style>
