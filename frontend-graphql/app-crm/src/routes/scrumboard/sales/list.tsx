import { type FC, type PropsWithChildren, useMemo } from "react";

import {
  useDelete,
  useList,
  useNavigation,
  useUpdate,
  useUpdateMany,
} from "@refinedev/core";
import type { GetFieldsFromList } from "@refinedev/nestjs-query";

import { ClearOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import type { DragEndEvent } from "@dnd-kit/core";
import type { MenuProps } from "antd";
import type { UniqueIdentifier } from "@dnd-kit/core";

import { Text } from "@/components";
import type { SalesDealsQuery, SalesDealStagesQuery } from "@/graphql/types";
import { currencyNumber } from "@/utilities";

import {
  DealKanbanCardMemo,
  DealKanbanCardSkeleton,
  DealKanbanWonLostDrop,
  KanbanAddCardButton,
  KanbanAddStageButton,
  KanbanBoard,
  KanbanBoardSkeleton,
  KanbanColumn,
  KanbanColumnSkeleton,
  KanbanItem,
} from "../components";
import { SALES_DEAL_STAGES_QUERY, SALES_DEALS_QUERY, SALES_DELETE_DEAL_STAGE_MUTATION, SALES_UPDATE_DEAL_MUTATION } from "./queries";

const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1));

type DealStage = GetFieldsFromList<SalesDealStagesQuery>;

type Deal = GetFieldsFromList<SalesDealsQuery>;

type DealStageColumn = DealStage & {
  deals: Deal[];
};

