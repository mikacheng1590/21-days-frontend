"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
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
import { ArrowUpDown } from "lucide-react"
import { debounce } from "lodash"
import { toast } from "react-toastify"
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
import { convertToDate } from "@/lib/datetime/utils"
import { ProjectTable, BaseUserData } from "@/lib/supabase/types"
import { DeleteDialog } from "@/components/projects/DeleteDialog"
import { clientDbService } from "@/lib/supabase/client/db"

declare module '@tanstack/table-core' {
  interface TableMeta<TData extends RowData> {
    slug: TData extends { slug?: string } ? string : string
  }
}

type ExtendedColumnDef<TData extends RowData> = ColumnDef<TData> & {
  isHiddenForVisitors?: boolean
}

export const columns: ExtendedColumnDef<ProjectTable>[] = [
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
    isHiddenForVisitors: true,
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
  userSetting,
  isOwner
}: {
  userSetting: BaseUserData
  isOwner: boolean
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

  const getProjects = useCallback(async (
    column: string = '',
    sortOrder: string = 'desc'
  ) => {
    try {
      const { data, error } = await clientDbService.getProjectsByUserId(userSetting.user_id, pageSize, pageIndex, column, sortOrder)

      if (error) throw error

      return data
    } catch (error) {
      console.error(error)
      return null
    }
  }, [userSetting.user_id, pageSize, pageIndex])

  const debouncedFetchProjects = useMemo(() => {
    return debounce(
      async (
        column: string,
        sortOrder: string
    ) => {
      const data = await getProjects(column, sortOrder)
      return data
    }, 1000)},
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [] // Empty dependency array ensures debounce function remains stable
  )

  const fetchProjects = useCallback(async (
    column: string = '',
    sortOrder: string = 'desc',
    isDebounced: boolean = false
  ) => {
    if (isLoading) return

    try {
      setIsLoading(true)

      let data;
      if (isDebounced) {
        data = await debouncedFetchProjects(column, sortOrder)
      } else {
        data = await getProjects(column, sortOrder)
      }

      if (data) setData(data)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, setIsLoading, debouncedFetchProjects, getProjects, setData])

  const fetchCount = useCallback(async () => {
    try {
      const { data: count, error } = await clientDbService.getProjectCountByUserId(userSetting.user_id)

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

  const handleDelete = useCallback(async () => {
    try {
      setIsLoading(true)

      const projectsToDelete = data.filter((_, idx) => Object.keys(rowSelection).includes(idx.toString())).map((project) => project.id)
      const { error } = await clientDbService.updateProjectStatus(projectsToDelete)

      if (error) throw error

      toast.success('Projects deleted successfully')
      setRowSelection({})
      fetchCount()
      fetchProjects()
    } catch (error) {
      console.error(error)
      toast.error('Failed to delete projects. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }, [setIsLoading, data, rowSelection, setRowSelection, fetchProjects, fetchCount])

  // Fetch total count
  useEffect(() => {
    fetchCount()
  }, [fetchCount])

  // Fetch projects, also handle sorting and pagination
  useEffect(() => {
    if (sorting.length > 0) {
      const { id, desc } = sorting[0]
      fetchProjects(id, desc ? 'desc' : 'asc', true) // Debounce for sorting changes
    } else {
      fetchProjects() // No debounce on first load
    }
  }, [sorting, pageIndex, fetchProjects])
  

  // Set table wordings when loading or no results
  useEffect(() => {
    setTableState()
  }, [isLoading, data, setTableState])

  // useEffect to clean up debounce when component unmounts (prevents memory leaks)
  useEffect(() => {
    return () => {
      debouncedFetchProjects.cancel()
    }
  }, [debouncedFetchProjects])

  const table = useReactTable({
    data,
    meta: {
      slug: userSetting.slug
    },
    columns: !isOwner ? columns.filter((column) => !column.isHiddenForVisitors) : columns,
    pageCount: totalCount ? Math.ceil(totalCount / pageSize) : -1,
    state: {
      sorting,
      pagination: {
        pageIndex,
        pageSize,
      },
      columnFilters,
      columnVisibility,
      rowSelection,
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
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filter titles..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        {isOwner && Object.keys(rowSelection).length > 0 && <DeleteDialog deleteAction={handleDelete} />}
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
          {totalCount ? `Showing ${pageIndex * pageSize + 1} to ${Math.min((pageIndex + 1) * pageSize, totalCount)} of ${totalCount} projects` : totalCount === 0 ? '' : 'Loading...'}
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