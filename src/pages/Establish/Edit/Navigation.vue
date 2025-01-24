<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRoute, useRouter } from 'vue-router'

  const route = useRoute()
  const router = useRouter()
  const { t: $t } = useI18n()

  const isListProduct = computed(() => 'listProduct' === route.name)
  const isAddProduct = computed(() => 'addProduct' === route.name)
  const isCategories = computed(() => 'categories' === route.name)
  const isImages = computed(() => 'images' === route.name)
  const isTags = computed(() => 'tags' === route.name)

  const opened = ref([])
  const navigation = ref([
    {
      text: $t('Products'),
      icon: 'mdi-database',
      children: [
        {
          text: $t('List'),
          active: isListProduct,
          label: 'listProduct',
        },
        {
          text: $t('Add'),
          active: isAddProduct,
          label: 'addProduct',
        },
        {
          text: $t('Categories'),
          active: isCategories,
          label: 'categories',
        },
        {
          text: $t('Tags'),
          active: isTags,
          label: 'tags',
        },
      ]
    },
    {
      text: $t('Images'),
      active: isImages,
      icon: 'mdi-image',
      label: 'images',
    },
  ])

  const onLinkClick = (name) => router.push({ name })

  onMounted(() => {
    if (route.name === 'establishEdit') router.push({ name: 'listProduct' })

    // const defaultProducts = ['establishEdit', 'listProduct', 'addProduct', 'categories', 'tags'].includes(route.name)

    // opened.value = defaultProducts ? ['products'] : []
    opened.value = ['products']
  })
</script>

<template>
  <v-list class="text-left pa-0" v-model:opened="opened">
    <template v-for="page in navigation">
      <v-list-group value="products"
        v-if="page.children?.length"
      >
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            class="h-60"
            link
          >
            <template v-slot:prepend>
              <v-icon :icon="page.icon"></v-icon>
            </template>
            <template v-slot:title>
              <span
                :title="page.text"
                class="text-18"
              >{{ page.text }}</span>
            </template>
          </v-list-item>
        </template>
        <v-list-item
          v-for="sub in page.children"
          :title="sub.text"
          :active="sub.active"
          @click="onLinkClick(sub.label)"
          class="h-40"
          link
        ></v-list-item>
      </v-list-group>
      <v-list-item
        v-else
        :active="page.active"
        @click="onLinkClick(page.label)"
        class="h-60"
        link
      >
        <template v-slot:prepend>
          <v-icon :icon="page.icon"></v-icon>
        </template>
        <template v-slot:title>
          <span
            :title="page.text"
            class="text-18"
          >{{ page.text }}</span>
        </template>
      </v-list-item>
    </template>
  </v-list>
</template>

<style lang="scss" scoped>
.h-60 {
  height: 60px;
}
.h-40 {
  height: 40px;
}
.text-18 {
  font-size: 18px;
}
.border-right {
  border-right-color: rgba(var(--v-border-color), var(--v-border-opacity));
  border-right-style: solid;
  border-right-width: thin;
}
</style>
