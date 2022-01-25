import { Table } from "antd";

export default function VariableListView({ variableList }) {

  const columns = [
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '变量名',
      dataIndex: 'name',
      render: text => <span>--{text}</span>
    },
    {
      title: '变量值',
      dataIndex: 'value',
      render: (text, record) => {
        if (record.target === 'color') {
          return <div className="listColorExample" style={{ backgroundColor: record.value }}></div>
        }
        return text;
      }
    }
  ]

  return (
    <Table
      bordered
      size="middle"
      pagination={false}
      rowKey={r => r.name}
      columns={columns}
      dataSource={variableList} />
  )
}