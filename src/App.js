import "./styles.css";
import "react-filter-box/lib/react-filter-box.css";
import React, { Component } from "react";

import FilterBox from "./components/FilterBox";

export class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>CSV Filter</h1>
        <FilterBox />
      </div>
    );
  }
}