export const SalesPage: FC<PropsWithChildren> = ({ children }) => {
  const { replace, edit, create } = useNavigation();

  const { data: stages, isLoading: isLoadingStages } = useList<DealStage>({
  resource: "dealStages",
  pagination: { mode: "off" },
  sorters: [
    {
      field: "createdAt",
      order: "asc",
    },
  ],
  meta: {
    gqlQuery: SALES_DEAL_STAGES_QUERY,
    // Custom mapping sorters nếu refine hỗ trợ
    variables: {
      sorting: [
        {
          field: "createdAt",
          direction: "asc", // ép chắc chắn là chữ thường
        },
      ],
    },
  },
});

  const { data: deals, isLoading: isLoadingDeals } = useList<Deal>({
    resource: "deals",

    sorters: [
      {
        field: "createdAt",
        order: "asc",
      },
    ],
    filters: [
      {
        field: "createdAt",
        operator: "gte",
        value: lastMonth,
      },
    ],
    queryOptions: {
      enabled: !!stages,
    },
    pagination: {
      mode: "off",
    },
    meta: {
      gqlQuery: SALES_DEALS_QUERY,
    },
  });
  console.log(deals?.data);
  console.log("Stages data:", stages?.data);
  // its convert Deal[] to DealStage[] (group by stage) for kanban
  // its also group `won` and `lost` stages
  // uses `stages` and `tasks` from useList hooks
  const stageGrouped = useMemo(() => {
    if (!stages?.data || !deals?.data)
      return {
        stageUnassigned: null,
        stageAll: [],
        stageWon: null,
        stageLost: null,
      };
    const stagesData = stages?.data;
    const dealsData = deals?.data;

    const stageUnassigned = dealsData.filter((deal) => deal.stageId === null);
    const grouped = stagesData.map((stage) => {
      return {
        ...stage,
        deals: dealsData
          .filter((deal) => Number(deal.stageId) === Number(stage.id))
          .sort((a, b) => {
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
          }),
      };
    });
    
    const stageWon = grouped.find((stage) => stage.title === "WON");
    const stageLost = grouped.find((stage) => stage.title === "LOST");
    // remove won and lost from grouped
    const stageAll = grouped.filter(
      (stage) => stage.title !== "WON" && stage.title !== "LOST",
    );

    console.log("Grouped:", grouped);
    console.log("stageAll:", stageAll);

    return {
      stageUnassigned,
      stageAll,
      stageWon,
      stageLost,
    };
  }, [stages, deals]);

  const { mutate: updateDeal } = useUpdate({
    resource: "deals",
    successNotification: false,
    mutationMode: "optimistic",
  });
  const { mutate: updateManyDeal } = useUpdateMany({
    resource: "deals",
    successNotification: false,
  });
  const { mutate: deleteStage } = useDelete();

  const { unassignedStageTotalValue } = useMemo(() => {
    let unassignedStageTotalValue = 0;

    stageGrouped?.stageUnassigned?.forEach((deal) => {
      unassignedStageTotalValue += deal.value || 0;
    });

    return {
      unassignedStageTotalValue,
    };
  }, [stageGrouped.stageUnassigned]);

  const handleOnDragEnd = (event: DragEndEvent) => {
    let stageId: UniqueIdentifier | undefined = event.over?.id;
    const dealId = event.active.id;
    const dealStageId = event.active.data.current?.stageId;

    // Nếu stageId là string đặc biệt thì chuyển về id number hoặc null
    if (stageId === 'won') {
      stageId = stageGrouped.stageWon?.id;
    } else if (stageId === 'lost') {
      stageId = stageGrouped?.stageLost?.id;
    } else if (stageId === 'unassigned') {
      stageId = undefined;
    }

    if (dealStageId === stageId) {
      return;
    }

    updateDeal(
      {
        id: dealId,
        values: {
          stageId: stageId,
        },
        meta:{
          gqlMutation: SALES_UPDATE_DEAL_MUTATION
        }
      },
      {
        onSuccess: () => {
          // Kiểm tra nếu vừa chuyển sang won/lost thì mở finalize
          if (
            event.over?.id === 'won' ||
            event.over?.id === 'lost'
          ) {
            edit('finalize-deals', dealId, 'replace');
          }
        },
      },
    );
  };

  const handleAddStage = () => {
    create("dealStages", "replace");
  };

  const handleEditStage = (args: { stageId: number }) => {
    edit("dealStages", args.stageId);
  };

  const handleDeleteStage = (args: { stageId: number }) => {
    deleteStage({
      resource: "dealStage",
      id: Number(args.stageId),
      meta:{
        gqlMutation: SALES_DELETE_DEAL_STAGE_MUTATION
      },
      successNotification: () => ({
        key: "delete-stage",
        type: "success",
        message: "Successfully deleted stage",
        description: "Successful",
      }),
    });
  };

  const handleAddCard = (args: { stageId: number | 'unassigned' }) => {
    const path =
      args.stageId === 'unassigned'
        ? 'create'
        : `create?stageId=${args.stageId}`;
    replace(path);
  };

  const handleClearCards = (args: { dealsIds: number[] }) => {
    updateManyDeal({
      ids: args.dealsIds,
      values: {
        stageId: null,
      },
    });
  };

  const getContextMenuItems = (column: DealStageColumn) => {
    const hasItems = column.deals.length > 0;

    const items: MenuProps["items"] = [
      {
        label: "Edit status",
        key: "1",
        icon: <EditOutlined />,
        onClick: () => handleEditStage({ stageId: column.id }),
      },
      {
        label: "Clear all cards",
        key: "2",
        icon: <ClearOutlined />,
        disabled: !hasItems,
        onClick: () =>
          handleClearCards({
            dealsIds: column.deals.map((deal) => deal.id),
          }),
      },
      {
        danger: true,
        label: "Delete status",
        key: "3",
        icon: <DeleteOutlined />,
        disabled: hasItems,
        onClick: () => handleDeleteStage({ stageId: column.id }),
      },
    ];

    return items;
  };

  const loading = isLoadingStages || isLoadingDeals;

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <>
      <KanbanBoard onDragEnd={handleOnDragEnd}>
        <KanbanColumn
          key={"unassigned"}
          id={"unassigned"}
          title={"unassigned"}
          count={stageGrouped.stageUnassigned?.length || 0}
          description={
            <Text size="md" disabled={unassignedStageTotalValue === 0}>
              {currencyNumber(unassignedStageTotalValue)}
            </Text>
          }
          onAddClick={() => handleAddCard({ stageId: 'unassigned' })}
        >
          {stageGrouped.stageUnassigned?.map((deal) => {
            return (
              <KanbanItem
                key={deal.id.toString()}
                id={deal.id.toString()}
                data={{ ...deal, stageId: 'unassigned' }}
              >
                <DealKanbanCardMemo
                  id={deal.id.toString()}
                  key={deal.id.toString()}
                  title={deal.title}
                  company={{
                    name: deal.company.name,
                    avatarUrl: deal.company.avatarUrl as string,
                  }}
                  user={{ name: deal.dealOwner.name }}
                  date={deal.createdAt}
                  price={currencyNumber(deal.value || 0)}
                />
              </KanbanItem>
            );
          })}
          {!stageGrouped.stageUnassigned?.length && (
            <KanbanAddCardButton
              onClick={() => handleAddCard({ stageId: 'unassigned' })}
            />
          )}
        </KanbanColumn>
        {stageGrouped.stageAll.map((column) => {
          const sum = column.dealsAggregate?.[0]?.sum?.value || 0;
          const contextMenuItems = getContextMenuItems(column);

          return (
            <KanbanColumn
              key={column.id.toString()}
              id={column.id.toString()}
              title={column.title}
              description={
                <Text size="md" disabled={sum === 0}>
                  {currencyNumber(sum)}
                </Text>
              }
              count={column.deals.length}
              contextMenuItems={contextMenuItems}
              onAddClick={() => handleAddCard({ stageId: column.id })}
            >
              {column.deals.map((deal) => {
                return (
                  <KanbanItem
                    key={deal.id.toString()}
                    id={deal.id.toString()}
                    data={{ ...deal, stageId: column.id }}
                  >
                    <DealKanbanCardMemo
                      id={deal.id.toString()}
                      key={deal.id.toString()}
                      title={deal.title}
                      company={{
                        name: deal.company.name,
                        avatarUrl: deal.company.avatarUrl as string,
                      }}
                      user={{
                        name: deal.dealOwner?.name,
                        avatarUrl: deal.dealOwner?.avatarUrl,
                      }}
                      date={deal.createdAt}
                      price={currencyNumber(deal.value || 0)}
                    />
                  </KanbanItem>
                );
              })}
              {!column.deals.length && (
                <KanbanAddCardButton
                  onClick={() => handleAddCard({ stageId: column.id })}
                />
              )}
            </KanbanColumn>
          );
        })}
        <KanbanAddStageButton onClick={handleAddStage} />
        {stageGrouped.stageWon && (
          <KanbanColumn
            key={stageGrouped.stageWon.id.toString()}
            id={stageGrouped.stageWon.id.toString()}
            title={stageGrouped.stageWon.title}
            description={
              <Text
                size="md"
                disabled={
                  stageGrouped.stageWon.dealsAggregate?.[0]?.sum?.value === 0
                }
              >
                {currencyNumber(
                  stageGrouped.stageWon.dealsAggregate?.[0]?.sum?.value || 0,
                )}
              </Text>
            }
            count={stageGrouped.stageWon.deals.length}
            variant="solid"
          >
            {stageGrouped.stageWon.deals.map((deal) => {
              return (
                <KanbanItem
                  key={deal.id.toString()}
                  id={deal.id.toString()}
                  data={{
                    ...deal,
                    stageId: stageGrouped.stageWon?.id,
                  }}
                >
                  <DealKanbanCardMemo
                    id={deal.id.toString()}
                    key={deal.id.toString()}
                    title={deal.title}
                    company={{
                      name: deal.company.name,
                      avatarUrl: deal.company.avatarUrl as string,
                    }}
                    user={{
                      name: deal.dealOwner?.name,
                      avatarUrl: deal.dealOwner?.avatarUrl,
                    }}
                    date={deal.createdAt}
                    price={currencyNumber(deal.value || 0)}
                    variant="won"
                  />
                </KanbanItem>
              );
            })}
          </KanbanColumn>
        )}
        {stageGrouped.stageLost && (
          <KanbanColumn
            key={stageGrouped.stageLost.id.toString()}
            id={stageGrouped.stageLost.id.toString()}
            title={stageGrouped.stageLost.title}
            description={
              <Text
                size="md"
                disabled={
                  stageGrouped.stageLost.dealsAggregate?.[0]?.sum?.value === 0
                }
              >
                {currencyNumber(
                  stageGrouped.stageLost.dealsAggregate?.[0]?.sum?.value || 0,
                )}
              </Text>
            }
            count={stageGrouped.stageLost.deals.length}
            variant="solid"
          >
            {stageGrouped.stageLost.deals.map((deal) => {
              return (
                <KanbanItem
                  key={deal.id.toString()}
                  id={deal.id.toString()}
                  data={{
                    ...deal,
                    stageId: stageGrouped.stageLost?.id,
                  }}
                >
                  <DealKanbanCardMemo
                    id={deal.id.toString()}
                    key={deal.id.toString()}
                    title={deal.title}
                    company={{
                      name: deal.company.name,
                      avatarUrl: deal.company.avatarUrl as string,
                    }}
                    user={{
                      name: deal.dealOwner?.name,
                      avatarUrl: deal.dealOwner?.avatarUrl,
                    }}
                    date={deal.createdAt}
                    price={currencyNumber(deal.value || 0)}
                    variant="lost"
                  />
                </KanbanItem>
              );
            })}
          </KanbanColumn>
        )}
        <DealKanbanWonLostDrop />
      </KanbanBoard>
      {children}
    </>
  );
};

const PageSkeleton = () => {
  const columnCount = 5;
  const itemCount = 4;

  return (
    <KanbanBoardSkeleton>
      {Array.from({ length: columnCount }).map((_, index) => {
        return (
          <KanbanColumnSkeleton key={index} type="deal">
            {Array.from({ length: itemCount }).map((_, index) => {
              return <DealKanbanCardSkeleton key={index} />;
            })}
          </KanbanColumnSkeleton>
        );
      })}
      <KanbanAddStageButton disabled />
      <KanbanColumnSkeleton type="deal" variant="solid">
        {Array.from({ length: itemCount }).map((_, index) => {
          return <DealKanbanCardSkeleton key={index} />;
        })}
      </KanbanColumnSkeleton>
      <KanbanColumnSkeleton type="deal" variant="solid">
        {Array.from({ length: itemCount }).map((_, index) => {
          return <DealKanbanCardSkeleton key={index} />;
        })}
      </KanbanColumnSkeleton>
    </KanbanBoardSkeleton>
  );
};
