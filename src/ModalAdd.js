import { Form, Input, Modal, Radio, Select } from "antd";
import FormColorPicker from "./FormColorPicker";

export default function ModalAdd({ visible, onCancel, onOk, colorList = [] }) {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form
      .validateFields()
      .then(values => {
        onOk(values);
        form.resetFields();
      })
  }

  const require = { required: true, message: '未输入信息' };

  return <Modal
    title='添加变量'
    visible={visible}
    onCancel={onCancel}
    onOk={handleSubmit}
    destroyOnClose>
    <Form form={form} labelCol={{ span: 4 }}>
      <Form.Item name='target' initialValue={'color'} label='类型'>
        <Radio.Group>
          <Radio.Button value="color">颜色</Radio.Button>
          <Radio.Button value="value">内容</Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Form.Item required name={'name'} label='Name' rules={[require]}>
        <Input placeholder="eg: primary-text" />
      </Form.Item>
      <Form.Item noStyle shouldUpdate={(prev, cur) => prev.target !== cur.target}>
        {({ getFieldValue }) => {
          return getFieldValue('target') === 'color' ?
            <div>
              <Form.Item name={'value'} label='色值' initialValue={'#FFF'} rules={[require]}>
                <FormColorPicker />
              </Form.Item>
              <Form.Item name={'value'} label='色值'>
                <Select>
                  {colorList.map(item => <Select.Option key={`var(--${item.name})`}>{item.remark}(--{item.name})</Select.Option>)}
                </Select>
              </Form.Item>
            </div> :
            <Form.Item required name={'value'} label='内容' rules={[require]}>
              <Input placeholder="eg: 100px" />
            </Form.Item>
        }}
      </Form.Item>
      <Form.Item required name={'remark'} label='备注' rules={[require]}>
        <Input placeholder="eg: 主要文字" />
      </Form.Item>
    </Form>
  </Modal>
}