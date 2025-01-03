<script setup lang="ts">
//import { ref } from 'vue'
import { notificationService } from '@/services/notificationService'

notificationService.getAllMessages()
//const notifications = ref(notificationService.getUnread())

</script>

<template>
    <a class="nav-link  px-0" id="navbarDropdownNotification" role="button" data-bs-toggle="dropdown" aria-haspopup="true"
        aria-expanded="false" data-hide-on-body-scroll="data-hide-on-body-scroll">
        <font-awesome-icon icon="bell" transform="shrink-6" style="font-size: 33px" />
        <!-- <span class="fas fa-bell" data-fa-transform="shrink-6" style="font-size: 33px"></span> -->
    </a>
    <div class="dropdown-menu dropdown-caret dropdown-caret dropdown-menu-end dropdown-menu-card dropdown-menu-notification dropdown-caret-bg"
        aria-labelledby="navbarDropdownNotification">
        <div class="card card-notification shadow-none">
            <div class="card-header">
                <div class="row justify-content-between align-items-center">
                    <div class="col-auto">
                        <h6 class="card-header-title mb-0">Notifications</h6>
                    </div>
                    <!-- <div class="col-auto ps-0 ps-sm-3">
                        <a class="card-link fw-normal" href="#">Mark all as read</a>
                    </div> -->
                </div>
            </div>
            <div class="scrollbar-overlay" style="max-height: 19rem">
                <div class="list-group list-group-flush fw-normal fs--1">
                    <div class="list-group-title border-bottom">{{ }}</div>
                    <!-- <div class="list-group-item" v-for="notices in notifications" :key="notices.id">
                        <a class="notification notification-flush notification-unread" href="#!">
                            <div class="notification-avatar">
                                <div class="avatar avatar-2xl me-3">
                                    <div class="avatar-name rounded-circle"><span>AB</span></div>
                                </div>
                            </div>
                            <div class="notification-body">
                                <p class="mb-1">
                                    {{ notices.message }}
                                </p>
                                <span class="notification-time"><span class="me-2" role="img" aria-label="Emoji">💬</span>{{
                                    notices.dateClassify() }}</span>
                            </div>
                        </a>
                    </div> -->
                    <!-- <div class="list-group-item">
                        <a class="notification notification-flush notification-unread" href="#!">
                            <div class="notification-avatar">
                                <div class="avatar avatar-2xl me-3">
                                    <div class="avatar-name rounded-circle"><span>AB</span></div>
                                </div>
                            </div>
                            <div class="notification-body">
                                <p class="mb-1">
                                    <strong>Albert Brooks</strong> reacted to
                                    <strong>Mia Khalifa's</strong> status
                                </p>
                                <span class="notification-time"><span
                                        class="me-2 fab fa-gratipay text-danger"></span>9hr</span>
                            </div>
                        </a>
                    </div>
                    <div class="list-group-title border-bottom">EARLIER</div>
                    <div class="list-group-item">
                        <a class="notification notification-flush" href="#!">
                            <div class="notification-avatar">
                                <div class="avatar avatar-2xl me-3">
                                    <img class="rounded-circle" src="@/assets/img/icons/weather-sm.jpg" alt="" />
                                </div>
                            </div>
                            <div class="notification-body">
                                <p class="mb-1">
                                    The forecast today shows a low of 20&#8451; in California. See today's
                                    weather.
                                </p>
                                <span class="notification-time"><span class="me-2" role="img"
                                        aria-label="Emoji">🌤️</span>1d</span>
                            </div>
                        </a>
                    </div>
                    <div class="list-group-item">
                        <a class="border-bottom-0 notification-unread notification notification-flush" href="#!">
                            <div class="notification-avatar">
                                <div class="avatar avatar-xl me-3">
                                    <img class="rounded-circle" src="@/assets/img/logos/oxford.png" alt="" />
                                </div>
                            </div>
                            <div class="notification-body">
                                <p class="mb-1">
                                    <strong>University of Oxford</strong> created an event : "Causal Inference
                                    Hilary 2019"
                                </p>
                                <span class="notification-time"><span class="me-2" role="img"
                                        aria-label="Emoji">✌️</span>1w</span>
                            </div>
                        </a>
                    </div>
                    <div class="list-group-item">
                        <a class="border-bottom-0 notification notification-flush" href="#!">
                            <div class="notification-avatar">
                                <div class="avatar avatar-xl me-3">
                                    <img class="rounded-circle" src="@/assets/img/team/10.jpg" alt="" />
                                </div>
                            </div>
                            <div class="notification-body">
                                <p class="mb-1">
                                    <strong>James Cameron</strong> invited to join the group: United Nations
                                    International Children's Fund
                                </p>
                                <span class="notification-time"><span class="me-2" role="img"
                                        aria-label="Emoji">🙋‍</span>2d</span>
                            </div>
                        </a>
                    </div> -->
                </div>
            </div>
            <!-- <div class="card-footer text-center border-top">
                <a class="card-link d-block" href="app/social/notifications.html">View all</a>
            </div> -->
        </div>
    </div>
</template>