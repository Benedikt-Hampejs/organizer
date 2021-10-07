var express = require('express');

var bodyParser = require('body-parser');

var JsonDB = require('node-json-db').JsonDB;

var Config = require('node-json-db/dist/lib/JsonDBConfig.js').Config;
var db = new JsonDB(new Config("myDataBase", true, true, '/'));

//Pushing the data into the database
//With the wanted DataPath
//By default the push will override the old value

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  res.header('Accept,Accept-Language,Content-Language,Content-Type');
  next();
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

  //events
  const EVENTS = "/events";

  app.get('/api/events', (req, res) => {
      return getAll(EVENTS, req, res);
      }
  );

  app.get('/api/events/:id', (req, res) => {
    return getElementById(EVENTS,req, res);

    });

  app.delete('/api/events/:id', (req, res) => {
    return deleteElementById(EVENTS, req, res)
  });

  app.put('/api/events/:id', (req, res) => {
    return updateElement(EVENTS, req, res);
  });

  app.post('/api/events/', (req, res) => {
    return saveNewElement(EVENTS, req, res);
  });

//category
const CATEGORY = "/categories";

app.get('/api/categories', (req, res) => {
  return getAll(CATEGORY, req, res);
});

app.get('/api/categories/:id', (req, res) => {
  return getElementById(CATEGORY, req, res);
});

app.delete('/api/categories/:id', (req, res) => {
  return deleteElementById(CATEGORY, req, res)
});

app.put('/api/categories/:id', (req, res) => {
  return updateElement(CATEGORY, req, res);
});

app.post('/api/categories/', (req, res) => {
  return saveNewElement(CATEGORY, req, res);
});


//timer-configuration
const TIMERCONF = "/timerConfiguration"
app.get('/api/timer-configuration', (req, res) => {
  return res.json(db.getData(TIMERCONF));
  });

app.put('/api/timer-configuration', (req, res) => {
  db.push(TIMERCONF, req.body);
  return res.json(req.body);
});

//statistic_day
const DAY = "/statisticDays"
app.get('/api/statistic_day/', (req, res) => {
  return getAll(DAY, req, res);
  });

app.get('/api/statistic_day/:id', (req, res) => {
  return getElementById(DAY, req, res);
});

app.delete('/api/statistic_day/:id', (req, res) => {
  return deleteElementById(DAY, req, res)
});

app.put('/api/statistic_day/:id', (req, res) => {
  return updateElement(DAY, req, res);
});

app.post('/api/statistic_day/', (req, res) => {
  return saveNewElement(DAY, req, res);
});

app.listen(3200, () =>
  console.log(`Example app listening on port ${3200}!`),
);

function getElementById(path, req, res) {
  const event = db.find(path, (event, index) => {
    return event.id == req.params.id;
  });
  return res.json(event);
}

function getAll(path, req, res) {
  var list;
  if (req.query.start == undefined || req.query.start == null) {
    list = db.getData(path);
  } else {
    list = db.filter(path, (e, index) => {
      return e.start == req.query.start;
    });
  }
  return res.json(list);
}

function deleteElementById(path, req, res) {
  const id = db.getIndex(path, +req.params.id);
  if(id === -1) {
    return res.json({});
  }
  const deleteEvent = db.getData( path + "["+ id +"]");
  db.delete(path + "["+ id +"]");
  return res.json(deleteEvent);
}

function updateElement(path, req, res) {
  if(req.body.id == undefined || req.body.id == null) {
    return res.status(500).send({ error: 'Cant update element without id in put request' });
  }
  const id = db.getIndex(path, + req.params.id);
  db.push( path + "["+ id +"]", req.body);
  return res.json(req.body);
}

function saveNewElement(path, req, res) {
  if(req.body.id != undefined && req.body.id != null) {
    return res.status(500).send({ error: 'Cant save element with id in post request' });
    }
    var id;
    if(db.count(path) == 0 ) {
      id = 1;
    } else {
      id = db.getData(path+"[-1]").id + 1
    };
    req.body.id = id;
    db.push(path+"[]", req.body);
    return res.json(req.body);
}

const appAngular = express();

const port = 3100

appAngular.use(express.static(__dirname + '/organizer'));

appAngular.all('*', (req, res) => {
    res.status(200).sendFile(__dirname + '/organizer/index.html');
  });

appAngular.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})