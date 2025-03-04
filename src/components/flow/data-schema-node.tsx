import { JSX, memo, PropsWithChildren, ReactNode, useCallback } from "react";
import { BaseNode } from "@/components/flow/base-node";
import { Position, useReactFlow } from "@xyflow/react";
import dayjs from 'dayjs';
import { BaseHandle } from "@/components/flow/base-handle.tsx";
import { cn } from "@/shared/utils/cn.utils";
import { ArrowRightSquareIcon, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";


/* DATA SCHEMA NODE HEADER ------------------------------------------------ */
/**
 * A container for the data schema node header.
 */

export const DataSchemaNodeHeader = ({
  children,
}: PropsWithChildren) => {
  return (
    <h2 className="text-sm text-left text-black font-bold leading-tight">
      {children}
    </h2>
  );
};

export const DataSchemaNodeDate = ({ children }: PropsWithChildren) => {
  return (
    <p className="text-[0.5rem] font-medium text-muted-foreground">{children}</p>
  )
}

/* DATA SCHEMA NODE BODY -------------------------------------------------- */
/**
 * A container for the data schema node body that wraps the table.
 */

const DataSchemaNodeBody = ({ children, hidden }: PropsWithChildren & { hidden?: boolean }) => {
  return (
    <div className={cn("grid grid-cols-2 items-start gap-x-1.5 px-2", hidden ? "absolute h-0 overflow-hidden scale-y-0 top-1/2 transform -translate-y-1/2 pointer-events-none select-none" : "")}>
      {children}
    </div>
  )
}

export const DataSchemaNodeTable = ({
  children,
}: PropsWithChildren) => {
  return (
    <div className="grid gap-1.5 pb-1 mt-0.5 mb-2 bg-white rounded">
      {children}
    </div>
  );
};

const DataSchemaNodeTableHead = ({ children }: PropsWithChildren) => {
  return (
    <p className="flex items-center uppercase text-[0.5rem] font-bold mx-1 pt-1 pb-0.5 border-b tracking-tight">
      <ArrowRightSquareIcon className="h-2.5 w-2.5 mr-1" />

      {children}
    </p>
  )
}

/* DATA SCHEMA TABLE ROW -------------------------------------------------- */
/**
 * A wrapper for individual table rows in the data schema node.
 */

export type DataSchemaTableRowProps = {
  children: ReactNode;
  className?: string;
};

export const DataSchemaTableRow = ({
  children,
  className,
}: DataSchemaTableRowProps) => {
  return (
    <div className={cn("flex justify-between gap-4 items-center relative text-[0.5rem]", className)}>
      {children}
    </div>
  );
};

/* DATA SCHEMA TABLE CELL ------------------------------------------------- */
/**
 * A simplified table cell for the data schema node.
 * Renders static content without additional dynamic props.
 */
export type DataSchemaTableCellProps = {
  className?: string;
  children?: ReactNode;
};

export const DataSchemaTableCell = ({
  className,
  children,
}: DataSchemaTableCellProps) => {
  return <div className={className}>{children}</div>;
};

const DataSchemaDetails = ({ children }: PropsWithChildren) => {
  return (
    <p className="col-span-2 text-[0.525rem] pb-2">
      <b>Publication Details title:</b> {children}
    </p>
  );
}

/* DATA SCHEMA NODE ------------------------------------------------------- */
/**
 * The main DataSchemaNode component that wraps the header and body.
 * It maps over the provided schema data to render rows and cells.
 */
export type DataSchemaNodeProps = {
  className?: string;
  style?: React.CSSProperties;
  selected?: boolean;
  children?: ReactNode;
};

export const DataSchemaNode = ({
  className,
  selected,
  children,
  style
}: DataSchemaNodeProps) => {
  return (
    <BaseNode className={cn("relative", className)} selected={selected} style={style}>
      {children}
    </BaseNode>
  );
};

type DataSchemaItem = {
  title: string;
  description: string;
  value: string;
}

export type DataSchemaNodeData = {
  id: string;
  selected?: boolean;
  data: {
    isExpanded?: boolean;
    label: string;
    details?: string;
    lastUpdated: string;
    bgColor: string;
    schema: {
      input: DataSchemaItem[];
      output: DataSchemaItem[];
    };
  };
};

export const DataSchemaNodeMemo = memo(({ data, selected, id }: DataSchemaNodeData): JSX.Element => {
  const formattedDate = dayjs(data.lastUpdated).format("M/DD/YYYY - HH:MM");
  const reactFlow = useReactFlow();

  const toggleExpanded = useCallback(() => {
    reactFlow.updateNodeData(id, {isExpanded: !data.isExpanded})
  }, [data])

  return (
    <DataSchemaNode className="p-0" selected={selected} style={{backgroundColor: data.bgColor}}>
      <div className="relative flex items-start px-2 py-1.5">
        <div className="mr-auto">
          <DataSchemaNodeHeader>{data.label}</DataSchemaNodeHeader>
          <DataSchemaNodeDate>Last updated: {formattedDate}</DataSchemaNodeDate>
        </div>

        <Button variant="ghost" onClick={toggleExpanded} className={cn("ml-4 p-0.75! h-auto! rounded-full", { "bg-main-green-1 hover:bg-main-green-1/80": data.isExpanded, "bg-white": !data.isExpanded })}>
          <ChevronDown className={cn("size-3.5", { "-rotate-90": !data.isExpanded, "stroke-white": data.isExpanded })} />
        </Button>
      </div>

      <DataSchemaNodeBody hidden={!data.isExpanded}>
        <DataSchemaNodeTable>
          <DataSchemaNodeTableHead>Inputs</DataSchemaNodeTableHead>

          {data.schema.input.map((entry) => (
            <DataSchemaTableRow key={entry.title} className="px-1.5">
              <DataSchemaTableCell className="pl-0 font-light w-full">
                <BaseHandle
                  id={entry.title} position={Position.Left} type="target"
                  isConnectable={data.isExpanded}
                />

                <p className="font-bold">{entry.title}</p>
                {entry.description && <p>{entry.description}</p>}
              </DataSchemaTableCell>

              <DataSchemaTableCell className="pr-0 font-thin text-right">
                <p>{entry.value}</p>
              </DataSchemaTableCell>
            </DataSchemaTableRow>
          ))}
        </DataSchemaNodeTable>

        <DataSchemaNodeTable>
          <DataSchemaNodeTableHead>Outputs</DataSchemaNodeTableHead>

          {data.schema.output.map((entry) => (
            <DataSchemaTableRow key={entry.title} className="px-1.5">
              <DataSchemaTableCell className="pl-0 pr-6 font-light w-full">
                <p className="font-bold">{entry.title}</p>
                {entry.description && <p>{entry.description}</p>}
              </DataSchemaTableCell>

              <DataSchemaTableCell className="pr-0 font-thin text-right">
                <p>{entry.value}</p>

                <BaseHandle
                  id={entry.title} position={Position.Right} type="source"
                  isConnectable={data.isExpanded}
                />
              </DataSchemaTableCell>
            </DataSchemaTableRow>
          ))}
        </DataSchemaNodeTable>

        {data.details && <DataSchemaDetails>{data.details}</DataSchemaDetails>}
      </DataSchemaNodeBody>
    </DataSchemaNode>
  )
})
