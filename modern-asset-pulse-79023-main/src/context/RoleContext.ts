import { createContext, useContext } from "react";

export type UserRole =
  | "admin"
  | "asset_manager"
  | "procurement_officer"
  | "maintenance_manager"
  | "it_asset_manager"
  | "department_head"
  | "auditor"
  | "finance"
  | "disposal_officer"
  | "employee"
  | "viewer";

export const RoleContext = createContext<UserRole>("viewer");

export const useUserRole = () => useContext(RoleContext);
