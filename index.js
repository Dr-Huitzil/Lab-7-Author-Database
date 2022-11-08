const express = require("express");
const mysql = require('mysql');
const app = express();
const pool = dbConnection();

app.set("view engine", "ejs");
app.use(express.static("public"));
//to parse Form data sent using POST method
app.use(express.urlencoded({extended: true}));

// root route
app.get('/', async (req, res) => {
  //  let sql = `SELECT firstName, lastName, authorId
  //             FROM q_authors
  //             ORDER BY lastName`;
  //  let rows = await executeSQL(sql);
 
  // res.render('home',{"authors":rows});
    let sqlAuth = `SELECT firstName, lastName, authorId
                 FROM q_authors
                 ORDER BY lastName`;

  let sqlCat = `SELECT category
                FROM q_quotes
                ORDER BY category`;

  let rows = await executeSQL(sqlAuth);
  let categories = await executeSQL(sqlCat);

  let uniqueCat = [];

  for (let i = 0; i < categories.length; i++)
    {
      if(!uniqueCat.includes((categories[i].category).trim()))
      {
        uniqueCat.push((categories[i].category).trim());
      }
    }
   res.render("home", {"authors":rows, "categories":uniqueCat});
  
});

// Search by keyword root
app.get('/searchByKeyword', async (req, res) => {
let keyword = req.query.keyword;
  let sql = `SELECT firstName, lastName, quote, a.authorId
            FROM q_quotes q
            INNER JOIN q_authors a
            ON q.authorId = a.authorId
            WHERE quote LIKE ?`;
   // let rows = await executeSQL(sql);
   // res.send(rows)
  // res.render('results');
  let params = [`%${keyword}%`];
  let rows = await executeSQL(sql, params);
  
  res.render("results",{"quotes":rows});
});

// get author info
app.get('/api/author/:id', async (req, res) => {
  let authorId = req.params.id;

  let sql = `SELECT *
              FROM q_authors 
              WHERE authorId = ?`;

  
  let params = [authorId];
  let rows = await executeSQL(sql, params);
  res.send(rows);
  
});

// Search by Author root
app.get('/searchByAuthor', async (req, res) => {
let AuthorID = req.query.authorID;
  
  let sql = `SELECT firstName, lastName, quote, a.authorId
              FROM q_quotes q
              INNER JOIN q_authors a
              ON q.authorId = a.authorId
              WHERE a.authorId = '${AuthorID}'` ;
  let rows = await executeSQL(sql);
  res.render("results",{"quotes":rows});
  
});

// Search by category
app.get('/searchByCategory', async (req, res) => {
  let cat = req.query.category;

  let sql = `SELECT firstName, lastName, quote, a.authorId
             FROM q_quotes q
             INNER JOIN q_authors a
             ON q.authorId = a.authorId
             WHERE category = '${cat}'`;
  let rows = await executeSQL(sql);
  res.render("results", {"quotes":rows});
});

// Search by Likes
app.get('/actionByLikes', async (req, res) => {
  let min = req.query.min;
  let max = req.query.max;

  if(min == "")
  {
    min = 1;
  }if (max == "")
  {
    max = 200;
  }

  let sql = `SELECT firstName, lastName, quote, a.authorId, likes
             FROM q_quotes q
             INNER JOIN q_authors a
             ON q.authorId = a.authorId
             WHERE likes BETWEEN ${min} AND ${max}`;

  let rows = await executeSQL(sql);
  res.render("results", {"quotes":rows});
});

app.get("/dbTest", async function(req, res){
let sql = "SELECT CURDATE()";
let rows = await executeSQL(sql);
res.send(rows);
});//dbTest

//functions
async function executeSQL(sql, params){
return new Promise (function (resolve, reject) {
pool.query(sql, params, function (err, rows, fields) {
if (err) throw err;
   resolve(rows);
});
});
}
//executeSQL
//values in red must be updated
function dbConnection(){

   const pool  = mysql.createPool({

      connectionLimit: 10,
      host: "jbb8y3dri1ywovy2.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
      user: "qul7enhvwr0hty1e",
      password: "sikypybe7ab6tt2h",
      database: "sv3n2gf78a10bulv"

   }); 

   return pool;

} //dbConnection

//start server
app.listen(3000, () => {
console.log("Expresss server running...")
} )