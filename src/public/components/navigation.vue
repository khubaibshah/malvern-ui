<template>
    
    <div :class="'bg-' + backgroundColor + '-500 py-3 px-6 shadow-2 flex align-items-center justify-content-between relative lg:static'" style="min-height: 84px">

    <!-- <img src="images/blocks/logos/bastion-300.svg" alt="Image" height="40" class="mr-0 lg:mr-6"> -->
    <i class="pi pi-spin pi-cog" style="font-size: 2rem"></i>
    <a v-ripple :class="'cursor-pointer block lg:hidden text-' + backgroundColor + '-100 mt-1 p-ripple'"
        v-styleclass="{ selector: '@next', enterClass: 'hidden', leaveToClass: 'hidden', hideOnOutsideClick: true }">
        <i class="pi pi-bars text-4xl"></i>
    </a>
    <div :class="'align-items-center flex-grow-1 justify-content-between hidden lg:flex absolute lg:static w-full bg-' + backgroundColor + '-500 left-0 top-100 z-1 shadow-2 lg:shadow-none'">
        <ul class="list-none p-0 m-0 flex lg:align-items-center select-none flex-column lg:flex-row">
            <li>
                <a v-ripple 
                @click="router.push({name: 'home'})"
                :class="'flex px-6 p-3 lg:px-3 lg:py-2 align-items-center text-' + backgroundColor + '-100 hover:text-' + backgroundColor + '-50 hover:bg-' + backgroundColor + '-600 font-medium border-round cursor-pointer transition-colors transition-duration-150 p-ripple'">
                    <i class="pi pi-home mr-2"></i>
                    <span>Home</span>
                </a>
            </li>
            <li>
                <a v-ripple 
                @click="router.push({name: 'scscars'})"
                :class="'flex px-6 p-3 lg:px-3 lg:py-2 align-items-center text-' + backgroundColor + '-100 hover:text-' + backgroundColor + '-50 hover:bg-' + backgroundColor + '-600 font-medium border-round cursor-pointer transition-colors transition-duration-150 p-ripple'">
                    <i class="pi pi-car mr-2"></i>
                    <span>SCS Cars</span>
                </a>
            </li>
            <li>
                <a v-ripple :class="'flex px-6 p-3 lg:px-3 lg:py-2 align-items-center text-' + backgroundColor + '-100 hover:text-' + backgroundColor + '-50 hover:bg-' + backgroundColor + '-600 font-medium border-round cursor-pointer transition-colors transition-duration-150 p-ripple'"
                    v-styleclass="{ selector: '#customers-dropdown', enterClass: 'hidden', enterActiveClass: 'scalein', leaveToClass: 'hidden', leaveActiveClass: 'fadeout', hideOnOutsideClick: true }">
                    <i class="pi pi-car mr-2"></i>
                    <span>Customers</span>
                    <i class="pi pi-angle-down ml-auto lg:ml-3"></i>
                </a>
                <ul class="list-none py-3 px-6 m-0 lg:px-0 lg:py-0 border-round shadow-0 lg:shadow-2 lg:absolute lg:border-1 border-50 surface-overlay hidden origin-top w-full lg:w-15rem cursor-pointer" id="customers-dropdown">
                    <li>
                        <a v-ripple class="flex p-3 align-items-center text-600 hover:text-900 hover:surface-100 transition-colors transition-duration-150 p-ripple">
                            <i class="pi pi-user-plus mr-2"></i>
                            <span class="font-medium">Add New</span>
                        </a>
                    </li>
                    <li class="relative">
                        <a v-ripple class="flex p-3 align-items-center text-600 hover:text-900 hover:surface-100 transition-colors transition-duration-150 p-ripple"
                            v-styleclass="{ selector: '@next', enterClass: 'hidden', enterActiveClass: 'scalein', leaveToClass: 'hidden', leaveActiveClass: 'fadeout', hideOnOutsideClick: true }">
                            <i class="pi pi-search mr-2"></i>
                            <span class="font-medium">Search</span>
                            <i class="pi pi-angle-down ml-auto lg:-rotate-90"></i>
                        </a>
                        <ul class="list-none py-3 pl-3 m-0 lg:px-0 lg:py-0 border-round shadow-0 lg:shadow-2 lg:absolute lg:border-1 border-50 surface-overlay hidden origin-top w-full lg:w-15rem cursor-pointer left-100 top-0">
                            <li>
                                <a v-ripple class="flex p-3 align-items-center text-600 hover:text-900 hover:surface-100 transition-colors transition-duration-150 p-ripple">
                                    <i class="pi pi-shopping-cart mr-2"></i>
                                    <span class="font-medium">Purchases</span>
                                </a>
                            </li>
                            <li class="relative">
                                <a v-ripple class="flex p-3 align-items-center text-600 hover:text-900 hover:surface-100 transition-colors transition-duration-150 p-ripple">
                                    <i class="pi pi-comments mr-2"></i>
                                    <span class="font-medium">Messages</span>
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </li>
            <li>
                <a v-ripple 
                @click="router.push({name: 'createbooking'})"
                :class="'flex px-6 p-3 lg:px-3 lg:py-2 align-items-center text-' + backgroundColor + '-100 hover:text-' + backgroundColor + '-50 hover:bg-' + backgroundColor + '-600 font-medium border-round cursor-pointer transition-colors transition-duration-150 p-ripple'">
                    <i class="pi pi-booking mr-2"></i>
                    <span>Create Booking</span>
                </a>
            </li>
            <li>
                <a v-ripple :class="'flex px-6 p-3 lg:px-3 lg:py-2 align-items-center text-' + backgroundColor + '-100 hover:text-' + backgroundColor + '-50 hover:bg-' + backgroundColor + '-600 font-medium border-round cursor-pointer transition-colors transition-duration-150 p-ripple'">
                    <i class="pi pi-chart-line mr-2"></i>
                    <span>Stats</span>
                </a>
            </li>
        </ul>
        <ul class="list-none p-0 m-0 flex lg:align-items-center select-none flex-column lg:flex-row">
            <li class="flex-order-2 lg:flex-order-0">
                <div class="flex px-6 p-3 lg:px-3 lg:py-2">
                    <span class="p-input-icon-left w-full">
                        <i class="pi pi-search text-' + backgroundColor + '-100"></i>
                        <InputText type="text" :class="'bg-' + backgroundColor + '-400 text-' + backgroundColor + '-100 border-' + backgroundColor + '-400 w-full'" />
                    </span>
                </div>
            </li>
            <li :class="'border-top-1 border-' + backgroundColor + '-400 lg:border-top-none'">
                <a v-ripple :class="'flex px-6 p-3 lg:px-3 lg:py-2 align-items-center hover:bg-' + backgroundColor + '-600 font-medium border-round cursor-pointer transition-colors transition-duration-150 p-ripple'">
                    <!-- <img src="images/blocks/avatars/circle/avatar-f-1.png" class="mr-3 lg:mr-0" style="width: 28px; height: 28px"/> -->
                    <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
                    <div class="block lg:hidden">
                        <div class="text-white font-medium">Josephine Lillard</div>
                        <span :class="'text-' + backgroundColor + '-100 font-medium text-sm'">Marketing Specialist</span>
                    </div>
                </a>
            </li>
        </ul>
    </div>
</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import router from '@/router/router';
const backgroundColor = ref('orange'); // Default color is indigo 
</script>