<template>
  <v-card class="mx-auto pa-10 elevation-12" max-width="500" height="auto">
    <v-card-title class="text-h6 text-center">
      <v-icon>mdi-account</v-icon>
      {{ user.firstName + " " + user.lastName }}
    </v-card-title>

    <v-row>
      <v-col>
        <v-card-text>
          <div>
            <span class="font-weight-bold">Email:</span> {{ user.email }}
          </div>
          <div>
            <span class="font-weight-bold">Address:</span> {{ user.address }}
          </div>
          <div>
            <span class="font-weight-bold">Birth Date:</span>
            {{ user.birthDate }}
          </div>
        </v-card-text>
      </v-col>
      <v-col>
        <v-card-text>
          <div>
            <span class="font-weight-bold">Phone:</span> {{ user.phone }}
          </div>
          <div>
            <span class="font-weight-bold">Phone2:</span> {{ user.phone2 }}
          </div>
          <div><span class="font-weight-bold">Note:</span> {{ user.note }}</div>
        </v-card-text>
      </v-col>
    </v-row>

    <v-card-text class="text-center">
      <div>Resource Availability: {{ resourcesAndQuantities.length }}</div>
    </v-card-text>
    <v-card-text class="text-center">
      <div v-for="resource in resourcesAndQuantities" :key="resource.id">
        <p>{{ resource.clazz }} - {{ resource.quantity }}</p>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
const { user, resourcesAndQuantities } = defineProps({
  user: Object,
  resourcesAndQuantities: Object,
});
</script>
