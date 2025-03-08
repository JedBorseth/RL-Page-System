import Link from "next/link";
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
  const fetchListData = async ({ listId }: { listId: string }) => {
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

      const data = (await response.json()) as unknown;
      return data;
    } catch (error) {
      console.error("Error fetching Trello list:", error);
      return undefined;
    }
  };

  // Fetch and filter data
  const lists = await (async () => {
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
    return filteredListIds;
  })();

  const fetchCards = async (num: number) => {
    if (!lists?.[num]) {
      console.log("No lists to fetch cards from.");
      return [];
    }
    const cardsPromises = [fetchListData({ listId: lists[num].id })];
    const cards = await Promise.all(cardsPromises);
    return cards[0] as Array<{ id: string; name: string }>;
  };
  const guillotineCards = await fetchCards(0);
  const dieCutCards = await fetchCards(1);
  const boxMachineCards = await fetchCards(2);

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
          <h1 className="ml-5 text-2xl font-semibold">
            These numbers are from the{" "}
            <Link
              href="https://trello.com/b/ygNgDkLo/production"
              className="text-secondary-foreground underline hover:text-opacity-10"
            >
              Production
            </Link>{" "}
            Trello board
          </h1>
          <h2>Guillotine - ({guillotineCards.length})</h2>
          <h2>Die Cutter - ({dieCutCards.length})</h2>
          <h2>Box Machine - ({boxMachineCards.length})</h2>
          {/* <div className="flex flex-col gap-2">
            {guillotineCards?.map((card) => <h3 key={card.id}>{card.name}</h3>)}
          </div> */}
          <div className="aspect-video rounded-xl bg-muted" />
        </div>
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
      </SidebarInset>
    </SidebarProvider>
  );
}
