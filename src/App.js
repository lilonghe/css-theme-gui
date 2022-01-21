import { useEffect, useMemo, useState } from 'react';
import './App.css';
import { ChromePicker } from 'react-color';
import { Button, Card, Empty, Input, Modal, PageHeader, Popover, Tooltip } from 'antd';
import { generateCSSCode, saveVariableList, readVariableList } from './utils';
import ModalAdd from './ModalAdd';

const decimalToHex = (alpha) => {
  let aHex = Math.round(255 * alpha).toString(16);
  return alpha === 1 ? '' : aHex.length < 2 ? `0${aHex}` : aHex;
}

function App() {
  const [showAddModal, setShowAddModal] = useState();
  const [variableList, setVariableList] = useState([]);
  const colorList = useMemo(() => variableList.filter(item => item.target === 'color'), [variableList]);
  const valueList = useMemo(() => variableList.filter(item => item.target === 'value'), [variableList]);

  const handleChangeColor = (color, name) => {
    let hex = (color.hex + decimalToHex(color.rgb.a)).toUpperCase();

    let i = variableList.findIndex(item => item.name === name);
    variableList[i].color = hex;

    setVariableList([...variableList]);
    saveVariableList(variableList);
  }

  const generateCSSVariable = (list) => {
    let code = '';
    list.map((item, i) => {
      item.remark && (code += `    // ${item.remark}\n`);
      code += `    --${item.name}: ${item.target === 'color' ? item.color : item.value};`;
      if (i !== list.length - 1) {
        code += '\n\n';
      }
    })
    return code;
  }

  const handleGenerateCode = () => {
    let coloCSSCode = generateCSSVariable(colorList);
    let valueCSSCode = generateCSSVariable(valueList);

    let code = coloCSSCode + valueCSSCode;
    if (coloCSSCode.length !== 0 && valueCSSCode.length !== 0) {
      code = coloCSSCode + '\n\n' + valueCSSCode;
    }

    let cssCode = generateCSSCode(code);
    Modal.success({
      icon: false,
      width: 800,
      content: <div>
        <Input.TextArea value={cssCode} autoSize={true} />
      </div>
    })
  }

  const handleAddItem = (values) => {
    let newVariableList = [...variableList, values];
    saveVariableList(newVariableList);
    setVariableList(newVariableList);
    setShowAddModal(false);
  }

  useEffect(() => {
    let list = readVariableList();
    setVariableList(list);
  }, []);

  return (
    <div className="App">
      <PageHeader extra={<div className='headerActions'>
        <Button onClick={_ => setShowAddModal(true)}>添加变量</Button>
        <Button type='primary' onClick={handleGenerateCode}>生成代码</Button>
      </div>} />
      {variableList.length === 0  && <Empty style={{marginTop: '15%'}} />}
      {colorList.length > 0 && <Card title={'颜色'}>
        <ul className='colorCards'>
          {colorList.map(item => <li key={item.name} className='colorCard'>
            <div className='cardTitle'>
              <Tooltip title={item.remark}>
                {item.remark}
              </Tooltip>
            </div>
            <div className='cardContent'>
              <Popover
                destroyTooltipOnHide={true}
                overlayClassName='colorPickerPop'
                content={<div>
                  <ChromePicker color={item.color} onChange={newColor => handleChangeColor(newColor, item.name)} />
                </div>}>
                <div className='color' style={{ backgroundColor: item.color }}></div>
              </Popover>

              <div className='colorHEX'>{item.color}</div>
            </div>
          </li>)}
        </ul>
      </Card>}

      {valueList.length > 0 && <Card title='内容'>
        <ul>
          {valueList.map(item => <li 
            className='valueItem' 
            key={item.name}>
              <label>{item.remark}(--{item.name})：</label><span>{item.value}</span>
            </li>)}
        </ul>
      </Card>}

      <ModalAdd
        visible={showAddModal}
        onOk={handleAddItem}
        onCancel={_ => setShowAddModal(false)}
      />
    </div>
  );
}

export default App;
