const express = require('express')
const connection = require('../database')
const router = express.Router()
// to read the body
router.use(express.urlencoded({ extended: true }));

router.get('/', (req,res)=>{
    var q = `select * from customer where cid= '${req.session.passport.user}';`
    connection.query(q, (err, rows)=>{
        if(err) return res.send(err)
        res.render('dashboard.ejs', {data: rows[0]})
    })
})
router.get('/orderfood/:ftype',(req,res)=>{
    var q = `select * from food where ftype=${req.params.ftype}`
    connection.query(q, (err, rows)=>{
        if(err) return res.send(err)
        res.render('orderfood.ejs',{food:rows,url:'/user/orderfood/'+req.params.ftype})
    })
})
.post('/orderfood/:ftype', (req,res)=>{
    var q1 = `select * from food`
    connection.query(q1, (err,rows)=>{
        if(err) return res.send(err)
        var price = 0
        for(var i=0; i<rows.length; i++)
        {
            for(var j=1; j<req.body.rtype.length; j++)
            {
                if(rows[i].fid===req.body.rtype[j])
                    price += rows[i].price
            }
        }
        
        var q2 = `update customer set amount=amount+${price} where cid='${req.session.passport.user}'`
        connection.query(q2,(err1,rows1)=>{
            if(err1) return res.send(err)
            res.send('Ordered successfully...')
        })
    })
})
router.get('/paybill', (req,res)=>{
    var q=`select amount,paid from customer where cid='${req.session.passport.user}'`
    connection.query(q, (err,rows)=>{
        if(err) return res.send(err)
        console.log(rows[0])
        res.render('pay_bill.ejs',{amount: Number(rows[0].amount)-Number(rows[0].paid)})
    })
    
})
router.post('/paybill', (req,res)=>{
    var amount = Number(req.body.amount)
    var q = `update customer set paid=paid+${amount}` 
    var q2 = "select count(*) as cnt from transaction;"
    var val="0"
    connection.query(q,(err,rows)=>{
        if(err) return res.send(err)
        res.send("Paid successfully")
    })
})

module.exports = router