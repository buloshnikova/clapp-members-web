module.exports = Object.freeze({
    SUCCESS: 200,
    DATA_SAVED: 201,
    NO_DATA_FOUND: 204,
    NOT_PROVIDED_AUTHENTICATION_DETAILS: 451, //when there is no local stored business parameters to automatically sign in
    WRONG_CREDENTIALS: 401, //business parameters were sent but they are wrong
    GENERAL_ERROR: 500 // an error occurred while proceeding a data
});

//function define(name, value){
//    Object.defineProperty(exports, name, {
//        SUCCESS: 200,
//        DATA_SAVED: 201,
//        NO_DATA_FOUND: 300,
//        NOT_PROVIDED_AUTHENTICATION_DETAILS: 405, //when there is no local stored business parameters to automatically sign in
//        WRONG_CREDENTIALS: 401, //business parameters were sent but they are wrong
//        GENERAL_ERROR: 500 // an error occurred while proceeding a data
//    });
//}