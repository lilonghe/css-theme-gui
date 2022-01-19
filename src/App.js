import { useState } from 'react';
import './App.css';
import { ChromePicker } from 'react-color';
import { Popover } from 'antd';

const decimalToHex = (alpha) => {
  let aHex = Math.round(255 * alpha).toString(16);
  return alpha === 1 ? '' : aHex.length < 2 ? `0${aHex}` : aHex;
}

function App() {
  const [colors, setColors] = useState([
    {
      name: 'primary-text',
      color: '#212121',
    },{
      name: 'main-text',
      color: '#666666',
    },{
      name: 'secondary-text',
      color: '#9E9E9E',
    }, {
      name: 'warning-text',
      color: '#F06546',
    }
  ]);

  const handleChangeColor = (color, name) => {
    let hex = color.hex + decimalToHex(color.rgb.a);
    setColors(arr => {
      let i = arr.findIndex(item => item.name === name);
      arr[i].color = hex;
      return [...arr];
    })
  }

  return (
    <div className="App">
      <ul className='colorCards'>
        {
          colors.map(color => <li key={color.name}>
            <Popover 
              destroyTooltipOnHide={true}
              overlayClassName='colorPickerPop'
              content={<div>
              <ChromePicker color={color.color} onChange={newColor => handleChangeColor(newColor, color.name)} />
            </div>}>
              <div className='color' style={{backgroundColor: color.color}}></div>
            </Popover>
            
            <div className='colorHEX'>{color.color}</div>
          </li>)
        }
      </ul>
    </div>
  );
}

export default App;
