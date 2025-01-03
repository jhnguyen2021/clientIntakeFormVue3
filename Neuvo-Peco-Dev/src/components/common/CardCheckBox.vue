<script setup lang="ts">

defineProps<{
    label: string
    checkBoxDisplay: boolean
}>()

</script>
<template>
    <div v-if="checkBoxDisplay">
        <div class="form-check form-switch">
            <input class="form-check-input" name="hasW9" id="flexSwitchCheckChecked" type="checkbox" :value="true" />
            <label class="form-check-label" for="hasW9">&nbsp;&nbsp;{{ label }}</label>
        </div>
    </div>
</template>