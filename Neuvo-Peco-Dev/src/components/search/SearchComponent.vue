<script lang="ts" setup>
defineProps({
	placeholder: String
})

</script>
<template>
	<div class="search-box">
		<form class="position-relative" data-bs-toggle="search" data-bs-display="search">
			<input class="form-control search-input fuzzy-search" type="search" :placeholder="placeholder"
				aria-label="Search" />
			<font-awesome-icon icon="search" class="search-box-icon" />
		</form>
	</div>
</template>