<template>

    <div v-if="type === 'drawer'">
        <v-list nav>
            <v-list-item v-for="(item, i) in menuOptions"
                         :key="i"
                         :active="i === 0"
                         link
                         :title="item.text"
                         :to="item.to" />
        </v-list>
    </div>
    <div v-if="type === 'top-nav'">
        <v-btn v-for="(item, i) in menuOptions"
               :key="i"
               class="mr-2 text-none"
               slim
               v-bind="item" />
        <v-spacer />
    </div>
</template>

<script setup lang="ts">
import { menuOptions } from '../utils/layout'

const props = defineProps<{
    type: 'drawer' | 'top-nav'
}>()

</script>