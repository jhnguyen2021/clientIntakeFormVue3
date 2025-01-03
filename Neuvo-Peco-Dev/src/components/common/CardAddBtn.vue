<script setup lang="ts">

defineProps<{
    cardName: string
    btnDisplay: boolean
}>()

</script>

<template>
    <div v-if="btnDisplay" class="px-3" style="cursor: pointer;padding-top: 10px;padding-bottom: 30px;">
        <font-awesome-icon :icon="['fas', 'circle-plus']" /><span style="margin-left:7px;">{{ cardName }}
        </span>
    </div>
</template>