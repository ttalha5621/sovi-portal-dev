import React from 'react'
import { clsx } from 'clsx'
import { FiChevronUp, FiChevronDown } from 'react-icons/fi'
import LoadingSpinner from './LoadingSpinner'
import './Table.css'

interface Column<T> {
    key: keyof T
    header: string
    render?: (value: any, row: T) => React.ReactNode
    sortable?: boolean
    width?: string
    align?: 'left' | 'center' | 'right'
}

interface TableProps<T> {
    data: T[]
    columns: Column<T>[]
    loading?: boolean
    emptyMessage?: string
    onRowClick?: (row: T) => void
    sortColumn?: keyof T
    sortDirection?: 'asc' | 'desc'
    onSort?: (column: keyof T) => void
    selectedRow?: T | null
    className?: string
}

const Table = <T extends Record<string, any>>({
    data,
    columns,
    loading = false,
    emptyMessage = 'No data available',
    onRowClick,
    sortColumn,
    sortDirection,
    onSort,
    selectedRow,
    className,
}: TableProps<T>) => {
    const handleRowClick = (row: T) => {
        if (onRowClick) {
            onRowClick(row)
        }
    }

    const handleSort = (column: keyof T) => {
        if (onSort && columns.find(col => col.key === column)?.sortable) {
            onSort(column)
        }
    }

    const renderCell = (column: Column<T>, row: T) => {
        if (column.render) {
            return column.render(row[column.key], row)
        }
        return row[column.key] ?? '—'
    }

    if (loading) {
        return (
            <div className="table-loading">
                <LoadingSpinner size="medium" message="Loading data..." />
            </div>
        )
    }

    if (data.length === 0) {
        return (
            <div className="table-empty">
                <p className="table-empty-message">{emptyMessage}</p>
            </div>
        )
    }

    return (
        <div className="table-container">
            <table className={clsx('table', className)}>
                <thead className="table-header">
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.key as string}
                                className={clsx(
                                    'table-header-cell',
                                    `table-header-align-${column.align || 'left'}`,
                                    {
                                        'table-header-sortable': column.sortable,
                                        'table-header-sorted': sortColumn === column.key,
                                    }
                                )}
                                style={{ width: column.width }}
                                onClick={() => column.sortable && handleSort(column.key)}
                            >
                                <div className="table-header-content">
                                    <span>{column.header}</span>
                                    {column.sortable && (
                                        <div className="table-sort-icons">
                                            <FiChevronUp
                                                className={clsx('table-sort-icon', {
                                                    'table-sort-icon-active':
                                                        sortColumn === column.key && sortDirection === 'asc',
                                                })}
                                            />
                                            <FiChevronDown
                                                className={clsx('table-sort-icon', {
                                                    'table-sort-icon-active':
                                                        sortColumn === column.key && sortDirection === 'desc',
                                                })}
                                            />
                                        </div>
                                    )}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="table-body">
                    {data.map((row, index) => (
                        <tr
                            key={index}
                            className={clsx('table-row', {
                                'table-row-clickable': !!onRowClick,
                                'table-row-selected': selectedRow && selectedRow === row,
                            })}
                            onClick={() => handleRowClick(row)}
                        >
                            {columns.map((column) => (
                                <td
                                    key={`${index}-${column.key as string}`}
                                    className={clsx(
                                        'table-cell',
                                        `table-cell-align-${column.align || 'left'}`
                                    )}
                                >
                                    {renderCell(column, row)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Table