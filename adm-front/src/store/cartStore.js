// store/cartStore.js
import { reactive } from "vue";

const state = reactive({
  items: [],
});

const addToCart = (item) => {
  const existingItem = state.items.find((i) => i.id === item.id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    state.items.push({ ...item, quantity: 1 });
  }
};

const removeFromCart = (item) => {
  const existingItem = state.items.find((i) => i.id === item.id);
  if (existingItem) {
    if (existingItem.quantity > 1) {
      existingItem.quantity -= 1;
    } else {
      state.items = state.items.filter((i) => i.id !== item.id);
    }
  }
};

export default {
  state,
  addToCart,
  removeFromCart,
};
