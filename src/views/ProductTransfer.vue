<template>
    <div>
        {{productId}}
    </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();

const productId = route.params.productId
</script>
