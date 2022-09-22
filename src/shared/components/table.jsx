/* eslint-disable react/no-array-index-key */
import { Table } from '@mantine/core';

export default function TableComponent(props) {
  const { data = [], config, handlers = {} } = props;
  const { rowKey, columnDefs } = config;

  const tableHeads = columnDefs.map(({ display }) => display);
  const cells = columnDefs.map(({ value }) => value);

  return (
    <Table>
      <thead>
        <tr>
          {tableHeads.map((columnName, idx) => (
            <th key={`${columnName}-${idx}`}>{columnName}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((element) => (
          <tr key={element[rowKey]}>
            {cells.map((cell, idx) => (
              <td key={`${element[rowKey]}-${cell || tableHeads[idx]}`}>
                {columnDefs[idx].renderer
                  ? columnDefs[idx].renderer(element, handlers)
                  : element[cell]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
