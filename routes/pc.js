var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.render('pcDefault');
});
router.get('/firstpc', function(req, res, next) {
  res.render('pc', { title: "First PC", image: "/images/firstpc.jpg"});
});

module.exports = router;
