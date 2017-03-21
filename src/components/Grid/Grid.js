import React from 'react';
import './Grid.css';
import Field from '../Field/Field';

const Grid = (props) => {
  let fields = generateFieldsFromGameStateMap(props.map);
  return (
    <div className="gridwrapper">
      <div className="grid">
      {fields}
      </div>
    </div>
  );
}

function generateFieldsFromGameStateMap(rows){
  let fields = [];

  for(let i=0;i<rows.length;i++){
    let row = [];
    for(let j=0;j<rows[i].length;j++){
      let key = +rows[i][j].id;
      let type = rows[i][j].type;
      row.push((<Field keyNum={key} type={type}/>));
    }
    fields.push(row);
  }
  return fields;
}
export default Grid;