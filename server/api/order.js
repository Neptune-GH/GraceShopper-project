const router = require('express').Router();
const { models: { Poster,User,Order,CartDetail }} = require('../db')


//GET /api/order/:userId
router.get("/:userId", async (req, res, next) => {
    try {
      const order = await Order.findAll({
          where: {
              userId: req.params.userId,
              isComplete: false
            }});
      const currentOrderId = JSON.stringify(order[0].id)
      const  openOrder = await Order.findByPk(currentOrderId)
      const cartPosters = await CartDetail.findAll({
          where: {
              orderId: currentOrderId
          }, 
          include: Poster,
      })
      res.send({
        openOrder,
        cartPosters
    })
    } catch (error) {
      next(error);
    }
  });

//GET /api/order/:userId/:orderId
router.get("/:userId/:orderId", async (req, res, next) => {
    try {
      const order = await Order.findByPk(req.params.orderId)
      res.send(order);
    } catch (error) {
      next(error);
    }
  });

//PUT /api/order/:userId/:orderId
router.put("/:userId/:orderId", async (req, res, next) => {
    try {
      const completeOrder = await Order.update(
        { isComplete: true },
        { where: { id: req.params.orderId } }
      )
      res.send(completeOrder);
    } catch (error) {
      next(error);
    }
  });


module.exports = router;
