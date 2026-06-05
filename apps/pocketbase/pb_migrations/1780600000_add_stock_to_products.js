/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("products");

  const existingFieldNames = collection.fields.map(f => f.name);

  if (!existingFieldNames.includes("stock")) {
    collection.fields.push(new Field({
      "hidden": false,
      "id": "number9182736450",
      "name": "stock",
      "type": "number",
      "required": false,
      "presentable": false,
      "system": false,
      "min": 0,
      "max": null,
      "onlyInt": true
    }));
  }

  if (!existingFieldNames.includes("inStock")) {
    collection.fields.push(new Field({
      "hidden": false,
      "id": "bool8273645190",
      "name": "inStock",
      "type": "bool",
      "required": false,
      "presentable": false,
      "system": false
    }));
  }

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("products");
  collection.fields = collection.fields.filter(f => !["stock", "inStock"].includes(f.name));
  return app.save(collection);
})
