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
      v-if="selectedButton === 'Resources'"
      :tableColumns="tableColumnsResources"
      :resources="getResourcesWithQuantity()"
      name="Resources Part Of Product"
    ></resource-availability-table>

    <products-table
      v-if="selectedButton === 'Products'"
      :products="currentProductInfo.productsContent"
      title="Products Part Of Product"
    >
    </products-table>

    <EventsTable
      v-if="selectedButton === 'Events'"
      :headers="eventHeaders"
      :items="events"
    >
    </EventsTable>
  </div>
</template>

<script setup>
import { isMediumAndDownScreen } from "@/utils/display";
import ToggleTableButtons from "@/components/Button/ToggleTableButtons.vue";
import ResourceAvailabilityTable from "@/components/Table/ResourceAvailabilityTable.vue";
import ProductsTable from "@/components/Table/ProductsTable.vue";
import EventsTable from "@/components/Table/EventsTable.vue";
import TextButton from "@/components/Button/TextButton.vue";
import { onMounted } from "vue";
import { ref, computed, inject } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { useProductsStore } from "@/store/products";
import { useSystemEventsStore } from "@/store/systemEvents";

const snackbarProvider = inject("snackbarProvider");
const defaultPicture = require("@/assets/no-pic.png");
const store = useStore();
const systemEventsStore = useSystemEventsStore();
const productsStore = useProductsStore();
const route = useRoute();
const picture = ref(null);
const currentProductId = route.params.id;
const currentProductInfo = computed(() => productsStore.selectedProduct);

onMounted(() => {
  fetchAndUpdatePictureUrl();
});

const fetchAndUpdatePictureUrl = async () => {
  try {
    const newPictureUrl = await productsStore.getPicture(currentProductId);
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
    await productsStore.postPicture({ productId: id, image });
    snackbarProvider.showSuccessSnackbar(
      "Successfully added picture to the product!",
    );
  } catch (error) {
    snackbarProvider.showErrorSnackbar(error?.response?.data?.error);
  }
};

const selectedButton = ref("");

const tableButtons = computed(() => productsStore.tableButtons);

const tableColumnsResources = computed(
  () => store.getters["resources/getTableColumnsWithQuantity"],
);

const getResourcesWithQuantity = () => {
  return currentProductInfo.value.resourcesContent.map((item) => ({
    quantity: item.quantity,
    ...item.resource,
  }));
};

const events = await systemEventsStore.getEventsRelatedTo(currentProductId);

const eventHeaders = computed(() => systemEventsStore.eventHeaders);
</script>
