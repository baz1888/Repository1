var supertest = require("supertest");
var should = require("should");
var mode   = process.env.NODE_TLS_REJECT_UNAUTHORIZED=0;


// This agent refers to PORT where program is runninng.
var server = supertest.agent("https://localhost:8000");



// UNIT test begin

describe("Results testing",function(){
  // #1 should return contacts representation in j son
  it("should return all results",function(done){
    // calling home page api
    server
    .get("/memberarea/fixtures")
    .expect("Content-type",/json/)
    .expect(200) // THis is HTTP response
    .end(function(err,res){
      // HTTP status should be 200
      res.status.should.equal(200);
      done();
    });
  });

 it("should add a new result",function(done){

  // post to /memberarea/fixtures
  server.post('/memberarea/fixtures')
  .send({HomeTeam:'1g7700uh', AwayTeam:"r1g7u70011ls", referee:"1lgug77100"})
  .expect("Content-type", /json/)
  .expect(201)
  .end(function(err,res){

    //console.log(res)
    if (err) {
                throw err
                        };
     console.log(res.status);
    res.status.should.equal(201);
    done();
  });
});

  
  /*it("should delete a fixture",function(done){
    // calling home page api
    server
    .get("/memberarea/fixtures")
.expect("Content-type", /json/)                // Get fixtures working but cannot read property of expect undefined
.expect(200) // THis is HTTP response
.end(function(err,res){
  console.log(err)
    console.log(res)
    const id = res.body[0]._id;
    console.log(res)
    server
        .delete("/memberarea/fixtures/:id"+id)
        console.log(res)
        .expect("Content-type",/json/)
        .expect(200) // THis is HTTP response
        .end(function(err,res){
         console.log(res)
            res.body._id.should.equal(id);
            //res.body.should.have.property("HomeTeam");
            done();
         });
       });

});
*/


});






