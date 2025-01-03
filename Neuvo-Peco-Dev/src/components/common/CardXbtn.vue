<script setup lang="ts">

defineProps<{
    displayXbtn: boolean
}>()

defineEmits(["deleteComponent"])


</script>
<template>
    <div v-if="displayXbtn" class="col-6">
        <div class="mb-3">
            <div @click="$emit('deleteComponent')" style="float:right;" class="btn-close-falcon"></div>
        </div>
    </div>
</template>