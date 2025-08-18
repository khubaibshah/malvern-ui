<template>

    <div class="surface-section p-5 md:p-6 lg:p-8 shadow-md rounded-xl">
        <h2 class="text-2xl font-semibold mb-4">Make an Enquiry</h2>
        <p class="mb-3">
            Please get in touch using the form below and we'll get back to you via phone or email as soon as possible.
        </p>
        <p class="mb-3">
            You are enquiring about: <strong>{{ car?.make }} {{ car?.model }} {{ car?.variant }}</strong>
        </p>


        <div class="grid">
            <div class="col-12 md:col-6 lg:col-6">
                <div class="field">
                    <label class="font-medium">Name</label>
                    <InputText v-model="form.name" class="w-full" placeholder="Your name" />
                </div>
                <div class="field">
                    <label class="font-medium">Email</label>
                    <InputText v-model="form.email" class="w-full" placeholder="you@example.com" />
                </div>

                <div class="field">
                    <label class="font-medium">Phone</label>
                    <InputText v-model="form.phone" class="w-full" placeholder="07700 900123" />
                </div>

                <div class="field">
                    <label class="font-medium">Message</label>
                    <Textarea v-model="form.message" rows="5" class="w-full" placeholder="Write your message here..." />
                </div>

                <div class="flex justify-end">
                    <PrimeButton label="Submit Enquiry" class="w-full custom-black-button" icon="pi pi-send" @click="handleSubmit"
                        :loading="submitting" />
                </div>
            </div>
            <div class="col-12 md:col-6 lg:col-6">
                <PrimeCard v-if="car" style="overflow: hidden">
                    <template #header>
                        <img :src="car.main_image || car.images?.[0]" alt="Vehicle image"
                            class="w-full h-56 object-cover" />
                    </template>

                    <template #title>
                        {{ car.make }} {{ car.model }} {{ car.variant }}
                    </template>

                    <template #subtitle>
                        Reg: {{ car.registration }} | {{ car.year }}
                    </template>

                    <template #content>
                        <div class="space-y-2 text-sm text-gray-800">
                            <div><i class="pi pi-tag mr-2"></i> £{{ car.price?.toLocaleString() }}</div>
                            <div><i class="pi pi-clock mr-2"></i> {{ car.mileage?.toLocaleString() }} miles</div>
                            <div><i class="pi pi-calendar mr-2"></i> {{ car.registration_date }}</div>
                            <div><i class="pi pi-cog mr-2"></i> {{ car.gearbox }}</div>
                            <div><i class="pi pi-sliders-h mr-2"></i> {{ formattedEngineSize }}</div>
                            <div><i class="pi pi-key mr-2"></i> {{ car.keys }}</div>
                            <div><i class="pi pi-car mr-2"></i> {{ car.body_style }}</div>
                            <div><i class="fa-solid fa-gas-pump mr-2"> </i> {{ car.fuel_type }}</div>
                            <div><i class="pi pi-align-left mr-2"> </i> {{ car.description }}</div>
                        </div>
                    </template>

                    <template #footer>
                        <!-- <div class="text-xs text-gray-400">Vehicle ID: {{ car.id }}</div> -->
                    </template>
                </PrimeCard>

            </div>
        </div>
        <!-- 
      <div class="flex justify-end">
        <Button label="Submit Enquiry" icon="pi pi-send" @click="handleSubmit" :loading="submitting" />
      </div>
    </div> -->

        <PrimeToast />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import axios from 'axios';
import { useVehicleStore } from '@/stores/vehicleData';
import { formatEngineSize } from '@/utils/engineSizeFormat';

const vehicleStore = useVehicleStore();
const car = computed(() => vehicleStore.getVehicleData);
const formattedEngineSize = computed(() => formatEngineSize(car.value?.engine_size));

// Optional: Fallback if data is missing
// onMounted(() => {
//   if (!car.value) {
//     // fallback logic here if needed
//     console.warn("Vehicle data missing");
//   }
// });

const toast = useToast();
const submitting = ref(false);

const form = ref({
    name: '',
    email: '',
    phone: '',
    message: ''
});

const validateForm = () => {
    const { name, email, phone, message } = form.value;
    if (!name || !email || !message) {
        toast.add({
            severity: 'warn',
            summary: 'Missing Fields',
            detail: 'Please fill out name, email, and message.',
            life: 3000
        });
        return false;
    }
    return true;
};

const handleSubmit = async () => {
    if (!validateForm()) return;

    submitting.value = true;

    try {
        const payload = {
            ...form.value,
            vehicle_id: car.value?.id ?? null
        };

        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/scs/lead`, payload);

        toast.add({
            severity: 'success',
            summary: 'Enquiry Sent',
            detail: 'We will get back to you shortly.',
            life: 3000
        });

        // vehicleStore.setVehicleData(null);
        // vehicleStore.setVehicleReg(null);

        form.value = { name: '', email: '', phone: '', message: '' };
    } catch (err) {
        console.error(err);
        toast.add({
            severity: 'error',
            summary: 'Failed to Send',
            detail: 'There was a problem sending your enquiry.',
            life: 3000
        });
    } finally {
        submitting.value = false;
    }
};

</script>

<style scoped>
.pi {
    vertical-align: middle;
}

.surface-section {
    background-color: white;
}

.field {
    display: flex;
    flex-direction: column;
}
</style>
