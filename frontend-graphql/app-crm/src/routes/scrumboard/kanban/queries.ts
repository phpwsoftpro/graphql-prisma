import gql from "graphql-tag";

export const KANBAN_CREATE_STAGE_MUTATION = gql`
    mutation KanbanCreateStage($input: CreateTaskStageInput!) {
        createTaskStage(input: $input) {
            id
            title
            createdAt
        }
    }
`;

export const KANBAN_CREATE_TASK_MUTATION = gql`
    mutation KanbanCreateTask($input: CreateTaskInput!) {
        createTask(input: $input) {
            id
        }
    }
`;

export const KANBAN_UPDATE_STAGE_MUTATION = gql`
    mutation KanbanUpdateStage($input: UpdateTaskStageInput!) {
        updateTaskStage(input: $input) {
            id
            title
        }
    }
`;

export const KANBAN_GET_TASK_QUERY = gql`
    query KanbanGetTask($id: ID!) {
        task(id: $id) {
            id
            title
            completed
            description
            dueDate
            stage {
                id
                title
            }
            users {
                id
                name
                avatarUrl
            }
            checklist {
                title
                checked
            }
        }
    }
`;

export const KANBAN_UPDATE_TASK_MUTATION = gql`
    mutation UpdateTask($input: UpdateTaskInput!) {
        updateTask(input: $input) {
            id
            title
            completed
            description
            dueDate
            stage {
                id
                title
            }
            users {
                id
                name
                avatarUrl
            }
            checklist {
                title
                checked
            }
        }
    }
`;

export const KANBAN_TASK_COMMENTS_QUERY = gql`
    query KanbanTaskComments(
        $filter: CommentFilter!
        $sorting: [CommentSort!]
        $paging: OffsetPaging!
    ) {
        comments(filter: $filter, sorting: $sorting, paging: $paging) {
            nodes {
                id
                comment
                createdAt
                createdBy {
                    id
                    name
                    avatarUrl
                }
            }
            totalCount
        }
    }
`;
//create comment
export const KANBAN_CREATE_COMMENT_MUTATION = gql`
    mutation KanbanCreateComment($input: CreateCommentInput!) {
        createComment(input: $input) {
            id
        }
    }
`;
//update comment
export const KANBAN_UPDATE_COMMENT_MUTATION = gql`
    mutation KanbanUpdateComment($input: UpdateCommentInput!) {
        updateComment(input: $input) {
            id
        }
    }
`;
//delete comment
export const KANBAN_DELETE_COMMENT_MUTATION = gql`
    mutation KanbanDeleteComment($input: DeleteCommentInput!) {
        deleteComment(input: $input)
    }
`;
export const KANBAN_TASK_STAGES_QUERY = gql`
    query KanbanTaskStages(
        $filter: TaskStageFilter!
        $sorting: [TaskStageSort!]
        $paging: OffsetPaging!
    ) {
        taskStages(filter: $filter, sorting: $sorting, paging: $paging) {
            nodes {
                id
                title
            }
            totalCount
        }
    }
`;

export const KANBAN_TASKS_QUERY = gql`
    query KanbanTasks(
        $filter: TaskFilter!
        $sorting: [TaskSort!]
        $paging: OffsetPaging!
    ) {
        tasks(filter: $filter, sorting: $sorting, paging: $paging) {
            nodes {
                id
                title
                description
                dueDate
                completed
                stageId
                checklist {
                    title
                    checked
                }
                users {
                    id
                    name
                    avatarUrl
                }
                comments {
                    totalCount
                }
            }
            totalCount
        }
    }
`;
//delete task
export const KANBAN_DELETE_TASK_MUTATION = gql`
    mutation KanbanDeleteTask($input: DeleteTaskInput!) {
        deleteTask(input: $input) {
            id
        }
    }
`;
//delete task stage
export const KANBAN_DELETE_TASK_STAGE_MUTATION = gql`
    mutation KanbanDeleteTaskStage($input: DeleteTaskStageInput!) {
        deleteTaskStage(input: $input) {
            id
        }
    }
`;
//update task stage