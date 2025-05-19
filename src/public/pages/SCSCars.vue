<template>
     <!-- <div class="px-4 py-8 md:px-6 lg:px-8"> -->
    <!-- <div
      class="border-2 border-dashed surface-border border-round surface-card"
      style="min-height: 20rem"
    > -->
      <div class="hero-section surface-ground p-5">
    <div class="grid grid-nogutter align-items-center justify-content-between">
      
      <!-- Left: Text and Search -->
      <div class="col-12 md:col-6 text-white z-1">
        <h1 class="text-4xl font-bold mb-3">Welcome to SCS Car sales LTD</h1>
        <p class="text-lg mb-4">In partnership wit <span class="font-bold">Malvern Autos</span></p>
        
        <div class="p-inputgroup w-full md:w-30rem">
          <InputText placeholder="Keyword search" class="w-full p-3 border-round" />
          <PrimeButton icon="pi pi-search" class="p-button-secondary" />
        </div>
      </div>

      <!-- Right: Image -->
<div class="col-12 md:col-6 text-center mt-4 md:mt-0 hidden md:block">
  <img
    src="../../assets/img/lambo.png"
    alt="car"
    class="hero-image"
  />
</div>


    </div>
  </div>
  <div class="px-4 py-8 md:px-6 lg:px-8">
<div
      class="border-2 border-dashed surface-border border-round surface-card"
      style="min-height: 20rem"
    >


  <div>
    <PrimeToast />

    <div class="surface-section md:px-6 lg:px-8 mt-3">
      <div
        class="px-4 py-5 flex md:align-items-center md:justify-content-between flex-column md:flex-row pb-4 border-bottom-1 surface-border">
        <div class="mb-3 lg:mb-0">
          <div class="text-3xl font-medium text-900 mb-3">Browse through our cars</div>
          <div class="text-500 mr-0 md:mr-3">
            Stanley Car Sales is open between 9am and 5:30pm, Monday to Friday.
          </div>
        </div>
        <span class="p-input-icon-left w-full md:w-auto">
          <i class="pi pi-search"></i>
          <AppInput type="text" placeholder="Search" class="w-full md:w-auto" />
        </span>
      </div>

      <div class="grid mt-5">
        <div class="col-12">
          <div class="p-fluid">
            <DataView :value="vehicles" :layout="layout">
              <template #header>
                <div class="flex justify-content-end">
                  <DataViewLayoutOptions v-model="layout" />
                </div>
              </template>

              <template #list="slotProps">
                <div class="grid grid-nogutter">
                  <div v-for="(item, index) in slotProps.items" :key="index" class="col-12">
                    <div class="flex flex-column sm:flex-row sm:align-items-center p-4 gap-3"
                      :class="{ 'border-top-1 surface-border': index !== 0 }">
                      <div class="md:w-10rem relative">
                        <img class="block mx-auto border-round w-full" :src="item.car_image" :alt="item.name" />
                        <AppTag :value="item.inventoryStatus" :severity="getSeverity(item)" class="absolute"
                          style="left: 4px; top: 4px" />
                      </div>
                      <div class="flex flex-column md:flex-row justify-content-between flex-1 gap-4">
                        <div class="flex flex-col gap-1">
                          <span class="font-medium text-secondary text-sm">{{ item.category }}</span>
                          <div class="text-lg font-medium text-900 mt-1">{{ item.name }}</div>
                        </div>
                        <div class="flex flex-column md:align-items-end gap-5">
                          <span class="text-xl font-semibold text-900">£{{ item.price }}</span>
                          <div class="flex flex-row-reverse md:flex-row gap-2">
                            <PrimeButton icon="pi pi-heart" outlined />
                            <PrimeButton icon="pi pi-shopping-cart" label="Buy Now"
                              :disabled="item.inventoryStatus === 'OUTOFSTOCK'" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>

              <template #grid="slotProps">
                <div class="grid grid-nogutter">
                  <div v-for="(item, index) in slotProps.items" :key="index"
                    class="col-12 sm:col-6 md:col-4 xl:col-6 p-2">
                    <div class="p-4 border-1 surface-border surface-card border-round flex flex-column">
                      <div class="surface-50 flex justify-content-center border-round p-3">
                        <div class="relative mx-auto">
                          <img class="border-round w-full" :src="item.car_image" :alt="item.name"
                            style="max-width: 300px" />
                          <AppTag :value="item.inventoryStatus" :severity="getSeverity(item)" class="absolute"
                            style="left: 4px; top: 4px" />
                        </div>
                      </div>
                      <div class="pt-4">
                        <div class="flex flex-row justify-content-between align-items-start gap-2">
                          <div>
                            <span class="font-medium text-secondary text-sm">{{ item.category }}</span>
                            <div class="text-lg font-medium text-900 mt-1">{{ item.name }}</div>
                          </div>
                          <div class="surface-100 p-1 border-round-3xl">
                            <div class="surface-0 flex align-items-center gap-2 justify-content-center py-1 px-2">
                              <span class="text-900 font-medium text-sm">{{ item.rating }}</span>
                              <i class="pi pi-star-fill text-yellow-500" />
                            </div>
                          </div>
                        </div>
                        <div class="flex flex-column gap-4 mt-4">
                          <span class="text-2xl font-semibold text-900">£{{ item.price }}</span>
                          <div class="flex gap-2">
                            <PrimeButtonton icon="pi pi-shopping-cart" label="Buy Now"
                              :disabled="item.inventoryStatus === 'OUTOFSTOCK'" class="flex-auto" />
                            <PrimeButton icon="pi pi-heart" outlined />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </DataView>
          </div>
        </div>
      </div>
    </div>
  </div>


    </div>
  </div>
</template>

<script setup lang="ts">
// import Button from 'primevue/button'
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

const vehicles = ref([])
const layout = ref('grid')

onMounted(() => {
  getVehicles()
})

const getVehicles = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/scs-car-images')
    if (response.status === 200) {
      vehicles.value = response.data

      // Convert base64 image field
      vehicles.value.forEach((vehicle: { car_image: string }) => {
        if (vehicle.car_image) {
          vehicle.car_image = `data:image/jpeg;base64,${vehicle.car_image}`
        }
      })

      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Car images loaded',
        life: 3000
      })
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No car data available',
        life: 3000
      })
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load vehicle data',
      life: 3000
    })
  }
}

const getSeverity = (product: { inventoryStatus: any }) => {
  switch (product.inventoryStatus) {
    case 'INSTOCK':
      return 'success'
    case 'LOWSTOCK':
      return 'warning'
    case 'OUTOFSTOCK':
      return 'danger'
    default:
      return null
  }
}
const cars = ref([
    {
        id: 1,
        make: 'BMW',
        model: '320d',
        year: 2017,
        price: 10995,
        image: 'https://source.unsplash.com/600x400/?bmw',
        rating: 3.5
    },
    {
        id: 2,
        make: 'Audi',
        model: 'A4',
        year: 2019,
        price: 13495,
        image: 'https://source.unsplash.com/600x400/?audi',
        rating: 4.2
    },
    {
        id: 3,
        make: 'Ford',
        model: 'Fiesta',
        year: 2018,
        price: 8495,
        image: 'https://source.unsplash.com/600x400/?ford',
        rating: 3.9
    }
])
</script>

<style scoped>
.hero-section {
  background: linear-gradient(to right, #facc15, #f97316); /* yellow to orange */
  border-radius: 0 0 1.5rem 1.5rem;
  position: relative;
}

.hero-image {
  max-height: 400px;
  filter: drop-shadow(0 10px 15px rgba(0, 0, 0, 0.2));
}
</style>
