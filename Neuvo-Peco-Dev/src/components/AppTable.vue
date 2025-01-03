<script setup lang="ts">
import { ref, computed, type Ref } from 'vue'
import _ from 'lodash'

const props = defineProps<({
    columns: { name: string, data: string }[],
    records: {}[],
    title: String,
    canEdit: Boolean,
    canApprove: Boolean
})>()


const reverse: Ref<Boolean> = ref(false)
const sortKey: Ref<string> = ref(props.columns[0].name)

function sortBy(key: string) {
    reverse.value = (sortKey.value == key) ? !reverse.value : false;
    sortKey.value = key;
}
const orderedRecords: Ref<any> = computed(() => {
    if (reverse.value) {
        return _.orderBy(props.records, sortKey.value, 'desc')
    } else {
        return _.orderBy(props.records, sortKey.value, 'asc')
    }
})
const displayHeaders = computed(() => {
    if (props.title != 'Clients') {
        return true
    } else {
        return false
    }
})

defineEmits(["setFormData", "routeApproveForm", "selectedID"])

</script>

<template>
    <div class="card" data-list>
        <div v-if="displayHeaders" class="card-header bg-body-tertiary">
            <h3 class="mb-0">{{ title }}</h3>
        </div>
        <div class="card-body">
            <div class="table-responsive scrollbar">
                <table class="table table-sm table-hover table-striped mb-0 fs--1">
                    <thead class="bg-200">
                        <tr>
                            <th v-for="column in columns" :key="column.data" @click="sortBy(column.data)"
                                :class="column.data === sortKey ? reverse ? 'desc' : 'asc' : ''" class="text-900 sort"
                                data-sort>
                                {{ column.name }}</th>
                            <th v-if="canEdit" class="text-900 sort pe-1 align-middle white-space-nowrap tableAction">
                                Edit</th>
                            <th v-if="canApprove"
                                class="text-900 sort pe-1 align-middle white-space-nowrap tableAction">
                                Approve</th>
                        </tr>
                    </thead>
                    <tbody class="list">
                        <tr v-for="record in  orderedRecords " :key="record" @click="$emit('selectedID', record.id)">
                            <td v-for="column in  columns" :key="column.data"><span :class="{
            'badge rounded-pill badge-subtle-danger': record.status == 'Error' && column.data === 'status',
            'badge rounded-pill badge-subtle-warning': record.status == 'Rejected' && column.data === 'status',
            'badge rounded-pill badge-subtle-info': record.status == 'Saved' && column.data === 'status' || record.status == 'Submitted' && column.data === 'status',
            'badge rounded-pill badge-subtle-success': record.status == 'Approved' && column.data === 'status',
        }">{{ record[column.data] }} </span></td>

                            <td @click="$emit('setFormData', record.id)" v-if="canEdit"
                                class="align-middle white-space-nowrap name pointer tableAction">
                                <font-awesome-icon v-if="record.status != 'Approved'"
                                    :icon="['fas', 'pen-to-square']" />
                            </td>

                            <td @click="$emit('routeApproveForm', record.id)" v-if="canApprove"
                                class="align-middle white-space-nowrap name pointer tableAction">
                                <font-awesome-icon v-if="record.status != 'Approved'" :icon="['fas', 'thumbs-up']" />
                            </td>
                        </tr>

                    </tbody>
                </table>
            </div>
        </div>
        <div v-if="displayHeaders" class="card-footer bg-body-tertiary">
            <button class="btn btn-sm btn-ghost-secondary" type="button">View All</button>
        </div>
    </div>
</template>
