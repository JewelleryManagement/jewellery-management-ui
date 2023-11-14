<template>
  <v-container class="my-12" fluid>
    <v-row justify="center">
      <v-col cols="10" max-width="1600">
        <sales-table></sales-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import SalesTable from "@/components/Table/SalesTable.vue";
</script>
