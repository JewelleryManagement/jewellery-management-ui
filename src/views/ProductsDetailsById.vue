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
        :src="picture ?? defaultPicture"
        cover
        :max-width="isMediumScreen() ? '100%': '60%'" 
      >
      </v-img>

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
          <strong>Content of:</strong> {{ currentProductInfo.contentOf }}
        </div>

        <strong>Part of Sale: </strong>
        <PartOfSale :partOfSale="currentProductInfo.partOfSale" description="N/A" />
        <bar-code :productionNumber="currentProductInfo.productionNumber" />

        <picture-button @picture-selected="handlePictureSelected" />

        <div class="d-flex justify-center mt-10">
          <v-btn color="red" @click="openDialog('resources')" @click.stop
            >Resources</v-btn
          >
          <v-btn color="green" @click="openDialog('products')" @click.stop
            >Products</v-btn
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
import { isMediumScreen } from "@/utils/display";
import { ref, computed, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import PartOfSale from "@/components/Tooltip/PartOfSale.vue";
const snackbarProvider = inject("snackbarProvider");
const isResourceDialogOpen = ref(false);
const isProductsDialogOpen = ref(false);
const defaultPicture = require("../assets/no-pic.png");
const store = useStore();
const route = useRoute();
const router = useRouter();

const currentProductId = route.params.productId;
const currentProductInfo = computed(
  () => store.getters["products/allProducts"]
).value.find((product) => product.id === currentProductId);
const picture =
  (await store.dispatch("products/getPicutre", currentProductId)) || null;

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

const handlePictureSelected = async (picture) => {
  if (!picture) return;

  await postPicture(currentProductId, picture);
  router.go();
};

const postPicture = async (id, image) => {
  try {
    await store.dispatch("products/postPicture", { productId: id, image });
    snackbarProvider.showSuccessSnackbar(
      "Successfully added picture to the product!"
    );
  } catch (error) {
    snackbarProvider.showErrorSnackbar(
      "Couldn't add the picture to the product!"
    );
  }
};
</script>
