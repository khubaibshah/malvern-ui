<script setup lang="ts">
import { ref } from "vue";
import { nodes } from "@/components/reusable/repairMenu";
</script>

<template>
  <div class="surface-section px-4 pt-5 md:px-6 lg:px-8">
    <div
      class="flex md:align-items-center md:justify-content-between flex-column md:flex-row pb-4 border-bottom-1 surface-border mb-3"
    >
      <div class="mb-3 lg:mb-0">
        <div class="text-3xl font-medium text-900 mb-3">Book Repairs</div>
        <div class="text-500 mr-0 md:mr-3">
          Below you can book the repairs you need
        </div>
      </div>
      <span class="p-input-icon-left w-full md:w-auto">
        <i class="pi pi-search"></i>
        <InputText type="text" placeholder="Search" class="w-full md:w-auto" />
      </span>
    </div>
    <!-- align-items-center justify-content-center -->

    <!-- could be a option -->
    <!-- <ul
      class="surface-card p-2 m-0 list-none flex justify-content-center overflow-x-auto select-none"
    >
      <li class="pr-3">
        <a
          v-ripple
          class="cursor-pointer px-4 py-3 flex align-items-center hover:surface-100 border-round transition-colors transition-duration-150 p-ripple"
          :class="{
            'bg-primary hover:bg-primary': active4 === 0,
            'text-700': active4 !== 0,
          }"
          @click="active4 = 0"
        >
          <i class="pi pi-home mr-2"></i>
          <span class="font-medium">Engine</span>
        </a>
      </li>
      <li class="flex align-items-center">
        <div
          style="width: 1px; height: 50%"
          class="border-right-1 surface-border"
        ></div>
      </li>
      <li class="px-3">
        <a
          v-ripple
          class="cursor-pointer px-4 py-3 flex align-items-center hover:surface-100 border-round transition-colors transition-duration-150 p-ripple"
          :class="{
            'bg-primary hover:bg-primary': active4 === 1,
            'text-700': active4 !== 2,
          }"
          @click="active4 = 1"
        >
          <i class="pi pi-users mr-2"></i>
          <span class="font-medium">Clutch</span>
        </a>
      </li>
      <li class="flex align-items-center">
        <div
          style="width: 1px; height: 50%"
          class="border-right-1 surface-border"
        ></div>
      </li>
      <li class="px-3">
        <a
          v-ripple
          class="cursor-pointer px-4 py-3 flex align-items-center hover:surface-100 border-round transition-colors transition-duration-150 p-ripple"
          :class="{
            'bg-primary hover:bg-primary': active4 === 2,
            'text-700': active4 !== 2,
          }"
          @click="active4 = 2"
        >
          <i class="pi pi-shopping-cart mr-2"></i>
          <span class="font-medium">Breaks</span>
        </a>
      </li>
      <li class="flex align-items-center">
        <div
          style="width: 1px; height: 50%"
          class="border-right-1 surface-border"
        ></div>
      </li>
      <li class="px-3">
        <a
          v-ripple
          class="cursor-pointer px-4 py-3 flex align-items-center hover:surface-100 border-round transition-colors transition-duration-150 p-ripple"
          :class="{
            'bg-primary hover:bg-primary': active4 === 3,
            'text-700': active4 !== 3,
          }"
          @click="active4 = 3"
        >
          <i class="pi pi-user mr-2"></i>
          <span class="font-medium">Disks</span>
        </a>
      </li>
      <li class="flex align-items-center">
        <div
          style="width: 1px; height: 50%"
          class="border-right-1 surface-border"
        ></div>
      </li>
      <li class="px-3">
        <a
          v-ripple
          class="cursor-pointer px-4 py-3 flex align-items-center hover:surface-100 border-round transition-colors transition-duration-150v"
          :class="{
            'bg-primary hover:bg-primary': active4 === 4,
            'text-700': active4 !== 4,
          }"
          @click="active4 = 4"
        >
          <i class="pi pi-cog mr-2"></i>
          <span class="font-medium">Exhaust</span>
        </a>
      </li>
    </ul>
     -->

    <div class="grid">
      <div class="col-12 md:col-12 lg:col-3">
        <div class="surface-card p-4 border-round">
          <div class="text-3xl font-medium text-900 mb-2">Your Car</div>
          <div class="font-medium text-500 mb-3">
            Below are your car details.
          </div>
          <div class="surface-border mb-2">
            <InputGroup class="w-full">
              <InputGroupAddon
                style="background-color: #00309a; color: #fbe90a"
              >
                GB
              </InputGroupAddon>
              <InputText
                style="background-color: #fbe90a; border-color: #00309a"
                placeholder="REG"
                inputClass="'bg-transparent text-900 border-400 border-blue-500'"
                class="text-900 font-bold"
              />
            </InputGroup>
          </div>
          <!-- extra data to add here about users car -->
          <div class="font-medium text-500 mb-3">
            Vivamus id nisl interdum, blandit augue sit amet, eleifend mi.
          </div>
          <div class="font-medium text-500 mb-3">
            Vivamus id nisl interdum, blandit augue sit amet, eleifend mi.
          </div>
        </div>
        <div class="surface-card pl-4 border-round">
          <div class="text-2xl text-500 mb-3">
            Search for repairs below.
          </div>
        </div>
        <PrimeTree
          :value="nodes"
          :filter="true"
          filterMode="lenient"
        ></PrimeTree>
      </div>
      <div class="col-12 md:col-12 lg:col-5">
        <div class="px-0 py-4 md:px-4">
          <div class="border-round surface-card">
            <div class="text-2xl text-500 mb-3">
            Avaliable Repairs
          </div>
          <PrimeDivider></PrimeDivider>
            Where does it come from?
Contrary to popular belief, Lorem Ipsum is not simply random text. 
It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. 
Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, 
from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. 
Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, 
written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. 
The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
          </div>
        </div>
      </div>
      <div class="col-12 md:col-12 lg:col-4">
        <div class="px-0 py-4 md:px-4">
          <div class="border-round surface-card">
            <div class="text-2xl text-500 mb-3">
            Summary
          </div>
          <PrimeDivider></PrimeDivider>
            Where does it come from?
Contrary to popular belief, Lorem Ipsum is not simply random text. 
It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. 
Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, 
from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. 
Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, 
written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. 
The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
@/components/reusable/repairMenu
