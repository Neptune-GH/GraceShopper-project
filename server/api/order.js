const router = require("express").Router();
const {
  models: { Poster, Order, CartDetail },
} = require("../db");

//GET /api/order/:userId
router.get("/:userId", async (req, res, next) => {
  try {
    const order = await Order.findAll({
      where: {
        userId: req.params.userId,
        isComplete: false,
      },
    });
    const currentOrderId = JSON.stringify(order[0].id);
    const openOrder = await Order.findByPk(currentOrderId);
    const cartPosters = await CartDetail.findAll({
      where: {
        orderId: currentOrderId,
      },
      include: Poster,
    });
    res.send({
      openOrder,
      cartPosters,
    });
  } catch (error) {
    next(error);
  }
});

//GET /api/order/:userId/:posterId
  router.get("/:userId/:posterId", async (req, res, next) => {
    try {
      const order = await Order.findAll({
          where: {
              userId: req.params.userId,
              isComplete: false
            }});
      const currentOrderId = JSON.stringify(order[0].id)
      const [cartDetailPoster, created] = await CartDetail.findOrCreate({
          where: {
              orderId: currentOrderId,
              posterId: req.params.posterId
          }, 
          //include: Poster,
      })
        const oldNum = cartDetailPoster.quantity
        await cartDetailPoster.update({ quantity: oldNum +1 })
      await cartDetailPoster.save()
      res.send({
      cartDetailPoster, //cartdetail row, obj
      order}// order row, arr
    )
    } catch (error) {
      next(error);
    }
  });

//GET /api/order/:userId/:orderId
router.get("/:userId/:orderId", async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.orderId);
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
    );
    res.send(completeOrder);
  } catch (error) {
    next(error);
  }
});

// PUT api/order/:orderId/:posterId
// axios.put(`/api/order/${userId}/${orderId}/${posterId}`, poster)
router.put("/:userId/:orderId/:posterId", async (req, res, next) => {
  try {
    const posterToEdit = await CartDetail.findOne({
      where: { orderId: req.params.orderId, posterId: req.params.posterId },
    });

    await posterToEdit.update({quantity: req.body.quantity});
    await posterToEdit.save()
    const order = await Order.findAll({
      where: {
        userId: req.params.userId,
        isComplete: false,
      },
    });
    
    const currentOrderId = JSON.stringify(order[0].id);
    const openOrder = await Order.findByPk(currentOrderId);
    const cartPosters = await CartDetail.findAll({
      where: {
        orderId: currentOrderId,
      },
      include: Poster,
    });
    res.send({
      openOrder,
      cartPosters,
    });
  } catch (error) {
    next(error);
  }
});

//delete api/order/:orderId/:posterId



router.delete('/:userId/:orderId/:posterId', async (req, res, next) => {
	try {
		const poster = await CartDetail.findOne({
			where: { orderId: req.params.orderId, posterId: req.params.posterId },
		});
		poster.destroy();
    console.log("in the delete poster api and poster",poster)
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

module.exports = router;
