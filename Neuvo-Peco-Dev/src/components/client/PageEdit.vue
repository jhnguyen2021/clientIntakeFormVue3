<script setup lang="ts">
import AppTabs from '@/components/AppTabs.vue'
import WidgetSectionTitle from '@/components/widgets/WidgetSectionTitle.vue'

</script>
<template>
    <div class="container">
        <div class="col-lg-6 col-xl-12 col-xxl-6 h-100">
            <WidgetSectionTitle title="New Client Intake" icon="spinner" />
        </div>
        <div class="card theme-wizard mb-5">
            <AppTabs />
        </div>
    </div>
</template>
