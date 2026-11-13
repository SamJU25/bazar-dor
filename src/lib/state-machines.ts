import {
  type DirectionFilter,
  type SortOption,
  filterAndSortProducts,
} from "./products.ts";
import type { IProduct } from "../types/bazar.ts";

/** Explicit lifecycle for single-shot async form submissions and mutations. */
export type AsyncActionState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "redirecting" }
  | { status: "error"; message: string };

export type AsyncActionEvent =
  | { type: "SUBMIT" }
  | { type: "SUCCEED" }
  | { type: "FAIL"; message: string }
  | { type: "RESET" };

/** Advances an async action while blocking duplicate submissions while busy. */
export function asyncActionReducer(
  state: AsyncActionState,
  event: AsyncActionEvent,
): AsyncActionState {
  switch (event.type) {
    case "SUBMIT":
      if (state.status === "submitting" || state.status === "redirecting") {
        return state;
      }
      return { status: "submitting" };
    case "SUCCEED":
      if (state.status !== "submitting") return state;
      return { status: "redirecting" };
    case "FAIL":
      return { status: "error", message: event.message };
    case "RESET":
      return { status: "idle" };
  }
}

export function isActionBusy(state: AsyncActionState): boolean {
  return state.status === "submitting" || state.status === "redirecting";
}

/** Explicit lifecycle for OAuth provider redirect buttons. */
export type OAuthProvider = "google" | "facebook";

export type SocialAuthState =
  | { status: "idle" }
  | { status: "redirecting"; provider: OAuthProvider }
  | { status: "error"; provider: OAuthProvider; message: string };

export type SocialAuthEvent =
  | { type: "START"; provider: OAuthProvider }
  | { type: "FAIL"; provider: OAuthProvider; message: string }
  | { type: "RESET" };

export function socialAuthReducer(
  state: SocialAuthState,
  event: SocialAuthEvent,
): SocialAuthState {
  switch (event.type) {
    case "START":
      if (state.status === "redirecting") return state;
      return { status: "redirecting", provider: event.provider };
    case "FAIL":
      return {
        status: "error",
        provider: event.provider,
        message: event.message,
      };
    case "RESET":
      return { status: "idle" };
  }
}

/** Unified auth gate view state derived from session hook output. */
export type SessionGateState<TUser> =
  | { status: "loading" }
  | { status: "unauthenticated" }
  | { status: "authenticated"; user: TUser };

export function resolveSessionGateState<TUser>(
  isPending: boolean,
  user: TUser | null | undefined,
): SessionGateState<TUser> {
  if (isPending) return { status: "loading" };
  if (!user) return { status: "unauthenticated" };
  return { status: "authenticated", user };
}

/** Explicit catalog filter/search/sort state and transitions. */
export interface CatalogFilterState {
  query: string;
  category: string;
  direction: DirectionFilter;
  sortBy: SortOption;
}

export const INITIAL_CATALOG_FILTER_STATE: CatalogFilterState = {
  query: "",
  category: "all",
  direction: "all",
  sortBy: "default",
};

export type CatalogFilterEvent =
  | { type: "SET_QUERY"; query: string }
  | { type: "SET_CATEGORY"; category: string }
  | { type: "SET_DIRECTION"; direction: DirectionFilter }
  | { type: "SET_SORT"; sortBy: SortOption }
  | { type: "RESET_FILTERS" };

export function catalogFilterReducer(
  state: CatalogFilterState,
  event: CatalogFilterEvent,
): CatalogFilterState {
  switch (event.type) {
    case "SET_QUERY":
      return { ...state, query: event.query };
    case "SET_CATEGORY":
      return { ...state, category: event.category };
    case "SET_DIRECTION":
      return { ...state, direction: event.direction };
    case "SET_SORT":
      return { ...state, sortBy: event.sortBy };
    case "RESET_FILTERS":
      return INITIAL_CATALOG_FILTER_STATE;
  }
}

export type CatalogViewStatus =
  | "upstream-empty"
  | "empty-search"
  | "empty-filtered"
  | "populated";

export interface DerivedCatalogView {
  status: CatalogViewStatus;
  searchMatchedProducts: IProduct[];
  visibleProducts: IProduct[];
  hasActiveFilters: boolean;
}

/** Derives unambiguous catalog UI states so upstream outages and empty filters never collide. */
export function deriveCatalogView(
  products: IProduct[],
  filterState: CatalogFilterState,
): DerivedCatalogView {
  const trimmedQuery = filterState.query.trim();
  const hasActiveFilters =
    trimmedQuery !== "" ||
    filterState.category !== "all" ||
    filterState.direction !== "all" ||
    filterState.sortBy !== "default";

  if (products.length === 0) {
    return {
      status: "upstream-empty",
      searchMatchedProducts: [],
      visibleProducts: [],
      hasActiveFilters,
    };
  }

  const searchMatchedProducts = filterAndSortProducts(products, {
    query: trimmedQuery,
    category: filterState.category,
  });

  if (searchMatchedProducts.length === 0) {
    return {
      status: trimmedQuery ? "empty-search" : "empty-filtered",
      searchMatchedProducts: [],
      visibleProducts: [],
      hasActiveFilters,
    };
  }

  const visibleProducts = filterAndSortProducts(searchMatchedProducts, {
    direction: filterState.direction,
    sortBy: filterState.sortBy,
  });

  return {
    status: visibleProducts.length === 0 ? "empty-filtered" : "populated",
    searchMatchedProducts,
    visibleProducts,
    hasActiveFilters,
  };
}
