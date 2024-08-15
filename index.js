import fs from "fs";
import http from "http";
import path from "path";
import formidable from "formidable";
import dotenv from 'dotenv';
dotenv.config()

const port = process.env.PORT || 4000;
const __dirname = import.meta.dirname;

const server = http.createServer(async (req, res) => {
  // seperate url and method
  const urls = req.url.split("/");
  const method = req.method.toUpperCase();
  // seperate url and method

//    setheaders
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type/application-json");
//    setheaders

//  for delete
  if (method == "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "DELETE");
    res.end();
    return;
  }
//  for delete
  

  if (method == "GET") {

    // return first page
    if (urls[1] == "") {
      const htmlPage = fs.readFileSync("./views/index.html", "utf-8");
      res.statusCode = 200
      res.end(htmlPage);
    }
    // return first page
    

    // for sign in
    if (urls[1] == "users") {
      const filePath = path.join(__dirname, "data", "data.json");
      fs.readFile(filePath, "utf-8", (err, data) => {
        if (err) {
          throw err;
        } else {
          res.statusCode = 200;
          res.end(data);
        }
      });
      return;
    }
    // for sign in

    //  return secondpage
    if (req.url.split("?")[0] == "/user") {
      const htmlPage = fs.readFileSync(
        "./views/components/transfers-page.html",
        "utf-8"
      );
      res.statusCode = 201
      res.end(htmlPage);
    }
    //  return secondpage



    if (req.url.split("?")[0] == '/user_data') {
      const username = req.url.split("?")[1];
      const filePath = path.join(__dirname, "data", "data.json");
      let data = fs.readFileSync(filePath, "utf-8")
      data = JSON.parse(data)
      for (let i = 0; i < data.length; i++) {
        if (data[i].username == username) {
          res.statusCode = 201;
          res.end(JSON.stringify(data[i]));
          return
        }
      }
    }

    if (urls[1] == "public" && urls[2] && urls[3]) {
      const filePath = path.join(__dirname, "public", urls[2], urls[3]);

      const mimeTypes = JSON.parse(
        fs.readFileSync("./mime-types.json", "utf-8")
      );

      const fileExtname = path.extname(filePath);

      const fileStream = fs.createReadStream(filePath);

      res.statusCode = 200
      fileStream.pipe(res);
    }
  }
  if (method == "POST") {
    if (urls[1] == "user") {
      const filePath = path.join(__dirname, "data", "data.json");
      fs.readFile(filePath, "utf-8", (err, data) => {
        if (err) {
          throw err;
        } else {
          data = JSON.parse(data);
          let body = "";
          req.on("data", (chunk) => {
            body += chunk.toString();
          });
          req.on("end", () => {
            body = JSON.parse(body);
            let { username, password } = body;
            data.forEach((element) => {
              if (
                element.password == password &&
                element.username == username
              ) {
                res.statusCode = 201
                res.end("User is found");
                return ;
              }
              
            });
              res.statusCode = 404
              res.end();
              return ;
          });
        }
      });
    }
    if (urls[1] == "") {
      const filePath = path.join(__dirname, "data", "data.json");
      fs.readFile(filePath, "utf-8", (err, data) => {
        if (err) {
          throw err;
        } else {
          data = JSON.parse(data);

          let body = "";
          req.on("data", (chunk) => {
            body += chunk.toString();
          });
          let dataParsed = {
            id: data[data.length - 1]?.id + 1 || 1,
          };
          req.on("end", () => {
            const oy = new Date().getMonth() + 1;
            const kun = new Date().getDate();
            const yil = new Date().getFullYear();
            let hozirgiSana =
              (oy < 10 ? "0" : "") +
              kun +
              "/" +
              (kun < 10 ? "0" : "") +
              oy +
              "/" +
              yil;
            dataParsed["username"] = JSON.parse(body).username;
            dataParsed["password"] = String(JSON.parse(body).password) || false;
            dataParsed["balanse"] = 0;
            dataParsed["in"] = 0;
            dataParsed["out"] = 0;
            dataParsed["interest"] = 0;
            dataParsed["date"] = hozirgiSana;
            data.push(dataParsed);
            fs.writeFile(filePath, JSON.stringify(data), (err) => {
              if (err) {
                throw err;
              } else {
                res.statusCode = 200
                res.end(
                  JSON.stringify({
                    message: "User is saved succesfully",
                  })
                );
              }
            });
          });
        }
      });
      return;
    }
    if (urls[1] == "update") {
      const filePath = path.join(__dirname, "data", "data.json");
      fs.readFile(filePath, "utf-8", (err, data) => {
        if (err) {
          throw err;
        } else {
          data = JSON.parse(data);
          let body = "";
          req.on("data", (chunk) => {
            body += chunk.toString();
          });
          req.on("end", () => {
            body = JSON.parse(body);
            const {fromUsername,toUsername, amount} = body
            for (let i = 0; i < data.length; i++) {
              if (data[i].username == fromUsername) {
                data[i].balanse -= amount
                data[i].transfers.push(0-amount)
              }
              if (data[i].username == toUsername) {
                (data[i].balanse) += Number(amount)
                data[i].transfers.push(Number(amount))
              }
            }
            fs.writeFile(filePath, JSON.stringify(data),(err)=>{
              if (err) {
                console.log(err);
              }else{
                res.statusCode = 201;
                res.end(JSON.stringify("Succesfully transfered"))
              }
            })
            
          });
        }
      });
    }
    if (urls[1] == 'loan') {
      const filePath = path.join(__dirname, "data", "data.json");
      fs.readFile(filePath,'utf-8', (err, data)=>{
        if (err) {
          throw err
        }else{
          data = JSON.parse(data)
          let body = ''
          req.on("data", chunk =>{
            body+=chunk.toString()
          })
          req.on("end", ()=>{
            body = JSON.parse(body)
            const {username,loan_amount} = body
            for (let i = 0; i < data.length; i++) {
              if (data[i].username == username) {
                data[i].balanse += Number(loan_amount)
                data[i].transfers.push(Number(loan_amount))
              }
            }
            fs.writeFile(filePath, JSON.stringify(data), (err)=>{
              if (err) {
                throw err
              }
              else{
                res.statusCode = 204;
                res.end(JSON.stringify({message:"Succefully send loan"}))
              }
            })
          })
        }
      })
    }
  }
});

server.listen(port, () => {
  console.log(`Server ${port}-portda ishga tushdi!`);
});
