<template>
  <v-container class="my-12" fluid>
    <v-card class="mx-auto pa-10" width="800" height="auto">
      <template v-slot:title>
        <div class="mx-auto text-center" style="font-size: 24px">
          {{ pageTitle }}
        </div>
      </template>

      <v-sheet width="300" class="mx-auto">
        <v-form ref="form" @submit.prevent="handleSubmit">
          <v-text-field
            v-model="productName"
            label="Product name"
            :rules="useTextFieldRules()"
          ></v-text-field>

          <v-text-field
            v-model="description"
            label="Description of the product"
            :rules="useTextAreaFieldRules()"
          ></v-text-field>

          <v-text-field
            label="Author"
            v-model="authorInput"
            :error="authorsValidation"
          >
            <template v-slot:append>
              <v-icon @click="addAuthorHandler">mdi-plus</v-icon>
            </template>
          </v-text-field>

          <div>
            <v-chip
              v-for="(author, index) in authors"
              :key="index"
              closable
              @click="removeAuthor(index)"
            >
              {{ author }}
            </v-chip>
          </div>

          <v-text-field
            class="mt-4"
            v-model="salePrice"
            label="Sale price"
            :rules="useNumberFieldRules()"
          ></v-text-field>

          <!-- DIALOG -->
          <!-- <v-dialog transition="dialog-top-transition" width="auto">
            <template v-slot:activator="{ props }">
              <v-btn color="primary" v-bind="props" block
                >Select resources</v-btn
              >
            </template>
            <template v-slot:default="{ isActive }">
              <v-card>
                <v-toolbar color="red" title="Reasources..."></v-toolbar>
                <v-card-text>
                  <v-data-table
                    :headers="tableColumns"
                    :items="resources"
                    class="elevation-1"
                  >
                    <template v-slot:item.add="{ item }">
                      <v-icon color="blue" @click="addHandler(item)"
                        >mdi-plus</v-icon
                      >
                    </template>
                  </v-data-table>
                </v-card-text>

                <v-card-actions class="justify-end">
                  <v-btn
                    color="red"
                    variant="text"
                    @click="isActive.value = false"
                    >Close</v-btn
                  >
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>

          <v-dialog v-model="dialogVisible" max-width="500">
            <v-card>
              <v-card-title> Add Item </v-card-title>
              <v-card-text>
                <v-text-field label="Name"></v-text-field>
                <v-text-field label="Description"></v-text-field>
              </v-card-text>
            </v-card>
          </v-dialog> -->

              <v-btn color="primary" @click="dialog = true" block>
                Open Dialog 1
              </v-btn>
              <v-dialog
                v-model="dialog"
                transition="dialog-top-transition"
                width="auto"
              >
                <template v-slot:default="{ isActive }">
                  <v-card>
                    <v-toolbar color="red" title="Reasources..."></v-toolbar>
                    <v-card-text>
                      <v-data-table
                        :headers="tableColumns"
                        :items="resources"
                        class="elevation-1"
                      >
                        <template v-slot:item.add="{ item }">
                          <v-icon color="blue" @click="addHandler(item), dialog2 = true " 
                            >mdi-plus</v-icon
                          >
                        </template>
                      </v-data-table>
                    </v-card-text>

                    <v-card-actions class="justify-end">
                      <v-btn
                        color="red"
                        variant="text"
                        @click="isActive.value = false"
                        >Close</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </template>
              </v-dialog>

              <v-dialog v-model="dialog2" width="auto">
                <v-card>
                  <v-card-title> Resource: {{ selectedResource.clazz }} Quantity: {{ selectedResource.quantity }}  </v-card-title>
     
                  <v-card-actions>
                    <v-btn
                      color="primary"
                      variant="text"
                      @click="dialog2 = false"
                    >
                      Close
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>

          <div class="d-flex flex-column">
            <v-btn color="success" class="mt-4" block type="submit">
              Submit
            </v-btn>

            <v-btn color="error" class="mt-4" block @click="resetForm">
              Reset
            </v-btn>

            <v-btn color="warning" class="mt-4" block @click="router.go(-1)">
              Go Back
            </v-btn>
          </div>
        </v-form>
      </v-sheet>
    </v-card>
  </v-container>
</template>

<script setup>
const props = defineProps(["VDataTable"]);
import {
  useTextFieldRules,
  useNumberFieldRules,
  useTextAreaFieldRules,
} from "@/utils/validation-rules";
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { VDataTable } from "vuetify/labs/VDataTable";
const dialog = ref(false);
const dialog2 = ref(false);

const store = useStore();
const resources = computed(() => store.getters["resources/allResources"]);

const tableColumns = [
  computed(() => store.state.resources.tableColumnAdd).value,
  computed(() => store.state.resources.tableColumnQuantity).value,
  ...computed(() => store.state.resources.tableColumns).value,
];
const route = useRoute();
const router = useRouter();
const pageTitle = ref(route.meta.title);
const userId = computed(() => store.getters["auth/getUser"]).value.id;
const [
  form,
  productName,
  description,
  authorInput,
  authors,
  salePrice,
  authorsValidation,
] = [ref(null), ref(""), ref(""), ref(""), ref([]), ref(""), ref(false)];

const addAuthorHandler = () => {
  if (authorInput.value === "") return;
  authors.value.push(authorInput.value);
  authorInput.value = "";
};

const removeAuthor = (index) => {
  authors.value.splice(index, 1);
};

const resetForm = () => {
  if (form.value) {
    form.value.reset();
    form.value.resetValidation();
    authors.value = [];
    authorsValidation.value = false;
  }
};

async function handleSubmit() {
  const { valid } = await form.value.validate();

  if (authors.value.length <= 0) {
    authorsValidation.value = true;
    return;
  }
  console.log(valid);
}

const selectedResource = ref(null)

const addHandler = (item) => {
  selectedResource.value = item.raw
  // selectedResource.value = {
  //   id: item.raw.id,
  //   quantity: item.raw.quantity,
  // };
  console.log(selectedResource);
};
</script>

<!-- {
    "name": "Classical white pearl necklace",
    "description": "Details about the necklace",
    "ownerId": "349c35ea-9d64-417b-882e-c017d85d7249",
    "authors": ["GoldWorker1", "GoldWorker2"],
    "salePrice": "240",
    "resourcesContent": [
        {
            "resourceId": "ae90c61b-d55f-485c-8929-411eec5b1354",
            "quantity": 2
        },
        {
            "resourceId": "e28a891e-df13-40ef-9e51-ce313c52f6fd",
            "quantity": 5
        },
        {
            "resourceId": "e28a891e-df13-40ef-9e51-ce313c52f6fd",
            "quantity": 5
        }, 
        {
            "resourceId": "0e49b1c0-f60f-4154-99cd-4f9ddf80b163",
            "quantity": 1
        }
        
    ],
    "productsContent": [
        "g28a891r-df13-40eg-9e51-ce313h52f6fi",
        "g58a871r-df13-45eg-gh51-ce3t8h52fh6k"
    ]
} -->
