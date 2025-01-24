<script setup>
  import { ref, toRefs, watch, onMounted } from 'vue'

  const props = defineProps({
    content: {
      type: String,
      default: '',
    },
  })
  const emit = defineEmits(['update:content'])

  const { content } = toRefs(props)
  const myQuillEditor = ref(null)
  const text = ref('')

  const toolbarOptions = [
    // 標題-----[{ header: [1, 2, 3, 4, 5, 6, false] }]
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    // 粗體 斜體 底線 刪除線 連結 -----['bold', 'italic', 'underline', 'strike', 'link']
    ['bold', 'italic', 'underline', 'strike', 'link'],
    // 字體顏色、字體背景顏色-----[{ color: [] }, { background: [] }]
    [{ color: [] }, { background: [] }],
    // 引用  程式碼-----['blockquote', 'code-block']
    // ['blockquote', 'code-block'],
    // 1、2 級標題-----[{ header: 1 }, { header: 2 }]
    // [{ header: 1 }, { header: 2 }],
    // 有序、無序列表-----[{ list: 'ordered' }, { list: 'bullet' }]
    [{ list: 'ordered' }, { list: 'bullet' }],
    // 上標/下標-----[{ script: 'sub' }, { script: 'super' }]
    // [{ script: 'sub' }, { script: 'super' }],
    // 縮排-----[{ indent: '-1' }, { indent: '+1' }]
    // [{ indent: '-1' }, { indent: '+1' }],
    // 文本方向-----[{'direction': 'rtl'}]
    // [{ direction: 'rtl' }],
    // 字體大小-----[{ size: ['small', false, 'large', 'huge'] }]
    // [{ size: ['small', false, 'large', 'huge'] }],
    // 字體種類-----[{ font: [] }]
    // [{ font: [] }],
    // 對齊方式-----[{ align: [] }]
    [{ align: [] }],
    // 清除文本格式-----['clean']
    // ['clean'],
    // 連結、圖片、視頻-----['link', 'image', 'video']
    // ['link', 'image'],
  ]

  const clean = () => {
    text.value = ''

    myQuillEditor.value.setText('')
  }
  const set = (value) => {
    text.value = value
  }

  defineExpose({
    clean,
    set,
  })

  watch(text, (value) => emit('update:content', value))

  onMounted(async () => {
    text.value = content.value
  })
</script>

<template>
  <QuillEditor
    v-model:content="text"
    :toolbar="toolbarOptions"
    ref="myQuillEditor"
    contentType="html"
    theme="snow"
  />
</template>

<style lang="scss" scoped>

</style>
