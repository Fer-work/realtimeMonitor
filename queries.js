const SerialPort = require("serialPort");
const Readline = SerialPort.parsers.Readline; // use parsers library to read data from serial port
const parser = new Readline();

const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "realtime",
  password: "*Fer1141997*",
  port: 5432,
});

pool.connect();

const addData = (data) => {
  pool.query(
    "INSERT INTO motion VALUES (default, $1, default, default)",
    [data],
    (error, response) => {
      if (!error) {
        console.log(response.rows);
      } else {
        console.log(error.message);
      }
      pool.end;
    }
  );
};

const getData = (res, req) => {
  pool.query(
    "SELECT COUNT(event) FROM motion WHERE date = '2021-09-10",
    (error, results) => {
      if (error) {
        throw error;
      } else {
        response.status(200).json(results.rows);
      }
    }
  );
};

const getDataById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("SELECT * FROM motion WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const createData = (request, response) => {
  //const { event } = request.body;
  pool.query(
    "INSERT INTO motion (default, '1', default, default) VALUES ($1)",
    [request],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`User added with ID: ${result.insertId}`);
    }
  );
};

const updateData = (request, response) => {
  const id = parseInt(request.params.id);
  const { event } = request.body;

  pool.query(
    "UPDATE users SET name = $1, email = $2 WHERE id = $3",
    [event],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`User modified with ID: ${id}`);
    }
  );
};

const deleteData = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("DELETE FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`User deleted with ID: ${id}`);
  });
};

module.exports = {
  getData,
  getDataById,
  createData,
  updateData,
  deleteData,
  addData,
};
