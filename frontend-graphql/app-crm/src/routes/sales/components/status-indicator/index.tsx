import React, { type FC } from "react";

import { type HttpError, useUpdate } from "@refinedev/core";

import cn from "classnames";

import type { Quote, QuoteUpdateInput } from "@/graphql/schema.types";

import { QUOTES_UPDATE_QUOTE_MUTATION } from "../../quotes/queries";
import styles from "./index.module.css";

interface Props {
  id: string;
  status: Quote["status"];
  style?: React.CSSProperties;
  type?: "quote" | "invoice";
}

export const StatusIndicator: FC<Props> = ({ id, status, style, type = "quote" }) => {
  const { mutate } = useUpdate<Quote, HttpError, QuoteUpdateInput>({
    resource: "quotes",
    id,
    mutationMode: "optimistic",
    invalidates: [],
    meta: {
      gqlMutation: QUOTES_UPDATE_QUOTE_MUTATION,
    },
  });

  const onStatusChange = (newStatus: Quote["status"]) => {
    mutate({
      values: {
        status: newStatus,
      },
    });
  };

  const step = type === "invoice"
    ? { DRAFT: 0, POSTED: 1 }
    : { DRAFT: 0, SENT: 1, ACCEPTED: 2 };

  const currentStep = step[status as keyof typeof step] ?? 0;

  // Màu cho từng trạng thái active
  const stepColors = type === "invoice"
    ? ["#1665d8", "#43a047"] // Draft, Posted
    : ["#1665d8", "#13b4b4", "#43a047"]; // Draft, Sent, Accepted

  return (
    <div style={style}>
      <div
        style={{
          display: "flex",
          position: "relative",
        }}
      >
        <ButtonDraft
          fill={0 <= currentStep ? stepColors[currentStep] : "#fff"}
          textColor={0 <= currentStep ? "#fff" : "#000"}
          onClick={() => onStatusChange("DRAFT")}
        />
        {type === "invoice" ? (
          <ButtonPosted
            fill={1 <= currentStep ? stepColors[currentStep] : "#fff"}
            textColor={1 <= currentStep ? "#fff" : "#000"}
            onClick={() => onStatusChange("POSTED")}
          />
        ) : (
          <>
            <ButtonSent
              fill={1 <= currentStep ? stepColors[currentStep] : "#fff"}
              textColor={1 <= currentStep ? "#fff" : "#000"}
              onClick={() => onStatusChange("SENT")}
            />
            <ButtonAccepted
              fill={2 <= currentStep ? stepColors[currentStep] : "#fff"}
              textColor={2 <= currentStep ? "#fff" : "#000"}
              onClick={() => onStatusChange("ACCEPTED")}
            />
          </>
        )}
      </div>
    </div>
  );
};

const ButtonDraft = (props: {
  fill: string;
  textColor: string;
  onClick: () => void;
}) => (
  <svg
    role="button"
    onClick={() => props.onClick()}
    className={cn(styles.button, styles.first)}
    xmlns="http://www.w3.org/2000/svg"
    width={126}
    height={44}
    fill="none"
  >
    <path
      fill={props.fill}
      stroke="#F0F2F5"
      strokeWidth={2}
      d="M22 1C10.402 1 1 10.402 1 22s9.402 21 21 21h87.735a5 5 0 0 0 4.288-2.428l9.6-16a5 5 0 0 0 0-5.145l-9.6-16A5 5 0 0 0 109.735 1H22Z"
    />
    <text x="42" y="27" fill={props.textColor}>
      Draft
    </text>
  </svg>
);

const ButtonSent = (props: {
  fill: string;
  textColor: string;
  onClick: () => void;
  label?: string;
}) => (
  <svg
    role="button"
    onClick={() => props.onClick()}
    className={cn(styles.button, styles.second)}
    xmlns="http://www.w3.org/2000/svg"
    width={126}
    height={44}
    fill="none"
  >
    <path
      fill={props.fill}
      stroke="#F0F2F5"
      strokeWidth={2}
      d="M2 1H1v42h108.735a5 5 0 0 0 4.288-2.428l9.6-16a5 5 0 0 0 0-5.145l-9.6-16A5 5 0 0 0 109.735 1H2Z"
    />
    <text x="42" y="27" fill={props.textColor}>
      {props.label || "Sent"}
    </text>
  </svg>
);

const ButtonAccepted = (props: {
  fill: string;
  textColor: string;
  onClick: () => void;
}) => (
  <svg
    role="button"
    onClick={() => props.onClick()}
    className={cn(styles.button, styles.third)}
    xmlns="http://www.w3.org/2000/svg"
    width={126}
    height={44}
    fill="none"
  >
    <path
      fill={props.fill}
      stroke="#F0F2F5"
      strokeWidth={2}
      d="M2 1H1v42h103c11.598 0 21-9.402 21-21s-9.402-21-21-21H2Z"
    />
    <text x="28" y="27" fill={props.textColor}>
      Accepted
    </text>
  </svg>
);

const ButtonPosted = (props: {
  fill: string;
  textColor: string;
  onClick: () => void;
}) => (
  <svg
    role="button"
    onClick={() => props.onClick()}
    className={cn(styles.button, styles.third)}
    xmlns="http://www.w3.org/2000/svg"
    width={126}
    height={44}
    fill="none"
  >
    <path
      fill={props.fill}
      stroke="#F0F2F5"
      strokeWidth={2}
      d="M2 1H1v42h103c11.598 0 21-9.402 21-21s-9.402-21-21-21H2Z"
    />
    <text
      x="63" y="25"
      textAnchor="middle"
      fill={props.textColor}
      alignmentBaseline="middle"
      dominantBaseline="middle"
    >
      Posted
    </text>
  </svg>
);
