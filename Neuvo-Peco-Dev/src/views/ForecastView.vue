<script setup lang="ts">
// import { default as records } from '../../data/sampleEstimates'
import AppTable from '@/components/AppTable.vue'

const columns = [
	{ name: 'Subjob Number', data: 'Subjob Number' },
	{ name: 'Sales Site / Primary Build Site', data: 'Sales Site / Primary Build Site' },
	{ name: 'Sales Site / Primary Build Site', data: 'salesSite' },
	{ name: 'Salesperson', data: 'Salesperson' },
	{ name: 'Client ', data: 'Client' },
	{ name: 'Project Name', data: 'Project Name' },
	{ name: 'Actions', data: 'Actions' }
]
</script>

<template>
	<AppTable title="Forecast" :columns="columns" :records=[] :canEdit="false" :canApprove="false" />
</template>