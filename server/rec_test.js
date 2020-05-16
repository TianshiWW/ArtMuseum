var config = require('./db-config.js');
var mysql = require('mysql');

config.connectionLimit = 10;
var connection = mysql.createPool(config);




recommend_ls=[];

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
        if (key in a2 && key !="ID" && key!="Title"&& key!="ID") {
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

        if (key in a2 && key!="Title" && key!="ID") {
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


var content_recommendation_engine= function(person,other,distance1,distance2){


    var val1 =distance1(person,other)*distance2(person,other);

    var p = other

    for(var i in recommend_ls){
        console.log(i)
        console.log(recommend_ls[i].p.Title)
    if (p.Title ==recommend_ls[i].p.Title){
    return 0;}
    
    }

    var cnt=0;
    if (len(recommend_ls)<4) {
     recommend_ls.push({val:val1,p:p});
        return recommend_ls;

    }
    for(var ind in recommend_ls){

        if(recommend_ls[ind].val<val1) {
           
            recommend_ls.splice(cnt,1,{val:val1, p:p});
            break;
   
    }
    cnt+=1;
    }

// console.log(recommend_ls[0].p.Title==recommend_ls[1].p.Title)
   
return recommend_ls

}




var count=0;
var main_row=2;

var recommend_manager=function() {
    var query = `SELECT *
    FROM REC
    WHERE REC.ID = ${main_row};`;
    var row;
    connection.query(query, function (err, rows, fields) {
        if (err) console.log(err);
        else {

            recommend_controller(rows)
            return rows;



        }
    });
 
}
var y;

var recommend_controller=function() {
    var query = `
    (SELECT *
    FROM REC
    WHERE REC.ID = ${main_row}
    )
    UNION
    (SELECT *
    FROM REC
    LIMIT 0,1000);`;

    connection.query(query, function (err, rows, fields) {
        if (err) console.log(err);
        else {
            var i=1;
            for( i in rows){
               y= content_recommendation_engine(rows[0],rows[i],pearson_coefficient,cosine_similarity)
            // console.log(y[0])
            console.log(y)   
    
            count += 1;
            }
          
       
        }
    });

}



art_3={ 
    'Technique': 2,
    'Type': 6,
    'Form': 10,
    'School': 1,
    'ID': 3
}

// ff={
//     val: 1,
//     p: RowDataPacket {
//       Title: 'Jupiter, Antiope and Cupid',
//       Technique: 0.6010889292196224,
//       Form: 0.7692307692307692,
//       Type: 0.5,
//       School: 0.46153846153846145,
//       ID: 4,
//       Author_ID: 1
//     }
//   }

console.log(art_3.ID);


console.log("hi there");
recommend_controller();
console.log("end");