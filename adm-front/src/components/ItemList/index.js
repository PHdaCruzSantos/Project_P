// const images = [
//   "Name=Dell-XPS-13-Black.png",
//   "Name=Dell-XPS-13-White.png",
//   "Name=Dell-XPS-15-Black.png",
//   "Name=Headphones.png",
//   "Name=Iphone-12-01.png",
//   "Name=Iphone-12-02.png ",
//   "Name=Iphone-12-03.png",
//   "Name=Iphone-12-04.png ",
//   "Name=Iphone-12-Pro-01.png",
//   "Name=Iphone-12-Pro-02.png",
//   "Name=Iphone-13-Pro-01.png",
//   "Name=Iphone-13-Pro-02.png",
//   "Name=Iphone-13-Pro-03.png",
//   "Name=Macbook.png",
//   "Name=Samsung-Note21.png",
//   "Name=Samsung-S21-Pro.png",
//   "Name=Samsung-S21.png",
//   "Name=Watch.png",
// ];

const items = [];

for (let i = 0; i < 13; i++) {
  const id = i;
  const name = `Item ${id}`;
  const description = `Description for item ${id}`;
  const image = `../../assets/images/items/${i}.png`;
  // recebe tipo A caso id seja par e B caso seja impar
  const type = id % 2 === 0 ? "A" : "B";

  items.push({
    id,
    name,
    description,
    image,
    type,
  });
}

console.log(items);

export function ItemList() {
  return items;
}
