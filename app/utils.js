// Utility function to handle error if there is an error
var handleError = function(err, statusCode){
  if(err){
    console.log(err);
    res.send(statusCode);
  }
};

var saveChanges = function(res, post, resCode, errCode){
  post.save(function(err){
    handleError(err, errCode);
    res.send(resCode);
  });
};

module.exports = {
  handleError: handleError,
  saveChanges: saveChanges
};
