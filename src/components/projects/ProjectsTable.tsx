"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  RowData,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"
import { debounce } from "lodash"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { createClient } from "@/lib/supabase/client/client"
import { TABLE_PROJECTS } from "@/lib/supabase/constants"
import { convertToDate } from "@/lib/datetime/utils"
import { ProjectTable, BaseUserData } from "@/lib/supabase/types"

declare module '@tanstack/table-core' {
  interface TableMeta<TData extends RowData> {
    slug: string
  }
}

export const columns: ColumnDef<ProjectTable>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="noShadow"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row, table }) => {
      return (
        <div className="hover:underline">
          <Link href={`/${table.options.meta?.slug}/projects/${row.original.id}`}>{row.getValue("title")}</Link>
        </div>
      )
    },
  },
  {
    accessorKey: "progress",
    header: "Progress",
    cell: ({ row }) => {
      return <div className="capitalize">{row.original.completed_days} / {row.original.target_days} days</div>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="noShadow"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const createdAt = convertToDate(row.getValue("created_at"))
      return <div className="font-base">{createdAt}</div>
    },
  },
  // {
  //   id: "actions",
  //   enableHiding: false,
  //   cell: ({ row }) => {
  //     const payment = row.original

  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="noShadow" className="h-8 w-8 p-0">
  //             <span className="sr-only">Open menu</span>
  //             <MoreHorizontal className="h-4 w-4" />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //           <DropdownMenuItem
  //             onClick={() => navigator.clipboard.writeText(payment.id)}
  //           >
  //             Copy payment ID
  //           </DropdownMenuItem>
  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem>View customer</DropdownMenuItem>
  //           <DropdownMenuItem>View payment details</DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     )
  //   },
  // },
]

export default function ProjectsTable({
  userSetting
}: {
  userSetting: BaseUserData
}) {
  const [data, setData] = useState<ProjectTable[]>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    [],
  )
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [totalCount, setTotalCount] = useState<number | null>(null)
  const [pageIndex, setPageIndex] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [tablePrompt, setTablePrompt] = useState<string>('')
  const pageSize = 10

  const fetchProjects = useCallback(
    debounce(async (      
      page: number = 0,
      column: string = '',
      sortOrder: string = 'desc',
    ) => {
      if (isLoading || (typeof totalCount === 'number' && totalCount <= 1)) return

      try {
        setIsLoading(true)
        const supabase = createClient()

        let query = supabase
          .from(TABLE_PROJECTS)
          .select('id, title, completed_days, target_days, status, created_at')
          .eq('user_id', userSetting.user_id)

        if (column && sortOrder) {
          query = query.order(column, { ascending: sortOrder === 'asc' })
        } else {
          query = query.order('created_at', { ascending: false })
        }

        const start = page * pageSize
        const end = start + pageSize - 1
        query = query.range(start, end)
        
        const { error, data } = await query
        
        if (error) throw error
        if (data) setData(data)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }, 500),
    [userSetting.user_id, totalCount, pageSize, isLoading, setData, setIsLoading]
  )

  const fetchCount = useCallback(async () => {
    try {
      const supabase = createClient()
      const { error, count } = await supabase
      .from(TABLE_PROJECTS)
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userSetting.user_id)

      if (error) throw error
      setTotalCount(count)
    } catch(error) {
      console.error(error)
    }
  }, [userSetting.user_id, setTotalCount])

  const setTableState = useCallback(() => {
    if (isLoading) {
      setTablePrompt('Loading...')
    } else if (data.length === 0) {
      setTablePrompt('No results.')
    } else {
      setTablePrompt('')
    }
  }, [isLoading, data, setTablePrompt])

  // Fetch total count
  useEffect(() => {
    fetchCount()
  }, [])

  // Fetch projects, also handle sorting and pagination
  useEffect(() => {
    if (sorting.length > 0) {
      const { id, desc } = sorting[0]
      fetchProjects(pageIndex, id, desc ? 'desc' : 'asc')
    } else {
      fetchProjects(pageIndex)
    }
  }, [sorting, pageIndex])

  // Set table wordings when loading or no results
  useEffect(() => {
    setTableState()
  }, [isLoading, data])

  const table = useReactTable({
    data,
    meta: {
      slug: userSetting.slug
    },
    columns,
    pageCount: totalCount ? Math.ceil(totalCount / pageSize) : -1,
    state: {
      sorting,
      pagination: {
        pageIndex,
        pageSize,
      }
    },
    manualPagination: true,
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newState = updater({ pageIndex, pageSize })
        setPageIndex(newState.pageIndex)
      }
    },
    manualSorting: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
  })

/*
TODO:
- `filter titles`: change it to search function
*/

  return (
    <div className="w-full font-base text-mtext">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter titles..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="noShadow" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>
      <div className="rounded-md">
        <Table>
          <TableHeader className="font-heading">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {/* {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )} */}
            {tablePrompt ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {tablePrompt}
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-text flex-1 text-sm">
          {totalCount ? `Showing ${pageIndex * pageSize + 1} to ${Math.min((pageIndex + 1) * pageSize, totalCount)} of ${totalCount} projects` : 'Loading...'}
        </div>
        <div className="space-x-2">
          <Button
            variant="noShadow"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={pageIndex === 0}
          >
            Previous
          </Button>
          <Button
            variant="noShadow"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!totalCount || (pageIndex + 1) * pageSize >= totalCount}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}