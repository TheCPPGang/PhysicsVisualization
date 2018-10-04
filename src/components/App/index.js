import React, { Component } from 'react';
import 'sanitize.css/sanitize.css';
import Doodle from "../Doodle";

class App extends Component {
  render() {
    return (
      <div>
        <Doodle />
        <h1>Hello World</h1>
      </div>
    );
  }
}

export default App;
