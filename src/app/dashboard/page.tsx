import { AppSidebar } from "~/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Separator } from "~/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";

export default async function Page() {
  type BoardItem = {
    id: string;
    name: string;
    closed: boolean;
    color: string | null;
    idBoard: string;
    pos: number;
    subscribed: boolean;
    softLimit: unknown;
    type: unknown;
    datasource: object;
  };

  type ApiResponse = {
    boardData: BoardItem[];
  };
  // Doing some vibe coding here...

  // Function to filter board data by names
  const filterFunc = (response: ApiResponse, names: string[]): BoardItem[] => {
    return response.boardData.filter((item) => names.includes(item.name));
  };

  // Fetch board data
  const fetchBoardData = async (): Promise<ApiResponse | undefined> => {
    try {
      const response = await fetch(
        `https://api.trello.com/1/boards/63390b8081b969008b509f36/lists?key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`,
        {
          method: "GET",
          headers: { Accept: "application/json" },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = (await response.json()) as BoardItem[]; // Trello likely returns an array

      return { boardData: data };
    } catch (error) {
      console.error("Error fetching Trello board:", error);
      return undefined;
    }
  };

  // Fetch list data
  const fetchListData = async ({
    listId,
  }: {
    listId: string;
  }): Promise<ApiResponse | undefined> => {
    try {
      const response = await fetch(
        `https://api.trello.com/1/lists/${listId}/cards?key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`,
        {
          method: "GET",
          headers: { Accept: "application/json" },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = (await response.json()) as BoardItem[]; // Assuming Trello API returns an array
      return { boardData: data };
    } catch (error) {
      console.error("Error fetching Trello list:", error);
      return undefined;
    }
  };

  // Fetch and filter data
  await (async () => {
    const boardData = await fetchBoardData();
    if (!boardData) {
      console.log("No board data received.");
      return;
    }
    const filteredListIds = filterFunc(boardData, [
      "Guillotine",
      "Die Cutter",
      "Box Machine",
    ]);
    console.log(filteredListIds);
  })();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">Login</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <h1 className="ml-5 text-2xl font-semibold">At a glance...</h1>
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted" />
            <div className="aspect-video rounded-xl bg-muted" />
            <div className="aspect-video rounded-xl bg-muted" />
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
