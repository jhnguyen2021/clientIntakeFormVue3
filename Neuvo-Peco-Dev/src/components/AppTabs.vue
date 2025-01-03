<script setup lang="ts">
import { computed, type Ref, type ComputedRef } from 'vue'
import { useRouter, RouterView, RouterLink, type RouteLocationRaw, type RouteRecordRaw, type RouteRecordName, type TabRouteMeta } from 'vue-router'
import submitBtn from "@/components/common/CardSubmitBtn.vue";
import useVuelidate from "@vuelidate/core";
import { useClientStore } from '@/stores/clientStore'
import { toast } from 'vue3-toastify';


//Use childern routes for the tabs
const router = useRouter()

const clientStore = useClientStore()


const currentRoute: Ref<RouteRecordName | null | undefined> = computed(() => {
    return router.currentRoute.value.name
})

const tabs: Ref<RouteRecordRaw[] | undefined> = computed(() => {
    if (!router.options.routes) return undefined
    let routes = router.options.routes
    if (!currentRoute.value) return undefined
    return findSiblingRoutes(routes, currentRoute.value)
})


// const btnSave = computed(() => {
//     return saveBtn
// })

// const btnSubmit = computed(() => {
//     return submitBtn
// })

function findSiblingRoutes(routes: readonly RouteRecordRaw[] | undefined, currentRoute: RouteRecordName, parentRoute: RouteRecordRaw | undefined = undefined): RouteRecordRaw[] {
    let siblings: RouteRecordRaw[] = [];
    if (!routes) return siblings;
    for (let key in routes) {
        if (typeof routes[key] === "object" && routes[key] !== null) {
            siblings = siblings.concat(findSiblingRoutes(routes[key].children, currentRoute, routes[key]));
        }
        if (routes[key].name === currentRoute && parentRoute !== undefined) {
            siblings = siblings.concat(routes[key]);
            siblings = siblings.concat(routes.filter(k => k.name !== currentRoute));
        }
    }
    return siblings.sort((a, b) => (a.meta as TabRouteMeta).tabNumber - (b.meta as TabRouteMeta).tabNumber);
}

const tabIndex: Ref<number> = computed(() => {
    if (!tabs.value) return -1;
    return tabs.value.findIndex((t: RouteRecordRaw) => t.name === currentRoute.value);
});

const prevRoute: Ref<RouteLocationRaw | undefined> = computed(() => {
    if (!tabs.value) return undefined;
    const route: RouteRecordRaw = tabs.value[tabIndex.value - 1];
    return route //&& { name: route.name };
});

const nextRoute: Ref<RouteLocationRaw | undefined> = computed(() => {
    if (!tabs.value) return undefined;
    const route: RouteRecordRaw = tabs.value[tabIndex.value + 1];
    return route // && { name: route.name };
});

const formId: ComputedRef<number> = computed(() => parseInt(router.currentRoute.value.params.id.toString()))
const currentForm = computed(() => {
    return clientStore.clientForms.filter((form) => form.id === formId.value)[0]
})

function hasDuplicate(arr: string[]) {
    return new Set(arr).size !== arr.length;
}

const v$ = useVuelidate({}, currentForm.value)

const validateForm = async () => {

    const result = await v$.value.$validate();

    if (result) {
        const compareContact: string[] = [];
        currentForm.value.contacts.forEach((contact) => {
            compareContact.push(contact.firstName)
        });
        if ((hasDuplicate(compareContact))) {
            toast.error("Client,AP/Billing contacts cannot be the same", {
                position: toast.POSITION.TOP_CENTER,
                "theme": "colored",
                "transition": "flip",
            });
            return
        }
    } else {

        toast.error("Required fields are missing:", {
            position: toast.POSITION.TOP_RIGHT,
            "theme": "colored",
            "transition": "flip",
        });


        toast.error(
            v$.value.$errors.map((item) => {
                return item.$message;
            }).join('\n'), {
            position: toast.POSITION.TOP_RIGHT,
            "theme": "colored",
            "transition": "flip",
        });
    }
}


</script>

<template>
    <div class="card-header bg-body-tertiary pt-3 pb-2" v-if="tabs">
        <ul class="nav justify-content-between nav-wizard">
            <li class="nav-item" v-for="tab in tabs" :key="tab.name">
                <!--<RouterLink class="nav-link fw-semi-bold" @click="validateTabs(tab.meta?.tabNumber)"-->
                <RouterLink class="nav-link fw-semi-bold"
                    :class="{ done: (tab.meta as TabRouteMeta).tabNumber < tabIndex, active: (tab.meta as TabRouteMeta).tabNumber === tabIndex }"
                    :to="tab">
                    <span class="nav-item-circle-parent">
                        <span class="nav-item-circle">
                            <font-awesome-icon :icon="['fas', tab.meta?.tabIcon]" />
                        </span>
                    </span>
                    <span class="d-none d-md-block mt-1 fs--1">{{ tab.meta?.tabLabel }}</span>
                </RouterLink>
            </li>
        </ul>
    </div>
    <div class="card-body py-4">
        <div class="tab-content">
            <RouterView v-slot="{ Component }">
                <Transition name="fade" mode="out-in">
                    <component :is="Component" />
                </Transition>
            </RouterView>
        </div>
    </div>
    <div class="card-footer bg-body-tertiary">
        <div class="px-sm-3 px-md-6">
            <ul class="pager wizard list-inline mb-0">
                <li class="previous">
                    <RouterLink v-if="prevRoute" :to="prevRoute">
                        <button class="btn btn-primary px-5 px-sm-6" type="submit">
                            <font-awesome-icon :icon="['fas', 'chevron-left']" class="me-2" transform="shrink-3" />Prev
                        </button>
                    </RouterLink>
                </li>

                <li id="bigBtn" class="next">
                    <submitBtn :FormValid="v$" :btnName="'Save'" />
                </li>
                <li class="next">
                    <RouterLink v-if="nextRoute" :to="nextRoute">
                        <button v-if="nextRoute" class="btn btn-primary px-5 px-sm-6" type="submit">
                            Next<font-awesome-icon :icon="['fas', 'chevron-right']" class="ms-2" transform="shrink-3" />
                        </button>
                    </RouterLink>
                    <submitBtn v-else @click="validateForm" :FormValid="v$" :btnName="'Submit'" />
                </li>
            </ul>


        </div>
        <div id="littleBtn">
            <submitBtn :FormValid="v$" :btnName="'Save'" />
        </div>
    </div>
</template>


<style scoped>
.btn-primary {
    font-size: 0.875rem;
}

#bigBtn {
    display: block;
}

#littleBtn {
    display: none;
}

@media (max-width: 450px) {
    #bigBtn {
        display: none;
    }

    #littleBtn {
        padding-top: 10px;
        margin-left: 29%;
        display: block;
    }
}
</style>