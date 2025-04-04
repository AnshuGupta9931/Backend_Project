class ApiError extends Error{
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = "",

    ){
        super(message)
        this.statusCode = statusCode
        this.message = message
        this.data = null
        this.success = false // kyuki Api errors ko handle kar rhe h na ki Api response ko
        this.errors = errors

        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this,this.constructor);
        }
    }
}
export {ApiError}