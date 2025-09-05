<template>
  <div>
    <PrimeToast />
    <div class="surface-section px-4 pt-5 md:px-6 lg:px-8 car-details-container">
      <div class="flex justify-content-center">
        <div class="col-12 md:col-8 lg:col-6">
          <div
            class="flex flex-column md:flex-row md:align-items-center md:justify-content-between pb-4 text-center md:text-left">
            <div class="text-3xl font-medium text-900 mb-3">Vehicle Valuation</div>
          </div>

          <PrimeCard class="w-full text-center">
            <template #title>
              <p class="mb-3">Discover your car’s worth with instant valuations.</p>
              <h3 class="text-lg font-semibold text-gray-700">
                {{ valuation ? 'Your Valuation' : 'Your Details' }}
              </h3>
            </template>

            <template #content>
              <!-- If we don’t have valuation yet, show form -->
              <div v-if="!valuation" class="grid gap-3 justify-content-center text-center">
                <!-- Registration -->
                <div class="col-12">
                  <label for="registration" class="block text-sm font-medium text-gray-700 mb-1">Registration</label>
                  <InputText
                    id="registration"
                    v-model="form.registration"
                    class="w-full"
                    placeholder="e.g. AB12 CDE"
                    @input="form.registration = form.registration.toUpperCase()"
                  />
                </div>

                <!-- Mileage -->
                <div class="col-12">
                  <label for="mileage" class="block text-sm font-medium text-gray-700 mb-1">Mileage</label>
                  <Primeinputnumber
                    inputId="mileage"
                    v-model="form.mileage"
                    :min="0"
                    showButtons
                    class="w-full"
                    placeholder="e.g. 48000"
                  />
                </div>

                <div class="col-12 mt-2">
                  <PrimeButton
                    severity="contrast"
                    label="Get Valuation"
                    class="w-full"
                    :disabled="!canSubmit || loading"
                    @click="onGetValuation"
                  />
                </div>
              </div>

              <!-- If we do have valuation, show results -->
              <div v-else>
                <div class="text-xl font-semibold mb-3">
                  {{ valuation.make }} {{ valuation.model }} ({{ valuation.registration }})
                </div>
                <p class="text-gray-600 mb-2">
                  {{ valuation.generation }} - {{ valuation.bodyType }} - {{ valuation.fuelType }} - {{ valuation.colour }}
                </p>

                <div class="grid text-center">
                  <!-- <div class="col-12 md:col-4">
                    <div class="p-3 surface-100 border-round">
                      <div class="text-sm text-gray-500">Retail</div>
                      <div class="text-2xl font-bold">£{{ valuation.valuations.retail.toLocaleString() }}</div>
                    </div>
                  </div>
                  <div class="col-12 md:col-4">
                    <div class="p-3 surface-100 border-round">
                      <div class="text-sm text-gray-500">Part Exchange</div>
                      <div class="text-2xl font-bold">£{{ valuation.valuations.partExchange.toLocaleString() }}</div>
                    </div>
                  </div> -->
                  <div class="col-12 md:col-12">
                    <div class="p-3 surface-100 border-round">
                      <div class="text-sm text-gray-500">Private Sale</div>
                      <div class="text-2xl font-bold">£{{ valuation.valuations.private.toLocaleString() }}</div>
                    </div>
                  </div>
                </div>

                <div class="mt-3">
                  <PrimeButton severity="contrast" label="Check Another Vehicle" class="w-full" @click="resetForm" />
                </div>
              </div>
            </template>
          </PrimeCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import axios from 'axios';

const form = ref({
  registration: '',
  mileage: null as number | null,
});

const valuation = ref<any | null>(null);
const loading = ref(false);

const canSubmit = computed(() => {
  const reg = form.value.registration?.trim();
  const miles = Number(form.value.mileage);
  return !!reg && reg.length >= 5 && !Number.isNaN(miles) && miles > 0;
});

async function onGetValuation() {
  try {
    loading.value = true;
    const res = await axios.get(
      `http://127.0.0.1:8000/scs/at/${form.value.registration}/${form.value.mileage}`
    );
    valuation.value = res.data.data;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

function resetForm() {
  valuation.value = null;
  form.value.registration = '';
  form.value.mileage = null;
}
</script>
