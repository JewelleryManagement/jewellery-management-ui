<template>
  <v-container>
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

        <strong>Part of Sale: </strong>
        <part-of-product
          :partOfProduct="currentProductInfo.partOfSale"
          routerPreFix="sales"
        />
        <bar-code :productionNumber="currentProductInfo.productionNumber" />

        <picture-button @picture-selected="handlePictureSelected" />

        <div class="d-flex justify-center mt-10">
          <v-btn
            color="red"
            @click="openDialog('resources')"
            :size="isMediumScreen() ? 'x-small' : 'default'"
            @click.stop
            >Resources</v-btn
          >
          <v-btn
            color="green"
            @click="openDialog('products')"
            :size="isMediumScreen() ? 'x-small' : 'default'"
            @click.stop
            >Products</v-btn
          >
          <v-btn
            v-if="currentProductInfo.partOfSale"
            color="#673AB7"
            @click="openDialog('products')"
            :size="isMediumScreen() ? 'x-small' : 'default'"
            @click.stop
            >Sale Return</v-btn
          >
        </div>
      </div>
    </v-card>

    <resource-content-dialog
      v-if="isResourceDialogOpen"
      v-model="isResourceDialogOpen"
      :data="currentProductInfo"
      @close-dialog="closeDialog('resources')"
    ></resource-content-dialog>

    <products-content-dialog
      v-if="isProductsDialogOpen"
      v-model="isProductsDialogOpen"
      :data="currentProductInfo"
      @close-dialog="closeDialog('products')"
    >
    </products-content-dialog>
  </v-container>
</template>

<script setup>
import { isMediumAndDownScreen, isMediumScreen } from "@/utils/display";
import { onMounted } from "vue";
import { ref, computed, inject } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
const snackbarProvider = inject("snackbarProvider");
const isResourceDialogOpen = ref(false);
const isProductsDialogOpen = ref(false);
const defaultPicture = require("@/assets/no-pic.png");
const store = useStore();
const route = useRoute();
const picture = ref(null);
const currentProductId = route.params.productId;
const currentProductInfo = computed(
  () => store.getters["products/allProducts"]
).value.find((product) => product.id === currentProductId);

onMounted(() => {
  fetchAndUpdatePictureUrl();
});

const openDialog = (content) => {
  if (content == "resources") {
    isResourceDialogOpen.value = true;
  } else {
    isProductsDialogOpen.value = true;
  }
};

const closeDialog = (content) => {
  if (content === "resources") {
    isResourceDialogOpen.value = false;
  } else {
    isProductsDialogOpen.value = false;
  }
};

const fetchAndUpdatePictureUrl = async () => {
  try {
    const newPictureUrl = await store.dispatch(
      "products/getPicture",
      currentProductId
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
      "Successfully added picture to the product!"
    );
  } catch (error) {
    snackbarProvider.showErrorSnackbar(error?.response?.data?.error);
  }
};
</script>
