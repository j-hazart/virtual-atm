const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  console.log("test");
  res.send("Hello World!");
});

const userControllers = require("./controllers/userControllers");
const cardControllers = require("./controllers/cardControllers");
const bankOperationControllers = require("./controllers/bankOperationControllers");
const {
  verifyPin,
  verifyPinToEdit,
  hashPin,
  verifyToken,
} = require("./services/auth");

router.post("/cards/verify", cardControllers.checkCardNumber);
router.post(
  "/login",
  cardControllers.getCardWithPinandPassToNext,
  userControllers.getUserAndPassToNext,
  verifyPin
);

router.use(verifyToken);

router.get("/users", userControllers.browse);
router.get("/users/:account", userControllers.read);
router.get("/users/:account/operations", userControllers.getUserOperations);
router.delete("/users/:account", userControllers.destroy);
router.put(
  "/users/:account/solde",
  userControllers.editSolde,
  bankOperationControllers.create
);
router.put(
  "/users/:account/card",
  verifyPinToEdit,
  hashPin,
  cardControllers.editPin
);

module.exports = router;
