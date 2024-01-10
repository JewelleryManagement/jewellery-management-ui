<template>
  <div>
    <vue-barcode
      :value="productionNumber"
      :options="barcodeOptions"
    />
  </div>
</template>

<script setup>
import VueBarcode from "@chenfengyuan/vue-barcode";
const { productionNumber } = defineProps({ productionNumber: String });
const barcodeOptions = {
  displayValue: true,
  lineColor: '#2B2B2C'
};

</script>
