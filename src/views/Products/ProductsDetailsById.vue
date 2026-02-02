<template>
  <div>
    <v-card
      class="d-flex flex-lg-row flex-md-row flex-column justify-space-between mx-auto mt-10"
      elevation="8"
      rounded="lg"
      max-width="1000"
    >
      <v-img
        :lazy-src="defaultPicture"
        :src="picture"
        cover
        :max-width="isMediumAndDownScreen() ? '100%' : '60%'"
      ></v-img>

      <div class="d-flex flex-column align-center my-4 w-auto">
        <div>
          <strong>Catalog Number:</strong>
          {{ currentProductInfo.catalogNumber }}
        </div>
        <div>
          <strong>Description:</strong> {{ currentProductInfo.description }}
        </div>
        <div class="d-flex">
          <strong>Owner:&nbsp;</strong
          ><user-tool-tip :user="currentProductInfo.owner" />
        </div>
        <div>
          <strong>Authors:&nbsp;</strong>
          <user-tool-tip
            :user="author"
            v-for="(author, index) in currentProductInfo.authors"
            :key="author"
            @click.stop
          >
            <template v-if="index < currentProductInfo.authors.length - 1"
              >&comma;&nbsp;</template
            >
          </user-tool-tip>
        </div>
        <div>
          <strong>Content of:</strong>
          <part-of-product
            :partOfProduct="currentProductInfo.contentOf"
            routerPreFix="products"
          />
        </div>

        <div>
          <strong>Part of Sale: </strong>
          <part-of-product
            :partOfProduct="currentProductInfo.partOfSale"
            routerPreFix="sales"
          />
        </div>

        <div>
          <strong>Additional Price: </strong>
          <span>€{{ currentProductInfo.additionalPrice.toFixed(2) }}</span>
        </div>

        <div>
          <strong>Sale Price: </strong>
          <span>€{{ currentProductInfo.salePrice.toFixed(2) }}</span>
        </div>

        <bar-code :productionNumber="currentProductInfo.productionNumber" />

        <picture-button @picture-selected="handlePictureSelected" />

        <div class="d-flex justify-center mt-10">
          <text-button
            v-if="!currentProductInfo.partOfSale"
            color="#03A9F4"
            text="Edit product"
            :path="`/products/edit/${currentProductId}`"
          />

          <return-product-button :currentProductInfo="currentProductInfo" />
        </div>
      </div>
    </v-card>

    <ToggleTableButtons v-model="selectedButton" :buttons="tableButtons" />

    <resource-availability-table
      v-if="selectedButton === tableButtons[0].label"
      :tableColumns="tableColumnsResources"
      :resources="getResourcesWithQuantity()"
      name="Resources Part Of Product"
    ></resource-availability-table>

    <products-table
      v-if="selectedButton === tableButtons[1].label"
      :products="currentProductInfo.productsContent"
      title="Products Part Of Product"
    >
    </products-table>

    <EventsTable
      v-if="selectedButton === tableButtons[2].label"
      :headers="eventHeaders"
      :items="events"
    >
    </EventsTable>
  </div>
</template>

<script setup>
import { isMediumAndDownScreen, isMediumScreen } from "@/utils/display";
import ToggleTableButtons from "@/components/Button/ToggleTableButtons.vue";
import ResourceAvailabilityTable from "@/components/Table/ResourceAvailabilityTable.vue";
import ProductsTable from "@/components/Table/ProductsTable.vue";
import EventsTable from "@/components/Table/EventsTable.vue";
import TextButton from "@/components/Button/TextButton.vue";
import { onMounted } from "vue";
import { ref, computed, inject } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

const snackbarProvider = inject("snackbarProvider");
const defaultPicture = require("@/assets/no-pic.png");
const store = useStore();
const route = useRoute();
const picture = ref(null);
const currentProductId = route.params.productId;
const currentProductInfo = computed(
  () => store.getters["products/allProducts"],
).value.find((product) => product.id === currentProductId);

onMounted(() => {
  fetchAndUpdatePictureUrl();
});

const fetchAndUpdatePictureUrl = async () => {
  try {
    const newPictureUrl = await store.dispatch(
      "products/getPicture",
      currentProductId,
    );
    picture.value = newPictureUrl || defaultPicture;
  } catch (error) {
    snackbarProvider.showErrorSnackbar(error?.response?.data?.error);
  }
};

const handlePictureSelected = async (newPicture) => {
  if (!newPicture) return;

  await postPicture(currentProductId, newPicture);
  await fetchAndUpdatePictureUrl();
};

const postPicture = async (id, image) => {
  try {
    await store.dispatch("products/postPicture", { productId: id, image });
    snackbarProvider.showSuccessSnackbar(
      "Successfully added picture to the product!",
    );
  } catch (error) {
    snackbarProvider.showErrorSnackbar(error?.response?.data?.error);
  }
};

const selectedButton = ref("");

const tableButtons = computed(() => store.getters["products/getTableButtons"]);

const tableColumnsResources = computed(
  () => store.getters["users/getTableColumnsWithQuantity"],
);

const getResourcesWithQuantity = () => {
  return currentProductInfo.resourcesContent.map((item) => ({
    quantity: item.quantity,
    ...item.resource,
  }));
};

const events = await store.dispatch(
  "systemEvents/getEventsRelatedTo",
  currentProductId,
);

const eventHeaders = computed(() => store.getters["systemEvents/eventHeaders"]);
</script>
