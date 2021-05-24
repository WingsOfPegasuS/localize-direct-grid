import React, { useState, useEffect } from "react";
import { saveFile } from "@grapecity/wijmo";
import { FlexGrid } from "@grapecity/wijmo.react.grid";
import { CellRange } from "@grapecity/wijmo.grid";
import "@grapecity/wijmo.styles/wijmo.css";

const LocalizeDirectGrid = () => {
  let grid = null;
  const [currentGrid, setCurrentGrid] = useState(null);
  const [gridData, setGridData] = useState([]);
  const [selectionAllow, setSelectionAllow] = useState(false);
  const [rowCount, setRowCount] = useState(0);

  useEffect(() => {
    let url = `http://localhost:3000/data?_start=0&_end=100`;
    var initialList = [];
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        for (let i = 0; i < data?.length; i++) {
          initialList.push(data[i]);
        }
        setGridData(initialList);
      });
  }, []);

  // Initialize grid!
  const initializeGrid = (obj) => {
    grid = obj;
    setCurrentGrid(obj);
    setRowCount(obj.rows.length);
    obj.updatedView.addHandler((s) => {
      setRowCount(s.rows.length);
    });
    obj.scrollPositionChanged.addHandler((s) => {
      if (s.viewRange.bottomRow >= s.rows.length - 1) {
        let view = s.collectionView;
        let index = view.currentPosition;
        handleAddData(s.rows.length);
        view.refresh();
        view.currentPosition = index;
      }
    });
  };

  // Export the grid to CSV!
  const exportGridToCsv = () => {
    let range = new CellRange(
      0,
      0,
      currentGrid.rows.length - 1,
      currentGrid.columns.length - 1
    );
    let csv = currentGrid.getClipString(range, true, true);
    saveFile(csv, "LocalizeDirectGrid.csv");
  };

  // Export the selection to CSV!
  const exportSelectionToCsv = () => {
    let csv = currentGrid.getClipString(null, true, true);
    saveFile(csv, "LocalizeDirectGrid.csv");
  };

  // Add new rows!
  const handleAddData = (rowCount) => {
    let url = `http://localhost:3000/data?_start=${rowCount - 1}&_end=${
      rowCount + 99
    }`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        for (let i = 0; i < data?.length; i++) {
          setGridData((gridData) => [...gridData, data[i]]);
        }
      });
  };

  return (
    <div style={{ height: "100vh", overflow: "hidden" }}>
      <div
        style={{
          marginBottom: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 5,
        }}
      >
        <div>
          <button style={{ height: 50 }} onClick={() => exportGridToCsv()}>
            Export Whole Grid
          </button>
          <button
            style={{ height: 50 }}
            onClick={() => exportSelectionToCsv()}
            disabled={!selectionAllow}
          >
            Export Selection
          </button>
        </div>
        <div style={{ textAlign: "right" }}>
          <i>
            Row Count: <b>{rowCount}</b>
          </i>
        </div>
      </div>
      <FlexGrid
        style={{ height: "calc( 100vh - 70px)" }}
        alternatingRowStep={0}
        showMarquee={true}
        anchorCursor={true}
        selectionMode="MultiRange"
        showSelectedHeaders="All"
        itemsSource={gridData}
        initialized={(s) => initializeGrid(s)}
        selectionChanged={() => {
          setSelectionAllow(true);
          setCurrentGrid(grid);
        }}
      />
      )
    </div>
  );
};

export default LocalizeDirectGrid;
