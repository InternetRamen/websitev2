var express = require('express');
var router = express.Router();
const fetch = require("node-fetch");
/* GET home page. */
router.get('/', function(req, res, next) {
        let things = [
            "Seek Discomfort",
            "The comfort zone is where dreams go to die.",
            "Work expands so as to fill the time available for its completion -Parkinson's Law",
            "If it takes less than two minutes, then do it now.",
            "Dream big, but start small. -Jason Oppenheim",
            "Grant me the serenity to accept the things I cannot change, courage to change the things I can, and wisdom to know the difference. -Reinhold Niebuhr",
            "A Stranger is a friend you don't know yet. -Yes Theory"
        ]
        const randomElement = things[Math.floor(Math.random() * things.length)];
        res.render('index', {thingToLiveBy: randomElement});
});

module.exports = router;
