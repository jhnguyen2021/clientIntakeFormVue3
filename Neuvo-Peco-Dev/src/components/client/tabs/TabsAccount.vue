<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
const client = useUserStore() as any;
</script>

<template>
	<div class="px-sm-3 px-md-5">
		<form novalidate="true" data-wizard-form="1">
			<div class="mb-3">
				<label class="form-label" for="bootstrap-wizard-wizard-name">Name</label>
				<input class="form-control" type="text" name="name" placeholder="John Smith"
					id="bootstrap-wizard-wizard-name" v-model="client.name" />
			</div>
			<div class="mb-3">
				<label class="form-label" for="bootstrap-wizard-wizard-email">Email*</label>
				<input class="form-control" type="email" name="email" placeholder="Email address"
					pattern="^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$" required="true"
					id="bootstrap-wizard-wizard-email" data-wizard-validate-email="true" v-model="client.email" />
				<div class="invalid-feedback">You must add email</div>
			</div>
			<div class="row g-2">
				<div class="col-6">
					<div class="mb-3">
						<label class="form-label" for="bootstrap-wizard-wizard-password">Password*</label>
						<input class="form-control" type="password" name="password" placeholder="Password" required="true"
							id="bootstrap-wizard-wizard-password" data-wizard-password="true" v-model="client.password" />
						<div class="invalid-feedback">Please enter password</div>
					</div>
				</div>
				<div class="col-6">
					<div class="mb-3">
						<label class="form-label" for="bootstrap-wizard-wizard-confirm-password">Confirm Password*</label>
						<input class="form-control" type="password" name="confirmPassword" placeholder="Confirm Password"
							required="true" id="bootstrap-wizard-wizard-confirm-password"
							data-wizard-confirm-password="true" v-model="client.passwordConfirm" />
						<div class="invalid-feedback">Passwords need to match</div>
					</div>
				</div>
			</div>
			<div class="form-check">
				<input class="form-check-input" type="checkbox" name="terms" required="true" checked="true"
					id="bootstrap-wizard-wizard-checkbox" v-model="client.privacyPolicy" />
				<label class="form-check-label" for="bootstrap-wizard-wizard-checkbox">I accept the <a href="#!">terms
					</a>and <a href="#!">privacy policy</a></label>
			</div>
		</form>
	</div>
</template>