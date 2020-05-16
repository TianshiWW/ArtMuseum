var config = require('./db-config.js');
var mysql = require('mysql');

config.connectionLimit = 10;
var connection = mysql.createPool(config);


/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */


/* ---- Q1a (Dashboard) ---- */
function get10RandomPaintings(req, res) {

  var query = `SELECT Page_Link, Image_Source, Title
              FROM ARTWORK
              ORDER BY RAND()
              LIMIT 10;`;

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });

};


/* ---- Menu Content ---- */
function getUniqueValues(req, res) {
  var searchKey = req.params.searchKey;
  console.log(searchKey);
  var query = `
  SELECT DISTINCT ${searchKey} AS value
  FROM ARTWORK
  ORDER BY ${searchKey}
  ;
  `;

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
};



/* ---- Find the images with corresponding search key and value---- */
function getImages(req, res) {
  var key = req.params.key;
  var value = req.params.value;
  var query = `
  SELECT ID, IMAGE_SOURCE
  FROM ARTWORK
  WHERE ${key} = '${value}'
  ORDER BY RAND()
  LIMIT 16;
  `;

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
};

/* ---- Extract all the info for a iamge ---- */
function getImgInfo(req, res) {
  var imgId = req.params.id;
  /* !!!! This query could be optimized !!! */
	var query = `
    SELECT ARTWORK.*, AUTHOR.FULL_NAME AS AUTHOR
    FROM ARTWORK JOIN AUTHOR ON ARTWORK.AUTHOR_ID = AUTHOR.ID
    WHERE ARTWORK.ID = ${imgId};
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
}

/* ---- Fetch all the artists that first name starts with given letter ---- */
function getArtists(req, res) {
  var firstLetter = req.params.firstLetter;
  /* !!!! This query could be optimized !!! */
  var query = `

    SELECT FULL_NAME, ARTWORK.author_id AS ID, IMAGE_SOURCE
    FROM (
      SELECT full_name, id
      FROM AUTHOR
      where full_name like "${firstLetter}%") author_initial
    JOIN ARTWORK
    ON author_initial.id= ARTWORK.author_id
    GROUP BY full_name
    ORDER BY full_name;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
};


/* ---- Get recommendations for current image ---- */
// function getRecsForImg(req, res) {
//   var query = `
//   SELECT A.id AS ID, image_source
//   FROM ARTWORK A,
//   (SELECT Form, Type, Timeline_Start, Timeline_End
//   FROM ARTWORK
//   WHERE ID = 2) T
//   WHERE A.Form = T.Form
//   AND A.Type = T.Type
//   ORDER BY ABS(A.Timeline_Start - T.Timeline_Start)
//   LIMIT 5;
//   `;
//   connection.query(query, function(err, rows, fields) {
//     if (err) console.log(err);
//     else {
//       console.log(rows);
//       res.json(rows);
//     }
//   });
// };



