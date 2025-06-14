import { useSelect } from "@refinedev/antd";
import type { GetFieldsFromList } from "@refinedev/nestjs-query";

import gql from "graphql-tag";

import type { DealStagesSelectQuery } from "@/graphql/types";

const DEAL_STAGES_SELECT_QUERY = gql`
    query DealStagesSelect(
        $filter: DealStageFilter!
        $sorting: [DealStageSort!]
        $paging: OffsetPaging!
    ) {
        dealStages(filter: $filter, sorting: $sorting, paging: $paging) {
            nodes {
                id
                title
            }
        }
    }
`;

export const useDealStagesSelect = (options?: { optionLabel?: "id" | "title" }) => {
  return useSelect<GetFieldsFromList<DealStagesSelectQuery>>({
    resource: "dealStages",
    meta: { gqlQuery: DEAL_STAGES_SELECT_QUERY },
    optionLabel: options?.optionLabel,
  });
};
