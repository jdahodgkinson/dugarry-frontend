import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import "./App.css";

function Team(props) {
  const tableContext = props.progressing ? "table-success" : "table-danger";
  const team = props.team;
  return (
    <tr className={tableContext}>
      <td>{props.position}</td>
      <td>{team.team_name}</td>
      <td>{team.played}</td>
      <td>{team.wins}</td>
      <td>{team.draws}</td>
      <td>{team.lost}</td>
      <td>{team.goals}</td>
      <td>{team.points}</td>
    </tr>
  );
}

function ThirdPlaceTable() {
  // Define hooks.
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [table, setItems] = useState([]);

  // Attempt to call API.
  useEffect(() => {
    fetch("https://dugarry.herokuapp.com/api/table")
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, []);

  if (error) {
    // Return error message.
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    // Return loading status.
    const spinner = (
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    );
    return spinner;
  } else {
    // Render table.
    const rows = [];
    for (const [i, team] of table.entries()) {
      const newRow = <Team progressing={i < 4} position={i + 1} team={team} />;
      rows.push(newRow);
    }
    return (
      <Table hover>
        <TableHeader />
        {rows}
      </Table>
    );
  }
}

function TableHeader() {
  return (
    <thead className="thead-dark">
      <tr>
        <td>#</td>
        <td>Nation</td>
        <td>Pl</td>
        <td>W</td>
        <td>D</td>
        <td>L</td>
        <td>Goals</td>
        <td>Pts</td>
      </tr>
    </thead>
  );
}

function Title() {
  const style = {
    "text-align": "center",
    "padding": "20px"
  }
  return <h1 style={style}>Euro 2020 3rd Place Tracker</h1>;
}

function App() {
  return (
    <Container>
      <Title/>
      <ThirdPlaceTable />
    </Container>
  );
}

export default App;
