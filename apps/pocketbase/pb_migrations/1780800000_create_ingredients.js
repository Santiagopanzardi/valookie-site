/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "id": "pbc_ingredients",
    "name": "ingredients",
    "type": "base",
    "system": false,
    "fields": [
      {
        "id": "text_name",
        "name": "name",
        "type": "text",
        "required": true,
        "system": false
      },
      {
        "id": "select_unit",
        "name": "unit",
        "type": "select",
        "required": true,
        "system": false,
        "values": ["g", "kg", "ml", "l", "unidad"],
        "maxSelect": 1
      },
      {
        "id": "number_cost",
        "name": "costPerUnit",
        "type": "number",
        "required": false,
        "system": false,
        "min": 0
      },
      {
        "id": "number_stock",
        "name": "currentStock",
        "type": "number",
        "required": false,
        "system": false,
        "min": 0
      },
      {
        "id": "number_minstock",
        "name": "minStock",
        "type": "number",
        "required": false,
        "system": false,
        "min": 0
      },
      {
        "id": "text_supplier",
        "name": "supplier",
        "type": "text",
        "required": false,
        "system": false
      },
      {
        "id": "select_category",
        "name": "category",
        "type": "select",
        "required": false,
        "system": false,
        "values": ["harinas", "grasas", "azucares", "chocolates", "lacteos", "frutos_secos", "otros"],
        "maxSelect": 1
      },
      {
        "id": "text_notes",
        "name": "notes",
        "type": "text",
        "required": false,
        "system": false
      }
    ],
    "listRule": '@request.auth.email = "admin@valookie.com" || @request.auth.email = "santiagopanzardi@gmail.com"',
    "viewRule": '@request.auth.email = "admin@valookie.com" || @request.auth.email = "santiagopanzardi@gmail.com"',
    "createRule": '@request.auth.email = "admin@valookie.com" || @request.auth.email = "santiagopanzardi@gmail.com"',
    "updateRule": '@request.auth.email = "admin@valookie.com" || @request.auth.email = "santiagopanzardi@gmail.com"',
    "deleteRule": '@request.auth.email = "admin@valookie.com" || @request.auth.email = "santiagopanzardi@gmail.com"',
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("ingredients");
  return app.delete(collection);
})
