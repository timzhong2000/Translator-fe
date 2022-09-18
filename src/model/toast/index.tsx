import { Alert, AlertColor, SnackbarOrigin } from "@mui/material";
import { isString } from "lodash-es";
import { makeAutoObservable, observable, runInAction } from "mobx";
import { FC } from "react";

type ToastContent = FC;

export interface ToastItem {
  Content: ToastContent;
  type: AlertColor;
  position: SnackbarOrigin;
  createTime: number;
}

const defaultSnackbarOrigin: SnackbarOrigin = {
  vertical: "top",
  horizontal: "right",
};

const toElement = (Content: string | JSX.Element) =>
  isString(Content) ? <span>{Content}</span> : Content;

export class MuiToastModel {
  toastSet: Set<ToastItem> = new Set<ToastItem>();

  constructor() {
    makeAutoObservable(this, { toastSet: observable.deep });
  }

  success(Content: string | JSX.Element, position?: SnackbarOrigin): void {
    this.addToast("success", Content, position);
  }

  info(Content: string | JSX.Element, position?: SnackbarOrigin): void {
    this.addToast("info", Content, position);
  }

  warning(Content: string | JSX.Element, position?: SnackbarOrigin): void {
    this.addToast("warning", Content, position);
  }

  error(Content: string | JSX.Element, position?: SnackbarOrigin): void {
    this.addToast("error", Content, position);
  }

  private addToast(
    type: AlertColor,
    content: string | JSX.Element,
    position: SnackbarOrigin = defaultSnackbarOrigin
  ) {
    const ContentFC = () => (
      <Alert severity="success"> {toElement(content)}</Alert>
    );
    const item: ToastItem = {
      Content: ContentFC,
      position,
      type,
      createTime: Date.now(),
    };
    this.toastSet.add(item);
    setTimeout(() => runInAction(() => this.toastSet.delete(item)), 5000);
  }
}

export const muiToastModel = new MuiToastModel();
