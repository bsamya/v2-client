import { writeBatch, arrayUnion, arrayRemove, setDoc, onSnapshot, collection, doc, query, where } from 'firebase/firestore';

export const useProductStore = defineStore('product', () => {
  const data = ref<Product[]>([]);
  const availableTags = ref<string[]>([]);
  const isReady = ref(false);
  const companyStore = useCompanyStore();
  // Derive companyId from the company store to avoid typing issues with direct property access

  const product = ref<Product>({
    productId: crypto.randomUUID(),
    hsCode: "",
    name: "",
    isDeleted: false,
  });

  const selectedProducts = ref<string[]>([]);
  const selectedTags = ref<string[]>([]);

  // Filter products by tags
  const productTagFilters = ref<string[]>([]);
  const filteredProducts = computed(() => {
    if (productTagFilters.value.length === 0) {
      return data.value;
    } else {
      return data.value.filter(productItem => {
        return productTagFilters.value.some(tag => (productItem.tags || []).includes(tag));
      });
    }
  });


  //tag color for filter badge  
  const tagColor = computed(() => {
    if (productTagFilters.value.length === 0) {
      return 'grey';
    } else if (productTagFilters.value.length > 0 && filteredProducts.value.length > 0) {
      return 'success';
    } else {
      return 'warning';
    }
  });

  // Store snapshot unsubscribe functions here
  let unsubscribeItems: (() => void) | null = null;
  let unsubscribeTags: (() => void) | null = null;


  watch(() => companyStore.activeCompanyId, (companyId) => {
    if (unsubscribeItems) unsubscribeItems();
    if (unsubscribeTags) unsubscribeTags();

    data.value = [];
    availableTags.value = [];
    isReady.value = false;

    if (!companyId) return;

    const { $db } = useNuxtApp();
    const itemsCol = collection($db, `products/${companyId}/items`);
    const q = query(itemsCol, where('isDeleted', '==', false)); // ← only alive docs

    unsubscribeItems = onSnapshot(q, (snapshot) => {
      data.value = snapshot.docs.map(d => d.data() as Product) ?? [];
      isReady.value = true;
    });

    const docRef = doc($db, `products/${companyId}`);
    unsubscribeTags = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        availableTags.value = snapshot.data().tags ?? [];
      }
    });
  }, { immediate: true });




  function addProduct(): Promise<void> {
    return new Promise((resolve) => {
      product.value = {
        productId: crypto.randomUUID(),
        hsCode: "",
        name: "",
        isDeleted: false,
      }
      resolve()
    })
  }

  function setProduct() {
    const { $db } = useNuxtApp();
    const itemRef = doc($db, `products/${companyStore.activeCompanyId}/items`, product.value.productId);
    return setDoc(itemRef, product.value);
  }

  function setTag(tag: string) {
    const { $db } = useNuxtApp();
    const docRef = doc($db, `products`, `${companyStore.activeCompanyId}`);
    return setDoc(docRef, { tags: arrayUnion(tag) }, { merge: true })
  }


  function tag(): Promise<void> {
    const tags = selectedTags.value.map(t => t?.trim()).filter(Boolean)
    if (!tags.length || !selectedProducts.value.length) return Promise.resolve()

    const { $db } = useNuxtApp();
    const batch = writeBatch($db)

    data.value
      .filter(p => selectedProducts.value.includes(p.productId))
      .forEach(p => {
        const newTags = Array.from(new Set([...(p.tags || []), ...tags]))
        p.tags = newTags
        const ref = doc($db, `products/${companyStore.activeCompanyId}/items`, p.productId)
        batch.set(ref, { tags: newTags }, { merge: true })
      })
    selectedTags.value = []
    return batch.commit()
  }


  function untag(): Promise<void> {
    const ids = selectedProducts.value
    const tags = selectedTags.value.map(t => t?.trim()).filter(Boolean)

    if (!ids.length || !tags.length) return Promise.resolve()

    console.log("Untagging tags:", tags, "from products:", ids)

    const { $db } = useNuxtApp();
    const batch = writeBatch($db)

    data.value
      .filter(p => ids.includes(p.productId))
      .forEach((p) => {
        // Optimistic local update
        p.tags = (p.tags || []).filter(tag => !tags.includes(tag))

        const ref = doc($db, `products/${companyStore.activeCompanyId}/items`, p.productId)
        batch.set(ref, { tags: arrayRemove(...tags) }, { merge: true })
      })
    selectedTags.value = []
    return batch.commit()
  }


  function editProduct(data: Product) {
    product.value = data;
  }

  function deleteSelectedProducts(): Promise<void> {
    console.log("Deleting products:", selectedProducts.value);
    console.log("From company:", companyStore.activeCompanyId);
    if (selectedProducts.value.length === 0) return Promise.resolve();
    if (!companyStore.activeCompanyId) return Promise.resolve();

    const { $db } = useNuxtApp();
    const batch = writeBatch($db);

    selectedProducts.value.forEach((productId) => {
      const docRef = doc($db, `products/${companyStore.activeCompanyId}/items`, productId);
      batch.set(docRef, { isDeleted: true }, { merge: true });
    });

    return batch.commit()
      .then(() => {
        // Clear selection after deletion
        selectedProducts.value = [];
      });
  }

  /**
   * ✅ Dispose / Release store resources
   */
  function dispose() {
    if (unsubscribeItems) unsubscribeItems();
    if (unsubscribeTags) unsubscribeTags();
    unsubscribeItems = null;
    unsubscribeTags = null;
    // Optional: clear data
    data.value = [];
    availableTags.value = [];
    isReady.value = false;
    // Optional: remove store reactivity entirely
    // store.$dispose(); (run this from outside the store)
  }

  return {
    data,
    availableTags,
    isReady,
    addProduct,
    product,
    setProduct,
    dispose,
    tag,
    untag,
    setTag,
    deleteSelectedProducts,
    editProduct,
    filteredProducts,
    productTagFilters,
    selectedProducts,
    selectedTags,
    tagColor
  };
});
