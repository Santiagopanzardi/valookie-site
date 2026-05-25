/// <reference path="../database-types.d.ts" />

migrate((app) => {
  const collection = app.findCollectionByNameOrId("products");

  // Cambiar campo category de select a JSON (array de categorías)
  const categoryField = collection.fields.getByName("category");
  if (categoryField) {
    collection.fields.remove(categoryField.id);
  }

  // Nuevo campo categories (multi-select)
  const categoriesField = new Field({
    type: "select",
    name: "categories",
    required: false,
    maxSelect: 6,
    values: [
      "Cookie",
      "Cookie Vegana",
      "Sin Gluten",
      "Medialuna & Chipas",
      "Otros Dulces"
    ]
  });
  collection.fields.add(categoriesField);

  // Precio anterior (para mostrar tachado)
  const originalPriceField = new Field({
    type: "number",
    name: "originalPrice",
    required: false,
    min: 0
  });
  collection.fields.add(originalPriceField);

  // Cookie popular
  const isPopularField = new Field({
    type: "bool",
    name: "isPopular",
    required: false
  });
  collection.fields.add(isPopularField);

  // Más vendida del mes
  const isBestSellerField = new Field({
    type: "bool",
    name: "isBestSeller",
    required: false
  });
  collection.fields.add(isBestSellerField);

  // Sin gluten
  const isGlutenFreeField = new Field({
    type: "bool",
    name: "isGlutenFree",
    required: false
  });
  collection.fields.add(isGlutenFreeField);

  // Vegana
  const isVeganField = new Field({
    type: "bool",
    name: "isVegan",
    required: false
  });
  collection.fields.add(isVeganField);

  app.save(collection);
}, (app) => {
  // Rollback
  const collection = app.findCollectionByNameOrId("products");

  for (const name of ["categories", "originalPrice", "isPopular", "isBestSeller", "isGlutenFree", "isVegan"]) {
    const field = collection.fields.getByName(name);
    if (field) collection.fields.remove(field.id);
  }

  const categoryField = new Field({
    type: "select",
    name: "category",
    required: false,
    maxSelect: 1,
    values: ["cookie_type", "pack_size"]
  });
  collection.fields.add(categoryField);

  app.save(collection);
});
