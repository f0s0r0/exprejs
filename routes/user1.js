var express = require('express');
var router = express.Router();
var dbConn  = require('../connect/db');
 
// retrieve
router.get('/', function(req, res, next) {
      
    dbConn.query('SELECT * FROM users ORDER BY id desc',function(err,rows)     {
 
        if(err) {
            req.flash('error', err);
            // render to views/users/index.ejs
            res.render('users',{data:''});   
        } else {
            // render to views/users/index.ejs
            res.render('users',{data:rows});
        }
    });
});

// display add users page
router.get('/add', function(req, res, next) {    
    // render to add.ejs
    res.render('users/add', {
        name: '',
        author: ''        
    })
})

// add a new user
router.post('/add', function(req, res, next) {    

    let fname = req.body.fname;
    let lname = req.body.lname;
    let age = req.body.age;
    let errors = false;

    if(fname.length === 0 || lname.length === 0 || age.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please fill all the details");
        // render to add.ejs with flash message
        res.render('users/add', {
            fname: fname,
            lname: lname,
            age: age
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            fname: fname,
            lname: lname,
            age: age
        }
        
        // insert query
        dbConn.query('INSERT INTO users SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('users/add', {
                    fname: form_data.fname,
                    lname: form_data.lname ,
                    age: form_data.age                    
                })
            } else {                
                req.flash('success', 'User successfully added');
                res.redirect('/users');
            }
        })
    }
})

// display edit user page
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;
   
    dbConn.query('SELECT * FROM users WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'user not found with id = ' + id)
            res.redirect('/users')
        }
        // if user found
        else {
            // render to edit.ejs
            res.render('users/edit', {
                title: 'Edit User', 
                id: rows[0].id,
                fname: rows[0].fname,
                lname: rows[0].lname,
                age: rows[0].age
            })
        }
    })
})

// update user data
router.post('/update/:id', function(req, res, next) {

    let id = req.params.id;
    let fname = req.body.fname;
    let lname = req.body.lname;
    let age = req.body.age;
    let errors = false;

    if(fname.length === 0 || lname.length === 0 || age.length === 0) {
        errors = true;
        
        // set flash message
        req.flash('error', "Please fill all the details");
        // render to add.ejs with flash message
        res.render('users/edit', {
            id: req.params.id,
            fname: fname,
            lname: lname,
            age: age
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            fname: fname,
            lname: lname,
            age: age
        }
        // update query
        dbConn.query('UPDATE users SET ? WHERE id = ' + id, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('users/edit', {
                    id: req.params.id,
                    fname: form_data.fname,
                    lname: form_data.lname,
                    age: form_data.age
                })
            } else {
                req.flash('success', 'User successfully updated');
                res.redirect('/users');
            }
        })
    }
})
   
// delete user
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
     
    dbConn.query('DELETE FROM users WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to users page
            res.redirect('/users')
        } else {
            // set flash message
            req.flash('success', 'User successfully deleted! ID = ' + id)
            // redirect to users page
            res.redirect('/users')
        }
    })
})

module.exports = router;