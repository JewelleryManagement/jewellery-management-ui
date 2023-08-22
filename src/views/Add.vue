<template>
  <v-container class="my-12" fluid>
    <v-sheet width="300" class="mx-auto">
      <v-form ref="form">
        <v-text-field
          v-model="name"
          :counter="10"
          :rules="nameRules"
          label="Name"
          required
        ></v-text-field>

        <v-select
          v-model="select"
          :items="items"
          :rules="[(v) => !!v || 'Item is required']"
          label="Item"
          required
        ></v-select>

        <v-checkbox
          v-model="checkbox"
          :rules="[(v) => !!v || 'You must agree to continue!']"
          label="Do you agree?"
          required
        ></v-checkbox>

        <div class="d-flex flex-column">
          <v-btn color="success" class="mt-4" block @click="validate">
            Submit
          </v-btn>

          <v-btn color="error" class="mt-4" block @click="reset"> Reset </v-btn>
        </div>
      </v-form>
    </v-sheet>
  </v-container>
</template>

<script>
export default {
  setup() {
    const items = ["Pearl", "PreciousMetal", "Gemstone", "LinkingPart"];
    return { items };
  },
};
</script>

<style scoped></style>
