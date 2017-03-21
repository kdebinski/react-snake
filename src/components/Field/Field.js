import React from 'react';
import './Field.css';

const Field = (props) => {

  return (
    <div key={"field-"+props.keyNum} className={"field "+props.type}>
        </div>
  );
}

export default Field;