# React Data Table Component
A Component that converts data arrays into data tables.

## Preview
Preview Data belongs to Jsonplaceholder

![Alt text](https://imgur.com/SDzpT5p.jpg)

![Alt text](https://imgur.com/ubFkFm3.jpg)


## How To Use
```javascript
<DataTable
        onDeleteSelected={removeAll}
        onDownloadSelected={download}
        hideColumns={["id"]}
        data={data}
        imageColumnNames={["url", "thumbnailUrl"]}
        imageAvatar
        sortingColumnNames={["title", "albumId"]}
      />
```

```javascript
<DataTable
        columns={["Kullanıcı Id","id", "Başlık", "Tamamlandı"]}
        onDeleteSelected={removeAll}
        onDownloadSelected={download}
        hideColumns={["id"]}
        data={data}
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
```

**data:** This props is required. You need to send object array without nested objects or arrays

**columns:** You can set column names with this props manually. It needs to column name count equals to original data fields except hidden columns. You need to write into array prop object field name in current data with exact location if you have **hideColumns**.

**onDeleteSelected:** You can send a function to this props. This sends selected id's into the sent function.

**onDownloadSelected:** You can send a function to this props. This sends selected id's into the sent function.

**hideColumns:** You can hide the columns that you sent in.

**rangeOptions:** It sets show ranges per page.

**statusColumnName:** If you want to set status for a column name you need to send object field in this props.

**statusTrueText:** If you set a **statusColumnName** then you can set a text to show when it **statusColumnName** returns true.

**statusFalseText:** If you set a **statusColumnName** then you can set a text to show when it **statusColumnName** returns false.

**sortingColumnNames:** You can set sorting for column name that you sent fields of data.

**actions:** You can put a three dotted button with in buttons you sent to actions props. This button includes buttons that you sent. You need to sent onClick function includes id


