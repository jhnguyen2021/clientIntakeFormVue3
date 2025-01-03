<template>
	<div class="bg-white dark__bg-1000 rounded-2 py-2">
		<!-- <a class="dropdown-item fw-bold text-warning" href="#!">
			<font-awesome-icon icon='crown' class="me-1"/>
			<span>Go Pro</span>
		</a> -->

		<!-- <div class="dropdown-divider"></div>
		<a class="dropdown-item" href="#!">Set status</a> -->
		<a class="dropdown-item"><router-link to="/user">Profile &amp; account </router-link></a>
		<!-- <a class="dropdown-item" href="#!">Feedback</a> -->

		<div class="dropdown-divider"></div>
		<!-- <a class="dropdown-item" href="pages/user/settings.html">Settings</a> -->
		<a class="dropdown-item"><router-link to="/logout">Logout</router-link></a>
	</div>
</template>
