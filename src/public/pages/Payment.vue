<script setup lang="ts">
import { ref } from "vue";

const quantities1 = ref(["test"]);
const selectedCard = ref();
</script>
<template>
  <div class="surface-50 px-4 py-5 md:px-6 lg:px-8">
    <div class="mb-3 lg:mb-0">
      <div class="text-3xl font-medium text-900 mb-3">Payment</div>
      <div class="text-500 mr-0 md:mr-3">Payment for repairs</div>
    </div>
    <PrimeDivider></PrimeDivider>
    <!-- <span class="p-input-icon-left w-full md:w-auto">
        <i class="pi pi-search"></i>
        <InputText type="text" placeholder="Search" class="w-full md:w-auto" />
      </span> -->
    <div class="text-900 font-medium text-3xl mt-5 mb-5">
      Your order is almost done
    </div>
    <div class="grid -mr-3 -ml-3">
      <div class="col-12 lg:col-9 p-3">
        <div class="px-0 py-4 lg:px-4 surface-card border-round shadow-2">
          <div class="flex">
            <div
              class="flex flex-column align-items-center ml-3"
              style="width: 2rem"
            >
              <span
                class="bg-green-500 text-0 flex align-items-center justify-content-center border-circle"
                style="min-width: 3rem; min-height: 3rem"
              >
                <i class="pi pi-directions text-xl"></i>
              </span>
              <div
                class="h-full border-dashed border-1 border-green-500"
                style="min-height: 12rem"
              ></div>
            </div>
            <div class="ml-0 lg:ml-5 p-2 flex-auto">
              <div class="mb-3">
                <span class="text-900 text-xl block ml-2">Address</span>
              </div>
              <div class="grid flex-column lg:flex-row">
                <div class="col p-3">
                  <div
                    class="flex flex-column border-round border-1 surface-border p-4 cursor-pointer hover:border-primary transition-duration-150"
                    @click="selectedAddress = address1"
                    :class="{ 'border-primary': selectedAddress === address1 }"
                  >
                    <div class="flex justify-content-between mb-3">
                      <span class="text-900 text-xl font-medium">Home</span>
                      <span class="text-600 font-medium"
                        ><i class="pi pi-pencil mr-2"></i>Edit</span
                      >
                    </div>
                    <span class="inline-block text-600 mb-3"
                      >Jacob Obrechtstraat 5, 1071 KC Amsterdam The
                      Netherlands</span
                    >
                    <span class="inline-block text-600"
                      ><i class="pi pi-mobile mr-2"></i>+123456789</span
                    >
                  </div>
                </div>
                <div class="col p-3">
                  <div
                    class="flex flex-column border-round border-1 surface-border p-4 cursor-pointer hover:border-primary transition-duration-150"
                    @click="selectedAddress = address2"
                    :class="{ 'border-primary': selectedAddress === address2 }"
                  >
                    <div class="flex justify-content-between mb-3">
                      <span class="text-900 text-xl font-medium">Office</span>
                      <span class="text-600 font-medium"
                        ><i class="pi pi-pencil mr-2"></i>Edit</span
                      >
                    </div>
                    <span class="inline-block text-600 mb-3"
                      >Jacob Obrechtstraat 5, 1072 KC Amsterdam The
                      Netherlands</span
                    >
                    <span class="inline-block text-600"
                      ><i class="pi pi-mobile mr-2"></i>+123456789</span
                    >
                  </div>
                </div>
                <div class="col-12 lg:col-3 p-3">
                  <div
                    class="flex h-full flex-column justify-content-center align-items-center text-center py-5 border-round border-1 surface-border surface-100 cursor-pointer hover:border-primary transition-duration-150"
                  >
                    <span
                      class="text-600 border-circle border-2 w-2rem h-2rem flex align-items-center justify-content-center"
                      ><i class="pi pi-fw pi-plus"></i
                    ></span>
                    <span class="text-600 mt-3">Add New Address</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex">
            <div
              class="flex flex-column align-items-center ml-3"
              style="width: 2rem"
            >
              <span
                class="bg-green-500 text-0 flex align-items-center justify-content-center border-circle"
                style="min-width: 3rem; min-height: 3rem"
              >
                <i class="pi pi-image text-xl"></i>
              </span>
              <div
                class="h-full border-dashed border-1 surface-border"
                style="min-height: 12rem"
              ></div>
            </div>
            <div class="ml-0 lg:ml-5 p-2 flex-auto">
              <div class="mb-3">
                <span class="text-900 text-xl block ml-2">Cart</span>
              </div>
              <div
                class="p-2 flex flex-column lg:flex-row flex-wrap lg:align-items-center"
              >
                <img
                  src="../../assets/img/clutchimage.jpg"
                  class="w-8rem h-8rem mb-3 lg:mb-0 flex-shrink-0"
                  alt="product"
                />
                <div class="flex-auto lg:ml-3">
                  <div
                    class="flex align-items-center justify-content-between mb-3"
                  >
                    <span class="text-900 font-medium">Repairs choosen</span>
                    <span class="text-900 font-medium">$123.00</span>
                  </div>
                  <div class="text-600 text-sm mb-3">Clutch Replace</div>
                  <div
                    class="flex flex-auto justify-content-between align-items-center"
                  >
                    <InputNumber
                      :showButtons="true"
                      buttonLayout="horizontal"
                      :min="0"
                      inputClass="w-2rem text-center p-0 border-none surface-50"
                      v-model="quantities1[0]"
                      class="border-none border-round"
                      decrementButtonClass="surface-50 p-button-text text-600 hover:text-primary"
                      incrementButtonClass="p-button-text surface-50 text-600 hover:text-primary py-1 px-1"
                      incrementButtonIcon="pi pi-plus"
                      decrementButtonIcon="pi pi-minus"
                    ></InputNumber>
                    <span class="text-600 cursor-pointer"
                      ><i class="pi pi-trash mr-2"></i>Delete</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex">
            <div
              class="flex flex-column align-items-center ml-3"
              style="width: 2rem"
            >
              <span
                class="bg-gray-200 text-500 flex align-items-center justify-content-center border-circle"
                style="min-width: 3rem; min-height: 3rem"
              >
                <i class="pi pi-credit-card text-xl"></i>
              </span>
            </div>
            <div class="ml-0 lg:ml-5 p-2 flex-auto">
              <div class="mb-3">
                <span class="text-900 text-xl block ml-2">Payment Method</span>
              </div>
              <div class="grid flex-column lg:flex-row">
                <div class="col p-3">
                  <div
                    class="flex flex-column border-round border-1 surface-border p-4 cursor-pointer hover:border-primary transition-duration-150"
                    @click="selectedCard = card1"
                    :class="{ 'border-primary': selectedCard === card1 }"
                  >
                    <img
                      src="../../assets/img/checkoutform-1-5.png"
                      class="w-6rem"
                      alt="Visa"
                    />
                    <span class="inline-block text-900 text-lg lg:text-xl mt-3"
                      >**** **** **** 1234</span
                    >
                    <div
                      class="flex justify-content-between align-items-center mt-3"
                    >
                      <span class="inline-block text-600 text-sm"
                        >Cardholder Name</span
                      >
                      <span class="inline-block text-600 text-sm text-right"
                        >Expiry Date</span
                      >
                    </div>
                    <div
                      class="flex justify-content-between align-items-center mt-3"
                    >
                      <span class="inline-block text-900 font-bold"
                        >John Warden</span
                      >
                      <span class="inline-block text-900 font-bold">12/25</span>
                    </div>
                  </div>
                </div>
                <div class="col p-3">
                  <div
                    class="flex flex-column border-round border-1 surface-border p-4 cursor-pointer hover:border-primary transition-duration-150"
                    @click="selectedCard = card2"
                    :class="{ 'border-primary': selectedCard === card2 }"
                  >
                    <img
                      src="../../assets/img/checkoutform-1-5.png"
                      class="w-6rem"
                      alt="Visa"
                    />
                    <span class="inline-block text-900 text-lg lg:text-xl mt-3"
                      >**** **** **** 1234</span
                    >
                    <div
                      class="flex justify-content-between align-items-center mt-3"
                    >
                      <span class="inline-block text-600 text-sm"
                        >Cardholder Name</span
                      >
                      <span class="inline-block text-600 text-sm text-right"
                        >Expiry Date</span
                      >
                    </div>
                    <div
                      class="flex justify-content-between align-items-center mt-3"
                    >
                      <span class="inline-block text-900 font-bold"
                        >John Warden</span
                      >
                      <span class="inline-block text-900 font-bold">12/25</span>
                    </div>
                  </div>
                </div>
                <div class="col-12 lg:col-3 p-3">
                  <div
                    class="flex h-full flex-column justify-content-center align-items-center py-5 border-round border-1 surface-border surface-100 cursor-pointer hover:border-primary transition-duration-150"
                  >
                    <span
                      class="text-600 border-circle border-2 w-2rem h-2rem flex align-items-center justify-content-center"
                      ><i class="pi pi-fw pi-plus"></i
                    ></span>
                    <span class="text-600 mt-3 text-center"
                      >Add New Credit Card</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 lg:col-3 p-3">
        <div class="surface-card p-4 border-round shadow-2">
          <div class="border-bottom-1 surface-border pb-4">
            <span class="text-900 text-xl block">Order Summary</span>
          </div>
          <div class="border-bottom-1 surface-border my-3 py-2">
            <div class="flex justify-content-between mb-3">
              <span class="text-900">Price</span>
              <span class="text-900">$123.00</span>
            </div>
            <div class="flex justify-content-between mb-3">
              <span class="text-900">Delivery</span>
              <span class="text-green-500">Free</span>
            </div>
            <div class="flex justify-content-between mb-3">
              <span class="text-900">Discount</span>
              <span class="text-900">$12.00</span>
            </div>
          </div>
          <div class="border-bottom-1 surface-border my-3 py-2">
            <div class="flex justify-content-between mb-3">
              <span class="text-900 font-medium">Total</span>
              <span class="text-900 font-bold">$111.00</span>
            </div>
          </div>
          <PrimeButton
            class="surface-400 border-none hover:bg-primary w-full mt-3"
            :disabled="!selectedCard"
            label="Place Order"
          ></PrimeButton>
        </div>
      </div>
    </div>
  </div>
</template>
