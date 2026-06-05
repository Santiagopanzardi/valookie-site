/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const superusers = app.findCollectionByNameOrId("_superusers");
  const email = $os.getenv("PB_SUPERUSER_EMAIL");
  const password = $os.getenv("PB_SUPERUSER_PASSWORD");

  if (!email || !password) {
    console.log("PB_SUPERUSER_EMAIL or PB_SUPERUSER_PASSWORD not set, skipping");
    return;
  }

  let record;
  try {
    record = app.findFirstRecordByFilter(superusers.id, `email = '${email}'`);
    record.set("password", password);
  } catch (e) {
    record = new Record(superusers);
    record.set("email", email);
    record.set("password", password);
  }

  app.save(record);
  console.log("Superuser created/updated:", email);
})
