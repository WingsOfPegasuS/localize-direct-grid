import React, { useState } from "react";
import { saveFile } from "@grapecity/wijmo";
import { FlexGrid } from "@grapecity/wijmo.react.grid";
import { CellRange } from "@grapecity/wijmo.grid";
import "@grapecity/wijmo.styles/wijmo.css";

// Generate random data!
const getData = (cnt, start) => {
  let data = [];
  if (!start) start = 0;
  for (let i = 0; i < cnt; i++) {
    data.push({
      ID: i + start,
      A: Math.random() * 10000,
      B: Math.random() * 10000,
      C: Math.random() * 10000,
      D: Math.random() * 10000,
      E: Math.random() * 10000,
      F: Math.random() * 10000,
      G: Math.random() * 10000,
      H: Math.random() * 10000,
      I: Math.random() * 10000,
      J: Math.random() * 10000,
      K: Math.random() * 10000,
      L: Math.random() * 10000,
      M: Math.random() * 10000,
      N: Math.random() * 10000,
      O: Math.random() * 10000,
      P: Math.random() * 10000,
      Q: Math.random() * 10000,
      R: Math.random() * 10000,
      S: Math.random() * 10000,
      T: Math.random() * 10000,
      U: Math.random() * 10000,
      V: Math.random() * 10000,
      W: Math.random() * 10000,
      X: Math.random() * 10000,
      Y: Math.random() * 10000,
      Z: Math.random() * 10000,
    });
  }
  return data;
};

const LocalizeDirectGrid = () => {
  let grid = null;
  const [currentGrid, setCurrentGrid] = useState(null);
  const [gridData, setGridData] = useState(getData(100));
  const [selectionAllow, setSelectionAllow] = useState(false);
  const [rowCount, setRowCount] = useState(0);

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
        handleAddData(gridData, 20);
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
  const handleAddData = (data, cnt) => {
    let more = getData(cnt, data?.length);
    for (let i = 0; i < more?.length; i++) {
      gridData?.push(more[i]);
    }
    setGridData(gridData);
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
    </div>
  );
};

export default LocalizeDirectGrid;
