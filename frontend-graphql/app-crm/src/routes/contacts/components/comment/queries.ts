import gql from "graphql-tag";

export const CONTACTS_CREATE_CONTACT_NOTE_MUTATION = gql`
    mutation ContactsCreateContactNote($input: CreateNoteInput!) {
        createNote(input: $input) {
            id
            note
            contactId
        }
    }
`;
export const CONTACTS_CONTACT_NOTES_LIST_QUERY = gql`
    query ContactsContactNotesList(
        $filter: NoteFilter!
        $sorting: [NoteSort!]
        $paging: OffsetPaging!
    ) {
        notes(filter: $filter, sorting: $sorting, paging: $paging) {
            totalCount
            nodes {
                id
                note
                createdAt
                createdBy {
                    id
                    name
                    avatarUrl
                }
            }
        }
    }
`;
//delete note
export const CONTACTS_DELETE_CONTACT_NOTE_MUTATION = gql`
    mutation ContactsDeleteContactNote($input: DeleteNoteInput!) {
        deleteNote(input: $input) {
            id
        }
    }
`;
//update note
export const CONTACTS_UPDATE_CONTACT_NOTE_MUTATION = gql`
    mutation ContactsUpdateContactNote($input: UpdateNoteInput!) {
        updateNote(input: $input) {
            id
            note
        }
    }
`;