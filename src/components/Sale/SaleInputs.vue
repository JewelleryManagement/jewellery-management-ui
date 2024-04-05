<template>
  <v-select
    label="Seller"
    v-model="props.sellObject.sellerName"
    :items="props.allUsers"
    :item-props="userPropsFormatter"
    :rules="[validateAuthors(props.sellObject.sellerName)]"
  >
  </v-select>

  <v-select
    v-model="props.sellObject.buyerName"
    label="Buyer"
    :items="props.allUsers"
    :item-props="userPropsFormatter"
    :rules="[validateAuthors(props.sellObject.buyerName)]"
  >
  </v-select>
</template>

<script setup>
import { userPropsFormatter } from "@/utils/data-formatter.js";
import { validateAuthors } from "@/utils/validation-rules";
const props = defineProps({ sellObject: Object, allUsers: Object });

</script>
