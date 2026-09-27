/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "id": "pbc_expenses",
    "name": "expenses",
    "type": "base",
    "system": false,
    "fields": [
      {
        "id": "date_date",
        "name": "date",
        "type": "date",
        "required": true,
        "system": false
      },
      {
        "id": "select_category",
        "name": "category",
        "type": "select",
        "required": true,
        "system": false,
        "values": ["ingredientes", "alquiler", "suministros", "equipamiento", "marketing", "personal", "impuestos", "envio", "otros"],
        "maxSelect": 1
      },
      {
        "id": "text_desc",
        "name": "description",
        "type": "text",
        "required": true,
        "system": false
      },
      {
        "id": "number_amount",
        "name": "amount",
        "type": "number",
        "required": true,
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
        "id": "file_receipt",
        "name": "receiptImage",
        "type": "file",
        "required": false,
        "system": false,
        "maxSelect": 1,
        "maxSize": 10485760,
        "mimeTypes": ["image/jpeg", "image/png", "image/webp", "application/pdf"]
      },
      {
        "id": "select_payment",
        "name": "paymentMethod",
        "type": "select",
        "required": false,
        "system": false,
        "values": ["efectivo", "tarjeta", "transferencia"],
        "maxSelect": 1
      },
      {
        "id": "bool_recurring",
        "name": "isRecurring",
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
  const collection = app.findCollectionByNameOrId("expenses");
  return app.delete(collection);
})
