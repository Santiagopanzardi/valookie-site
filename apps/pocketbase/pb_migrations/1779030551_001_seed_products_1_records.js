/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("products");

  const record0 = new Record(collection);
    record0.set("name", "Cookie Pistacho");
    record0.set("price", 3.9);
    record0.set("description", "Cookie con pistacho en la masa, relleno y topping cremoso de pistacho, y pistachos troceados. \ud83d\udc9a La m\u00e1s vendida de diciembre y favorita de enero. Horneada en el d\u00eda.");
    record0.set("ingredients", "Pistacho, harina, mantequilla, az\u00facar, huevo, vainilla, sal, levadura");
    record0.set("allergens", "Contiene frutos secos (pistacho)");
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
