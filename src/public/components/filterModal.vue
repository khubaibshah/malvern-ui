<template>
    <PrimeDialog :visible="visible" @update:visible="$emit('update:visible', $event)" header="Advanced Filters"
        maximizable :maximized="true" modal :style="{ width: '100vw', height: '100vh' }"
        :breakpoints="{ '1199px': '100vw', '575px': '100vw' }">
        <div class="grid">
            <!-- Left Column - Filter Categories -->
            <div class="col-12 md:col-3 p-4 border-right-1 surface-border">
                <div class="flex flex-column gap-3">
                    <PrimeButton v-for="category in filterCategories" :key="category" :label="category"
                        class="p-button-text text-left justify-content-start"
                        :class="{ 'text-primary': activeCategory === category }" @click="activeCategory = category" />
                </div>
            </div>

            <!-- Right Column - Filter Options -->
            <div class="col-12 md:col-9 p-4">
                <!-- Price Range -->
                <div v-if="activeCategory === 'Price'" class="mb-6">
                    <h3 class="text-xl font-bold mb-4">Price Range</h3>

                    <PrimeSlider v-model="priceRange" :min="0" :max="150000" :step="1000" range class="mb-2" />

                    <!-- Show the dynamic range below the slider -->
                    <div class="text-sm text-gray-600 mb-2">
                        Selected Range: £{{ priceRange[0].toLocaleString() }} – £{{ priceRange[1].toLocaleString() }}
                    </div>

                    <div class="flex justify-content-between">
                        <PrimeInputNumber v-model="priceRange[0]" mode="currency" currency="GBP" locale="en-UK"
                            class="w-6" />
                        <PrimeInputNumber v-model="priceRange[1]" mode="currency" currency="GBP" locale="en-UK"
                            class="w-6" />
                    </div>
                </div>


                <!-- Mileage -->
                <div v-if="activeCategory === 'Mileage'" class="mb-6">
                    <h3 class="text-xl font-bold mb-4">Mileage</h3>
                    <div class="grid">
                        <div class="col-6 md:col-3" v-for="mileage in mileageOptions" :key="mileage.value">
                            <PrimeButton :label="mileage.label" class="w-full mb-2"
                                :class="{ 'p-button-outlined': selectedMileage !== mileage.value }"
                                @click="selectedMileage = mileage.value" />
                        </div>
                    </div>
                </div>

                <!-- Vehicle Type -->
                <div v-if="activeCategory === 'Vehicle Type'" class="mb-6">
                    <h3 class="text-xl font-bold mb-4">Vehicle Type</h3>
                    <div class="grid">
                        <div class="col-6 md:col-3" v-for="type in vehicleTypes" :key="type">
                            <PrimeButton :label="type" class="w-full mb-2"
                                :class="{ 'p-button-outlined': !selectedTypes.includes(type) }"
                                @click="toggleVehicleType(type)" />
                        </div>
                    </div>
                </div>

                <!-- Features -->
                <div v-if="activeCategory === 'Features'" class="mb-6">
                    <h3 class="text-xl font-bold mb-4">Features</h3>
                    <div class="grid">
                        <div class="col-6 md:col-4" v-for="feature in features" :key="feature">
                            <PrimeCheckbox v-model="selectedFeatures" :inputId="feature" name="feature"
                                :value="feature" />
                            <label :for="feature" class="ml-2">{{ feature }}</label>
                        </div>
                    </div>
                </div>

                <!-- Color -->
                <div v-if="activeCategory === 'Color'" class="mb-6">
                    <h3 class="text-xl font-bold mb-4">Color</h3>
                    <div class="flex flex-wrap gap-2">
                        <div v-for="color in colors" :key="color.name"
                            class="color-option border-circle w-3rem h-3rem flex align-items-center justify-content-center cursor-pointer"
                            :style="{ backgroundColor: color.code }" @click="selectedColor = color.name">
                            <i v-if="selectedColor === color.name" class="pi pi-check text-white"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer with Action Buttons -->
        <template #footer>
            <div class="flex justify-content-between w-full">
                <PrimeButton label="Reset All" icon="pi pi-refresh" class="p-button-text" @click="resetFilters" />
                <div class="flex gap-2">
                    <PrimeButton label="Cancel" icon="pi pi-times" class="p-button-text"
                        @click="$emit('update:visible', false)" />
                    <PrimeButton label="Apply Filters" icon="pi pi-check" @click="applyFilters" />

                </div>
            </div>
        </template>
    </PrimeDialog>


