<script setup lang="ts">
import { library } from '@fortawesome/fontawesome-svg-core'
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
// import config so we can set a default style
import { config } from '@fortawesome/fontawesome-svg-core'
/* import specific icons */
import {
    faFileInvoice,
    faHome,
} from '@fortawesome/free-solid-svg-icons'
/* add icons to the library */
library.add(
    faFileInvoice,
    faHome
)
config.styleDefault = 'solid'

defineEmits(["SaveForm", "ExitForm"]);


</script>

<template>
    <div style="display:table;" class="container">
        <span>Changes you made may not be saved?</span>&nbsp;&nbsp;
        <div>
            <button @click="$emit('SaveForm')">
                <font-awesome-icon :icon="['fas', 'file-invoice']" /><span>
                    SAVE
                    FORM
                </span>
            </button>
        </div>
        <div>
            <button @click="$emit('ExitForm')">
                <font-awesome-icon :icon="['fas', 'home']" /><span>
                    EXIT
                </span>
            </button>
        </div>
    </div>
</template>

<style>
button {
    background: none;
    color: inherit;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
    outline: inherit;
}
</style>
  
