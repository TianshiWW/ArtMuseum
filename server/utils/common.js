/*
 * @Description: 
 * @Version: 1.0
 * @Autor: Tianshi
 * @Date: 2020-05-03 05:40:25
 * @LastEditors: Tianshi
 * @LastEditTime: 2020-05-03 05:40:28
 */
exports.createJsonString = createJsonString

/**
 * 
 * @param {BOOL} status the status of the sql
 * @param {row data packet} result the query result 
 * @param {the error message} message put "" when success
 */
function createJsonString(status, result, message) {
    var value;
    
    if (status) {
        var jsonString = JSON.stringify(result);
        var jsonValue =  JSON.parse(jsonString);
        value = jsonValue
    } else {
        value = result
    }
    
    var resJson = new Object();
    resJson.status = status;
    resJson.value = value;
    resJson.message = message;
    var jsonString = JSON.stringify(resJson);

    return jsonString;
}