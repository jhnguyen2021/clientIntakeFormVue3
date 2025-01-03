<script setup lang="ts">
import { estimates } from '../../data/sampleEstimates'
import AppTable from '@/components/AppTable.vue'

const columns = [
    { name: 'Id', data: 'Id' },
    { name: 'Name', data: 'Name' },
    { name: 'Date', data: 'Date' },
    { name: 'Amount', data: 'Amount' },
    { name: 'Status ', data: 'Status' },
]

</script>

<template>
    <AppTable title="Estimates" :columns="columns" :records="estimates" :canEdit="false" :canApprove="false" />
</template>