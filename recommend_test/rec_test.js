art_1={ 
    'Technique': 2,
    'Type': 8,
    'Form': 12,
    'School': 2,
    'ID': 1
}

art_2={ 
    'Technique': 2,
    'Type': 8,
    'Form': 10,
    'School': 2,
    'ID': 2
}
art_3={ 
    'Technique': 2,
    'Type': 6,
    'Form': 10,
    'School': 1,
    'ID': 3
}
art_4={ 
    'Technique': 2,
    'Type': 9,
    'Form': 7,
    'School': 2,
    'ID': 4
}
art_5={ 
    'Technique': 2,
    'Type': 6,
    'Form': 10,
    'School': 1,
    'ID': 5
}

recommend_ls=[];
// recommend_list_pear=[];

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
        if (key in a2 && key !="ID") {
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

    var denominator = Math.sqrt(a1_denom * a2_denom);

    if (denominator == 0) return 0;
    else return numerator / denominator;

}

var pearson_coefficient = function (a1, a2) {
    var item_tab = {};
    for (key in a1) {
        if (key in a2 && key != "ID") {
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
        a2_sq_sum += Math.pow(a1[item], 2);
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


    var val1 = distance1(person,other)*distance2(person,other);

    var p = other
    var cnt=0;
    if (len(recommend_ls)<3) {
        recommend_ls.push({val:val1,p:p});
        return recommend_ls;

    }
    for(var ind in recommend_ls){

        if(recommend_ls[ind].val<val1) {
            console.log("here")
            recommend_ls.splice(cnt,1,{val:val1, p:p});
            break;
   
    }
    cnt+=1;
    }
return recommend_ls

}

// simulation 
console.log(content_recommendation_engine(art_1,art_2,pearson_coefficient,cosine_similarity));
console.log(content_recommendation_engine(art_1,art_3,pearson_coefficient,cosine_similarity));
console.log(content_recommendation_engine(art_1,art_4,pearson_coefficient,cosine_similarity));
console.log(content_recommendation_engine(art_1,art_5,pearson_coefficient,cosine_similarity));
