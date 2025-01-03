<script lang="ts" setup>
import SearchComponent from '@/components/search/SearchComponent.vue';
</script>
<template>
	<ul class="navbar-nav align-items-center d-none d-lg-block">
		<li class="nav-item">
			<SearchComponent placeholder="Search..." />
		</li>
	</ul>
</template>