<script setup lang="ts">
import { quotes } from '../../data/sampleQuotes'
import AppTable from '@/components/AppTable.vue'

const columns = [
    { name: 'Id', data: 'Id' },
    { name: 'Name', data: 'Name' },
    { name: 'Date', data: 'Date' },
    { name: 'Amount', data: 'Amount' },
    { name: 'Status ', data: 'Status' },
    { name: 'Customer', data: 'Customer' },
]
</script>

<template>
    <AppTable title="Quotes" :columns="columns" :records=quotes :canEdit="false" :canApprove="false" />
</template>