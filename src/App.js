import "./App.css";
import DataTable from "./components/DataTable/DataTable";
import { useEffect, useState } from "react";

function App() {
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then((response) => response.json())
      .then((json) => setData1(json));

    fetch("https://jsonplaceholder.typicode.com/photos")
      .then((response) => response.json())
      .then((json) => setData2(json));
  }, []);

  const removeAll = (ids) => {
    console.log("deleted: " + [ids]);

    return null;
  };
  const download = (ids) => {
    console.log("downloaded: " + [ids]);
    return null;
  };
  const deleteOne = (id) => {
    console.log("deleted object id with " + id);
    return null;
  };
  const showOne = (id) => {
    console.log("showed object id with " + id);
    return null;
  };
  const closeOne = (id) => {
    console.log("closed object id with " + id);
    return null;
  };
  return (
    <div className="App">
      <DataTable
        columns={["Kullanıcı Id", "Başlık", "Tamamlandı"]}
        onDeleteSelected={removeAll}
        onDownloadSelected={download}
        hideColumns={["id"]}
        data={data1}
        rangeOptions={[5, 20, 30, 40]}
        statusColumnName={"completed"}
        searchPlaceholder="Ara..."
        statusTrueText="Bitti"
        statusFalseText="Bitmedi"
        sortingColumnNames={["completed", "title"]}
        actions={
          <div>
            <button onClick={(id)=>deleteOne(id)}>Delete</button>
            <button onClick={(id)=>showOne(id)}>Show</button>
            <button onClick={(id)=>closeOne(id)}>Close</button>
          </div>
        }
      />

      <DataTable
        onDeleteSelected={removeAll}
        onDownloadSelected={download}
        hideColumns={["id"]}
        data={data2}
        imageColumnNames={["url", "thumbnailUrl"]}
        imageAvatar
        sortingColumnNames={["title", "albumId"]}
      />
    </div>
  );
}

export default App;
