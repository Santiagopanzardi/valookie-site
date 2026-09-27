/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "id": "pbc_recipes",
    "name": "recipes",
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
        "id": "text_productid",
        "name": "productId",
        "type": "text",
        "required": false,
        "system": false
      },
      {
        "id": "number_yield",
        "name": "yield",
        "type": "number",
        "required": true,
        "system": false,
        "min": 1
      },
      {
        "id": "json_ingredients",
        "name": "ingredients",
        "type": "json",
        "required": false,
        "system": false
      },
      {
        "id": "number_labor",
        "name": "laborCostPerBatch",
        "type": "number",
        "required": false,
        "system": false,
        "min": 0
      },
      {
        "id": "number_overhead",
        "name": "overheadPerBatch",
        "type": "number",
        "required": false,
        "system": false,
        "min": 0
      },
      {
        "id": "bool_active",
        "name": "isActive",
        "type": "bool",
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
  const collection = app.findCollectionByNameOrId("recipes");
  return app.delete(collection);
})