/* ---- Get popular images in current genre ---- */
function getPopularsByGenre(req, res) {
  var genre = req.params.genre;

  var form = `
    TYPE,
    latest_artwork.${genre},
    SCHOOL,
  `;
  var type = `
    FORM,
    latest_artwork.${genre},
    SCHOOL,
  `;
  var school = `
    FORM,
    latest_artwork.${genre},
    TYPE,
  `;
  var switchG;
  if (genre==="FORM") {
    switchG = form;
  }
  else if (genre==="TYPE"){
    switchG = type;
  }
  else if (genre==="SCHOOL"){
    switchG = school;
  }

  var query = `
  SELECT
		TITLE,
    SIZES,
    FULL_NAME,
    CREATED_TIME,
    TECHNIQUE,
    LOCATION,
    DESCRIPTION,
    IMAGE_SOURCE,`
    + switchG + `
    TIMELINE_START
		FROM
			(SELECT ${genre},
			MAX(timeline_start) AS latest_timeline
			FROM ARTWORK
			GROUP BY ${genre}
            ) latest_artwork
            JOIN
			(SELECT ${genre},
			COUNT(*) AS cnt
			FROM ARTWORK
            GROUP BY ${genre}
            ) school_amount ON school_amount.${genre} = latest_artwork.${genre}
		JOIN ARTWORK
		ON latest_artwork.latest_timeline = ARTWORK.timeline_start
		AND latest_artwork.${genre} = ARTWORK.${genre}
		JOIN AUTHOR
		ON AUTHOR.id = ARTWORK.author_id
		GROUP BY latest_artwork.${genre}
    ORDER BY cnt DESC
		LIMIT 5;

  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
};


/* ---- Get Timeline Changes ---- */
function getTimelineChange(req, res) {
  var query = `
  SELECT * FROM
	(SELECT
	diff_time.timeline_start,
	form,form_image_id,form_image_source,
	type,type_image_id,type_image_source,
	school,school_image_id,school_image_source
	FROM
		(SELECT DISTINCT timeline_start
		FROM ARTWORK
		ORDER BY RAND()
		LIMIT 5
		)diff_time
		JOIN
		(SELECT form, timeline_start,COUNT(*) AS cnt_form, id AS form_image_id, IMAGE_SOURCE AS form_image_source
		FROM ARTWORK
		GROUP BY form ,timeline_start
		) most_common_form
		ON diff_time.timeline_start = most_common_form.timeline_start
		JOIN
		(SELECT type ,timeline_start,COUNT(*) AS cnt_type, id AS type_image_id, IMAGE_SOURCE AS type_image_source
		FROM ARTWORK
		GROUP BY type ,timeline_start
		) most_common_type
		ON diff_time.timeline_start = most_common_type.timeline_start
		JOIN
		(SELECT DISTINCT school ,timeline_start,COUNT(*) AS cnt_school, id AS school_image_id, IMAGE_SOURCE AS school_image_source
		FROM ARTWORK
		GROUP BY school,timeline_start
		) most_common_school
		ON diff_time.timeline_start = most_common_school.timeline_start
	ORDER BY diff_time.timeline_start ASC,cnt_form DESC, cnt_type DESC, cnt_school DESC) tab
  GROUP BY timeline_start
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
};


/* ---- Get popular images among users ---- */
function getPopularByUsers(req, res) {
  var query = `
    SELECT artwork_id, image_source
    FROM user_collections
    JOIN ARTWORK
    ON user_collections.artwork_id = ARTWORK.id
    GROUP BY artwork_id
    ORDER BY COUNT(*) DESC
    LIMIT 10;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
};


/* ---- Get popular images among users ---- */
function getLikedByUsers(req, res) {
  var userId = req.params.userID;
  var query = `
    SELECT artwork_id, image_source
    FROM user_collections
    JOIN ARTWORK
    ON user_collections.artwork_id = ARTWORK.id
    WHERE user_collections.id = ${userId}
    LIMIT 10;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
};


recommend_ls=[]; // to store the list

var len  = function(obj){
    var len=0;
    for(var i in obj){
        len++
    }
    return len;
}

var cosine_similarity = function (a1, a2) {

    var item_tab = {};
    for (key in a1) {
        if (key in a2 && key !="ID" && key!="Title"&& key!="ID"&& key!="IMAGE_SOURCE") {
            item_tab[key] = 1
        }
    }

    if (len(item_tab) == 0) return 0;
    var a1_val = 0,
        a2_val = 0,
        a1_denom = 0,
        a2_denom = 0,
        numerator = 0;

    for (var item in item_tab) {
        a1_val = a1[item]
        a2_val = a2[item]
        a1_denom += Math.pow(a1[item], 2);
        a2_denom += Math.pow(a2[item], 2);
        numerator += a1_val * a2_val;
    }

    var denominator = Math.sqrt(a1_denom)*Math.sqrt(a2_denom);

    if (denominator == 0) return 0;
    else return numerator / denominator;

}

var pearson_coefficient = function (a1, a2) {
    var item_tab = {};

    for (key in a1) {

        if (key in a2 && key!="Title" && key!="ID"&& key!="IMAGE_SOURCE") {
            item_tab[key] = 1
        }
    }

    var num_item = len(item_tab);

    if (num_item == 0) return 0;

    var a1_sum = 0,
        a2_sum = 0,
        a1_sq_sum = 0,
        a2_sq_sum = 0,
        product = 0;
// calculate product and sum
    for (var item in item_tab) {

        a1_sum += a1[item];
        a2_sum += a2[item];
        a1_sq_sum += Math.pow(a1[item], 2);
        a2_sq_sum += Math.pow(a2[item], 2);
        product += a1[item] * a2[item];

    }

    var numerator = product - (a1_sum * a2_sum / num_item);


    var st1 = a1_sq_sum - Math.pow(a1_sum, 2) / num_item;

    var st2 = a2_sq_sum - Math.pow(a2_sum, 2) / num_item;

    var denominator = Math.sqrt(st1 * st2);

    if (denominator == 0) return 0;
    else {
        var val = numerator / denominator;

        return val;
    }

}


