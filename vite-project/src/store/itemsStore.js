import { reactive } from "vue";

const state = reactive({
  items: [
    {
      id: 1,
      name: "Item 1",
      description: "Description 1",
      price: 100,
      img: "1.png",
      tipo: "B",
    },
    {
      id: 2,
      name: "Item 2",
      description: "Description 2",
      price: 200,
      img: "2.png",
      tipo: "A",
    },
    {
      id: 3,
      name: "Item 3",
      description: "Description 3",
      price: 300,
      img: "3.png",
      tipo: "B",
    },
    {
      id: 4,
      name: "Item 4",
      description: "Description 4",
      price: 400,
      img: "4.png",
      tipo: "A",
    },
    {
      id: 5,
      name: "Item 5",
      description: "Description 5",
      price: 500,
      img: "5.png",
      tipo: "B",
    },
    {
      id: 6,
      name: "Item 6",
      description: "Description 6",
      price: 600,
      img: "6.png",
      tipo: "A",
    },
    {
      id: 7,
      name: "Item 7",
      description: "Description 7",
      price: 700,
      img: "7.png",
      tipo: "B",
    },
    {
      id: 8,
      name: "Item 8",
      description: "Description 8",
      price: 800,
      img: "8.png",
      tipo: "A",
    },
    {
      id: 9,
      name: "Item 9",
      description: "Description 9",
      price: 900,
      img: "9.png",
      tipo: "B",
    },
    {
      id: 10,
      name: "Item 10",
      description: "Description 10",
      price: 1000,
      img: "10.png",
      tipo: "A",
    },
  ],
});

const addItem = (newItem) => {
  console.log("addItem", newItem);
  console.log("Items", state.items.length);
  state.items.push({ ...newItem, id: state.items.length + 1 });
};

const updateItem = (updatedItem) => {
  const index = state.items.findIndex((item) => item.id === updatedItem.id);
  if (index !== -1) {
    state.items[index] = updatedItem;
  }
};

const getItems = () => {
  console.log("getItems", state.items);
  return state.items;
};

const getItemById = (id) => {
  return state.items.find((item) => item.id === id);
};

const getItemsByType = (type) => {
  return state.items.filter((item) => item.tipo === type);
};

const getImages = () => {
  return require.context("../assets/images/items", false, /\.png$/);
};

export default {
  state,
  addItem,
  updateItem,
  getItems,
  getItemById,
  getItemsByType,
};
