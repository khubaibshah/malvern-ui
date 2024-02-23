export default function useUpperCase() {
  
  function transformToUpperCase(registrationNumber: any) {
      registrationNumber.value = registrationNumber.value.toUpperCase();
  }

  return {
    transformToUpperCase,

  };
}
