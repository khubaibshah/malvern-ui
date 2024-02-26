import { ref } from 'vue';

export default function useNodes() {
  const nodes = ref([
    {
      key: 1,
      label: 'Transmission',
      icon: 'pi pi-wrench',  
    },
    {
      key: 2,
      label: 'Electrical',
      icon: 'pi pi-wrench',  
    },
    {
      key: 3,
      label: 'Engine',
      icon: 'pi pi-wrench',  
    },
    {
      key: 4,
      label: 'Brakes',
      icon: 'pi pi-wrench',
    }
  ]);

  return { nodes };
}
