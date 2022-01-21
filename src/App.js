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
  const sizeList = useMemo(() => variableList.filter(item => item.target === 'size'), [variableList]);

  const handleChangeColor = (color, name) => {
    let hex = color.hex + decimalToHex(color.rgb.a);

    let i = variableList.findIndex(item => item.name === name);
    variableList[i].color = hex;

    setVariableList([...variableList]);
    saveVariableList(variableList);
  }

  const generateCSSVariable = (list) => {
    let code = '';
    list.map((item, i) => {
      item.remark && (code += `    // ${item.remark}\n`);
      code += `    --${item.name}: ${item.target === 'color' ? item.color : item.size};`;
      if (i !== list.length - 1) {
        code += '\n\n';
      }
    })
    return code;
  }

  const handleGenerateCode = () => {
    let coloCSSCode = generateCSSVariable(colorList);
    let sizeCSSCode = generateCSSVariable(sizeList);

    let code = coloCSSCode + sizeCSSCode;
    if (coloCSSCode.length !== 0 && sizeCSSCode.length !== 0) {
      code = coloCSSCode + '\n\n' + sizeCSSCode;
    }

    let cssCode = generateCSSCode(code);
    Modal.success({
      icon: false,
      width: 800,
      content: <div>
        <Input.TextArea spellCheck={false} value={cssCode} autoSize={true} />
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

      {sizeList.length > 0 && <Card title='尺寸'>
        <ul>
          {sizeList.map(item => <li className='sizeItem' key={item.name}><label>{item.remark}(--{item.name})：</label>{item.size}</li>)}
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
