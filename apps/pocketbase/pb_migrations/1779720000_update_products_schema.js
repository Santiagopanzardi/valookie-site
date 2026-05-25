/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3336081255");

  // Eliminar campo category antiguo
  collection.fields.removeById("select5903860459");

  // Agregar nuevos campos
  collection.fields.add(new Field({
    "hidden": false,
    "id": "select_categories",
    "name": "categories",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "select",
    "maxSelect": 5,
    "values": ["Cookie", "Cookie Vegana", "Sin Gluten", "Medialuna & Chipas", "Otros Dulces"]
  }));

  collection.fields.add(new Field({
    "hidden": false,
    "id": "number_originalPrice",
    "name": "originalPrice",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "number",
    "max": null,
    "min": 0,
    "onlyInt": false
  }));

  collection.fields.add(new Field({
    "hidden": false,
    "id": "bool_isPopular",
    "name": "isPopular",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "bool"
  }));

  collection.fields.add(new Field({
    "hidden": false,
    "id": "bool_isBestSeller",
    "name": "isBestSeller",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "bool"
  }));

  collection.fields.add(new Field({
    "hidden": false,
    "id": "bool_isGlutenFree",
    "name": "isGlutenFree",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "bool"
  }));

  collection.fields.add(new Field({
    "hidden": false,
    "id": "bool_isVegan",
    "name": "isVegan",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "bool"
  }));

  app.save(collection);

}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3336081255");

  collection.fields.removeById("select_categories");
  collection.fields.removeById("number_originalPrice");
  collection.fields.removeById("bool_isPopular");
  collection.fields.removeById("bool_isBestSeller");
  collection.fields.removeById("bool_isGlutenFree");
  collection.fields.removeById("bool_isVegan");

  collection.fields.add(new Field({
    "hidden": false,
    "id": "select5903860459",
    "name": "category",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "select",
    "maxSelect": 1,
    "values": ["cookie_type", "pack_size"]
  }));

  app.save(collection);
});
