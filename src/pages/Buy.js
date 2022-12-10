import {
  ButtonGroup,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/Edit';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import MUIDataTable from 'mui-datatables';
import { createRef, useCallback, useMemo, useState } from 'react';
import { calcTotal, moneyFormat } from '../utils';
import dayjs from 'dayjs';

const emptyRow = {
  id: '',
  name: '',
  weight: 0,
  price: 0,
  discount: 0,
  brokerage: 0,
  currency_in_rupee: 1,
  currency: 'inr',
  buy_date: null,
  terms: '',
  party: '',
  broker: '',
  details: '',
};
const currencies = [
  { label: '₹', value: 'inr' },
  { label: '$', value: 'usd' },
];

export default function Buy() {
  const [data, setData] = useState({ total: 0, rows: [] });
  const [row, setRow] = useState({ ...emptyRow });
  const tableRef = createRef(null);

  const drawPage = useCallback(async ({ page, limit }) => {
    const { rows, total } = await window.api.call('buy.paginate', {
      page,
      limit,
    });
    setData({ rows, total });
  }, []);

  const refreshTable = useCallback(() => {
    if (tableRef.current) {
      const info = tableRef.current.state;
      drawPage({ page: info.page, limit: info.rowsPerPage });
    }
  }, [tableRef, drawPage]);

  const handleDeleteClick = useCallback(
    async (cRow) => {
      await window.api.call('buy.delete', cRow.id);
      refreshTable();
    },
    [refreshTable]
  );

  const handleEditClick = useCallback(
    (cRow) => {
      setRow({ ...cRow, buy_date: dayjs(cRow.buy_date) });
    },
    [setRow]
  );

  const handleClearClick = useCallback(() => {
    setRow({ ...emptyRow });
    refreshTable();
  }, [refreshTable]);

  const handleSaveClick = useCallback(async () => {
    if (row.id) {
      await window.api.call('buy.update', {
        id: row.id,
        obj: {
          ...row,
          buy_date: dayjs(row.buy_date).format('YYYY-MM-DD'),
        },
      });
    } else {
      await window.api.call('buy.insert', {
        ...row,
        buy_date: dayjs(row.buy_date).format('YYYY-MM-DD'),
      });
    }

    handleClearClick();
    refreshTable();
  }, [refreshTable, handleClearClick, row]);

  const columns = [
    {
      name: 'id',
      label: 'Sr.',
      options: {
        filter: false,
        sort: false,
        customHeadLabelRender(info) {
          return (
            <>
              {info.label}
              <hr />
              <TextField
                size="small"
                variant="outlined"
                value={row[info.name]}
                style={{ width: '100px' }}
                disabled
              />
            </>
          );
        },
        customBodyRender(value) {
          return <>#{value}</>;
        },
      },
    },
    {
      name: 'name',
      label: 'Item Name',
      options: {
        filter: false,
        sort: false,
        customHeadLabelRender(info) {
          return (
            <>
              {info.label}
              <hr />
              <TextField
                size="small"
                label={info.label}
                variant="outlined"
                value={row[info.name]}
                style={{ width: '150px' }}
                onChange={(e) =>
                  setRow({ ...row, [info.name]: e.target.value })
                }
              />
            </>
          );
        },
      },
    },
    {
      name: 'weight',
      label: 'Weight (in Ct)',
      options: {
        filter: false,
        sort: false,
        customHeadLabelRender(info) {
          return (
            <>
              {info.label}
              <hr />
              <TextField
                label={info.label}
                type="number"
                size="small"
                variant="outlined"
                value={row[info.name]}
                style={{ width: '120px' }}
                inputProps={{
                  step: 0.001,
                }}
                onChange={(e) =>
                  setRow({ ...row, [info.name]: e.target.value })
                }
              />
            </>
          );
        },
        customBodyRender(value, info) {
          return <>{value} Ct</>;
        },
      },
    },
    {
      name: 'price',
      label: 'Price (per Ct)',
      options: {
        filter: false,
        sort: false,
        customHeadLabelRender(info) {
          const handleChange = (e) => {
            setRow({
              ...row,
              currency: e.target.value,
              ...(e.target.value === 'inr' ? { currency_in_rupee: 1 } : {}),
            });
          };

          return (
            <>
              {info.label}
              <hr />
              <div style={{ display: 'inline-flex' }}>
                <TextField
                  select
                  size="small"
                  // label="Currency"
                  value={row.currency}
                  onChange={handleChange}
                  style={{ marginRight: '5px', width: '90px' }}
                >
                  {currencies.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                {['usd'].includes(row.currency) && (
                  <TextField
                    label={`${row.currency} In Rupee`}
                    type="number"
                    size="small"
                    variant="outlined"
                    style={{ marginRight: '5px', width: '120px' }}
                    value={row.currency_in_rupee}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {
                            currencies.find((i) => i.value === row.currency)
                              ?.label
                          }
                        </InputAdornment>
                      ),
                    }}
                    inputProps={{
                      step: 0.01,
                    }}
                    onChange={(e) =>
                      setRow({ ...row, currency_in_rupee: e.target.value })
                    }
                  />
                )}
                <TextField
                  label={info.label}
                  type="number"
                  size="small"
                  variant="outlined"
                  style={{ marginRight: '5px', width: '150px' }}
                  value={row[info.name]}
                  inputProps={{
                    step: 0.01,
                  }}
                  onChange={(e) =>
                    setRow({ ...row, [info.name]: e.target.value })
                  }
                />
              </div>
            </>
          );
        },
        customBodyRender(value, info) {
          const cRow = info.tableData[info.rowIndex];
          const sign = currencies.find((i) => i.value === cRow.currency)?.label;
          let label = `${sign}${value} per Ct`;
          if (['usd'].includes(cRow.currency)) {
            label += ` / ₹${cRow.currency_in_rupee} per ${sign}`;
          }
          const label2 = `${cRow.weight} Ct * ${sign}${cRow.price} * ₹${
            cRow.currency_in_rupee
          } = ${moneyFormat(calcTotal(cRow, 'subtotal'))}`;
          return (
            <>
              {label}
              <hr />
              {label2}
            </>
          );
        },
      },
    },
    {
      name: 'discount',
      label: 'Discount (%)',
      options: {
        filter: false,
        sort: false,
        customHeadLabelRender(info) {
          return (
            <>
              {info.label}
              <hr />
              <TextField
                label={info.label}
                type="number"
                size="small"
                variant="outlined"
                style={{ width: '120px' }}
                value={row[info.name]}
                inputProps={{
                  step: 0.01,
                  max: 100,
                  min: -100,
                }}
                onChange={(e) =>
                  setRow({ ...row, [info.name]: e.target.value })
                }
              />
            </>
          );
        },
        customBodyRender(value, info) {
          const cRow = info.tableData[info.rowIndex];
          if (!cRow.discount)
            return <div style={{ textAlign: 'center' }}>-</div>;
          const subtotal = moneyFormat(calcTotal(cRow, 'subtotal'));
          let label = `${subtotal} - ${cRow.discount}% = ${moneyFormat(
            calcTotal(cRow, 'discount')
          )}`;
          return label;
        },
      },
    },
    {
      name: 'brokerage',
      label: 'Brokerage (%)',
      options: {
        filter: false,
        sort: false,
        customHeadLabelRender(info) {
          return (
            <>
              {info.label}
              <hr />
              <TextField
                label={info.label}
                type="number"
                size="small"
                variant="outlined"
                style={{ width: '120px' }}
                value={row[info.name]}
                inputProps={{
                  step: 0.01,
                  max: 100,
                  min: 0,
                }}
                onChange={(e) =>
                  setRow({ ...row, [info.name]: e.target.value })
                }
              />
            </>
          );
        },
        customBodyRender(value, info) {
          const cRow = info.tableData[info.rowIndex];
          if (!cRow.brokerage)
            return <div style={{ textAlign: 'center' }}>-</div>;
          const subtotal = moneyFormat(calcTotal(cRow, 'discount'));
          let label = `${subtotal} + ${cRow.brokerage}% = ${moneyFormat(
            calcTotal(cRow, 'brokerage')
          )}`;
          return label;
        },
      },
    },
    {
      name: 'total',
      label: 'Total (in ₹)',
      options: {
        filter: false,
        sort: false,
        customHeadLabelRender(info) {
          return (
            <>
              {info.label}
              <hr />
              <TextField
                size="small"
                // label={info.label}
                variant="outlined"
                value={moneyFormat(calcTotal(row))}
                style={{ width: '120px' }}
                disabled
              />
            </>
          );
        },
        customBodyRender(value, info) {
          const cRow = info.tableData[info.rowIndex];
          return moneyFormat(calcTotal(cRow, 'brokerage'));
        },
      },
    },
    {
      name: 'buy_date',
      label: 'Buy Date',
      options: {
        filter: false,
        sort: false,
        customHeadLabelRender(info) {
          return (
            <>
              {info.label}
              <hr />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label={info.label}
                  value={row[info.name]}
                  inputFormat="DD/MM/YYYY"
                  onChange={(e) => setRow({ ...row, [info.name]: e })}
                  renderInput={(params) => (
                    <TextField
                      style={{ ...params.style, width: '150px' }}
                      size="small"
                      {...params}
                    />
                  )}
                />
              </LocalizationProvider>
            </>
          );
        },
        customBodyRender(value, info) {
          return dayjs(value).format('DD-MM-YYYY');
        },
      },
    },
    {
      name: 'terms',
      label: 'Terms (in days)',
      options: {
        filter: false,
        sort: false,
        customHeadLabelRender(info) {
          return (
            <>
              {info.label}
              <hr />
              <TextField
                label={info.label}
                type="number"
                size="small"
                variant="outlined"
                style={{ width: '120px' }}
                value={row[info.name]}
                inputProps={{
                  step: 1,
                  min: 0,
                }}
                onChange={(e) =>
                  setRow({ ...row, [info.name]: e.target.value })
                }
              />
            </>
          );
        },
        customBodyRender(value, info) {
          return `${value} Days`;
        },
      },
    },
    {
      name: 'due_date',
      label: 'Due Date',
      options: {
        filter: false,
        sort: false,
        customHeadLabelRender(info) {
          let value = null;
          if (row.buy_date) {
            value = dayjs(row.buy_date).add(row.terms, 'day');
          }
          return (
            <>
              {info.label}
              <hr />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  disabled
                  label={info.label}
                  value={value}
                  inputFormat="DD/MM/YYYY"
                  onChange={(e) => {}}
                  renderInput={(params) => (
                    <TextField
                      style={{ ...params.style, width: '150px' }}
                      size="small"
                      {...params}
                    />
                  )}
                />
              </LocalizationProvider>
            </>
          );
        },
        customBodyRender(value, info) {
          const cRow = info.tableData[info.rowIndex];
          const dueDate = dayjs(value).add(cRow.terms, 'day');
          return dueDate.format('DD-MM-YYYY');
        },
      },
    },
    {
      name: 'party',
      label: 'Party Name',
      options: {
        filter: false,
        sort: false,
        customHeadLabelRender(info) {
          return (
            <>
              {info.label}
              <hr />
              <TextField
                label={info.label}
                size="small"
                variant="outlined"
                style={{ width: '150px' }}
                value={row[info.name]}
                onChange={(e) =>
                  setRow({ ...row, [info.name]: e.target.value })
                }
              />
            </>
          );
        },
      },
    },
    {
      name: 'broker',
      label: 'Broker Name',
      options: {
        filter: false,
        sort: false,
        customHeadLabelRender(info) {
          return (
            <>
              {info.label}
              <hr />
              <TextField
                label={info.label}
                size="small"
                variant="outlined"
                style={{ width: '150px' }}
                value={row[info.name]}
                onChange={(e) =>
                  setRow({ ...row, [info.name]: e.target.value })
                }
              />
            </>
          );
        },
      },
    },
    {
      name: 'details',
      label: 'Payment detail',
      options: {
        filter: false,
        sort: false,
        customHeadLabelRender(info) {
          return (
            <>
              {info.label}
              <hr />
              <TextField
                label={info.label}
                size="small"
                variant="outlined"
                style={{ width: '150px' }}
                value={row[info.name]}
                onChange={(e) =>
                  setRow({ ...row, [info.name]: e.target.value })
                }
              />
            </>
          );
        },
      },
    },
    {
      name: 'action',
      label: 'Edit',
      options: {
        filter: false,
        sort: false,
        customHeadLabelRender(info) {
          return (
            <>
              {info.label}
              <hr />
              <ButtonGroup variant="outlined">
                <IconButton color="success" onClick={handleSaveClick}>
                  <SaveIcon />
                </IconButton>
                <IconButton color="error" onClick={handleClearClick}>
                  <ClearIcon />
                </IconButton>
              </ButtonGroup>
            </>
          );
        },
        customBodyRender(value, info) {
          const cRow = info.tableData[info.rowIndex];
          return (
            <ButtonGroup variant="outlined">
              <IconButton color="success" onClick={() => handleEditClick(cRow)}>
                <EditIcon />
              </IconButton>
              <IconButton color="error" onClick={() => handleDeleteClick(cRow)}>
                <DeleteOutlineIcon />
              </IconButton>
            </ButtonGroup>
          );
        },
      },
    },
  ];
  const options = useMemo(() => {
    return {
      count: data.total,
      filter: false,
      search: false,
      print: false,
      download: false,
      viewColumns: false,
      serverSide: true,
      selectableRows: 'none',
      rowsPerPageOptions: [10, 20, 25, 50, 100],
      onTableInit: (event, info) =>
        drawPage({ page: info.page, limit: info.rowsPerPage }),
      onChangePage: (page) =>
        drawPage({ page, limit: tableRef.current?.state?.rowsPerPage || 10 }),
      onChangeRowsPerPage: (limit) =>
        drawPage({
          page: tableRef.current?.state?.page || 0,
          limit,
        }),
    };
  }, [data, drawPage, tableRef]);
  return (
    <MUIDataTable
      ref={tableRef}
      style={{ overflowX: 'auto' }}
      title={'Buy List'}
      data={data.rows}
      columns={columns}
      options={options}
    />
  );
}