</template>
<script setup lang="ts">

import { ref } from 'vue';


defineProps({
    visible: {
        type: Boolean,
        required: true
    }
});
const emit = defineEmits(['update:visible', 'applyFilters']);
// defineEmits(['update:visible', 'applyFilters'])



const applyFilters = () => {
    const filters: Record<string, any> = {};

    if (priceRange.value[0] !== 0 || priceRange.value[1] !== 150000) {
        filters.price_min = priceRange.value[0];
        filters.price_max = priceRange.value[1];
    }

    if (selectedMileage.value && selectedMileage.value > 0) {
        filters.mileage = selectedMileage.value;
    }

    if (selectedTypes.value.length > 0) {
        filters.types = selectedTypes.value;
    }

    if (selectedFeatures.value.length > 0) {
        filters.features = selectedFeatures.value;
    }

    if (selectedColor.value) {
        filters.color = selectedColor.value;
    }

    emit('applyFilters', filters);
    emit('update:visible', false);
};



// const advancedFilters = ref(false);
const activeCategory = ref('Price');

// Filter data
const priceRange = ref([0, 150000]); // Default range from 0 to 150000
const selectedMileage = ref(0);
const selectedTypes = ref<string[]>([]);
const selectedFeatures = ref<string[]>([]);
const selectedColor = ref('');

const filterCategories = [
    'Price',
    'Mileage',
    'Vehicle Type',
    'Features',
    'Color'
];

const mileageOptions = [
    { label: 'Under 10k', value: 10000 },
    { label: 'Under 20k', value: 20000 },
    { label: 'Under 50k', value: 50000 },
    { label: 'Under 100k', value: 100000 },
    { label: 'Any Mileage', value: 0 }
];

const vehicleTypes = [
    'Saloon',
    'SUV',
    'Coupe',
    'Convertible',
    'Estate',
    'Hatchback',
    'Electric',
    'Hybrid'
];

const features = [
    'Heated Seats',
    'Navigation',
    'Sunroof',
    'Leather Interior',
    'Parking Sensors',
    'Bluetooth',
    'Apple CarPlay',
    'Android Auto',
    'Backup Camera',
    'Adaptive Cruise'
];

const colors = [
    { name: 'Black', code: '#000000' },
    { name: 'White', code: '#FFFFFF' },
    { name: 'Silver', code: '#C0C0C0' },
    { name: 'Gray', code: '#808080' },
    { name: 'Red', code: '#FF0000' },
    { name: 'Blue', code: '#0000FF' },
    { name: 'Green', code: '#008000' },
    { name: 'Yellow', code: '#FFFF00' },
    { name: 'Orange', code: '#FFA500' },
    { name: 'Brown', code: '#A52A2A' }
];

const toggleVehicleType = (type: string) => {
    const index = selectedTypes.value.indexOf(type);
    if (index === -1) {
        selectedTypes.value.push(type);
    } else {
        selectedTypes.value.splice(index, 1);
    }
};

const resetFilters = () => {
    priceRange.value = [0, 150000]; // ← now neutral, won't trigger unless changed
    selectedMileage.value = 0;      // ← 0 = any mileage
    selectedTypes.value = [];
    selectedFeatures.value = [];
    selectedColor.value = '';
};


// const applyFilters = () => {
//     // Your filter application logic here
//     advancedFilters.value = false;
// };
</script>

<style scoped>
.color-option {
    transition: all 0.2s;
    border: 2px solid transparent;
}

.color-option:hover {
    transform: scale(1.1);
}

.color-option.selected {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px var(--primary-color);
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .border-right-1 {
        border-right: none !important;
        border-bottom: 1px solid var(--surface-border);
    }
}
</style>