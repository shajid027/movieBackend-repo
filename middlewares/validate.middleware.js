const validate = (schema) => async (req, res, next) => {
  try {
    // Parse and validate the request body using the schema
    const parsed = await schema.parseAsync(req.body);
    req.body = parsed;
    next();
  } catch (err) {
    const status = 422;
    const message = 'Fill the input properly';
    let extraDetails = err.message;

    if (typeof extraDetails === 'string' && extraDetails.startsWith('[')) {
      try {
        const parsedErrors = JSON.parse(extraDetails);
        if (Array.isArray(parsedErrors) && parsedErrors[0]?.message) {
          extraDetails = parsedErrors[0].message;
        }
      } catch (e) {
        console.error(e);
      }
    }

    const error = {
      status,
      message,
      extraDetails,
    };

    console.log(error);
    next(error);
  }
};

module.exports = validate;
