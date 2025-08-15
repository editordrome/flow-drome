
import * as React from "react";
import { cn } from "@/lib/utils";

interface KitTableProps extends React.HTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
}

interface KitTableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

interface KitTableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

interface KitTableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
}

interface KitTableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

interface KitTableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

const KitTable = React.forwardRef<HTMLTableElement, KitTableProps>(
  ({ className, children, ...props }, ref) => (
    <div className="kit-table">
      <table
        ref={ref}
        className={cn("w-full", className)}
        {...props}
      >
        {children}
      </table>
    </div>
  )
);
KitTable.displayName = "KitTable";

const KitTableHeader = React.forwardRef<HTMLTableSectionElement, KitTableHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <thead
      ref={ref}
      className={cn("kit-table-header", className)}
      {...props}
    >
      {children}
    </thead>
  )
);
KitTableHeader.displayName = "KitTableHeader";

const KitTableBody = React.forwardRef<HTMLTableSectionElement, KitTableBodyProps>(
  ({ className, children, ...props }, ref) => (
    <tbody
      ref={ref}
      className={cn("", className)}
      {...props}
    >
      {children}
    </tbody>
  )
);
KitTableBody.displayName = "KitTableBody";

const KitTableRow = React.forwardRef<HTMLTableRowElement, KitTableRowProps>(
  ({ className, children, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn("kit-table-row", className)}
      {...props}
    >
      {children}
    </tr>
  )
);
KitTableRow.displayName = "KitTableRow";

const KitTableHead = React.forwardRef<HTMLTableCellElement, KitTableHeadProps>(
  ({ className, children, ...props }, ref) => (
    <th
      ref={ref}
      className={cn("kit-table-header th", className)}
      {...props}
    >
      {children}
    </th>
  )
);
KitTableHead.displayName = "KitTableHead";

const KitTableCell = React.forwardRef<HTMLTableCellElement, KitTableCellProps>(
  ({ className, children, ...props }, ref) => (
    <td
      ref={ref}
      className={cn("kit-table-cell", className)}
      {...props}
    >
      {children}
    </td>
  )
);
KitTableCell.displayName = "KitTableCell";

export {
  KitTable,
  KitTableHeader,
  KitTableBody,
  KitTableRow,
  KitTableHead,
  KitTableCell,
};
