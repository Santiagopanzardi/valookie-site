/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const products = app.findRecordsByFilter("products", "inStock = false || inStock = null", "", 0, 0);
  products.forEach((product) => {
    product.set("inStock", true);
    product.set("stock", 99);
    app.save(product);
  });
})
