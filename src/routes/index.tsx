import { useRouteData } from "solid-start";
import { createServerAction$, createServerData$ } from "solid-start/server";
import { ColumnDef, createSolidTable, getCoreRowModel, flexRender } from "@tanstack/solid-table";
import { For, Show } from "solid-js";

const defaultData = [
    { id: 1, name: "John" },
    { id: 2, name: "Jane" }
];

const defaultColumns: ColumnDef<(typeof defaultData)[0]>[] = [
    { header: "ID", accessorKey: "id" },
    { header: "Name", accessorKey: "name" }
];

export function routeData() {
    return createServerData$(() => defaultData);
}

export default function Home() {
    const data = useRouteData<typeof routeData>();
    const [_, dispatch] = createServerAction$(async () => {
        defaultData.push({ id: 3, name: "Bob" });
    });

    return (
        <main>
            <button onClick={() => dispatch()}>Add Data</button>
            <Show when={data()}>{shownData => <Table columns={defaultColumns} data={shownData()} />}</Show>
        </main>
    );
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

function Table<TData, TValue>(props: DataTableProps<TData, TValue>) {
    const table = createSolidTable({
        get data() {
            return props.data;
        },
        columns: props.columns,
        getCoreRowModel: getCoreRowModel()
    });

    return (
        <div>
            <p>JSON data sent to table: {JSON.stringify(props.data)}</p>
            <table>
                <thead>
                    <For each={table.getHeaderGroups()}>
                        {headerGroup => (
                            <tr>
                                <For each={headerGroup.headers}>
                                    {header => (
                                        <th class={header.isPlaceholder ? "hidden" : ""}>
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    )}
                                </For>
                            </tr>
                        )}
                    </For>
                </thead>
                <tbody>
                    <For each={table.getRowModel().rows}>
                        {row => (
                            <tr>
                                <For each={row.getVisibleCells()}>{cell => <td>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>}</For>
                            </tr>
                        )}
                    </For>
                </tbody>
            </table>
        </div>
    );
}
