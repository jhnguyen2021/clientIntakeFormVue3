<script setup lang="ts">
defineProps({
	title: String,
	subtitle: String,
	icon: String,
	transform: String
})
</script>
<template>
	<div class="d-flex mb-4">
		<span class="fa-stack me-2 ms-n1">
			<font-awesome-icon icon="circle" class="fa-stack-2x text-300"></font-awesome-icon>
			<font-awesome-icon
				:icon="icon"
				:transform="transform"
				class="fa-inverse fa-stack-1x text-primary"
			></font-awesome-icon>
		</span>
		<div class="col">
			<h5 class="mb-0 text-primary position-relative">
				<span class="bg-200 dark__bg-1100 pe-3">{{ title }}</span>
				<span class="border position-absolute top-50 translate-middle-y w-100 start-0 z-n1"></span>
			</h5>
			<p class="mb-0">{{ subtitle }}</p>
		</div>
	</div>
</template>
