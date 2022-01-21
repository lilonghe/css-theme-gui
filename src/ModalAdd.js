import { Form, Input, Modal, Radio, Select } from "antd";
import FormColorPicker from "./FormColorPicker";

export default function ModalAdd({ visible, onCancel, onOk }) {
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
          <Radio.Button value="size">尺寸</Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Form.Item noStyle shouldUpdate={(prev, cur) => prev.target !== cur.target}>
        {({ getFieldValue }) => {
          return getFieldValue('target') === 'color' ?
            <Form.Item name={'color'} label='色值' initialValue={'#FFF'} rules={[require]}>
              <FormColorPicker />
            </Form.Item> :
            <Form.Item required name={'size'} label='尺寸' rules={[require]}>
              <Input placeholder="eg: 100px" />
            </Form.Item>
        }}
      </Form.Item>

      <Form.Item required name={'name'} label='Name' rules={[require]}>
        <Input placeholder="eg: primary-text" />
      </Form.Item>
      <Form.Item required name={'remark'} label='备注' rules={[require]}>
        <Input placeholder="eg: 主要文字" />
      </Form.Item>
    </Form>
  </Modal>
}