var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var fs = require('fs'); // for reading and writing files
var mysql = require('mysql2/promise');
var bodyParser = require('body-parser'); // for parsing request body

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var hostDatabase = 'localhost';
var userDatabase = 'root';
var passwordDatabase = '';
var nameDatabase = 'DogWalkService';
var PORT = 8080;

let pool;

(async function () {
  try {
    pool = await mysql.createPool({
      host: hostDatabase,
      user: userDatabase,
      password: passwordDatabase,
      database: nameDatabase,
      waitForConnections: true,
      connectionLimit: 10,
      multipleStatements: true
    });

    const schema = fs.readFileSync(path.join(__dirname, 'dogwalks.sql'), 'utf-8');
    const seed   = fs.readFileSync(path.join(__dirname, 'task1_5.sql'), 'utf-8');
    await pool.query(schema);
    await pool.query(`USE ${nameDatabase}`);
    await pool.query(seed);

    console.log('Database loaded successfully.');
  } catch (err) {
    console.error('Error loading database:', err);
    process.exit(1);
  }
})();

// express route:
var app = express();
// /api/dogs
    app.get('/api/dogs', async (req, res) => {
    try {
        var query = `
            SELECT d.name AS dog_name, d.size, u.username AS owner_username
            FROM Dogs d
            JOIN Users u ON u.user_id = d.owner_id;`
        const [rows] = await pool.query(query);
        res.json(rows); // Send the result as JSON response
    } catch (err) {
        console.error('Error fetching dogs:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        }
    });

// /api/walkrequests/open
    app.get('/api/walkrequests/open', async (req, res) => {
    try {
        var query = `
            SELECT wr.request_id, d.name AS dog_name, wr.requested_time, wr.duration_minutes, wr.location, u.username AS owner_username
            FROM WalkRequests wr
                JOIN Dogs d ON d.dog_id = wr.dog_id
                JOIN Users u ON u.user_id = d.owner_id
            WHERE wr.status = 'open';`
        const [rows] = await pool.query(query);
        res.json(rows);

    } catch (err) {
        console.error('Error fetching walk requests of status "open":', err);
        res.status(500).json({ error: 'Could not fetch open requests' });
    }
});

// /api/walkers/summary
app.get('/api/walkers/summary', async (req, res) => {
    try {
        var query = `
            SELECT w.username AS walker_username,
                COUNT(r.rating_id) AS total_ratings,
                ROUND(AVG(r.rating), 2) AS average_rating,
                SUM(CASE WHEN wr.status='completed'
                THEN 1 ELSE 0 END) AS completed_walks
            FROM Users w
            LEFT JOIN WalkApplications wa ON wa.walker_id = w.user_id AND wa.status  = 'accepted'
            LEFT JOIN WalkRequests wr ON wr.request_id = wa.request_id
            LEFT JOIN WalkRatings  r  ON r.request_id  = wr.request_id
            WHERE w.role = 'walker'
            GROUP BY w.user_id;`
        const [rows] = await pool.query(query);
        res.json(rows);

    } catch (err) {
        console.error('Error fetching walkers summary:', err);
        res.status(500).json({ error: 'Could not fetch walkers summary' });
    }
});

app.use(logger('dev'));
app.set('json spaces', 2);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// start the server
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = app;
