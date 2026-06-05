/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("orders");

  collection.listRule = "userId = @request.auth.id || @request.auth.email = 'admin@valookie.com' || @request.auth.email = 'santiagopanzardi@gmail.com'";
  collection.viewRule = "userId = @request.auth.id || @request.auth.email = 'admin@valookie.com' || @request.auth.email = 'santiagopanzardi@gmail.com'";
  collection.updateRule = "userId = @request.auth.id || @request.auth.email = 'admin@valookie.com' || @request.auth.email = 'santiagopanzardi@gmail.com'";

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("orders");

  collection.listRule = "userId = @request.auth.id";
  collection.viewRule = "userId = @request.auth.id";
  collection.updateRule = "userId = @request.auth.id";

  return app.save(collection);
})
