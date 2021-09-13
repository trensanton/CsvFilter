import React from "react";

import { Table, Column, Cell } from "fixed-data-table-2";
import "fixed-data-table-2/dist/fixed-data-table.min.css";
import ReactFilterBox, {
  SimpleResultProcessing,
  Expression
} from "react-filter-box";
import ParseRawData from "./ParseRawData";
import { BUTTON_TYPE, CSVDownloader } from "react-papaparse";

export default class FilterBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: [],
      data: [],
      filteredData: []
    };

    this.options = [];
  }

  onFileChange = (event) => {
    const file = event.target.files[0];
    console.log(file);

    var reader = new FileReader();
    reader.onload = (e) => {
      let parsedData = ParseRawData(reader.result);
      let fieldNames = parsedData[0];
      let objectsArray = parsedData[1];
      let optionsDict = parsedData[2];
      this.setState({
        fields: fieldNames,
        data: objectsArray,
        filteredData: objectsArray
      });
      this.options = optionsDict;
    };
    try {
      reader.readAsText(file);
    } catch {
      alert("No file chosen.");
    }
  };

  onParseOk = (expressions) => {
    let newData = new SimpleResultProcessing(this.options).process(
      this.state.data,
      expressions
    );
    this.setState({ filteredData: newData });
    // console.log(newData);
  };

  render() {
    var rows = this.state.filteredData;
    return (
      <div className="main-container">
        <h3>Support filter data out of the box </h3>

        <div>
          <form>
            <p>Upload File :</p>
            <input onChange={this.onFileChange} type="file" />
          </form>
        </div>

        <ReactFilterBox
          query={this.state.query}
          data={this.state.data}
          options={this.options}
          onParseOk={this.onParseOk}
        />
        <Table
          rowHeight={50}
          rowsCount={rows.length}
          width={800}
          height={300}
          headerHeight={50}
        >
          {this.state.fields.map((fieldName, index) => {
            return (
              <Column
                extension=".csv"
                header={fieldName}
                cell={({ rowIndex }) => (
                  <Cell>{rows[rowIndex][fieldName]}</Cell>
                )}
                width={200}
              />
            );
          })}
        </Table>

        <CSVDownloader
            data={this.state.filteredData}
            type="button"
            filename={'filteredData'}
        >
            Download
        </CSVDownloader>
      </div>
    );
  }
}