var content_recommendation_engine= function(person,other,distance1,distance2,num,imgId){

    var dist1=distance1(person,other)
    var dist2 =distance2(person,other)
    var val1 =dist1*dist2

    var p = other
    // console.log(imgId)
    if (p.ID==imgId ) return recommend_ls;

    for(var i in recommend_ls){

    if (p.Title ==recommend_ls[i].p.Title){
    return recommend_ls;}

    }

    var cnt=0;
    if (len(recommend_ls)<num) {
     recommend_ls.push({val:val1,p:p});
        return recommend_ls;
    }

    if (dist1<0) return recommend_ls

    for(var ind in recommend_ls){

        if(recommend_ls[ind].val<val1) {

            recommend_ls.splice(cnt,1,{val:val1, p:p});
            break;

    }
    cnt+=1;
    }

return recommend_ls
}

/* The entry function is here*/

function getRecsForImg(req, res) {
  recommend_ls=[]
    var imgId = req.params.id;
    var query = `(
        SELECT REC.Title,REC.Technique,REC.Form, REC.Type,\
         REC.School,REC.ID, ARTWORK.IMAGE_SOURCE
        FROM REC, ARTWORK
        WHERE REC.ID = ${imgId} AND ARTWORK.ID=REC.ID
        LIMIT 1
    )UNION(
        SELECT REC.Title,REC.Technique,REC.Form, REC.Type,\
         REC.School,REC.ID, ARTWORK.IMAGE_SOURCE
        FROM REC, user_collections, ARTWORK
        WHERE user_collections.artwork_id=ARTWORK.ID AND REC.ID=ARTWORK.ID\
        AND user_collections.id IN(
            SELECT user_collections.id
            FROM user_collections, ARTWORK
            WHERE ARTWORK.ID=${imgId} AND user_collections.artwork_id=ARTWORK.ID)
            AND REC.ID != ${imgId}
            LIMIT 1000
    )UNION(
        SELECT REC.Title,REC.Technique,REC.Form, REC.Type,\
         REC.School,REC.ID, ARTWORK.IMAGE_SOURCE
        FROM REC, ARTWORK
        WHERE REC.Author_ID IN(
        SELECT REC.Author_ID
        FROM REC
        WHERE REC.ID= ${imgId}
    ) AND REC.ID=ARTWORK.ID AND REC.ID != ${imgId}
    ORDER BY RAND()
    LIMIT 3000);`;

    connection.query(query, function (err, rows, fields) {
      var main
        if (err) console.log(err);
        else {

            var num=5 // number of recommnedation

            for(var k =1; k<len(rows);k++){
             if (rows[k].Title==imgId) main=rows[k]
            }

            for( var i =1; i<len(rows);i++){
            y= content_recommendation_engine(main,rows[i],pearson_coefficient,cosine_similarity,num,imgId)
            }
            var ret_recommend=[]
            for(var i in recommend_ls){
                delete recommend_ls[i].val
                delete recommend_ls[i].p.Title
                delete recommend_ls[i].p.Technique
                delete recommend_ls[i].p.Form
                delete recommend_ls[i].p.Type
                delete recommend_ls[i].p.School
                ret_recommend.push(recommend_ls[i].p)
            }
            console.log(ret_recommend) // Final return value
            res.json(ret_recommend);
        }
    });

}


// The exported functions, which can be accessed in index.js.
module.exports = {
  get10RandomPaintings: get10RandomPaintings,
  getUniqueValues: getUniqueValues,
  getImages:getImages,
  getImgInfo: getImgInfo,
  getArtists:getArtists,
  getRecsForImg: getRecsForImg,
  getPopularsByGenre:getPopularsByGenre,
  getTimelineChange:getTimelineChange,
  getPopularByUsers: getPopularByUsers,
  getLikedByUsers:getLikedByUsers
}
