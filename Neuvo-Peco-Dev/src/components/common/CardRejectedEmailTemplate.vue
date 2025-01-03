<script setup lang="ts">
defineProps<{
    rejectionNotes: string
    linkToForm: string

}>()

</script>

<template>
    <div>{{ rejectionNotes }} <a :href="linkToForm">{{ linkToForm }}</a></div>
</template>