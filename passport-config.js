const LocalStrategy = require('passport-local').Strategy
const connection = require('./database')
const bcrypt = require('bcrypt')

module.exports = (passport) =>{
    passport.serializeUser(function(user,done){
        done(null,user.cid)
    })
    passport.deserializeUser(function(cid,done){
        connection.query("select * from customer where cid='"+cid+"'",function(err,rows){
            done(err,rows[0]);
        })
    })


    passport.use('local-login',new LocalStrategy({
        usernameField : 'cid'
    }, (cid,password,done) =>{
        connection.query("select * from customer where cid='"+cid+"'", async (err,rows)=>{
            if(err) return done(err)                    // if err 
            if(!rows.length) return done(null, false,{message:'No user with such ID'})   // if no rows returned (i.e. no users found)

            if( await bcrypt.compare(password,rows[0].password) ){  // compare the raw password with hashed password   
                return done(null, rows[0])                          // return the result.
            }
            return done(null,false, {message:'Check your password and try again!'})                                 // return null
        })
    }))
}