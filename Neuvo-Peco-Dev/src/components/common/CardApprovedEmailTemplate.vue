<script setup lang="ts">
defineProps<{
    cardCode: string
}>()

</script>

<template>
    <div>Business Partner Created in SAP B1 Client Card Code: <b>{{ cardCode }}</b>
    </div>
</template>
