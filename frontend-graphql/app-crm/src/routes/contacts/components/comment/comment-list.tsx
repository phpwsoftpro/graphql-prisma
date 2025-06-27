import { DeleteButton, useForm } from "@refinedev/antd";
import {
  type HttpError,
  useGetIdentity,
  useInvalidate,
  useList,
  useParsed,
} from "@refinedev/core";
import type { GetFieldsFromList } from "@refinedev/nestjs-query";

import { Button, Form, Input, Space, Typography } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";

import { CustomAvatar, Text } from "@/components";
import type { User } from "@/graphql/schema.types";
import type { ContactsContactNotesListQuery } from "@/graphql/types";

import {
  CONTACTS_CONTACT_NOTES_LIST_QUERY,
  CONTACTS_DELETE_CONTACT_NOTE_MUTATION,
    CONTACTS_UPDATE_CONTACT_NOTE_MUTATION,
} from "./queries";
import { useParams } from "react-router-dom";

type ContactNote = GetFieldsFromList<ContactsContactNotesListQuery>;

const ContactCommentListItem = ({ item }: { item: ContactNote }) => {
  const invalidate = useInvalidate();
  const { formProps, setId, id, saveButtonProps } = useForm<
    ContactNote,
    HttpError,
    ContactNote
  >({
    resource: "notes",
    action: "edit",
    queryOptions: {
      enabled: false,
    },
    mutationMode: "optimistic",
    onMutationSuccess: () => {
      setId(undefined);
      invalidate({
        invalidates: ["list"],
        resource: "notes",
      });
    },
    successNotification: () => ({
      key: "contact-note",
      message: "Successfully updated note",
      description: "Successful",
      type: "success",
    }),
    meta: {
      gqlMutation: CONTACTS_UPDATE_CONTACT_NOTE_MUTATION,
    },
  });
  const { data: me } = useGetIdentity<User>();

  const isMe = me?.id == item?.createdBy?.id;

  useEffect(() => {
    if (id == item.id) {
      formProps.form?.setFieldsValue({ note: item.note });
    }
  }, [id, item.id, item.note, formProps.form]);

  return (
    <div style={{ display: "flex", gap: "12px" }}>
      <CustomAvatar
        style={{ flexShrink: 0 }}
        name={item?.createdBy?.name}
        src={item?.createdBy?.avatarUrl}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ fontWeight: 500 }}>{item?.createdBy?.name}</Text>
          <Text size="xs" style={{ color: "#000000a6" }}>
            {dayjs(item?.createdAt).format("MMMM D, YYYY - h:ma")}
          </Text>
        </div>

        {id == item.id ? (
          <Form {...formProps}>
            <Form.Item
              name="note"
              rules={[
                {
                  required: true,
                  transform(value) {
                    return value?.trim();
                  },
                  message: "Please enter a note",
                },
              ]}
            >
              <Input.TextArea
                autoFocus
                style={{
                  backgroundColor: "#fff",
                  width: "100%",
                }}
              />
            </Form.Item>
          </Form>
        ) : (
          <Typography.Paragraph
            style={{
              background: "#fff",
              borderRadius: "6px",
              padding: "8px",
              marginBottom: 0,
            }}
            ellipsis={{ rows: 3, expandable: true }}
          >
            {item.note}
          </Typography.Paragraph>
        )}

        {isMe && !id && (
          <Space size={16}>
            <Typography.Link
              style={{ color: "inherit", fontSize: "12px" }}
              onClick={() => setId(Number(item.id))}
            >
              Edit
            </Typography.Link>
            <DeleteButton
              recordItemId={Number(item.id)}
              resource="notes"
              size="small"
              type="link"
              successNotification={() => ({
                key: "contact-delete-note",
                message: "Successfully deleted note",
                description: "Successful",
                type: "success",
              })}
              meta={{
                gqlMutation: CONTACTS_DELETE_CONTACT_NOTE_MUTATION,
              }}
              icon={null}
              style={{
                padding: 0,
                fontSize: "12px",
                color: "inherit",
              }}
            />
          </Space>
        )}

        {id && (
          <Space>
            <Button size="small" onClick={() => setId(undefined)}>
              Cancel
            </Button>
            <Button size="small" type="primary" {...saveButtonProps}>
              Save
            </Button>
          </Space>
        )}
      </div>
    </div>
  );
};

export const ContactCommentList = () => {
  const { id } = useParsed();
  const params = useParams();
const { data } = useList<ContactNote>({
  resource: "notes",
    sorters: [
      {
        field: "updatedAt",
        order: "desc",
      },
    ],
    filters: [{ field: "contact.id", operator: "eq", value: Number(params.id )}],
  meta: {
    gqlQuery: CONTACTS_CONTACT_NOTES_LIST_QUERY,
    
  }
  });
  
  return (
    <Space
      size={16}
      direction="vertical"
      style={{
        backgroundColor: "#FAFAFA",
        padding: "1rem",
        width: "100%",
      }}
    >
      {data?.data?.map((item: ContactNote) => (
        <ContactCommentListItem key={item.id} item={item} />
      ))}
    </Space>
  );
};
