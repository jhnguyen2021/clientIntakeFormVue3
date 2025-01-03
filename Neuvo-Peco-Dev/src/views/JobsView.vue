<script setup lang="ts">
import { jobs } from '../../data/sampleJobs'
import AppTable from '@/components/AppTable.vue'

const columns = [
    { name: 'Job Number', data: 'Job Number' },
    { name: 'Subjob Number', data: 'Subjob Number' },
    { name: 'Sales Site / Primary Build Site', data: 'Sales Site / Primary Build Site' },
    { name: 'Salesperson', data: 'Salesperson' },
    { name: 'Client ', data: 'Client' },
    { name: 'Project Name', data: 'Project Name' },
    { name: 'Actions', data: 'Actions' },
]
</script>

<template>
    <AppTable title="Jobs" :columns="columns" :records="jobs" :canEdit="false" :canApprove="false" />
</template>