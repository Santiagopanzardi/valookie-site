/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("orders");

  collection.createRule = "";

  const existingFieldNames = collection.fields.map(f => f.name);

  if (!existingFieldNames.includes("stripeSessionId")) {
    collection.fields.push(new Field({
      "hidden": false,
      "id": "text8837261940",
      "name": "stripeSessionId",
      "type": "text",
      "required": false,
      "presentable": false,
      "system": false,
      "autogeneratePattern": "",
      "max": 0,
      "min": 0,
      "pattern": ""
    }));
  }

  if (!existingFieldNames.includes("customerEmail")) {
    collection.fields.push(new Field({
      "hidden": false,
      "id": "email7742195830",
      "name": "customerEmail",
      "type": "email",
      "required": false,
      "presentable": false,
      "system": false,
      "exceptDomains": [],
      "onlyDomains": []
    }));
  }

  if (!existingFieldNames.includes("customerName")) {
    collection.fields.push(new Field({
      "hidden": false,
      "id": "text6629384710",
      "name": "customerName",
      "type": "text",
      "required": false,
      "presentable": false,
      "system": false,
      "autogeneratePattern": "",
      "max": 0,
      "min": 0,
      "pattern": ""
    }));
  }

  if (!existingFieldNames.includes("customerPhone")) {
    collection.fields.push(new Field({
      "hidden": false,
      "id": "text5518273690",
      "name": "customerPhone",
      "type": "text",
      "required": false,
      "presentable": false,
      "system": false,
      "autogeneratePattern": "",
      "max": 0,
      "min": 0,
      "pattern": ""
    }));
  }

  const userIdField = collection.fields.find(f => f.name === "userId");
  if (userIdField) {
    userIdField.required = false;
  }

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("orders");
  collection.createRule = "@request.auth.id != \"\"";

  const userIdField = collection.fields.find(f => f.name === "userId");
  if (userIdField) {
    userIdField.required = true;
  }

  collection.fields = collection.fields.filter(f =>
    !["stripeSessionId", "customerEmail", "customerName", "customerPhone"].includes(f.name)
  );

  return app.save(collection);
})
