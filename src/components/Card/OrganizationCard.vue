<template>
    <v-card class="mx-auto pa-10 elevation-12" max-width="500" height="auto">
      <v-card-title class="text-h6 text-center">
        <v-icon>mdi-account-group</v-icon>
        {{ organization.name }}
      </v-card-title>
  
      <v-row>
        <v-col>
          <v-card-text>
            <div>
              <span class="font-weight-bold">Address:</span> {{ organization.address }}
            </div>
            <div>
              <span class="font-weight-bold">Note:</span> {{ organization.note }}
            </div>
          </v-card-text>
        </v-col>
      </v-row>
    </v-card>
  </template>
  
  <script setup>
  const { organization } = defineProps({
    organization: Object,
  });
  </script>
  