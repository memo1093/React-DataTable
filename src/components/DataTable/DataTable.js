import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./DataTable.css";

const DataTable = ({
  columns,
  data,
  actions,
  hideColumns,
  onDeleteSelected,
  onDownloadSelected,
  rangeOptions,
  statusColumnName,
  imageColumnNames,
  imageAvatar,
  sortingColumnNames,
  statusTrueText,
  statusFalseText,
  searchPlaceholder = "Search...",
}) => {
  const [ids, setIds] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [keys, setKeys] = useState([]);
  const [dataArray, setDataArray] = useState([data.length > 0 && data]);
  const [order, setOrder] = useState({ field: "", orderByAsc: true }); //Needs to get this from data because of sorts depends on real data fields
  const [range, setRange] = useState(rangeOptions||["5", "10", "25", "50"]);
  const [page, setPage] = useState({
    pageNumber: 1,
    pageSize: range[0] || 5,
    totalPage: 0,
    startingRange: 0,
    endRange: parseInt(range[0])||5,
  });

  useEffect(() => {
    if (data.length > 0) {
      setKeys(Object.getOwnPropertyNames(data[0]));
      setDataArray([
        ...data
          .filter((data) =>
            Object.keys(data).some((key) =>
              data[key]
                .toString()
                .toLocaleLowerCase()
                .includes(searchText.toLocaleLowerCase())
            )
          )
          .sort((a, b) =>
            order.orderByAsc
              ? a[order.field] > b[order.field]
                ? 1
                : -1
              : a[order.field] < b[order.field]
              ? 1
              : -1
          ),
      ]);
      setPage({ ...page, totalPage: Math.ceil(dataArray.length / page.pageSize) });
      rangeOptions&&setRange(rangeOptions)
      
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    searchText,
    order,
    page.totalPage,
    page.pageSize,
    page.pageNumber,
    page.endRange,
    ids,
    columns,
    range,
    rangeOptions,
    data,
    actions,
  ]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      dataArray.map(
        (data) =>
        !ids.includes(data.id) &&
        setIds((prevState) => [...prevState, data.id])
      );
    } else {
      setIds([]);
    }
  };
  const handleSelectOne = (e, data) => {
    if (e.target.checked) {
      setIds((prevState) => [...prevState, data.id]);
    } else {
      setIds((prevState) => [prevState.filter((id) => id !== data.id)]);
    }
  };
  
  const handleOrder = (field) => {
    if (order.field === field 
      && sortingColumnNames.indexOf(field)>-1 
      ) {
      return setOrder({ field: field, orderByAsc: !order.orderByAsc });
    }
    return sortingColumnNames.indexOf(field)>-1 &&setOrder({ field: field, orderByAsc: true });
  };
  const handleDelete = () => {
    onDeleteSelected(ids);
  };
  const handleDownload = () => {
    onDownloadSelected(ids);
  };

  const handlePage = (operation, pagesize) => {
    if (operation === "Resize Page" && parseInt(pagesize)) {
      let pageSize = parseInt(pagesize);
      return setPage({
        ...page,
        pageSize: pageSize,
        startingRange: page.pageNumber * pagesize - pagesize,
        endRange:
        dataArray.length < page.pageNumber * pagesize
            ? dataArray.length
            : page.pageNumber * pagesize,
      });
    }
    if (operation === "Increase Page") {
      return (
        page.pageNumber + 1 <= page.totalPage &&
        setPage({
          ...page,
          pageNumber: page.pageNumber + 1,
          startingRange:
            (page.pageNumber + 1) * page.pageSize - page.pageSize < data.length
              ? (page.pageNumber + 1) * page.pageSize - page.pageSize
              : data.length - page.pageSize,
          endRange:
          dataArray.length < (page.pageNumber + 1) * page.pageSize
              ? dataArray.length
              : (page.pageNumber + 1) * page.pageSize,
        })
      );
    }
    if (operation === "Decrease Page") {
      return (
        page.pageNumber - 1 > 0 &&
        setPage({
          ...page,
          pageNumber: page.pageNumber - 1,
          startingRange: (page.pageNumber - 1) * page.pageSize - page.pageSize,
          endRange:
            dataArray.length < (page.pageNumber - 1) * page.pageSize
              ? dataArray.length
              : (page.pageNumber - 1) * page.pageSize,
        })
      );
    }
    if (operation === "Change Range") {
      return setPage({
        ...page,
        startingRange: page.pageNumber * page.pageSize - page.pageSize,
        endRange: page.pageNumber * page.pageSize,
      });
    }
  };

  return (
    <div className="datatable-container">
    <div className="datatable">
      <div className="datatable-title">
        <input
          type="text"
          placeholder={searchPlaceholder}
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
          className="datatable-searchbar"
        />
        <i className="fas fa-search datatable-search-icon"></i>
        <div className="datatable-title-icons">
          {onDownloadSelected && (
            <button
              className="fas fa-download"
              onClick={() => handleDownload()}
            ></button>
          )}
          {onDeleteSelected && (
            <button
              className="far fa-trash-alt"
              onClick={() => handleDelete(ids)}
            ></button>
          )}
        </div>
      </div>
      <table className="datatable-table">
        <thead className="datatable-thead">
          <tr>
            <td className="datatable-td">
              <input
                className="datatable-checkbox"
                type="checkbox"
                onChange={(e) => handleSelectAll(e)}
              />
            </td>
            {keys.map(
              (key, i) =>
              (hideColumns?hideColumns.indexOf(key)<=-1:true) && (
                  <td
                  className={
                    statusColumnName===key
                    ? "datatable-td datatable-status-title"
                    : "datatable-td"
                  }
                  //We gave handleOrder and icons manually because user may set columns outside
                  key={key}
                  onClick={() => handleOrder(Object.keys(data[0])[i])}
                  >
                    {columns
                      ? columns[i]
                      : key[0].toUpperCase() + key.slice(1, key.length)}
                    {Object.keys(data[0])[i] === order.field && (
                      <i
                        className={
                          order.orderByAsc
                            ? "fas fa-arrow-up"
                            : "fas fa-arrow-down"
                        }
                      ></i>
                    )}
                  </td>
                )
            )}
            <td className="datatable-td"></td>
          </tr>
        </thead>
        <tbody className="datatable-tbody">
          {dataArray.length > 0 &&
            dataArray.slice(page.startingRange, page.endRange).map((data) => (
              <tr key={data.id}>
                <td className="datatable-td">
                  <input
                    type="checkbox"
                    className="datatable-checkbox"
                    value={data.id}
                    checked={ids.includes(data.id)}
                    onChange={(e) => handleSelectOne(e, data)}
                  />
                </td>
                {Object.entries(data).map(
                  ([key, value], i) =>
                  (hideColumns?hideColumns.indexOf(key)<=-1:true) && (
                      
                      (imageColumnNames&&imageColumnNames.includes(key))?(<td key={i}><img className={imageAvatar?"datatable-avatar":""} src={value} alt={key}/></td>):(<td
                        className={
                          statusColumnName===key
                            ? value
                              ? "datatable-td datatable-status-true"
                              : "datatable-td datatable-status-false"
                            : "datatable-td"
                        }
                        key={i}
                      >
                        <p>
                          {statusColumnName===key
                            ? value
                              ? statusTrueText
                              : statusFalseText
                            : value.toString()}
                        </p>
                      </td>)
                    )
                )}
                <td>

                {actions&&<Action actions={actions} id={data.id}/>}
                </td>
              </tr>
            ))}
        </tbody>
        <tfoot className="datatable-paginate">
          <tr>
            {keys.map((key, i) => (i < keys.length - 1 ? <td></td> : ""))}
            <td>
              Rows per page:
              <select
                className="datatable-page-size"
                onChange={(e) => handlePage("Resize Page", e.target.value)}
              >
                {range.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <p className="datatable-page-info">
                {page.startingRange + 1} -{page.endRange} of {dataArray.length}
              </p>
              <button
                className={
                  page.pageNumber > 1
                    ? "datatable-page-arrow"
                    : "datatable-page-arrow-disabled"
                }
                onClick={() => handlePage("Decrease Page")}
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <button
                className={
                  page.endRange < dataArray.length
                    ? "datatable-page-arrow"
                    : "datatable-page-arrow-disabled"
                }
                onClick={() => handlePage("Increase Page")}
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
    </div>
  );
};

const Action = ({ actions,id }) => {
  const [open, setOpen] = useState(false);
  const handleClick=(onClick)=>{
    return onClick(id)
  }
  useEffect(() => {
    document.addEventListener("mousedown",(e)=>{
      if (!e.target.className.includes("action")) {
        setOpen(false)
      }
    })
  }, [])
  return (
    <div >
      <button onClick={()=>setOpen(!open)} className="datatable-action-dot">&#8942;</button>
      {open&&<div className="datatable-actions">{
        React.Children.map(actions.props.children,(action,i)=>{
          
          return React.cloneElement(action,{onClick:()=>handleClick(action.props.onClick),class:"datatable-action"})
        })
      }</div>}
    </div>
  );
};

DataTable.propTypes = {
  actions:PropTypes.element,
  columns: PropTypes.array,
  data: PropTypes.array.isRequired,
  imageColumnNames: PropTypes.arrayOf(PropTypes.string),

  onDeleteSelected: PropTypes.func,
  onDownloadSelected: PropTypes.func,
  rangeOptions: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  ),
  sortingColumnNames: PropTypes.arrayOf(PropTypes.string),
  searchPlaceholder:PropTypes.string,  
  statusColumnName: PropTypes.string,
  statusFalseText: PropTypes.string,
  statusTrueText: PropTypes.string,
};

export default DataTable;
