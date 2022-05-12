const errorHandler = (err , req ,res ,next) => {
    // Log on console for Developer
    let error = { ...err };
    error.message = err.message;

    // Mongoose Bad ObjectID
    if(err.name === 'CastError'){
        const message = `Resourse not found with id of ${err.value}`
        error = {message, statusCode: 404};
    }
    //Mongoose Duplicate Key
    if(err.code === 11000){
        const message = 'Duplicate fields value entered';
        error = {message, statusCode: 400}
    }
    // Mongoose Validation Errors
    if(err.name === 'ValidationError'){
        const message = Object.values(err.errors).map(val => val.message);
        error = {message, statusCode: 400}
    }
    res.status(error.statusCode || 500).json({
        success: false,
        error : error.message || 'Server Error'
    });
};

module.exports = errorHandler;
