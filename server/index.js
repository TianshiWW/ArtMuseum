/*
 * @Description:
 * @Version: 1.0
 * @Autor:
 * @Date: 2020-05-02 19:02:49
 * @LastEditors: Tianshi
 * @LastEditTime: 2020-05-04 15:42:50
 */
const bodyParser = require('body-parser');
const express = require('express');
var routes = require("./routes.js");
const cors = require('cors');

var app = express();

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


var usersRouter = require('./routes/users');
app.use('/users', usersRouter);


/* ---- (Dashboard) ---- */
// The route localhost:8081/genres is registered to the function
// routes.getAllGenres, specified in routes.js.
app.get('/randPaintings', routes.get10RandomPaintings);


/* ---- ... ---- */
app.get('/menu', routes.get10RandomPaintings);






/* ---- Get content for SideNavbar ---- */
app.get('/menu/:searchKey', routes.getUniqueValues);




/* ---- Fetch all artists whose name start with given letter---- */
app.get('/artists/:firstLetter', routes.getArtists);





/* ---- Get images according to attribute names ---- */
app.get('/images/:key/:value', routes.getImages);





/* ---- Get info for a image ---- */
app.get('/image/:id', routes.getImgInfo);





/* ---- Get recommendations for current image ---- */
app.get('/recs/:id', routes.getRecsForImg);




/* ---- Get popular images in current genre ---- */
app.get('/populars/:genre', routes.getPopularsByGenre);




/* ---- See how three genres change along the time ---- */
app.get('/timeline', routes.getTimelineChange);




/* ---- Get popular images among users ---- */
app.get('/userPopular', routes.getPopularByUsers);




/* ---- Get users liked images ---- */
app.get('/userLiked/:userID', routes.getLikedByUsers);




app.listen(8081, () => {
	console.log(`Server listening on PORT 8081`);
});
