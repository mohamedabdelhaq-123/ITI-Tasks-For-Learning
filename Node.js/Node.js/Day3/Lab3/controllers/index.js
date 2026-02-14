function validateProduct(req, res, next) {
  const {body, method} = req;

  // in Post strict to schema
  if (method === 'POST') {
    if (!body.item || typeof body.item !== 'string') {
      return res.status(400).json({error: 'Name is required and must be a string'});
    }

    if (body.quantity === undefined || typeof body.quantity !== 'number' || body.quantity < 0) {
      return res.status(400).json({error: 'Quantity is required and must be a non-negative number'});
    }

    if (body.category && typeof body.category !== 'string') {
      return res.status(400).json({error: 'Category must be a string'});
    }
  }

  // validate provided fields only
  if (method === 'PATCH') {
    if (Object.keys(body).length === 0) { // Check if body is empty
      return res.status(400).json({error: 'Request body cannot be empty'});
    }
    if (body.item !== undefined && typeof body.item !== 'string') {
      return res.status(400).json({error: 'Name must be a string'});
    }

    if (body.quantity !== undefined && (typeof body.quantity !== 'number' || body.quantity < 0)) {
      return res.status(400).json({error: 'Quantity must be a non-negative number'});
    }

    if (body.category !== undefined && typeof body.category !== 'string') {
      return res.status(400).json({error: 'Category must be a string'});
    }
  }

  next();
}

module.exports = validateProduct;
