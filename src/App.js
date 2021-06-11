import * as fs from 'fs';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import './App.css';
import { thirdPlaceTable } from './testData';

function Team(props) {
  const progressing = (props.progressing) ? 'progressing' : 'leaving';
  return (
    <tr className={progressing}>
      <td className='position'>{props.position}</td>
      <td className='teamName'>{props.team.team_name.toUpperCase()}</td>
      <td style={{textAlign: 'center'}}>{ props.team.played }</td>
      <td style={{textAlign: 'center'}}>{ props.team.wins }</td>
      <td style={{textAlign: 'center'}}>{ props.team.draws }</td>
      <td style={{textAlign: 'center'}}>{ props.team.lost }</td>
      <td style={{textAlign: 'center'}}>{ props.team.goals }</td>
      <td className='points'>{props.team.points}</td>
    </tr>
  );
}

Team.propTypes = {
  position: PropTypes.number,
  progressing :PropTypes.bool,
  team: PropTypes.shape({
    team_name: PropTypes.string,
    played: PropTypes.number,
    wins: PropTypes.number,
    draws: PropTypes.number,
    lost: PropTypes.number,
    goals: PropTypes.string,
    points: PropTypes.number
  })
};

function Table() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [table, setItems] = useState([]);

  // Note: the empty deps array [] means
  // this useEffect will run once
  // similar to componentDidMount()
  useEffect(() => {
    fetch('https://dugarry.herokuapp.com/api/table')
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  else if (!isLoaded) {
    return <div>Loading...</div>;
  }
  else {
    const rows = [];
    for (const [i, team] of table.entries()) {
      let progressing = i < 4;
      const newRow = (
        <Team progressing={ progressing } position={ i + 1 } team = { team }/>
      );
      rows.push(newRow);
    }
    return (
      <table className="thirdPlaceTable">
        <tr className="header">
          <td>#</td>
          <td>Nation</td>
          <td style={{textAlign: 'center'}}>Pl</td>
          <td style={{textAlign: 'center'}}>W</td>
          <td style={{textAlign: 'center'}}>D</td>
          <td style={{textAlign: 'center'}}>L</td>
          <td style={{textAlign: 'center'}}>Goals</td>
          <td>Pts</td>
        </tr>
        { rows }
      </table>
    );
  }
}

function Title() {
  return (
    <h1 className="title">Euro 2020 3rd Place Tracker</h1>
  );
}

function App() {
  return (
    <div>
      <Title></Title>
      <Table/>
    </div>
  );
}

export default App;
