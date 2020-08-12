const Joi = require('joi');//class is returned from this module
const express = require('express');
const app = express();

app.use(express.json()); // retruns a piece of middleware
                         // used by app.use()
const courses = [
    { id: 1, name: 'Course1'},
    { id: 2, name: 'Course2'},
    { id: 3, name: 'Course3'},
];

function validateCourse(course) {
    const schema = { // schema defines the shape of an object
                     // properties, type of properties, etc. etc.
        name: Joi.string().min(3).required()
        //should be a string ; min 3 characters ; required
    };

    return Joi.validate(course, schema);//returns an object

    /* result object will look like (if there is no error): 
    {
    error: null,
    value: { name: 'New Course'},
    then: [Funtion: then]
    catch: [Function: catch]
    }
    */
}

app.get('/', (req, res) => { // route and route handler
                             // (req, res) => is the route handler funtion
    res.send('Hello World');
});

//defining another route
app.get('/api/courses', (req, res) => {
    //usualyy we'd get a list of courses from database
    //and return it
    res.send(courses);
});

/*
//we define new routes in app.get
app.get('/api/courses/:year/:month', (req, res) => {
    // res.send(req.params); //gets all parameters
    // res.send(req.params.month); //gets month parameters
    // res.send(req.query);
})
*/

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course){
        res.status(404).send("ID not found.");
        next();
    }
    res.send(course);
});

//if there is no GET(i.e., app.get()) for a certain address
//Browser shows - Cannot GET <address input>

app.post('/api/courses', (req, res) => {
    const result = validateCourse(req.body);
    if(result.error) {
        res.status(400).send(result.error.details[0].message);
        //access error property of object result
        //go to the details array (it's an array of error messages)
        //access the first element
        //access the message property of the first element
        next();
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course); //sends it to client to inform him "id" of new object
});

app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) {
        res.status(404).send("ID not found.");
        next();
    }

    const result = validateCourse(req.body);
    if(result.error) {
        res.status(400).send(result.error.details[0].message);
        next();
    }


    //-------------------DOUBT-------------------
    //courses[(req.params.id)-1].name = req.body.name; --> NOT WORKING  
    /*courses[req.param.id-1] = { --> NOT WORKING
        id: req.params.id,
        name: req.body.name
    };*/
    //-------------------DOUBT-------------------


    course.name = req.body.name;
    //In JavaScript, objects are passed as call by refrence
    //So, we can update the value by updating 'course' value, which is present in this scope

    res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) {
        res.status(404).send("ID not found.")
        next();
    }

    const index = courses.indexOf(course);
    courses.splice(index, 1);
    
    /*--------BUG : The 'id' of the other courses aren't changing accordingly after deletion.--------*/

    res.send(course);
    //res.send(courses); //Since "res.send" doesn't act like a return function,
                         //WHY WON'T THIS WORK???
                         /*-----Answer : "res" allows us to give a response ONCE. So, we can't write any more data to it.
                                         So, it will only work ONCE.-----*/
});

// PORT  is an environmental variable. 
//It's usually dynamic in nature.
const port = process.env.PORT || 3000;//process-global object ; env(i.e., environmet variable)-property PORT-name of variable
// CMD Command to change PORT value - set $env:PORT=5000
app.listen(port, () => console.log(`Listening on Port ${port}`));
//listen on a given port
//function called when the application starts listening on the given port
