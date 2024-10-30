// store/cartStore.js
import { reactive } from "vue";

const state = reactive({
  items: [],
  contCartITems: 0,
});

const addToCart = (item) => {
  const existingItem = state.items.find((i) => i.id === item.id);
  if (existingItem) {
    existingItem.quantity += 1;
    state.contCartITems += 1;
  } else {
    state.items.push({ ...item, quantity: 1 , image_names: item.image_names.split(",")[0]});
    state.contCartITems += 1;
  }
};

const removeFromCart = (item) => {
  const existingItem = state.items.find((i) => i.id === item.id);
  if (existingItem) {
    if (existingItem.quantity > 1) {
      existingItem.quantity -= 1;
      state.contCartITems -= 1;
    } else {
      state.items = state.items.filter((i) => i.id !== item.id);
      state.contCartITems -= 1;
    }
  }
};


export default {
  state,
  addToCart,
  removeFromCart,
};
