/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("products");

  const record0 = new Record(collection);
    record0.set("name", "Cookie Cl\u00e1sica Nutella");
    record0.set("price", 3.6);
    record0.set("description", "Masa cl\u00e1sica con chispas de chocolate, rellena con un coraz\u00f3n cremoso de Nutella. La cl\u00e1sica\u2026 pero mejorada.");
    record0.set("ingredients", "Masa de vainilla, chispas de chocolate, Nutella");
    record0.set("allergens", "Contiene: gluten, l\u00e1cteos, frutos secos (avellana)");
    record0.set("isFeatured", false);
  try {
    app.save(record0);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }
}, (app) => {
  // Rollback: record IDs not known, manual cleanup needed
})
