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
    v-model="props.sellObject.sellerName.buyerName"
    label="Buyer"
    :items="props.allUsers"
    :item-props="userPropsFormatter"
    :rules="[validateAuthors(props.sellObject.sellerName.buyerName)]"
  >
  </v-select>
</template>

<script setup>
import {ref} from "vue"
import { userPropsFormatter } from "@/utils/data-formatter.js";
import { validateAuthors } from "@/utils/validation-rules";
const props = defineProps({ sellObject: Object, allUsers: Object });

</script>
