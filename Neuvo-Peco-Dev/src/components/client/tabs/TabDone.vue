<script setup lang="ts">
</script>

<template>
	<div class="text-center px-sm-3 px-md-5" role="tabpanel" aria-labelledby="bootstrap-wizard-tab4"
		id="bootstrap-wizard-tab4">
		<div class="wizard-lottie-wrapper">
			<div class="lottie wizard-lottie mx-auto my-3"
				data-options='{"path":"../../assets/img/animated-icons/celebration.json"}'></div>
		</div>
		<h4 class="mb-1">Thank you for submitting your new client intake!</h4>
		<p>Contracting will review your submission for entry into the system.</p>
		<router-link to="/client"><button class="btn btn-primary px-5 my-3" type="submit">Submit Another Client
				Intake</button></router-link>
	</div>
</template>


<style scoped>
@media (max-width: 450px) {
	.row g-2 {
		display: block;
	}

	.col-6 {
		width: 100%;
	}

}
</style>