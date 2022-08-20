const { application } = require('express')
const express = require('express')
const connection = require('../database')
const router = express.Router()

router.use(express.urlencoded({extended:true}))


router.get('/', (req,res)=>{
    var q = `select * from customer where cid= '${req.session.passport.user}';`
    connection.query(q, (err, rows)=>{
        if(err) return res.send(err)
        res.render('admin_dashboard.ejs', {data: rows[0]})
    })
})
router.get('/customerdata',(req,res)=>{
    var q=`select * from customer`
    connection.query(q,(err,rows)=>{
        if(err) return res.send(err)
        var customer = new Array()
        for(var i=0; i<rows.length; i++)
        {
            if(rows[i].type===1)    continue
            rows[i].cid = rows[i].cid.substr(1,rows[i].cid.length-1)
            var d = new Date(rows[i].checkin)
    
            rows[i].checkin = d.getFullYear()+"-"+d.getMonth()+"-"+d.getDate()
            customer.push(rows[i])
        }
        res.render('admin_custDetails.ejs',{customer:customer})
    })
})
router.get('/rooms',(req,res)=>{
    var q=`select * from room`
    connection.query(q,(err,rows)=>{
        if(err) return res.send(err)
        var rooms = new Array()
        for(var i=0; i<rows.length; i++)
        {
            rows[i].status = (rows[i].status?"Occupied":"Available")
            rooms.push(rows[i])
        }
        res.render('admin_rooms.ejs',{rooms:rooms})
    })
})

router.get('/foods',(req,res)=>{
    var q=`select * from food`
    connection.query(q,(err,rows)=>{
        if(err) return res.send(err)
        var foods = new Array()
        for(var i=0; i<rows.length; i++)
        {
            rows[i].ftype = (rows[i].ftype==1?"Breakfast":(rows[i].type==2?"Lunch":"Dinner"))
            foods.push(rows[i])
        }
        res.render('admin_food.ejs',{foods:foods})
    })
})
router.post('/foods/add',(req,res)=>{
    var q=`insert into food values('${req.body.fid}','${req.body.fname}',${req.body.ftype},${req.body.price});`
    connection.query(q,(err,rows)=>{
        if(err) return res.send(err)
        console.log('Added successfully')
        res.redirect('/admin/foods')
    })
})

module.exports = router