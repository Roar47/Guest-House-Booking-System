const express = require('express')
const app = express()
const connection = require('./database')
const dotenv = require('dotenv')
const bcrypt = require('bcrypt')
const passport = require('passport')
const session = require('express-session')
const initializePassport = require('./passport-config')
const methodOverride = require('method-override')

initializePassport(passport)

app.set('view-engine', 'ejs')
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(passport.initialize())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    rolling:true,
    cookie: {
        maxAge: 600000
    }
}))
app.use(passport.session())
app.use(methodOverride('_method'))
dotenv.config()


// login page get
app.get('/', notLogged, (req,res)=>{
    // var d = new Date(Date.now())
    // console.log(d.getFullYear()+"-"+d.getMonth()+"-"+d.getDate())
    res.render('login.ejs')
}).post('/', passport.authenticate('local-login',{
    successRedirect:'/user'
}))
// register page get
app.get('/register', notLogged, (req,res)=>{
    res.render('register.ejs')
}).post('/register', async (req,res)=>{
    try{
        const hashedPass = await bcrypt.hash(req.body.password, 10)
        var availableRoomQuery = `select rid from room where rtype=${req.body.rtype} and status=0 limit 1`
        
        connection.query(availableRoomQuery, (err, rows)=>{
            if(err) res.send(err)
            else{
                if(rows.length===0)
                    res.send("No rooms available of selected type.")
                else
                {
                    var d = new Date(Date.now())
                    var val="0"
                    if(req.body.rtype===1)
                    {
                        val="1000"
                    }
                    if(req.body.rtype===1)
                    {
                        val="2000"
                    }
                    if(req.body.rtype===1)
                    {
                        val="3000"
                    }
                    var q = `insert into customer values(
                        'C${rows[0].rid}',
                        '${hashedPass}',
                        '${req.body.name}',
                        '${req.body.mobile}',
                        '${req.body.email}',
                        ${req.body.rtype},
                        0,
                        0,
                        CURDATE(),
                        0
                    )`
                    var r = `update room set status=1 where rid='${rows[0].rid}'`
                    connection.query(r)
                    
                    connection.query(q, (err1, rows1)=>{
                        if(err1) res.send(err1)
                        else{
                            res.send("Room allocated successfully. \nYour customer ID is C"+rows[0].rid+". \nAllocated room: "+rows[0].rid)
                        }
                    })
                }
            }
        })
        
    } catch(err) {
        console.log("Error is" + err)
        res.redirect("/register")
    }
})

app.delete('/logout',(req,res)=>{
    req.logOut()
    res.redirect('/')
})

// router paths
const userRouter = require('./routes/user')
const adminRouter = require('./routes/admin')

app.use('/admin', Logged, adminRouter)
app.use('/user', Logged, ua, userRouter)



// if not logged in then redirect to login page
function Logged(req,res,next){
    if(req.isAuthenticated()) return next()
    res.redirect('/register')
}
// if logged in redirect back to user home
function notLogged(req,res,next){
    if(!req.isAuthenticated()) return next()
    res.redirect('/')
}

function ua(req,res,next){
    console.log(req.user)
    if(req.user.type === 0)  next()
    else res.redirect('/admin')
}
function ub(req,res,next){
    if(req.user.type =='U') return next()
    res.redirect('/admin')
}
//localhost port
app.listen(4000)