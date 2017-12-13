import { Action } from "@ngrx/store";

export const LOAD_COMPONENT = "[Cms] Load Component";
export const LOAD_COMPONENT_FAIL = "[Cms] Load Component Fail";
export const LOAD_COMPONENT_SUCCESS = "[Cms] Load Component Success";
export const GET_COMPONENET_FROM_PAGE = "[Cms] Get Component from Page";

export class LoadComponent implements Action {
  readonly type = LOAD_COMPONENT;
  constructor(public payload: any) {}
}

export class LoadComponentFail implements Action {
  readonly type = LOAD_COMPONENT_FAIL;
  constructor(public payload: any) {}
}

export class LoadComponentSuccess implements Action {
  readonly type = LOAD_COMPONENT_SUCCESS;
  constructor(public payload: any) {}
}

export class GetComponentFromPage implements Action {
  readonly type = GET_COMPONENET_FROM_PAGE;
  constructor(public payload: any) {}
}

// action types
export type ComponentAction =
  | LoadComponent
  | LoadComponentFail
  | LoadComponentSuccess
  | GetComponentFromPage;
