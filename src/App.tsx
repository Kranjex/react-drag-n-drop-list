import DragElement, { DataType } from "./components/DragElement";
import "./style/App.css";

const data: DataType[] = [
  { title: "Group 1", items: ["Item 1", "Item 2", "Item 3"] },
  { title: "Group 2", items: ["Item 4", "Item 5"] },
];

function App() {
  return (
    <div id="list-container">
      <DragElement data={data} />
    </div>
  );
}

export default App;
